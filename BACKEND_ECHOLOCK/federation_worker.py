import redis
import time
import os
from datetime import datetime
from dotenv import load_dotenv

load_dotenv()
REDIS_HOST = os.getenv("REDIS_HOST")
REDIS_CHANNEL = os.getenv("REDIS_CHANNEL")
REDIS_PASS = os.getenv("REDIS_PASS")
REDISUSER = os.getenv("REDISUSER")

port_str = os.getenv("REDIS_PORT")
REDIS_PORT = int(port_str) if port_str else None

def run_subscriber():
    print("Attempting to connect to Redis as a Subscriber...")

    if not all([REDIS_HOST, REDIS_PORT, REDIS_PASS, REDIS_CHANNEL]):
        print("ERROR: Missing Redis variables. Worker cannot start.")
        time.sleep(10)
        return

    r = redis.Redis(
        host=REDIS_HOST,
        port=REDIS_PORT,
        password=REDIS_PASS,
        decode_responses=True
    )
    p = r.pubsub()
    p.subscribe(REDIS_CHANNEL)
    print(f"Subscribed to '{REDIS_CHANNEL}'. Waiting for new threats...")

    for message in p.listen():
        if message['type'] == 'message':
            ioc_hash = message['data']
            print(f"\n---  FEDERATION UPDATE RECEIVED ---")
            print(f"  New Threat Hash: {ioc_hash}")
            
            try:
                r.sadd("federated_blocklist", ioc_hash)
                print(f"  SUCCESS: Redis blocklist updated.")
            except Exception as e:
                print(f"  ERROR: Could not write to Redis: {e}")
            print("-----------------------------------------")

if __name__ == "__main__":
    while True:
        try:
            run_subscriber()
        except redis.exceptions.ConnectionError as e:
            print(f"Connection lost: {e}. Retrying in 10 seconds...")
            time.sleep(10)
        except KeyboardInterrupt:
            print("\nShutting down worker...")
            break
        except Exception as e:
            print(f"An unknown error occurred: {e}")
            time.sleep(10)