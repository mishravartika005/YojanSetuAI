import { useState, useEffect } from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/common/Button';
import EmptyState from '../components/common/EmptyState';
import SchemeList from '../components/schemes/SchemeList';
import { listSchemes, searchSchemes, saveScheme, deleteSavedScheme } from '../services/schemeService';
import { getSavedSchemes } from '../services/userService';
import useAuth from '../hooks/useAuth';
import { useLanguage } from '../context/LanguageContext';

export default function SchemeFinder() {
  const { t } = useLanguage();
  const [schemes, setSchemes] = useState([]);
  const [savedSchemeIds, setSavedSchemeIds] = useState(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedIncome, setSelectedIncome] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const loadSchemes = async () => {
    setLoading(true);
    setError('');
    try {
      let fetchedSchemes = [];
      const filters = {};
      if (selectedState) filters.state = selectedState;
      if (selectedCategory) filters.category = selectedCategory.toLowerCase();

      if (searchQuery.trim()) {
        const response = await searchSchemes(searchQuery.trim(), filters);
        fetchedSchemes = response.data?.schemes || [];
      } else {
        const response = await listSchemes(filters);
        fetchedSchemes = response.data?.schemes || [];
      }

      if (selectedIncome) {
        fetchedSchemes = fetchedSchemes.filter((s) => {
          if (!s.incomeLimit) return true;
          if (selectedIncome === 'Below ₹3L') {
            return s.incomeLimit <= 300000;
          } else if (selectedIncome === '₹3L to ₹8L') {
            return s.incomeLimit > 300000 && s.incomeLimit <= 800000;
          }
          return true;
        });
      }

      setSchemes(fetchedSchemes);

      if (isAuthenticated) {
        const savedResponse = await getSavedSchemes();
        const savedIds = new Set((savedResponse.data?.schemes || []).map((s) => s._id || s.id));
        setSavedSchemeIds(savedIds);
      }
    } catch (err) {
      console.error('Failed to load schemes:', err);
      setError('Failed to fetch schemes. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSchemes();
  }, [selectedState, selectedCategory, selectedIncome]);

  const handleSearchClick = (e) => {
    if (e) e.preventDefault();
    loadSchemes();
  };

  const handleSaveToggle = async (scheme) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    const schemeId = scheme._id || scheme.id;
    const isSaved = savedSchemeIds.has(schemeId);
    try {
      if (isSaved) {
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
    } catch (err) {
      console.error('Failed to toggle save status:', err);
    }
  };

  return (
    <div className="space-y-6">
      <section className="card-surface rounded-[28px] p-6 md:p-8">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#0b3b72] text-white">
            <Search className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#1b8f5a]">{t('search')}</p>
            <h1 className="text-3xl font-bold text-slate-900">{t('schemeFinderTitle')}</h1>
          </div>
        </div>

        <form onSubmit={handleSearchClick} className="grid gap-4 md:grid-cols-2 xl:grid-cols-6">
          <div className="xl:col-span-2">
            <label className="block text-sm font-medium text-slate-700">
              <span className="mb-2 block">{t('searchSchemesLabel')}</span>
              <input
                className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 shadow-sm focus:border-sky-500 focus:outline-none focus:ring-4 focus:ring-sky-100"
                placeholder={t('searchPlaceholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </label>
          </div>
          <label className="block text-sm font-medium text-slate-700">
            <span className="mb-2 block">{t('state')}</span>
            <select
              className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800"
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
            >
              <option value="">{t('all')}</option>
              <option value="Karnataka">Karnataka</option>
              <option value="Delhi">Delhi</option>
              <option value="Uttar Pradesh">Uttar Pradesh</option>
              <option value="Maharashtra">Maharashtra</option>
            </select>
          </label>
          <label className="block text-sm font-medium text-slate-700">
            <span className="mb-2 block">{t('category')}</span>
            <select
              className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="">{t('all')}</option>
              <option value="Education">Education</option>
              <option value="Women">Women</option>
              <option value="Farmers">Farmers</option>
              <option value="Agriculture">Agriculture</option>
              <option value="Housing">Housing</option>
              <option value="Business">Business</option>
              <option value="General">General</option>
            </select>
          </label>
          <label className="block text-sm font-medium text-slate-700">
            <span className="mb-2 block">{t('incomeRange')}</span>
            <select
              className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800"
              value={selectedIncome}
              onChange={(e) => setSelectedIncome(e.target.value)}
            >
              <option value="">{t('all')}</option>
              <option value="Below ₹3L">Below ₹3L</option>
              <option value="₹3L to ₹8L">₹3L to ₹8L</option>
            </select>
          </label>
          <div className="flex items-end">
            <Button className="w-full justify-center gap-2" type="submit">
              <SlidersHorizontal className="h-4 w-4" />
              {t('searchSchemesBtn')}
            </Button>
          </div>
        </form>
      </section>

      <section>
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <span className="text-slate-600">{t('loadingVerifiedSchemes')}</span>
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-center text-red-600">
            {error === 'Failed to fetch schemes. Please try again.' ? t('profileLoadError') : error}
          </div>
        ) : (
          <SchemeList
            schemes={schemes.map((s) => ({
              ...s,
              saved: savedSchemeIds.has(s._id || s.id),
              onSave: () => handleSaveToggle(s),
              onView: () => navigate(`/schemes/${s._id || s.id}`),
            }))}
          />
        )}
      </section>
    </div>
  );
}