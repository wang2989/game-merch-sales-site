import json
import os
import uuid

import pymysql

HEADERS = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST,OPTIONS",
}
ADDRESS_FIELDS = ["name", "addressLine1", "city", "state", "zip"]
_conn = None


def respond(status, body):
    return {"statusCode": status, "headers": HEADERS, "body": json.dumps(body)}


def connect():
    return pymysql.connect(
        host=os.environ["SHIP_DB_HOST"], user=os.environ["SHIP_DB_USER"],
        password=os.environ["SHIP_DB_PASSWORD"], database=os.environ["SHIP_DB_NAME"],
        connect_timeout=5, autocommit=False)


def get_conn():
    global _conn
    if _conn is None:
        _conn = connect()
    else:
        try:
            _conn.ping(reconnect=True)
        except Exception:
            _conn = connect()
    return _conn


def validate(s):
    errors = []
    if not str(s.get("businessId", "")).strip():
        errors.append("businessId is required")
    if not str(s.get("orderRef", "")).strip():
        errors.append("orderRef is required")
    addr = s.get("shipmentAddress") or {}
    errors += [f"shipmentAddress.{f} is required" for f in ADDRESS_FIELDS if not str(addr.get(f, "")).strip()]
    packets = s.get("packets")
    if not isinstance(packets, list) or not packets:
        errors.append("packets must be a non-empty list")
    else:
        for i, pk in enumerate(packets, 1):
            try:
                if float(pk.get("weightLbs")) <= 0:
                    raise ValueError
            except (TypeError, ValueError, AttributeError):
                errors.append(f"packet {i} needs a weightLbs greater than 0")
        if s.get("numberOfPackets") not in (None, len(packets)):
            errors.append("numberOfPackets does not match the packets list")
    return errors


def save_shipment(s):
    """Returns (token, created). A repeat of the same businessId+orderRef returns the first token."""
    conn = get_conn()
    addr, packets = s["shipmentAddress"], s["packets"]
    try:
        with conn.cursor() as cur:
            cur.execute("SELECT TOKEN FROM SHIPMENT WHERE BUSINESS_ID=%s AND ORDER_REF=%s",
                        (s["businessId"], s["orderRef"]))
            row = cur.fetchone()
            if row:  # EventBridge can deliver the same event twice
                conn.commit()
                return row[0], False
            token = "SHP-" + uuid.uuid4().hex[:10].upper()
            cur.execute(
                "INSERT INTO SHIPMENT (TOKEN, BUSINESS_ID, ORDER_REF, RECIPIENT_NAME, ADDRESS1, ADDRESS2, "
                "CITY, STATE, POSTAL_CODE, COUNTRY, NUMBER_OF_PACKETS) VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)",
                (token, s["businessId"], s["orderRef"], addr["name"], addr["addressLine1"],
                 addr.get("addressLine2") or None, addr["city"], addr["state"], addr["zip"],
                 addr.get("country") or "USA", len(packets)))
            shipment_id = cur.lastrowid
            for i, pk in enumerate(packets, 1):
                cur.execute(
                    "INSERT INTO SHIPMENT_PACKET (SHIPMENT_ID_FK, PACKET_NUMBER, DESCRIPTION, WEIGHT_LBS) "
                    "VALUES (%s,%s,%s,%s)",
                    (shipment_id, pk.get("packetNumber", i), pk.get("description"), float(pk["weightLbs"])))
        conn.commit()
        return token, True
    except Exception:
        conn.rollback()
        raise


def lambda_handler(event, context):
    from_eventbridge = "detail" in event and "requestContext" not in event
    if from_eventbridge:
        shipment = event["detail"]
    else:
        if event.get("httpMethod") == "OPTIONS":
            return respond(200, {})
        try:
            shipment = json.loads((event.get("body") or "{}").replace("\u00a0", " "))
        except (json.JSONDecodeError, TypeError):
            return respond(400, {"error": "Body must be valid JSON"})

    errors = validate(shipment)
    if errors:
        print("Invalid shipment:", errors)
        if from_eventbridge:
            return {"status": "rejected", "errors": errors}  # retrying a bad message won't help
        return respond(400, {"error": "Invalid shipment", "details": errors})

    try:
        token, created = save_shipment(shipment)
    except Exception as e:
        print("Shipment DB error:", repr(e))
        if from_eventbridge:
            raise  # lets Lambda/EventBridge retry the event
        return respond(500, {"error": "Could not save shipment"})

    print("Shipment", token, "created" if created else "already existed", "for", shipment["orderRef"])
    if from_eventbridge:
        return {"status": "ok", "token": token}
    return respond(201 if created else 200, {"token": token, "numberOfPackets": len(shipment["packets"])})
