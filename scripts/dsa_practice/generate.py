#!/usr/bin/env python3
"""Generate all DSA Practice topic JS + HTML pages."""
import os
import sys

sys.path.insert(0, os.path.dirname(__file__))

from bootstrap_all import main

if __name__ == "__main__":
    main()
