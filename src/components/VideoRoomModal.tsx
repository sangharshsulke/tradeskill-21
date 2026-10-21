import React, { useState, useEffect } from 'react';

interface VideoRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  peerName: string;
  youTeach: string;
  peerTeaches: string;
  onCompleteSession: () => void;
}

export const VideoRoomModal: React.FC<VideoRoomModalProps> = ({
  isOpen,
  onClose,
  peerName,
  youTeach,
  peerTeaches,
  onCompleteSession,
}) => {
  const [micMuted, setMicMuted] = useState(false);
  const [videoOff, setVideoOff] = useState(false);
  const [screenSharing, setScreenSharing] = useState(false);
  const [activeSegment, setActiveSegment] = useState<'you' | 'peer'>('you');
  const [secondsRemaining, setSecondsRemaining] = useState(45 * 60);
  const [sharedNotes, setSharedNotes] = useState(
    `# Mutual 1:1 Exchange Notes\n• Part 1: ${youTeach} (Elena)\n  - Framing user problem statement\n  - Synthesis framework & journey mapping\n• Part 2: ${peerTeaches} (${peerName})\n  - German grammar cases (Akkusativ/Dativ)\n  - Daily work conversation idioms`
  );

  useEffect(() => {
    if (!isOpen) return;
    const interval = setInterval(() => {
      setSecondsRemaining((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [isOpen]);

  if (!isOpen) return null;

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleEndExchange = () => {
    onCompleteSession();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-inverse-surface/90 backdrop-blur-md flex flex-col justify-between p-3 sm:p-6 overflow-hidden">
      {/* Top Bar in Video Room */}
      <div className="max-w-4xl mx-auto w-full flex items-center justify-between bg-surface-container-lowest/10 backdrop-blur-lg px-4 py-3 rounded-2xl border border-white/10 text-white">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-secondary-fixed animate-ping"></span>
            <span className="font-label-md text-label-md font-semibold text-secondary-fixed uppercase tracking-wider">
              Reciprocal Video Room
            </span>
          </div>
          <span className="text-white/40">•</span>
          <span className="font-title-md text-title-md text-white truncate">
            {peerName}
          </span>
        </div>

        {/* 1:1 Parity Segment Tracker */}
        <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-xl">
          <span className="material-symbols-outlined text-secondary-fixed text-[18px]">timelapse</span>
          <div className="flex flex-col text-right">
            <span className="font-mono text-sm font-bold text-white tabular-nums">
              {formatTime(secondsRemaining)}
            </span>
            <span className="font-label-sm text-[10px] text-white/70">
              {activeSegment === 'you' ? `You teach: ${youTeach}` : `${peerName} teaches: ${peerTeaches}`}
            </span>
          </div>
          <button
            onClick={() => {
              setActiveSegment(activeSegment === 'you' ? 'peer' : 'you');
              setSecondsRemaining(45 * 60);
            }}
            title="Switch teaching turn (45m/45m parity)"
            className="ml-1 p-1 bg-white/15 hover:bg-white/25 rounded text-white text-xs flex items-center gap-0.5 active:scale-95"
          >
            <span className="material-symbols-outlined text-[14px]">swap_horiz</span>
            <span>Switch</span>
          </button>
        </div>
      </div>

      {/* Main Video & Collaborative Space */}
      <div className="max-w-4xl mx-auto w-full flex-1 my-3 grid grid-cols-1 md:grid-cols-3 gap-3 min-h-0">
        {/* Remote Video Stream (Main) */}
        <div className="md:col-span-2 relative bg-surface-container-highest/20 rounded-2xl overflow-hidden border border-white/10 flex items-center justify-center min-h-[220px]">
          <img
            alt={peerName}
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuASk3KxJaOcZGvpeQZ0LcBnfFe3sg_EnaDJBgJ-Jcl3BpH1Bzr4O_pi2OKhEUXZcMj5FNF6C6iD3lVKAiPb6wDQN4rNqKP9MNQ6wdPt6pfwDg83tTu4Tr4bdFelPx8k-SGTYZzWN3kQ7KZMXBuBlzG8eGhmEzvUi9zCYVQQHMkpxWvwZwzlJ6VcqKg0BcApQXpKTpJQfP_to9eBGc7yJv_mE1Nc_1U8JtIcsigchHfv6kueYB_wb60"
            className="w-full h-full object-cover filter brightness-95"
          />
          {/* Peer Speaking Overlay */}
          <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-2 text-white font-label-sm text-label-sm">
            <span className="w-2 h-2 rounded-full bg-secondary-fixed animate-pulse"></span>
            <span>{peerName} (Live Audio)</span>
          </div>

          {/* Self Video Floating PIP */}
          <div className="absolute bottom-3 right-3 w-28 h-36 sm:w-36 sm:h-44 rounded-xl overflow-hidden shadow-2xl border-2 border-primary bg-surface-container-highest">
            {videoOff ? (
              <div className="w-full h-full bg-slate-900 flex flex-col items-center justify-center text-white/60">
                <span className="material-symbols-outlined text-[24px]">videocam_off</span>
                <span className="text-[10px] mt-1">Camera off</span>
              </div>
            ) : (
              <img
                alt="You (Elena Rostova)"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCqYkvUVDx90OoMqyUCT73GI1Co1tq7PlgE8pCbafW-s5bhJ7c_l2JIs92y7OpPo1VYBymEAJWQa9P2De8Q_0VeLughqetvKz0BkfXlQfsuI1vHcEO2xvqTBxAu87yMK_ss4Xteq1Js6WYUgBfPqCK2oo-xqYSwdy9QU0kJiLmqrQcvpYwOZFlGscV8UXFDIXd20j9E-ODfY45xbgYfh7QGd4fE22ZaAgDuzMFFdXbQnnmd3jDukoA"
                className="w-full h-full object-cover"
              />
            )}
            <span className="absolute bottom-1 left-2 text-[10px] text-white/90 bg-black/50 px-1 rounded">You</span>
          </div>
        </div>

        {/* Collaborative Whiteboard / Shared Document */}
        <div className="bg-surface-container-lowest rounded-2xl p-4 flex flex-col border border-white/10 shadow-lg">
          <div className="flex items-center justify-between pb-2 border-b border-outline-variant/30">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[20px]">draw</span>
              <span className="font-title-md text-title-md text-on-surface">Shared Workspace</span>
            </div>
            <span className="text-[11px] font-semibold text-secondary bg-secondary-container/30 px-2 py-0.5 rounded-full">
              Live Sync
            </span>
          </div>
          <p className="text-[11px] text-on-surface-variant my-1.5">
            Both peers have real-time edit access during the barter call.
          </p>
          <textarea
            value={sharedNotes}
            onChange={(e) => setSharedNotes(e.target.value)}
            className="flex-1 w-full bg-surface-container-low rounded-xl p-2.5 font-mono text-xs text-on-surface resize-none focus:outline-none focus:ring-1 focus:ring-primary/40 leading-relaxed"
            rows={8}
          />
        </div>
      </div>

      {/* Bottom Floating Control Bar */}
      <div className="max-w-md mx-auto w-full bg-surface-container-lowest/15 backdrop-blur-xl px-5 py-3 rounded-full border border-white/15 flex items-center justify-around gap-2 shadow-2xl">
        <button
          onClick={() => setMicMuted(!micMuted)}
          className={`w-11 h-11 rounded-full flex items-center justify-center transition-all ${
            micMuted ? 'bg-error text-white' : 'bg-white/20 text-white hover:bg-white/30'
          }`}
          title={micMuted ? 'Unmute microphone' : 'Mute microphone'}
        >
          <span className="material-symbols-outlined text-[20px]">
            {micMuted ? 'mic_off' : 'mic'}
          </span>
        </button>

        <button
          onClick={() => setVideoOff(!videoOff)}
          className={`w-11 h-11 rounded-full flex items-center justify-center transition-all ${
            videoOff ? 'bg-error text-white' : 'bg-white/20 text-white hover:bg-white/30'
          }`}
          title={videoOff ? 'Turn video on' : 'Turn video off'}
        >
          <span className="material-symbols-outlined text-[20px]">
            {videoOff ? 'videocam_off' : 'videocam'}
          </span>
        </button>

        <button
          onClick={() => setScreenSharing(!screenSharing)}
          className={`w-11 h-11 rounded-full flex items-center justify-center transition-all ${
            screenSharing ? 'bg-secondary text-white' : 'bg-white/20 text-white hover:bg-white/30'
          }`}
          title="Share screen"
        >
          <span className="material-symbols-outlined text-[20px]">screen_share</span>
        </button>

        <button
          onClick={handleEndExchange}
          className="h-11 px-5 rounded-full bg-error text-white font-label-md text-label-md flex items-center gap-1.5 shadow-md hover:bg-error/90 active:scale-95 transition-all"
        >
          <span className="material-symbols-outlined text-[18px]">call_end</span>
          <span>End & Settle</span>
        </button>
      </div>
    </div>
  );
};
