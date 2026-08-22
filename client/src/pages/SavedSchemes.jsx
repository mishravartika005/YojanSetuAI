import { useState, useEffect } from 'react';
import { Bookmark, SearchX } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import EmptyState from '../components/common/EmptyState';
import Sidebar from '../components/layout/Sidebar';
import SchemeList from '../components/schemes/SchemeList';
import { getSavedSchemes } from '../services/userService';
import { deleteSavedScheme } from '../services/schemeService';
import useAuth from '../hooks/useAuth';
import { useLanguage } from '../context/LanguageContext';

export default function SavedSchemes() {
  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { isAuthenticated } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const loadSaved = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await getSavedSchemes();
      setSchemes(response.data?.schemes || []);
    } catch (err) {
      console.error('Failed to load saved schemes:', err);
      setError('Failed to fetch saved schemes.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadSaved();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated]);

  const handleUnsave = async (schemeId) => {
    try {
      await deleteSavedScheme(schemeId);
      setSchemes((prev) => prev.filter((s) => (s._id || s.id) !== schemeId));
    } catch (err) {
      console.error('Failed to delete saved scheme:', err);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="flex gap-8">
        <Sidebar />
        <div className="flex-1 flex flex-col items-center justify-center min-h-[400px]">
          <p className="text-slate-600 font-medium mb-4">{t('loginToViewSaved')}</p>
          <button onClick={() => navigate('/login')} className="bg-[#0b3b72] text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-[#0a2f5d]">
            {t('login')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-8">
      <Sidebar />

      <div className="flex-1">
        <div className="card-surface rounded-[28px] p-6 md:p-8">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#0b3b72] text-white">
              <Bookmark className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#1b8f5a]">{t('saved')}</p>
              <h1 className="text-3xl font-bold text-slate-900">{t('savedSchemes')}</h1>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <span className="text-slate-600">{t('loadingSaved')}</span>
            </div>
          ) : error ? (
            <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-center text-red-600">
              {error === 'Failed to fetch saved schemes.' ? t('profileLoadError') : error}
            </div>
          ) : schemes.length ? (
            <SchemeList
              schemes={schemes.map((s) => ({
                ...s,
                saved: true,
                onSave: () => handleUnsave(s._id || s.id),
                onView: () => navigate(`/schemes/${s._id || s.id}`),
              }))}
            />
          ) : (
            <EmptyState
              icon={SearchX}
              title={t('noSavedTitle')}
              description={t('noSavedDesc')}
            />
          )}
        </div>
      </div>
    </div>
  );
}