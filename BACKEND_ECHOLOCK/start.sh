#!/bin/bash

# Ensures Python is run from the virtual environment
PYTHON_BIN="/app/.venv/bin/python" 

echo "--- ECHOLOCK BOOT SCRIPT ---"

# 1. Start the Federation Worker (listener) in the background
$PYTHON_BIN federation_worker.py &

# 2. Start the Flask API Server (web process) in the foreground
/usr/bin/env gunicorn app:app --bind 0.0.0.0:$PORT
