export default function EligibilityScore({ score = 0 }) {
  const safeScore = Math.min(Math.max(Number(score) || 0, 0), 100);

  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Eligibility score</p>
          <p className="mt-1 text-2xl font-bold text-slate-900">{safeScore}/100</p>
        </div>
        <div className="relative h-14 w-14">
          <svg viewBox="0 0 120 120" className="h-14 w-14 -rotate-90">
            <circle cx="60" cy="60" r="48" stroke="#dfe7ee" strokeWidth="10" fill="none" />
            <circle
              cx="60"
              cy="60"
              r="48"
              stroke={safeScore >= 70 ? '#1b8f5a' : safeScore >= 40 ? '#f59e0b' : '#ef4444'}
              strokeWidth="10"
              strokeLinecap="round"
              fill="none"
              strokeDasharray={301.59}
              strokeDashoffset={301.59 - (301.59 * safeScore) / 100}
            />
          </svg>
          <span className="absolute inset-0 flex items-center justify-center text-xs font-semibold text-slate-700">
            {safeScore}%
          </span>
        </div>
      </div>
    </div>
  );
}