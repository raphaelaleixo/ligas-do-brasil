#!/usr/bin/env python3
"""Dev server que replica o rewrite do vercel.json: se o path não existe como
arquivo, tenta path.html; se ainda não existe, cai pro index.html (SPA fallback)."""
import os, sys
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

class Handler(SimpleHTTPRequestHandler):
    def translate_path(self, path):
        # Strip query string
        clean = path.split('?', 1)[0].split('#', 1)[0]
        candidate = os.path.join(ROOT, clean.lstrip('/'))
        # 1) Existe como arquivo → serve direto
        if os.path.isfile(candidate):
            return candidate
        # 2) É um diretório → deixa o SimpleHTTPRequestHandler tratar (serve index)
        if os.path.isdir(candidate):
            return super().translate_path(path)
        # 3) Path + .html existe → serve isso (equivale ao rewrite do Vercel)
        html = candidate + '.html'
        if os.path.isfile(html):
            return html
        # 4) SPA fallback → index.html
        return os.path.join(ROOT, 'index.html')

port = 5173
with ThreadingHTTPServer(('localhost', port), Handler) as httpd:
    print(f'Dev server em http://localhost:{port}/', flush=True)
    httpd.serve_forever()
