import React from 'react';
import { SkillListing } from '../types';

interface CurriculumDrawerProps {
  skill: SkillListing | null;
  isOpen: boolean;
  onClose: () => void;
  onRequestTrade: (skill: SkillListing) => void;
}

export const CurriculumDrawer: React.FC<CurriculumDrawerProps> = ({
  skill,
  isOpen,
  onClose,
  onRequestTrade,
}) => {
  if (!isOpen || !skill) return null;

  const curriculum = skill.curriculum || {
    sessions: [
      { num: 1, title: `Core Fundamentals: ${skill.teaches}`, description: 'Establishing foundation, syntax nuances, and key conceptual paradigms.' },
      { num: 2, title: 'Practical Hands-on Project Implementation', description: 'Real-world problem solving, common pitfalls, and architectural decisions.' },
      { num: 3, title: 'Advanced Optimization & Mentorship Handoff', description: 'Reviewing trade deliverables and verifying reciprocal mastery.' },
    ],
    prerequisites: 'Enthusiasm and active commitment to a 1:1 barter exchange',
    mutualDeliverable: '1 Completed capstone assignment + mutual portfolio sign-off'
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-inverse-surface/40 backdrop-blur-xs transition-opacity" 
        onClick={onClose}
      />

      {/* Drawer Content Surface */}
      <div className="relative bg-surface-container-lowest rounded-t-3xl p-5 shadow-2xl max-h-[85vh] overflow-y-auto max-w-2xl mx-auto w-full flex flex-col space-y-4 z-10 animate-in slide-in-from-bottom duration-300">
        {/* Drag Handle */}
        <div className="w-12 h-1.5 bg-outline-variant/60 rounded-full mx-auto -mt-1" />

        {/* Drawer Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <span className="font-label-sm text-label-sm text-secondary font-bold uppercase tracking-wider">
              Skill Deep Dive
            </span>
            <h3 className="font-headline-md text-headline-md text-on-surface leading-tight mt-0.5 truncate">
              {skill.teaches}
            </h3>
            <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
              Offered by {skill.authorName} • Top Verified Mentor ({skill.rating} ★)
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:text-on-surface active:scale-90 transition-transform shrink-0"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Learning Path Steps */}
        <div className="space-y-3 pt-2">
          <h4 className="font-title-md text-title-md text-on-surface font-semibold flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[20px]">menu_book</span>
            What You Will Master ({curriculum.sessions.length} Sessions)
          </h4>
          <div className="space-y-2.5">
            {curriculum.sessions.map((session) => (
              <div key={session.num} className="p-3 rounded-xl bg-surface-container-low flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-primary text-on-primary font-label-sm text-label-sm font-bold flex items-center justify-center shrink-0 mt-0.5">
                  {session.num}
                </span>
                <div>
                  <span className="font-title-md text-title-md text-on-surface block font-medium">
                    {session.title}
                  </span>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
                    {session.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Prerequisites & Outcomes */}
        <div className="grid grid-cols-2 gap-2.5 pt-1">
          <div className="p-3 rounded-xl bg-surface-container flex flex-col gap-1">
            <span className="font-label-sm text-label-sm text-on-surface-variant font-bold uppercase tracking-wider">
              Prerequisites
            </span>
            <span className="font-body-sm text-body-sm text-on-surface font-medium leading-snug">
              {curriculum.prerequisites}
            </span>
          </div>
          <div className="p-3 rounded-xl bg-secondary-container/30 flex flex-col gap-1">
            <span className="font-label-sm text-label-sm text-secondary font-bold uppercase tracking-wider">
              Mutual Deliverable
            </span>
            <span className="font-body-sm text-body-sm text-on-surface font-medium leading-snug">
              {curriculum.mutualDeliverable}
            </span>
          </div>
        </div>

        {/* Bottom action on drawer */}
        <div className="pt-2">
          <button
            onClick={() => {
              onRequestTrade(skill);
              onClose();
            }}
            className="w-full h-12 rounded-xl bg-primary text-on-primary font-label-md text-label-md shadow-md flex items-center justify-center gap-2 active:scale-95 transition-transform"
          >
            <span className="material-symbols-outlined text-[20px]">handshake</span>
            <span>Initiate Trade with this Mentor</span>
          </button>
        </div>
      </div>
    </div>
  );
};
