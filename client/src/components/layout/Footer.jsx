import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-10 sm:px-6 lg:grid-cols-[1.5fr_1fr_1fr_1fr] lg:px-8">
        <div>
          <div className="mb-3 text-xl font-bold text-slate-900">YojanSetu AI</div>
          <p className="max-w-sm text-sm text-slate-600">
            Helping citizens discover relevant public welfare and government scheme opportunities through a clear, supportive digital experience.
          </p>
        </div>

        <div>
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-[0.15em] text-slate-500">Company</h3>
          <ul className="space-y-2 text-sm text-slate-600">
            <li><Link to="/">About</Link></li>
            <li><Link to="/schemes">Find Schemes</Link></li>
            <li><Link to="/dashboard">Dashboard</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-[0.15em] text-slate-500">Legal</h3>
          <ul className="space-y-2 text-sm text-slate-600">
            <li><Link to="/privacy">Privacy</Link></li>
            <li><Link to="/terms">Terms</Link></li>
            <li><Link to="/contact">Contact</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-[0.15em] text-slate-500">Notice</h3>
          <p className="text-sm text-slate-600">
            Information presented here is for citizen guidance and future eligibility assessment support only.
          </p>
        </div>
      </div>
    </footer>
  );
}