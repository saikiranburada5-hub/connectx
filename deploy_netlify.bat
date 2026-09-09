@echo off
title ConnectX Netlify Deployment Helper
echo ==============================================================
echo           ConnectX / GigConnect - Netlify Deploy
echo ==============================================================
echo.
echo Checking Netlify CLI and preparing deployment...
echo.

set /p choice="Do you want to deploy to (1) Production or (2) Preview Draft? [1/2, default: 1]: "
if "%choice%"=="" set choice=1

if "%choice%"=="1" (
    echo.
    echo Deploying live to Netlify Production...
    npx.cmd -y netlify-cli deploy --prod
) else (
    echo.
    echo Deploying draft preview to Netlify...
    npx.cmd -y netlify-cli deploy
)

echo.
echo ==============================================================
echo Deployment command finished!
echo ==============================================================
pause
