@echo off
echo Starting Dilla Electronics Marketplace - OLD WORKING WAY...
echo ==================================================
echo.
echo This will run the commands that worked before:
echo 1. Start local server
echo 2. Open index.html and admin-dashboard.html
echo 3. Use the working versions
echo.
echo ==================================================
echo.
echo Step 1: Starting local server...
start /B python -m http.server 127.0.0.1 8000
echo.
echo Server should be running at: http://127.0.0.1:8000
echo.
echo Step 2: Opening main page...
timeout /t 3
start http://127.0.0.1:8000/index.html
echo.
echo Step 3: Opening admin dashboard...
timeout /t 3
start http://127.0.0.1:8000/admin-dashboard.html
echo.
echo ==================================================
echo.
echo TROUBLESHOOTING:
echo If pages don't load:
echo 1. Check if port 8000 is in use: netstat -an | findstr :8000
echo 2. Try different port: python -m http.server 127.0.0.1 8080
echo 3. Use Firefox instead of Chrome
echo 4. Check Windows Firewall settings
echo.
echo ==================================================
echo.
echo Press Ctrl+C to stop server
pause
