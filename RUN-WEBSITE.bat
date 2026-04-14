@echo off
echo Starting Dilla Electronics Marketplace...
echo.
echo ========================================
echo.
echo SOLUTION 1: Use Python server (RECOMMENDED)
echo.
python -m http.server 127.0.0.1 8000
echo.
echo Server started at: http://127.0.0.1:8000
echo.
echo Opening browser...
echo.
timeout /t 3
start http://127.0.0.1:8000/admin-dashboard-simple.html
echo.
echo ========================================
echo.
echo SOLUTION 2: Use Node.js server
echo.
npx http-server -p 8000 -a 127.0.0.1
echo.
echo ========================================
echo.
echo SOLUTION 3: Troubleshooting steps
echo.
echo 1. Check if port 8000 is in use:
echo    netstat -an | findstr :8000
echo.
echo 2. Try different port (8080, 3000):
echo    python -m http.server 127.0.0.1 8080
echo.
echo 3. Check Windows Firewall:
echo    Windows Defender Firewall with Advanced Security
echo    Allow port 8000 for both Private and Public networks
echo.
echo 4. Use Firefox instead of Chrome:
echo    Firefox has fewer localhost restrictions
echo.
echo ========================================
echo.
echo Press Ctrl+C to stop
pause
