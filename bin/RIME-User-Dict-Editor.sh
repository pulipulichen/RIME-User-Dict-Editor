#!/bin/bash

# 設定 NVM 路徑
export NVM_DIR="/home/pudding/.nvm"
export PATH="$NVM_DIR/versions/node/v22.16.0/bin:$PATH"

cd `realpath $(dirname "$0")`

cd ..
if [ ! -f "config.js" ]; then
    echo "config.js not found, copying from config.example.js..."
    cp config.example.js config.js
fi
# 檢查 npm 是否存在，如果不存在則使用指定路徑
if ! command -v npm &> /dev/null
then
    echo "npm command not found, using specified path for npm."
    NPM_BIN="/home/pudding/.nvm/versions/node/v22.16.0/bin/npm"
else
    NPM_BIN="npm"
fi

if [ ! -d "node_modules" ]; then
    echo "node_modules directory not found, installing npm packages..."
    "${NPM_BIN}" install # 使用 NPM_BIN 變數來執行 npm install
fi

"${NPM_BIN}" run 0.start-electron >> /tmp/RIME-User-Dict-Editor.log 2>&1 # 將 npm run 的輸出導向日誌文件，並使用 NPM_BIN 變數
