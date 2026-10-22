@echo off
title DriveEasy - Restore System Checkpoint
echo ======================================================
echo  DriveEasy Disaster Recovery Assistant
echo ======================================================
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0scripts\restore.ps1"
echo.
pause
