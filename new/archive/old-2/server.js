const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;
const MIME_TYPES = {
  '.html': 'text/html; charset=UTF-8',
  '.css': 'text/css; charset=UTF-8',
  '.js': 'application/javascript; charset=UTF-8',
  '.json': 'application/json; charset=UTF-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.ttf': 'font/ttf',
  '.xml': 'application/xml',
  '.txt': 'text/plain; charset=UTF-8',
  '.webmanifest': 'application/manifest+json'
};

const server = http.createServer((req, res) => {
  const [rawPath, queryString] = req.url.split('?');
  const query = queryString ? `?${queryString}` : '';
  let urlPath = decodeURIComponent(rawPath);

  // Friendly aliases for work assets if requested from root
  if (urlPath === '/work.js') {
    urlPath = '/work/work.js';
  } else if (urlPath === '/work.css') {
    urlPath = '/work/work.css';
  }

  let filePath = path.join(__dirname, urlPath);

  // Check if target is a directory
  if (fs.existsSync(filePath)) {
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      if (!rawPath.endsWith('/')) {
        res.writeHead(301, { Location: `${rawPath}/${query}` });
        res.end();
        return;
      }
      filePath = path.join(filePath, 'index.html');
    }
  } else if (urlPath.endsWith('/')) {
    filePath = path.join(filePath, 'index.html');
  }

  fs.readFile(filePath, (err, data) => {
    if (err) {
      const ext = path.extname(urlPath).toLowerCase();
      // Never serve HTML fallback for missing static assets (scripts, styles, images, fonts)
      if (ext && ext !== '.html') {
        res.writeHead(404, { 'Content-Type': 'text/plain; charset=UTF-8' });
        res.end(`404 Not Found: ${urlPath}`);
        return;
      }

      if (err.code === 'ENOENT') {
        const notFoundPath = path.join(__dirname, 'index.html');
        fs.readFile(notFoundPath, (err2, data2) => {
          if (err2) {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('404 Not Found');
          } else {
            res.writeHead(200, { 'Content-Type': 'text/html; charset=UTF-8' });
            res.end(data2);
          }
        });
      } else {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('500 Internal Server Error');
      }
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(data);
  });
});

server.on('error', (err) => {
  console.error('Server error:', err);
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running at http://0.0.0.0:${PORT}/`);
});

process.on('SIGTERM', () => {
  server.close(() => {
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  server.close(() => {
    process.exit(0);
  });
});
