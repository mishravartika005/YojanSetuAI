import { ArrowRight, Bookmark, Building2, Heart, ShieldCheck } from 'lucide-react';
import Button from '../common/Button';
import { useLanguage } from '../../context/LanguageContext';

export default function SchemeCard({
  title = 'Scheme information will appear here',
  department = 'Department information pending',
  description = 'A clear scheme summary will be displayed here once verified data is connected.',
  eligibilityScore = 0,
  category = 'General',
  benefits = 'Benefits details will be added later',
  saved = false,
  status = null,
  statusLabel = null,
  matchedCriteria = [],
  unmatchedCriteria = [],
  missingCriteria = [],
  showWhyThisSchemeButton = false,
  onSave,
  onView,
}) {
  const { t } = useLanguage();
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
        <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1.5 font-medium">
          <ShieldCheck className="h-3.5 w-3.5 text-[#1b8f5a]" />
          {eligibilityScore}/100 {t('matchIndicator')}
        </span>
        {status && (
          <span className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${
            status === 'likely_match' 
              ? 'bg-emerald-100 text-emerald-800' 
              : status === 'needs_more_info'
                ? 'bg-amber-100 text-amber-800'
                : 'bg-red-100 text-red-800'
          }`}>
            {t(status === 'likely_match' 
              ? 'likelyMatch' 
              : status === 'needs_more_info' 
                ? 'needsMoreInfo' 
                : 'notAMatch'
            )}
          </span>
        )}
      </div>

      <div className="mt-4 rounded-xl bg-slate-50 px-3 py-2 text-sm text-slate-600">
        <span className="font-medium text-slate-800">{t('potentialBenefits')}</span> {benefits}
      </div>

      <div className="mt-5 flex items-center justify-between gap-3">
        {showWhyThisSchemeButton ? (
          <Button variant="outline" size="sm" className="gap-2" onClick={onView}>
            {t('whyThisSchemeBtn')}
            <ArrowRight className="h-4 w-4" />
          </Button>
        ) : (
          <Button variant="outline" size="sm" className="gap-2" onClick={onView}>
            {t('viewDetails')}
            <ArrowRight className="h-4 w-4" />
          </Button>
        )}
        <Button variant="secondary" size="sm" className="gap-2" onClick={onSave}>
          <Bookmark className="h-4 w-4" />
          {saved ? t('saved') : t('save')}
        </Button>
      </div>
    </article>
  );
}