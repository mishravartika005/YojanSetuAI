import { Search, SlidersHorizontal } from 'lucide-react';
import Button from '../components/common/Button';
import EmptyState from '../components/common/EmptyState';
import SchemeList from '../components/schemes/SchemeList';

export default function SchemeFinder() {
  const schemes = [];

  return (
    <div className="space-y-6">
      <section className="card-surface rounded-[28px] p-6 md:p-8">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#0b3b72] text-white">
            <Search className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#1b8f5a]">Search</p>
            <h1 className="text-3xl font-bold text-slate-900">Scheme finder</h1>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-6">
          <div className="xl:col-span-2">
            <label className="block text-sm font-medium text-slate-700">
              <span className="mb-2 block">Search schemes</span>
              <input className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 shadow-sm focus:border-sky-500 focus:outline-none focus:ring-4 focus:ring-sky-100" placeholder="Search by keyword or title" />
            </label>
          </div>
          <label className="block text-sm font-medium text-slate-700">
            <span className="mb-2 block">State</span>
            <select className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800" defaultValue="">
              <option value="" disabled>Select state</option>
              <option>All</option>
              <option>Karnataka</option>
              <option>Delhi</option>
            </select>
          </label>
          <label className="block text-sm font-medium text-slate-700">
            <span className="mb-2 block">Category</span>
            <select className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800" defaultValue="">
              <option value="" disabled>Select category</option>
              <option>All</option>
              <option>Education</option>
              <option>Women</option>
              <option>Farmers</option>
            </select>
          </label>
          <label className="block text-sm font-medium text-slate-700">
            <span className="mb-2 block">Income range</span>
            <select className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800" defaultValue="">
              <option value="" disabled>Select</option>
              <option>All</option>
              <option>Below ₹3L</option>
              <option>₹3L to ₹8L</option>
            </select>
          </label>
          <div className="flex items-end">
            <Button className="w-full justify-center gap-2">
              <SlidersHorizontal className="h-4 w-4" />
              Search Schemes
            </Button>
          </div>
        </div>
      </section>

      <section>
        {schemes.length ? (
          <SchemeList schemes={schemes} />
        ) : (
          <EmptyState
            icon={Search}
            title="Scheme results will appear here"
            description="Verified government schemes and match results will be displayed here once the backend is connected to the eligibility engine."
          />
        )}
      </section>
    </div>
  );
}