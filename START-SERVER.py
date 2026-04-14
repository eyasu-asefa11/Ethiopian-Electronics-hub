#!/usr/bin/env python3
import http.server
import socketserver
import webbrowser
import threading
import time

def get_local_ip():
    """Get local IP address"""
    try:
        # Connect to an external server to get local IP
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.connect(("8.8.8.8", 80))
        local_ip = s.getsockname()[0]
        s.close()
        return local_ip
    except:
        return "127.0.0.1"

def open_browser(url):
    """Open URL in default browser"""
    try:
        # Try Chrome first
        webbrowser.open(url)
    except:
        # Fallback to default browser
        webbrowser.get().open(url)

def main():
    print("=" * 50)
    print("DILLA ELECTRONICS MARKETPLACE - SERVER STARTER")
    print("=" * 50)
    
    # Get local IP
    local_ip = get_local_ip()
    port = 8000
    
    print(f"Starting server on {local_ip}:{port}")
    print(f"Server will be available at: http://{local_ip}:{port}")
    print(f"Admin Dashboard: http://{local_ip}:{port}/admin-dashboard-simple.html")
    print("=" * 50)
    
    # Start server in a separate thread
    def start_server():
        handler = http.server.SimpleHTTPRequestHandler
        httpd = socketserver.TCPServer(("", port), handler)
        print(f"Server started successfully on port {port}")
        print("Press Ctrl+C to stop the server")
        httpd.serve_forever()
    
    # Start server thread
    server_thread = threading.Thread(target=start_server, daemon=True)
    server_thread.start()
    
    # Wait a moment for server to start
    time.sleep(2)
    
    # Open browser
    url = f"http://{local_ip}:{port}/admin-dashboard-simple.html"
    print(f"Opening browser at: {url}")
    open_browser(url)
    
    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        print("\nServer stopped...")
        httpd.shutdown()

if __name__ == "__main__":
    main()
