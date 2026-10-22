import React, { useState, useEffect, useCallback } from 'react';
import {
  ScreenType,
  SkillListing,
  PeerProfile,
  SessionItem,
  ExchangeInquiry,
  UserSkillItem,
  CurrentUser,
  DashboardStats,
  ReviewItem,
} from './types';
import { api, auth, ApiError } from './lib/api';
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
import { AuthModal } from './components/AuthModal';
import { RateSessionModal } from './components/RateSessionModal';

import { HomeView } from './views/HomeView';
import { SkillsView } from './views/SkillsView';
import { PeopleView } from './views/PeopleView';
import { SessionsView } from './views/SessionsView';
import { DashboardView } from './views/DashboardView';
import { AboutView } from './views/AboutView';
import { ContactView } from './views/ContactView';

// Pages that need a logged-in user (see project spec: "After Login Pages")
const PROTECTED: ScreenType[] = ['skills', 'people', 'sessions', 'dashboard'];

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('home');
  const [me, setMe] = useState<CurrentUser | null>(null);
  const [authOpen, setAuthOpen] = useState(false);
  const [pendingScreen, setPendingScreen] = useState<ScreenType | null>(null);
  const [loading, setLoading] = useState(false);

  // Data from MySQL (via the API)
  const [skills, setSkills] = useState<SkillListing[]>([]);
  const [profiles, setProfiles] = useState<PeerProfile[]>([]);
  const [userSkills, setUserSkills] = useState<UserSkillItem[]>([]);
  const [inquiries, setInquiries] = useState<ExchangeInquiry[]>([]);
  const [upcomingSessions, setUpcomingSessions] = useState<SessionItem[]>([]);
  const [pendingRequests, setPendingRequests] = useState<SessionItem[]>([]);
  const [completedSessions, setCompletedSessions] = useState<SessionItem[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [reviews, setReviews] = useState<ReviewItem[]>([]);

  // Modals & Drawers state
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<'success' | 'info' | 'error'>('success');
  const [curriculumSkill, setCurriculumSkill] = useState<SkillListing | null>(null);
  const [quickListOpen, setQuickListOpen] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState<PeerProfile | null>(null);
  const [activeVideoSession, setActiveVideoSession] = useState<SessionItem | null>(null);
  const [prepNotesSession, setPrepNotesSession] = useState<SessionItem | null>(null);
  const [rescheduleSession, setRescheduleSession] = useState<SessionItem | null>(null);
  const [rateSession, setRateSession] = useState<SessionItem | null>(null);
  const [proposeSwapOpen, setProposeSwapOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [liveChatOpen, setLiveChatOpen] = useState(false);
  const [quickMatchOpen, setQuickMatchOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState<UserSkillItem | null>(null);

  const showToast = (msg: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToastMessage(msg);
    setToastType(type);
  };

  const logout = useCallback(() => {
    auth.set(null);
    setMe(null);
    setProfiles([]);
    setUserSkills([]);
    setInquiries([]);
    setUpcomingSessions([]);
    setPendingRequests([]);
    setCompletedSessions([]);
    setStats(null);
    setReviews([]);
    setCurrentScreen('home');
  }, []);

  /** Runs an API call; shows the error as a toast. Returns undefined on failure. */
  const run = async <T,>(fn: () => Promise<T>): Promise<T | undefined> => {
    try {
      return await fn();
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        logout();
        setAuthOpen(true);
      }
      showToast((err as Error).message, 'error');
      return undefined;
    }
  };

  // ---------- Loaders (Read) ----------
  const loadSkills = () => run(async () => setSkills(await api.listSkills()));
  const loadSessions = () =>
    run(async () => {
      const s = await api.listSessions();
      setUpcomingSessions(s.upcoming);
      setPendingRequests(s.pending);
      setCompletedSessions(s.completed);
    });
  const loadDashboard = () =>
    run(async () => {
      const [d, mine, inq] = await Promise.all([api.dashboard(), api.listMySkills(), api.listRequests()]);
      setStats(d.stats);
      setReviews(d.reviews);
      setUserSkills(mine);
      setInquiries(inq);
    });
  const loadPeople = () => run(async () => setProfiles(await api.listPeople()));

  const loadAll = async () => {
    setLoading(true);
    await Promise.all([loadSkills(), loadSessions(), loadDashboard(), loadPeople()]);
    setLoading(false);
  };

  // Restore login from a saved token
  useEffect(() => {
    loadSkills();
    if (!auth.token) return;
    api
      .me()
      .then((u) => setMe(u))
      .catch(() => auth.set(null));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (me) loadAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [me?.id]);

  // Smooth scroll to top on screen switch; protected pages ask for login first
  const navigateTo = (screen: ScreenType) => {
    if (PROTECTED.includes(screen) && !me) {
      setPendingScreen(screen);
      setAuthOpen(true);
      return;
    }
    setCurrentScreen(screen);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAuthenticated = (user: CurrentUser) => {
    setMe(user);
    setAuthOpen(false);
    showToast(`Welcome, ${user.name.split(' ')[0]}!`);
    if (pendingScreen) {
      setCurrentScreen(pendingScreen);
      setPendingScreen(null);
    }
  };

  const requireLogin = () => {
    if (me) return true;
    setAuthOpen(true);
    return false;
  };

  // ---------- Create: send an exchange request ----------
  const handleRequestTrade = async (item: {
    id?: string;
    authorId?: string;
    authorName?: string;
    name?: string;
    teaches?: string;
    wants?: string | string[];
    offers?: string[];
  }) => {
    if (!requireLogin()) return;
    const isProfile = Array.isArray(item.offers);
    const result = await run(() =>
      api.sendRequest({
        toUserId: isProfile ? item.id : item.authorId,
        peerName: item.authorName || item.name,
        listingId: !isProfile && item.authorId ? item.id : undefined,
        wants: isProfile ? item.offers![0] : item.teaches || '',
      })
    );
    if (result) showToast(`Trade proposal sent to ${result.peerName}! They'll see it in their Requests.`);
  };

  // ---------- Create: publish a marketplace listing ----------
  const handleAddNewSkill = async (newListing: SkillListing) => {
    if (!requireLogin()) return;
    const created = await run(() => api.createSkill(newListing));
    if (created) {
      setSkills((prev) => [created, ...prev]);
      showToast(`"${created.teaches}" listing published to marketplace!`);
    }
  };

  // ---------- Update: exchange requests ----------
  const handleAcceptInquiry = async (inq: ExchangeInquiry) => {
    const updated = await run(() => api.acceptRequest(inq.id));
    if (!updated) return;
    setInquiries((prev) => prev.map((item) => (item.id === inq.id ? updated : item)));
    await loadSessions();
    showToast(`Exchange agreed with ${inq.peerName}! Scheduled into Upcoming Sessions.`);
  };

  const handleDeclineInquiry = async (inq: ExchangeInquiry) => {
    const updated = await run(() => api.declineRequest(inq.id));
    if (!updated) return;
    setInquiries((prev) => prev.map((item) => (item.id === inq.id ? updated : item)));
    showToast(`Declined exchange inquiry from ${inq.peerName}.`);
  };

  // ---------- Update: session requests ----------
  const handleAcceptPending = async (session: SessionItem) => {
    const updated = await run(() => api.acceptSession(session.id));
    if (!updated) return;
    await loadSessions();
    showToast(`Accepted swap with ${session.peerName}! Added to your Upcoming calendar.`);
  };

  const handleDeclinePending = async (session: SessionItem) => {
    if (!(await run(() => api.declineSession(session.id)))) return;
    setPendingRequests((prev) => prev.filter((p) => p.id !== session.id));
    showToast(`Declined proposal from ${session.peerName}.`);
  };

  const handleCancelSession = async (session: SessionItem) => {
    if (!confirm(`Cancel your exchange session with ${session.peerName}? Both peer timebanks will be updated.`)) return;
    if (!(await run(() => api.cancelSession(session.id)))) return;
    setUpcomingSessions((prev) => prev.filter((s) => s.id !== session.id));
    showToast(`Session with ${session.peerName} cancelled.`);
  };

  const replaceUpcoming = (updated: SessionItem) =>
    setUpcomingSessions((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));

  // ---------- Portfolio (My Skills) CRUD ----------
  const handleAddUserSkill = async (s: UserSkillItem) => {
    const created = await run(() => api.addMySkill({ type: s.type, title: s.title, description: s.description }));
    if (created) {
      setUserSkills((prev) => [created, ...prev]);
      showToast(`Successfully published "${created.title}"!`);
    }
  };

  const handleTogglePauseSkill = async (id: string) => {
    const updated = await run(() => api.toggleMySkill(id));
    if (!updated) return;
    setUserSkills((prev) => prev.map((s) => (s.id === id ? updated : s)));
    showToast(updated.status === 'active' ? `Activated "${updated.title}"!` : `Paused "${updated.title}" from search.`);
  };

  const handleDeleteSkill = async (id: string) => {
    const item = userSkills.find((s) => s.id === id);
    if (!confirm(`Delete "${item?.title || 'this skill'}" from your portfolio? This cannot be undone.`)) return;
    const ok = await run(async () => {
      await api.deleteMySkill(id);
      return true;
    });
    if (!ok) return;
    setUserSkills((prev) => prev.filter((s) => s.id !== id));
    showToast(`Removed "${item?.title || 'skill'}" from your portfolio.`);
  };

  const handleEditSkill = (skill: UserSkillItem) => {
    setEditingSkill(skill);
  };

  const handleSaveEditedSkill = async () => {
    if (!editingSkill) return;
    const updated = await run(() =>
      api.updateMySkill(editingSkill.id, { title: editingSkill.title, description: editingSkill.description })
    );
    if (!updated) return;
    setUserSkills((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
    setEditingSkill(null);
    showToast(`Saved updates to "${updated.title}"`);
  };

  const handleToggleAvailability = async () => {
    if (!me) return;
    const updated = await run(() => api.setAvailability(!me.availableThisWeek));
    if (updated) {
      setMe(updated);
      showToast(updated.availableThisWeek ? 'Status set to Available this week' : 'Status set to Away');
    }
  };

  // ---------- Complete Video Room session ----------
  const handleCompleteSession = async () => {
    if (!activeVideoSession) return;
    const session = activeVideoSession;
    const completed = await run(() => api.completeSession(session.id));
    if (!completed) return;
    setUpcomingSessions((prev) => prev.filter((s) => s.id !== session.id));
    setCompletedSessions((prev) => [completed, ...prev]);
    loadDashboard();
    showToast(`Exchange completed with ${session.peerName}! Rate your partner from Session History.`);
  };

  // ---------- Create: review ----------
  const handleSubmitReview = async (rating: number, comment: string) => {
    if (!rateSession) return;
    const updated = await run(() => api.reviewSession(rateSession.id, rating, comment));
    if (!updated) return;
    setCompletedSessions((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
    setRateSession(null);
    showToast(`Thanks! Your review of ${updated.peerName} was saved.`);
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
        onOpenNotifications={() => (me ? setNotificationsOpen(true) : setAuthOpen(true))}
        unreadCount={unreadCount}
        user={me}
        onLogin={() => setAuthOpen(true)}
        onLogout={() => {
          logout();
          showToast('You have been logged out.', 'info');
        }}
      />

      {/* Main Body with Centered Max-Width */}
      <main className="flex-1 flex flex-col relative w-full pt-16 pb-24 bg-surface min-h-screen">
        <div className="max-w-2xl mx-auto w-full">
          {loading && (
            <div className="px-gutter-mobile pt-2 text-xs text-on-surface-variant">Loading your data…</div>
          )}
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
              onRateSession={(s) => setRateSession(s)}
              onShowToast={showToast}
            />
          )}

          {currentScreen === 'dashboard' && (
            <DashboardView
              inquiries={inquiries}
              onAcceptInquiry={handleAcceptInquiry}
              onDeclineInquiry={handleDeclineInquiry}
              user={me}
              stats={stats}
              reviews={reviews}
              onToggleAvailability={handleToggleAvailability}
              userSkills={userSkills}
              onAddUserSkill={handleAddUserSkill}
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
              onSubmitTicket={(t) => run(() => api.submitTicket(t))}
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
        onRequestTrade={(skill) => handleRequestTrade(skill)}
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
          onSave={async (updatedNotes) => {
            const updated = await run(() => api.saveSessionNotes(prepNotesSession.id, updatedNotes));
            if (updated) {
              replaceUpcoming(updated);
              showToast('Prep notes synchronized!');
            }
          }}
        />
      )}

      {/* Reschedule Modal */}
      {rescheduleSession && (
        <RescheduleModal
          isOpen={!!rescheduleSession}
          onClose={() => setRescheduleSession(null)}
          peerName={rescheduleSession.peerName}
          onConfirmReschedule={async (slot, note) => {
            const updated = await run(() => api.rescheduleSession(rescheduleSession.id, slot, note));
            if (updated) {
              replaceUpcoming(updated);
              showToast(`Reschedule proposal dispatched to ${rescheduleSession.peerName}!`);
            }
          }}
        />
      )}

      {/* Propose Swap Modal */}
      <ProposeSwapModal
        isOpen={proposeSwapOpen}
        onClose={() => setProposeSwapOpen(false)}
        onPropose={async (details) => {
          const peerName = details.peer.split(' (')[0];
          const created = await run(() =>
            api.proposeSession({
              peerName,
              youTeach: details.youTeach,
              peerTeaches: details.peerTeaches,
              minutes: details.duration.startsWith('60') ? 60 : 45,
            })
          );
          if (created) {
            setUpcomingSessions((prev) => [...prev, created]);
            showToast(`Exchange proposed with ${peerName}! Waiting for them to accept.`);
          }
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
              onClick={handleSaveEditedSkill}
              className="w-full py-2.5 rounded-xl bg-primary text-on-primary font-label-md text-label-md font-semibold cursor-pointer shadow-sm"
            >
              Save Changes
            </button>
          </div>
        </div>
      )}

      {/* Login / Register */}
      <AuthModal
        isOpen={authOpen}
        onClose={() => {
          setAuthOpen(false);
          setPendingScreen(null);
        }}
        onAuthenticated={handleAuthenticated}
      />

      {/* Rate learning partner */}
      <RateSessionModal session={rateSession} onClose={() => setRateSession(null)} onSubmit={handleSubmitReview} />

      {/* Global Toast Notification */}
      <Toast
        message={toastMessage}
        type={toastType}
        onClose={() => setToastMessage(null)}
      />
    </div>
  );
}
