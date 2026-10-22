import { Router } from 'express';
import { exec } from '../db';
import { optionalAuth, type AuthedRequest } from '../auth';
import { HttpError, str, wrap } from '../http';

const router = Router();

// POST /api/support   -> Contact form (public; links the ticket to your account when logged in)
router.post('/', optionalAuth, wrap<AuthedRequest>(async (req, res) => {
  const fullName = str(req.body, 'fullName', { max: 120 });
  const email = str(req.body, 'email', { max: 190 });
  if (!/^\S+@\S+\.\S+$/.test(email)) throw new HttpError(400, 'Please enter a valid email.');
  const category = str(req.body, 'category', { max: 60 });
  const message = str(req.body, 'message', { max: 5000 });

  const r = await exec(
    `INSERT INTO support_tickets (ticket_code, user_id, full_name, email, category, message) VALUES (?, ?, ?, ?, ?, ?)`,
    [`TMP-${Date.now()}`, req.userId ?? null, fullName, email, category, message]
  );
  const code = `TS-${String(8000 + r.insertId)}`;
  await exec('UPDATE support_tickets SET ticket_code = ? WHERE id = ?', [code, r.insertId]);
  res.status(201).json({ ticketCode: code });
}));

export default router;
