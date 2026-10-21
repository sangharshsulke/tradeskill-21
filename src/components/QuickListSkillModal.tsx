import React, { useState } from 'react';
import { SkillListing } from '../types';
import { currentUser } from '../data/mockData';

interface QuickListSkillModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddSkill: (newSkill: SkillListing) => void;
}

export const QuickListSkillModal: React.FC<QuickListSkillModalProps> = ({
  isOpen,
  onClose,
  onAddSkill,
}) => {
  const [teach, setTeach] = useState('');
  const [want, setWant] = useState('');
  const [format, setFormat] = useState('1:1 Live Video');
  const [cadence, setCadence] = useState('1 hr / week');
  const [category, setCategory] = useState<'tech' | 'creative' | 'languages' | 'music' | 'business'>('tech');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!teach.trim() || !want.trim()) return;

    const newSkill: SkillListing = {
      id: `skill-${Date.now()}`,
      authorName: currentUser.name,
      authorRole: currentUser.role,
      authorAvatar: currentUser.avatar,
      rating: 5.0,
      swapsCount: currentUser.sessionsDone,
      verified: true,
      tierBadge: 'Direct 1:1',
      tierBadgeBg: 'bg-primary-fixed text-on-primary-fixed-variant',
      teaches: teach.trim(),
      wants: want.trim(),
      ratioLabel: '1:1 Mutual Exchange',
      hoursPerWeek: cadence,
      formatBadge: format,
      category,
      curriculum: {
        sessions: [
          { num: 1, title: `Core Module: ${teach.trim()}`, description: 'Fundamentals, live practice, and mutual goal alignment.' },
          { num: 2, title: 'Hands-on Drill & Review', description: 'Interactive exercise with real-time feedback and troubleshooting.' },
          { num: 3, title: 'Synthesis & Trade Sign-off', description: 'Consolidation of skills and mutual reciprocal credit transfer.' }
        ],
        prerequisites: 'Willingness to learn and commit scheduled hours',
        mutualDeliverable: '1 Tangible artifact or certified session milestone'
      }
    };

    onAddSkill(newSkill);
    setTeach('');
    setWant('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-inverse-surface/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Sheet Form */}
      <div className="relative bg-surface-container-lowest rounded-t-3xl p-5 shadow-2xl max-h-[85vh] overflow-y-auto max-w-2xl mx-auto w-full flex flex-col space-y-4 z-10 animate-in slide-in-from-bottom duration-300">
        <div className="w-12 h-1.5 bg-outline-variant/60 rounded-full mx-auto -mt-1" />

        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-headline-md text-headline-md text-on-surface">List a Skill Trade</h3>
            <p className="font-body-sm text-body-sm text-on-surface-variant">Describe what you teach and what you want back.</p>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:text-on-surface active:scale-90"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <form className="space-y-3.5 pt-1" onSubmit={handleSubmit}>
          {/* Teach Field */}
          <div>
            <label className="block font-label-md text-label-md text-on-surface mb-1">
              I will teach <span className="text-primary">*</span>
            </label>
            <input
              type="text"
              required
              value={teach}
              onChange={(e) => setTeach(e.target.value)}
              placeholder="e.g. Prompt Engineering, Portrait Photography"
              className="w-full h-11 px-3.5 rounded-xl bg-surface-container text-on-surface font-body-md text-body-md focus:outline-none focus:ring-2 focus:ring-primary/20 border border-transparent focus:border-primary/30"
            />
          </div>

          {/* Want Field */}
          <div>
            <label className="block font-label-md text-label-md text-on-surface mb-1">
              In exchange for learning <span className="text-secondary">*</span>
            </label>
            <input
              type="text"
              required
              value={want}
              onChange={(e) => setWant(e.target.value)}
              placeholder="e.g. Advanced Excel, Spanish Conversation"
              className="w-full h-11 px-3.5 rounded-xl bg-surface-container text-on-surface font-body-md text-body-md focus:outline-none focus:ring-2 focus:ring-primary/20 border border-transparent focus:border-primary/30"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1">
              Discipline Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as any)}
              className="w-full h-11 px-3 rounded-xl bg-surface-container text-on-surface font-body-md text-body-md focus:outline-none"
            >
              <option value="tech">Tech & Code</option>
              <option value="creative">Creative & Design</option>
              <option value="languages">Languages</option>
              <option value="music">Music & Arts</option>
              <option value="business">Business & Strategy</option>
            </select>
          </div>

          {/* Format & Commitment Grid */}
          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1">Format</label>
              <select
                value={format}
                onChange={(e) => setFormat(e.target.value)}
                className="w-full h-11 px-3 rounded-xl bg-surface-container text-on-surface font-body-md text-body-md focus:outline-none"
              >
                <option>1:1 Live Video</option>
                <option>Async Reviews</option>
                <option>Project Collab</option>
              </select>
            </div>
            <div>
              <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1">Cadence</label>
              <select
                value={cadence}
                onChange={(e) => setCadence(e.target.value)}
                className="w-full h-11 px-3 rounded-xl bg-surface-container text-on-surface font-body-md text-body-md focus:outline-none"
              >
                <option>1 hr / week</option>
                <option>2 hrs / week</option>
                <option>One-off 90m</option>
              </select>
            </div>
          </div>

          {/* Direct Trade Commitment Callout */}
          <div className="p-3 rounded-xl bg-secondary-container/30 flex items-center gap-2.5">
            <span className="material-symbols-outlined text-secondary text-[22px]">verified_user</span>
            <p className="font-body-sm text-body-sm text-on-secondary-fixed-variant leading-snug">
              Protected by TradeSkill's 1:1 Reciprocal Commitment. No credits or currency required.
            </p>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full h-12 mt-2 rounded-xl bg-primary text-on-primary font-label-md text-label-md shadow-md flex items-center justify-center gap-1.5 active:scale-95 transition-transform"
          >
            <span className="material-symbols-outlined text-[18px]">publish</span>
            <span>Publish Trade Listing</span>
          </button>
        </form>
      </div>
    </div>
  );
};
