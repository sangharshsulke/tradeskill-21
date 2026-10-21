export type ScreenType = 'home' | 'skills' | 'people' | 'sessions' | 'dashboard' | 'about' | 'contact';

export interface SkillListing {
  id: string;
  authorName: string;
  authorRole: string;
  authorAvatar: string;
  rating: number;
  swapsCount: number;
  verified: boolean;
  tierBadge: string;
  tierBadgeBg: string;
  teaches: string;
  wants: string;
  ratioLabel: string;
  hoursPerWeek: string;
  cycleWeeks?: string;
  formatBadge: string;
  category: 'all' | 'tech' | 'creative' | 'languages' | 'music' | 'business';
  curriculum?: {
    sessions: { num: number; title: string; description: string }[];
    prerequisites: string;
    mutualDeliverable: string;
  };
}

export interface PeerProfile {
  id: string;
  name: string;
  badge?: string;
  verified: boolean;
  role: string;
  company?: string;
  location: string;
  timezone: string;
  availability: string;
  mutualMatchPct: number;
  rating: number;
  swapsCount: number;
  avatarUrl: string;
  offers: string[];
  wants: string[];
  bio: string;
  verifiedCredential: {
    title: string;
    issuer: string;
  };
  testimonial: {
    peerName: string;
    tradedFor: string;
    quote: string;
  };
}

export interface SessionItem {
  id: string;
  peerName: string;
  peerRole: string;
  peerAvatar: string;
  verified: boolean;
  timeLabel: string;
  dateGroup?: string;
  status: 'confirmed' | 'starting-soon' | 'rescheduled' | 'needs-rescheduling' | 'pending' | 'completed';
  youTeach: string;
  peerTeaches: string;
  teachMins: number;
  peerMins: number;
  note?: string;
  rating?: number;
  completedDate?: string;
}

export interface ExchangeInquiry {
  id: string;
  peerName: string;
  peerRole: string;
  peerAvatar: string;
  karma: number;
  offers: string;
  wants: string;
  note: string;
  ratioType: string;
  status: 'pending' | 'accepted' | 'declined';
}

export interface UserSkillItem {
  id: string;
  type: 'teach' | 'learn';
  title: string;
  description: string;
  hoursSpent: number;
  status: 'active' | 'paused';
  metricNote: string;
}

export interface SupportTicket {
  fullName: string;
  email: string;
  category: string;
  message: string;
}
