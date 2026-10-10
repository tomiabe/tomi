const http = require('http');
const path = require('path');
const fs = require('fs');
const sirv = require('sirv');

const isDev = process.env.NODE_ENV !== 'production';
const port = Number(process.env.PORT) || 3000;
const root = __dirname;

const serve = sirv(root, {
  dev: isDev,
  etag: true,
  maxAge: isDev ? 0 : 3600,
  extensions: ['html'],
});

function notFound(res) {
  res.statusCode = 404;
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.end(
    '<!doctype html><html lang="en"><head><meta charset="utf-8"><title>404 — Tomi Abe</title></head>' +
      '<body><p>Page not found. <a href="/">Back home</a>.</p></body></html>'
  );
}

http
  .createServer((req, res) => {
    const pathname = decodeURIComponent(new URL(req.url, `http://${req.headers.host}`).pathname);

    // Clean URLs: /me → redirect to /me/ so the directory index resolves
    if (!path.extname(pathname) && !pathname.endsWith('/')) {
      const asDir = path.join(root, pathname);
      if (fs.existsSync(asDir) && fs.statSync(asDir).isDirectory()) {
        res.statusCode = 301;
        res.setHeader('Location', pathname + '/');
        return res.end();
      }
    }

    serve(req, res, () => notFound(res));
  })
  .listen(port, () => {
    console.log(`Tomi Abe — dev server running at http://localhost:${port}`);
  });
