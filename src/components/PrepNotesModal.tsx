import React, { useState } from 'react';

interface PrepNotesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (notes: string) => void;
  initialNotes?: string;
}

export const PrepNotesModal: React.FC<PrepNotesModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialNotes = '• 15:00 - 15:45: Deep-dive into qualitative UX user interview synthesis frameworks.\n• 15:45 - 16:30: German conversational drills: ordering food, introductions, cases.'
}) => {
  const [notes, setNotes] = useState(initialNotes);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-inverse-surface/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0" onClick={onClose} />
      <div className="relative bg-surface-container-lowest w-full max-w-md rounded-t-3xl sm:rounded-2xl p-space-lg space-y-space-md shadow-2xl z-10 animate-in slide-in-from-bottom duration-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[24px]">description</span>
            <h2 className="font-headline-sm text-headline-sm text-on-surface">Exchange Prep Notes</h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:text-on-surface"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        <div className="space-y-space-sm">
          <label className="font-label-md text-label-md text-on-surface font-semibold block">
            Shared Agenda & Links
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full bg-surface-container-low rounded-xl p-3 text-body-md font-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 leading-relaxed resize-none"
            placeholder="Paste Figma links, Loom videos, or questions you wish to cover during the swap..."
            rows={5}
          />
        </div>

        <div className="bg-surface-container-low p-3 rounded-xl flex items-center gap-2 text-body-sm font-body-sm text-on-surface-variant">
          <span className="material-symbols-outlined text-secondary text-[20px] shrink-0">lock_reset</span>
          <span>Both participants can view and edit these notes live.</span>
        </div>

        <button
          onClick={() => {
            onSave(notes);
            onClose();
          }}
          className="w-full py-3 rounded-xl bg-primary text-on-primary font-label-md text-label-md font-semibold active:scale-[0.98] transition-transform"
        >
          Save & Close
        </button>
      </div>
    </div>
  );
};
