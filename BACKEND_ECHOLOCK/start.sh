
# This script runs both the worker and the web app in the same server.

echo "--- ECHOLOCK BOOT SCRIPT ---"

#  Start the Federation Worker (runs in the background using '&')
echo "Starting Federation Worker (24/7 listener)..."
python federation_worker.py &

# Start the Flask API Server (runs in the foreground using gunicorn)
echo "Starting Flask API Server (Gunicorn)..."
gunicorn app:app --bind 0.0.0.0:$PORT