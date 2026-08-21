import { ArrowRight, Bookmark, Building2, Heart, ShieldCheck } from 'lucide-react';
import Button from '../common/Button';

export default function SchemeCard({
  title = 'Scheme information will appear here',
  department = 'Department information pending',
  description = 'A clear scheme summary will be displayed here once verified data is connected.',
  eligibilityScore = 0,
  category = 'General',
  benefits = 'Benefits details will be added later',
  saved = false,
  onSave,
  onView,
}) {
  return (
    <article className="card-surface rounded-2xl p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#1b8f5a]">{category}</p>
          <h3 className="text-xl font-semibold text-slate-900">{title}</h3>
        </div>
        <button
          type="button"
          onClick={onSave}
          className={`flex h-10 w-10 items-center justify-center rounded-full border ${
            saved ? 'border-[#1b8f5a] bg-[#eafaf2] text-[#1b8f5a]' : 'border-slate-200 bg-white text-slate-500'
          }`}
          aria-label={saved ? 'Remove scheme from saved list' : 'Save scheme'}
        >
          <Heart className="h-4 w-4" fill={saved ? 'currentColor' : 'none'} />
        </button>
      </div>

      <div className="mt-4 flex items-center gap-2 text-sm text-slate-600">
        <Building2 className="h-4 w-4 text-slate-500" />
        {department}
      </div>

      <p className="mt-4 text-sm leading-6 text-slate-600">{description}</p>

      <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-slate-600">
        <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1.5">
          <ShieldCheck className="h-3.5 w-3.5 text-[#1b8f5a]" />
          {eligibilityScore}/100 match indicator
        </span>
      </div>

      <div className="mt-4 rounded-xl bg-slate-50 px-3 py-2 text-sm text-slate-600">
        <span className="font-medium text-slate-800">Potential benefits:</span> {benefits}
      </div>

      <div className="mt-5 flex items-center justify-between gap-3">
        <Button variant="outline" size="sm" className="gap-2" onClick={onView}>
          View details
          <ArrowRight className="h-4 w-4" />
        </Button>
        <Button variant="secondary" size="sm" className="gap-2" onClick={onSave}>
          <Bookmark className="h-4 w-4" />
          {saved ? 'Saved' : 'Save'}
        </Button>
      </div>
    </article>
  );
}