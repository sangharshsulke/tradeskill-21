import bcrypt from 'bcryptjs';
import { Router } from 'express';
import { exec, query } from '../db';
import { requireAuth, signToken, type AuthedRequest } from '../auth';
import { HttpError, str, wrap } from '../http';
import { id } from '../mappers';

const router = Router();

const DEFAULT_AVATAR = (name: string) =>
  `https://ui-avatars.com/api/?background=random&name=${encodeURIComponent(name)}`;

export async function loadMe(userId: number) {
  const [u] = await query('SELECT * FROM users WHERE id = ?', [userId]);
  if (!u) throw new HttpError(401, 'Account no longer exists.');
  return {
    id: id('user', u.id),
    name: u.name,
    email: u.email,
    role: u.role,
    title: u.title,
    avatar: u.avatar_url,
    availableThisWeek: !!u.available_this_week,
  };
}

// POST /api/auth/register  -> Create account
router.post('/register', wrap(async (req, res) => {
  const name = str(req.body, 'name', { max: 120 });
  const email = str(req.body, 'email', { max: 190 }).toLowerCase();
  const password = str(req.body, 'password', { max: 100 });
  const role = str(req.body, 'role', { required: false, max: 160 }) || 'TradeSkill Member';
  if (!/^\S+@\S+\.\S+$/.test(email)) throw new HttpError(400, 'Please enter a valid email.');
  if (password.length < 6) throw new HttpError(400, 'Password must be at least 6 characters.');

  const [exists] = await query('SELECT id FROM users WHERE email = ?', [email]);
  if (exists) throw new HttpError(409, 'An account with this email already exists.');

  const hash = await bcrypt.hash(password, 10);
  const r = await exec(
    'INSERT INTO users (name, email, password_hash, role, avatar_url) VALUES (?, ?, ?, ?, ?)',
    [name, email, hash, role, DEFAULT_AVATAR(name)]
  );
  res.status(201).json({ token: signToken(r.insertId), user: await loadMe(r.insertId) });
}));

// POST /api/auth/login
router.post('/login', wrap(async (req, res) => {
  const email = str(req.body, 'email').toLowerCase();
  const password = str(req.body, 'password');
  const [u] = await query('SELECT id, password_hash FROM users WHERE email = ?', [email]);
  if (!u || !(await bcrypt.compare(password, u.password_hash))) {
    throw new HttpError(401, 'Incorrect email or password.');
  }
  res.json({ token: signToken(u.id), user: await loadMe(u.id) });
}));

// GET /api/auth/me
router.get('/me', requireAuth, wrap<AuthedRequest>(async (req, res) => {
  res.json(await loadMe(req.userId!));
}));

// PATCH /api/auth/me/availability  -> Update "Available this week" toggle
router.patch('/me/availability', requireAuth, wrap<AuthedRequest>(async (req, res) => {
  await exec('UPDATE users SET available_this_week = ? WHERE id = ?', [req.body?.available ? 1 : 0, req.userId]);
  res.json(await loadMe(req.userId!));
}));

export default router;
