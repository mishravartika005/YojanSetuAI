import { Bot, User, Volume2, Square } from 'lucide-react';
import { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { speakText, stopSpeech } from '../../utils/speech';

export default function ChatMessage({ message, timestamp }) {
  const { language, t } = useLanguage();
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speechError, setSpeechError] = useState('');

  const isUser = message?.role === 'user';
  const text = message?.text || message || 'Message will appear here';
  const isErrorMessage = text === t('chatError') || text.includes('AI Assistant is temporarily unavailable');
  const showReadAloud = !isUser && !isErrorMessage;

  const handleSpeech = () => {
    if (isSpeaking) {
      stopSpeech();
      setIsSpeaking(false);
      return;
    }

    setIsSpeaking(true);
    setSpeechError('');

    speakText(
      text,
      language,
      () => setIsSpeaking(true),
      () => setIsSpeaking(false),
      (err) => {
        setIsSpeaking(false);
        if (err === 'not_supported') {
          setSpeechError(t('speechNotSupported'));
        } else {
          setSpeechError(t('speechVoiceUnavailable'));
        }
        setTimeout(() => setSpeechError(''), 3000);
      }
    );
  };

  return (
    <div className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}>
      {!isUser ? (
        <div className="mt-1 flex h-8 w-8 items-center justify-center rounded-full bg-[#0b3b72] text-white">
          <Bot className="h-4 w-4" />
        </div>
      ) : null}

      <div className={`${isUser ? 'bg-[#0b3b72] text-white' : 'bg-slate-100 text-slate-700'} max-w-[80%] rounded-2xl px-3 py-2 text-sm leading-6`}>
        <p>{text}</p>
        
        {showReadAloud && (
          <div className="mt-2 flex flex-col gap-1 items-start">
            <button
              type="button"
              onClick={handleSpeech}
              className="inline-flex items-center gap-1.5 text-[10px] font-bold text-[#0b3b72] bg-white border border-slate-200 rounded-lg px-2 py-0.5 shadow-sm hover:bg-slate-50 focus:outline-none focus:ring-1 focus:ring-sky-500"
              aria-label="Read assistant message aloud"
            >
              {isSpeaking ? (
                <>
                  <Square className="h-3 w-3 text-red-500" />
                  {t('stopSpeech')}
                </>
              ) : (
                <>
                  <Volume2 className="h-3 w-3 text-slate-500" />
                  {t('readAloud')}
                </>
              )}
            </button>
            {speechError && (
              <p className="text-[9px] text-red-500">{speechError}</p>
            )}
          </div>
        )}

        {timestamp ? <p className={`mt-1 text-[10px] ${isUser ? 'text-sky-100' : 'text-slate-500'}`}>{timestamp}</p> : null}
      </div>

      {isUser ? (
        <div className="mt-1 flex h-8 w-8 items-center justify-center rounded-full bg-slate-200 text-slate-700">
          <User className="h-4 w-4" />
        </div>
      ) : null}
    </div>
  );
}