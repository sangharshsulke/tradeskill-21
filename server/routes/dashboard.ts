import { Router } from 'express';
import { exec, query } from '../db';
import type { AuthedRequest } from '../auth';
import { HttpError, str, wrap } from '../http';
import { numId, timeAgo, toUserSkill } from '../mappers';

const router = Router();

// GET /api/dashboard   -> Statistics + Reviews
router.get('/', wrap<AuthedRequest>(async (req, res) => {
  const me = req.userId!;
  const [u] = await query('SELECT trust_score, rating, rating_count FROM users WHERE id = ?', [me]);
  if (!u) throw new HttpError(404, 'User not found.');
  const [agg] = await query(
    `SELECT
       SUM(status = 'completed') AS sessions_done,
       COALESCE(SUM(CASE WHEN status = 'completed' THEN proposer_mins + partner_mins END), 0) AS minutes,
       COUNT(DISTINCT CASE WHEN status IN ('confirmed','starting-soon','rescheduled','needs-rescheduling','completed')
             THEN IF(proposer_id = ?, partner_id, proposer_id) END) AS active_peers
     FROM sessions WHERE proposer_id = ? OR partner_id = ?`,
    [me, me, me]
  );
  const reviews = await query(
    `SELECT r.*, u.name AS reviewer_name, u.avatar_url AS reviewer_avatar
     FROM reviews r JOIN users u ON u.id = r.reviewer_id
     WHERE r.reviewee_id = ? ORDER BY r.created_at DESC, r.id DESC LIMIT 10`,
    [me]
  );
  res.json({
    stats: {
      trustScore: u.trust_score,
      timeSwappedHours: Math.round(Number(agg.minutes) / 60),
      activePeers: Number(agg.active_peers),
      sessionsDone: Number(agg.sessions_done ?? 0),
      peerRating: Number(u.rating),
      reviewCount: u.rating_count,
    },
    reviews: reviews.map((r) => ({
      id: `review-${r.id}`,
      reviewerName: r.reviewer_name,
      reviewerAvatar: r.reviewer_avatar,
      swappedFor: r.swapped_for,
      rating: Number(r.rating),
      comment: r.comment,
      sessionMins: r.session_mins,
      timeAgo: timeAgo(r.created_at),
    })),
  });
}));

// ---- My Skills (teach / learn portfolio): full CRUD ----

// GET /api/dashboard/skills
router.get('/skills', wrap<AuthedRequest>(async (req, res) => {
  const rows = await query('SELECT * FROM user_skills WHERE user_id = ? ORDER BY created_at DESC, id DESC', [req.userId]);
  res.json(rows.map(toUserSkill));
}));

// POST /api/dashboard/skills  { type, title, description }
router.post('/skills', wrap<AuthedRequest>(async (req, res) => {
  const type = req.body?.type === 'learn' ? 'learn' : 'teach';
  const title = str(req.body, 'title', { max: 160 });
  const description = str(req.body, 'description', { required: false, max: 2000 }) || 'Custom reciprocal curriculum module.';
  const r = await exec(
    'INSERT INTO user_skills (user_id, type, title, description, metric_note) VALUES (?, ?, ?, ?, ?)',
    [req.userId, type, title, description, type === 'teach' ? 'Instant Swap Ready' : 'Looking for Mentor']
  );
  const [row] = await query('SELECT * FROM user_skills WHERE id = ?', [r.insertId]);
  res.status(201).json(toUserSkill(row));
}));

// PUT /api/dashboard/skills/:id  { title, description, status? }
router.put('/skills/:id', wrap<AuthedRequest>(async (req, res) => {
  const status = req.body?.status === 'paused' ? 'paused' : req.body?.status === 'active' ? 'active' : null;
  const r = await exec(
    `UPDATE user_skills SET title = ?, description = ?, status = COALESCE(?, status) WHERE id = ? AND user_id = ?`,
    [str(req.body, 'title', { max: 160 }), str(req.body, 'description', { required: false, max: 2000 }), status,
     numId(req.params.id), req.userId]
  );
  if (!r.affectedRows) throw new HttpError(404, 'Skill not found.');
  const [row] = await query('SELECT * FROM user_skills WHERE id = ?', [numId(req.params.id)]);
  res.json(toUserSkill(row));
}));

// PATCH /api/dashboard/skills/:id/toggle   -> pause / activate
router.patch('/skills/:id/toggle', wrap<AuthedRequest>(async (req, res) => {
  const r = await exec(
    `UPDATE user_skills SET status = IF(status = 'active', 'paused', 'active') WHERE id = ? AND user_id = ?`,
    [numId(req.params.id), req.userId]
  );
  if (!r.affectedRows) throw new HttpError(404, 'Skill not found.');
  const [row] = await query('SELECT * FROM user_skills WHERE id = ?', [numId(req.params.id)]);
  res.json(toUserSkill(row));
}));

// DELETE /api/dashboard/skills/:id
router.delete('/skills/:id', wrap<AuthedRequest>(async (req, res) => {
  const r = await exec('DELETE FROM user_skills WHERE id = ? AND user_id = ?', [numId(req.params.id), req.userId]);
  if (!r.affectedRows) throw new HttpError(404, 'Skill not found.');
  res.status(204).end();
}));

export default router;
