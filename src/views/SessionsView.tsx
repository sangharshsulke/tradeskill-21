import React, { useState } from 'react';
import { SessionItem } from '../types';

interface SessionsViewProps {
  upcomingSessions: SessionItem[];
  pendingRequests: SessionItem[];
  completedSessions: SessionItem[];
  onOpenVideoRoom: (session: SessionItem) => void;
  onOpenPrepNotes: (session: SessionItem) => void;
  onOpenReschedule: (session: SessionItem) => void;
  onOpenProposeSwap: () => void;
  onAcceptPending: (session: SessionItem) => void;
  onDeclinePending: (session: SessionItem) => void;
  onCancelSession: (session: SessionItem) => void;
  onShowToast: (msg: string) => void;
}

export const SessionsView: React.FC<SessionsViewProps> = ({
  upcomingSessions,
  pendingRequests,
  completedSessions,
  onOpenVideoRoom,
  onOpenPrepNotes,
  onOpenReschedule,
  onOpenProposeSwap,
  onAcceptPending,
  onDeclinePending,
  onCancelSession,
  onShowToast,
}) => {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'pending' | 'history'>('upcoming');

  return (
    <div className="flex flex-col w-full px-gutter-mobile space-y-space-md pb-8">
      {/* Top Greeting & Context */}
      <div className="flex items-center justify-between pt-space-xs">
        <div>
          <span className="font-label-sm text-label-sm text-secondary uppercase tracking-wider font-semibold">
            Reciprocal Timebank
          </span>
          <h1 className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface">
            Skill Exchanges
          </h1>
        </div>
        <div className="flex items-center gap-1.5 bg-secondary-container/40 text-on-secondary-container px-3 py-1.5 rounded-full shadow-sm">
          <span className="material-symbols-outlined text-[18px]">timelapse</span>
          <span className="font-label-md text-label-md font-bold">1:1 Balance</span>
        </div>
      </div>

      {/* Segmented Control Tabs */}
      <div className="bg-surface-container p-1 rounded-xl flex items-center justify-between text-center select-none shadow-sm">
        <button
          onClick={() => setActiveTab('upcoming')}
          className={`flex-1 py-2 rounded-lg font-label-md text-label-md transition-all duration-200 cursor-pointer ${
            activeTab === 'upcoming'
              ? 'bg-surface-container-lowest text-primary shadow-sm font-semibold'
              : 'text-on-surface-variant hover:text-on-surface font-medium'
          }`}
        >
          Upcoming ({upcomingSessions.length})
        </button>
        <button
          onClick={() => setActiveTab('pending')}
          className={`flex-1 py-2 rounded-lg font-label-md text-label-md transition-all duration-200 relative cursor-pointer ${
            activeTab === 'pending'
              ? 'bg-surface-container-lowest text-primary shadow-sm font-semibold'
              : 'text-on-surface-variant hover:text-on-surface font-medium'
          }`}
        >
          Pending ({pendingRequests.length})
          {pendingRequests.length > 0 && (
            <span className="inline-block w-2 h-2 rounded-full bg-secondary ml-1 align-middle"></span>
          )}
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`flex-1 py-2 rounded-lg font-label-md text-label-md transition-all duration-200 cursor-pointer ${
            activeTab === 'history'
              ? 'bg-surface-container-lowest text-primary shadow-sm font-semibold'
              : 'text-on-surface-variant hover:text-on-surface font-medium'
          }`}
        >
          Completed
        </button>
      </div>

      {/* UPCOMING TAB CONTENT */}
      {activeTab === 'upcoming' && (
        <div className="flex flex-col space-y-space-md">
          {/* Next Active Session Hero Card (First item or Liam Vance) */}
          {upcomingSessions.length > 0 && (
            <div className="relative overflow-hidden rounded-2xl bg-surface-container-lowest p-space-md shadow-md flex flex-col space-y-space-md border border-outline-variant/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-space-xs">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-secondary"></span>
                  </span>
                  <span className="font-label-sm text-label-sm text-secondary font-bold uppercase tracking-wider">
                    Starts in 38m
                  </span>
                </div>
                <div className="bg-surface-container-high px-2.5 py-1 rounded-full text-on-surface-variant font-label-sm text-label-sm flex items-center gap-1 font-medium">
                  <span className="material-symbols-outlined text-[15px]">videocam</span>
                  <span>Room Ready</span>
                </div>
              </div>

              {/* Counterpart & Topic Profile Header */}
              <div className="flex items-start gap-space-md">
                <div className="relative shrink-0">
                  <img
                    alt={upcomingSessions[0].peerName}
                    src={upcomingSessions[0].peerAvatar}
                    className="w-14 h-14 rounded-2xl object-cover shadow-sm ring-1 ring-primary/20"
                  />
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-primary flex items-center justify-center text-on-primary shadow">
                    <span className="material-symbols-outlined text-[13px]">swap_horiz</span>
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h2 className="font-headline-sm text-headline-sm text-on-surface truncate">
                      {upcomingSessions[0].peerName}
                    </h2>
                    <span className="font-label-sm text-label-sm text-on-surface-variant">
                      {upcomingSessions[0].timeLabel}
                    </span>
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant truncate">
                    {upcomingSessions[0].peerRole}
                  </p>
                  <div className="flex items-center gap-1 text-secondary mt-0.5">
                    <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                      verified
                    </span>
                    <span className="font-label-sm text-label-sm font-semibold">100% Rep Ratio (24 swaps)</span>
                  </div>
                </div>
              </div>

              {/* Skill Barter Bilateral Matrix */}
              <div className="bg-surface-container-low rounded-xl p-space-sm flex flex-col space-y-2">
                <div className="flex items-center justify-between text-body-sm font-body-sm">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className="w-2 h-2 rounded-full bg-primary shrink-0"></span>
                    <span className="text-on-surface font-medium truncate">
                      You teach: <strong>{upcomingSessions[0].youTeach}</strong>
                    </span>
                  </div>
                  <span className="text-on-surface-variant font-label-sm text-label-sm shrink-0">
                    {upcomingSessions[0].teachMins}m
                  </span>
                </div>

                <div className="flex items-center justify-center relative py-0.5">
                  <div className="w-full h-px bg-surface-container-highest"></div>
                  <div className="absolute bg-surface-container-low px-2 flex items-center gap-1 text-secondary">
                    <span className="material-symbols-outlined text-[16px]">sync_alt</span>
                    <span className="font-label-sm text-label-sm font-bold">1:1 Direct Parity</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-body-sm font-body-sm">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className="w-2 h-2 rounded-full bg-secondary shrink-0"></span>
                    <span className="text-on-surface font-medium truncate">
                      {upcomingSessions[0].peerName} teaches: <strong>{upcomingSessions[0].peerTeaches}</strong>
                    </span>
                  </div>
                  <span className="text-on-surface-variant font-label-sm text-label-sm shrink-0">
                    {upcomingSessions[0].peerMins}m
                  </span>
                </div>
              </div>

              {/* Action Area */}
              <div className="flex flex-col gap-2 pt-1">
                <button
                  onClick={() => onOpenVideoRoom(upcomingSessions[0])}
                  className="w-full py-3 px-4 rounded-xl bg-primary text-on-primary font-label-md text-label-md font-semibold flex items-center justify-center gap-2 shadow-md active:scale-[0.98] transition-transform cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[20px]">videocam</span>
                  <span>Join Video Room</span>
                </button>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onOpenPrepNotes(upcomingSessions[0])}
                    className="flex-1 py-2 px-3 rounded-lg bg-surface-container text-on-surface font-label-md text-label-md flex items-center justify-center gap-1 hover:bg-surface-container-high transition-colors cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[17px]">note_alt</span>
                    <span>Prep Notes</span>
                  </button>
                  <button
                    onClick={() => onOpenReschedule(upcomingSessions[0])}
                    className="py-2 px-3 rounded-lg bg-surface-container text-on-surface-variant font-label-md text-label-md flex items-center justify-center gap-1 hover:bg-surface-container-high transition-colors cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[17px]">event_repeat</span>
                    <span>Reschedule</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Quick Schedule Action Banner */}
          <button
            onClick={onOpenProposeSwap}
            className="w-full p-space-md rounded-2xl bg-gradient-to-r from-primary-container to-primary text-on-primary flex items-center justify-between shadow-md active:scale-[0.99] transition-transform cursor-pointer text-left"
          >
            <div className="flex items-center gap-space-sm">
              <div className="w-10 h-10 rounded-xl bg-surface-container-lowest/15 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[24px]">add_circle</span>
              </div>
              <div>
                <h2 className="font-title-md text-title-md text-on-primary">Propose New Swap</h2>
                <p className="font-body-sm text-body-sm text-on-primary-container">Exchange an hour with any mutual connection</p>
              </div>
            </div>
            <span className="material-symbols-outlined text-[22px]">chevron_right</span>
          </button>

          {/* Schedule List by Date Groups */}
          <div className="space-y-space-md pt-1">
            {/* Thursday Oct 24 Group */}
            {upcomingSessions.slice(1, 2).map((session) => (
              <div key={session.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-title-md text-title-md text-on-surface font-bold">
                    {session.dateGroup || 'Upcoming'}
                  </span>
                  <span className="font-label-sm text-label-sm text-on-surface-variant">1 session</span>
                </div>
                <div className="bg-surface-container-lowest rounded-2xl p-space-md shadow-sm space-y-space-sm border border-outline-variant/20">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <img
                        alt={session.peerName}
                        src={session.peerAvatar}
                        className="w-12 h-12 rounded-xl object-cover shadow-xs"
                      />
                      <div>
                        <h2 className="font-title-md text-title-md text-on-surface font-semibold">{session.peerName}</h2>
                        <p className="font-body-sm text-body-sm text-on-surface-variant">{session.timeLabel}</p>
                      </div>
                    </div>
                    <span className="bg-secondary/10 text-secondary px-2.5 py-1 rounded-full font-label-sm text-label-sm font-semibold">
                      Confirmed
                    </span>
                  </div>

                  <div className="bg-surface-container-low rounded-lg p-2.5 text-body-sm font-body-sm flex items-center justify-between">
                    <div className="flex items-center gap-2 truncate">
                      <span className="material-symbols-outlined text-primary text-[18px]">code</span>
                      <span className="truncate">
                        <strong>{session.peerTeaches}</strong> ⇄ <strong>{session.youTeach}</strong>
                      </span>
                    </div>
                    <span className="font-label-sm text-label-sm text-on-surface-variant shrink-0">45m each</span>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-1">
                    <button
                      onClick={() => onOpenPrepNotes(session)}
                      className="px-3 py-1.5 rounded-lg bg-surface-container text-on-surface font-label-sm text-label-sm flex items-center gap-1 hover:bg-surface-container-high transition-colors cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[15px]">sticky_note_2</span> Prep Notes
                    </button>
                    <button
                      onClick={() => onOpenReschedule(session)}
                      className="px-3 py-1.5 rounded-lg bg-surface-container text-on-surface-variant font-label-sm text-label-sm flex items-center gap-1 hover:bg-surface-container-high transition-colors cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[15px]">event_repeat</span> Reschedule
                    </button>
                    <button
                      onClick={() => onCancelSession(session)}
                      title="Cancel session"
                      className="px-2.5 py-1.5 rounded-lg text-error hover:bg-error-container/20 font-label-sm text-label-sm flex items-center cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[16px]">close</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {/* Monday Oct 28 Group */}
            {upcomingSessions.slice(2).map((session) => (
              <div key={session.id} className="space-y-2 pt-2">
                <div className="flex items-center justify-between">
                  <span className="font-title-md text-title-md text-on-surface font-bold">
                    {session.dateGroup || 'Next Week'}
                  </span>
                  <span className="font-label-sm text-label-sm text-on-surface-variant">1 session</span>
                </div>
                <div className="bg-surface-container-lowest rounded-2xl p-space-md shadow-sm space-y-space-sm border border-outline-variant/20">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <img
                        alt={session.peerName}
                        src={session.peerAvatar}
                        className="w-12 h-12 rounded-xl object-cover shadow-xs"
                      />
                      <div>
                        <h2 className="font-title-md text-title-md text-on-surface font-semibold">{session.peerName}</h2>
                        <p className="font-body-sm text-body-sm text-on-surface-variant">{session.timeLabel}</p>
                      </div>
                    </div>
                    <span className="bg-tertiary-fixed text-on-tertiary-fixed font-semibold px-2.5 py-1 rounded-full font-label-sm text-label-sm">
                      Needs Rescheduling
                    </span>
                  </div>

                  <div className="bg-surface-container-low rounded-lg p-2.5 text-body-sm font-body-sm flex items-center justify-between">
                    <div className="flex items-center gap-2 truncate">
                      <span className="material-symbols-outlined text-primary text-[18px]">mic</span>
                      <span className="truncate">
                        <strong>{session.peerTeaches}</strong> ⇄ <strong>{session.youTeach}</strong>
                      </span>
                    </div>
                    <span className="font-label-sm text-label-sm text-on-surface-variant shrink-0">30m each</span>
                  </div>

                  {session.note && (
                    <p className="font-body-sm text-body-sm text-on-surface-variant italic">
                      "{session.note}"
                    </p>
                  )}

                  <div className="flex items-center justify-end gap-2 pt-1">
                    <button
                      onClick={() => onOpenReschedule(session)}
                      className="px-3 py-1.5 rounded-lg bg-primary text-on-primary font-label-sm text-label-sm flex items-center gap-1 font-semibold shadow-xs cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[15px]">schedule</span> Review New Time
                    </button>
                    <button
                      onClick={() => onCancelSession(session)}
                      title="Cancel session"
                      className="px-2.5 py-1.5 rounded-lg text-error hover:bg-error-container/20 font-label-sm text-label-sm flex items-center cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[16px]">close</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* PENDING TAB CONTENT */}
      {activeTab === 'pending' && (
        <div className="flex flex-col space-y-space-md">
          <div className="bg-surface-container-low p-space-md rounded-2xl flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary text-[22px]">inbox</span>
              <span className="font-title-md text-title-md text-on-surface">
                {pendingRequests.length} Requests Awaiting Response
              </span>
            </div>
            <span className="font-label-sm text-label-sm text-on-surface-variant font-medium">Fair trade guarantee</span>
          </div>

          {pendingRequests.length === 0 ? (
            <div className="p-8 rounded-2xl bg-surface-container-lowest text-center text-on-surface-variant">
              No pending requests. Check the Skills or People tab to propose new swaps!
            </div>
          ) : (
            pendingRequests.map((req) => (
              <div
                key={req.id}
                className="bg-surface-container-lowest rounded-2xl p-space-md shadow-sm space-y-space-md border border-outline-variant/20"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      alt={req.peerName}
                      src={req.peerAvatar}
                      className="w-12 h-12 rounded-xl object-cover shadow-xs"
                    />
                    <div>
                      <div className="flex items-center gap-1">
                        <h2 className="font-title-md text-title-md text-on-surface font-semibold">{req.peerName}</h2>
                        <span className="material-symbols-outlined text-secondary text-[16px]">star</span>
                        <span className="font-label-sm text-label-sm text-on-surface-variant">{req.rating || 4.9}</span>
                      </div>
                      <p className="font-body-sm text-body-sm text-on-surface-variant">Requested for: {req.timeLabel}</p>
                    </div>
                  </div>
                  <span className="bg-primary/10 text-primary px-2.5 py-1 rounded-full font-label-sm text-label-sm font-semibold">
                    Incoming
                  </span>
                </div>

                {/* Proposed trade breakdown */}
                <div className="bg-surface-container-low rounded-xl p-space-sm space-y-1.5">
                  <div className="flex justify-between items-center text-body-sm font-body-sm">
                    <span className="text-on-surface-variant">
                      {req.peerName} offers: <strong className="text-on-surface">{req.peerTeaches}</strong>
                    </span>
                    <span className="font-label-sm text-label-sm font-semibold text-secondary">{req.peerMins} min</span>
                  </div>
                  <div className="h-px bg-surface-container-high w-full"></div>
                  <div className="flex justify-between items-center text-body-sm font-body-sm">
                    <span className="text-on-surface-variant">
                      {req.peerName} wants: <strong className="text-on-surface">{req.youTeach}</strong>
                    </span>
                    <span className="font-label-sm text-label-sm font-semibold text-primary">{req.teachMins} min</span>
                  </div>
                </div>

                {req.note && (
                  <p className="font-body-sm text-body-sm text-on-surface-variant bg-surface-container-high/40 p-2.5 rounded-lg italic">
                    {req.note}
                  </p>
                )}

                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => onAcceptPending(req)}
                    className="col-span-1 py-2 rounded-xl bg-secondary text-on-secondary font-label-md text-label-md font-semibold flex items-center justify-center gap-1 shadow-sm active:scale-95 transition-transform cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[17px]">check</span> Accept
                  </button>
                  <button
                    onClick={() => onOpenReschedule(req)}
                    className="col-span-1 py-2 rounded-xl bg-surface-container text-on-surface font-label-md text-label-md font-medium flex items-center justify-center gap-1 active:scale-95 transition-transform text-center cursor-pointer hover:bg-surface-container-high"
                  >
                    <span className="material-symbols-outlined text-[17px]">edit_calendar</span> Alternate
                  </button>
                  <button
                    onClick={() => onDeclinePending(req)}
                    className="col-span-1 py-2 rounded-xl bg-surface-container text-error hover:bg-error-container/30 font-label-md text-label-md font-medium flex items-center justify-center gap-1 active:scale-95 transition-transform cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[17px]">close</span> Decline
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* COMPLETED TAB CONTENT */}
      {activeTab === 'history' && (
        <div className="flex flex-col space-y-space-md">
          <div className="flex items-center justify-between">
            <span className="font-headline-sm text-headline-sm text-on-surface">Past Exchanges</span>
            <span className="font-label-md text-label-md text-secondary font-semibold">18 Hours Swapped</span>
          </div>

          {completedSessions.map((hist) => (
            <div
              key={hist.id}
              className="bg-surface-container-lowest rounded-2xl p-space-md shadow-sm space-y-space-sm border border-outline-variant/20"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    alt={hist.peerName}
                    src={hist.peerAvatar}
                    className="w-11 h-11 rounded-xl object-cover shadow-xs"
                  />
                  <div>
                    <h2 className="font-title-md text-title-md text-on-surface font-semibold">{hist.peerName}</h2>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">{hist.timeLabel}</p>
                  </div>
                </div>
                <div className="flex items-center text-amber-500">
                  <span className="material-symbols-outlined text-[18px]">star</span>
                  <span className="font-label-sm text-label-sm text-on-surface font-bold ml-1">5.0</span>
                </div>
              </div>

              <div className="bg-surface-container-low rounded-lg p-2 text-body-sm font-body-sm flex justify-between items-center">
                <span>
                  Gave: <strong>{hist.youTeach}</strong> ({hist.teachMins}m)
                </span>
                <span className="material-symbols-outlined text-secondary text-[16px]">sync_alt</span>
                <span>
                  Received: <strong>{hist.peerTeaches}</strong> ({hist.peerMins}m)
                </span>
              </div>

              <div className="flex justify-between items-center pt-1">
                <span className="font-label-sm text-label-sm text-secondary flex items-center gap-1 font-medium">
                  <span className="material-symbols-outlined text-[14px]">verified</span> Mutual feedback logged
                </span>
                <button
                  onClick={() => onShowToast(`Displaying recap with ${hist.peerName}: 1:1 escrow settled.`)}
                  className="font-label-md text-label-md text-primary font-semibold hover:underline cursor-pointer"
                >
                  View Recap
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
