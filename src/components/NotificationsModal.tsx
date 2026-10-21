import React from 'react';
import { ExchangeInquiry } from '../types';

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  inquiries: ExchangeInquiry[];
  onAcceptInquiry: (inquiry: ExchangeInquiry) => void;
  onDeclineInquiry: (inquiry: ExchangeInquiry) => void;
}

export const NotificationsModal: React.FC<NotificationsModalProps> = ({
  isOpen,
  onClose,
  inquiries,
  onAcceptInquiry,
  onDeclineInquiry,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-inverse-surface/60 backdrop-blur-sm flex items-start sm:items-center justify-center p-4 pt-16">
      <div className="absolute inset-0" onClick={onClose} />
      <div className="relative bg-surface-container-lowest w-full max-w-md rounded-2xl p-5 shadow-2xl z-10 space-y-4 animate-in fade-in duration-200">
        <div className="flex items-center justify-between pb-2 border-b border-outline-variant/30">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[22px]">notifications</span>
            <h3 className="font-headline-sm text-headline-sm text-on-surface">Notifications</h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:text-on-surface"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Incoming Exchange Proposals */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-label-md text-label-md text-on-surface font-semibold">
              Incoming Proposals ({inquiries.filter((i) => i.status === 'pending').length})
            </span>
            <span className="font-label-sm text-label-sm text-secondary font-semibold">Live Timebank</span>
          </div>

          {inquiries.filter((i) => i.status === 'pending').length === 0 ? (
            <div className="p-4 rounded-xl bg-surface-container text-center text-on-surface-variant text-sm">
              All caught up! No pending barter proposals.
            </div>
          ) : (
            inquiries
              .filter((i) => i.status === 'pending')
              .map((inq) => (
                <div key={inq.id} className="p-3 rounded-xl bg-surface-container-low space-y-2">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={inq.peerAvatar}
                      alt={inq.peerName}
                      className="w-9 h-9 rounded-full object-cover shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-title-md text-sm font-bold text-on-surface truncate">
                          {inq.peerName}
                        </span>
                        <span className="text-[11px] bg-secondary-container/50 text-on-secondary-container font-semibold px-2 py-0.5 rounded-full">
                          {inq.ratioType}
                        </span>
                      </div>
                      <p className="text-xs text-on-surface-variant truncate">{inq.peerRole}</p>
                    </div>
                  </div>

                  <p className="text-xs text-on-surface-variant italic bg-surface-container-lowest p-2 rounded-lg">
                    {inq.note}
                  </p>

                  <div className="flex items-center gap-2 pt-1">
                    <button
                      onClick={() => onAcceptInquiry(inq)}
                      className="flex-1 py-1.5 rounded-lg bg-primary text-on-primary text-xs font-semibold flex items-center justify-center gap-1 active:scale-95 transition-transform"
                    >
                      <span className="material-symbols-outlined text-[15px]">handshake</span>
                      Accept
                    </button>
                    <button
                      onClick={() => onDeclineInquiry(inq)}
                      className="px-3 py-1.5 rounded-lg bg-surface-container text-on-surface-variant text-xs hover:bg-surface-container-high active:scale-95"
                    >
                      Decline
                    </button>
                  </div>
                </div>
              ))
          )}
        </div>

        {/* System announcement */}
        <div className="p-3 rounded-xl bg-secondary-container/20 border border-secondary-container flex items-start gap-2.5">
          <span className="material-symbols-outlined text-secondary text-[20px] shrink-0 mt-0.5">verified_user</span>
          <div className="text-xs text-on-surface">
            <span className="font-semibold block">Timebank Parity Verified</span>
            <span>Your 1:1 balance is active across 45,000+ member network nodes worldwide.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
