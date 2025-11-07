import redis
import hashlib
import os
from dotenv import load_dotenv

load_dotenv()

REDIS_HOST = os.getenv("REDIS_HOST")
REDIS_PORT = os.getenv("REDIS_PORT")
REDIS_PASS = os.getenv("REDIS_PASS")
REDIS_CHANNEL = os.getenv("REDIS_CHANNEL")

try:
    redis_client = redis.Redis(
        host=REDIS_HOST,
        port=REDIS_PORT,
        password=REDIS_PASS,
        decode_responses=True
    )
    redis_client.ping()
    print("Federation Publisher connected to Redis Cloud.")
except redis.exceptions.ConnectionError as e:
    print(f"WARNING: Could not connect to Redis. Federation Layer is OFF. Error: {e}")
    redis_client = None
except Exception as e:
    print(f"WARNING: An unknown error occurred with Redis. Federation Layer is OFF. Error: {e}")
    redis_client = None


def publish_new_threat(domain_to_block):
    """
    Hashes a domain and publishes it to the federated channel.
    """
    if not redis_client:
        print("[PUBLISH FAILED] Redis client is not connected.")
        return

    try:
        #  Hash the domain for privacy
        ioc_hash = hashlib.sha256(domain_to_block.encode('utf-8')).hexdigest()
        
        #  Publish the hash to the channel
        redis_client.publish(REDIS_CHANNEL, ioc_hash)
        print(f"[PUBLISHED] New threat {ioc_hash[:10]}... to federation.")
    
    except Exception as e:
        print(f"[PUBLISH ERROR] Could not publish to Redis: {e}")