#!/bin/bash
set -e

# ────────────────────────────────────────────
# entrypoint.sh
#   docker-compose up のたびに実行されるスクリプト
#   Rails の「A server is already running」エラーを防ぐために
#   古い PID ファイルを削除してからサーバーを起動する
# ────────────────────────────────────────────

# 前回のコンテナが異常終了した際に残る pid ファイルを削除
rm -f /app/tmp/pids/server.pid

# 後続の CMD (rails server) を実行
exec "$@"
