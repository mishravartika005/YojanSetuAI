import { useState, useRef, useEffect } from 'react';
import { MessageCircleQuestion, SendHorizonal, X } from 'lucide-react';
import Button from '../common/Button';
import ChatMessage from './ChatMessage';
import { askSchemeQuestion } from '../../services/aiService';
import { useLanguage } from '../../context/LanguageContext';

export default function Chatbot() {
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [draft, setDraft] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    setMessages([
      { role: 'assistant', text: t('chatHello') }
    ]);
  }, [t]);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleSend = async (e) => {
    if (e) e.preventDefault();
    if (!draft.trim() || loading) return;

    const userMessage = draft.trim();
    setMessages((prev) => [...prev, { role: 'user', text: userMessage }]);
    setDraft('');
    setLoading(true);

    try {
      const response = await askSchemeQuestion(userMessage);
      if (response.success && response.data?.message) {
        setMessages((prev) => [...prev, { role: 'assistant', text: response.data.message }]);
      } else {
        throw new Error('Invalid response structure');
      }
    } catch (err) {
      console.error('Chat error:', err);
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', text: t('chatError') },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {isOpen ? (
        <div className="mb-4 w-[min(92vw,360px)] overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-xl flex flex-col max-h-[500px]">
          <header className="flex items-center justify-between bg-[#0b3b72] px-4 py-3 text-white shrink-0">
            <div className="flex items-center gap-2">
              <MessageCircleQuestion className="h-5 w-5" />
              <div>
                <p className="text-sm font-semibold">{t('chatAssistantTitle')}</p>
                <p className="text-[10px] uppercase tracking-[0.14em] text-sky-100">{t('chatAssistantLabel')}</p>
              </div>
            </div>
            <button type="button" className="rounded-lg p-1.5 hover:bg-white/10" aria-label="Close chat" onClick={() => setIsOpen(false)}>
              <X className="h-4 w-4" />
            </button>
          </header>

          <div className="flex-1 overflow-y-auto bg-slate-50 p-4 space-y-3 min-h-[250px] max-h-[350px]">
            {messages.map((message, index) => (
              <ChatMessage key={`${message.role}-${index}`} message={message} timestamp="" />
            ))}
            {loading && (
              <div className="flex gap-2 items-center text-xs text-slate-500 bg-slate-100 p-2 rounded-xl w-fit">
                <span>{t('chatAssistantThinking')}</span>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          <form onSubmit={handleSend} className="border-t border-slate-200 bg-white p-3 shrink-0">
            <div className="flex gap-2">
              <input
                aria-label="Message input"
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                placeholder={t('chatPlaceholder')}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:border-sky-500 focus:outline-none focus:ring-4 focus:ring-sky-100"
                disabled={loading}
              />
              <Button type="submit" className="px-3" size="sm" disabled={!draft.trim() || loading} aria-label="Send message">
                <SendHorizonal className="h-4 w-4" />
              </Button>
            </div>
          </form>
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