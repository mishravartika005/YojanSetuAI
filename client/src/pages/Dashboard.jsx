import { useState, useEffect, useMemo } from 'react';
import { ArrowRight, Bookmark, BriefcaseBusiness, ClipboardList, FileText, Info, Sparkles, Volume2, Square } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../components/common/Button';
import EmptyState from '../components/common/EmptyState';
import Sidebar from '../components/layout/Sidebar';
import SchemeCard from '../components/schemes/SchemeCard';
import useAuth from '../hooks/useAuth';
import { getRecommendations, saveScheme, deleteSavedScheme } from '../services/schemeService';
import { getSavedSchemes } from '../services/userService';
import { getApplications } from '../services/applicationService';
import { useLanguage } from '../context/LanguageContext';
import { queryNavigator } from '../services/aiService';
import { speakText, stopSpeech } from '../utils/speech';

const CATEGORIES = [
  { id: 'agriculture', labelKey: 'catAgriculture', icon: '🌾' },
  { id: 'education', labelKey: 'catEducation', icon: '🎓' },
  { id: 'housing', labelKey: 'catHousing', icon: '🏠' },
  { id: 'employment', labelKey: 'catEmployment', icon: '💼' },
  { id: 'women', labelKey: 'catWomen', icon: '👩' },
  { id: 'healthcare', labelKey: 'catHealthcare', icon: '🏥' },
  { id: 'business', labelKey: 'catBusiness', icon: '🏪' },
  { id: 'disability', labelKey: 'catDisability', icon: '♿' },
];

export default function Dashboard() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const [recommended, setRecommended] = useState([]);
  const [saved, setSaved] = useState([]);
  const [savedSchemeIds, setSavedSchemeIds] = useState(new Set());
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Navigator state
  const [navigatorActive, setNavigatorActive] = useState(false);
  const [navigatorCategory, setNavigatorCategory] = useState(null);
  const [navigatorTextNeed, setNavigatorTextNeed] = useState('');
  const [navigatorResults, setNavigatorResults] = useState([]);
  const [navigatorLoading, setNavigatorLoading] = useState(false);
  const [navigatorError, setNavigatorError] = useState('');
  const [navigatorSpeaking, setNavigatorSpeaking] = useState(false);

  useEffect(() => {
    return () => {
      stopSpeech();
    };
  }, []);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/login');
    }
  }, [isLoading, isAuthenticated, navigate]);

  const loadDashboardData = async () => {
    if (!isAuthenticated) return;
    setLoading(true);
    try {
      const [recRes, savedRes, appRes] = await Promise.all([
        getRecommendations(),
        getSavedSchemes(),
        getApplications(),
      ]);

      setRecommended(recRes.data?.recommendations || []);
      
      const savedList = savedRes.data?.schemes || [];
      setSaved(savedList);
      setSavedSchemeIds(new Set(savedList.map((s) => s._id || s.id)));

      setApplications(appRes.data?.applications || []);
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
      setError('Failed to load dashboard summaries.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, [isAuthenticated]);

  const profileCompletion = useMemo(() => {
    if (!user) return 0;
    const fields = ['name', 'age', 'gender', 'state', 'district', 'annualIncome', 'occupation', 'category'];
    const filled = fields.filter((f) => user[f] !== undefined && user[f] !== null && user[f] !== '').length;
    return Math.round((filled / fields.length) * 100);
  }, [user]);

  const handleSaveToggle = async (scheme) => {
    const schemeId = scheme._id || scheme.id;
    const isAlreadySaved = savedSchemeIds.has(schemeId);
    try {
      if (isAlreadySaved) {
        await deleteSavedScheme(schemeId);
        setSavedSchemeIds((prev) => {
          const next = new Set(prev);
          next.delete(schemeId);
          return next;
        });
      } else {
        await saveScheme(schemeId);
        setSavedSchemeIds((prev) => {
          const next = new Set(prev);
          next.add(schemeId);
          return next;
        });
      }
      // Refresh saved list
      const savedRes = await getSavedSchemes();
      setSaved(savedRes.data?.schemes || []);
    } catch (err) {
      console.error('Failed to toggle save:', err);
    }
  };

  if (isLoading || loading) {
    return (
      <div className="flex gap-8">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center min-h-[400px]">
          <div className="text-slate-600 font-medium">{t('loadingDashboard')}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-8">
      <Sidebar />

      <div className="flex-1 space-y-6">
        <section className="card-surface rounded-[28px] p-6 md:p-8">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#1b8f5a]">
                {t('welcomeUser', { name: user?.name || t('citizen') })}
              </p>
              <h1 className="mt-2 text-3xl font-bold text-slate-900">{t('citizenDashboard')}</h1>
            </div>
            <Link to="/schemes">
              <Button className="gap-2">
                {t('findSchemes')}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </section>

        {error ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-[#ef4444]">
            {error === 'Failed to load dashboard summaries.' ? t('errorDashboard') : error}
          </div>
        ) : null}

        <section className="card-surface rounded-[28px] p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">{t('profileCompletion')}</p>
              <h2 className="mt-2 text-2xl font-bold text-slate-900">{profileCompletion}% {t('completeText')}</h2>
            </div>
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#eafaf2] text-lg font-bold text-[#1b8f5a]">
              {profileCompletion}%
            </div>
          </div>
          <div className="mt-6 h-3 w-full overflow-hidden rounded-full bg-slate-200">
            <div className="h-full rounded-full bg-[#1b8f5a]" style={{ width: `${profileCompletion}%` }} />
          </div>
          <div className="mt-4 text-sm text-slate-600">
            {profileCompletion < 100 ? (
              <Link to="/profile" className="text-[#0b3b72] hover:underline font-semibold">
                {t('profileIncompleteNote')}
              </Link>
            ) : (
              t('profileCompleteNote')
            )}
          </div>
        </section>

        <section className="card-surface rounded-[28px] p-6">
          <div className="mb-4 flex items-center gap-3">
            <BriefcaseBusiness className="h-5 w-5 text-[#0b3b72]" />
            <h2 className="text-xl font-semibold text-slate-900">{t('recommendedSchemes')}</h2>
          </div>
          {recommended.length ? (
            <div className="space-y-4">
              <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {recommended.slice(0, 3).map((rec) => (
                  <SchemeCard
                    key={rec.scheme?._id || rec.scheme?.id}
                    title={rec.scheme?.name}
                    department={rec.scheme?.ministry}
                    description={rec.scheme?.shortDescription}
                    eligibilityScore={rec.score}
                    category={rec.scheme?.category}
                    benefits={rec.scheme?.benefits?.join(', ')}
                    saved={savedSchemeIds.has(rec.scheme?._id || rec.scheme?.id)}
                    status={rec.status}
                    statusLabel={rec.statusLabel}
                    matchedCriteria={rec.matchedCriteria}
                    unmatchedCriteria={rec.unmatchedCriteria}
                    missingCriteria={rec.missingCriteria}
                    showWhyThisSchemeButton={true}
                    onSave={() => handleSaveToggle(rec.scheme)}
                    onView={() => navigate(`/schemes/${rec.scheme?._id || rec.scheme?.id}`)}
                  />
                ))}
              </div>
              {recommended.length > 3 && (
                <Link to="/schemes" className="block text-center text-sm font-semibold text-[#0b3b72] hover:underline pt-2">
                  {t('viewAllRecommendations', { count: recommended.length })}
                </Link>
              )}
            </div>
          ) : (
            <EmptyState
              icon={BriefcaseBusiness}
              title={t('noRecsTitle')}
              description={t('noRecsDesc')}
            />
          )}
        </section>

        <section className="card-surface rounded-[28px] p-6 md:p-8 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                <span>{t('iNeedHelpWithTitle')}</span>
              </h2>
              <p className="text-sm text-slate-500 mt-1">{t('iNeedHelpWithSubtitle')}</p>
            </div>
            
            <button
              type="button"
              onClick={() => {
                const textToRead = `${t('iNeedHelpWithTitle')}. ${t('iNeedHelpWithSubtitle')}`;
                if (navigatorSpeaking) {
                  stopSpeech();
                  setNavigatorSpeaking(false);
                } else {
                  setNavigatorSpeaking(true);
                  speakText(
                    textToRead,
                    language,
                    () => setNavigatorSpeaking(true),
                    () => setNavigatorSpeaking(false),
                    () => setNavigatorSpeaking(false)
                  );
                }
              }}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-[#1b8f5a]"
              aria-label="Read navigator introduction aloud"
            >
              {navigatorSpeaking ? (
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

          <form
            onSubmit={async (e) => {
              e.preventDefault();
              setNavigatorLoading(true);
              setNavigatorError('');
              setNavigatorActive(true);
              try {
                const res = await queryNavigator(navigatorTextNeed, navigatorCategory);
                if (res.success && res.data?.recommendations) {
                  setNavigatorResults(res.data.recommendations);
                } else {
                  setNavigatorError(t('errorDashboard'));
                }
              } catch (err) {
                console.error(err);
                setNavigatorError(t('errorDashboard'));
              } finally {
                setNavigatorLoading(false);
              }
            }}
            className="space-y-4"
          >
            <label className="block text-sm font-medium text-slate-700">
              <span className="mb-2 block font-semibold text-slate-800">{t('whatDoYouNeedHelpWith')}</span>
              <input
                type="text"
                value={navigatorTextNeed}
                onChange={(e) => setNavigatorTextNeed(e.target.value)}
                placeholder={t('whatDoYouNeedPlaceholder')}
                className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 focus:border-sky-500 focus:outline-none focus:ring-4 focus:ring-sky-100"
              />
            </label>

            <div>
              <span className="mb-3 block text-xs font-semibold uppercase tracking-[0.1em] text-slate-500">Quick Categories</span>
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
                {CATEGORIES.map((cat) => {
                  const isSelected = navigatorCategory === cat.id;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => {
                        setNavigatorCategory(isSelected ? null : cat.id);
                      }}
                      className={`flex flex-col items-center justify-center p-4 rounded-2xl border transition shadow-sm hover:shadow focus:outline-none focus:ring-2 focus:ring-[#1b8f5a] text-center ${
                        isSelected 
                          ? 'border-[#1b8f5a] bg-emerald-50 text-[#1b8f5a] ring-2 ring-[#1b8f5a]' 
                          : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <span className="text-2xl mb-1.5" role="img" aria-hidden="true">{cat.icon}</span>
                      <span className="text-[11px] font-semibold text-slate-800 leading-tight">{t(cat.labelKey)}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              {navigatorActive && (
                <Button 
                  variant="outline"
                  type="button" 
                  onClick={() => {
                    setNavigatorCategory(null);
                    setNavigatorActive(false);
                    setNavigatorResults([]);
                    setNavigatorTextNeed('');
                    setNavigatorError('');
                    stopSpeech();
                  }}
                >
                  Clear Search
                </Button>
              )}
              <Button type="submit" disabled={navigatorLoading}>
                {navigatorLoading ? t('loading') : t('findRelevantSchemesBtn')}
              </Button>
            </div>
          </form>

          {navigatorLoading && (
            <div className="text-center py-6 text-sm text-slate-600 font-medium">
              {t('loading')}
            </div>
          )}

          {navigatorError && (
            <div className="rounded-xl bg-red-50 p-4 border border-red-200 text-sm text-red-600">
              {navigatorError}
            </div>
          )}

          {navigatorActive && !navigatorLoading && !navigatorError && (
            <div className="space-y-4 pt-4 border-t border-slate-100">
              {navigatorResults.length > 0 ? (
                <>
                  <h3 className="text-lg font-bold text-slate-900">{t('relevantSchemesForYou')}</h3>
                  <div className="grid gap-5 md:grid-cols-2">
                    {navigatorResults.map((rec) => (
                      <SchemeCard
                        key={rec.scheme?._id || rec.scheme?.id}
                        title={rec.scheme?.name}
                        department={rec.scheme?.ministry}
                        description={rec.scheme?.shortDescription}
                        eligibilityScore={rec.score}
                        category={rec.scheme?.category}
                        benefits={rec.scheme?.benefits?.join(', ')}
                        saved={savedSchemeIds.has(rec.scheme?._id || rec.scheme?.id)}
                        status={rec.status}
                        statusLabel={rec.statusLabel}
                        matchedCriteria={rec.matchedCriteria}
                        unmatchedCriteria={rec.unmatchedCriteria}
                        missingCriteria={rec.missingCriteria}
                        showWhyThisSchemeButton={true}
                        onSave={() => handleSaveToggle(rec.scheme)}
                        onView={() => navigate(`/schemes/${rec.scheme?._id || rec.scheme?.id}`)}
                      />
                    ))}
                  </div>
                </>
              ) : (
                <div className="text-center py-6 space-y-4">
                  <p className="text-base font-bold text-slate-800">{t('noMatchingSchemesFound')}</p>
                  <p className="text-sm text-slate-500">{t('noMatchingSchemesDesc')}</p>
                  <div className="flex gap-3 justify-center">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => {
                        setNavigatorCategory(null);
                        setNavigatorActive(false);
                        setNavigatorResults([]);
                        setNavigatorTextNeed('');
                        setNavigatorError('');
                      }}
                    >
                      {t('tryAnotherCategory')}
                    </Button>
                    <Button 
                      size="sm" 
                      onClick={() => navigate('/schemes')}
                    >
                      {t('searchAllSchemes')}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </section>

        <section className="card-surface rounded-[28px] p-6">
          <div className="mb-4 flex items-center gap-3">
            <ClipboardList className="h-5 w-5 text-[#0b3b72]" />
            <h2 className="text-xl font-semibold text-slate-900">{t('applicationStatus')}</h2>
          </div>
          {applications.length ? (
            <div className="space-y-3">
              {applications.slice(0, 3).map((app) => (
                <div key={app._id || app.id} className="flex justify-between items-center border border-slate-200 rounded-xl bg-slate-50 p-3.5">
                  <div>
                    <h4 className="font-semibold text-slate-900 text-sm">{app.scheme?.name}</h4>
                    <p className="text-xs text-slate-500 mt-1">{t('applied')}: {app.appliedAt ? new Date(app.appliedAt).toLocaleDateString() : 'N/A'}</p>
                  </div>
                  <span className="inline-flex rounded-full bg-sky-100 text-[#0b3b72] px-2.5 py-1 text-xs font-semibold uppercase">
                    {app.status}
                  </span>
                </div>
              ))}
              {applications.length > 3 && (
                <Link to="/applications" className="block text-center text-sm font-semibold text-[#0b3b72] hover:underline mt-2">
                  {t('viewAllApplications', { count: applications.length })}
                </Link>
              )}
            </div>
          ) : (
            <EmptyState
              icon={FileText}
              title={t('noAppsTitle')}
              description={t('noAppsDesc')}
            />
          )}
        </section>

        <section className="card-surface rounded-[28px] p-6">
          <div className="mb-4 flex items-center gap-3">
            <Info className="h-5 w-5 text-[#0b3b72]" />
            <h2 className="text-xl font-semibold text-slate-900">{t('helpfulInformation')}</h2>
          </div>
          <ul className="space-y-3 text-sm leading-6 text-slate-600">
            <li>• {t('helpInfo1')}</li>
            <li>• {t('helpInfo2')}</li>
            <li>• {t('helpInfo3')}</li>
          </ul>
        </section>
      </div>
    </div>
  );
}