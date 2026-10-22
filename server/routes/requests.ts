import { Router } from 'express';
import { pool, exec, query } from '../db';
import type { AuthedRequest } from '../auth';
import { HttpError, str, wrap } from '../http';
import { numId, toInquiry } from '../mappers';
import { resolveUser } from './sessions';

const router = Router();

const REQUEST_SELECT = `
  SELECT r.*, u.name AS from_name, u.role AS from_role, u.avatar_url AS from_avatar, u.trust_score AS from_trust
  FROM exchange_requests r JOIN users u ON u.id = r.from_user_id`;

// GET /api/requests   -> exchange requests sent to you (Dashboard > Requests, notifications)
router.get('/', wrap<AuthedRequest>(async (req, res) => {
  const rows = await query(`${REQUEST_SELECT} WHERE r.to_user_id = ? ORDER BY r.created_at DESC, r.id DESC`, [req.userId]);
  res.json(rows.map(toInquiry));
}));

// POST /api/requests  { toUserId | peerName, listingId?, offers?, wants, note? }   -> Send exchange request
router.post('/', wrap<AuthedRequest>(async (req, res) => {
  const me = req.userId!;
  const peer = await resolveUser(req.body);
  if (peer.id === me) throw new HttpError(400, "That's your own listing — you can't trade with yourself.");

  const wants = str(req.body, 'wants', { max: 200 });
  // default "offer" = your first active teach skill
  let offers = str(req.body, 'offers', { required: false, max: 200 });
  if (!offers) {
    const [mine] = await query(
      `SELECT title FROM user_skills WHERE user_id = ? AND type = 'teach' AND status = 'active' ORDER BY id LIMIT 1`,
      [me]
    );
    if (!mine) throw new HttpError(400, 'Add a skill you can teach on your Dashboard before requesting a trade.');
    offers = mine.title;
  }
  const [dupe] = await query(
    `SELECT id FROM exchange_requests WHERE from_user_id = ? AND to_user_id = ? AND wants = ? AND status = 'pending'`,
    [me, peer.id, wants]
  );
  if (dupe) throw new HttpError(409, `You already have a pending request with ${peer.name} for this skill.`);

  const listingId = numId(req.body?.listingId);
  const r = await exec(
    `INSERT INTO exchange_requests (from_user_id, to_user_id, listing_id, offers, wants, note, ratio_type)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      me, peer.id, Number.isFinite(listingId) ? listingId : null, offers, wants,
      str(req.body, 'note', { required: false, max: 2000 }) || null,
      str(req.body, 'ratioType', { required: false, max: 40 }) || '1:1 Direct',
    ]
  );
  res.status(201).json({ id: `inquiry-${r.insertId}`, peerName: peer.name, offers, wants, status: 'pending' });
}));

// PATCH /api/requests/:id/accept   -> Update; also schedules a session
router.patch('/:id/accept', wrap<AuthedRequest>(async (req, res) => {
  const me = req.userId!;
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    const [[row]]: any = await conn.query(
      'SELECT * FROM exchange_requests WHERE id = ? AND to_user_id = ? FOR UPDATE',
      [numId(req.params.id), me]
    );
    if (!row) throw new HttpError(404, 'Request not found.');
    if (row.status !== 'pending') throw new HttpError(409, `This request was already ${row.status}.`);
    await conn.query(`UPDATE exchange_requests SET status = 'accepted' WHERE id = ?`, [row.id]);
    // requester teaches what they offered; you teach what they wanted
    await conn.query(
      `INSERT INTO sessions (proposer_id, partner_id, request_id, proposer_teaches, partner_teaches, time_label, status)
       VALUES (?, ?, ?, ?, ?, 'Next Week • Proposed Slot', 'confirmed')`,
      [row.from_user_id, me, row.id, row.offers, row.wants]
    );
    await conn.commit();
  } catch (e) {
    await conn.rollback();
    throw e;
  } finally {
    conn.release();
  }
  const [updated] = await query(`${REQUEST_SELECT} WHERE r.id = ?`, [numId(req.params.id)]);
  res.json(toInquiry(updated));
}));

// PATCH /api/requests/:id/decline
router.patch('/:id/decline', wrap<AuthedRequest>(async (req, res) => {
  const r = await exec(
    `UPDATE exchange_requests SET status = 'declined' WHERE id = ? AND to_user_id = ? AND status = 'pending'`,
    [numId(req.params.id), req.userId]
  );
  if (!r.affectedRows) throw new HttpError(404, 'Pending request not found.');
  const [updated] = await query(`${REQUEST_SELECT} WHERE r.id = ?`, [numId(req.params.id)]);
  res.json(toInquiry(updated));
}));

export default router;
