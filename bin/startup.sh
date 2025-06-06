#!/bin/bash
cd `realpath $(dirname "$0")`
cd ..
if [ ! -f "config.js" ]; then
    echo "config.js not found, copying from config.example.js..."
    cp config.example.js config.js
fi
if [ ! -d "node_modules" ]; then
    echo "node_modules directory not found, installing npm packages..."
    npm install
fi

npm run 0.start-electron
