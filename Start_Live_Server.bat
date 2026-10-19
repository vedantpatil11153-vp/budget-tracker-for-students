@echo off
title CampusFunds - Student Budget Tracker Live Server
echo ========================================================
echo   Launching CampusFunds Live Server on http://localhost:5500
echo ========================================================
echo.
powershell -ExecutionPolicy Bypass -File "%~dp0server.ps1"
pause
