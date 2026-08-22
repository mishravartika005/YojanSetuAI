import { useState, useEffect } from 'react';
import { CircleDashed, ClipboardList, FileCheck2, FileX2, Hourglass, ShieldCheck, Edit, Trash2, Plus } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import EmptyState from '../components/common/EmptyState';
import { getApplications, updateApplication, deleteApplication } from '../services/applicationService';
import useAuth from '../hooks/useAuth';
import { useLanguage } from '../context/LanguageContext';

const selectBase = 'w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800';

const ALLOWED_STATUSES = [
  { value: 'interested', label: 'Interested' },
  { value: 'saved', label: 'Saved' },
  { value: 'applied', label: 'Applied' },
  { value: 'under_review', label: 'Under Review' },
  { value: 'approved', label: 'Approved' },
  { value: 'rejected', label: 'Rejected' },
  { value: 'completed', label: 'Completed' },
];

export default function Applications() {
  const { isAuthenticated, isLoading } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [selectedApp, setSelectedApp] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editStatus, setEditStatus] = useState('');
  const [editNotes, setEditNotes] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/login');
    }
  }, [isLoading, isAuthenticated, navigate]);

  const loadApplications = async () => {
    if (!isAuthenticated) return;
    setLoading(true);
    setError('');
    try {
      const response = await getApplications();
      setApplications(response.data?.applications || []);
    } catch (err) {
      console.error('Failed to fetch applications:', err);
      setError('Failed to fetch application records.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadApplications();
  }, [isAuthenticated]);

  const handleEditClick = (app) => {
    setSelectedApp(app);
    setEditStatus(app.status);
    setEditNotes(app.notes || '');
    setModalOpen(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!selectedApp) return;
    setActionLoading(true);
    try {
      const appId = selectedApp._id || selectedApp.id;
      const response = await updateApplication(appId, {
        status: editStatus,
        notes: editNotes,
      });
      if (response.success) {
        setModalOpen(false);
        loadApplications();
      }
    } catch (err) {
      console.error('Failed to update application:', err);
      setError('Failed to update application status.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (appId) => {
    if (!window.confirm(t('deleteAppConfirm'))) return;
    try {
      await deleteApplication(appId);
      setApplications((prev) => prev.filter((a) => (a._id || a.id) !== appId));
    } catch (err) {
      console.error('Failed to delete application:', err);
    }
  };

  if (isLoading || loading) {
    return (
      <div className="flex gap-8">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center min-h-[400px]">
          <div className="text-slate-600 font-medium">{t('loadingApplications')}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-8">
      <Sidebar />

      <div className="flex-1">
        <div className="card-surface rounded-[28px] p-6 md:p-8">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#1b8f5a]">{t('applications')}</p>
              <h1 className="mt-2 text-3xl font-bold text-slate-900">{t('applicationTrackingTitle')}</h1>
            </div>
            <Link to="/schemes">
              <Button size="sm" className="gap-2">
                <Plus className="h-4 w-4" />
                {t('newApplication')}
              </Button>
            </Link>
          </div>

          {error ? (
            <div className="mb-4 rounded-xl bg-red-50 p-3.5 text-sm text-red-600 border border-red-200">
              {error === 'Failed to fetch application records.' ? t('profileLoadError') : error}
            </div>
          ) : null}

          {applications.length ? (
            <div className="space-y-4">
              {applications.map((app) => (
                <div key={app._id || app.id} className="border border-slate-200 rounded-2xl bg-white p-5 shadow-sm transition hover:shadow-md">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-bold text-slate-900">{app.scheme?.name || 'Unknown Scheme'}</h3>
                      <p className="text-xs text-slate-500 mt-1">{app.scheme?.ministry || t('ministryPending')}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="inline-flex rounded-full bg-sky-100 text-[#0b3b72] px-3 py-1.5 text-xs font-semibold uppercase tracking-wider">
                        {t(app.status)}
                      </span>
                      <Button variant="ghost" size="sm" className="p-2" onClick={() => handleEditClick(app)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="p-2 text-red-500 hover:text-red-700" onClick={() => handleDelete(app._id || app.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {app.notes ? (
                    <div className="mt-4 rounded-xl bg-slate-50 p-3 text-sm text-slate-600 border border-slate-100">
                      <span className="font-semibold text-slate-800">{t('notes')}:</span> {app.notes}
                    </div>
                  ) : null}

                  <div className="mt-4 flex flex-wrap gap-4 text-xs text-slate-500 border-t border-slate-100 pt-3">
                    {app.appliedAt ? (
                      <div>{t('appliedDate', { date: new Date(app.appliedAt).toLocaleDateString() })}</div>
                    ) : null}
                    <div>{t('lastUpdatedDate', { date: new Date(app.updatedAt).toLocaleDateString() })}</div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              icon={ClipboardList}
              title={t('noAppsTrackedTitle')}
              description={t('noAppsTrackedDesc')}
            />
          )}
        </div>
      </div>

      <Modal open={modalOpen} title={t('editApplicationStatus')} onClose={() => setModalOpen(false)}>
        <form onSubmit={handleUpdate} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">{t('status')}</label>
            <select
              className={selectBase}
              value={editStatus}
              onChange={(e) => setEditStatus(e.target.value)}
              disabled={actionLoading}
            >
              {ALLOWED_STATUSES.map((status) => (
                <option key={status.value} value={status.value}>
                  {t(status.value)}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">{t('notes')}</label>
            <textarea
              className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 shadow-sm focus:border-sky-500 focus:outline-none focus:ring-4 focus:ring-sky-100 min-h-[100px]"
              value={editNotes}
              onChange={(e) => setEditNotes(e.target.value)}
              placeholder={t('appNotesPlaceholder')}
              disabled={actionLoading}
            />
          </div>
          <div className="flex gap-3 justify-end pt-2">
            <Button variant="outline" type="button" onClick={() => setModalOpen(false)} disabled={actionLoading}>
              {t('cancel')}
            </Button>
            <Button type="submit" disabled={actionLoading}>
              {actionLoading ? t('savingProfile') : t('saveChanges')}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}