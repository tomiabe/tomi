import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'save-content',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          if (req.url === '/api/save-content' && req.method === 'POST') {
            let body = '';
            req.on('data', chunk => { body += chunk; });
            req.on('end', () => {
              try {
                const { home, studio } = JSON.parse(body);
                // Adjust paths to be relative to the root of the project
                const homePath = path.resolve(process.cwd(), 'public/content/pages/home.json');
                const studioPath = path.resolve(process.cwd(), 'public/content/pages/studio.json');

                if (home) {
                  console.log('Saving home content to:', homePath);
                  fs.writeFileSync(homePath, JSON.stringify(home, null, 2));
                }
                if (studio) {
                  console.log('Saving studio content to:', studioPath);
                  fs.writeFileSync(studioPath, JSON.stringify(studio, null, 2));
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