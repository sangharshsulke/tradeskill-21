import React, { useState } from 'react';
import { ScreenType } from '../types';

interface AboutViewProps {
  onNavigate: (screen: ScreenType) => void;
  onOpenQuickList: () => void;
  onShowToast: (msg: string) => void;
}

export const AboutView: React.FC<AboutViewProps> = ({
  onNavigate,
  onOpenQuickList,
  onShowToast,
}) => {
  const [pledged, setPledged] = useState(false);
  const [showPledgeModal, setShowPledgeModal] = useState(false);

  const handlePledge = () => {
    setPledged(true);
    onShowToast('Welcome to the circle! Your first reciprocity credit is primed.');
  };

  return (
    <div className="flex flex-col w-full pb-12">
      {/* Interactive Reciprocity Header Banner */}
      <section className="relative px-gutter-mobile pt-space-md">
        <div className="relative overflow-hidden rounded-xl bg-surface-container-high p-6 shadow-sm">
          <div className="absolute -right-8 -bottom-8 w-44 h-44 rounded-full bg-secondary-container/50 blur-2xl pointer-events-none"></div>
          <div className="absolute -left-10 -top-10 w-40 h-40 rounded-full bg-primary-container/20 blur-xl pointer-events-none"></div>

          <div className="relative z-10 flex flex-col gap-space-sm">
            <div className="inline-flex items-center gap-space-xs self-start px-2.5 py-1 rounded-full bg-surface-container-lowest shadow-sm text-secondary">
              <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                eco
              </span>
              <span className="font-label-sm text-label-sm uppercase tracking-wider font-bold">
                Zero-Dollar Economy
              </span>
            </div>

            <h2 className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface leading-tight">
              Where competence replaces currency.
            </h2>

            <p className="font-body-md text-body-md text-on-surface-variant">
              TradeSkill transforms how the world learns. We believe mastery is meant to be circulated, not sold behind paywalls. Every skill you share unlocks world-class mentorship in return.
            </p>

            {/* Dynamic Live Reciprocity Widget */}
            <div className="mt-space-sm p-space-md rounded-xl bg-surface-container-lowest shadow-sm flex flex-col gap-space-sm">
              <div className="flex items-center justify-between">
                <span className="font-label-md text-label-md text-on-surface font-semibold">Your Exchange Parity</span>
                <span className="font-label-md text-label-md text-secondary font-semibold">
                  1.0 : 1.0 (Direct Parity)
                </span>
              </div>

              <div className="grid grid-cols-2 gap-space-sm relative">
                <div className="p-space-sm rounded-lg bg-surface-container-low flex flex-col">
                  <span className="font-label-sm text-label-sm text-on-surface-variant">You Give</span>
                  <span className="font-title-md text-title-md text-primary mt-0.5 font-bold">1 Hour Taught</span>
                  <span className="font-body-sm text-body-sm text-on-surface-variant">Python Basics</span>
                </div>

                {/* Kinetic Arrow Center Badge */}
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center shadow-sm z-10">
                  <span className="material-symbols-outlined text-[18px]">sync_alt</span>
                </div>

                <div className="p-space-sm rounded-lg bg-surface-container-low flex flex-col text-right">
                  <span className="font-label-sm text-label-sm text-on-surface-variant">You Receive</span>
                  <span className="font-title-md text-title-md text-secondary mt-0.5 font-bold">1 Hour Mentored</span>
                  <span className="font-body-sm text-body-sm text-on-surface-variant">Jazz Piano Improv</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Editorial Mission Narrative Section */}
      <section className="px-gutter-mobile mt-space-lg flex flex-col gap-space-sm">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-primary-container"></span>
          <span className="font-label-md text-label-md uppercase tracking-wider text-on-surface-variant font-bold">
            Our Manifesto
          </span>
        </div>

        <div className="p-6 rounded-xl bg-surface-container-lowest shadow-sm flex flex-col gap-space-md border border-outline-variant/20">
          <div className="relative w-full h-44 rounded-lg overflow-hidden shadow-sm">
            <img
              className="w-full h-full object-cover"
              alt="Two professionals exchanging skills across a sunlit cafe table"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDdhyslspBoY8vFB-q7w1PVgpgwMT6evPxs0nnqS6tFmTDbHDC3uDxSgIYW39sGUCHT4DZpXCoKIbFVT7DnOAIQPFQq3MImCZOilqebQsC-sQOzCN-b2LjK8YP8_ndxYAMDIKxkOd6WXA2UxdYWOvZc8saCcdH6Pdv569xYMjW0pjTqrj8UNzjY-9NfWz2gAseGWJ7FssIlcltd6QHEYi2PnE4xSBZBxBmpmSXABoYRTnLsok4PxII"
            />
            <div className="absolute bottom-3 left-3 bg-inverse-surface/80 backdrop-blur-md px-3 py-1 rounded-full text-inverse-on-surface font-label-sm text-label-sm">
              Equalizing knowledge worldwide
            </div>
          </div>

          <p className="font-body-lg text-body-lg text-on-surface leading-relaxed">
            We started TradeSkill because human potential shouldn’t be governed by credit limits or geography. A senior engineer in Nairobi has just as much value to exchange as a classical cellist in Vienna or a ceramist in Kyoto.
          </p>

          <blockquote className="p-space-md rounded-lg bg-surface-container-low text-on-surface italic font-body-md text-body-md relative pl-8">
            <span className="material-symbols-outlined absolute left-2 top-2 text-[20px] text-primary/40 not-italic">
              format_quote
            </span>
            "A zero-dollar knowledge economy where human expertise is the only currency."
          </blockquote>
        </div>
      </section>

      {/* Live Impact Metrics Counter */}
      <section className="px-gutter-mobile mt-space-lg">
        <div className="grid grid-cols-3 gap-2">
          <div className="p-space-md rounded-xl bg-surface-container-lowest shadow-sm text-center flex flex-col justify-center items-center border border-outline-variant/20">
            <span className="material-symbols-outlined text-primary text-[24px] mb-1">public</span>
            <span className="font-headline-sm text-headline-sm text-on-surface tracking-tight font-bold">120+</span>
            <span className="font-label-sm text-label-sm text-on-surface-variant">Nations</span>
          </div>
          <div className="p-space-md rounded-xl bg-surface-container-lowest shadow-sm text-center flex flex-col justify-center items-center border border-outline-variant/20">
            <span className="material-symbols-outlined text-secondary text-[24px] mb-1">handshake</span>
            <span className="font-headline-sm text-headline-sm text-on-surface tracking-tight font-bold">45,000+</span>
            <span className="font-label-sm text-label-sm text-on-surface-variant">Skills Exchanged</span>
          </div>
          <div className="p-space-md rounded-xl bg-secondary-container/40 shadow-sm text-center flex flex-col justify-center items-center border border-secondary-container/30">
            <span className="material-symbols-outlined text-on-secondary-container text-[24px] mb-1">savings</span>
            <span className="font-headline-sm text-headline-sm text-on-secondary-container font-bold">$0</span>
            <span className="font-label-sm text-label-sm text-on-secondary-fixed-variant font-medium">Cash Spent</span>
          </div>
        </div>
      </section>

      {/* The Mechanics - How Mutual Mastery Works */}
      <section className="px-gutter-mobile mt-space-lg flex flex-col gap-space-md">
        <div className="flex items-center justify-between">
          <div>
            <span className="font-label-md text-label-md uppercase tracking-wider text-on-surface-variant font-bold">
              The Mechanics
            </span>
            <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">How Mutual Mastery Works</h3>
          </div>
          <span className="material-symbols-outlined text-primary">model_training</span>
        </div>

        {/* Step 1 */}
        <div className="p-5 rounded-xl bg-surface-container-lowest shadow-sm flex flex-col gap-space-sm relative overflow-hidden border border-outline-variant/20">
          <div className="flex items-center gap-space-sm">
            <div className="w-8 h-8 rounded-full bg-primary-container text-on-primary font-headline-sm text-headline-sm flex items-center justify-center shrink-0 font-bold">
              1
            </div>
            <div className="flex flex-col">
              <h4 className="font-title-md text-title-md text-on-surface font-bold">Reciprocal Learning</h4>
              <span className="font-label-sm text-label-sm text-on-surface-variant">Hour-for-hour credit escrow</span>
            </div>
          </div>
          <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
            Every single hour you spend instructing someone earns you an immutable 60-minute credit to redeem with any certified mentor on the network.
          </p>
          <div className="flex items-center gap-space-xs mt-1">
            <span className="px-2 py-0.5 rounded-full bg-surface-container text-on-surface-variant font-label-sm text-label-sm">
              No Expirations
            </span>
            <span className="px-2 py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-label-sm text-label-sm font-semibold">
              Pure Equality
            </span>
          </div>
        </div>

        {/* Step 2 */}
        <div className="p-5 rounded-xl bg-surface-container-lowest shadow-sm flex flex-col gap-space-sm relative overflow-hidden border border-outline-variant/20">
          <div className="flex items-center gap-space-sm">
            <div className="w-8 h-8 rounded-full bg-secondary text-on-secondary font-headline-sm text-headline-sm flex items-center justify-center shrink-0 font-bold">
              2
            </div>
            <div className="flex flex-col">
              <h4 className="font-title-md text-title-md text-on-surface font-bold">Fair Value Barter</h4>
              <span className="font-label-sm text-label-sm text-on-surface-variant">Decoupled from market capital</span>
            </div>
          </div>
          <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
            No speculative tokenomics, volatile fiat prices, or algorithmic surge pricing. An hour of introductory woodworking is valued exactly equal to an hour of cloud security architecting.
          </p>
          <div className="p-3 rounded-lg bg-surface-container-low flex items-center justify-between text-on-surface">
            <span className="font-body-sm text-body-sm">Value parity benchmark:</span>
            <span className="font-label-md text-label-md text-secondary flex items-center gap-1 font-semibold">
              <span className="material-symbols-outlined text-[16px]">verified</span> 100% Uncompromised
            </span>
          </div>
        </div>

        {/* Step 3 */}
        <div className="p-5 rounded-xl bg-surface-container-lowest shadow-sm flex flex-col gap-space-sm relative overflow-hidden border border-outline-variant/20">
          <div className="flex items-center gap-space-sm">
            <div className="w-8 h-8 rounded-full bg-tertiary text-on-tertiary font-headline-sm text-headline-sm flex items-center justify-center shrink-0 font-bold">
              3
            </div>
            <div className="flex flex-col">
              <h4 className="font-title-md text-title-md text-on-surface font-bold">Verified Accountability</h4>
              <span className="font-label-sm text-label-sm text-on-surface-variant">Social pact & session escrow</span>
            </div>
          </div>
          <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
            Time credits are locked in reciprocal escrow when a session is scheduled and release seamlessly once both peers confirm constructive knowledge transfer.
          </p>
          <div className="flex items-center gap-2 text-on-surface-variant font-label-sm text-label-sm">
            <span className="material-symbols-outlined text-[16px] text-secondary">thumb_up</span>
            <span>99.4% session completion rate across our global network</span>
          </div>
        </div>
      </section>

      {/* Meet the Builders */}
      <section className="px-gutter-mobile mt-space-lg flex flex-col gap-space-md">
        <div>
          <span className="font-label-md text-label-md uppercase tracking-wider text-on-surface-variant font-bold">
            Practitioners First
          </span>
          <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">Meet the Builders</h3>
          <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
            Every team member actively teaches and learns on TradeSkill weekly.
          </p>
        </div>

        {/* Founder Card 1 */}
        <div className="p-5 rounded-xl bg-surface-container-lowest shadow-sm flex flex-col gap-space-md border border-outline-variant/20">
          <div className="flex items-start gap-space-md">
            <div className="relative w-16 h-16 rounded-full overflow-hidden shrink-0 shadow-sm ring-2 ring-primary/20">
              <img
                className="w-full h-full object-cover"
                alt="Maya Lin"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuATODkVGeUwrW7PR5L_PzERSCaksSQVljABlWs3HwQxd9ZXNcoxGaZXxS0Pof4fm6NbRYQsqZ-RvtePC0CziYAu7Ik4YiqCgDc-QodaMA-Dp4XDWYxHlOBPfJEW0u5lhk_59iJgjhQulAOC0adjZGuoD9x8EXABbfP14hcytuTN7sA7Ig9DSpL9GZZ9POOcczs6l8xn9LqN0M4XCVBxHC6tgkMVJEBUo90IFFPO-gvspEkR5v8s17Y"
              />
            </div>
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1">
                <h4 className="font-title-md text-title-md text-on-surface font-bold truncate">Maya Lin</h4>
                <span className="material-symbols-outlined text-primary text-[16px]" title="Platform Host">
                  workspace_premium
                </span>
              </div>
              <span className="font-label-sm text-label-sm text-primary font-semibold">Co-Founder & System Architect</span>
              <p className="font-body-sm text-body-sm text-on-surface-variant mt-1 leading-relaxed">
                Former peer-learning researcher at MIT Media Lab. Passionate about community-governed protocols and accessible pedagogy.
              </p>
            </div>
          </div>

          {/* Skill Pairings */}
          <div className="p-3 rounded-lg bg-surface-container-low flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary font-label-sm text-label-sm shrink-0 font-semibold">
                Offers
              </span>
              <span className="font-body-sm text-body-sm text-on-surface truncate">Distributed Systems & API Design</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-full bg-secondary/15 text-secondary font-label-sm text-label-sm shrink-0 font-semibold">
                Learns
              </span>
              <span className="font-body-sm text-body-sm text-on-surface truncate">Ceramic Wheel Throwing & Glazing</span>
            </div>
          </div>
        </div>

        {/* Founder Card 2 */}
        <div className="p-5 rounded-xl bg-surface-container-lowest shadow-sm flex flex-col gap-space-md border border-outline-variant/20">
          <div className="flex items-start gap-space-md">
            <div className="relative w-16 h-16 rounded-full overflow-hidden shrink-0 shadow-sm ring-2 ring-primary/20">
              <img
                className="w-full h-full object-cover"
                alt="Tariq Chen"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCXdRgFTpLYFdg_ITEwdlVkPGBVDkK-V6X1I7rL1UdfACANJaaaRQ4qy1Z1yonJq9683KLFXZr-hm9aRpXFNA2QNwjJr39nB2sgMoPBpUxmV8KDX-_9MxlV4MuOYF4p_Lo0smY87JH_m5fH_V2FYU7RK4CXKJ27QrzHiilDlhQIMLpS_KmL3mAdZ0lG-lUoptl04osKbrCjyI6vPmZdlqZO2KjX176UBG0e2s4hEKKbn_y2bgZF7w0"
              />
            </div>
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1">
                <h4 className="font-title-md text-title-md text-on-surface font-bold truncate">Tariq Chen</h4>
                <span className="material-symbols-outlined text-secondary text-[16px]">verified</span>
              </div>
              <span className="font-label-sm text-label-sm text-secondary font-semibold">Co-Founder & Community Lead</span>
              <p className="font-body-sm text-body-sm text-on-surface-variant mt-1 leading-relaxed">
                Serial civic technologist. Built grassroots mentoring coalitions across 20+ emerging creative hubs before TradeSkill.
              </p>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-surface-container-low flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary font-label-sm text-label-sm shrink-0 font-semibold">
                Offers
              </span>
              <span className="font-body-sm text-body-sm text-on-surface truncate">Conversational Mandarin & Storytelling</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-full bg-secondary/15 text-secondary font-label-sm text-label-sm shrink-0 font-semibold">
                Learns
              </span>
              <span className="font-body-sm text-body-sm text-on-surface truncate">Sound Engineering & Synthesizers</span>
            </div>
          </div>
        </div>
      </section>

      {/* Community Values & Code of Conduct */}
      <section className="px-gutter-mobile mt-space-lg flex flex-col gap-space-md">
        <div>
          <span className="font-label-md text-label-md uppercase tracking-wider text-on-surface-variant font-bold">
            The Social Compact
          </span>
          <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">Community Values</h3>
        </div>

        <div className="p-5 rounded-xl bg-surface-container-lowest shadow-sm flex flex-col gap-space-md border border-outline-variant/20">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-secondary-container text-on-secondary-container flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[20px]">volunteer_activism</span>
            </div>
            <div className="flex flex-col">
              <h4 className="font-title-md text-title-md text-on-surface font-semibold">Generosity in Teaching</h4>
              <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5 leading-relaxed">
                Mentors arrive prepared, attentive, and fully engaged. There are no gatekept secrets—we teach with full hearts and patient clarity.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-surface-container text-on-surface flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[20px]">schedule</span>
            </div>
            <div className="flex flex-col">
              <h4 className="font-title-md text-title-md text-on-surface font-semibold">Sacred Punctuality</h4>
              <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5 leading-relaxed">
                Since time is our collective currency, showing up on schedule honors your partner's life and dedication. A 5-minute grace period is observed.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary-container/20 text-primary flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[20px]">diversity_3</span>
            </div>
            <div className="flex flex-col">
              <h4 className="font-title-md text-title-md text-on-surface font-semibold">Radical Mutual Respect</h4>
              <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5 leading-relaxed">
                Zero tolerance for discrimination, condescension, or commercial solicitation. Every member is both a master and a lifelong student.
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowPledgeModal(true)}
            className="mt-2 p-3 rounded-lg bg-surface-container-high/60 hover:bg-surface-container-high transition-colors flex items-center justify-between w-full text-left cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary text-[20px]">gavel</span>
              <span className="font-label-md text-label-md text-on-surface font-semibold">Community Pledge</span>
            </div>
            <span className="font-label-sm text-label-sm text-secondary font-medium">Read Full Code</span>
          </button>
        </div>
      </section>

      {/* Interactive Call-To-Action Card */}
      <section className="px-gutter-mobile mt-space-lg">
        <div className="p-6 rounded-xl bg-primary-container text-on-primary shadow-md relative overflow-hidden flex flex-col gap-space-md">
          <div className="absolute -right-12 -top-12 w-40 h-40 rounded-full bg-surface-tint/40 blur-xl pointer-events-none"></div>
          <div className="relative z-10 flex flex-col gap-1">
            <span className="font-label-sm text-label-sm text-on-primary-container uppercase tracking-wider font-semibold">
              Begin Today
            </span>
            <h3 className="font-headline-sm text-headline-sm text-on-primary font-bold">What will you teach first?</h3>
            <p className="font-body-sm text-body-sm text-on-primary-container leading-relaxed">
              Deposit your first skill hour and instantly browse thousands of verified craftspeople and practitioners ready to reciprocate.
            </p>
          </div>

          <div className="relative z-10 flex flex-col gap-2">
            <button
              onClick={handlePledge}
              className="w-full h-12 rounded-lg bg-secondary text-on-secondary font-label-md text-label-md flex items-center justify-center gap-2 shadow-sm transition-transform active:scale-95 cursor-pointer font-semibold"
            >
              <span className="material-symbols-outlined text-[20px]">add_task</span>
              Offer a Skill & Join
            </button>
            <button
              onClick={() => onNavigate('skills')}
              className="w-full h-11 rounded-lg bg-white/10 text-on-primary font-label-md text-label-md flex items-center justify-center transition-colors active:bg-white/20 cursor-pointer"
            >
              Browse Active Skills Directory
            </button>
          </div>

          {pledged && (
            <div className="relative z-10 p-2.5 rounded-lg bg-white/15 text-center font-label-sm text-label-sm text-on-primary animate-in fade-in">
              Welcome to the circle! Your first reciprocity credit is primed.
            </div>
          )}
        </div>
      </section>

      {/* Community Pledge Modal */}
      {showPledgeModal && (
        <div className="fixed inset-0 z-50 bg-inverse-surface/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="absolute inset-0" onClick={() => setShowPledgeModal(false)} />
          <div className="relative bg-surface-container-lowest w-full max-w-md rounded-2xl p-5 shadow-2xl z-10 space-y-3 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-2 border-b border-outline-variant/30">
              <h3 className="font-headline-sm text-headline-sm text-on-surface">The TradeSkill Pledge</h3>
              <button
                onClick={() => setShowPledgeModal(false)}
                className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:text-on-surface"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>
            <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
              "I pledge to bring my full authentic expertise, preparation, and empathy to every exchange. I understand that time is sacred and equal, and that no discipline is superior to another in our circle of mutual growth."
            </p>
            <button
              onClick={() => {
                setShowPledgeModal(false);
                onShowToast('Pledge affirmed! Thank you for maintaining peer equity.');
              }}
              className="w-full py-2.5 rounded-xl bg-primary text-on-primary font-label-md text-label-md font-semibold mt-2 cursor-pointer shadow-sm"
            >
              I Affirm the Compact
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
