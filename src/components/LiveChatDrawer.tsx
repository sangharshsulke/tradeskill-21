import React, { useState } from 'react';

interface LiveChatDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Message {
  sender: 'user' | 'agent';
  text: string;
  time: string;
}

export const LiveChatDrawer: React.FC<LiveChatDrawerProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'agent',
      text: 'Hello! I am Maya from TradeSkill Concierge. How can I help you with your skill exchange, balance calibrator, or finding a mentor today?',
      time: 'Just now'
    }
  ]);
  const [input, setInput] = useState('');

  if (!isOpen) return null;

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userText = input.trim();
    const newMsg: Message = { sender: 'user', text: userText, time: 'Just now' };
    setMessages((prev) => [...prev, newMsg]);
    setInput('');

    // Simulated responsive agent reply
    setTimeout(() => {
      let reply = "Thanks for reaching out! I've logged your request into our 2-Hour Resolution Queue. A verified community steward is calibrating your match.";
      if (userText.toLowerCase().includes('dispute') || userText.toLowerCase().includes('cancel')) {
        reply = "We honor our 15-minute sync grace period. If a partner doesn't show up, your time credit is immediately protected and refunded to your timebank.";
      } else if (userText.toLowerCase().includes('hour') || userText.toLowerCase().includes('credit')) {
        reply = "Your 1:1 time credit parity is currently balanced at 100%! Every hour you teach unlocks 1 hour of certified peer learning.";
      }
      setMessages((prev) => [...prev, { sender: 'agent', text: reply, time: 'Just now' }]);
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end">
      <div className="absolute inset-0 bg-inverse-surface/40 backdrop-blur-xs" onClick={onClose} />
      <div className="relative bg-surface-container-lowest rounded-t-3xl shadow-2xl max-h-[85vh] h-[520px] max-w-lg mx-auto w-full flex flex-col z-10 animate-in slide-in-from-bottom duration-300">
        {/* Header */}
        <div className="p-4 border-b border-outline-variant/30 flex items-center justify-between bg-surface-container-low rounded-t-3xl">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAea6e4tXQhI7iqXUyVK1dFT1jhAnP1RcfimzXrV3K3Y51x0ItLADf55N5bbPz0_SMiA-Iqm9PpGi41PAC1eeuJSxDMG-0rAp5bN13fcphAR3IjEQ1wY4NWWLtxQwSgp3gWCrvh_trBlSdPR0cmkh6RYWslttUJBIVl3hV8YIj5tjV8IwntsPWcivUO1DJQ7bNjEPdAOnFFSriBJ0i_y54aE2zuateUspvoTe-T3kBMvcDYbLDpexQ"
                alt="Maya Concierge"
                className="w-10 h-10 rounded-full object-cover ring-2 ring-secondary"
              />
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-secondary ring-2 ring-white"></span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-title-md text-sm text-on-surface font-bold">TradeSkill Concierge</span>
                <span className="text-[10px] bg-secondary-container text-on-secondary-container px-1.5 py-0.2 rounded font-bold">24/7 Live</span>
              </div>
              <p className="text-xs text-on-surface-variant">Avg reply &lt; 5 mins • Safe Exchange Support</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:text-on-surface"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Message Thread */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[82%] p-3 rounded-2xl text-sm ${
                  m.sender === 'user'
                    ? 'bg-primary text-on-primary rounded-br-none'
                    : 'bg-surface-container-low text-on-surface rounded-bl-none shadow-xs'
                }`}
              >
                {m.text}
              </div>
              <span className="text-[10px] text-on-surface-variant mt-1 px-1">{m.time}</span>
            </div>
          ))}
        </div>

        {/* Input Bar */}
        <form onSubmit={handleSend} className="p-3 border-t border-outline-variant/30 flex items-center gap-2 bg-surface-container-lowest">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 h-11 px-3.5 rounded-xl bg-surface-container text-on-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
          <button
            type="submit"
            className="w-11 h-11 rounded-xl bg-primary text-on-primary flex items-center justify-center shadow-md active:scale-95 transition-transform shrink-0"
          >
            <span className="material-symbols-outlined text-[20px]">send</span>
          </button>
        </form>
      </div>
    </div>
  );
};
