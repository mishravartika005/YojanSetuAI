import { useState, useEffect } from 'react';
import { ArrowLeft, Bookmark, Building2, CalendarClock, CheckCircle2, FileText, Link as LinkIcon, Volume2, Square } from 'lucide-react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import Button from '../components/common/Button';
import EligibilityScore from '../components/schemes/EligibilityScore';
import DocumentChecklist from '../components/schemes/DocumentChecklist';
import { getScheme, checkSavedSchemeStatus, saveScheme, deleteSavedScheme, getRecommendations } from '../services/schemeService';
import { createApplication, getApplications } from '../services/applicationService';
import useAuth from '../hooks/useAuth';
import { useLanguage } from '../context/LanguageContext';
import { askSchemeQuestion } from '../services/aiService';
import { speakText, stopSpeech } from '../utils/speech';

const getLocalizedCriterion = (criterion, t) => {
  const lower = criterion.toLowerCase();
  
  if (lower.includes('age criterion met') || lower.includes('age criterion: open') || lower.includes('age requirement met')) {
    return t('ageMatch') || 'Age matches';
  }
  if (lower.includes('income within limit') || lower.includes('income criterion: no')) {
    return t('incomeMatch') || 'Income matches';
  }
  if (lower.includes('location criterion') || lower.includes('state requirement met')) {
    return t('stateMatch') || 'State matches';
  }
  if (lower.includes('gender criterion: open') || lower.includes('gender requirement met')) {
    return t('genderMatch') || 'Gender matches';
  }
  if (lower.includes('social category: open') || lower.includes('social category requirement met')) {
    return t('categoryMatch') || 'Category matches';
  }
  if (lower.includes('occupation criterion: open') || lower.includes('occupation requirement met')) {
    return t('occupationMatch') || 'Occupation matches';
  }
  if (lower.includes('education criterion: open') || lower.includes('education requirement met')) {
    return t('educationMatch') || 'Education matches';
  }

  // Missing
  if (lower.includes('age not specified')) {
    return t('ageMissing') || 'Age details';
  }
  if (lower.includes('annual income not specified') || lower.includes('income ceiling')) {
    return t('incomeMissing') || 'Annual income details';
  }
  if (lower.includes('state not specified') || lower.includes('state-specific')) {
    return t('stateMissing') || 'State details';
  }
  if (lower.includes('gender not specified')) {
    return t('genderMissing') || 'Gender details';
  }
  if (lower.includes('social category not specified')) {
    return t('categoryMissing') || 'Social category details';
  }
  if (lower.includes('occupation not specified')) {
    return t('occupationMissing') || 'Occupation details';
  }
  if (lower.includes('education not specified')) {
    return t('educationMissing') || 'Education details';
  }

  // Failed
  if (lower.includes('age not in eligible range')) {
    return t('ageNotMatch') || 'Age does not match';
  }
  if (lower.includes('annual income exceeds')) {
    return t('incomeNotMatch') || 'Income exceeds limit';
  }
  if (lower.includes('gender-specific scheme')) {
    return t('genderNotMatch') || 'Gender does not match';
  }
  if (lower.includes('category-specific')) {
    return t('categoryNotMatch') || 'Category does not match';
  }
  if (lower.includes('occupation-specific')) {
    return t('occupationNotMatch') || 'Occupation does not match';
  }
  if (lower.includes('education-specific')) {
    return t('educationNotMatch') || 'Education does not match';
  }

  return criterion;
};

export default function SchemeDetails() {
  const { t, language } = useLanguage();
  const { schemeId } = useParams();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [scheme, setScheme] = useState(null);
  const [isSaved, setIsSaved] = useState(false);
  const [recommendation, setRecommendation] = useState(null);
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [applyError, setApplyError] = useState('');
  const [aiExplanation, setAiExplanation] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [speakingSection, setSpeakingSection] = useState(null);
  const [speechError, setSpeechError] = useState('');

  useEffect(() => {
    return () => {
      stopSpeech();
    };
  }, []);

  const handleReadAloud = (sectionId, text) => {
    if (speakingSection === sectionId) {
      stopSpeech();
      setSpeakingSection(null);
      return;
    }

    setSpeakingSection(sectionId);
    setSpeechError('');

    speakText(
      text,
      language,
      () => {
        setSpeakingSection(sectionId);
      },
      () => {
        setSpeakingSection(null);
      },
      (err) => {
        setSpeakingSection(null);
        if (err === 'not_supported') {
          setSpeechError(t('speechNotSupported'));
        } else {
          setSpeechError(t('speechVoiceUnavailable'));
        }
        setTimeout(() => setSpeechError(''), 4000);
      }
    );
  };

  const handleExplainEligibility = async () => {
    if (!scheme || !recommendation) return;
    setAiLoading(true);
    setAiExplanation('');
    try {
      const prompt = `Please explain why this scheme "${scheme.name}" is suitable or not suitable for me. 
Here is my eligibility status details:
- Match Status: ${recommendation.statusLabel} (Score: ${recommendation.score}%)
- Matched factors: ${recommendation.matchedCriteria?.map(c => getLocalizedCriterion(c, t)).join(', ') || 'None'}
- Missing factors: ${recommendation.missingCriteria?.map(c => getLocalizedCriterion(c, t)).join(', ') || 'None'}
- Failed factors: ${recommendation.unmatchedCriteria?.map(c => getLocalizedCriterion(c, t)).join(', ') || 'None'}
- Required Documents: ${scheme.requiredDocuments?.join(', ') || 'None'}

Please explain this in simple language, highlighting what fits, what is missing, and what documents I need to prepare. Avoid making unsupported eligibility claims. Always state that final eligibility is determined by the relevant government authority. Explain in the requested language.`;
      
      const response = await askSchemeQuestion(prompt);
      if (response.success && response.data?.message) {
        setAiExplanation(response.data.message);
      } else {
        setAiExplanation(t('chatError'));
      }
    } catch (err) {
      console.error(err);
      setAiExplanation(t('chatError'));
    } finally {
      setAiLoading(false);
    }
  };

  const loadData = async () => {
    setLoading(true);
    setError('');
    try {
      const detailResponse = await getScheme(schemeId);
      if (detailResponse.success && detailResponse.data?.scheme) {
        setScheme(detailResponse.data.scheme);
        if (detailResponse.data.eligibility) {
          setRecommendation(detailResponse.data.eligibility);
        }
      } else {
        setError('Scheme details not found.');
      }

      if (isAuthenticated) {
        try {
          const statusResponse = await checkSavedSchemeStatus(schemeId);
          setIsSaved(!!statusResponse.data?.saved);
        } catch (err) {
          console.error('Failed to check saved status:', err);
        }

        if (!detailResponse.data?.eligibility) {
          try {
            const recResponse = await getRecommendations();
            const recList = recResponse.data?.recommendations || [];
            const found = recList.find((r) => (r.scheme?._id || r.scheme?.id) === schemeId);
            if (found) {
              setRecommendation(found);
            }
          } catch (err) {
            console.error('Failed to fetch recommendations:', err);
          }
        }

        try {
          const appResponse = await getApplications();
          const appList = appResponse.data?.applications || [];
          const foundApp = appList.find((a) => (a.scheme?._id || a.scheme?.id) === schemeId);
          if (foundApp) {
            setApplication(foundApp);
          }
        } catch (err) {
          console.error('Failed to fetch applications:', err);
        }
      }
    } catch (err) {
      console.error('Failed to load scheme details:', err);
      setError(err.response?.data?.message || err.message || 'Failed to load details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [schemeId, isAuthenticated]);

  const handleSaveToggle = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    setActionLoading(true);
    try {
      if (isSaved) {
        await deleteSavedScheme(schemeId);
        setIsSaved(false);
      } else {
        await saveScheme(schemeId);
        setIsSaved(true);
      }
    } catch (err) {
      console.error('Failed to toggle save:', err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleApply = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    setApplyError('');

    const url = scheme.applicationUrl;
    const isValidUrl = (testUrl) => {
      if (!testUrl || typeof testUrl !== 'string') return false;
      try {
        const parsed = new URL(testUrl);
        return parsed.protocol === 'http:' || parsed.protocol === 'https:';
      } catch (e) {
        return false;
      }
    };

    if (!url || !isValidUrl(url)) {
      setApplyError(t('officialUrlUnavailable'));
      return;
    }

    // Open link in a new browser tab safely
    window.open(url, '_blank', 'noopener,noreferrer');

    setActionLoading(true);
    try {
      const response = await createApplication({
        schemeId,
        status: 'interested',
        notes: 'Application started on official portal.',
      });
      if (response.success && response.data?.application) {
        setApplication(response.data.application);
      }
    } catch (err) {
      console.error('Failed to create application:', err);
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-slate-600 font-medium">{t('loading')}</div>
      </div>
    );
  }

  if (error || !scheme) {
    return (
      <div className="max-w-2xl mx-auto py-12 text-center">
        <div className="mb-4 rounded-xl bg-red-50 p-4 text-red-600 border border-red-200">
          {error === 'Scheme details not found.' ? t('schemeNotFound') : error}
        </div>
        <Link to="/schemes" className="text-[#0b3b72] hover:underline font-semibold">
          {t('backToSchemes')}
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link to="/schemes" className="inline-flex items-center gap-2 text-sm font-medium text-[#0b3b72]">
          <ArrowLeft className="h-4 w-4" />
          {t('backToSchemes')}
        </Link>
        <Button variant="outline" className="gap-2" onClick={handleSaveToggle} disabled={actionLoading}>
          <Bookmark className="h-4 w-4" fill={isSaved ? 'currentColor' : 'none'} />
          {isSaved ? t('saved') : t('saveScheme')}
        </Button>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
        <section className="card-surface rounded-[28px] p-6 md:p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#1b8f5a]">
            {t('category')}: {scheme.category || 'General'}
          </p>
          <div className="mt-3 flex flex-wrap items-center justify-between gap-4">
            <h1 className="text-3xl font-bold text-slate-900">{scheme.name}</h1>
            <button
              type="button"
              onClick={() => handleReadAloud('scheme-info', `${scheme.name}. ${scheme.description || scheme.shortDescription}`)}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
              aria-label="Read this scheme description aloud"
            >
              {speakingSection === 'scheme-info' ? (
                <>
                  <Square className="h-3.5 w-3.5 text-red-500" />
                  {t('stopSpeech')}
                </>
              ) : (
                <>
                  <Volume2 className="h-3.5 w-3.5 text-slate-500" />
                  {t('readAloud')}
                </>
              )}
            </button>
          </div>
          {speechError && speakingSection === 'scheme-info' && (
            <p className="text-[11px] text-red-500 mt-1">{speechError}</p>
          )}

          <div className="mt-4 flex items-center gap-2 text-sm text-slate-600">
            <Building2 className="h-4 w-4 text-slate-500" />
            {scheme.ministry || t('ministryPending')}
          </div>
          <p className="mt-5 text-base leading-7 text-slate-600">
            {scheme.description || scheme.shortDescription}
          </p>

          <div className="mt-8 grid gap-5 md:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-center justify-between gap-2 mb-2">
                <p className="text-sm font-semibold uppercase tracking-[0.14em] text-slate-500">{t('eligibilityCriteria')}</p>
                <button
                  type="button"
                  onClick={() => handleReadAloud('eligibility', scheme.eligibility || 'Open to all.')}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2 py-0.5 text-[10px] font-semibold text-slate-700 shadow-sm hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
                  aria-label="Read eligibility criteria aloud"
                >
                  {speakingSection === 'eligibility' ? (
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
              </div>
              {speechError && speakingSection === 'eligibility' && (
                <p className="text-[10px] text-red-500 mb-1">{speechError}</p>
              )}
              <p className="text-sm leading-6 text-slate-700">{scheme.eligibility || 'Open to all.'}</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm font-semibold uppercase tracking-[0.14em] text-slate-500">{t('benefitsDetails')}</p>
              <ul className="mt-2 space-y-1 text-sm text-slate-700 list-disc list-inside">
                {scheme.benefits && scheme.benefits.length ? (
                  scheme.benefits.map((b, i) => <li key={i}>{b}</li>)
                ) : (
                  <li>Welfare benefits under scheme rules</li>
                )}
              </ul>
            </div>
          </div>

          <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-5">
            <div className="mb-3 flex items-center justify-between gap-3 text-slate-900">
              <div className="flex items-center gap-2">
                <FileText className="h-4.5 w-4.5 text-sky-500" />
                <span className="font-semibold text-slate-800">{t('docsNeededTitle')}</span>
              </div>
              <button
                type="button"
                onClick={() => handleReadAloud('documents', scheme.requiredDocuments?.length > 0 ? scheme.requiredDocuments.join(', ') : t('noDocsAvailable'))}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2 py-0.5 text-[10px] font-semibold text-slate-700 shadow-sm hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
                aria-label="Read required documents aloud"
              >
                {speakingSection === 'documents' ? (
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
            </div>
            {speechError && speakingSection === 'documents' && (
              <p className="text-[10px] text-red-500 mb-2">{speechError}</p>
            )}
            {scheme.requiredDocuments && scheme.requiredDocuments.length > 0 ? (
              <ul className="list-disc pl-5 text-sm text-slate-600 space-y-2">
                {scheme.requiredDocuments.map((doc, idx) => (
                  <li key={idx}>{doc}</li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-slate-500 italic">
                {t('noDocsAvailable')}
              </p>
            )}
          </div>

          <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-4">
            <div className="mb-3 flex items-center gap-2 text-slate-900">
              <CalendarClock className="h-4 w-4" />
              <span className="font-semibold">{t('applicationProcess')}</span>
            </div>
            <p className="text-sm leading-6 text-slate-600">
              {scheme.applicationProcess || 'Apply online through official portals.'}
            </p>
          </div>
        </section>

        <aside className="space-y-6">
          {isAuthenticated ? (
            <div className="space-y-6">
              <EligibilityScore score={recommendation ? recommendation.score : 0} />
              
              {recommendation && (
                <div className="card-surface rounded-[28px] p-5 space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                    <span className="font-bold text-sm text-slate-800">{t('whyThisSchemeTitle')}</span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          const statusStr = t(recommendation.status === 'likely_match' ? 'likelyMatch' : recommendation.status === 'needs_more_info' ? 'needsMoreInfo' : 'notAMatch');
                          const text = `${t('whyThisSchemeTitle')}. ${statusStr}. Match score: ${recommendation.score}%. ` +
                            `Matched: ${recommendation.matchedCriteria?.map(c => getLocalizedCriterion(c, t)).join(', ') || ''}. ` +
                            `Missing: ${recommendation.missingCriteria?.map(c => getLocalizedCriterion(c, t)).join(', ') || ''}. ` +
                            `Failed: ${recommendation.unmatchedCriteria?.map(c => getLocalizedCriterion(c, t)).join(', ') || ''}`;
                          handleReadAloud('why-scheme', text);
                        }}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2 py-0.5 text-[10px] font-semibold text-slate-700 shadow-sm hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
                        aria-label="Read why this scheme explanation aloud"
                      >
                        {speakingSection === 'why-scheme' ? (
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
                      <span className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${
                        recommendation.status === 'likely_match' 
                          ? 'bg-emerald-100 text-emerald-800' 
                          : recommendation.status === 'needs_more_info'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-red-100 text-red-800'
                      }`}>
                        {t(recommendation.status === 'likely_match' 
                          ? 'likelyMatch' 
                          : recommendation.status === 'needs_more_info' 
                            ? 'needsMoreInfo' 
                            : 'notAMatch'
                        )}
                      </span>
                    </div>
                  </div>
                  {speechError && speakingSection === 'why-scheme' && (
                    <p className="text-[10px] text-red-500 mb-1">{speechError}</p>
                  )}

                  <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                    {recommendation.matchedCriteria && recommendation.matchedCriteria.length > 0 && (
                      <div className="space-y-1.5">
                        {recommendation.matchedCriteria.map((c, i) => (
                          <div key={`m-${i}`} className="text-xs text-emerald-800 bg-emerald-50 border border-emerald-100 p-2 rounded-xl flex items-start gap-2">
                            <span className="font-bold">✓</span>
                            <span>{getLocalizedCriterion(c, t)}</span>
                          </div>
                        ))}
                      </div>
                    )}
                    {recommendation.missingCriteria && recommendation.missingCriteria.length > 0 && (
                      <div className="space-y-1.5">
                        {recommendation.missingCriteria.map((c, i) => (
                          <div key={`mi-${i}`} className="text-xs text-amber-800 bg-amber-50 border border-amber-100 p-2 rounded-xl flex items-start gap-2">
                            <span className="font-bold">⚠</span>
                            <div>
                              <span className="font-semibold text-amber-900">{t('infoNeededTitle')} </span>
                              <span>{getLocalizedCriterion(c, t)}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                    {recommendation.unmatchedCriteria && recommendation.unmatchedCriteria.length > 0 && (
                      <div className="space-y-1.5">
                        {recommendation.unmatchedCriteria.map((c, i) => (
                          <div key={`u-${i}`} className="text-xs text-red-800 bg-red-50 border border-red-100 p-2 rounded-xl flex items-start gap-2">
                            <span className="font-bold">✕</span>
                            <span>{getLocalizedCriterion(c, t)}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="border-t border-slate-100 pt-3">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full justify-center gap-2"
                      onClick={handleExplainEligibility}
                      disabled={aiLoading}
                    >
                      {aiLoading ? t('loading') : t('explainToMeBtn')}
                    </Button>
                    {aiExplanation && (
                      <div className="mt-3 space-y-2 text-xs text-slate-700 bg-sky-50 border border-sky-100 p-3 rounded-xl">
                        <div className="flex justify-end">
                          <button
                            type="button"
                            onClick={() => handleReadAloud('ai-explanation', aiExplanation)}
                            className="inline-flex items-center gap-1 rounded bg-white border border-slate-200 px-1.5 py-0.5 text-[9px] font-bold text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-1 focus:ring-sky-500"
                            aria-label="Read AI explanation aloud"
                          >
                            {speakingSection === 'ai-explanation' ? (
                              <>
                                <Square className="h-2.5 w-2.5 text-red-500" />
                                {t('stopSpeech')}
                              </>
                            ) : (
                              <>
                                <Volume2 className="h-2.5 w-2.5 text-slate-500" />
                                {t('readAloud')}
                              </>
                            )}
                          </button>
                        </div>
                        {speechError && speakingSection === 'ai-explanation' && (
                          <p className="text-[10px] text-red-500 mb-1">{speechError}</p>
                        )}
                        <p className="whitespace-pre-line leading-relaxed">{aiExplanation}</p>
                      </div>
                    )}
                  </div>

                  <p className="text-[10px] text-slate-400 italic mt-2 border-t border-slate-50 pt-2">
                    {t('disclaimerNote')}
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="card-surface rounded-[28px] p-5 text-center">
              <p className="text-sm text-slate-500">{t('loginToViewScore')}</p>
              <Link to="/login" className="mt-2 inline-block text-sm text-[#0b3b72] hover:underline font-semibold">
                {t('login')}
              </Link>
            </div>
          )}

          {scheme.officialSource ? (
            <div className="card-surface rounded-[28px] p-5">
              <div className="mb-3 flex items-center gap-2 text-slate-900">
                <LinkIcon className="h-4 w-4" />
                <span className="font-semibold">{t('officialSource')}</span>
              </div>
              <a href={scheme.officialSource} target="_blank" rel="noopener noreferrer" className="text-sm text-[#0b3b72] hover:underline break-all">
                {scheme.officialSource}
              </a>
            </div>
          ) : null}

          <div className="card-surface rounded-[28px] p-5">
            <div className="mb-4 flex items-center gap-2 text-slate-900">
              <CheckCircle2 className="h-4 w-4 text-[#1b8f5a]" />
              <span className="font-semibold">{t('nextSteps')}</span>
            </div>
            <div className="space-y-3">
              {application ? (
                <div className="text-center p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800">
                  {t('status')}: <span className="uppercase text-[#0b3b72]">{t(application.status)}</span>
                </div>
              ) : (
                <Button className="w-full justify-center" onClick={handleApply} disabled={actionLoading}>
                  {actionLoading ? t('applying') : t('applyNow')}
                </Button>
              )}
              {applyError && (
                <div className="rounded-xl bg-red-50 p-3 text-xs text-red-600 border border-red-200 mt-2">
                  {applyError}
                </div>
              )}
              {application ? (
                <Link to="/applications">
                  <Button variant="outline" className="w-full justify-center mt-2">{t('viewApplication')}</Button>
                </Link>
              ) : null}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}