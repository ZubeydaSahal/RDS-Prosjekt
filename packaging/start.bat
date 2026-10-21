
@echo off
title RDS Visualization

cd /d "%~dp0"

if not exist "runtime\bin\java.exe" (
    echo FEIL: Fant ikke Java i runtime-mappen.
    pause
    exit /b 1
)

if not exist "backend.jar" (
    echo FEIL: Fant ikke backend.jar.
    pause
    exit /b 1
)

echo Starter RDS Visualization...
echo.
echo Nar serveren har startet, apne:
echo http://localhost:8080
echo.
echo Trykk Ctrl+C for a stoppe serveren.
echo.

"runtime\bin\java.exe" -jar "backend.jar" --server.address=127.0.0.1 --server.port=8080

echo.
echo Serveren er avsluttet.
pause
