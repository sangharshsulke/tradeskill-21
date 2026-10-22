import React, { useState } from 'react';
import { api, auth } from '../lib/api';
import type { CurrentUser } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthenticated: (user: CurrentUser) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onAuthenticated }) => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [email, setEmail] = useState('elena@tradeskill.dev');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      const { token, user } =
        mode === 'login' ? await api.login(email, password) : await api.register(name, email, password, role);
      auth.set(token);
      setPassword('');
      onAuthenticated(user);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false);
    }
  };

  const input =
    'w-full bg-surface-container-low rounded-xl px-3 py-2.5 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/30';

  return (
    <div className="fixed inset-0 z-50 bg-inverse-surface/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="absolute inset-0" onClick={onClose} />
      <div className="relative bg-surface-container-lowest w-full max-w-sm rounded-2xl p-5 shadow-2xl z-10 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[22px]">
              {mode === 'login' ? 'login' : 'person_add'}
            </span>
            <h3 className="font-headline-sm text-headline-sm text-on-surface">
              {mode === 'login' ? 'Log in to TradeSkill' : 'Create your account'}
            </h3>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:text-on-surface"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          {mode === 'register' && (
            <>
              <div>
                <label className="text-xs font-semibold text-on-surface block mb-1">Full name</label>
                <input className={input} value={name} onChange={(e) => setName(e.target.value)} required />
              </div>
              <div>
                <label className="text-xs font-semibold text-on-surface block mb-1">Headline (optional)</label>
                <input
                  className={input}
                  value={role}
                  placeholder="e.g. Frontend Developer"
                  onChange={(e) => setRole(e.target.value)}
                />
              </div>
            </>
          )}
          <div>
            <label className="text-xs font-semibold text-on-surface block mb-1">Email</label>
            <input className={input} type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div>
            <label className="text-xs font-semibold text-on-surface block mb-1">Password</label>
            <input
              className={input}
              type="password"
              value={password}
              minLength={6}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && <p className="text-sm text-error">{error}</p>}

          <button
            type="submit"
            disabled={busy}
            className="w-full py-2.5 rounded-xl bg-primary text-on-primary font-label-md text-label-md font-semibold cursor-pointer shadow-sm disabled:opacity-60"
          >
            {busy ? 'Please wait…' : mode === 'login' ? 'Log in' : 'Sign up'}
          </button>
        </form>

        <p className="text-xs text-on-surface-variant text-center">
          {mode === 'login' ? 'New to TradeSkill?' : 'Already have an account?'}{' '}
          <button
            onClick={() => {
              setMode(mode === 'login' ? 'register' : 'login');
              setError(null);
            }}
            className="text-primary font-semibold hover:underline"
          >
            {mode === 'login' ? 'Create an account' : 'Log in'}
          </button>
        </p>
        {mode === 'login' && (
          <p className="text-[11px] text-on-surface-variant text-center">
            Demo: elena@tradeskill.dev / password123
          </p>
        )}
      </div>
    </div>
  );
};
