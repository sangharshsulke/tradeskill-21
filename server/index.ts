import 'dotenv/config';
import cors from 'cors';
import express, { type NextFunction, type Request, type Response } from 'express';
import { pool } from './db';
import { optionalAuth, requireAuth } from './auth';
import { HttpError, wrap } from './http';
import authRoutes from './routes/auth';
import skillRoutes from './routes/skills';
import peopleRoutes from './routes/people';
import sessionRoutes from './routes/sessions';
import requestRoutes from './routes/requests';
import dashboardRoutes from './routes/dashboard';
import supportRoutes from './routes/support';

const app = express();
app.use(cors());
app.use(express.json({ limit: '100kb' }));

app.get('/api/health', wrap(async (_req, res) => {
  await pool.query('SELECT 1');
  res.json({ ok: true });
}));

// Public (before login)
app.use('/api/auth', authRoutes);
app.use('/api/skills', optionalAuth, skillRoutes); // GET is public, POST/DELETE check auth inside
app.use('/api/support', supportRoutes);

// After login
app.use('/api/people', requireAuth, peopleRoutes);
app.use('/api/sessions', requireAuth, sessionRoutes);
app.use('/api/requests', requireAuth, requestRoutes);
app.use('/api/dashboard', requireAuth, dashboardRoutes);

app.use('/api', (_req, res) => res.status(404).json({ error: 'Not found' }));

// Error handler
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  if (err instanceof HttpError) return res.status(err.status).json({ error: err.message });
  if (err?.code === 'ECONNREFUSED' || err?.code === 'ER_ACCESS_DENIED_ERROR' || err?.code === 'ER_BAD_DB_ERROR') {
    console.error('Database connection problem:', err.code, '- check DB_* values in .env and run `npm run db:setup`.');
    return res.status(503).json({ error: 'Database is not reachable. Is MySQL running?' });
  }
  console.error(err);
  res.status(500).json({ error: 'Something went wrong on the server.' });
});

const PORT = Number(process.env.API_PORT || 4000);
app.listen(PORT, () => console.log(`TradeSkill API running on http://localhost:${PORT}`));
