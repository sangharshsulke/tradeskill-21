/**
 * Creates the `tradeskill` database, all tables (schema.sql) and demo data
 * taken from src/data/mockData.ts.
 *
 *   npm run db:setup
 *
 * Every demo account uses the password: password123
 * Main demo login: elena@tradeskill.dev
 */
import 'dotenv/config';
import bcrypt from 'bcryptjs';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import mysql from 'mysql2/promise';
import { dbConfig } from './db';
import {
  currentUser,
  initialCompletedSessions,
  initialInquiries,
  initialPendingRequests,
  initialSessions,
  initialSkillListings,
  initialUserPortfolio,
  mockPeerProfiles,
} from '../src/data/mockData';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DEMO_PASSWORD = 'password123';

const emailFor = (name: string) =>
  name.toLowerCase().normalize('NFD').replace(/[^a-z ]/g, '').trim().split(/\s+/).join('.') + '@tradeskill.dev';
const avatarFor = (name: string) =>
  `https://ui-avatars.com/api/?background=random&name=${encodeURIComponent(name)}`;

async function main() {
  const { database, ...server } = dbConfig;
  const admin = await mysql.createConnection({ ...server, multipleStatements: true });
  await admin.query(`CREATE DATABASE IF NOT EXISTS \`${database}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
  await admin.query(`USE \`${database}\``);
  await admin.query(fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8'));
  console.log(`✔ Tables created in "${database}"`);

  const db = admin;
  const hash = await bcrypt.hash(DEMO_PASSWORD, 10);
  const userIds = new Map<string, number>();

  async function addUser(u: {
    name: string; role: string; avatar?: string; title?: string; badge?: string; company?: string;
    location?: string; timezone?: string; availability?: string; bio?: string; verified?: boolean;
    trust?: number; match?: number; rating?: number; swaps?: number; credTitle?: string; credIssuer?: string;
    email?: string;
  }) {
    if (userIds.has(u.name)) return userIds.get(u.name)!;
    const [r]: any = await db.query(
      `INSERT INTO users (name, email, password_hash, role, title, badge, company, location, timezone, availability,
         avatar_url, bio, verified, trust_score, mutual_match_pct, rating, rating_count, swaps_count,
         credential_title, credential_issuer)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        u.name, u.email ?? emailFor(u.name), hash, u.role, u.title ?? 'Exchange Member', u.badge ?? null,
        u.company ?? null, u.location ?? '', u.timezone ?? 'UTC+0', u.availability ?? 'Flexible',
        u.avatar ?? avatarFor(u.name), u.bio ?? null, u.verified === false ? 0 : 1, u.trust ?? 90,
        u.match ?? 85, u.rating ?? 4.8, u.swaps ?? 10, u.swaps ?? 10, u.credTitle ?? null, u.credIssuer ?? null,
      ]
    );
    userIds.set(u.name, r.insertId);
    return r.insertId as number;
  }
  const skill = (userId: number, type: 'teach' | 'learn', title: string, description = '', hours = 0, note = '') =>
    db.query(
      'INSERT INTO user_skills (user_id, type, title, description, hours_spent, metric_note) VALUES (?, ?, ?, ?, ?, ?)',
      [userId, type, title, description || `${type === 'teach' ? 'Teaching' : 'Learning'} ${title}.`, hours,
       note || (type === 'teach' ? 'Instant Swap Ready' : 'Looking for Mentor')]
    );

  // 1. You (demo login)
  const me = await addUser({
    name: currentUser.name, role: currentUser.role, title: currentUser.title, avatar: currentUser.avatar,
    trust: currentUser.trustScore, rating: currentUser.peerRating, swaps: currentUser.sessionsDone,
    location: 'Lisbon (UTC+0)', email: 'elena@tradeskill.dev',
  });
  for (const s of [...initialUserPortfolio].reverse()) {
    await skill(me, s.type, s.title, s.description, s.hoursSpent, s.metricNote);
  }

  // 2. People directory
  for (const p of mockPeerProfiles) {
    const uid = await addUser({
      name: p.name, role: p.role, avatar: p.avatarUrl, badge: p.badge, company: p.company, location: p.location,
      timezone: p.timezone, availability: p.availability, bio: p.bio, verified: p.verified, match: p.mutualMatchPct,
      rating: p.rating, swaps: p.swapsCount, credTitle: p.verifiedCredential.title, credIssuer: p.verifiedCredential.issuer,
    });
    for (const o of p.offers) await skill(uid, 'teach', o);
    for (const w of p.wants) await skill(uid, 'learn', w);
  }

  // 3. Marketplace listings (+ their authors)
  for (const l of [...initialSkillListings].reverse()) {
    const uid = await addUser({ name: l.authorName, role: l.authorRole, avatar: l.authorAvatar, rating: l.rating, swaps: l.swapsCount, verified: l.verified, match: 88 });
    if (uid !== me) {
      await skill(uid, 'teach', l.teaches);
      await skill(uid, 'learn', l.wants);
    }
    const [r]: any = await db.query(
      `INSERT INTO skill_listings (user_id, teaches, wants, category, tier_badge, tier_badge_bg, ratio_label,
         hours_per_week, cycle_weeks, format_badge, prerequisites, mutual_deliverable)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [uid, l.teaches, l.wants, l.category, l.tierBadge, l.tierBadgeBg, l.ratioLabel, l.hoursPerWeek,
       l.cycleWeeks ?? null, l.formatBadge, l.curriculum?.prerequisites ?? null, l.curriculum?.mutualDeliverable ?? null]
    );
    for (const c of l.curriculum?.sessions ?? []) {
      await db.query('INSERT INTO listing_curriculum (listing_id, num, title, description) VALUES (?, ?, ?, ?)',
        [r.insertId, c.num, c.title, c.description]);
    }
  }

  // 4. Sessions
  const sessionIds = new Map<string, number>();
  const peerOf = async (s: { peerName: string; peerRole: string; peerAvatar: string; youTeach: string; peerTeaches: string }) => {
    const existed = userIds.has(s.peerName);
    const uid = await addUser({ name: s.peerName, role: s.peerRole, avatar: s.peerAvatar });
    if (!existed) {
      await skill(uid, 'teach', s.peerTeaches);
      await skill(uid, 'learn', s.youTeach);
    }
    return uid;
  };
  for (const s of [...initialSessions].reverse()) {
    const peer = await peerOf(s);
    const [r]: any = await db.query(
      `INSERT INTO sessions (proposer_id, partner_id, proposer_teaches, partner_teaches, proposer_mins, partner_mins, time_label, date_group, status, note)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [me, peer, s.youTeach, s.peerTeaches, s.teachMins, s.peerMins, s.timeLabel, s.dateGroup ?? null, s.status, s.note ?? null]
    );
    sessionIds.set(s.id, r.insertId);
  }
  for (const s of [...initialPendingRequests].reverse()) {
    // Elena Rostova in this list is a *different* person than you; give her a distinct name
    const peerName = s.peerName === currentUser.name ? 'Elena Rossi' : s.peerName;
    const peer = await peerOf({ ...s, peerName });
    await db.query(
      `INSERT INTO sessions (proposer_id, partner_id, proposer_teaches, partner_teaches, proposer_mins, partner_mins, time_label, status, note)
       VALUES (?, ?, ?, ?, ?, ?, ?, 'pending', ?)`,
      [peer, me, s.peerTeaches, s.youTeach, s.peerMins, s.teachMins, s.timeLabel, s.note ?? null]
    );
  }
  const completedDates: Record<string, string> = { 'completed-sarah': '2026-10-14 17:00:00', 'completed-david': '2026-10-02 17:00:00' };
  for (const s of [...initialCompletedSessions].reverse()) {
    const peer = await peerOf(s);
    const [r]: any = await db.query(
      `INSERT INTO sessions (proposer_id, partner_id, proposer_teaches, partner_teaches, proposer_mins, partner_mins, time_label, status, completed_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, 'completed', ?)`,
      [me, peer, s.youTeach, s.peerTeaches, s.teachMins, s.peerMins, s.timeLabel, completedDates[s.id] ?? new Date()]
    );
    sessionIds.set(s.id, r.insertId);
    // your rating of that partner
    await db.query(
      `INSERT INTO reviews (session_id, reviewer_id, reviewee_id, rating, comment, swapped_for, session_mins, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [r.insertId, me, peer, s.rating ?? 5, `Great ${s.peerTeaches} session — clear and well prepared.`, s.peerTeaches,
       s.teachMins + s.peerMins, completedDates[s.id] ?? new Date()]
    );
  }

  // 5. Reviews you received (Dashboard > Reviews) and peer testimonials (People > Profile)
  const soraya = await addUser({
    name: 'Soraya Chen', role: 'Compiler Engineer',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA3YNqvuWa24KUxsrByQg7UoNY8X4OszOHhloJTQCtxtqWfe8tO-7rZ9rhKuQZGtBPWVXu-bfjL93b3Lu13r0aEvfEYHj1ot80fh54Rf63G9qs7-9RcbRlVIdJ3G60jZkOr3K0CrM_CLCnw4NyxwrQ4HD4KMM3cb7oEOkeNOLd2DJd-QAW1AW99s8TIB4TybG11AGCeroAer7bjuoin_ESp_KdD4QJO6H24I1ZY3mq3j6nWgm7IG64',
  });
  await skill(soraya, 'teach', 'TypeScript AST Parsing');
  await skill(soraya, 'learn', 'Senior React Mentoring');
  const daysAgo = (n: number) => new Date(Date.now() - n * 86_400_000);
  const review = (session: number | null, from: number, to: number, comment: string, swappedFor: string, mins: number, when: Date) =>
    db.query(
      `INSERT INTO reviews (session_id, reviewer_id, reviewee_id, rating, comment, swapped_for, session_mins, created_at)
       VALUES (?, ?, ?, 5.0, ?, ?, ?, ?)`,
      [session, from, to, comment, swappedFor, mins, when]
    );
  await review(sessionIds.get('completed-david')!, userIds.get("David O'Reilly")!, me,
    "Her Figma prototyping breakdown helped me secure our team’s quarterly buy-in. Super generous with time and shared her personal component kits. Can't wait for our next trade session.",
    'Product Narrative Pitching', 60, daysAgo(8));
  await review(null, soraya, me,
    'Elena unlocked React server components for me in 90 minutes faster than weeks of tutorials. Honest, patient, and deeply thoughtful with code critiques. A quintessential TradeSkill barter partner!',
    'TypeScript AST Parsing', 120, daysAgo(2));
  for (const p of mockPeerProfiles) {
    const m = p.testimonial.peerName.match(/^(.*?) \(Traded for (.*)\)$/);
    const reviewerName = m?.[1] === 'Maya L.' ? 'Maya Lin' : (m?.[1] ?? 'TradeSkill Member');
    const reviewer = await addUser({ name: reviewerName, role: 'TradeSkill Member' });
    const mins = /2h/.test(p.testimonial.tradedFor) ? 120 : 60;
    await review(null, reviewer, userIds.get(p.name)!, p.testimonial.quote.replace(/^"|"$/g, ''), m?.[2] ?? '', mins, daysAgo(5));
  }

  // 6. Exchange requests sent to you (Dashboard > Requests)
  for (const inq of [...initialInquiries].reverse()) {
    const uid = await addUser({ name: inq.peerName, role: inq.peerRole.split(' • ')[0], avatar: inq.peerAvatar, trust: inq.karma });
    await db.query(
      `INSERT INTO exchange_requests (from_user_id, to_user_id, offers, wants, note, ratio_type, status) VALUES (?, ?, ?, ?, ?, ?, 'pending')`,
      [uid, me, inq.offers, inq.wants, inq.note, inq.ratioType]
    );
    const [[has]]: any = await db.query('SELECT COUNT(*) AS n FROM user_skills WHERE user_id = ?', [uid]);
    if (!has.n) {
      await skill(uid, 'teach', inq.offers);
      await skill(uid, 'learn', inq.wants);
    }
  }

  await db.end();
  console.log(`✔ Seeded ${userIds.size} members`);
  console.log(`\n  Log in with: elena@tradeskill.dev / ${DEMO_PASSWORD}`);
  console.log(`  (every demo member uses the same password, e.g. kenji.takahashi@tradeskill.dev)\n`);
}

main().catch((e) => {
  console.error('✖ Database setup failed:', e.message);
  if (e.code === 'ECONNREFUSED') console.error('  MySQL is not running or DB_HOST/DB_PORT in .env are wrong.');
  if (e.code === 'ER_ACCESS_DENIED_ERROR') console.error('  Check DB_USER / DB_PASSWORD in .env.');
  process.exit(1);
});
