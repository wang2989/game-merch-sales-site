"""
Flow
  1. validate the request
  2. SYNC  -> inventory service, one GET /items/{id} per line item (stock check)
  3. SYNC  -> payment service, POST /payment (returns a payment token)
  4. save the order in the storefront DB (payment TOKEN only, never card details)
  5. ASYNC -> put an "OrderPlaced" event on EventBridge; the shipping service reacts to it
"""
import json
import os
import urllib.error
import urllib.request

import boto3
import pymysql

HEADERS = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
}
PAYMENT_FIELDS = ["cardNumber", "expirationDate", "cvvCode", "cardHolderName"]
SHIPPING_FIELDS = ["name", "addressLine1", "city", "state", "zip"]
ITEM_WEIGHT_LBS = 1.0  # fixed weight per unit for now (lab allows hard-coding)

_connection = None
_events = None


class OutOfStock(Exception):
    def __init__(self, item_number):
        self.item_number = item_number


class PaymentDeclined(Exception):
    def __init__(self, reasons):
        self.reasons = reasons


def respond(status, body):
    return {"statusCode": status, "headers": HEADERS, "body": json.dumps(body)}


# ---------- database ----------
def connect():
    return pymysql.connect(
        host=os.environ["DB_HOST"], user=os.environ["DB_USER"],
        password=os.environ["DB_PASSWORD"], database=os.environ["DB_NAME"],
        port=int(os.environ.get("DB_PORT", 3306)), connect_timeout=5,
        autocommit=False)  # commit/rollback ourselves so an order is all-or-nothing


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


def save_order(shipping, email, lines, payment_token):
    """One transaction: shipping info, order (with payment token), line items, stock decrement."""
    conn = get_connection()
    try:
        with conn.cursor() as cur:
            cur.execute(
                "INSERT INTO SHIPPING_INFO (ADDRESS1, ADDRESS2, CITY, STATE, COUNTRY, POSTAL_CODE, EMAIL) "
                "VALUES (%s,%s,%s,%s,%s,%s,%s)",
                (shipping["addressLine1"], shipping.get("addressLine2") or None, shipping["city"],
                 shipping["state"], shipping.get("country") or "USA", shipping["zip"], email))
            shipping_id = cur.lastrowid
            cur.execute(
                "INSERT INTO CUSTOMER_ORDER (CUSTOMER_NAME, CUSTOMER_EMAIL, SHIPPING_INFO_ID_FK, "
                "PAYMENT_TOKEN, STATUS) VALUES (%s,%s,%s,%s,%s)",
                (shipping["name"], email, shipping_id, payment_token, "New"))
            order_id = cur.lastrowid
            for line in lines:
                # succeeds only if enough stock is STILL there (two orders at once can't oversell)
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


# ---------- synchronous calls to other services ----------
def http_json(url, payload=None, timeout=8):
    data = json.dumps(payload).encode() if payload is not None else None
    req = urllib.request.Request(url, data=data, headers={"Content-Type": "application/json"},
                                 method="POST" if payload is not None else "GET")
    try:
        with urllib.request.urlopen(req, timeout=timeout) as r:
            return r.status, json.loads(r.read() or b"{}")
    except urllib.error.HTTPError as e:  # 4xx/5xx still carry a JSON body we want to read
        try:
            return e.code, json.loads(e.read() or b"{}")
        except Exception:
            return e.code, {}


def fetch_item(item_number):
    """Inventory service: GET /inventory/items/{id}. Returns None if the item doesn't exist."""
    status, body = http_json(f"{os.environ['INVENTORY_URL'].rstrip('/')}/items/{item_number}")
    if status == 404:
        return None
    if status != 200:
        raise RuntimeError(f"Inventory service returned {status}")
    return body


def charge(payment, amount):
    """Payment service: POST /payment. Returns the payment token."""
    status, body = http_json(os.environ["PAYMENT_URL"], {
        "cardNumber": payment["cardNumber"], "expirationDate": payment["expirationDate"],
        "cvvCode": payment["cvvCode"], "cardHolderName": payment["cardHolderName"], "amount": amount})
    if status == 201 and body.get("token"):
        return body["token"]
    if status == 400:
        raise PaymentDeclined(body.get("reasons") or [])
    raise RuntimeError(f"Payment service returned {status}")


# ---------- asynchronous integration ----------
def build_shipment(order_ref, shipping, lines):
    """Each line item becomes ONE packet; its weight = quantity x fixed per-unit weight."""
    return {
        "businessId": os.environ.get("BUSINESS_ID", "RELICPLAZA-REG-0001"),
        "orderRef": order_ref,
        "shipmentAddress": {
            "name": shipping["name"], "addressLine1": shipping["addressLine1"],
            "addressLine2": shipping.get("addressLine2") or "", "city": shipping["city"],
            "state": shipping["state"], "zip": shipping["zip"], "country": shipping.get("country") or "USA"},
        "numberOfPackets": len(lines),
        "packets": [{"packetNumber": i, "itemNumber": l["item_number"], "description": l["name"],
                     "quantity": l["quantity"], "weightLbs": round(l["quantity"] * ITEM_WEIGHT_LBS, 2)}
                    for i, l in enumerate(lines, 1)],
    }


def publish_order_placed(detail):
    """Fire-and-forget: put the event on EventBridge. The shipping service picks it up via a rule."""
    global _events
    if _events is None:
        _events = boto3.client("events")
    resp = _events.put_events(Entries=[{
        "Source": "relicplaza.orders", "DetailType": "OrderPlaced",
        "Detail": json.dumps(detail), "EventBusName": "default"}])
    if resp.get("FailedEntryCount"):
        raise RuntimeError(f"EventBridge rejected the event: {resp['Entries']}")


# ---------- handler ----------
def lambda_handler(event, context):
    if event.get("httpMethod") == "OPTIONS":
        return respond(200, {})

    try:
        order = json.loads((event.get("body") or "{}").replace("\u00a0", " "))
    except (json.JSONDecodeError, TypeError):
        return respond(400, {"error": "Body must be valid JSON"})

    items = order.get("items")
    payment = {k: str(v).strip() for k, v in (order.get("payment") or {}).items() if v is not None}
    shipping = {k: str(v).strip() for k, v in (order.get("shipping") or {}).items() if v is not None}

    # 1. validation
    if not isinstance(items, list) or not items:
        return respond(400, {"error": "Order must contain at least one item"})
    wanted = {}  # item number -> total quantity (same item listed twice is added up)
    for line in items:
        qty = line.get("quantity") if isinstance(line, dict) else None
        if not isinstance(qty, int) or isinstance(qty, bool) or qty < 1:
            return respond(400, {"error": "Item quantity must be a positive integer"})
        try:
            wanted[int(str(line.get("id")))] = wanted.get(int(str(line.get("id"))), 0) + qty
        except ValueError:
            return respond(400, {"error": "Each item needs a numeric id", "id": line.get("id")})
    missing = [f for f in PAYMENT_FIELDS if not payment.get(f)] + \
              [f for f in SHIPPING_FIELDS if not shipping.get(f)]
    if missing:
        return respond(400, {"error": "Missing fields", "fields": missing})

    # 2. SYNC: ask the inventory service about every line item
    problems, lines, total = [], [], 0.0
    try:
        for item_number, qty in wanted.items():
            item = fetch_item(item_number)
            if item is None:
                problems.append({"id": item_number, "reason": "unknown_item"})
            elif qty > item["stock"]:
                problems.append({"id": item_number, "name": item["name"], "requested": qty,
                                 "available": item["stock"], "reason": "insufficient_stock"})
            else:
                total += float(item["price"]) * qty  # price comes from the server, not the browser
                lines.append({"item_number": item_number, "name": item["name"], "quantity": qty})
    except Exception as e:
        print("Inventory lookup failed:", repr(e))
        return respond(502, {"error": "Inventory service unavailable"})
    if problems:
        return respond(409, {"error": "Some items are not available", "problems": problems})
    total = round(total, 2)

    # 3. SYNC: payment, only after the stock check passed
    try:
        payment_token = charge(payment, total)
    except PaymentDeclined as e:
        return respond(402, {"error": "Payment declined", "reasons": e.reasons})
    except Exception as e:
        print("Payment call failed:", repr(e))
        return respond(502, {"error": "Payment service unavailable"})

    # 4. save the order with the payment TOKEN (no card details are stored here)
    email = order.get("customerEmail") or order.get("email") or shipping.get("email") or None
    try:
        order_id = save_order(shipping, email, lines, payment_token)
    except OutOfStock as e:
        # known gap: the payment was already approved; a real system would void/refund it
        print("Out of stock after payment, needs refund. payment token:", payment_token)
        return respond(409, {"error": "Some items are not available",
                             "problems": [{"id": e.item_number, "reason": "insufficient_stock"}]})
    except Exception as e:
        print("Saving order failed after payment", payment_token, repr(e))
        return respond(500, {"error": "Could not save the order"})

    confirmation_number = f"RP-{order_id:06d}"

    # 5. ASYNC: tell the shipping service. A failure here must not undo a paid, saved order.
    try:
        publish_order_placed(build_shipment(confirmation_number, shipping, lines))
    except Exception as e:
        print("Could not publish shipment event for", confirmation_number, repr(e))

    return respond(201, {"confirmationNumber": confirmation_number, "orderId": order_id, "total": total})
