import { ArrowLeft, Bookmark, Building2, CalendarClock, CheckCircle2, FileText, Link as LinkIcon } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import Button from '../components/common/Button';
import EligibilityScore from '../components/schemes/EligibilityScore';
import DocumentChecklist from '../components/schemes/DocumentChecklist';

const placeholderDocuments = [
  'Identity document',
  'Income certificate',
  'Residence proof',
  'Additional supporting documents as required',
];

export default function SchemeDetails() {
  const { schemeId } = useParams();

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link to="/schemes" className="inline-flex items-center gap-2 text-sm font-medium text-[#0b3b72]">
          <ArrowLeft className="h-4 w-4" />
          Back to schemes
        </Link>
        <Button variant="outline" className="gap-2">
          <Bookmark className="h-4 w-4" />
          Save scheme
        </Button>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
        <section className="card-surface rounded-[28px] p-6 md:p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#1b8f5a]">Scheme ID: {schemeId || 'pending'}</p>
          <h1 className="mt-3 text-3xl font-bold text-slate-900">Scheme information will appear here</h1>
          <div className="mt-4 flex items-center gap-2 text-sm text-slate-600">
            <Building2 className="h-4 w-4 text-slate-500" />
            Government department placeholder
          </div>
          <p className="mt-5 text-base leading-7 text-slate-600">
            A verified scheme summary, official description, and eligibility guidance will be displayed here once backend data is connected.
          </p>

          <div className="mt-8 grid gap-5 md:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm font-semibold uppercase tracking-[0.14em] text-slate-500">Eligibility</p>
              <p className="mt-2 text-sm leading-6 text-slate-700">Eligibility requirements will be added after the verified scheme database is connected.</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm font-semibold uppercase tracking-[0.14em] text-slate-500">Benefits</p>
              <p className="mt-2 text-sm leading-6 text-slate-700">Benefit details will be displayed here when the official records are ready.</p>
            </div>
          </div>

          <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-4">
            <div className="mb-3 flex items-center gap-2 text-slate-900">
              <FileText className="h-4 w-4" />
              <span className="font-semibold">Required documents</span>
            </div>
            <DocumentChecklist documents={placeholderDocuments} />
          </div>

          <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-4">
            <div className="mb-3 flex items-center gap-2 text-slate-900">
              <CalendarClock className="h-4 w-4" />
              <span className="font-semibold">Application process</span>
            </div>
            <p className="text-sm leading-6 text-slate-600">
              Citizens will be guided through the application process once the service is connected to official workflow data and document requirements.
            </p>
          </div>
        </section>

        <aside className="space-y-6">
          <EligibilityScore score={72} />

          <div className="card-surface rounded-[28px] p-5">
            <div className="mb-3 flex items-center gap-2 text-slate-900">
              <LinkIcon className="h-4 w-4" />
              <span className="font-semibold">Official source</span>
            </div>
            <p className="text-sm leading-6 text-slate-600">Official link placeholder will be added when the verified source is available.</p>
          </div>

          <div className="card-surface rounded-[28px] p-5">
            <div className="mb-4 flex items-center gap-2 text-slate-900">
              <CheckCircle2 className="h-4 w-4 text-[#1b8f5a]" />
              <span className="font-semibold">Next steps</span>
            </div>
            <div className="space-y-3">
              <Button className="w-full justify-center">Apply now</Button>
              <Button variant="outline" className="w-full justify-center">View application</Button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}