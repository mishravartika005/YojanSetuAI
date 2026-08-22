import { useState, useEffect } from 'react';
import { UserRound } from 'lucide-react';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Sidebar from '../components/layout/Sidebar';
import { getProfile, updateProfile } from '../services/userService';
import { useLanguage } from '../context/LanguageContext';

const selectBase = 'w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800';

export default function Profile() {
  const { t } = useLanguage();
  const [profile, setProfile] = useState({
    name: '',
    age: '',
    gender: '',
    state: '',
    district: '',
    occupation: '',
    annualIncome: '',
    category: '',
    ruralUrban: '',
    disability: '',
    studentStatus: '',
    employmentStatus: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    async function loadProfile() {
      try {
        const response = await getProfile();
        if (response.success && response.data?.user) {
          const user = response.data.user;
          setProfile({
            name: user.name || '',
            age: user.age !== undefined && user.age !== null ? user.age : '',
            gender: user.gender || '',
            state: user.state || '',
            district: user.district || '',
            occupation: user.occupation || '',
            annualIncome: user.annualIncome !== undefined && user.annualIncome !== null ? user.annualIncome : '',
            category: user.category || '',
            ruralUrban: '',
            disability: '',
            studentStatus: '',
            employmentStatus: '',
          });
        }
      } catch (err) {
        console.error('Failed to load profile:', err);
        setError('Failed to load profile. Please try again.');
      } finally {
        setLoading(false);
      }
    }
    loadProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (name, value) => {
    setProfile((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSaving(true);
    try {
      const payload = {
        name: profile.name,
        age: profile.age !== '' ? Number(profile.age) : null,
        gender: profile.gender || null,
        state: profile.state || null,
        district: profile.district || null,
        occupation: profile.occupation || null,
        annualIncome: profile.annualIncome !== '' ? Number(profile.annualIncome) : null,
        category: profile.category || null,
      };
      const response = await updateProfile(payload);
      if (response.success) {
        setSuccess(t('profileUpdatedSuccess'));
      }
    } catch (err) {
      console.error('Failed to update profile:', err);
      setError(err.response?.data?.message || err.message || t('profileLoadError'));
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    window.location.reload();
  };

  if (loading) {
    return (
      <div className="flex gap-8">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center min-h-[400px]">
          <div className="text-slate-600 font-medium">{t('loadingProfile')}</div>
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
              <UserRound className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#1b8f5a]">{t('citizenProfile')}</p>
              <h1 className="text-3xl font-bold text-slate-900">{t('yourDetails')}</h1>
            </div>
          </div>

          {error ? (
            <div className="mb-4 rounded-xl bg-red-50 p-3.5 text-sm text-red-600 border border-red-200">
              {error === 'Failed to load profile. Please try again.' ? t('profileLoadError') : error}
            </div>
          ) : null}

          {success ? (
            <div className="mb-4 rounded-xl bg-emerald-50 p-3.5 text-sm text-emerald-600 border border-emerald-200">
              {success}
            </div>
          ) : null}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              <Input
                label={t('name')}
                name="name"
                value={profile.name}
                onChange={handleChange}
                placeholder="Enter your name"
                required
                disabled={saving}
              />
              <Input
                label={t('age')}
                name="age"
                type="number"
                value={profile.age}
                onChange={handleChange}
                placeholder="25"
                disabled={saving}
              />
              <label className="block text-sm font-medium text-slate-700">
                <span className="mb-2 block">{t('gender')}</span>
                <select
                  className={selectBase}
                  value={profile.gender}
                  onChange={(e) => handleSelectChange('gender', e.target.value)}
                  disabled={saving}
                >
                  <option value="" disabled>{t('selectGender')}</option>
                  <option value="female">{t('female')}</option>
                  <option value="male">{t('male')}</option>
                  <option value="other">{t('other')}</option>
                  <option value="prefer_not_to_say">{t('preferNotToSay')}</option>
                </select>
              </label>
              <label className="block text-sm font-medium text-slate-700">
                <span className="mb-2 block">{t('state')}</span>
                <select
                  className={selectBase}
                  value={profile.state}
                  onChange={(e) => handleSelectChange('state', e.target.value)}
                  disabled={saving}
                >
                  <option value="" disabled>{t('selectState')}</option>
                  <option value="Karnataka">Karnataka</option>
                  <option value="Maharashtra">Maharashtra</option>
                  <option value="Delhi">Delhi</option>
                  <option value="Uttar Pradesh">Uttar Pradesh</option>
                </select>
              </label>
              <Input
                label={t('district')}
                name="district"
                value={profile.district}
                onChange={handleChange}
                placeholder="Enter district"
                disabled={saving}
              />
            </section>

            <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              <Input
                label={t('annualIncome')}
                name="annualIncome"
                type="number"
                value={profile.annualIncome}
                onChange={handleChange}
                placeholder="500000"
                disabled={saving}
              />
              <label className="block text-sm font-medium text-slate-700">
                <span className="mb-2 block">{t('category')}</span>
                <select
                  className={selectBase}
                  value={profile.category}
                  onChange={(e) => handleSelectChange('category', e.target.value)}
                  disabled={saving}
                >
                  <option value="" disabled>{t('selectCategory')}</option>
                  <option value="general">{t('generalCategory')}</option>
                  <option value="obc">{t('obcCategory')}</option>
                  <option value="sc">{t('scCategory')}</option>
                  <option value="st">{t('stCategory')}</option>
                  <option value="other">{t('other')}</option>
                </select>
              </label>
              <label className="block text-sm font-medium text-slate-700">
                <span className="mb-2 block">{t('ruralUrban')}</span>
                <select
                  className={selectBase}
                  value={profile.ruralUrban}
                  onChange={(e) => handleSelectChange('ruralUrban', e.target.value)}
                  disabled={saving}
                >
                  <option value="" disabled>{t('selectRuralUrban')}</option>
                  <option value="rural">{t('rural')}</option>
                  <option value="urban">{t('urban')}</option>
                </select>
              </label>
              <label className="block text-sm font-medium text-slate-700">
                <span className="mb-2 block">{t('disabilityStatus')}</span>
                <select
                  className={selectBase}
                  value={profile.disability}
                  onChange={(e) => handleSelectChange('disability', e.target.value)}
                  disabled={saving}
                >
                  <option value="" disabled>{t('selectDisability')}</option>
                  <option value="none">{t('no')}</option>
                  <option value="yes">{t('yes')}</option>
                </select>
              </label>
              <label className="block text-sm font-medium text-slate-700">
                <span className="mb-2 block">{t('studentStatus')}</span>
                <select
                  className={selectBase}
                  value={profile.studentStatus}
                  onChange={(e) => handleSelectChange('studentStatus', e.target.value)}
                  disabled={saving}
                >
                  <option value="" disabled>{t('selectStudent')}</option>
                  <option value="no">{t('no')}</option>
                  <option value="yes">{t('yes')}</option>
                </select>
              </label>
              <label className="block text-sm font-medium text-slate-700">
                <span className="mb-2 block">{t('employmentStatus')}</span>
                <select
                  className={selectBase}
                  value={profile.employmentStatus}
                  onChange={(e) => handleSelectChange('employmentStatus', e.target.value)}
                  disabled={saving}
                >
                  <option value="" disabled>{t('selectEmployment')}</option>
                  <option value="employed">{t('employed')}</option>
                  <option value="unemployed">{t('unemployed')}</option>
                  <option value="self-employed">{t('selfEmployed')}</option>
                  <option value="student">{t('student')}</option>
                </select>
              </label>
            </section>

            <div className="flex flex-wrap gap-3 pt-2">
              <Button type="submit" disabled={saving}>
                {saving ? t('savingProfile') : t('saveProfile')}
              </Button>
              <Button variant="outline" type="button" onClick={handleReset} disabled={saving}>
                {t('resetBtn')}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}