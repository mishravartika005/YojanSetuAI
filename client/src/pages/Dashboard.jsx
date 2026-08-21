import { ArrowRight, Bookmark, BriefcaseBusiness, ClipboardList, FileText, Info, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../components/common/Button';
import EmptyState from '../components/common/EmptyState';
import Sidebar from '../components/layout/Sidebar';

const recommended = [];
const saved = [];
const applications = [];

export default function Dashboard() {
  return (
    <div className="flex gap-8">
      <Sidebar />

      <div className="flex-1 space-y-6">
        <section className="card-surface rounded-[28px] p-6 md:p-8">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#1b8f5a]">Welcome</p>
              <h1 className="mt-2 text-3xl font-bold text-slate-900">Citizen dashboard</h1>
            </div>
            <Link to="/schemes">
              <Button className="gap-2">
                Find Schemes
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </section>

        <section className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="card-surface rounded-[28px] p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">Profile completion</p>
                <h2 className="mt-2 text-2xl font-bold text-slate-900">68% complete</h2>
              </div>
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#eafaf2] text-lg font-bold text-[#1b8f5a]">
                68%
              </div>
            </div>
            <div className="mt-6 h-3 w-full overflow-hidden rounded-full bg-slate-200">
              <div className="h-full w-[68%] rounded-full bg-[#1b8f5a]" />
            </div>
            <div className="mt-4 text-sm text-slate-600">
              Add more details to improve future scheme matching results.
            </div>
          </div>

          <div className="card-surface rounded-[28px] p-6">
            <div className="flex items-center gap-3 text-[#0b3b72]">
              <Sparkles className="h-5 w-5" />
              <span className="text-sm font-semibold uppercase tracking-[0.18em]">Helpful note</span>
            </div>
            <p className="mt-4 text-sm leading-6 text-slate-600">
              This dashboard is prepared for future eligibility matching, document guidance, and scheme recommendations.
            </p>
          </div>
        </section>

        <section className="grid gap-5 lg:grid-cols-2">
          <div className="card-surface rounded-[28px] p-6">
            <div className="mb-4 flex items-center gap-3">
              <BriefcaseBusiness className="h-5 w-5 text-[#0b3b72]" />
              <h2 className="text-xl font-semibold text-slate-900">Recommended Schemes</h2>
            </div>
            {recommended.length ? (
              <div className="space-y-3">Placeholder cards</div>
            ) : (
              <EmptyState
                icon={BriefcaseBusiness}
                title="No recommendations yet"
                description="Scheme recommendations will appear here after the eligibility engine is connected."
              />
            )}
          </div>

          <div className="card-surface rounded-[28px] p-6">
            <div className="mb-4 flex items-center gap-3">
              <Bookmark className="h-5 w-5 text-[#0b3b72]" />
              <h2 className="text-xl font-semibold text-slate-900">Saved Schemes</h2>
            </div>
            {saved.length ? (
              <div className="space-y-3">Saved items will list here.</div>
            ) : (
              <EmptyState
                icon={Bookmark}
                title="No saved schemes"
                description="Bookmarked schemes will appear here once available."
              />
            )}
          </div>
        </section>

        <section className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="card-surface rounded-[28px] p-6">
            <div className="mb-4 flex items-center gap-3">
              <ClipboardList className="h-5 w-5 text-[#0b3b72]" />
              <h2 className="text-xl font-semibold text-slate-900">Application Status</h2>
            </div>
            {applications.length ? (
              <div className="space-y-3">Application cards</div>
            ) : (
              <EmptyState
                icon={FileText}
                title="No applications yet"
                description="Your application tracking status will appear here once forms and workflow data are connected."
              />
            )}
          </div>

          <div className="card-surface rounded-[28px] p-6">
            <div className="mb-4 flex items-center gap-3">
              <Info className="h-5 w-5 text-[#0b3b72]" />
              <h2 className="text-xl font-semibold text-slate-900">Helpful Information</h2>
            </div>
            <ul className="space-y-3 text-sm leading-6 text-slate-600">
              <li>• Keep your profile details up to date for better scheme guidance.</li>
              <li>• Verify official documentation before submitting applications.</li>
              <li>• Use the scheme finder to narrow by category, state, age, and income.</li>
            </ul>
          </div>
        </section>
      </div>
    </div>
  );
}