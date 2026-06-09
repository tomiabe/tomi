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
      name: 'generate-post-pages',
      closeBundle() {
        const outDir = path.resolve(process.cwd(), 'dist');
        const postsDir = path.resolve(process.cwd(), 'public/content/posts');
        const indexHtml = fs.readFileSync(path.resolve(outDir, 'index.html'), 'utf-8');

        let postSlugs: string[];
        try {
          postSlugs = JSON.parse(fs.readFileSync(path.resolve(postsDir, 'posts.json'), 'utf-8')).map((p: { slug: string }) => p.slug);
        } catch {
          return;
        }

        for (const slug of postSlugs) {
          try {
            const post = JSON.parse(fs.readFileSync(path.resolve(postsDir, `${slug}.json`), 'utf-8'));
            const siteUrl = 'https://tomiabe.com';
            const postUrl = `${siteUrl}/writing/${slug}`;
            const postDate = post.date || '2025-11-11';
            const postTitle = post.title || 'Post';
            const content = post.content || '';

            const paragraphs = content
              .split(/\n\n+/)
              .map((block: string) => {
                const trimmed = block.trim();
                if (trimmed === '---') return '<hr>';
                const withStrong = trimmed.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
                return `<p>${withStrong}</p>`;
              })
              .join('\n');

            const postHtml = indexHtml
              .replace(/<title>.*?<\/title>/, `<title>${postTitle} — Tomi Abe</title>`)
              .replace(
                /<meta property="og:title" content="[^"]*"/,
                `<meta property="og:title" content="${postTitle}"`
              )
              .replace(
                /<meta property="og:type" content="[^"]*"/,
                `<meta property="og:type" content="article" />\n  <meta property="article:published_time" content="${postDate}"`
              )
              .replace(
                /<meta property="og:url" content="[^"]*"/,
                `<meta property="og:url" content="${postUrl}"`
              )
              .replace(
                /<meta property="og:description" content="[^"]*"/,
                `<meta property="og:description" content="${postTitle}"`
              )
              .replace(
                '<div id="root"></div>',
                `<div id="root">
    <article style="max-width:720px;margin:0 auto;padding:2rem 1.5rem;font-family:Georgia,serif;color:#333;line-height:1.8">
      <header style="margin-bottom:2rem">
        <h1 style="font-size:2rem;margin-bottom:0.5rem;font-family:sans-serif">${postTitle}</h1>
        <time style="color:#888;font-size:0.875rem;font-family:sans-serif">November 11, 2025</time>
      </header>
      ${paragraphs}
    </article>
  </div>`
              );

            const slugDir = path.resolve(outDir, 'writing', slug);
            fs.mkdirSync(slugDir, { recursive: true });
            fs.writeFileSync(path.resolve(slugDir, 'index.html'), postHtml, 'utf-8');
          } catch (e: any) {
            console.error(`Failed to generate page for post "${slug}":`, e);
          }
        }
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
