import React from 'react';
import { ScreenType } from '../types';

interface BottomNavProps {
  currentScreen: ScreenType;
  onNavigate: (screen: ScreenType) => void;
  pendingCount?: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentScreen, onNavigate, pendingCount = 2 }) => {
  const tabs: { id: ScreenType; label: string; icon: string; hasBadge?: boolean }[] = [
    { id: 'home', label: 'Home', icon: 'swap_horiz' },
    { id: 'skills', label: 'Skills', icon: 'explore' },
    { id: 'people', label: 'People', icon: 'group' },
    { id: 'sessions', label: 'Sessions', icon: 'event_available', hasBadge: pendingCount > 0 },
    { id: 'dashboard', label: 'Dashboard', icon: 'equalizer' },
  ];

  return (
    <nav className="fixed bottom-0 inset-x-0 z-50 pb-safe bg-surface/90 backdrop-blur-xl shadow-[0_-2px_12px_rgba(11,28,48,0.05)] border-t border-outline-variant/20">
      <div className="max-w-2xl mx-auto flex justify-around items-center h-16 px-space-xs">
        {tabs.map((tab) => {
          const isActive = currentScreen === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onNavigate(tab.id)}
              className={`relative flex flex-col items-center justify-center w-14 h-14 transition-all active:scale-95 ${
                isActive ? 'text-primary font-semibold' : 'text-on-surface-variant hover:text-primary'
              }`}
              aria-label={tab.label}
              aria-current={isActive ? 'page' : undefined}
            >
              <div className="relative">
                <span className="material-symbols-outlined text-[24px]">{tab.icon}</span>
                {tab.hasBadge && (
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-secondary ring-2 ring-surface"></span>
                )}
              </div>
              <span className="font-label-sm text-label-sm tracking-tight mt-0.5">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
