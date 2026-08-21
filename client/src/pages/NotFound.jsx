import { ArrowLeft, SearchX } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../components/common/Button';

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center py-10">
      <div className="card-surface max-w-lg rounded-[30px] p-8 text-center">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-slate-100 text-[#0b3b72]">
          <SearchX className="h-10 w-10" />
        </div>
        <p className="mt-6 text-sm font-semibold uppercase tracking-[0.18em] text-[#1b8f5a]">404</p>
        <h1 className="mt-3 text-4xl font-bold text-slate-900">Page not found</h1>
        <p className="mt-3 text-slate-600">The page you are looking for may have moved or does not exist yet.</p>
        <Link to="/" className="mt-6 inline-flex">
          <Button className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to home
          </Button>
        </Link>
      </div>
    </div>
  );
}