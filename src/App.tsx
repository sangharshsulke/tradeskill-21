import React, { useState, useEffect } from 'react';
import { ScreenType, SkillListing, PeerProfile, SessionItem, ExchangeInquiry, UserSkillItem } from './types';
import {
  initialSkillListings,
  mockPeerProfiles,
  initialSessions,
  initialPendingRequests,
  initialCompletedSessions,
  initialInquiries,
  initialUserPortfolio,
} from './data/mockData';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { Toast } from './components/Toast';
import { CurriculumDrawer } from './components/CurriculumDrawer';
import { QuickListSkillModal } from './components/QuickListSkillModal';
import { ProfileModal } from './components/ProfileModal';
import { VideoRoomModal } from './components/VideoRoomModal';
import { PrepNotesModal } from './components/PrepNotesModal';
import { RescheduleModal } from './components/RescheduleModal';
import { ProposeSwapModal } from './components/ProposeSwapModal';
import { NotificationsModal } from './components/NotificationsModal';
import { LiveChatDrawer } from './components/LiveChatDrawer';

import { HomeView } from './views/HomeView';
import { SkillsView } from './views/SkillsView';
import { PeopleView } from './views/PeopleView';
import { SessionsView } from './views/SessionsView';
import { DashboardView } from './views/DashboardView';
import { AboutView } from './views/AboutView';
import { ContactView } from './views/ContactView';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('home');
  const [skills, setSkills] = useState<SkillListing[]>(initialSkillListings);
  const [profiles] = useState<PeerProfile[]>(mockPeerProfiles);
  const [userSkills, setUserSkills] = useState<UserSkillItem[]>(initialUserPortfolio);
  const [inquiries, setInquiries] = useState<ExchangeInquiry[]>(initialInquiries);
  const [upcomingSessions, setUpcomingSessions] = useState<SessionItem[]>(initialSessions);
  const [pendingRequests, setPendingRequests] = useState<SessionItem[]>(initialPendingRequests);
  const [completedSessions, setCompletedSessions] = useState<SessionItem[]>(initialCompletedSessions);

  // Modals & Drawers state
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<'success' | 'info' | 'error'>('success');
  const [curriculumSkill, setCurriculumSkill] = useState<SkillListing | null>(null);
  const [quickListOpen, setQuickListOpen] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState<PeerProfile | null>(null);
  const [activeVideoSession, setActiveVideoSession] = useState<SessionItem | null>(null);
  const [prepNotesSession, setPrepNotesSession] = useState<SessionItem | null>(null);
  const [rescheduleSession, setRescheduleSession] = useState<SessionItem | null>(null);
  const [proposeSwapOpen, setProposeSwapOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [liveChatOpen, setLiveChatOpen] = useState(false);
  const [quickMatchOpen, setQuickMatchOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState<UserSkillItem | null>(null);

  // Smooth scroll to top on screen switch
  const navigateTo = (screen: ScreenType) => {
    setCurrentScreen(screen);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const showToast = (msg: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToastMessage(msg);
    setToastType(type);
  };

  // Trade request triggers
  const handleRequestTrade = (item: { authorName?: string; name?: string; teaches?: string; wants?: string | string[] }) => {
    const peerName = item.authorName || item.name || 'mentor';
    showToast(`Trade proposal sent to ${peerName}! Direct 1:1 slot held in reciprocal escrow.`);
  };

  // Add listing
  const handleAddNewSkill = (newListing: SkillListing) => {
    setSkills((prev) => [newListing, ...prev]);
    showToast(`"${newListing.teaches}" listing published to marketplace!`);
  };

  // Inquiries triage
  const handleAcceptInquiry = (inq: ExchangeInquiry) => {
    setInquiries((prev) =>
      prev.map((item) => (item.id === inq.id ? { ...item, status: 'accepted' as const } : item))
    );
    // Add to upcoming sessions
    const newSession: SessionItem = {
      id: `session-${Date.now()}`,
      peerName: inq.peerName,
      peerRole: inq.peerRole,
      peerAvatar: inq.peerAvatar,
      verified: true,
      timeLabel: 'Next Week • Proposed Slot',
      status: 'confirmed',
      youTeach: inq.wants,
      peerTeaches: inq.offers,
      teachMins: 45,
      peerMins: 45,
    };
    setUpcomingSessions((prev) => [newSession, ...prev]);
    showToast(`Exchange agreed with ${inq.peerName}! Scheduled into Upcoming Sessions.`);
  };

  const handleDeclineInquiry = (inq: ExchangeInquiry) => {
    setInquiries((prev) =>
      prev.map((item) => (item.id === inq.id ? { ...item, status: 'declined' as const } : item))
    );
    showToast(`Declined exchange inquiry from ${inq.peerName}.`);
  };

  // Pending session requests
  const handleAcceptPending = (session: SessionItem) => {
    setPendingRequests((prev) => prev.filter((p) => p.id !== session.id));
    setUpcomingSessions((prev) => [{ ...session, status: 'confirmed' }, ...prev]);
    showToast(`Accepted swap with ${session.peerName}! Added to your Upcoming calendar.`);
  };

  const handleDeclinePending = (session: SessionItem) => {
    setPendingRequests((prev) => prev.filter((p) => p.id !== session.id));
    showToast(`Declined proposal from ${session.peerName}.`);
  };

  const handleCancelSession = (session: SessionItem) => {
    if (confirm(`Cancel your exchange session with ${session.peerName}? Both peer timebanks will be updated.`)) {
      setUpcomingSessions((prev) => prev.filter((s) => s.id !== session.id));
      showToast(`Session with ${session.peerName} cancelled.`);
    }
  };

  // Portfolio actions
  const handleTogglePauseSkill = (id: string) => {
    setUserSkills((prev) =>
      prev.map((s) => {
        if (s.id === id) {
          const newStatus = s.status === 'active' ? 'paused' : 'active';
          showToast(newStatus === 'active' ? `Activated "${s.title}"!` : `Paused "${s.title}" from search.`);
          return { ...s, status: newStatus };
        }
        return s;
      })
    );
  };

  const handleDeleteSkill = (id: string) => {
    const item = userSkills.find((s) => s.id === id);
    setUserSkills((prev) => prev.filter((s) => s.id !== id));
    showToast(`Removed "${item?.title || 'skill'}" from your portfolio.`);
  };

  const handleEditSkill = (skill: UserSkillItem) => {
    setEditingSkill(skill);
    showToast(`Editing "${skill.title}"`);
  };

  // Complete Video Room session
  const handleCompleteSession = () => {
    if (!activeVideoSession) return;
    const completed: SessionItem = {
      ...activeVideoSession,
      status: 'completed',
      timeLabel: 'Completed Today • 90m swap',
      completedDate: 'Today',
      rating: 5.0,
    };
    setUpcomingSessions((prev) => prev.filter((s) => s.id !== activeVideoSession.id));
    setCompletedSessions((prev) => [completed, ...prev]);
    showToast(`Exchange completed with ${activeVideoSession.peerName}! +1 Reciprocal Credit banked.`);
  };

  const unreadCount = inquiries.filter((i) => i.status === 'pending').length;

  return (
    <div className="bg-surface text-on-surface font-body-md text-body-md min-h-screen flex flex-col antialiased">
      {/* Header */}
      <Header
        currentScreen={currentScreen}
        onNavigate={navigateTo}
        onOpenSearch={() => {
          if (currentScreen !== 'skills') {
            navigateTo('skills');
          }
        }}
        onOpenNotifications={() => setNotificationsOpen(true)}
        unreadCount={unreadCount}
      />

      {/* Main Body with Centered Max-Width */}
      <main className="flex-1 flex flex-col relative w-full pt-16 pb-24 bg-surface min-h-screen">
        <div className="max-w-2xl mx-auto w-full">
          {currentScreen === 'home' && (
            <HomeView
              onNavigate={navigateTo}
              onOpenQuickList={() => setQuickListOpen(true)}
              onOpenQuickMatch={() => setQuickMatchOpen(true)}
              onRequestTrade={handleRequestTrade}
            />
          )}

          {currentScreen === 'skills' && (
            <SkillsView
              skills={skills}
              onOpenQuickList={() => setQuickListOpen(true)}
              onOpenCurriculum={(skill) => setCurriculumSkill(skill)}
              onRequestTrade={handleRequestTrade}
            />
          )}

          {currentScreen === 'people' && (
            <PeopleView
              profiles={profiles}
              onOpenProfile={(p) => setSelectedProfile(p)}
              onRequestTrade={handleRequestTrade}
            />
          )}

          {currentScreen === 'sessions' && (
            <SessionsView
              upcomingSessions={upcomingSessions}
              pendingRequests={pendingRequests}
              completedSessions={completedSessions}
              onOpenVideoRoom={(s) => setActiveVideoSession(s)}
              onOpenPrepNotes={(s) => setPrepNotesSession(s)}
              onOpenReschedule={(s) => setRescheduleSession(s)}
              onOpenProposeSwap={() => setProposeSwapOpen(true)}
              onAcceptPending={handleAcceptPending}
              onDeclinePending={handleDeclinePending}
              onCancelSession={handleCancelSession}
              onShowToast={showToast}
            />
          )}

          {currentScreen === 'dashboard' && (
            <DashboardView
              inquiries={inquiries}
              onAcceptInquiry={handleAcceptInquiry}
              onDeclineInquiry={handleDeclineInquiry}
              userSkills={userSkills}
              onAddUserSkill={(s) => setUserSkills((prev) => [s, ...prev])}
              onTogglePauseSkill={handleTogglePauseSkill}
              onDeleteSkill={handleDeleteSkill}
              onEditSkill={handleEditSkill}
              onShowToast={showToast}
            />
          )}

          {currentScreen === 'about' && (
            <AboutView
              onNavigate={navigateTo}
              onOpenQuickList={() => setQuickListOpen(true)}
              onShowToast={showToast}
            />
          )}

          {currentScreen === 'contact' && (
            <ContactView
              onNavigate={navigateTo}
              onOpenLiveChat={() => setLiveChatOpen(true)}
              onShowToast={showToast}
            />
          )}
        </div>
      </main>

      {/* Bottom Nav Bar */}
      <BottomNav
        currentScreen={currentScreen}
        onNavigate={navigateTo}
        pendingCount={pendingRequests.length}
      />

      {/* Curriculum Deep Dive Drawer */}
      <CurriculumDrawer
        isOpen={!!curriculumSkill}
        skill={curriculumSkill}
        onClose={() => setCurriculumSkill(null)}
        onRequestTrade={(skill) => {
          handleRequestTrade(skill);
          showToast(`Trade requested with ${skill.authorName}! Direct 1:1 slot held.`);
        }}
      />

      {/* Quick Add Skill Modal Sheet */}
      <QuickListSkillModal
        isOpen={quickListOpen}
        onClose={() => setQuickListOpen(false)}
        onAddSkill={handleAddNewSkill}
      />

      {/* Profile Detail Modal */}
      <ProfileModal
        isOpen={!!selectedProfile}
        profile={selectedProfile}
        onClose={() => setSelectedProfile(null)}
        onRequestTrade={(p) => {
          handleRequestTrade(p);
          setSelectedProfile(null);
        }}
      />

      {/* Video Room Modal */}
      {activeVideoSession && (
        <VideoRoomModal
          isOpen={!!activeVideoSession}
          onClose={() => setActiveVideoSession(null)}
          peerName={activeVideoSession.peerName}
          youTeach={activeVideoSession.youTeach}
          peerTeaches={activeVideoSession.peerTeaches}
          onCompleteSession={handleCompleteSession}
        />
      )}

      {/* Prep Notes Modal */}
      {prepNotesSession && (
        <PrepNotesModal
          isOpen={!!prepNotesSession}
          onClose={() => setPrepNotesSession(null)}
          initialNotes={prepNotesSession.note}
          onSave={(updatedNotes) => {
            setUpcomingSessions((prev) =>
              prev.map((s) => (s.id === prepNotesSession.id ? { ...s, note: updatedNotes } : s))
            );
            showToast('Prep notes synchronized!');
          }}
        />
      )}

      {/* Reschedule Modal */}
      {rescheduleSession && (
        <RescheduleModal
          isOpen={!!rescheduleSession}
          onClose={() => setRescheduleSession(null)}
          peerName={rescheduleSession.peerName}
          onConfirmReschedule={(slot, note) => {
            setUpcomingSessions((prev) =>
              prev.map((s) =>
                s.id === rescheduleSession.id
                  ? { ...s, timeLabel: slot, note, status: 'confirmed' }
                  : s
              )
            );
            showToast(`Reschedule proposal dispatched to ${rescheduleSession.peerName}!`);
          }}
        />
      )}

      {/* Propose Swap Modal */}
      <ProposeSwapModal
        isOpen={proposeSwapOpen}
        onClose={() => setProposeSwapOpen(false)}
        onPropose={(details) => {
          const newSession: SessionItem = {
            id: `session-${Date.now()}`,
            peerName: details.peer.split(' (')[0],
            peerRole: 'Mutual Trade Partner',
            peerAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBiC7FCA0Bj4QwGnU9OD1KdSSMqS3t2_UtTbnDR_buOnQtp4OwT7U7DJar0T_6T70HLeglDGr2m_saQyTgc_naw7vUhdWnKyMCCubBEzTWOzHigYisXtaTdjdCPOn9MsJ5T75vdWrmUqIzZ9Vv4NKslnHm1FuKgJRSj6AgyU9c2rvqjh4WjyJrsuVHQmZgy31ZrpObvdbBQcGSoYihTYxp7Xg9kNHuutucqv_xExT5-SS8Ou0tyCU0',
            verified: true,
            timeLabel: 'Pending Confirmation • 90m',
            status: 'confirmed',
            youTeach: details.youTeach,
            peerTeaches: details.peerTeaches,
            teachMins: 45,
            peerMins: 45,
          };
          setUpcomingSessions((prev) => [newSession, ...prev]);
          showToast(`Exchange proposed with ${details.peer.split(' (')[0]}!`);
        }}
      />

      {/* Notifications Modal */}
      <NotificationsModal
        isOpen={notificationsOpen}
        onClose={() => setNotificationsOpen(false)}
        inquiries={inquiries}
        onAcceptInquiry={(inq) => {
          handleAcceptInquiry(inq);
          setNotificationsOpen(false);
        }}
        onDeclineInquiry={(inq) => {
          handleDeclineInquiry(inq);
        }}
      />

      {/* Live Chat Support Drawer */}
      <LiveChatDrawer
        isOpen={liveChatOpen}
        onClose={() => setLiveChatOpen(false)}
      />

      {/* Quick Match Modal (Triggered from Hero) */}
      {quickMatchOpen && (
        <div className="fixed inset-0 z-50 bg-inverse-surface/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="absolute inset-0" onClick={() => setQuickMatchOpen(false)} />
          <div className="relative bg-surface-container-lowest w-full max-w-md rounded-2xl p-5 shadow-2xl z-10 space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-2 border-b border-outline-variant/30">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[22px]">auto_awesome</span>
                <h3 className="font-headline-sm text-headline-sm text-on-surface">Algorithmic Skill Match</h3>
              </div>
              <button
                onClick={() => setQuickMatchOpen(false)}
                className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:text-on-surface"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>
            <p className="text-sm text-on-surface-variant leading-relaxed">
              Based on your offered skill in <strong className="text-on-surface">React Architecture & UI Prototyping</strong>, our barter engine identified 3 reciprocal candidates who want to exchange Italian, German, or Data Analytics!
            </p>
            <div className="space-y-2">
              <div
                onClick={() => {
                  setQuickMatchOpen(false);
                  navigateTo('people');
                }}
                className="p-3 rounded-xl bg-surface-container-low hover:bg-surface-container flex items-center justify-between cursor-pointer transition-colors"
              >
                <div>
                  <span className="font-title-md text-sm font-bold text-on-surface block">Elena Vance (Figma Tokens)</span>
                  <span className="text-xs text-secondary font-medium">98% Reciprocal Affinity</span>
                </div>
                <span className="material-symbols-outlined text-primary text-[18px]">arrow_forward</span>
              </div>
              <div
                onClick={() => {
                  setQuickMatchOpen(false);
                  navigateTo('skills');
                }}
                className="p-3 rounded-xl bg-surface-container-low hover:bg-surface-container flex items-center justify-between cursor-pointer transition-colors"
              >
                <div>
                  <span className="font-title-md text-sm font-bold text-on-surface block">Kenji Takahashi (Design Systems)</span>
                  <span className="text-xs text-secondary font-medium">95% Reciprocal Affinity</span>
                </div>
                <span className="material-symbols-outlined text-primary text-[18px]">arrow_forward</span>
              </div>
            </div>
            <button
              onClick={() => {
                setQuickMatchOpen(false);
                navigateTo('people');
              }}
              className="w-full py-3 rounded-xl bg-primary text-on-primary font-label-md text-label-md font-semibold cursor-pointer shadow-sm active:scale-95 transition-transform"
            >
              Explore All Recommended Matches
            </button>
          </div>
        </div>
      )}

      {/* Edit Skill Portfolio Modal */}
      {editingSkill && (
        <div className="fixed inset-0 z-50 bg-inverse-surface/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="absolute inset-0" onClick={() => setEditingSkill(null)} />
          <div className="relative bg-surface-container-lowest w-full max-w-md rounded-2xl p-5 shadow-2xl z-10 space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-2 border-b border-outline-variant/30">
              <h3 className="font-headline-sm text-headline-sm text-on-surface">Edit Skill Terms</h3>
              <button
                onClick={() => setEditingSkill(null)}
                className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:text-on-surface"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-on-surface block mb-1">Title</label>
                <input
                  type="text"
                  value={editingSkill.title}
                  onChange={(e) => setEditingSkill({ ...editingSkill, title: e.target.value })}
                  className="w-full bg-surface-container-low rounded-xl px-3 py-2 text-sm text-on-surface focus:outline-none"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-on-surface block mb-1">Description</label>
                <textarea
                  value={editingSkill.description}
                  onChange={(e) => setEditingSkill({ ...editingSkill, description: e.target.value })}
                  rows={3}
                  className="w-full bg-surface-container-low rounded-xl px-3 py-2 text-sm text-on-surface focus:outline-none resize-none"
                />
              </div>
            </div>
            <button
              onClick={() => {
                setUserSkills((prev) =>
                  prev.map((s) => (s.id === editingSkill.id ? editingSkill : s))
                );
                setEditingSkill(null);
                showToast(`Saved updates to "${editingSkill.title}"`);
              }}
              className="w-full py-2.5 rounded-xl bg-primary text-on-primary font-label-md text-label-md font-semibold cursor-pointer shadow-sm"
            >
              Save Changes
            </button>
          </div>
        </div>
      )}

      {/* Global Toast Notification */}
      <Toast
        message={toastMessage}
        type={toastType}
        onClose={() => setToastMessage(null)}
      />
    </div>
  );
}
