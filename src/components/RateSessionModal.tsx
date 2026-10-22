import React, { useState } from 'react';
import type { SessionItem } from '../types';

interface RateSessionModalProps {
  session: SessionItem | null;
  onClose: () => void;
  onSubmit: (rating: number, comment: string) => Promise<void>;
}

export const RateSessionModal: React.FC<RateSessionModalProps> = ({ session, onClose, onSubmit }) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [busy, setBusy] = useState(false);

  if (!session) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;
    setBusy(true);
    try {
      await onSubmit(rating, comment.trim());
      setComment('');
      setRating(5);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-inverse-surface/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="absolute inset-0" onClick={onClose} />
      <form
        onSubmit={handleSubmit}
        className="relative bg-surface-container-lowest w-full max-w-md rounded-2xl p-5 shadow-2xl z-10 space-y-4"
      >
        <div className="flex items-center justify-between pb-2 border-b border-outline-variant/30">
          <h3 className="font-headline-sm text-headline-sm text-on-surface">Rate {session.peerName}</h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:text-on-surface"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>
        <p className="text-sm text-on-surface-variant">
          How was learning <strong className="text-on-surface">{session.peerTeaches}</strong>?
        </p>
        <div className="flex items-center gap-1" role="radiogroup" aria-label="Rating">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              role="radio"
              aria-checked={rating === n}
              aria-label={`${n} star${n > 1 ? 's' : ''}`}
              onClick={() => setRating(n)}
              className={n <= rating ? 'text-amber-500' : 'text-outline'}
            >
              <span className="material-symbols-outlined text-[30px]" style={{ fontVariationSettings: `'FILL' ${n <= rating ? 1 : 0}` }}>
                star
              </span>
            </button>
          ))}
        </div>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={3}
          required
          placeholder="What did your partner do well?"
          className="w-full bg-surface-container-low rounded-xl px-3 py-2 text-sm text-on-surface focus:outline-none resize-none"
        />
        <button
          type="submit"
          disabled={busy || !comment.trim()}
          className="w-full py-2.5 rounded-xl bg-primary text-on-primary font-label-md text-label-md font-semibold cursor-pointer shadow-sm disabled:opacity-60"
        >
          {busy ? 'Saving…' : 'Submit review'}
        </button>
      </form>
    </div>
  );
};
