import { Check, FileText } from 'lucide-react';

export default function DocumentChecklist({ documents = [] }) {
  if (!documents.length) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
        Document checklist will appear here once backend data is connected.
      </div>
    );
  }

  return (
    <ul className="space-y-3">
      {documents.map((document) => (
        <li key={document} className="flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700">
          <span className="mt-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-[#eafaf2] text-[#1b8f5a]">
            <Check className="h-3.5 w-3.5" />
          </span>
          <span className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-slate-500" />
            {document}
          </span>
        </li>
      ))}
    </ul>
  );
}