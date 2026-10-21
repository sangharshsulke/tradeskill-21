import React, { useState } from 'react';

interface ProposeSwapModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPropose: (details: { peer: string; youTeach: string; peerTeaches: string; duration: string }) => void;
  defaultPeer?: string;
  defaultTeach?: string;
  defaultWant?: string;
}

export const ProposeSwapModal: React.FC<ProposeSwapModalProps> = ({
  isOpen,
  onClose,
  onPropose,
  defaultPeer = 'Liam Vance (German Basics)',
  defaultTeach = 'Senior React Mentoring',
  defaultWant = 'German Basics',
}) => {
  const [peer, setPeer] = useState(defaultPeer);
  const [youTeach, setYouTeach] = useState(defaultTeach);
  const [peerTeaches, setPeerTeaches] = useState(defaultWant);
  const [format, setFormat] = useState<'direct' | 'bank'>('direct');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onPropose({
      peer,
      youTeach,
      peerTeaches,
      duration: format === 'direct' ? '45m each (1:1 Direct)' : '60m Bank Credit',
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-inverse-surface/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0" onClick={onClose} />
      <div className="relative bg-surface-container-lowest w-full max-w-md rounded-t-3xl sm:rounded-2xl p-space-lg space-y-space-md shadow-2xl z-10 animate-in slide-in-from-bottom duration-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[24px]">add_circle</span>
            <h2 className="font-headline-sm text-headline-sm text-on-surface">New Skill Exchange</h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:text-on-surface"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-space-sm">
          <div>
            <label className="font-label-md text-label-md text-on-surface font-semibold block mb-1">
              Select Peer from Connections
            </label>
            <select
              value={peer}
              onChange={(e) => setPeer(e.target.value)}
              className="w-full bg-surface-container-low rounded-xl p-3 text-body-md font-body-md text-on-surface focus:outline-none"
            >
              <option value="Liam Vance (German Basics)">Liam Vance (German Basics)</option>
              <option value="Elena Vance (Design Systems)">Elena Vance (Design Systems)</option>
              <option value="Chloe Chen (React Native)">Chloe Chen (React Native)</option>
              <option value="Marcus Thorne (Podcast Audio)">Marcus Thorne (Podcast Audio)</option>
              <option value="Tariq Mansour (FastAPI Architecture)">Tariq Mansour (FastAPI Architecture)</option>
              <option value="Maya Lin (User Research)">Maya Lin (User Research)</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="font-label-sm text-label-sm text-on-surface-variant mb-1 block">You Teach</label>
              <input
                type="text"
                value={youTeach}
                onChange={(e) => setYouTeach(e.target.value)}
                className="w-full bg-surface-container-low rounded-xl px-3 py-2 text-body-sm text-on-surface focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="font-label-sm text-label-sm text-on-surface-variant mb-1 block">They Teach</label>
              <input
                type="text"
                value={peerTeaches}
                onChange={(e) => setPeerTeaches(e.target.value)}
                className="w-full bg-surface-container-low rounded-xl px-3 py-2 text-body-sm text-on-surface focus:outline-none"
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="font-label-md text-label-md text-on-surface font-semibold block">
              Exchange Format
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setFormat('direct')}
                className={`p-3 rounded-xl flex flex-col items-center text-center transition-all ${
                  format === 'direct'
                    ? 'bg-surface-container-high/60 border-2 border-primary shadow-xs'
                    : 'bg-surface-container-low border-2 border-transparent opacity-70'
                }`}
              >
                <span className="font-title-md text-title-md text-primary font-bold">1:1 Direct</span>
                <span className="font-body-sm text-[11px] text-on-surface-variant mt-0.5">
                  Equal time swap (45m/45m)
                </span>
              </button>
              <button
                type="button"
                onClick={() => setFormat('bank')}
                className={`p-3 rounded-xl flex flex-col items-center text-center transition-all ${
                  format === 'bank'
                    ? 'bg-surface-container-high/60 border-2 border-primary shadow-xs'
                    : 'bg-surface-container-low border-2 border-transparent opacity-70'
                }`}
              >
                <span className="font-title-md text-title-md text-on-surface font-bold">Bank Credit</span>
                <span className="font-body-sm text-[11px] text-on-surface-variant mt-0.5">
                  Draw from timebank
                </span>
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-primary text-on-primary font-label-md text-label-md font-semibold active:scale-[0.98] transition-transform shadow-md mt-2"
          >
            Propose Session
          </button>
        </form>
      </div>
    </div>
  );
};
