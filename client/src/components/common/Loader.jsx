export default function Loader({ label = 'Loading...' }) {
  return (
    <div className="flex items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-600 shadow-sm" role="status" aria-live="polite" aria-label={label}>
      <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-[#0b3b72]" />
      <span>{label}</span>
    </div>
  );
}