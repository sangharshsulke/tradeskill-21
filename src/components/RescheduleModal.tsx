import React, { useState } from 'react';

interface RescheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmReschedule: (slot: string, note: string) => void;
  peerName?: string;
}

export const RescheduleModal: React.FC<RescheduleModalProps> = ({
  isOpen,
  onClose,
  onConfirmReschedule,
  peerName = 'your partner',
}) => {
  const [selectedSlot, setSelectedSlot] = useState('Fri, Oct 25 14:00');
  const [note, setNote] = useState('Does Friday 14:00 GMT work better for you?');

  if (!isOpen) return null;

  const slots = [
    { id: 'Fri, Oct 25 14:00', date: 'Fri, Oct 25', time: '14:00' },
    { id: 'Mon, Oct 28 11:30', date: 'Mon, Oct 28', time: '11:30' },
    { id: 'Tue, Oct 29 18:00', date: 'Tue, Oct 29', time: '18:00' },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-inverse-surface/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0" onClick={onClose} />
      <div className="relative bg-surface-container-lowest w-full max-w-md rounded-t-3xl sm:rounded-2xl p-space-lg space-y-space-md shadow-2xl z-10 animate-in slide-in-from-bottom duration-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[24px]">edit_calendar</span>
            <h2 className="font-headline-sm text-headline-sm text-on-surface">Propose Time Slot</h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:text-on-surface"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        <p className="font-body-sm text-body-sm text-on-surface-variant">
          Select an alternative slot for {peerName}. Both timebank commitments will update once accepted.
        </p>

        <div className="space-y-2">
          <label className="font-label-md text-label-md text-on-surface font-semibold block">
            Select Date & Time
          </label>
          <div className="grid grid-cols-3 gap-2 text-center">
            {slots.map((slot) => {
              const isSelected = selectedSlot === slot.id;
              return (
                <button
                  key={slot.id}
                  type="button"
                  onClick={() => setSelectedSlot(slot.id)}
                  className={`p-2.5 rounded-xl transition-all ${
                    isSelected
                      ? 'bg-primary-container text-on-primary font-bold shadow-sm'
                      : 'bg-surface-container text-on-surface hover:bg-surface-container-high'
                  }`}
                >
                  <span className="text-xs block font-bold">{slot.date}</span>
                  <span className={`text-xs ${isSelected ? 'text-on-primary-container' : 'text-on-surface-variant'}`}>
                    {slot.time}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="font-label-md text-label-md text-on-surface font-semibold block">
            Quick Note
          </label>
          <input
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="w-full bg-surface-container-low rounded-xl px-3 py-2.5 text-body-md font-body-md text-on-surface focus:outline-none border border-transparent focus:border-primary/30"
          />
        </div>

        <button
          onClick={() => {
            onConfirmReschedule(selectedSlot, note);
            onClose();
          }}
          className="w-full py-3 rounded-xl bg-primary text-on-primary font-label-md text-label-md font-semibold active:scale-[0.98] transition-transform shadow-md"
        >
          Send Reschedule Proposal
        </button>
      </div>
    </div>
  );
};
