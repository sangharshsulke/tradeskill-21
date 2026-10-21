import React, { useState } from 'react';
import { SkillListing } from '../types';

interface SkillsViewProps {
  skills: SkillListing[];
  onOpenQuickList: () => void;
  onOpenCurriculum: (skill: SkillListing) => void;
  onRequestTrade: (skill: SkillListing) => void;
}

export const SkillsView: React.FC<SkillsViewProps> = ({
  skills,
  onOpenQuickList,
  onOpenCurriculum,
  onRequestTrade,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'match' | 'rating' | 'swaps'>('match');

  const categories = [
    { id: 'all', label: 'All Disciplines' },
    { id: 'tech', label: 'Tech & Code' },
    { id: 'creative', label: 'Creative & Design' },
    { id: 'languages', label: 'Languages' },
    { id: 'music', label: 'Music & Arts' },
    { id: 'business', label: 'Business & Strategy' },
  ];

  const filteredSkills = skills.filter((item) => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !query ||
      item.teaches.toLowerCase().includes(query) ||
      item.wants.toLowerCase().includes(query) ||
      item.authorName.toLowerCase().includes(query);
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="flex flex-col w-full pb-8">
      {/* Interactive Top Action Area */}
      <div className="px-gutter-mobile pt-4 pb-2">
        <div className="relative overflow-hidden rounded-2xl bg-surface-container-high p-4 shadow-sm flex items-center justify-between">
          <div className="flex flex-col z-10 max-w-[65%]">
            <span className="inline-flex items-center gap-1 font-label-sm text-label-sm text-secondary font-bold uppercase tracking-wider mb-1">
              <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span> Zero-Cash Marketplace
            </span>
            <h2 className="font-headline-sm text-headline-sm text-on-surface leading-tight">Got a mastery to share?</h2>
            <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">Offer your knowledge, unlock a new craft.</p>
          </div>
          <button
            onClick={onOpenQuickList}
            className="z-10 h-11 px-4 bg-primary text-on-primary rounded-xl font-label-md text-label-md shadow-md flex items-center gap-1.5 active:scale-95 transition-transform shrink-0 cursor-pointer font-semibold"
          >
            <span className="material-symbols-outlined text-[18px]">add_circle</span>
            <span>List Skill</span>
          </button>
          <div className="absolute -right-6 -bottom-6 w-28 h-28 rounded-full bg-primary-fixed/40 blur-xl pointer-events-none"></div>
        </div>
      </div>

      {/* Search & Filter Controls */}
      <div className="px-gutter-mobile pt-3 pb-2 sticky top-16 bg-surface/90 backdrop-blur-md z-30 space-y-3">
        {/* Search Input */}
        <div className="relative w-full">
          <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]">
            search
          </span>
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search skills, e.g., 'Rust', 'UI Design', 'Japanese'..."
            className="w-full h-12 pl-11 pr-10 rounded-xl bg-surface-container-lowest text-on-surface font-body-md text-body-md shadow-sm placeholder:text-on-surface-variant/60 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all border border-transparent focus:border-primary/20"
          />
          {searchQuery ? (
            <button
              onClick={() => setSearchQuery('')}
              className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant/70 hover:text-primary text-[20px]"
            >
              close
            </button>
          ) : (
            <button className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant/70 hover:text-primary text-[20px]">
              tune
            </button>
          )}
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar -mx-gutter-mobile px-gutter-mobile">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`h-8 px-3.5 rounded-full font-label-md text-label-md whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-primary text-on-primary shadow-sm font-semibold'
                    : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Trending Trades Spotlight */}
      <div className="px-gutter-mobile pt-3">
        <div className="flex items-center justify-between mb-2.5">
          <h3 className="font-headline-sm text-headline-sm text-on-surface">Trending Trades</h3>
          <span className="font-label-sm text-label-sm text-primary font-semibold flex items-center gap-0.5">
            Live swaps <span className="material-symbols-outlined text-[14px]">trending_up</span>
          </span>
        </div>
        <div className="grid grid-cols-2 gap-2.5">
          {/* Tile 1 */}
          <div
            onClick={() => setSelectedCategory('tech')}
            className="p-3 rounded-2xl bg-surface-container-lowest shadow-sm flex flex-col justify-between h-28 relative overflow-hidden group active:scale-[0.98] transition-transform cursor-pointer hover:border hover:border-primary/20 border border-transparent"
          >
            <div className="flex items-center justify-between">
              <div className="w-8 h-8 rounded-xl bg-primary-fixed flex items-center justify-center text-primary">
                <span className="material-symbols-outlined text-[20px]">terminal</span>
              </div>
              <span className="font-label-sm text-label-sm text-secondary bg-secondary-container/40 px-2 py-0.5 rounded-full font-bold">
                142 active
              </span>
            </div>
            <div>
              <span className="font-title-md text-title-md text-on-surface block leading-tight font-semibold">
                Full-Stack & AI
              </span>
              <span className="font-body-sm text-body-sm text-on-surface-variant">Python, Rust, Agents</span>
            </div>
            <div className="absolute -right-4 -bottom-4 w-12 h-12 bg-primary/5 rounded-full blur-md"></div>
          </div>

          {/* Tile 2 */}
          <div
            onClick={() => setSelectedCategory('creative')}
            className="p-3 rounded-2xl bg-surface-container-lowest shadow-sm flex flex-col justify-between h-28 relative overflow-hidden group active:scale-[0.98] transition-transform cursor-pointer hover:border hover:border-primary/20 border border-transparent"
          >
            <div className="flex items-center justify-between">
              <div className="w-8 h-8 rounded-xl bg-tertiary-fixed flex items-center justify-center text-tertiary-container">
                <span className="material-symbols-outlined text-[20px]">brush</span>
              </div>
              <span className="font-label-sm text-label-sm text-secondary bg-secondary-container/40 px-2 py-0.5 rounded-full font-bold">
                89 active
              </span>
            </div>
            <div>
              <span className="font-title-md text-title-md text-on-surface block leading-tight font-semibold">
                Brand & Figma
              </span>
              <span className="font-body-sm text-body-sm text-on-surface-variant">Design systems, 3D</span>
            </div>
            <div className="absolute -right-4 -bottom-4 w-12 h-12 bg-tertiary-fixed/30 rounded-full blur-md"></div>
          </div>
        </div>
      </div>

      {/* Available Exchanges */}
      <div className="px-gutter-mobile pt-6">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <h3 className="font-headline-sm text-headline-sm text-on-surface">Available Exchanges</h3>
            <span className="h-5 px-2 rounded-full bg-surface-container-high text-on-surface-variant font-label-sm text-label-sm flex items-center font-medium">
              {filteredSkills.length} ready
            </span>
          </div>
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-transparent font-label-sm text-label-sm text-primary font-semibold focus:outline-none cursor-pointer pr-1"
            >
              <option value="match">Best Match</option>
              <option value="rating">Top Rated</option>
              <option value="swaps">Most Swaps</option>
            </select>
          </div>
        </div>

        {/* Listings Container */}
        <div className="space-y-4">
          {filteredSkills.map((item) => (
            <article
              key={item.id}
              className="p-4 rounded-2xl bg-surface-container-lowest shadow-sm space-y-3.5 transition-all border border-outline-variant/20 hover:border-primary/30"
            >
              {/* Top header info */}
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <img
                    alt={item.authorName}
                    src={item.authorAvatar}
                    className="w-10 h-10 rounded-full object-cover shadow-xs ring-1 ring-primary/20"
                  />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-title-md text-title-md text-on-surface font-semibold">{item.authorName}</span>
                      {item.verified && (
                        <span className="material-symbols-outlined text-secondary text-[16px]" title="Identity Verified">
                          verified
                        </span>
                      )}
                    </div>
                    <span className="font-body-sm text-body-sm text-on-surface-variant flex items-center gap-1">
                      <span className="material-symbols-outlined text-tertiary-fixed-dim text-[14px]">star</span>
                      {item.rating} ({item.swapsCount} swaps)
                    </span>
                  </div>
                </div>
                <span className={`px-2.5 py-1 rounded-full font-label-sm text-label-sm font-bold ${item.tierBadgeBg}`}>
                  {item.tierBadge}
                </span>
              </div>

              {/* Trade Matrix Component */}
              <div className="p-3 rounded-xl bg-surface-container-low space-y-2 relative">
                {/* Teaches block */}
                <div className="flex items-start gap-2">
                  <div className="w-5 h-5 rounded-md bg-primary-container text-on-primary flex items-center justify-center shrink-0 mt-0.5">
                    <span className="material-symbols-outlined text-[13px]">school</span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider block">
                      Teaches
                    </span>
                    <p className="font-title-md text-title-md text-on-surface font-semibold truncate">
                      {item.teaches}
                    </p>
                  </div>
                </div>

                {/* Bidirectional Center Indicator */}
                <div className="flex items-center justify-center -my-1">
                  <div className="h-6 px-3 rounded-full bg-secondary-container text-on-secondary-container font-label-sm text-label-sm flex items-center gap-1 font-bold shadow-xs">
                    <span className="material-symbols-outlined text-[14px]">swap_horiz</span>
                    {item.ratioLabel}
                  </div>
                </div>

                {/* Seeks block */}
                <div className="flex items-start gap-2">
                  <div className="w-5 h-5 rounded-md bg-secondary text-on-secondary flex items-center justify-center shrink-0 mt-0.5">
                    <span className="material-symbols-outlined text-[13px]">psychology</span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider block">
                      Looking for
                    </span>
                    <p className="font-title-md text-title-md text-on-surface font-semibold truncate">
                      {item.wants}
                    </p>
                  </div>
                </div>
              </div>

              {/* Format Badges & Commitment */}
              <div className="flex flex-wrap items-center gap-2 pt-0.5">
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-surface-container text-on-surface-variant font-label-sm text-label-sm">
                  <span className="material-symbols-outlined text-[15px]">videocam</span>
                  {item.formatBadge}
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-surface-container text-on-surface-variant font-label-sm text-label-sm">
                  <span className="material-symbols-outlined text-[15px]">schedule</span>
                  {item.hoursPerWeek}
                </span>
                {item.cycleWeeks && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-secondary-container/50 text-on-secondary-container font-label-sm text-label-sm font-semibold">
                    <span className="material-symbols-outlined text-[15px]">timer</span>
                    {item.cycleWeeks}
                  </span>
                )}
              </div>

              {/* Card Action CTA */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  onClick={() => onOpenCurriculum(item)}
                  className="h-11 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface font-label-md text-label-md flex items-center justify-center gap-1 transition-colors active:scale-95 cursor-pointer font-medium"
                >
                  <span className="material-symbols-outlined text-[18px]">info</span>
                  <span>Curriculum</span>
                </button>
                <button
                  onClick={() => onRequestTrade(item)}
                  className="h-11 rounded-xl bg-primary text-on-primary font-label-md text-label-md shadow-sm flex items-center justify-center gap-1.5 active:scale-95 transition-transform cursor-pointer font-medium"
                >
                  <span>Request Trade</span>
                  <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
};
