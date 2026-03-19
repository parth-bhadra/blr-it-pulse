#!/usr/bin/env python3
"""
BLR IT Pulse - Fetch All Data
Runs all data fetchers.
"""

import subprocess
import sys

subprocess.run([sys.executable, "/app/scripts/fetch-market-data.py"])
subprocess.run([sys.executable, "/app/scripts/fetch-hiring-data.py"])
