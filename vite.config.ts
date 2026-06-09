import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';

export default defineConfig({
  base: '/',
  plugins: [
    react(),
    {
      name: 'inject-og-image',
      transformIndexHtml(html) {
        try {
          const homePath = path.resolve(process.cwd(), 'public/content/pages/home.json');
          const home = JSON.parse(fs.readFileSync(homePath, 'utf-8'));
          const avatar = home?.intro?.avatar || '/images/tomi-1-bw.jpeg';
          return html
            .replace(/(<meta\s+property="og:image"\s+content=")[^"]*(")/, `$1${avatar}$2`)
            .replace(/(<meta\s+name="twitter:image"\s+content=")[^"]*(")/, `$1${avatar}$2`);
        } catch {
          return html;
        }
      },
    },
    {
      name: 'copy-404',
      closeBundle() {
        const src = path.resolve(process.cwd(), 'dist/index.html');
        const dest = path.resolve(process.cwd(), 'dist/404.html');
        fs.copyFileSync(src, dest);
      },
    },
    {
      name: 'save-content',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          if (req.url === '/api/save-content' && req.method === 'POST') {
            let body = '';
            req.on('data', chunk => { body += chunk; });
            req.on('end', () => {
              try {
                const { home } = JSON.parse(body);
                // Adjust paths to be relative to the root of the project
                const homePath = path.resolve(process.cwd(), 'public/content/pages/home.json');

                if (home) {
                  console.log('Saving home content to:', homePath);
                  fs.writeFileSync(homePath, JSON.stringify(home, null, 2));
                }

                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ status: 'success' }));
              } catch (err: any) {
                console.error('Error saving content:', err);
                res.statusCode = 500;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ status: 'error', message: err.message }));
              }
            });
          } else {
            next();
          }
        });
      }
    }
  ],
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  },
});
