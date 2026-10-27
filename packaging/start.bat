
@echo off
setlocal

if /I "%~1"=="--open-browser" goto open_browser

title RDS Visualization
cd /d "%~dp0"

if not exist "runtime\bin\java.exe" (
    echo FEIL: Fant ikke Java-runtime.
    pause
    exit /b 1
)

if not exist "backend.jar" (
    echo FEIL: Fant ikke backend.jar.
    pause
    exit /b 1
)

echo ========================================
echo          RDS Visualization
echo ========================================
echo.
echo Starter programmet...
echo Nettleseren apnes automatisk.
echo.
echo VIKTIG:
echo - Hold dette vinduet apent mens du bruker programmet.
echo - Avslutt med Ctrl+C i dette vinduet.
echo - Bekreft avslutningen dersom Windows spor.
echo.
echo Adresse: http://127.0.0.1:8080
echo.

start "" /min "%~f0" --open-browser

"runtime\bin\java.exe" -jar "backend.jar" --server.address=127.0.0.1 --server.port=8080

echo.
echo Serveren er avsluttet.
pause
exit /b

:open_browser
cd /d "%~dp0"

for /L %%i in (1,1,60) do (
    curl.exe -s -f -o NUL --max-time 2 "http://127.0.0.1:8080/" >NUL 2>&1

    if not errorlevel 1 (
        start "" "http://127.0.0.1:8080/"
        exit /b 0
    )

    timeout /t 1 /nobreak >NUL
)

exit /b 1
