import React, { useState } from 'react';
import { ScreenType, SupportTicket } from '../types';

interface ContactViewProps {
  onNavigate: (screen: ScreenType) => void;
  onOpenLiveChat: () => void;
  onSubmitTicket: (ticket: SupportTicket) => Promise<{ ticketCode: string } | undefined>;
  onShowToast: (msg: string) => void;
}

export const ContactView: React.FC<ContactViewProps> = ({
  onNavigate,
  onOpenLiveChat,
  onSubmitTicket,
  onShowToast,
}) => {
  const [fullName, setFullName] = useState('Maya Chen');
  const [email, setEmail] = useState('maya@example.com');
  const [selectedCategory, setSelectedCategory] = useState('General Inquiry');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [ticketSent, setTicketSent] = useState(false);
  const [ticketCode, setTicketCode] = useState('');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const categories = [
    'General Inquiry',
    'Session Support / Dispute',
    'Partnerships',
    'Report a Bug',
    'Feature Suggestion',
  ];

  const faqs = [
    {
      q: 'How does skill trading work without money?',
      a: 'TradeSkill operates on balanced reciprocity. Time is the unit of equity: teaching one hour yields one credit toward learning one hour. You can exchange directly (1:1 mutual swaps) or bank session hours to redeem with any certified mentor in the community pool.'
    },
    {
      q: "What happens if a partner doesn't show up?",
      a: 'We enforce a 15-minute sync grace period. If your swap partner fails to arrive without 2-hour advance cancellation notice, their reliability score adjusts and your reserved credit unlocks instantly with a bonus "Make-Good Voucher" to reschedule immediately.'
    },
    {
      q: 'Can I learn a beginner skill while offering an advanced skill?',
      a: 'Absolutely! In fact, that is the essence of TradeSkill. A Senior Cloud Architect can swap React mentorship for beginner acoustic guitar lessons. Passion and attention are valued symmetrically regardless of mastery tier.'
    },
    {
      q: 'Are background checks or skill verifications required?',
      a: 'Every member undergoes two-factor identity validation. For technical or professional tracks, users can voluntarily submit repository commits, design portfolios, or complete a 10-minute peer audit to earn an authentic "Verified Skill Badge".'
    },
    {
      q: 'How are disputes resolved?',
      a: 'If expectations diverge during an exchange, either party can initiate a Dispute Pause. An impartial Community Arbiter reviews the recorded curriculum agreement, chat notes, and milestone outlines to return or rebalance trade hours fairly within 24 hours.'
    }
  ];

  const handleSubmitDispatch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    setSubmitting(true);
    const result = await onSubmitTicket({ fullName, email, category: selectedCategory, message });
    setSubmitting(false);
    if (result) {
      setTicketCode(result.ticketCode);
      setTicketSent(true);
      setMessage('');
      onShowToast(`Support dispatch received! Assigned ticket #${result.ticketCode}.`);
    }
  };

  const toggleFaq = (idx: number) => {
    setExpandedFaq(expandedFaq === idx ? null : idx);
  };

  return (
    <div className="flex flex-col w-full pb-10">
      {/* Warm Intro & Context Card */}
      <section className="px-gutter-mobile pt-space-md">
        <div className="relative overflow-hidden rounded-xl bg-surface-container-high p-space-lg shadow-sm">
          <div className="absolute -right-6 -bottom-6 w-32 h-32 rounded-full bg-secondary-container/40 blur-2xl pointer-events-none"></div>

          <div className="relative z-10 flex flex-col gap-space-xs">
            <div className="inline-flex items-center gap-space-xs self-start px-space-sm py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-label-sm text-label-sm font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse"></span>
              Support Team Active
            </div>
            <h2 className="font-headline-md text-headline-md text-on-surface">
              We're here to help you trade skills smoothly. Reach out anytime.
            </h2>
            <p className="font-body-md text-body-md text-on-surface-variant">
              Whether you are calibrating a trade balance, onboarding a partner, or encountering an issue, our concierge and community stewards are on standby.
            </p>
          </div>

          {/* Live concierge mini-badge */}
          <div className="mt-space-md pt-space-md flex items-center justify-between gap-space-sm bg-surface-container-lowest/80 backdrop-blur-sm rounded-lg p-space-sm shadow-sm border border-outline-variant/10">
            <div className="flex items-center gap-space-sm">
              <div className="relative flex -space-x-2">
                <img
                  className="w-8 h-8 rounded-full object-cover ring-2 ring-white"
                  alt="Community concierge"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAea6e4tXQhI7iqXUyVK1dFT1jhAnP1RcfimzXrV3K3Y51x0ItLADf55N5bbPz0_SMiA-Iqm9PpGi41PAC1eeuJSxDMG-0rAp5bN13fcphAR3IjEQ1wY4NWWLtxQwSgp3gWCrvh_trBlSdPR0cmkh6RYWslttUJBIVl3hV8YIj5tjV8IwntsPWcivUO1DJQ7bNjEPdAOnFFSriBJ0i_y54aE2zuateUspvoTe-T3kBMvcDYbLDpexQ"
                />
                <img
                  className="w-8 h-8 rounded-full object-cover ring-2 ring-white"
                  alt="Peer educator"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCeSNOr3lcMp0YWmcqDAy-FDDocVryhifAjtogteWybFswuVQs4DN10Wr68p7UwMiFxXHR63c2H1-P5Kjr3iTwI-pgyXelSuskzxhAKLuDkHidnrtuNJ_pHjp-EnhTEUM1ScdjPCfHyfywXWkEWbC01ylx0zNVbE5ctyika-28BXcoO6ZKycMtSw_0wGkgYfoa63TFd3mDsVO5GGbGfRVHwEmsn4gaLmfSGP5-6xcZEVSTgXU37vok"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-label-md text-label-md text-on-surface font-semibold">Human assistance</span>
                <span className="font-body-sm text-body-sm text-secondary font-medium">Median response: 4.8 mins</span>
              </div>
            </div>
            <div className="flex items-center gap-space-xs text-secondary font-label-sm text-label-sm font-semibold">
              <span className="material-symbols-outlined text-[18px]">verified_user</span>
              <span>Safe Exchange</span>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Help Channels */}
      <section className="px-gutter-mobile pt-space-lg flex flex-col gap-space-sm">
        <div className="flex items-center justify-between px-space-xs">
          <h2 className="font-headline-sm text-headline-sm text-on-surface">Quick Channels</h2>
          <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-semibold">
            Fastest Paths
          </span>
        </div>

        <div className="flex flex-col gap-space-sm">
          {/* Live Chat Card */}
          <button
            onClick={onOpenLiveChat}
            className="group text-left w-full p-space-md rounded-xl bg-surface-container-lowest hover:bg-surface-container-low transition-all shadow-sm active:scale-[0.99] flex items-center justify-between gap-space-md border border-outline-variant/20 cursor-pointer"
            type="button"
          >
            <div className="flex items-center gap-space-md min-w-0">
              <div className="w-12 h-12 shrink-0 rounded-xl bg-primary-container text-on-primary flex items-center justify-center shadow-md">
                <span className="material-symbols-outlined text-[24px]">chat_bubble</span>
              </div>
              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-space-xs">
                  <span className="font-title-md text-title-md text-on-surface truncate font-semibold">
                    Live Chat Support
                  </span>
                  <span className="w-2 h-2 rounded-full bg-secondary shrink-0"></span>
                </div>
                <span className="font-body-sm text-body-sm text-secondary truncate">
                  Avg. reply 5 min • 24/7 coverage
                </span>
              </div>
            </div>
            <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary transition-colors text-[20px] shrink-0">
              arrow_forward_ios
            </span>
          </button>

          {/* Community Discord */}
          <button
            onClick={() => onShowToast('Opening TradeSkill 12k Community Discord lounge in new window...')}
            className="group text-left w-full p-space-md rounded-xl bg-surface-container-lowest hover:bg-surface-container-low transition-all shadow-sm active:scale-[0.99] flex items-center justify-between gap-space-md border border-outline-variant/20 cursor-pointer"
          >
            <div className="flex items-center gap-space-md min-w-0">
              <div className="w-12 h-12 shrink-0 rounded-xl bg-secondary-container text-on-secondary-container flex items-center justify-center">
                <span className="material-symbols-outlined text-[24px]">groups</span>
              </div>
              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-space-xs">
                  <span className="font-title-md text-title-md text-on-surface truncate font-semibold">
                    Community Discord
                  </span>
                  <span className="font-label-sm text-label-sm px-1.5 py-0.2 rounded-full bg-surface-container-high text-on-surface font-semibold">
                    12k peers
                  </span>
                </div>
                <span className="font-body-sm text-body-sm text-on-surface-variant truncate">
                  Peer tips, live audio study lounges & syncs
                </span>
              </div>
            </div>
            <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary transition-colors text-[20px] shrink-0">
              open_in_new
            </span>
          </button>

          {/* Safety & Dispute Resolution */}
          <button
            onClick={() => {
              setSelectedCategory('Session Support / Dispute');
              onShowToast('Dispute category selected in dispatch form below.');
            }}
            className="group text-left w-full p-space-md rounded-xl bg-surface-container-lowest hover:bg-surface-container-low transition-all shadow-sm active:scale-[0.99] flex items-center justify-between gap-space-md border border-outline-variant/20 cursor-pointer"
            type="button"
          >
            <div className="flex items-center gap-space-md min-w-0">
              <div className="w-12 h-12 shrink-0 rounded-xl bg-surface-container-highest text-primary flex items-center justify-center">
                <span className="material-symbols-outlined text-[24px]">balance</span>
              </div>
              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-space-xs">
                  <span className="font-title-md text-title-md text-on-surface truncate font-semibold">
                    Safety & Dispute Resolution
                  </span>
                </div>
                <span className="font-body-sm text-body-sm text-on-surface-variant truncate">
                  Fair-trade arbitration & session assurance
                </span>
              </div>
            </div>
            <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary transition-colors text-[20px] shrink-0">
              arrow_forward_ios
            </span>
          </button>
        </div>
      </section>

      {/* Interactive Contact Form Section */}
      <section className="px-gutter-mobile pt-space-xl">
        <div className="bg-surface-container-lowest rounded-2xl p-space-lg shadow-sm flex flex-col gap-space-md border border-outline-variant/20">
          <div>
            <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold">Send a Dispatch</h2>
            <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
              Detailed cases are assigned directly to specialized skill stewards.
            </p>
          </div>

          <form className="flex flex-col gap-space-md" onSubmit={handleSubmitDispatch}>
            {/* Full Name */}
            <div className="flex flex-col gap-1.5">
              <label className="font-label-md text-label-md text-on-surface flex items-center justify-between font-semibold" htmlFor="fullName">
                <span>Full Name</span>
                <span className="text-on-surface-variant font-body-sm text-body-sm font-normal">Required</span>
              </label>
              <input
                id="fullName"
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Maya Chen"
                className="w-full bg-surface-container-low text-on-surface placeholder:text-outline font-body-md text-body-md px-3.5 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 border border-transparent focus:border-primary/20"
              />
            </div>

            {/* Registered Email */}
            <div className="flex flex-col gap-1.5">
              <label className="font-label-md text-label-md text-on-surface flex items-center justify-between font-semibold" htmlFor="email">
                <span>Registered Email</span>
                <span className="text-on-surface-variant font-body-sm text-body-sm font-normal">Matches account</span>
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="maya@example.com"
                className="w-full bg-surface-container-low text-on-surface placeholder:text-outline font-body-md text-body-md px-3.5 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 border border-transparent focus:border-primary/20"
              />
            </div>

            {/* Inquiry Category Pill Selector */}
            <div className="flex flex-col gap-space-xs">
              <label className="font-label-md text-label-md text-on-surface font-semibold">Inquiry Category</label>
              <div className="flex flex-wrap gap-2 pt-1">
                {categories.map((cat) => {
                  const isSelected = selectedCategory === cat;
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-3 py-1.5 rounded-full font-label-md text-label-md transition-all active:scale-95 cursor-pointer ${
                        isSelected
                          ? 'bg-primary-container text-on-primary shadow-sm font-semibold'
                          : 'bg-surface-container text-on-surface hover:bg-surface-container-high'
                      }`}
                    >
                      {cat}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Message Textarea */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label className="font-label-md text-label-md text-on-surface font-semibold" htmlFor="messageBox">
                  Message
                </label>
                <span
                  className={`font-label-sm text-label-sm ${
                    message.length >= 580 ? 'text-error font-bold' : 'text-on-surface-variant'
                  }`}
                >
                  {message.length} / 600
                </span>
              </div>
              <textarea
                id="messageBox"
                rows={4}
                required
                maxLength={600}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Share context, swap ID, or session timing so we can dive in immediately..."
                className="w-full bg-surface-container-low text-on-surface placeholder:text-outline font-body-md text-body-md px-3.5 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all resize-none border border-transparent focus:border-primary/20"
              />
            </div>

            {/* Submit Button */}
            {!ticketSent ? (
              <button
                id="submitBtn"
                type="submit"
                disabled={submitting}
                className="w-full h-12 mt-space-xs rounded-xl bg-primary-container text-on-primary font-label-md text-label-md flex items-center justify-center gap-space-xs shadow-md hover:bg-primary transition-all active:scale-[0.98] cursor-pointer font-semibold"
              >
                {submitting ? (
                  <>
                    <span className="material-symbols-outlined text-[20px] animate-spin">refresh</span>
                    <span>Dispatching Request...</span>
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-[20px]">send</span>
                    <span>Send Message</span>
                  </>
                )}
              </button>
            ) : (
              <div className="p-space-md rounded-xl bg-secondary-container text-on-secondary-container flex items-start gap-space-sm shadow-sm animate-in fade-in">
                <span className="material-symbols-outlined text-[24px] text-secondary shrink-0 mt-0.5">check_circle</span>
                <div className="flex flex-col">
                  <span className="font-title-md text-title-md font-bold">Message received with priority!</span>
                  <span className="font-body-sm text-body-sm mt-0.5">
                    Ticket #{ticketCode} opened. A copy and direct responder link were sent to {email}.
                  </span>
                </div>
              </div>
            )}
          </form>
        </div>
      </section>

      {/* FAQ Accordion Section */}
      <section className="px-gutter-mobile pt-space-xl flex flex-col gap-space-md">
        <div className="flex flex-col gap-0.5">
          <div className="flex items-center gap-space-xs text-primary font-semibold">
            <span className="material-symbols-outlined text-[18px]">quiz</span>
            <span className="font-label-sm text-label-sm uppercase tracking-wider">Clear Knowledge</span>
          </div>
          <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="flex flex-col gap-space-xs">
          {faqs.map((faq, idx) => {
            const isExpanded = expandedFaq === idx;
            return (
              <div
                key={idx}
                className="rounded-xl bg-surface-container-lowest overflow-hidden transition-all shadow-sm border border-outline-variant/20"
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(idx)}
                  className="w-full p-space-md flex items-center justify-between text-left gap-space-sm hover:bg-surface-container-low transition-colors cursor-pointer"
                >
                  <span className="font-title-md text-title-md text-on-surface font-semibold">{faq.q}</span>
                  <span
                    className={`material-symbols-outlined text-on-surface-variant transition-transform duration-200 ${
                      isExpanded ? 'rotate-180 text-primary' : ''
                    }`}
                  >
                    expand_more
                  </span>
                </button>
                {isExpanded && (
                  <div className="px-space-md pb-space-md text-on-surface-variant font-body-md text-body-md leading-relaxed animate-in fade-in duration-150">
                    <p>{faq.a}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Office & Physical Hub Guarantee */}
      <section className="px-gutter-mobile pt-space-xl flex flex-col gap-space-md">
        {/* Guarantee Banner */}
        <div className="rounded-2xl bg-primary-container text-on-primary p-space-lg flex flex-col gap-space-sm shadow-md relative overflow-hidden">
          <div className="absolute -right-8 -top-8 w-36 h-36 bg-surface-container-highest/20 rounded-full blur-xl pointer-events-none"></div>
          <div className="flex items-center gap-space-xs text-on-primary-container">
            <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
              timer
            </span>
            <span className="font-label-sm text-label-sm uppercase tracking-wider font-bold">
              Service Level Standard
            </span>
          </div>
          <p className="font-headline-sm text-headline-sm text-on-primary font-bold">
            2-Hour Urgent Resolution Guarantee
          </p>
          <p className="font-body-sm text-body-sm text-on-primary-container leading-relaxed">
            Active exchange conflicts and safety tickets submitted between 06:00 and 22:00 UTC receive prompt human intervention within two hours, guaranteed.
          </p>
        </div>

        {/* Physical Hub Details */}
        <div className="rounded-2xl bg-surface-container-lowest p-space-lg shadow-sm flex flex-col gap-space-md border border-outline-variant/20">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-space-xs text-secondary font-bold">
              <span className="material-symbols-outlined text-[20px]">storefront</span>
              <span className="font-label-sm text-label-sm uppercase tracking-wider">Physical Hub</span>
            </div>
            <h3 className="font-title-md text-title-md text-on-surface font-bold">
              TradeSkill Commons & Creator Lab
            </h3>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              In-person peer workshops, co-learning desks, and creator recording pods.
            </p>
          </div>

          {/* Static Map Visual */}
          <div
            className="w-full h-44 rounded-xl bg-cover bg-center overflow-hidden relative shadow-inner"
            style={{
              backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuDVOp_vPEAb6CFiJ1H09SLZcXOuz3vHmqMy7fal0lTPSOyK7UbHJ9j09Z9QA0_51uiSzWhn0OBaFeEVh7-eOZq0IDfgowgOzo6G-vBu5VAdiQSvFBCXuMuLp99Xxk-qKwVr336UOhebqs7rYfPsa2qo2FXPOSrF1IslTQAipRIwh6f3D5D9cotjjbRM-SDyoMTySSrOj3MfqBMMwquy-OKfE4MQKAAkOaeS-bPItbbcRfafqw7KLY8')`
            }}
          >
            <div className="absolute inset-0 bg-inverse-surface/30 backdrop-blur-[1px] flex items-end p-space-sm">
              <div className="bg-surface-container-lowest/95 backdrop-blur-md rounded-lg px-3 py-1.5 flex items-center gap-2 shadow-sm">
                <span className="material-symbols-outlined text-primary text-[18px]">location_on</span>
                <span className="font-label-sm text-label-sm text-on-surface font-semibold">
                  580 De Haro St, San Francisco, CA
                </span>
              </div>
            </div>
          </div>

          {/* Hub Hours & Direct Contact */}
          <div className="grid grid-cols-2 gap-space-sm pt-space-xs">
            <div className="p-space-sm rounded-lg bg-surface-container-low flex flex-col">
              <span className="font-label-sm text-label-sm text-on-surface-variant">Visiting Hours</span>
              <span className="font-title-md text-title-md text-on-surface mt-0.5 font-bold">Tue – Sat</span>
              <span className="font-body-sm text-body-sm text-on-surface-variant">09:00 – 19:00 PST</span>
            </div>
            <div className="p-space-sm rounded-lg bg-surface-container-low flex flex-col">
              <span className="font-label-sm text-label-sm text-on-surface-variant">Drop-in Studio</span>
              <span className="font-title-md text-title-md text-secondary mt-0.5 font-bold">Open Access</span>
              <span className="font-body-sm text-body-sm text-on-surface-variant">With active trade ID</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
