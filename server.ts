import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
// @ts-ignore
import healthHandler from './api/health.js';
// @ts-ignore
import uraRouter from './api/ura.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json());

// Mount Modular API Directory Handlers
// 1. Health Monitoring Endpoint
app.use('/api/health', healthHandler);

// 2. URA DataService Endpoints
app.use('/api/ura', uraRouter);

// Dev: Vite middlewares, Prod: Static build
async function setupViteOrStatic() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`URA Property Market Information server running on http://0.0.0.0:${PORT}`);
    console.log(`Health monitor active on http://0.0.0.0:${PORT}/api/health`);
  });
}

setupViteOrStatic().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
