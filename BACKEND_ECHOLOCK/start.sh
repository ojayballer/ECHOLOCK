#!/bin/bash

# Ensure all commands use the python interpreter from the virtual environment
PYTHON_BIN="/app/.venv/bin/python"

echo "--- ECHOLOCK BOOT SCRIPT ---"

#  Start the Federation Worker (listener) in the background
echo "Starting Federation Worker (24/7 listener)..."
$PYTHON_BIN federation_worker.py & 

#  Start the Flask API Server 
echo "Starting Flask API Server (Gunicorn)..."
/usr/bin/env gunicorn app:app --bind 0.0.0.0:$PORT
