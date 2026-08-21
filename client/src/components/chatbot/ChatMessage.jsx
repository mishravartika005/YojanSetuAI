import { Bot, User } from 'lucide-react';

export default function ChatMessage({ message, timestamp }) {
  const isUser = message?.role === 'user';
  const text = message?.text || message || 'Message will appear here';

  return (
    <div className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}>
      {!isUser ? (
        <div className="mt-1 flex h-8 w-8 items-center justify-center rounded-full bg-[#0b3b72] text-white">
          <Bot className="h-4 w-4" />
        </div>
      ) : null}

      <div className={`${isUser ? 'bg-[#0b3b72] text-white' : 'bg-slate-100 text-slate-700'} max-w-[80%] rounded-2xl px-3 py-2 text-sm leading-6`}>
        <p>{text}</p>
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