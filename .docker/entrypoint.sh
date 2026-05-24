#!/bin/sh

pocketbase serve --http=127.0.0.1:8090 --dir=/pb_data &
PB_PID=$!

nginx -g 'daemon off;' &
NGINX_PID=$!

trap 'kill "$PB_PID" "$NGINX_PID" 2>/dev/null; exit 0' INT TERM QUIT

wait
