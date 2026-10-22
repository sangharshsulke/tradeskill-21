import React, { useState } from 'react';
import { CurrentUser, ScreenType } from '../types';

interface HeaderProps {
  currentScreen: ScreenType;
  onNavigate: (screen: ScreenType) => void;
  onOpenSearch?: () => void;
  onOpenNotifications: () => void;
  unreadCount?: number;
  user: CurrentUser | null;
  onLogin: () => void;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentScreen,
  onNavigate,
  onOpenSearch,
  onOpenNotifications,
  unreadCount = 0,
  user,
  onLogin,
  onLogout,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const getScreenTitle = () => {
    switch (currentScreen) {
      case 'home':
        return 'Home';
      case 'skills':
        return 'Skills';
      case 'people':
        return 'People';
      case 'sessions':
        return 'Sessions';
      case 'dashboard':
        return 'Dashboard';
      case 'about':
        return 'About';
      case 'contact':
        return 'Contact';
      default:
        return 'Home';
    }
  };

  const isSubPage = currentScreen === 'about' || currentScreen === 'contact';

  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-surface/90 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)] pt-safe">
      <div className="max-w-2xl mx-auto h-16 px-gutter-mobile flex items-center justify-between gap-space-sm">
        {/* Left branding or Back button */}
        <div className="flex items-center gap-space-sm min-w-0">
          {isSubPage ? (
            <button
              aria-label="Go back"
              onClick={() => onNavigate('home')}
              className="w-11 h-11 flex items-center justify-center -ml-2 rounded-full text-on-surface hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20 active:scale-95"
            >
              <span className="material-symbols-outlined text-[24px]">arrow_back</span>
            </button>
          ) : null}

          <div 
            className="flex items-center gap-space-sm cursor-pointer select-none"
            onClick={() => onNavigate('home')}
          >
            <img
              alt="TradeSkill Logo"
              className="h-8 w-auto object-contain shrink-0"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBeyQ1tGsSYAkUZgMALz4BWbFlEW_Efo1FrvNPH6WV-haKFO7XfDBzV7YyBs5ZQZPnRQHL4UvtouDTmEiy6Xc7Q5lvAtqVY7diyhYDXz8mDI8RrZOl3hjtrHcL965ZptKoPfDYxkB2GsVO2pR04AWwJrdu2VvqHF2qaBDUcnSvUdGq2YhJJejXJk3fNuE9SxaVHu5F2CnH6LoQmDHC__gvLueEqYME7oTNiVnTEySXmSaiWAarq_hM"
            />
            <div className="flex flex-col">
              <span className="font-headline-sm text-headline-sm text-primary leading-tight font-bold tracking-tight">
                TradeSkill
              </span>
              <span className="font-label-sm text-label-sm text-on-surface-variant leading-none">
                {getScreenTitle()}
              </span>
            </div>
          </div>
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-space-xs relative">
          <button
            aria-label="Search skills"
            onClick={onOpenSearch}
            className="w-11 h-11 flex items-center justify-center rounded-full text-on-surface-variant hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20 active:scale-95"
          >
            <span className="material-symbols-outlined text-[22px]">search</span>
          </button>

          <button
            aria-label="Notifications"
            onClick={onOpenNotifications}
            className="w-11 h-11 relative flex items-center justify-center rounded-full text-on-surface-variant hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20 active:scale-95"
          >
            <span className="material-symbols-outlined text-[22px]">notifications</span>
            {unreadCount > 0 && (
              <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-secondary ring-2 ring-surface"></span>
            )}
          </button>

          {/* Quick Info & Navigation Dropdown Menu */}
          <div className="relative">
            <button
              aria-label="More options"
              onClick={() => setMenuOpen(!menuOpen)}
              className="w-10 h-10 flex items-center justify-center rounded-full text-on-surface-variant hover:text-primary transition-colors focus:outline-none active:scale-95"
            >
              <span className="material-symbols-outlined text-[22px]">more_vert</span>
            </button>

            {menuOpen && (
              <div 
                className="absolute right-0 top-12 w-48 bg-surface-container-lowest rounded-2xl shadow-xl py-2 z-50 border border-outline-variant/30 animate-in fade-in zoom-in-95 duration-150"
                onClick={() => setMenuOpen(false)}
              >
                <button
                  onClick={() => onNavigate('about')}
                  className="w-full px-4 py-2.5 text-left font-label-md text-label-md text-on-surface hover:bg-surface-container-low flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-[18px] text-primary">info</span>
                  About TradeSkill
                </button>
                <button
                  onClick={() => onNavigate('contact')}
                  className="w-full px-4 py-2.5 text-left font-label-md text-label-md text-on-surface hover:bg-surface-container-low flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-[18px] text-secondary">support_agent</span>
                  Help & Contact
                </button>
                <div className="h-px bg-outline-variant/30 my-1"></div>
                <button
                  onClick={() => onNavigate('dashboard')}
                  className="w-full px-4 py-2.5 text-left font-label-md text-label-md text-on-surface hover:bg-surface-container-low flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-[18px] text-on-surface-variant">equalizer</span>
                  My Dashboard
                </button>
                {user && (
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      onLogout();
                    }}
                    className="w-full px-4 py-2.5 text-left font-label-md text-label-md text-on-surface hover:bg-surface-container-low flex items-center gap-2"
                  >
                    <span className="material-symbols-outlined text-[18px] text-on-surface-variant">logout</span>
                    Log out
                  </button>
                )}
              </div>
            )}
          </div>

          {/* User Profile Avatar / Login */}
          {user ? (
            <button
              aria-label="Open User Profile"
              onClick={() => onNavigate('dashboard')}
              className="w-11 h-11 flex items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-primary/30 active:scale-95 ml-space-xs"
            >
              <img
                alt={`${user.name} Profile`}
                className="w-8 h-8 rounded-full object-cover ring-1 ring-primary/20"
                src={user.avatar}
              />
            </button>
          ) : (
            <button
              onClick={onLogin}
              className="ml-space-xs px-3 py-1.5 rounded-full bg-primary text-on-primary font-label-md text-label-md font-semibold active:scale-95"
            >
              Log in
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
