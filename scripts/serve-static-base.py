#!/usr/bin/env python3
"""Serve a static SPA under a GitHub Pages-style base path."""
from __future__ import annotations

import argparse
import posixpath
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import unquote, urlsplit


class BasePathHandler(SimpleHTTPRequestHandler):
    server_version = "BibliaPagesPreview/1.0"

    def translate_path(self, request_path: str) -> str:
        parsed_path = unquote(urlsplit(request_path).path)
        base = self.server.base_path
        if parsed_path == base:
            parsed_path = "/"
        elif parsed_path.startswith(base + "/"):
            parsed_path = parsed_path[len(base):] or "/"
        else:
            parsed_path = "/"

        relative = posixpath.normpath(parsed_path.lstrip("/"))
        root = self.server.static_root
        candidate = (root / relative).resolve()
        try:
            candidate.relative_to(root)
        except ValueError:
            return str(root / "__not_found__")

        if candidate.is_file():
            return str(candidate)
        return str(root / "index.html")

    def log_message(self, format: str, *args: object) -> None:
        if self.path.endswith("/index.html") or self.path.endswith("/"):
            super().log_message(format, *args)


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--root", required=True, type=Path)
    parser.add_argument("--base", default="/biblia-em-visao")
    parser.add_argument("--host", default="127.0.0.1")
    parser.add_argument("--port", default=4173, type=int)
    args = parser.parse_args()

    root = args.root.resolve()
    base = "/" + args.base.strip("/") if args.base.strip("/") else ""
    if not (root / "index.html").is_file():
        raise SystemExit(f"index.html não encontrado em {root}")

    server = ThreadingHTTPServer((args.host, args.port), BasePathHandler)
    server.static_root = root
    server.base_path = base
    print(f"Serving {root} at http://{args.host}:{args.port}{base}/", flush=True)
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        pass
    finally:
        server.server_close()


if __name__ == "__main__":
    main()
