@echo off
title ConnectX Cloudflare Public Tunnel (No Password Required)
echo ==============================================================
echo Starting Cloudflare Live HTTPS Tunnel for ConnectX...
echo Forwarding directly to http://localhost:5000
echo ==============================================================
echo.
echo Connecting to Cloudflare global network...
echo Your public URL will appear below (https://....trycloudflare.com)
echo [NO password and NO IP address required - opens directly!]
echo.
npx.cmd -y cloudflared tunnel --url http://localhost:5000
pause
