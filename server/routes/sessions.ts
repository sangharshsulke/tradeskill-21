import { Router } from 'express';
import { pool, exec, query } from '../db';
import type { AuthedRequest } from '../auth';
import { HttpError, str, wrap } from '../http';
import { numId, toSession } from '../mappers';

const router = Router();

export const SESSION_SELECT = `
  SELECT s.*,
    a.name AS proposer_name, a.role AS proposer_role, a.avatar_url AS proposer_avatar, a.verified AS proposer_verified,
    b.name AS partner_name,  b.role AS partner_role,  b.avatar_url AS partner_avatar,  b.verified AS partner_verified,
    (SELECT r.rating FROM reviews r WHERE r.session_id = s.id AND r.reviewer_id = ?) AS my_rating
  FROM sessions s
  JOIN users a ON a.id = s.proposer_id
  JOIN users b ON b.id = s.partner_id`;

/** Finds a user by "user-12" id or by display name (used by forms that only know the name) */
export async function resolveUser(body: any): Promise<any> {
  const byId = numId(body?.peerId ?? body?.toUserId);
  const rows = Number.isFinite(byId)
    ? await query('SELECT * FROM users WHERE id = ?', [byId])
    : await query('SELECT * FROM users WHERE name = ? LIMIT 1', [String(body?.peerName ?? '').trim()]);
  if (!rows.length) throw new HttpError(404, 'That member could not be found.');
  return rows[0];
}

async function loadOne(sessionId: number, viewerId: number) {
  const [row] = await query(
    `${SESSION_SELECT} WHERE s.id = ? AND (s.proposer_id = ? OR s.partner_id = ?)`,
    [viewerId, sessionId, viewerId, viewerId]
  );
  if (!row) throw new HttpError(404, 'Session not found.');
  return row;
}

const UPCOMING_RANK = (status: string) => (status === 'starting-soon' ? 0 : status === 'pending' ? 2 : 1);

// GET /api/sessions   -> Available/My Sessions + history, grouped for the Sessions page
router.get('/', wrap<AuthedRequest>(async (req, res) => {
  const me = req.userId!;
  const rows = await query(
    `${SESSION_SELECT}
     WHERE (s.proposer_id = ? OR s.partner_id = ?) AND s.status NOT IN ('declined','cancelled')
     ORDER BY COALESCE(s.completed_at, s.created_at) DESC, s.id DESC`,
    [me, me, me]
  );
  const items = rows.map((r) => ({ row: r, item: toSession(r, me) }));
  res.json({
    // soonest first: starting-soon, then scheduled, then your proposals still awaiting a reply
    upcoming: items
      .filter(({ row }) => row.status !== 'completed' && !(row.status === 'pending' && row.partner_id === me))
      .sort((a, b) => UPCOMING_RANK(a.row.status) - UPCOMING_RANK(b.row.status))
      .map((x) => x.item),
    pending: items.filter(({ row }) => row.status === 'pending' && row.partner_id === me).map((x) => x.item),
    completed: items.filter(({ row }) => row.status === 'completed').map((x) => x.item),
  });
}));

// GET /api/sessions/:id   -> Session Details
router.get('/:id', wrap<AuthedRequest>(async (req, res) => {
  res.json(toSession(await loadOne(numId(req.params.id), req.userId!), req.userId!));
}));

// POST /api/sessions   -> Schedule a session (Propose Swap)
router.post('/', wrap<AuthedRequest>(async (req, res) => {
  const peer = await resolveUser(req.body);
  if (peer.id === req.userId) throw new HttpError(400, "You can't schedule a session with yourself.");
  const youTeach = str(req.body, 'youTeach', { max: 200 });
  const peerTeaches = str(req.body, 'peerTeaches', { max: 200 });
  const mins = Math.min(Math.max(Number(req.body?.minutes) || 45, 15), 240);
  const r = await exec(
    `INSERT INTO sessions (proposer_id, partner_id, proposer_teaches, partner_teaches, proposer_mins, partner_mins, time_label, status, note)
     VALUES (?, ?, ?, ?, ?, ?, ?, 'pending', ?)`,
    [
      req.userId, peer.id, youTeach, peerTeaches, mins, mins,
      str(req.body, 'timeLabel', { required: false, max: 120 }) || `Pending Confirmation • ${mins * 2}m`,
      str(req.body, 'note', { required: false, max: 2000 }) || null,
    ]
  );
  res.status(201).json(toSession(await loadOne(r.insertId, req.userId!), req.userId!));
}));

/** Shared guard + update for the PATCH actions below */
async function transition(
  req: AuthedRequest,
  opts: { allowed: string[]; onlyPartner?: boolean; set: Record<string, unknown> }
) {
  const me = req.userId!;
  const row = await loadOne(numId(req.params.id), me);
  if (opts.onlyPartner && row.partner_id !== me) {
    throw new HttpError(403, 'Only the invited partner can respond to this request.');
  }
  if (!opts.allowed.includes(row.status)) {
    throw new HttpError(409, `This session is already ${row.status}.`);
  }
  const cols = Object.keys(opts.set);
  await exec(
    `UPDATE sessions SET ${cols.map((c) => `${c} = ?`).join(', ')} WHERE id = ?`,
    [...cols.map((c) => opts.set[c]), row.id]
  );
  return toSession(await loadOne(row.id, me), me);
}

const ACTIVE = ['confirmed', 'starting-soon', 'rescheduled', 'needs-rescheduling', 'pending'];

// PATCH /api/sessions/:id/accept | decline   -> Update (accept / reject)
router.patch('/:id/accept', wrap<AuthedRequest>(async (req, res) => {
  res.json(await transition(req, { allowed: ['pending'], onlyPartner: true, set: { status: 'confirmed' } }));
}));
router.patch('/:id/decline', wrap<AuthedRequest>(async (req, res) => {
  res.json(await transition(req, { allowed: ['pending'], onlyPartner: true, set: { status: 'declined' } }));
}));

// PATCH /api/sessions/:id/reschedule  { timeLabel, note }
router.patch('/:id/reschedule', wrap<AuthedRequest>(async (req, res) => {
  res.json(await transition(req, {
    allowed: ACTIVE,
    set: {
      time_label: str(req.body, 'timeLabel', { max: 120 }),
      note: str(req.body, 'note', { required: false, max: 2000 }) || null,
      date_group: null,
      status: 'rescheduled',
    },
  }));
}));

// PATCH /api/sessions/:id/notes  { note }   -> prep notes
router.patch('/:id/notes', wrap<AuthedRequest>(async (req, res) => {
  res.json(await transition(req, {
    allowed: ACTIVE,
    set: { note: str(req.body, 'note', { required: false, max: 4000 }) || null },
  }));
}));

// PATCH /api/sessions/:id/cancel
router.patch('/:id/cancel', wrap<AuthedRequest>(async (req, res) => {
  res.json(await transition(req, { allowed: ACTIVE, set: { status: 'cancelled' } }));
}));

// PATCH /api/sessions/:id/complete   -> moves to history and bumps both members' swap counts
router.patch('/:id/complete', wrap<AuthedRequest>(async (req, res) => {
  const result = await transition(req, {
    allowed: ['confirmed', 'starting-soon', 'rescheduled', 'needs-rescheduling'],
    set: { status: 'completed', completed_at: new Date() },
  });
  const row = await loadOne(numId(req.params.id), req.userId!);
  await exec('UPDATE users SET swaps_count = swaps_count + 1 WHERE id IN (?, ?)', [row.proposer_id, row.partner_id]);
  // log taught/learned hours on matching portfolio skills
  const logHours = `UPDATE user_skills SET hours_spent = hours_spent + ? / 60
                    WHERE user_id = ? AND type = 'teach' AND title = ?`;
  await exec(logHours, [row.proposer_mins, row.proposer_id, row.proposer_teaches]);
  await exec(logHours, [row.partner_mins, row.partner_id, row.partner_teaches]);
  res.json(result);
}));

// POST /api/sessions/:id/review  { rating, comment }   -> Rate your learning partner
router.post('/:id/review', wrap<AuthedRequest>(async (req, res) => {
  const me = req.userId!;
  const row = await loadOne(numId(req.params.id), me);
  if (row.status !== 'completed') throw new HttpError(409, 'You can rate a partner once the session is completed.');
  const rating = Number(req.body?.rating);
  if (!(rating >= 1 && rating <= 5)) throw new HttpError(400, 'Rating must be between 1 and 5.');
  const comment = str(req.body, 'comment', { max: 2000 });
  const iAmProposer = row.proposer_id === me;
  const revieweeId = iAmProposer ? row.partner_id : row.proposer_id;
  const swappedFor = iAmProposer ? row.partner_teaches : row.proposer_teaches;

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    await conn.query(
      `INSERT INTO reviews (session_id, reviewer_id, reviewee_id, rating, comment, swapped_for, session_mins)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [row.id, me, revieweeId, Math.round(rating * 10) / 10, comment, swappedFor, row.proposer_mins + row.partner_mins]
    );
    // running average on the user row
    await conn.query(
      `UPDATE users SET rating = ROUND((rating * rating_count + ?) / (rating_count + 1), 2), rating_count = rating_count + 1
       WHERE id = ?`,
      [rating, revieweeId]
    );
    await conn.commit();
  } catch (e: any) {
    await conn.rollback();
    if (e?.code === 'ER_DUP_ENTRY') throw new HttpError(409, 'You already rated this session.');
    throw e;
  } finally {
    conn.release();
  }
  res.status(201).json(toSession(await loadOne(row.id, me), me));
}));

export default router;
