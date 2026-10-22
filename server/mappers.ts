// Convert MySQL rows (snake_case) into the shapes the React app already uses (src/types.ts)
import type {
  ExchangeInquiry,
  PeerProfile,
  SessionItem,
  SkillListing,
  UserSkillItem,
} from '../src/types';

export const id = (prefix: string, n: number) => `${prefix}-${n}`;

/** Parse "skill-12" / "12" -> 12 */
export const numId = (value: string | undefined): number => {
  const m = String(value ?? '').match(/(\d+)$/);
  return m ? Number(m[1]) : NaN;
};

export function toListing(row: any, curriculum: any[] = []): SkillListing {
  return {
    id: id('skill', row.id),
    authorId: id('user', row.user_id),
    authorName: row.author_name,
    authorRole: row.author_role,
    authorAvatar: row.author_avatar,
    rating: Number(row.author_rating),
    swapsCount: row.author_swaps,
    verified: !!row.author_verified,
    tierBadge: row.tier_badge,
    tierBadgeBg: row.tier_badge_bg,
    teaches: row.teaches,
    wants: row.wants,
    ratioLabel: row.ratio_label,
    hoursPerWeek: row.hours_per_week,
    cycleWeeks: row.cycle_weeks ?? undefined,
    formatBadge: row.format_badge,
    category: row.category,
    curriculum: curriculum.length
      ? {
          sessions: curriculum.map((c) => ({ num: c.num, title: c.title, description: c.description })),
          prerequisites: row.prerequisites ?? '',
          mutualDeliverable: row.mutual_deliverable ?? '',
        }
      : undefined,
  };
}

export function toUserSkill(row: any): UserSkillItem {
  return {
    id: id('user-skill', row.id),
    type: row.type,
    title: row.title,
    description: row.description,
    hoursSpent: Number(row.hours_spent),
    status: row.status,
    metricNote: row.metric_note,
  };
}

export function toPeer(row: any, skills: any[], review?: any): PeerProfile {
  return {
    id: id('user', row.id),
    name: row.name,
    badge: row.badge ?? undefined,
    verified: !!row.verified,
    role: row.role,
    company: row.company ?? undefined,
    location: row.location,
    timezone: row.timezone,
    availability: row.availability,
    mutualMatchPct: row.mutual_match_pct,
    rating: Number(row.rating),
    swapsCount: row.swaps_count,
    avatarUrl: row.avatar_url,
    offers: skills.filter((s) => s.type === 'teach').map((s) => s.title),
    wants: skills.filter((s) => s.type === 'learn').map((s) => s.title),
    bio: row.bio ?? '',
    verifiedCredential: {
      title: row.credential_title ?? 'Identity verified',
      issuer: row.credential_issuer ?? 'TradeSkill',
    },
    testimonial: review
      ? {
          peerName: `${review.reviewer_name} (Traded for ${review.swapped_for})`,
          tradedFor: `${review.session_mins >= 60 ? review.session_mins / 60 + 'h' : review.session_mins + 'm'} Exchange`,
          quote: review.comment,
        }
      : { peerName: 'No reviews yet', tradedFor: '', quote: 'Be the first to swap with this member!' },
  };
}

/** Session row joined with both users -> SessionItem from the viewer's point of view */
export function toSession(row: any, viewerId: number): SessionItem {
  const iAmProposer = row.proposer_id === viewerId;
  const p = iAmProposer ? 'partner' : 'proposer';
  return {
    id: id('session', row.id),
    peerName: row[`${p}_name`],
    peerRole: row[`${p}_role`],
    peerAvatar: row[`${p}_avatar`],
    verified: !!row[`${p}_verified`],
    timeLabel: row.status === 'completed' && row.completed_at
      ? `Completed on ${fmtDate(row.completed_at)} • ${row.proposer_mins + row.partner_mins}m swap`
      : row.time_label,
    dateGroup: row.date_group ?? undefined,
    status: row.status,
    youTeach: iAmProposer ? row.proposer_teaches : row.partner_teaches,
    peerTeaches: iAmProposer ? row.partner_teaches : row.proposer_teaches,
    teachMins: iAmProposer ? row.proposer_mins : row.partner_mins,
    peerMins: iAmProposer ? row.partner_mins : row.proposer_mins,
    note: row.note ?? undefined,
    rating: row.my_rating != null ? Number(row.my_rating) : undefined,
    completedDate: row.completed_at ? fmtDate(row.completed_at) : undefined,
    isIncoming: !iAmProposer,
  };
}

export function toInquiry(row: any): ExchangeInquiry {
  return {
    id: id('inquiry', row.id),
    peerName: row.from_name,
    peerRole: `${row.from_role} • ${row.from_trust}% Karma`,
    peerAvatar: row.from_avatar,
    karma: row.from_trust,
    offers: row.offers,
    wants: row.wants,
    note: row.note ?? '',
    ratioType: row.ratio_type,
    status: row.status,
  };
}

export const fmtDate = (d: Date | string) =>
  new Date(d).toLocaleDateString('en-US', { month: 'short', day: '2-digit' });

export function timeAgo(d: Date | string): string {
  const days = Math.floor((Date.now() - new Date(d).getTime()) / 86_400_000);
  if (days <= 0) return 'Today';
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days} days ago`;
  if (days < 14) return 'Last week';
  return fmtDate(d);
}
