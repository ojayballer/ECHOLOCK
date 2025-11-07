import redis
import sqlite3
from datetime import datetime
import time
import os
from dotenv import load_dotenv

load_dotenv()

REDIS_HOST = os.getenv("REDIS_HOST")
REDIS_PORT = os.getenv("REDIS_PORT")
REDIS_PASS = os.getenv("REDIS_PASS")
REDIS_CHANNEL = os.getenv("REDIS_CHANNEL")

DB_FILE = 'echolock_federation.db' 

def run_subscriber():
    print("Connecting to Redis as a Subscriber...")
    r = redis.Redis(
        host=REDIS_HOST,
        port=REDIS_PORT,
        password=REDIS_PASS,
        decode_responses=True # So we get strings, not bytes
    )
    pubsub = r.pubsub()
    pubsub.subscribe(REDIS_CHANNEL)
    print(f" Subscribed to '{REDIS_CHANNEL}'. Waiting for new threats...")

    db_con = sqlite3.connect(DB_FILE)

    # Listen for messages forever
    for message in pubsub.listen():
        if message['type'] == 'message':
            ioc_hash = message['data']
            print(f"---  FEDERATION UPDATE RECEIVED  ---")
            print(f"  New Threat Hash: {ioc_hash}")
            
            try:
                # Save the new hash to the local federated blocklist
                cur = db_con.cursor()
                cur.execute(
                    "INSERT OR IGNORE INTO federated_blocklist (ioc_hash, first_seen) VALUES (?, ?)",
                    (ioc_hash, datetime.now().isoformat())
                )
                db_con.commit()
                print(f"  SUCCESS: Local blocklist updated.")
            except Exception as e:
                print(f"  ERROR: Could not write to local database: {e}")
           
if __name__ == "__main__":
    # We need to create the DB file + table if it doesn't exist
    try:
        with sqlite3.connect(DB_FILE) as con:
            cur = con.cursor()
            cur.execute('''
            CREATE TABLE IF NOT EXISTS federated_blocklist (
                ioc_hash TEXT PRIMARY KEY,
                first_seen TEXT
            )
            ''')
            con.commit()
        
        # Now we start the listener
        run_subscriber()
        
    except redis.exceptions.ConnectionError:
        print(f" [FATAL ERROR] Could not connect to Redis broker at {REDIS_HOST}.")
    except Exception as e:
        print(f"An error occurred: {e}")
        time.sleep(10) # Pause on error