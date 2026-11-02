"""Lambda: order-processing   (POST /order-processing/order)
Environment variables (set in Lambda -> Configuration -> Environment variables, NOT in code):
  INVENTORY_URL = https://<api-id>.execute-api.<region>.amazonaws.com/<stage>/inventory-management/inventory
  DB_HOST, DB_USER, DB_PASSWORD, DB_NAME, DB_PORT (optional, default 3306)
"""
import json
import os
import urllib.request

import pymysql

HEADERS = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
}
PAYMENT_FIELDS = ["cardNumber", "expirationDate", "cvvCode", "cardHolderName"]
SHIPPING_FIELDS = ["name", "addressLine1", "city", "state", "zip"]

_connection = None


class OutOfStock(Exception):
    def __init__(self, item_number):
        self.item_number = item_number


def respond(status, body):
    return {"statusCode": status, "headers": HEADERS, "body": json.dumps(body)}


def connect():
    # No default values: credentials come only from environment variables.
    return pymysql.connect(
        host=os.environ["DB_HOST"],
        user=os.environ["DB_USER"],
        password=os.environ["DB_PASSWORD"],
        database=os.environ["DB_NAME"],
        port=int(os.environ.get("DB_PORT", 3306)),
        connect_timeout=5,
        autocommit=False,  # we commit/rollback ourselves so an order is all-or-nothing
    )


def get_connection():
    global _connection
    if _connection is not None:
        try:
            _connection.ping(reconnect=True)
            return _connection
        except Exception:
            _connection = None
    _connection = connect()
    return _connection


def get_inventory():
    """Ask the inventory microservice what the warehouse has, keyed by item number."""
    with urllib.request.urlopen(os.environ["INVENTORY_URL"], timeout=5) as r:
        return {int(i["id"]): i for i in json.loads(r.read())}


def save_order(payment, shipping, email, lines):
    """Insert everything in ONE transaction; returns the new CUSTOMER_ORDER id."""
    full = os.environ.get("STORE_FULL_CARD", "false").lower() == "true"
    card = payment["cardNumber"]
    if not full:
        card = "*" * max(len(card) - 4, 0) + card[-4:]
    cvv = payment["cvvCode"] if full else None

    conn = get_connection()
    try:
        with conn.cursor() as cur:
            cur.execute(
                "INSERT INTO PAYMENT_INFO (HOLDER_NAME, CARD_NUM, EXP_DATE, CVV) VALUES (%s,%s,%s,%s)",
                (payment["cardHolderName"], card, payment["expirationDate"], cvv))
            payment_id = cur.lastrowid

            cur.execute(
                "INSERT INTO SHIPPING_INFO (ADDRESS1, ADDRESS2, CITY, STATE, COUNTRY, POSTAL_CODE, EMAIL) "
                "VALUES (%s,%s,%s,%s,%s,%s,%s)",
                (shipping["addressLine1"], shipping.get("addressLine2") or None, shipping["city"],
                 shipping["state"], shipping.get("country") or "USA", shipping["zip"], email))
            shipping_id = cur.lastrowid

            cur.execute(
                "INSERT INTO CUSTOMER_ORDER (CUSTOMER_NAME, CUSTOMER_EMAIL, SHIPPING_INFO_ID_FK, "
                "PAYMENT_INFO_ID_FK, STATUS) VALUES (%s,%s,%s,%s,%s)",
                (shipping["name"], email, shipping_id, payment_id, "New"))
            order_id = cur.lastrowid

            for line in lines:
                # Only succeeds if enough stock is STILL there (two orders at once can't oversell)
                cur.execute(
                    "UPDATE ITEM SET AVAILABLE_QUANTITY = AVAILABLE_QUANTITY - %s "
                    "WHERE ITEM_NUMBER = %s AND AVAILABLE_QUANTITY >= %s",
                    (line["quantity"], line["item_number"], line["quantity"]))
                if cur.rowcount == 0:
                    raise OutOfStock(line["item_number"])
                cur.execute(
                    "INSERT INTO CUSTOMER_ORDER_LINE_ITEM (ITEM_NUMBER, ITEM_NAME, QUANTITY, "
                    "CUSTOMER_ORDER_ID_FK) VALUES (%s,%s,%s,%s)",
                    (line["item_number"], line["name"], line["quantity"], order_id))
        conn.commit()
        return order_id
    except Exception:
        conn.rollback()
        raise


def lambda_handler(event, context):
    if event.get("httpMethod") == "OPTIONS":
        return respond(200, {})

    raw = (event.get("body") or "{}").replace("\u00a0", " ")
    try:
        order = json.loads(raw)
    except (json.JSONDecodeError, TypeError):
        return respond(400, {"error": "Body must be valid JSON"})

    items = order.get("items")
    # Accept numbers or strings; store everything as trimmed strings
    payment = {k: str(v).strip() for k, v in (order.get("payment") or {}).items() if v is not None}
    shipping = {k: str(v).strip() for k, v in (order.get("shipping") or {}).items() if v is not None}

    # 1. Basic validation
    if not isinstance(items, list) or not items:
        return respond(400, {"error": "Order must contain at least one item"})
    for line in items:
        if not isinstance(line, dict) or "id" not in line:
            return respond(400, {"error": "Each item must have an id"})
        qty = line.get("quantity")
        if not isinstance(qty, int) or isinstance(qty, bool) or qty < 1:
            return respond(400, {"error": "Item quantity must be a positive integer", "id": line.get("id")})
    missing = [f for f in PAYMENT_FIELDS if not payment.get(f)] + \
              [f for f in SHIPPING_FIELDS if not shipping.get(f)]
    if missing:
        return respond(400, {"error": "Missing fields", "fields": missing})

    # 2. Check stock against the inventory service
    try:
        inventory = get_inventory()
    except Exception as e:
        print("Inventory lookup failed:", repr(e))
        return respond(502, {"error": "Inventory service unavailable"})

    problems, lines, total = [], [], 0.0
    for line in items:
        try:
            item_number = int(str(line["id"]))
        except ValueError:
            problems.append({"id": line["id"], "reason": "unknown_item"})
            continue
        item, qty = inventory.get(item_number), line["quantity"]
        if item is None:
            problems.append({"id": item_number, "reason": "unknown_item"})
        elif qty > item["stock"]:
            problems.append({"id": item_number, "name": item["name"], "requested": qty,
                             "available": item["stock"], "reason": "insufficient_stock"})
        else:
            total += float(item["price"]) * qty  # price comes from the server, not the browser
            lines.append({"item_number": item_number, "name": item["name"], "quantity": qty})

    # 3. Error code if anything isn't available
    if problems:
        return respond(409, {"error": "Some items are not available", "problems": problems})

    # 4. Save everything in RDS
    email = order.get("customerEmail") or order.get("email") or shipping.get("email") or None
    try:
        order_id = save_order(payment, shipping, email, lines)
    except OutOfStock as e:
        return respond(409, {"error": "Some items are not available",
                             "problems": [{"id": e.item_number, "reason": "insufficient_stock"}]})
    except Exception as e:
        print("Saving order failed:", repr(e))  # detail stays in CloudWatch
        return respond(500, {"error": "Could not save the order"})

    # 5. Success: the confirmation number comes from the saved order's ID, so it can be looked up
    return respond(201, {
        "confirmationNumber": f"RP-{order_id:06d}",
        "orderId": order_id,
        "total": round(total, 2),
    })
