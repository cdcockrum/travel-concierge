# /api/index.py
# Minimal serverless function that proves 'requests' is installed.
from http.server import BaseHTTPRequestHandler
import json
import requests  # will be available after Vercel installs requirements.txt

class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        try:
            r = requests.get("https://httpbin.org/get", timeout=5)
            r.raise_for_status()
            body = json.dumps({"ok": True, "runtime": "python", "upstream": r.json()}).encode("utf-8")
            self.send_response(200)
            self.send_header("content-type", "application/json")
            self.end_headers()
            self.wfile.write(body)
        except Exception as e:  # why: turn opaque 500 into a visible error payload
            body = json.dumps({"ok": False, "error": str(e)}).encode("utf-8")
            self.send_response(500)
            self.send_header("content-type", "application/json")
            self.end_headers()
            self.wfile.write(body)
