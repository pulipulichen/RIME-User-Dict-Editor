#!/usr/bin/env bash
# fix-electron-suid.sh
# Usage:
#   ./fix-electron-suid.sh                       # 針對當前目錄
#   ./fix-electron-suid.sh /path/to/project ...  # 可一次放多個專案路徑

cd $(dirname "$0")/..



set -euo pipefail

GREEN() { printf "\033[32m%s\033[0m\n" "$*"; }
YELLOW() { printf "\033[33m%s\033[0m\n" "$*"; }
RED() { printf "\033[31m%s\033[0m\n" "$*"; }

need_sudo() {
  if [[ $EUID -ne 0 ]]; then
    echo "sudo"
  else
    echo ""
  fi
}

check_nosuid() {
  local path="$1"
  # 找到 path 所在的掛載點，檢查是否含有 nosuid
  local mountpoint
  mountpoint="$(df -P "$path" | awk 'NR==2{print $6}')"
  if grep -E "^[^ ]+ ${mountpoint//\//\\/} " /proc/mounts | grep -q ",nosuid"; then
    YELLOW "警告：掛載點 '$mountpoint' 使用了 nosuid，setuid 會被忽略。請將專案放在未啟用 nosuid 的檔案系統，或調整掛載選項。"
    return 1
  fi
  return 0
}

fix_one_file() {
  local f="$1"
  local sudo_cmd
  sudo_cmd="$(need_sudo)"

  # 檢查 nosuid
  check_nosuid "$f" || true

  # 設定 owner/group 與權限
  $sudo_cmd chown root:root "$f"
  $sudo_cmd chmod 4755 "$f"

  # 驗證
  local st
  st="$(stat -c '%U:%G %a %A' "$f")"
  GREEN "已修正：$f  ->  $st"
}

fix_in_project() {
  local proj="$1"
  if [[ ! -d "$proj" ]]; then
    YELLOW "略過：$proj 不是資料夾"
    return
  fi

  # 尋找所有 electron 的 chrome-sandbox
  mapfile -t files < <(find "$proj" -type f -path '*/node_modules/electron/dist/chrome-sandbox' 2>/dev/null || true)

  if [[ ${#files[@]} -eq 0 ]]; then
    YELLOW "在 '$proj' 找不到 node_modules/electron/dist/chrome-sandbox。是否尚未安裝依賴？（npm i / pnpm i / yarn）"
    return
  fi

  for f in "${files[@]}"; do
    fix_one_file "$f"
  done
}

main() {
  if ! command -v stat >/dev/null; then
    RED "需要 'stat' 指令。請先安裝 coreutils。"
    exit 1
  fi

  if [[ $# -eq 0 ]]; then
    set -- "."
  fi

  for p in "$@"; do
    fix_in_project "$(realpath "$p")"
  done

  GREEN "完成。若仍出現 '--no-sandbox' 相關訊息，請確認檔案系統未設 'nosuid'，或未在容器內以非 root 執行。"
}

main "$@"
