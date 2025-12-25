#!/bin/bash

# LLD Playbook - Documentation Server
# Run this script to start the documentation website

PORT=${1:-3000}
DOCS_DIR="$(dirname "$0")/docs"

echo "🚀 Starting LLD Playbook documentation server..."
echo "📚 Documentation directory: $DOCS_DIR"
echo ""

# Check if npx is available (preferred)
if command -v npx &> /dev/null; then
    echo "🌐 Starting server at: http://localhost:$PORT"
    echo "   Press Ctrl+C to stop"
    echo ""
    cd "$DOCS_DIR" && npx serve -l $PORT .
    
# Fallback to Python
elif command -v python3 &> /dev/null; then
    echo "🌐 Starting server at: http://localhost:$PORT"
    echo "   Press Ctrl+C to stop"
    echo ""
    cd "$DOCS_DIR" && python3 -m http.server $PORT
    
elif command -v python &> /dev/null; then
    echo "🌐 Starting server at: http://localhost:$PORT"
    echo "   Press Ctrl+C to stop"
    echo ""
    cd "$DOCS_DIR" && python -m SimpleHTTPServer $PORT
    
else
    echo "❌ Error: No suitable server found."
    echo "   Please install Node.js (npm) or Python to serve the docs."
    exit 1
fi
