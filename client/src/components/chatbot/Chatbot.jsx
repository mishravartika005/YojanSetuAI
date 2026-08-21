import { useState } from 'react';
import { MessageCircleQuestion, SendHorizonal, X } from 'lucide-react';
import Button from '../common/Button';
import ChatMessage from './ChatMessage';

const sampleMessages = [
  { role: 'assistant', text: 'I can help you explore relevant government schemes once the AI service is connected.' },
  { role: 'user', text: 'Can you show me support options for students?' },
];

export default function Chatbot({ messages = sampleMessages }) {
  const [isOpen, setIsOpen] = useState(false);
  const [draft, setDraft] = useState('');

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {isOpen ? (
        <div className="mb-4 w-[min(92vw,360px)] overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-xl">
          <header className="flex items-center justify-between bg-[#0b3b72] px-4 py-3 text-white">
            <div className="flex items-center gap-2">
              <MessageCircleQuestion className="h-5 w-5" />
              <div>
                <p className="text-sm font-semibold">YojanSetu Assistant</p>
                <p className="text-[10px] uppercase tracking-[0.14em] text-sky-100">Future AI ready</p>
              </div>
            </div>
            <button type="button" className="rounded-lg p-1.5 hover:bg-white/10" aria-label="Close chat" onClick={() => setIsOpen(false)}>
              <X className="h-4 w-4" />
            </button>
          </header>

          <div className="flex max-h-[360px] flex-col gap-3 overflow-y-auto bg-slate-50 p-4">
            {messages.map((message, index) => (
              <ChatMessage key={`${message.role}-${index}`} message={message} timestamp="Just now" />
            ))}
          </div>

          <div className="border-t border-slate-200 bg-white p-3">
            <div className="flex gap-2">
              <input
                aria-label="Message input"
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                placeholder="Ask about schemes or eligibility..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:border-sky-500 focus:outline-none focus:ring-4 focus:ring-sky-100"
              />
              <Button type="button" className="px-3" size="sm" disabled={!draft.trim()} aria-label="Send message">
                <SendHorizonal className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      ) : null}

      <button
        type="button"
        aria-label="Open assistant chat"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-[#0b3b72] text-white shadow-lg transition hover:bg-[#092950]"
      >
        <MessageCircleQuestion className="h-6 w-6" />
      </button>
    </div>
  );
}