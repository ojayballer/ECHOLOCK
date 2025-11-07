#!/bin/bash
set -e  # Exit on error

echo "--- ECHOLOCK BOOT SCRIPT ---"

# Build frontend
echo "Building frontend..."
cd ../FRONTEND_ECHOLOCK
npm install
npm run build

# Go back to backend directory
cd ../BACKEND_ECHOLOCK

# Ensure Python virtual env path
PYTHON_BIN="/app/.venv/bin/python"

# Start worker in background
$PYTHON_BIN federation_worker.py &

# Start Flask API with Gunicorn
/usr/bin/env gunicorn app:app --bind 0.0.0.0:$PORT
