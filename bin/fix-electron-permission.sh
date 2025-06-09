#!/bin/bash

cd `realpath $(dirname "$0")`

cd ..

sudo chown root node_modules/electron/dist/chrome-sandbox
sudo chmod 4755 node_modules/electron/dist/chrome-sandbox
