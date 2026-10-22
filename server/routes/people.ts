import { Router } from 'express';
import { query } from '../db';
import type { AuthedRequest } from '../auth';
import { HttpError, wrap } from '../http';
import { numId, toPeer } from '../mappers';

const router = Router();

async function buildPeers(users: any[]) {
  if (!users.length) return [];
  const ids = users.map((u) => u.id);
  const skills = await query(
    `SELECT user_id, type, title FROM user_skills WHERE status = 'active' AND user_id IN (?) ORDER BY id`,
    [ids]
  );
  // latest review each member received -> testimonial
  const reviews = await query(
    `SELECT r.*, u.name AS reviewer_name FROM reviews r JOIN users u ON u.id = r.reviewer_id
     WHERE r.reviewee_id IN (?) ORDER BY r.created_at DESC, r.id DESC`,
    [ids]
  );
  return users.map((u) =>
    toPeer(u, skills.filter((s) => s.user_id === u.id), reviews.find((r) => r.reviewee_id === u.id))
  );
}

// GET /api/people?q=   -> User List (members with at least one active skill, excluding you)
router.get('/', wrap<AuthedRequest>(async (req, res) => {
  const q = String(req.query.q ?? '').trim();
  const params: unknown[] = [req.userId];
  let search = '';
  if (q) {
    search = 'AND (u.name LIKE ? OR u.role LIKE ? OR EXISTS (SELECT 1 FROM user_skills s2 WHERE s2.user_id = u.id AND s2.title LIKE ?))';
    params.push(`%${q}%`, `%${q}%`, `%${q}%`);
  }
  const users = await query(
    `SELECT u.* FROM users u
     WHERE u.id <> ? AND EXISTS (SELECT 1 FROM user_skills s WHERE s.user_id = u.id AND s.status = 'active')
     ${search}
     ORDER BY u.mutual_match_pct DESC, u.rating DESC`,
    params
  );
  res.json(await buildPeers(users));
}));

// GET /api/people/:id   -> User Profile + Expertise
router.get('/:id', wrap(async (req, res) => {
  const users = await query('SELECT * FROM users WHERE id = ?', [numId(req.params.id)]);
  if (!users.length) throw new HttpError(404, 'Member not found.');
  res.json((await buildPeers(users))[0]);
}));

export default router;
