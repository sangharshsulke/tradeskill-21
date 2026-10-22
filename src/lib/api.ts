// Small fetch wrapper for the Express + MySQL API (see /server). Vite proxies /api -> localhost:4000.
import type {
  CurrentUser,
  DashboardStats,
  ExchangeInquiry,
  PeerProfile,
  ReviewItem,
  SessionItem,
  SkillListing,
  SupportTicket,
  UserSkillItem,
} from '../types';

const TOKEN_KEY = 'tradeskill_token';

export const auth = {
  get token(): string | null {
    try {
      return localStorage.getItem(TOKEN_KEY);
    } catch {
      return null;
    }
  },
  set(token: string | null) {
    try {
      if (token) localStorage.setItem(TOKEN_KEY, token);
      else localStorage.removeItem(TOKEN_KEY);
    } catch {
      /* storage unavailable */
    }
  },
};

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

async function request<T>(method: string, path: string, body?: unknown): Promise<T> {
  const headers: Record<string, string> = {};
  if (body !== undefined) headers['Content-Type'] = 'application/json';
  if (auth.token) headers.Authorization = `Bearer ${auth.token}`;

  let res: Response;
  try {
    res = await fetch(`/api${path}`, { method, headers, body: body !== undefined ? JSON.stringify(body) : undefined });
  } catch {
    throw new ApiError(0, 'Cannot reach the API server. Is `npm run server` running?');
  }
  if (res.status === 204) return undefined as T;
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new ApiError(res.status, data.error || `Request failed (${res.status})`);
  return data as T;
}

const get = <T>(p: string) => request<T>('GET', p);
const post = <T>(p: string, b?: unknown) => request<T>('POST', p, b ?? {});
const put = <T>(p: string, b?: unknown) => request<T>('PUT', p, b ?? {});
const patch = <T>(p: string, b?: unknown) => request<T>('PATCH', p, b ?? {});
const del = (p: string) => request<void>('DELETE', p);

type AuthResult = { token: string; user: CurrentUser };
export type SessionLists = { upcoming: SessionItem[]; pending: SessionItem[]; completed: SessionItem[] };

export const api = {
  // Auth
  login: (email: string, password: string) => post<AuthResult>('/auth/login', { email, password }),
  register: (name: string, email: string, password: string, role?: string) =>
    post<AuthResult>('/auth/register', { name, email, password, role }),
  me: () => get<CurrentUser>('/auth/me'),
  setAvailability: (available: boolean) => patch<CurrentUser>('/auth/me/availability', { available }),

  // Skills marketplace
  listSkills: (q = '', category = '') =>
    get<SkillListing[]>(`/skills?q=${encodeURIComponent(q)}&category=${encodeURIComponent(category)}`),
  createSkill: (listing: Partial<SkillListing>) => post<SkillListing>('/skills', listing),
  deleteSkill: (id: string) => del(`/skills/${id}`),

  // People
  listPeople: (q = '') => get<PeerProfile[]>(`/people?q=${encodeURIComponent(q)}`),

  // Exchange requests
  listRequests: () => get<ExchangeInquiry[]>('/requests'),
  sendRequest: (body: { toUserId?: string; peerName?: string; listingId?: string; wants: string; offers?: string; note?: string }) =>
    post<{ id: string; peerName: string }>('/requests', body),
  acceptRequest: (id: string) => patch<ExchangeInquiry>(`/requests/${id}/accept`),
  declineRequest: (id: string) => patch<ExchangeInquiry>(`/requests/${id}/decline`),

  // Sessions
  listSessions: () => get<SessionLists>('/sessions'),
  proposeSession: (body: { peerName: string; youTeach: string; peerTeaches: string; minutes?: number }) =>
    post<SessionItem>('/sessions', body),
  acceptSession: (id: string) => patch<SessionItem>(`/sessions/${id}/accept`),
  declineSession: (id: string) => patch<SessionItem>(`/sessions/${id}/decline`),
  rescheduleSession: (id: string, timeLabel: string, note: string) =>
    patch<SessionItem>(`/sessions/${id}/reschedule`, { timeLabel, note }),
  saveSessionNotes: (id: string, note: string) => patch<SessionItem>(`/sessions/${id}/notes`, { note }),
  cancelSession: (id: string) => patch<SessionItem>(`/sessions/${id}/cancel`),
  completeSession: (id: string) => patch<SessionItem>(`/sessions/${id}/complete`),
  reviewSession: (id: string, rating: number, comment: string) =>
    post<SessionItem>(`/sessions/${id}/review`, { rating, comment }),

  // Dashboard
  dashboard: () => get<{ stats: DashboardStats; reviews: ReviewItem[] }>('/dashboard'),
  listMySkills: () => get<UserSkillItem[]>('/dashboard/skills'),
  addMySkill: (s: { type: 'teach' | 'learn'; title: string; description: string }) =>
    post<UserSkillItem>('/dashboard/skills', s),
  updateMySkill: (id: string, s: { title: string; description: string }) => put<UserSkillItem>(`/dashboard/skills/${id}`, s),
  toggleMySkill: (id: string) => patch<UserSkillItem>(`/dashboard/skills/${id}/toggle`),
  deleteMySkill: (id: string) => del(`/dashboard/skills/${id}`),

  // Contact
  submitTicket: (t: SupportTicket) => post<{ ticketCode: string }>('/support', t),
};
