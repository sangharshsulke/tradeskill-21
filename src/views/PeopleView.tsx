import React, { useState } from 'react';
import { PeerProfile } from '../types';

interface PeopleViewProps {
  profiles: PeerProfile[];
  onOpenProfile: (profile: PeerProfile) => void;
  onRequestTrade: (profile: PeerProfile) => void;
}

export const PeopleView: React.FC<PeopleViewProps> = ({
  profiles,
  onOpenProfile,
  onRequestTrade,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPerfect, setFilterPerfect] = useState(true);
  const [filterAvailability, setFilterAvailability] = useState(false);
  const [filterTimezone, setFilterTimezone] = useState(false);

  const filteredProfiles = profiles.filter((p) => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      p.name.toLowerCase().includes(q) ||
      p.role.toLowerCase().includes(q) ||
      p.location.toLowerCase().includes(q) ||
      p.offers.some((o) => o.toLowerCase().includes(q)) ||
      p.wants.some((w) => w.toLowerCase().includes(w));

    if (!matchesSearch) return false;
    if (filterPerfect && p.mutualMatchPct < 90) return false;
    if (filterAvailability && !p.availability.toLowerCase().includes('avail') && !p.availability.toLowerCase().includes('instant')) return false;
    if (filterTimezone && !p.timezone.includes('UTC+1') && !p.timezone.includes('UTC+0')) return false;

    return true;
  });

  return (
    <div className="flex flex-col w-full px-gutter-mobile space-y-space-md pb-8">
      {/* Interactive Search & Smart Matchmaking Bar */}
      <section className="flex flex-col gap-space-sm pt-2">
        <div className="relative w-full shadow-sm">
          <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px] pointer-events-none">
            search
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search mentor name, skill, or tool..."
            className="w-full bg-surface-container-lowest text-on-surface placeholder:text-on-surface-variant font-body-md text-body-md rounded-xl pl-10 pr-10 py-3 focus:outline-none focus:ring-2 focus:ring-primary shadow-sm transition-all border border-transparent focus:border-primary/20"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center rounded-full text-on-surface-variant hover:text-on-surface active:scale-95"
            >
              <span className="material-symbols-outlined text-[18px]">cancel</span>
            </button>
          )}
        </div>

        {/* Quick Pill Filters */}
        <div className="flex items-center gap-space-xs overflow-x-auto no-scrollbar py-0.5">
          <button
            onClick={() => setFilterPerfect(!filterPerfect)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full font-label-md text-label-md whitespace-nowrap shadow-sm transition-all active:scale-95 cursor-pointer ${
              filterPerfect
                ? 'bg-primary text-on-primary font-semibold'
                : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
            }`}
          >
            <span className="material-symbols-outlined text-[16px] text-secondary-fixed">auto_awesome</span>
            <span>Perfect Match</span>
            <span className="w-1.5 h-1.5 rounded-full bg-secondary-fixed"></span>
          </button>

          <button
            onClick={() => setFilterAvailability(!filterAvailability)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full font-label-md text-label-md whitespace-nowrap shadow-sm transition-all active:scale-95 cursor-pointer ${
              filterAvailability
                ? 'bg-primary text-on-primary font-semibold'
                : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">bolt</span>
            <span>Available This Week</span>
          </button>

          <button
            onClick={() => setFilterTimezone(!filterTimezone)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full font-label-md text-label-md whitespace-nowrap shadow-sm transition-all active:scale-95 cursor-pointer ${
              filterTimezone
                ? 'bg-primary text-on-primary font-semibold'
                : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">schedule</span>
            <span>±2h Timezone</span>
          </button>
        </div>
      </section>

      {/* Reciprocal Match Banner */}
      <section className="relative overflow-hidden rounded-xl bg-gradient-to-r from-primary via-primary-container to-surface-tint p-4 text-on-primary shadow-md">
        <div className="relative z-10 flex items-start justify-between gap-space-sm">
          <div className="flex flex-col space-y-1">
            <div className="flex items-center gap-1.5">
              <span className="flex h-2 w-2 rounded-full bg-secondary-fixed animate-ping"></span>
              <span className="font-label-sm text-label-sm tracking-wide text-secondary-fixed uppercase font-semibold">
                Algorithmic Balance
              </span>
            </div>
            <h2 className="font-headline-sm text-headline-sm leading-tight text-on-primary">
              3 High-Affinity Swap Partners!
            </h2>
            <p className="font-body-sm text-body-sm text-primary-fixed-dim leading-snug">
              They teach <strong className="text-white font-medium">Design Systems & Figma</strong> and are looking for your{' '}
              <strong className="text-white font-medium">Python & ML</strong> expertise.
            </p>
          </div>
          <div className="flex flex-col items-center justify-center rounded-xl bg-on-primary/10 backdrop-blur-md p-2.5 text-center min-w-[70px] shadow-sm shrink-0">
            <span className="font-headline-sm text-headline-sm font-bold text-secondary-fixed leading-none">1:1</span>
            <span className="font-label-sm text-label-sm text-on-primary-container leading-none mt-1">Direct Hour</span>
          </div>
        </div>
      </section>

      {/* User Directory Feed */}
      <section className="flex flex-col space-y-space-md">
        {filteredProfiles.map((p) => (
          <article
            key={p.id}
            className="bg-surface-container-lowest rounded-xl p-4 shadow-sm flex flex-col space-y-3.5 transition-all border border-outline-variant/20 hover:border-primary/30"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="relative shrink-0">
                  <img
                    alt={p.name}
                    src={p.avatarUrl}
                    className="w-13 h-13 rounded-full object-cover shadow-sm ring-2 ring-primary/15"
                  />
                  {p.verified && (
                    <span
                      className="material-symbols-outlined absolute -bottom-1 -right-1 text-[16px] text-secondary bg-surface rounded-full shadow-sm"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      check_circle
                    </span>
                  )}
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-title-md text-title-md text-on-surface font-semibold">{p.name}</h3>
                    {p.badge && (
                      <span className="bg-surface-container text-on-surface-variant font-label-sm text-label-sm px-1.5 py-0.5 rounded font-medium">
                        {p.badge}
                      </span>
                    )}
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    {p.role} {p.company ? `@ ${p.company}` : ''}
                  </p>
                  <div className="flex items-center gap-2 mt-0.5 text-on-surface-variant">
                    <span className="flex items-center gap-0.5 font-label-sm text-label-sm">
                      <span className="material-symbols-outlined text-[13px]">location_on</span>
                      {p.location}
                    </span>
                    <span className="text-outline-variant">•</span>
                    <span className="flex items-center gap-0.5 font-label-sm text-label-sm text-secondary font-semibold">
                      <span className="material-symbols-outlined text-[13px]">event_available</span>
                      {p.availability}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-end shrink-0">
                <div className="flex items-center gap-1 bg-secondary-container/50 text-on-secondary-container px-2 py-0.5 rounded-full font-label-sm text-label-sm font-semibold shadow-xs">
                  <span className="material-symbols-outlined text-[13px]">all_inclusive</span>
                  <span>{p.mutualMatchPct}% Mutual</span>
                </div>
                <div className="flex items-center gap-1 mt-1 text-on-surface-variant font-label-sm text-label-sm">
                  <span className="material-symbols-outlined text-tertiary-fixed-dim text-[14px]">star</span>
                  <span className="font-semibold text-on-surface">{p.rating}</span>
                  <span>({p.swapsCount} swaps)</span>
                </div>
              </div>
            </div>

            {/* Bilateral Skill Balance Matrix */}
            <div className="bg-surface-container-low rounded-xl p-3 flex flex-col space-y-2">
              <div className="flex items-center gap-2">
                <span className="w-16 shrink-0 font-label-sm text-label-sm text-secondary font-semibold flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-secondary"></span>
                  Offers:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {p.offers.map((offer, idx) => (
                    <span
                      key={idx}
                      className="bg-surface-container-lowest text-on-surface font-label-sm text-label-sm px-2 py-1 rounded shadow-xs"
                    >
                      {offer}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="w-16 shrink-0 font-label-sm text-label-sm text-primary font-semibold flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-primary"></span>
                  Wants:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {p.wants.map((want, idx) => (
                    <span
                      key={idx}
                      className="bg-primary-fixed text-on-primary-fixed-variant font-label-sm text-label-sm px-2 py-1 rounded shadow-xs"
                    >
                      {want}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-space-sm pt-1">
              <button
                onClick={() => onOpenProfile(p)}
                className="flex-1 h-11 rounded-lg bg-surface-container text-on-surface font-label-md text-label-md flex items-center justify-center gap-1.5 hover:bg-surface-container-high active:scale-98 transition-all cursor-pointer font-medium"
              >
                <span className="material-symbols-outlined text-[18px]">person</span>
                <span>View Profile</span>
              </button>
              <button
                onClick={() => onRequestTrade(p)}
                className="flex-1 h-11 rounded-lg bg-primary text-on-primary font-label-md text-label-md flex items-center justify-center gap-1.5 shadow-sm active:scale-98 transition-all hover:bg-primary-container cursor-pointer font-medium"
              >
                <span className="material-symbols-outlined text-[18px]">swap_horizontal_circle</span>
                <span>Request Trade</span>
              </button>
            </div>
          </article>
        ))}
      </section>

      {/* Community Micro-Stat Card */}
      <section className="bg-surface-container rounded-xl p-4 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-secondary-container flex items-center justify-center text-on-secondary-container shadow-xs shrink-0">
            <span className="material-symbols-outlined text-[20px]">handshake</span>
          </div>
          <div>
            <h4 className="font-headline-sm text-headline-sm text-on-surface">1,480+ Reciprocal Hours</h4>
            <p className="font-body-sm text-body-sm text-on-surface-variant">Zero currency exchanged across 42 countries</p>
          </div>
        </div>
      </section>
    </div>
  );
};
