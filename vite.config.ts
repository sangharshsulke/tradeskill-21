import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { spawn, type ChildProcess } from 'node:child_process';
import net from 'node:net';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig, loadEnv, type Plugin } from 'vite';

const rootDir = path.dirname(fileURLToPath(import.meta.url));

/** true if something is already listening on the port */
const isPortOpen = (port: number) =>
  new Promise<boolean>((resolve) => {
    const socket = net.connect(port, '127.0.0.1');
    socket.once('connect', () => (socket.destroy(), resolve(true)));
    socket.once('error', () => resolve(false));
  });

/**
 * Starts the Express + MySQL API (server/index.ts) together with the Vite dev server,
 * so `npm run dev`, `npm run client` or `npx vite` all work without a second terminal.
 * Skipped when the API is already running (e.g. you started `npm run server` yourself).
 */
function apiServer(port: number): Plugin {
  const g = globalThis as { __tradeskillApi?: ChildProcess };
  return {
    name: 'tradeskill-api',
    apply: 'serve',
    async configureServer() {
      // Vite restarts (e.g. on .env change) re-run this; keep the existing API process
      if (g.__tradeskillApi && g.__tradeskillApi.exitCode === null) return;
      if (await isPortOpen(port)) return;

      const child = spawn('npx', ['tsx', 'watch', 'server/index.ts'], {
        cwd: rootDir,
        stdio: 'inherit',
        shell: process.platform === 'win32',
      });
      g.__tradeskillApi = child;
      const stop = () => child.exitCode === null && child.kill();
      process.once('exit', stop);
      process.once('SIGINT', () => (stop(), process.exit()));
      process.once('SIGTERM', () => (stop(), process.exit()));
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, rootDir, '');
  const apiPort = Number(env.API_PORT || 4000);

  return {
    plugins: [react(), tailwindcss(), apiServer(apiPort)],
    resolve: {
      alias: {
        '@': rootDir,
      },
    },
    server: {
      // Forward /api calls to the Express + MySQL backend (server/index.ts)
      proxy: {
        '/api': {
          target: `http://localhost:${apiPort}`,
          configure: (proxy) => {
            // API still booting or crashed -> clear JSON error instead of a stack trace
            proxy.on('error', (_err, _req, res) => {
              if ('writeHead' in res && !res.headersSent) {
                res.writeHead(503, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: `API server is not running on port ${apiPort}. Check the terminal for errors.` }));
              }
            });
          },
        },
      },
      watch: process.env.DISABLE_HMR === 'true' ? null : { ignored: ['**/server/**'] },
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      hmr: process.env.DISABLE_HMR !== 'true',
    },
  };
});
