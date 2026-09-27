import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';
import fs from 'node:fs';
import path from 'node:path';

function localApiPlugin() {
  return {
    name: 'local-api-routes',
    configureServer(server) {
      server.middlewares.use(async (request, response, next) => {
        const url = new URL(request.url, `http://${request.headers.host}`);
        const pathname = url.pathname;

        if (!pathname.startsWith('/api/')) {
          next();
          return;
        }

        const apiPathRelative = pathname.replace(/^\/api\//, '');
        // Determine file to load
        let handlerFile = path.resolve(process.cwd(), 'api', `${apiPathRelative}.js`);
        if (!fs.existsSync(handlerFile)) {
          handlerFile = path.resolve(process.cwd(), 'api', apiPathRelative, 'index.js');
        }

        if (!fs.existsSync(handlerFile)) {
          next();
          return;
        }

        try {
          const chunks = [];
          for await (const chunk of request) chunks.push(chunk);
          const rawBody = Buffer.concat(chunks).toString('utf8');
          try {
            request.body = rawBody ? JSON.parse(rawBody) : {};
          } catch {
            request.body = {};
          }

          const module = await import(`file://${handlerFile}?t=${Date.now()}`);
          const handler = module.default;

          const resWrapper = {
            statusCode: 200,
            setHeader(k, v) {
              response.setHeader(k, v);
              return this;
            },
            status(code) {
              this.statusCode = code;
              response.statusCode = code;
              return this;
            },
            json(payload) {
              response.setHeader('Content-Type', 'application/json');
              response.statusCode = this.statusCode;
              response.end(JSON.stringify(payload));
            },
            end(data) {
              response.statusCode = this.statusCode;
              response.end(data);
            },
          };

          await handler(request, resWrapper);
        } catch (error) {
          console.error(`Local API Error on ${pathname}:`, error);
          response.statusCode = 500;
          response.setHeader('Content-Type', 'application/json');
          response.end(JSON.stringify({ error: 'Internal Server Error' }));
        }
      });
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  for (const [key, value] of Object.entries(env)) {
    process.env[key] = value;
  }

  return {
    plugins: [react(), localApiPlugin()],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    server: {
      port: 5173,
      host: true,
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            'vendor-react': ['react', 'react-dom', 'react-router-dom'],
            'vendor-motion': ['framer-motion'],
            'vendor-charts': ['recharts'],
            'vendor-icons': ['lucide-react'],
            'vendor-supabase': ['@supabase/supabase-js'],
          },
        },
      },
      chunkSizeWarningLimit: 800,
    },
  };
});
