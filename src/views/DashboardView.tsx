import React, { useState } from 'react';
import { UserSkillItem, ExchangeInquiry, CurrentUser, DashboardStats, ReviewItem } from '../types';

interface DashboardViewProps {
  user: CurrentUser | null;
  stats: DashboardStats | null;
  reviews: ReviewItem[];
  onToggleAvailability: () => void;
  inquiries: ExchangeInquiry[];
  onAcceptInquiry: (inquiry: ExchangeInquiry) => void;
  onDeclineInquiry: (inquiry: ExchangeInquiry) => void;
  userSkills: UserSkillItem[];
  onAddUserSkill: (skill: UserSkillItem) => void;
  onTogglePauseSkill: (id: string) => void;
  onDeleteSkill: (id: string) => void;
  onEditSkill: (skill: UserSkillItem) => void;
  onShowToast: (msg: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  inquiries,
  onAcceptInquiry,
  onDeclineInquiry,
  userSkills,
  onAddUserSkill,
  onTogglePauseSkill,
  onDeleteSkill,
  onEditSkill,
  onShowToast,
  user,
  stats,
  reviews,
  onToggleAvailability,
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [newSkillType, setNewSkillType] = useState<'teach' | 'learn'>('teach');
  const [newSkillTitle, setNewSkillTitle] = useState('');
  const [newSkillDesc, setNewSkillDesc] = useState('');
  const userAvailable = user?.availableThisWeek ?? true;

  const handleSaveSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkillTitle.trim()) {
      onShowToast('Please provide a skill title');
      return;
    }

    const newItem: UserSkillItem = {
      id: `user-skill-${Date.now()}`,
      type: newSkillType,
      title: newSkillTitle.trim(),
      description: newSkillDesc.trim() || 'Custom reciprocal curriculum module.',
      hoursSpent: 0,
      status: 'active',
      metricNote: newSkillType === 'teach' ? 'Instant Swap Ready' : 'Looking for Mentor',
    };

    onAddUserSkill(newItem);
    setNewSkillTitle('');
    setNewSkillDesc('');
    setShowAddModal(false);
  };

  const pendingInquiries = inquiries.filter((i) => i.status === 'pending');

  return (
    <div className="flex flex-col w-full px-gutter-mobile pb-space-xl space-y-space-lg">
      {/* 1. Quick Overview Header */}
      <section className="flex flex-col gap-space-md pt-space-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-space-sm">
            <div className="relative">
              <img
                alt={user?.name}
                className="w-13 h-13 rounded-full object-cover shadow-sm bg-surface-container ring-2 ring-primary/20"
                src={user?.avatar}
              />
              <span
                onClick={onToggleAvailability}
                className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full ring-2 ring-surface cursor-pointer ${
                  userAvailable ? 'bg-secondary' : 'bg-outline'
                }`}
                title="Toggle Availability"
              />
            </div>
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-space-xs">
                <h1 className="font-headline-sm text-headline-sm text-on-surface font-bold truncate">
                  {user?.name}
                </h1>
                <span
                  className="material-symbols-outlined text-primary text-[18px]"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                  title="Verified Reciprocal Member"
                >
                  verified
                </span>
              </div>
              <p className="font-body-sm text-body-sm text-on-surface-variant flex items-center gap-1">
                <span>{user?.title}</span>
                <span className="inline-block w-1 h-1 rounded-full bg-outline-variant"></span>
                <span className={userAvailable ? 'text-secondary font-medium' : 'text-on-surface-variant'}>
                  {userAvailable ? 'Available this week' : 'Away'}
                </span>
              </p>
            </div>
          </div>

          <button
            onClick={() => onShowToast('Dashboard settings & balance preferences')}
            aria-label="Dashboard Settings"
            className="w-10 h-10 rounded-full bg-surface-container hover:bg-surface-container-high flex items-center justify-center text-on-surface-variant transition-colors active:scale-95"
          >
            <span className="material-symbols-outlined text-[20px]">tune</span>
          </button>
        </div>

        {/* Trust & Reciprocity Hero Banner */}
        <div className="bg-primary-container text-on-primary-container rounded-2xl p-space-md shadow-md relative overflow-hidden">
          <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-surface-tint opacity-30 rounded-full blur-2xl pointer-events-none"></div>

          <div className="flex items-center justify-between mb-space-sm relative z-10">
            <div className="flex items-center gap-space-xs">
              <span className="material-symbols-outlined text-secondary-container text-[20px]">shield_with_heart</span>
              <span className="font-label-md text-label-md uppercase tracking-wider text-primary-fixed">
                Reciprocal Trust
              </span>
            </div>
            <span className="bg-surface-container-lowest/20 backdrop-blur-md px-2.5 py-0.5 rounded-full font-label-sm text-label-sm text-on-primary font-bold">
              Top 2%
            </span>
          </div>

          <div className="grid grid-cols-3 gap-space-xs text-center relative z-10">
            <div className="bg-surface-container-lowest/10 backdrop-blur-sm rounded-xl p-space-xs flex flex-col items-center">
              <div className="flex items-baseline gap-0.5">
                <span className="font-headline-md text-headline-md font-bold text-on-primary">
                  {stats?.trustScore ?? '—'}
                </span>
                <span className="font-label-sm text-label-sm text-secondary-container font-semibold">%</span>
              </div>
              <span className="font-label-sm text-label-sm text-primary-fixed opacity-90 mt-0.5">Trust Score</span>
            </div>

            <div className="bg-surface-container-lowest/10 backdrop-blur-sm rounded-xl p-space-xs flex flex-col items-center">
              <div className="flex items-baseline gap-0.5">
                <span className="font-headline-md text-headline-md font-bold text-on-primary">
                  {stats?.timeSwappedHours ?? 0}
                </span>
                <span className="font-label-sm text-label-sm text-primary-fixed">h</span>
              </div>
              <span className="font-label-sm text-label-sm text-primary-fixed opacity-90 mt-0.5">Time Swapped</span>
            </div>

            <div className="bg-surface-container-lowest/10 backdrop-blur-sm rounded-xl p-space-xs flex flex-col items-center">
              <div className="flex items-baseline gap-0.5">
                <span className="font-headline-md text-headline-md font-bold text-on-primary">
                  {stats?.activePeers ?? 0}
                </span>
              </div>
              <span className="font-label-sm text-label-sm text-primary-fixed opacity-90 mt-0.5">Active Peers</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Exchange Statistics Bento Grid */}
      <section className="flex flex-col gap-space-xs">
        <div className="flex items-center justify-between">
          <h2 className="font-title-md text-title-md text-on-surface font-bold">Exchange Vitality</h2>
          <span className="font-label-sm text-label-sm text-on-surface-variant flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-secondary inline-block"></span> 1:1 Parity balanced
          </span>
        </div>

        <div className="grid grid-cols-2 gap-space-xs">
          {/* Skills Offered */}
          <div className="bg-surface-container-lowest p-space-md rounded-2xl shadow-sm flex flex-col justify-between border border-outline-variant/20">
            <div className="flex items-center justify-between">
              <div className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center text-primary">
                <span className="material-symbols-outlined text-[18px]">school</span>
              </div>
              <span className="material-symbols-outlined text-[16px] text-secondary">arrow_outward</span>
            </div>
            <div className="mt-space-sm">
              <span className="font-headline-md text-headline-md text-on-surface font-bold block leading-none">
                {userSkills.filter((s) => s.type === 'teach').length}
              </span>
              <span className="font-label-sm text-label-sm text-on-surface-variant mt-1 block">Skills Offered</span>
            </div>
          </div>

          {/* Skills Learning */}
          <div className="bg-surface-container-lowest p-space-md rounded-2xl shadow-sm flex flex-col justify-between border border-outline-variant/20">
            <div className="flex items-center justify-between">
              <div className="w-8 h-8 rounded-lg bg-secondary-container/30 flex items-center justify-center text-secondary">
                <span className="material-symbols-outlined text-[18px]">psychology</span>
              </div>
              <span className="material-symbols-outlined text-[16px] text-secondary">south_west</span>
            </div>
            <div className="mt-space-sm">
              <span className="font-headline-md text-headline-md text-on-surface font-bold block leading-none">
                {userSkills.filter((s) => s.type === 'learn').length}
              </span>
              <span className="font-label-sm text-label-sm text-on-surface-variant mt-1 block">Skills Learning</span>
            </div>
          </div>

          {/* Sessions Completed */}
          <div className="bg-surface-container-lowest p-space-md rounded-2xl shadow-sm flex flex-col justify-between border border-outline-variant/20">
            <div className="flex items-center justify-between">
              <div className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center text-primary">
                <span className="material-symbols-outlined text-[18px]">task_alt</span>
              </div>
              <span className="font-label-sm text-label-sm text-secondary font-semibold">+4 this mo</span>
            </div>
            <div className="mt-space-sm">
              <span className="font-headline-md text-headline-md text-on-surface font-bold block leading-none">
                {stats?.sessionsDone ?? 0}
              </span>
              <span className="font-label-sm text-label-sm text-on-surface-variant mt-1 block">Sessions Done</span>
            </div>
          </div>

          {/* Community Rating */}
          <div className="bg-surface-container-lowest p-space-md rounded-2xl shadow-sm flex flex-col justify-between border border-outline-variant/20">
            <div className="flex items-center justify-between">
              <div className="w-8 h-8 rounded-lg bg-tertiary-fixed flex items-center justify-center text-on-tertiary-fixed">
                <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                  star
                </span>
              </div>
              <span className="font-label-sm text-label-sm text-on-tertiary-fixed-variant font-semibold">100% Pos</span>
            </div>
            <div className="mt-space-sm">
              <div className="flex items-baseline gap-1">
                <span className="font-headline-md text-headline-md text-on-surface font-bold block leading-none">
                  {stats ? stats.peerRating.toFixed(2) : '—'}
                </span>
                <span className="font-label-sm text-label-sm text-tertiary">★</span>
              </div>
              <span className="font-label-sm text-label-sm text-on-surface-variant mt-1 block">Peer Rating</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Incoming Exchange Requests */}
      <section className="flex flex-col gap-space-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-space-xs">
            <h2 className="font-title-md text-title-md text-on-surface font-bold">Exchange Inquiries</h2>
            <span className="w-5 h-5 rounded-full bg-secondary-container text-on-secondary-container font-label-sm text-label-sm flex items-center justify-center font-bold">
              {pendingInquiries.length}
            </span>
          </div>
          <button
            onClick={() => onShowToast('All proposals decoupled from money and secured by 1:1 escrow.')}
            className="font-label-sm text-label-sm text-primary font-semibold hover:underline"
          >
            Review Terms
          </button>
        </div>

        {pendingInquiries.length === 0 ? (
          <div className="p-4 rounded-2xl bg-surface-container-low text-center text-on-surface-variant text-sm">
            No pending incoming inquiries. You are all set!
          </div>
        ) : (
          pendingInquiries.map((inq) => (
            <div
              key={inq.id}
              className="bg-surface-container-lowest rounded-2xl p-space-md shadow-sm transition-all duration-300 border border-outline-variant/20 space-y-space-sm"
            >
              <div className="flex items-start justify-between gap-space-sm">
                <div className="flex items-center gap-space-sm min-w-0">
                  <img
                    alt={inq.peerName}
                    src={inq.peerAvatar}
                    className="w-10 h-10 rounded-full object-cover bg-surface-container shrink-0"
                  />
                  <div className="min-w-0">
                    <h3 className="font-title-md text-title-md text-on-surface font-semibold truncate">
                      {inq.peerName}
                    </h3>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">{inq.peerRole}</p>
                  </div>
                </div>
                <span className="bg-secondary-container/40 text-on-secondary-container px-2 py-0.5 rounded-full font-label-sm text-label-sm font-semibold whitespace-nowrap">
                  {inq.ratioType}
                </span>
              </div>

              {/* Trade Equation Barter Matrix */}
              <div className="bg-surface-container-low rounded-xl p-space-sm my-space-sm flex items-center justify-between text-center gap-space-xs">
                <div className="flex-1 flex flex-col items-center min-w-0">
                  <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">
                    He Offers
                  </span>
                  <span className="font-label-md text-label-md text-on-surface font-semibold truncate w-full mt-0.5">
                    {inq.offers}
                  </span>
                </div>
                <div
                  className="w-7 h-7 rounded-full bg-secondary text-on-secondary flex items-center justify-center shrink-0 shadow-sm"
                  title="Direct Fair Trade Parity"
                >
                  <span className="material-symbols-outlined text-[16px]">sync_alt</span>
                </div>
                <div className="flex-1 flex flex-col items-center min-w-0">
                  <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">
                    He Wants
                  </span>
                  <span className="font-label-md text-label-md text-primary font-semibold truncate w-full mt-0.5">
                    {inq.wants}
                  </span>
                </div>
              </div>

              <p className="font-body-sm text-body-sm text-on-surface-variant italic mb-space-sm">
                {inq.note}
              </p>

              <div className="flex items-center gap-space-xs">
                <button
                  onClick={() => onAcceptInquiry(inq)}
                  className="flex-1 h-11 bg-primary text-on-primary rounded-xl font-label-md text-label-md font-semibold flex items-center justify-center gap-1 active:scale-95 transition-transform shadow-sm cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">handshake</span>
                  <span>Accept Exchange</span>
                </button>
                <button
                  onClick={() => onDeclineInquiry(inq)}
                  className="h-11 px-space-md bg-surface-container hover:bg-surface-container-high text-on-surface-variant rounded-xl font-label-md text-label-md font-medium flex items-center justify-center active:scale-95 transition-colors cursor-pointer"
                >
                  Decline
                </button>
              </div>
            </div>
          ))
        )}
      </section>

      {/* 4. My Listed Skills (CRUD Hub) */}
      <section className="flex flex-col gap-space-xs">
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <h2 className="font-title-md text-title-md text-on-surface font-bold">My Skill Portfolio</h2>
            <span className="font-body-sm text-body-sm text-on-surface-variant">Active teaching & learning units</span>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="h-9 px-space-sm bg-primary text-on-primary rounded-xl font-label-sm text-label-sm font-semibold flex items-center gap-1 shadow-sm active:scale-95 transition-transform cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">add</span>
            Add Skill
          </button>
        </div>

        <div className="space-y-3">
          {userSkills.map((skill) => (
            <div
              key={skill.id}
              className="bg-surface-container-lowest rounded-2xl p-space-md shadow-sm transition-all duration-300 border border-outline-variant/20"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-space-xs">
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-label-sm text-label-sm ${
                      skill.type === 'teach'
                        ? 'bg-surface-container text-on-surface'
                        : 'bg-secondary-container/30 text-secondary font-semibold'
                    }`}
                  >
                    {skill.type === 'teach' ? (
                      <>
                        <span className="w-2 h-2 rounded-full bg-primary"></span>
                        Teaching
                      </>
                    ) : (
                      <>
                        <span className="material-symbols-outlined text-[14px]">psychology</span>
                        Seeking to Learn
                      </>
                    )}
                  </span>
                  <span
                    className={`font-label-sm text-label-sm px-2 py-0.5 rounded-full font-medium ${
                      skill.status === 'active'
                        ? 'bg-secondary-container/40 text-on-secondary-container'
                        : 'bg-surface-container text-on-surface-variant'
                    }`}
                  >
                    {skill.status === 'active' ? 'Active' : 'Paused'}
                  </span>
                </div>

                {/* CRUD Action Menu */}
                <div className="flex items-center gap-space-xs text-on-surface-variant">
                  <button
                    aria-label="Edit Skill"
                    onClick={() => onEditSkill(skill)}
                    className="w-8 h-8 rounded-lg hover:bg-surface-container flex items-center justify-center transition-colors active:scale-90"
                  >
                    <span className="material-symbols-outlined text-[18px]">edit</span>
                  </button>
                  <button
                    aria-label="Pause Skill"
                    onClick={() => onTogglePauseSkill(skill.id)}
                    className="w-8 h-8 rounded-lg hover:bg-surface-container flex items-center justify-center transition-colors active:scale-90"
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      {skill.status === 'active' ? 'pause_circle' : 'play_circle'}
                    </span>
                  </button>
                  <button
                    aria-label="Delete Skill"
                    onClick={() => onDeleteSkill(skill.id)}
                    className="w-8 h-8 rounded-lg hover:bg-error-container hover:text-error flex items-center justify-center transition-colors active:scale-90"
                  >
                    <span className="material-symbols-outlined text-[18px]">delete</span>
                  </button>
                </div>
              </div>

              <div className="mt-space-xs">
                <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">{skill.title}</h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5 leading-relaxed">
                  {skill.description}
                </p>
              </div>

              <div className="flex items-center justify-between mt-space-sm pt-space-xs border-t-0 bg-surface-container-low px-space-sm py-1.5 rounded-xl">
                <span className="font-label-sm text-label-sm text-on-surface-variant">
                  {skill.hoursSpent} hours {skill.type === 'teach' ? 'taught' : 'completed'}
                </span>
                <span
                  className={`font-label-sm text-label-sm font-semibold ${
                    skill.type === 'teach' ? 'text-secondary' : 'text-primary'
                  }`}
                >
                  {skill.metricNote}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Recent Partner Reviews & Testimonials */}
      <section className="flex flex-col gap-space-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-space-xs">
            <h2 className="font-title-md text-title-md text-on-surface font-bold">Partner Testimonials</h2>
            <span
              className="material-symbols-outlined text-secondary text-[18px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              favorite
            </span>
          </div>
          <span className="font-label-sm text-label-sm text-on-surface-variant">{stats?.reviewCount ?? reviews.length} Verified Reviews</span>
        </div>

        {reviews.length === 0 && (
          <p className="font-body-sm text-body-sm text-on-surface-variant">
            No reviews yet — complete a session and your partners can rate you.
          </p>
        )}
        {reviews.map((r) => (
          <div
            key={r.id}
            className="bg-surface-container-lowest rounded-2xl p-space-md shadow-sm space-y-space-xs border border-outline-variant/20"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-space-sm">
                <img alt={r.reviewerName} className="w-9 h-9 rounded-full object-cover bg-surface-container" src={r.reviewerAvatar} />
                <div className="min-w-0">
                  <h4 className="font-label-md text-label-md text-on-surface font-bold truncate">{r.reviewerName}</h4>
                  <span className="font-label-sm text-label-sm text-on-surface-variant block truncate">
                    Swapped for: {r.swappedFor}
                  </span>
                </div>
              </div>
              <div className="flex items-center text-tertiary" aria-label={`${r.rating} out of 5`}>
                {[1, 2, 3, 4, 5].map((n) => (
                  <span
                    key={n}
                    className="material-symbols-outlined text-[16px]"
                    style={{ fontVariationSettings: `'FILL' ${n <= Math.round(r.rating) ? 1 : 0}` }}
                  >
                    star
                  </span>
                ))}
              </div>
            </div>
            <p className="font-body-sm text-body-sm text-on-surface leading-relaxed">"{r.comment}"</p>
            <div className="flex items-center justify-between pt-1 font-label-sm text-label-sm text-on-surface-variant">
              <span className="flex items-center gap-1 text-secondary">
                <span className="material-symbols-outlined text-[14px]">verified_user</span> Verified{' '}
                {r.sessionMins >= 60 ? `${+(r.sessionMins / 60).toFixed(1)}h` : `${r.sessionMins}m`} Session
              </span>
              <span>{r.timeAgo}</span>
            </div>
          </div>
        ))}
      </section>

      {/* Add Skill Modal (Dashboard CRUD) */}
      {showAddModal && (
        <div className="fixed inset-0 z-[60] bg-inverse-surface/40 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="absolute inset-0" onClick={() => setShowAddModal(false)} />
          <div className="relative bg-surface-container-lowest w-full max-w-lg rounded-t-3xl sm:rounded-2xl p-space-lg shadow-xl flex flex-col gap-space-md z-10 animate-in slide-in-from-bottom duration-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-space-xs">
                <span className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined text-[20px]">add_task</span>
                </span>
                <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">List a New Skill</h3>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <form onSubmit={handleSaveSkill} className="space-y-space-sm">
              <div>
                <label className="block font-label-md text-label-md text-on-surface font-semibold mb-1">
                  Exchange Intent
                </label>
                <div className="grid grid-cols-2 gap-space-xs">
                  <button
                    type="button"
                    onClick={() => setNewSkillType('teach')}
                    className={`py-2.5 px-space-sm rounded-xl font-label-md text-label-md font-semibold flex items-center justify-center gap-1 transition-all ${
                      newSkillType === 'teach'
                        ? 'bg-primary text-on-primary'
                        : 'bg-surface-container text-on-surface-variant'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[16px]">school</span> Teach Skill
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewSkillType('learn')}
                    className={`py-2.5 px-space-sm rounded-xl font-label-md text-label-md font-semibold flex items-center justify-center gap-1 transition-all ${
                      newSkillType === 'learn'
                        ? 'bg-secondary text-on-secondary'
                        : 'bg-surface-container text-on-surface-variant'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[16px]">psychology</span> Learn Skill
                  </button>
                </div>
              </div>

              <div>
                <label className="block font-label-md text-label-md text-on-surface font-semibold mb-1">
                  Skill Title
                </label>
                <input
                  type="text"
                  required
                  value={newSkillTitle}
                  onChange={(e) => setNewSkillTitle(e.target.value)}
                  placeholder="e.g. Next.js 15 App Router Architecture"
                  className="w-full bg-surface-container-low text-on-surface rounded-xl p-space-sm font-body-md text-body-md shadow-sm outline-none focus:ring-2 focus:ring-primary/40 transition-all placeholder:text-outline"
                />
              </div>

              <div>
                <label className="block font-label-md text-label-md text-on-surface font-semibold mb-1">
                  Exchange Offering Description
                </label>
                <textarea
                  value={newSkillDesc}
                  onChange={(e) => setNewSkillDesc(e.target.value)}
                  placeholder="What specific knowledge, exercises, or deliverables will you exchange?"
                  rows={3}
                  className="w-full bg-surface-container-low text-on-surface rounded-xl p-space-sm font-body-md text-body-md shadow-sm outline-none focus:ring-2 focus:ring-primary/40 transition-all placeholder:text-outline resize-none"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full h-12 bg-primary text-on-primary rounded-xl font-label-md text-label-md font-semibold shadow-md active:scale-95 transition-transform flex items-center justify-center gap-1 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">verified</span>
                  <span>Publish to Community</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
