import { Router } from 'express';
import { pool, exec, query } from '../db';
import { requireAuth, type AuthedRequest } from '../auth';
import { HttpError, str, wrap } from '../http';
import { numId, toListing } from '../mappers';

const router = Router();
const CATEGORIES = ['tech', 'creative', 'languages', 'music', 'business'];

const LISTING_SELECT = `
  SELECT l.*, u.name AS author_name, u.role AS author_role, u.avatar_url AS author_avatar,
         u.rating AS author_rating, u.swaps_count AS author_swaps, u.verified AS author_verified
  FROM skill_listings l
  JOIN users u ON u.id = l.user_id`;

async function withCurriculum(rows: any[]) {
  if (!rows.length) return [];
  const ids = rows.map((r) => r.id);
  const cur = await query('SELECT * FROM listing_curriculum WHERE listing_id IN (?) ORDER BY num', [ids]);
  return rows.map((r) => toListing(r, cur.filter((c) => c.listing_id === r.id)));
}

// GET /api/skills?q=react&category=tech   -> Read / Search (Skill Categories, Search)
router.get('/', wrap(async (req, res) => {
  const where: string[] = [];
  const params: unknown[] = [];
  const q = String(req.query.q ?? '').trim();
  const category = String(req.query.category ?? '');
  if (q) {
    where.push('(l.teaches LIKE ? OR l.wants LIKE ? OR u.name LIKE ?)');
    params.push(`%${q}%`, `%${q}%`, `%${q}%`);
  }
  if (CATEGORIES.includes(category)) {
    where.push('l.category = ?');
    params.push(category);
  }
  const rows = await query(
    `${LISTING_SELECT} ${where.length ? 'WHERE ' + where.join(' AND ') : ''} ORDER BY l.created_at DESC, l.id DESC`,
    params
  );
  res.json(await withCurriculum(rows));
}));

// GET /api/skills/:id   -> Skill Details
router.get('/:id', wrap(async (req, res) => {
  const rows = await query(`${LISTING_SELECT} WHERE l.id = ?`, [numId(req.params.id)]);
  if (!rows.length) throw new HttpError(404, 'Skill listing not found.');
  res.json((await withCurriculum(rows))[0]);
}));

// POST /api/skills   -> Create a teach/learn marketplace listing
router.post('/', requireAuth, wrap<AuthedRequest>(async (req, res) => {
  const b = req.body ?? {};
  const teaches = str(b, 'teaches', { max: 200 });
  const wants = str(b, 'wants', { max: 200 });
  const category = CATEGORIES.includes(b.category) ? b.category : 'tech';
  const sessions: { title: string; description?: string }[] = Array.isArray(b.curriculum?.sessions)
    ? b.curriculum.sessions.slice(0, 12)
    : [];

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    const [r]: any = await conn.query(
      `INSERT INTO skill_listings
        (user_id, teaches, wants, category, tier_badge, tier_badge_bg, ratio_label, hours_per_week,
         cycle_weeks, format_badge, prerequisites, mutual_deliverable)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        req.userId, teaches, wants, category,
        str(b, 'tierBadge', { required: false, max: 40 }) || 'Intermediate',
        str(b, 'tierBadgeBg', { required: false, max: 120 }) || 'bg-primary-fixed text-on-primary-fixed-variant',
        str(b, 'ratioLabel', { required: false, max: 60 }) || '1:1 Mutual Exchange',
        str(b, 'hoursPerWeek', { required: false, max: 40 }) || '1 hr / week',
        str(b, 'cycleWeeks', { required: false, max: 40 }) || null,
        str(b, 'formatBadge', { required: false, max: 60 }) || '1:1 Video Call',
        str(b.curriculum ?? {}, 'prerequisites', { required: false, max: 255 }) || null,
        str(b.curriculum ?? {}, 'mutualDeliverable', { required: false, max: 255 }) || null,
      ]
    );
    for (const [i, s] of sessions.entries()) {
      await conn.query(
        'INSERT INTO listing_curriculum (listing_id, num, title, description) VALUES (?, ?, ?, ?)',
        [r.insertId, i + 1, String(s.title ?? '').slice(0, 200), String(s.description ?? '').slice(0, 500)]
      );
    }
    await conn.commit();
    const rows = await query(`${LISTING_SELECT} WHERE l.id = ?`, [r.insertId]);
    res.status(201).json((await withCurriculum(rows))[0]);
  } catch (e) {
    await conn.rollback();
    throw e;
  } finally {
    conn.release();
  }
}));

// DELETE /api/skills/:id   -> remove your own listing
router.delete('/:id', requireAuth, wrap<AuthedRequest>(async (req, res) => {
  const r = await exec('DELETE FROM skill_listings WHERE id = ? AND user_id = ?', [numId(req.params.id), req.userId]);
  if (!r.affectedRows) throw new HttpError(404, 'Listing not found or not yours.');
  res.status(204).end();
}));

export default router;
