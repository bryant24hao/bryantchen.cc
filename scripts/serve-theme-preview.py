"""Serve the static branch preview on loopback only, with Next export URLs."""
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path


class Handler(SimpleHTTPRequestHandler):
    def translate_path(self, path):
        target = super().translate_path(path)
        if not Path(target).is_file() and Path(target + ".html").is_file():
            return target + ".html"
        return target


if __name__ == "__main__":
    output = Path(__file__).resolve().parent.parent / "out"
    if not output.is_dir():
        raise SystemExit("Run pnpm build first.")
    server = ThreadingHTTPServer(
        ("127.0.0.1", 3000), partial(Handler, directory=str(output))
    )
    print("Theme preview: http://127.0.0.1:3000/zh", flush=True)
    server.serve_forever()
