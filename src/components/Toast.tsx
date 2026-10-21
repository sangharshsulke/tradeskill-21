import React, { useEffect } from 'react';

interface ToastProps {
  message: string | null;
  onClose: () => void;
  type?: 'success' | 'info' | 'error';
}

export const Toast: React.FC<ToastProps> = ({ message, onClose, type = 'success' }) => {
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        onClose();
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [message, onClose]);

  if (!message) return null;

  return (
    <div className="fixed bottom-20 inset-x-4 max-w-sm mx-auto z-50 pointer-events-auto transition-all duration-300 animate-in fade-in slide-in-from-bottom-4">
      <div className="p-3.5 rounded-xl bg-inverse-surface text-inverse-on-surface shadow-2xl flex items-center justify-between gap-3 border border-outline-variant/20">
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="material-symbols-outlined text-secondary-fixed text-[20px] shrink-0">
            {type === 'error' ? 'error' : 'check_circle'}
          </span>
          <span className="font-body-sm text-body-sm font-medium truncate">{message}</span>
        </div>
        <button
          onClick={onClose}
          className="text-inverse-on-surface/60 hover:text-inverse-on-surface p-1 rounded-md"
        >
          <span className="material-symbols-outlined text-[16px]">close</span>
        </button>
      </div>
    </div>
  );
};
