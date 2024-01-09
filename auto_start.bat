@echo off
set BUILD_DIR=./build/src

if "%~1"=="minimized" goto :minimized
start /min cmd /c "%~0 minimized"
goto :EOF

:minimized
if not exist "%BUILD_DIR%" (
    echo Building...
    call npm run compile >nul
)

node %BUILD_DIR%/index.js
r
