from configparser import ConfigParser
from datetime import datetime
import sys
import base64
import psycopg2

def approve_client():
    if(len(sys.argv)!=2):
        print("Invalid number of cmd line arguments provided.")
    client_id = base64.b64decode(sys.argv[1])
    with conn.cursor() as cursor:
        cursor.execute("UPDATE auth_secret SET is_verified = 1 WHERE auth_secret.client_id = {client_id}".format(
            client_id=client_id
        ))
        conn.commit()
    print("Auth Secret updated")


def connect():
    conn = None
    print("Connecting to PostgreSQL server...")

    parser = ConfigParser()
    with open("db.ini") as f:
        parser.read_file(f)

    keys = parser["postgresql"]
    try:
        conn = psycopg2.connect(
            host=keys.get("host"),
            database=keys.get("database"),
            user=keys.get("user"),
            password=keys.get("password"))
        print("Connection Successful")
        cursor = conn.cursor()
        cursor.execute("SELECT version()")
        print(cursor.fetchone())
        return conn
    except (Exception, psycopg2.DatabaseError) as error:
        print(error)
        if conn is not None:
            conn.close()
            print("Connection Closed")


conn = connect()

if conn is None:
    exit()

approve_client()
