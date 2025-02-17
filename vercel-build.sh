#!/usr/bin/env bash

# Install wget using yum
yum install wget -y

# Install Python dependencies
python3 -m pip install -r requirements.txt

# Run the build script with a different port
export PORT=8000
./build