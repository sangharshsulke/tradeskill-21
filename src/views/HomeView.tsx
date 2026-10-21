import React, { useState } from 'react';
import { ScreenType, SkillListing } from '../types';

interface HomeViewProps {
  onNavigate: (screen: ScreenType) => void;
  onOpenQuickList: () => void;
  onOpenQuickMatch: () => void;
  onRequestTrade: (skill: Partial<SkillListing>) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  onNavigate,
  onOpenQuickList,
  onOpenQuickMatch,
  onRequestTrade,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>([]);

  const toggleBookmark = (id: string) => {
    setBookmarkedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onNavigate('skills');
    } else {
      onOpenQuickMatch();
    }
  };

  const popularSkills = [
    { title: 'Full-stack Dev', count: '1,240 members', active: '94 Active', icon: 'terminal', bg: 'bg-primary-fixed', text: 'text-primary' },
    { title: 'UI/UX Design', count: '980 members', active: '82 Active', icon: 'palette', bg: 'bg-surface-container-high', text: 'text-primary' },
    { title: 'Spanish (B1/B2)', count: '830 members', active: '118 Active', icon: 'translate', bg: 'bg-tertiary-fixed', text: 'text-tertiary' },
    { title: 'Classical Guitar', count: '510 members', active: '41 Active', icon: 'music_note', bg: 'bg-primary-fixed', text: 'text-primary' },
    { title: 'Growth Mktg', count: '740 members', active: '65 Active', icon: 'campaign', bg: 'bg-surface-container-highest', text: 'text-primary' },
    { title: 'Video Editing', count: '620 members', active: '53 Active', icon: 'movie_edit', bg: 'bg-tertiary-fixed', text: 'text-tertiary' },
  ];

  return (
    <div className="flex flex-col w-full pb-8">
      {/* Hero Section */}
      <section className="px-gutter-mobile pt-space-md pb-space-lg">
        <div className="relative overflow-hidden rounded-2xl bg-surface-container-low p-space-md shadow-sm">
          <div className="absolute -top-12 -right-12 w-44 h-44 rounded-full bg-primary-fixed/30 blur-2xl pointer-events-none"></div>
          <div className="absolute -bottom-10 -left-10 w-36 h-36 rounded-full bg-secondary-container/30 blur-xl pointer-events-none"></div>

          <div className="relative z-10 flex flex-col gap-space-sm">
            <div className="inline-flex items-center gap-space-xs self-start px-2.5 py-1 rounded-full bg-surface-container-high text-primary font-label-sm text-label-sm shadow-xs">
              <span className="material-symbols-outlined text-[14px]">bolt</span>
              <span>Zero Currency • 100% Reciprocal</span>
            </div>

            <h1 className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface tracking-tight">
              Exchange Skills, <br />
              <span className="text-primary">Not Dollars</span>
            </h1>

            <p className="font-body-md text-body-md text-on-surface-variant max-w-sm">
              Trade your domain expertise for real-time coaching. Learn anything from coding to classical guitar without spending a cent.
            </p>

            <form className="mt-space-xs flex flex-col gap-2" onSubmit={handleSearchSubmit}>
              <div className="relative flex items-center">
                <span className="material-symbols-outlined absolute left-3.5 text-on-surface-variant text-[20px]">search</span>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="What skill do you want to learn today?"
                  className="w-full h-12 pl-11 pr-4 rounded-xl bg-surface-container-lowest text-on-surface font-body-md text-body-md shadow-xs placeholder:text-on-surface-variant/60 focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <button
                type="submit"
                className="w-full h-12 rounded-xl bg-primary text-on-primary font-label-md text-label-md flex items-center justify-center gap-space-xs shadow-md active:scale-98 transition-transform cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">auto_awesome</span>
                <span>Quick Match My Skills</span>
              </button>
            </form>

            <div className="mt-space-xs flex items-center gap-2 text-on-surface-variant font-label-sm text-label-sm">
              <div className="flex -space-x-1.5">
                <img
                  className="w-6 h-6 rounded-full object-cover ring-1 ring-surface"
                  alt="Member portrait"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAS_HEdLgnVCn1Hoihfu2LBMp2IWmg73UNGkw30NbAg7F6iwYJOiXmF0v-TKdpBPk-3zSk4HyetGGoillK_VrrDZ9nKZL_bI-9rsldh2e1hMEXRLwXBwbQhbUhzurRKFxMhz7J_y3hhD0dSEfWwrrh1a99FapMjbq27PmH3IW9RRcZv1ugkm2MH-oyOmREduw77tAiN__etZ2mn3RV22j9ZUNNuYM3PsUdhJNasC78vuMeHsUzAykI"
                />
                <img
                  className="w-6 h-6 rounded-full object-cover ring-1 ring-surface"
                  alt="Member portrait"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAlJHnjBK3rTctacDxgO2EGpG9-_Eq65_XZ7invCW3nwZR8NaS1zKJ9sLi5zXwPvem7P1_1AeeG4gvKoFrVJ0Ad1QOC2f6bkFDEk5Nd5OQudzT3ccFw6Lt2N9LMIQFkrhPS56bI5ppGIOIeM8z4ouK5COhl2zs5ubOzSIvjFmY03UIk2_ju-RruETrr03sB7z4Y6Zd7at73JZCpFD6TJH82pOgnxvr0wUL4oDAoPJMwx0H9-RvB3io"
                />
                <img
                  className="w-6 h-6 rounded-full object-cover ring-1 ring-surface"
                  alt="Member portrait"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCcKesNjzIihjF-XivCnS9jqARMWzk5VbV6dgHIAnycn5eNg7jOjDPwQDH03buaL0fAjOkJCgIU64H7AoaMqRmRpLSFRIY9BJpHNnIqzEanbto8NBTM3oaitD25m_zguWB4ZMCrHJz8NtivHZZfbEtoYGKYR4ksKdc9Wm4EQKwNk7QOH0y5n9pZMbw-0ryuU4ikxEBIrXAWx2dNqWa0Lw9GSHMJ4lr_fQRaaGtVqI4Lo55z8y7jVnc"
                />
              </div>
              <span>340+ members trading live right now</span>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Skills to Swap */}
      <section className="w-full py-space-sm">
        <div className="px-gutter-mobile flex items-center justify-between mb-space-sm">
          <div className="flex flex-col">
            <h2 className="font-headline-sm text-headline-sm text-on-surface">Popular Skills to Swap</h2>
            <span className="font-label-sm text-label-sm text-on-surface-variant">High demand matches this week</span>
          </div>
          <button
            onClick={() => onNavigate('skills')}
            className="font-label-md text-label-md text-primary flex items-center gap-0.5 hover:underline cursor-pointer"
          >
            <span>View all</span>
            <span className="material-symbols-outlined text-[18px]">chevron_right</span>
          </button>
        </div>

        <div className="flex overflow-x-auto px-gutter-mobile gap-3 pb-2 snap-x snap-mandatory no-scrollbar">
          {popularSkills.map((item, idx) => (
            <div
              key={idx}
              onClick={() => onNavigate('skills')}
              className="snap-start shrink-0 w-44 rounded-xl bg-surface-container-low p-space-sm shadow-xs flex flex-col justify-between cursor-pointer hover:bg-surface-container transition-colors active:scale-98"
            >
              <div className="flex items-center justify-between">
                <div className={`w-9 h-9 rounded-lg ${item.bg} flex items-center justify-center ${item.text}`}>
                  <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                </div>
                <span className="px-1.5 py-0.5 rounded-full bg-secondary-container font-label-sm text-label-sm text-on-secondary-container flex items-center gap-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
                  {item.active}
                </span>
              </div>
              <div className="mt-space-md">
                <h3 className="font-title-md text-title-md text-on-surface truncate">{item.title}</h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant">{item.count}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Skill Traders */}
      <section className="px-gutter-mobile py-space-md flex flex-col gap-space-md">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-headline-sm text-headline-sm text-on-surface">Featured Skill Traders</h2>
            <span className="font-label-sm text-label-sm text-on-surface-variant">Vetted community members available now</span>
          </div>
          <button
            onClick={() => onNavigate('people')}
            className="w-9 h-9 rounded-full bg-surface-container-low flex items-center justify-center text-on-surface-variant shadow-xs hover:bg-surface-container transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">tune</span>
          </button>
        </div>

        <div className="flex flex-col gap-3">
          {/* Card 1: Elena Rostova */}
          <div className="rounded-2xl bg-surface-container-lowest p-space-md shadow-sm flex flex-col gap-3">
            <div className="flex items-start justify-between gap-space-sm">
              <div className="flex items-center gap-3">
                <img
                  className="w-12 h-12 rounded-full object-cover"
                  alt="Elena Rostova"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDGIV0OVc4rJlwG45TTkjqApOzU5cEmZN_Oy34VtfLRJl0EmatcilFJGQtRd4UykhjPaUlkZ07XKIu9Ihp9TSPOxvgphyFTGuFSqh0fjz14vriFrMxacN1YILJuW3r7_fAUo-JNX6VYalVCObz-pz0yFYPS4RWKI2wcl9yUV2TmWo5v9eZ6smNEGWzI6evJcyfxkERLZpWi-wyG07bWHTlBoCmh-ApU2D46pkEIz6pAWU2Ns1Cj8Ws"
                />
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-title-md text-title-md text-on-surface font-semibold">Elena Rostova</span>
                    <span className="material-symbols-outlined text-secondary text-[16px]">verified</span>
                  </div>
                  <span className="font-body-sm text-body-sm text-on-surface-variant">Senior Frontend Lead</span>
                </div>
              </div>
              <div className="flex flex-col items-end">
                <div className="flex items-center gap-0.5 text-tertiary font-label-md text-label-md">
                  <span className="material-symbols-outlined text-[16px]">star</span>
                  <span>5.0</span>
                </div>
                <span className="font-label-sm text-label-sm text-on-surface-variant">28 swaps</span>
              </div>
            </div>

            <div className="rounded-xl bg-surface-container-low p-2.5 flex flex-col gap-2">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 min-w-0">
                  <span className="w-2 h-2 rounded-full bg-primary shrink-0"></span>
                  <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider shrink-0">Offers</span>
                  <span className="font-label-md text-label-md text-on-surface truncate font-medium">React, Next.js & TS</span>
                </div>
                <span className="px-2 py-0.5 rounded bg-surface-container-high font-label-sm text-label-sm text-primary shrink-0">1:1 Ratio</span>
              </div>

              <div className="flex items-center justify-center my-0.5">
                <div className="w-6 h-6 rounded-full bg-secondary-container text-secondary flex items-center justify-center">
                  <span className="material-symbols-outlined text-[14px]">swap_vert</span>
                </div>
              </div>

              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 min-w-0">
                  <span className="w-2 h-2 rounded-full bg-secondary shrink-0"></span>
                  <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider shrink-0">Wants</span>
                  <span className="font-label-md text-label-md text-secondary truncate font-medium">Spanish Conversation (B2)</span>
                </div>
                <span className="font-body-sm text-body-sm text-on-surface-variant shrink-0">2 hrs/wk</span>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={() => onRequestTrade({ authorName: 'Elena Rostova', teaches: 'React, Next.js & TS', wants: 'Spanish Conversation (B2)' })}
                className="flex-1 h-11 rounded-xl bg-primary text-on-primary font-label-md text-label-md flex items-center justify-center gap-1.5 shadow-sm active:scale-98 transition-transform cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">handshake</span>
                <span>Propose Exchange</span>
              </button>
              <button
                onClick={() => toggleBookmark('elena')}
                aria-label="Bookmark Trader"
                className={`w-11 h-11 rounded-xl bg-surface-container-low flex items-center justify-center shadow-xs transition-colors ${
                  bookmarkedIds.includes('elena') ? 'text-primary' : 'text-on-surface-variant'
                }`}
              >
                <span className="material-symbols-outlined text-[20px]">
                  {bookmarkedIds.includes('elena') ? 'bookmark' : 'bookmark_border'}
                </span>
              </button>
            </div>
          </div>

          {/* Card 2: Julian Morales */}
          <div className="rounded-2xl bg-surface-container-lowest p-space-md shadow-sm flex flex-col gap-3">
            <div className="flex items-start justify-between gap-space-sm">
              <div className="flex items-center gap-3">
                <img
                  className="w-12 h-12 rounded-full object-cover"
                  alt="Julian Morales"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAGlvAi8kZKsN2Xbzp3xZ1NuUypqlbAPDHT9qrvhKZsOMqYvQVJdoJiewJL5ahEbflrLxPsYO6zc89fTi65QMsDQdMaQOho1H5xT_WAFkD8EUO8oP8l22412xL6CO9DC0gg6TsQQ3ZWXqUh_upiA6zJGnycduhXN-lpDxWXu7znBgc1-sx7G3q7UesHeswJswdSq5ZXBKvgKKc7MjcIzmJNFDQZNzRKSt1cIlM4inYBv0GBhxEIuuk"
                />
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-title-md text-title-md text-on-surface font-semibold">Julian Morales</span>
                    <span className="material-symbols-outlined text-secondary text-[16px]">verified</span>
                  </div>
                  <span className="font-body-sm text-body-sm text-on-surface-variant">Concert Guitarist & Composer</span>
                </div>
              </div>
              <div className="flex flex-col items-end">
                <div className="flex items-center gap-0.5 text-tertiary font-label-md text-label-md">
                  <span className="material-symbols-outlined text-[16px]">star</span>
                  <span>4.9</span>
                </div>
                <span className="font-label-sm text-label-sm text-on-surface-variant">42 swaps</span>
              </div>
            </div>

            <div className="rounded-xl bg-surface-container-low p-2.5 flex flex-col gap-2">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 min-w-0">
                  <span className="w-2 h-2 rounded-full bg-primary shrink-0"></span>
                  <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider shrink-0">Offers</span>
                  <span className="font-label-md text-label-md text-on-surface truncate font-medium">Classical & Flamenco Guitar</span>
                </div>
                <span className="px-2 py-0.5 rounded bg-surface-container-high font-label-sm text-label-sm text-primary shrink-0">Direct 1:1</span>
              </div>

              <div className="flex items-center justify-center my-0.5">
                <div className="w-6 h-6 rounded-full bg-secondary-container text-secondary flex items-center justify-center">
                  <span className="material-symbols-outlined text-[14px]">swap_vert</span>
                </div>
              </div>

              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 min-w-0">
                  <span className="w-2 h-2 rounded-full bg-secondary shrink-0"></span>
                  <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider shrink-0">Wants</span>
                  <span className="font-label-md text-label-md text-secondary truncate font-medium">SEO & Website Audit</span>
                </div>
                <span className="font-body-sm text-body-sm text-on-surface-variant shrink-0">1 hr/wk</span>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={() => onRequestTrade({ authorName: 'Julian Morales', teaches: 'Classical & Flamenco Guitar', wants: 'SEO & Website Audit' })}
                className="flex-1 h-11 rounded-xl bg-primary text-on-primary font-label-md text-label-md flex items-center justify-center gap-1.5 shadow-sm active:scale-98 transition-transform cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">handshake</span>
                <span>Propose Exchange</span>
              </button>
              <button
                onClick={() => toggleBookmark('julian')}
                aria-label="Bookmark Trader"
                className={`w-11 h-11 rounded-xl bg-surface-container-low flex items-center justify-center shadow-xs transition-colors ${
                  bookmarkedIds.includes('julian') ? 'text-primary' : 'text-on-surface-variant'
                }`}
              >
                <span className="material-symbols-outlined text-[20px]">
                  {bookmarkedIds.includes('julian') ? 'bookmark' : 'bookmark_border'}
                </span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Reciprocal Impact Stats Bar */}
      <section className="px-gutter-mobile py-space-sm">
        <div className="rounded-2xl bg-surface-container-high p-space-md flex items-center justify-between shadow-xs">
          <div className="flex flex-col">
            <span className="font-headline-sm text-headline-sm text-primary font-bold">14,280+</span>
            <span className="font-label-sm text-label-sm text-on-surface-variant">Hours swapped peer-to-peer</span>
          </div>
          <div className="h-9 w-px bg-outline-variant/40"></div>
          <div className="flex flex-col">
            <span className="font-headline-sm text-headline-sm text-secondary font-bold">98.6%</span>
            <span className="font-label-sm text-label-sm text-on-surface-variant">Positive reciprocal ratings</span>
          </div>
        </div>
      </section>

      {/* How TradeSkill Works */}
      <section className="px-gutter-mobile py-space-lg flex flex-col gap-space-md">
        <div>
          <h2 className="font-headline-sm text-headline-sm text-on-surface">How TradeSkill Works</h2>
          <p className="font-body-sm text-body-sm text-on-surface-variant">Competence replaces currency in 3 simple steps</p>
        </div>

        <div className="flex flex-col gap-3">
          <div className="rounded-2xl bg-surface-container-low p-space-md flex gap-space-md shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-primary text-on-primary font-headline-sm text-headline-sm flex items-center justify-center shrink-0">
              1
            </div>
            <div className="flex flex-col gap-1">
              <h3 className="font-title-md text-title-md text-on-surface font-semibold">List What You Teach & Seek</h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                Create your balance sheet: the skills you can coach 1-on-1 and the passions or tools you want to master.
              </p>
            </div>
          </div>

          <div className="rounded-2xl bg-surface-container-low p-space-md flex gap-space-md shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-secondary text-on-secondary font-headline-sm text-headline-sm flex items-center justify-center shrink-0">
              2
            </div>
            <div className="flex flex-col gap-1">
              <h3 className="font-title-md text-title-md text-on-surface font-semibold">Match with Complementary Peers</h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                Our barter engine finds bilateral matches where both participants gain equal value on mutually agreed terms.
              </p>
            </div>
          </div>

          <div className="rounded-2xl bg-surface-container-low p-space-md flex gap-space-md shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-tertiary-container text-on-tertiary-container font-headline-sm text-headline-sm flex items-center justify-center shrink-0">
              3
            </div>
            <div className="flex flex-col gap-1">
              <h3 className="font-title-md text-title-md text-on-surface font-semibold">Meet 1:1 and Swap Skills for Free</h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                Hop into shared video rooms with integrated collaborative whiteboards and screen sharing. No money, pure mastery.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Start Trading Today CTA Card */}
      <section className="px-gutter-mobile pt-space-xs pb-space-sm">
        <div className="rounded-2xl bg-primary text-on-primary p-space-md shadow-lg relative overflow-hidden flex flex-col gap-3">
          <div className="absolute -right-6 -bottom-6 w-32 h-32 rounded-full bg-primary-container blur-xl pointer-events-none"></div>
          <div className="relative z-10 flex flex-col gap-2">
            <span className="font-label-sm text-label-sm uppercase tracking-wider text-primary-fixed-dim">Start Trading Today</span>
            <h3 className="font-headline-sm text-headline-sm text-on-primary font-bold">Have a talent? Someone needs it.</h3>
            <p className="font-body-sm text-body-sm text-primary-fixed leading-relaxed">
              Set up your barter card in less than 2 minutes and unlock an infinite world of reciprocal coaching.
            </p>
            <button
              onClick={onOpenQuickList}
              className="mt-1 h-11 px-6 rounded-xl bg-surface-container-lowest text-primary font-label-md text-label-md self-start flex items-center gap-1.5 shadow-sm active:scale-98 transition-transform cursor-pointer font-semibold"
            >
              <span className="material-symbols-outlined text-[18px]">add_circle</span>
              <span>Create My Barter Card</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
