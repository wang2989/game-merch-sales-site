import json
import os
import pymysql
import pymysql.cursors

HEADERS = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
}

COLUMNS = "ITEM_NUMBER, NAME, DESCRIPTION, AVAILABLE_QUANTITY, UNIT_PRICE, IMAGE_URL"

_connection = None  # reused while the Lambda stays warm


def respond(status, body):
    return {"statusCode": status, "headers": HEADERS, "body": json.dumps(body)}


def connect():
    # No default values: credentials come ONLY from Lambda environment variables.
    return pymysql.connect(
        host=os.environ["DB_HOST"],
        user=os.environ["DB_USER"],
        password=os.environ["DB_PASSWORD"],
        database=os.environ["DB_NAME"],
        port=int(os.environ.get("DB_PORT", 3306)),
        cursorclass=pymysql.cursors.DictCursor,
        connect_timeout=5,
        # Without autocommit, a reused connection keeps an old snapshot of the data
        # and can keep showing stale stock after orders are placed.
        autocommit=True,
    )


def get_db_connection():
    global _connection
    if _connection is None:
        _connection = connect()
    else:
        try:
            _connection.ping(reconnect=True)
        except Exception:
            _connection = connect()
    return _connection


def format_item(row):
    return {
        "id": row["ITEM_NUMBER"],
        "name": row["NAME"],
        "price": float(row["UNIT_PRICE"]) if row["UNIT_PRICE"] is not None else 0.0,
        "stock": row["AVAILABLE_QUANTITY"],
        "image": row["IMAGE_URL"] or "",
        "description": row["DESCRIPTION"],
    }


def lambda_handler(event, context):
    path_params = event.get("pathParameters") or {}
    query = event.get("queryStringParameters") or {}

    try:
        conn = get_db_connection()
        with conn.cursor() as cursor:
            item_id = path_params.get("id")
            if item_id:
                if not str(item_id).isdigit():
                    return respond(400, {"error": "Item id must be a number"})
                cursor.execute(f"SELECT {COLUMNS} FROM ITEM WHERE ITEM_NUMBER = %s LIMIT 1",
                               (int(item_id),))
                row = cursor.fetchone()
                if not row:
                    return respond(404, {"error": f"No item with id '{item_id}'"})
                return respond(200, format_item(row))

            name = query.get("name")
            if name:
                cursor.execute(
                    f"SELECT {COLUMNS} FROM ITEM WHERE LOWER(NAME) LIKE %s ORDER BY ITEM_NUMBER",
                    (f"%{name.lower()}%",))
            else:
                cursor.execute(f"SELECT {COLUMNS} FROM ITEM ORDER BY ITEM_NUMBER")
            return respond(200, [format_item(r) for r in cursor.fetchall()])

    except Exception as e:
        print("Database error:", repr(e))  # full detail goes to CloudWatch only
        return respond(500, {"error": "Database unavailable"})
