CHROME BROWSER SECURITY FIX - COMPLETE SOLUTION

PROBLEM:
Chrome blocks localhost access with error: "Domains, protocols and ports must match"

SOLUTIONS (Try in order):

1. USE IP ADDRESS INSTEAD OF LOCALHOST:
   Open: http://127.0.0.1:8000/admin-dashboard-simple.html
   NOT: http://localhost:8000/admin-dashboard-simple.html

2. START CHROME WITH SECURITY FLAGS:
   chrome --disable-web-security --allow-running-insecure-content --disable-features=VizDisplayCompositor --user-data-dir="%LOCALAPPDATA%\Google\Chrome\User Data" --new-window http://127.0.0.1:8000/admin-dashboard-simple.html

3. USE DIFFERENT PORT:
   Try port 8080 or 3000:
   http://127.0.0.1:8080/admin-dashboard-simple.html
   http://127.0.0.1:3000/admin-dashboard-simple.html

4. CREATE CHROME SHORTCUT:
   Create shortcut with: 
   "C:\Program Files\Google\Chrome\Application\chrome.exe" --disable-web-security --allow-running-insecure-content --new-window http://127.0.0.1:8000/admin-dashboard-simple.html

5. USE FIREFOX INSTEAD:
   Firefox doesn't have same security restrictions:
   Open with Firefox instead of Chrome

6. CHROME SETTINGS ADJUSTMENT:
   Go to: chrome://flags/#unsafely-treat-insecure-origin-as-secure
   Enable: "Treat insecure origins as secure"
   Restart Chrome

RECOMMENDED SOLUTION:
Use IP address (Solution 1) - it's the simplest and most reliable.

TEST URL:
http://127.0.0.1:8000/admin-dashboard-simple.html

Login: +251912345678 / admin123

Search for: "iphone" or "sa"

This should work without any Chrome security errors!
