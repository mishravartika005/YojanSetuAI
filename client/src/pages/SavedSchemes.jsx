import { Bookmark, SearchX } from 'lucide-react';
import EmptyState from '../components/common/EmptyState';
import Sidebar from '../components/layout/Sidebar';

export default function SavedSchemes() {
  return (
    <div className="flex gap-8">
      <Sidebar />

      <div className="flex-1">
        <div className="card-surface rounded-[28px] p-6 md:p-8">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#0b3b72] text-white">
              <Bookmark className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#1b8f5a]">Saved</p>
              <h1 className="text-3xl font-bold text-slate-900">Saved schemes</h1>
            </div>
          </div>

          <EmptyState
            icon={SearchX}
            title="No saved schemes yet"
            description="Saved and bookmarked schemes will appear here once the user has selected them from the scheme finder or dashboard."
          />
        </div>
      </div>
    </div>
  );
}