@echo off
title DriveEasy - Save Checkpoint
echo ======================================================
echo  DriveEasy Auto-Checkpoint Generator
echo ======================================================
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0scripts\checkpoint.ps1"
echo.
pause
