#!/usr/bin/env bash

# Make script more verbose
set -x

# Install wget and lsof using yum
yum install wget lsof -y

# Install Python dependencies
python3 -m pip install -r requirements.txt

# Kill any process using ports 5000 or 8000
lsof -ti:5000 | xargs -r kill -9 || true
lsof -ti:8000 | xargs -r kill -9 || true

# Run the build script and capture its output
./build 2>&1

# Print the exit code
echo "Build script exited with code $?"