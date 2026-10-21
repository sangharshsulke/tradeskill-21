import React from 'react';
import { PeerProfile } from '../types';

interface ProfileModalProps {
  profile: PeerProfile | null;
  isOpen: boolean;
  onClose: () => void;
  onRequestTrade: (profile: PeerProfile) => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  profile,
  isOpen,
  onClose,
  onRequestTrade,
}) => {
  if (!isOpen || !profile) return null;

  return (
    <div className="fixed inset-0 z-50 bg-inverse-surface/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
      {/* Backdrop */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Modal Surface */}
      <div className="relative bg-surface-container-lowest w-full max-w-lg rounded-t-2xl sm:rounded-2xl max-h-[85vh] overflow-y-auto no-scrollbar shadow-2xl flex flex-col p-5 space-y-4 z-10 animate-in slide-in-from-bottom duration-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-1">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-secondary"></span>
            <span className="font-label-md text-label-md text-secondary font-semibold uppercase tracking-wider">
              Verified Knowledge Partner
            </span>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:text-on-surface active:scale-90"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Modal User Identity Header */}
        <div className="flex items-start gap-4">
          <img
            alt={profile.name}
            className="w-16 h-16 rounded-full object-cover shadow-sm ring-2 ring-primary/20 shrink-0"
            src={profile.avatarUrl}
          />
          <div className="flex flex-col flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold truncate">
                {profile.name}
              </h3>
              <span className="flex items-center gap-1 font-label-md text-label-md font-semibold text-on-surface bg-surface-container px-2 py-0.5 rounded shrink-0">
                <span className="material-symbols-outlined text-tertiary-fixed-dim text-[16px]">star</span>
                {profile.rating}
              </span>
            </div>
            <p className="font-body-md text-body-md text-on-surface-variant truncate">
              {profile.role} {profile.company ? `@ ${profile.company}` : ''}
            </p>
            <p className="font-label-sm text-label-sm text-on-surface-variant/80 mt-0.5 truncate">
              {profile.location} • {profile.swapsCount} Swaps Completed • 100% Reliability
            </p>
          </div>
        </div>

        {/* Bilateral Skill Tags */}
        <div className="bg-surface-container-low rounded-xl p-3 flex flex-col space-y-2">
          <div className="flex items-center gap-2">
            <span className="w-16 shrink-0 font-label-sm text-label-sm text-secondary font-semibold flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-secondary"></span>
              Offers:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {profile.offers.map((s, idx) => (
                <span key={idx} className="bg-surface-container-lowest text-on-surface font-label-sm text-label-sm px-2 py-1 rounded shadow-xs">
                  {s}
                </span>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-16 shrink-0 font-label-sm text-label-sm text-primary font-semibold flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-primary"></span>
              Wants:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {profile.wants.map((s, idx) => (
                <span key={idx} className="bg-primary-fixed text-on-primary-fixed-variant font-label-sm text-label-sm px-2 py-1 rounded shadow-xs">
                  {s}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Bio & Philosophy */}
        <div className="space-y-1.5 bg-surface-container-low p-3.5 rounded-xl">
          <h5 className="font-label-md text-label-md text-primary font-semibold flex items-center gap-1">
            <span className="material-symbols-outlined text-[16px]">psychology</span>
            Teaching & Learning Philosophy
          </h5>
          <p className="font-body-md text-body-md text-on-surface leading-relaxed">
            {profile.bio}
          </p>
        </div>

        {/* Credentials & Proof of Work */}
        <div className="flex flex-col space-y-2">
          <span className="font-label-md text-label-md text-on-surface font-semibold">
            Verified Credentials & Proof of Work
          </span>
          <div className="flex items-center gap-2">
            <div className="flex-1 bg-surface-container p-2.5 rounded-lg flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[20px]">verified</span>
              <div className="flex flex-col">
                <span className="font-label-md text-label-md text-on-surface font-medium">
                  {profile.verifiedCredential.title}
                </span>
                <span className="font-label-sm text-label-sm text-on-surface-variant">
                  Issued by {profile.verifiedCredential.issuer}
                </span>
              </div>
            </div>
            <button
              onClick={() => alert(`Viewing verified credentials for ${profile.name}`)}
              className="px-3 py-2.5 bg-surface-container text-on-surface rounded-lg flex items-center gap-1 font-label-md text-label-md hover:bg-surface-container-high transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">link</span>
              <span>Case Studies</span>
            </button>
          </div>
        </div>

        {/* Recent Barter Reviews */}
        <div className="space-y-2">
          <span className="font-label-md text-label-md text-on-surface font-semibold">
            Recent Trade Testimonials
          </span>
          <div className="bg-surface-container-low p-3 rounded-lg flex flex-col space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-label-sm text-label-sm font-semibold text-on-surface">
                {profile.testimonial.peerName}
              </span>
              <span className="font-label-sm text-label-sm text-secondary font-medium">
                {profile.testimonial.tradedFor}
              </span>
            </div>
            <p className="font-body-sm text-body-sm text-on-surface-variant italic">
              {profile.testimonial.quote}
            </p>
          </div>
        </div>

        {/* Modal Bottom Fixed Action */}
        <div className="pt-2 flex items-center gap-3">
          <button
            onClick={onClose}
            className="w-1/3 h-12 rounded-xl bg-surface-container text-on-surface font-label-md text-label-md hover:bg-surface-container-high active:scale-95 transition-all"
          >
            Back
          </button>
          <button
            onClick={() => {
              onRequestTrade(profile);
              onClose();
            }}
            className="w-2/3 h-12 rounded-xl bg-primary text-on-primary font-label-md text-label-md font-semibold flex items-center justify-center gap-2 shadow-md hover:bg-primary-container active:scale-95 transition-all"
          >
            <span className="material-symbols-outlined text-[20px]">swap_horizontal_circle</span>
            <span>Propose 1-Hour Swap</span>
          </button>
        </div>
      </div>
    </div>
  );
};
