#!/usr/bin/env bash

# Install wget using yum
yum install wget lsof -y


# Install Python dependencies
python3 -m pip install -r requirements.txt

# Kill any process using ports 5000 or 8000
lsof -ti:5000 | xargs -r kill -9 || true
lsof -ti:8000 | xargs -r kill -9 || true

# Run the build script with a different port
export PORT=8000
./build