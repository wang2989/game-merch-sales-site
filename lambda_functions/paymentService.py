import json
import os
import re
import uuid
from datetime import datetime, timezone

import pymysql

HEADERS = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST,OPTIONS",
}
_conn = None


def respond(status, body):
    return {"statusCode": status, "headers": HEADERS, "body": json.dumps(body)}


def connect():
    return pymysql.connect(
        host=os.environ["PAY_DB_HOST"], user=os.environ["PAY_DB_USER"],
        password=os.environ["PAY_DB_PASSWORD"], database=os.environ["PAY_DB_NAME"],
        connect_timeout=5, autocommit=True)


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


def check_payment(p):
    """Very simple 'bank' rules. Returns a list of reasons the payment is declined."""
    reasons = []
    card = re.sub(r"\s", "", str(p.get("cardNumber", "")))
    if not re.fullmatch(r"\d{16}", card):
        reasons.append("Card number must be 16 digits")
    if not re.fullmatch(r"\d{3}", str(p.get("cvvCode", ""))):
        reasons.append("CVV must be 3 digits")
    if not str(p.get("cardHolderName", "")).strip():
        reasons.append("Card holder name is required")
    m = re.fullmatch(r"(\d{2})/(\d{2})", str(p.get("expirationDate", "")))
    if not m or not 1 <= int(m.group(1)) <= 12:
        reasons.append("Expiration date must be MM/YY")
    else:
        now = datetime.now(timezone.utc)
        if (2000 + int(m.group(2)), int(m.group(1))) < (now.year, now.month):
            reasons.append("Card is expired")
    try:
        if float(p.get("amount")) <= 0:
            reasons.append("Amount must be greater than zero")
    except (TypeError, ValueError):
        reasons.append("Amount is required")
    return reasons


def lambda_handler(event, context):
    if event.get("httpMethod") == "OPTIONS":
        return respond(200, {})
    try:
        p = json.loads((event.get("body") or "{}").replace("\u00a0", " "))
    except (json.JSONDecodeError, TypeError):
        return respond(400, {"error": "Body must be valid JSON"})

    reasons = check_payment(p)
    if reasons:
        return respond(400, {"error": "Payment declined", "reasons": reasons})

    card = re.sub(r"\s", "", str(p["cardNumber"]))
    masked = "*" * (len(card) - 4) + card[-4:]  # never keep the full number or the CVV
    token = "PAY-" + uuid.uuid4().hex[:12].upper()
    try:
        with get_conn().cursor() as cur:
            cur.execute(
                "INSERT INTO PAYMENT (TOKEN, HOLDER_NAME, CARD_NUM, EXP_DATE, AMOUNT) VALUES (%s,%s,%s,%s,%s)",
                (token, str(p["cardHolderName"]).strip(), masked, p["expirationDate"], float(p["amount"])))
    except Exception as e:
        print("Payment DB error:", repr(e))
        return respond(500, {"error": "Could not process payment"})
    return respond(201, {"token": token, "status": "APPROVED"})
