import { CircleDashed, ClipboardList, FileCheck2, FileX2, Hourglass, ShieldCheck } from 'lucide-react';
import Sidebar from '../components/layout/Sidebar';

const stages = [
  { label: 'Not Started', icon: CircleDashed },
  { label: 'Draft', icon: Hourglass },
  { label: 'Submitted', icon: FileCheck2 },
  { label: 'Under Review', icon: ClipboardList },
  { label: 'Approved', icon: ShieldCheck },
  { label: 'Rejected', icon: FileX2 },
];

export default function Applications() {
  return (
    <div className="flex gap-8">
      <Sidebar />

      <div className="flex-1">
        <div className="card-surface rounded-[28px] p-6 md:p-8">
          <div className="mb-6">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#1b8f5a]">Applications</p>
            <h1 className="mt-2 text-3xl font-bold text-slate-900">Application tracking</h1>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {stages.map(({ label, icon: Icon }) => (
              <div key={label} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-white text-[#0b3b72] shadow-sm">
                  <Icon className="h-5 w-5" />
                </div>
                <h2 className="text-lg font-semibold text-slate-900">{label}</h2>
                <p className="mt-2 text-sm text-slate-600">Status placeholder for future application workflow integration.</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}