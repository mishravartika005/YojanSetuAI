import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../components/common/Button';
import Input from '../components/common/Input';

export default function Register() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center py-10">
      <div className="w-full max-w-xl rounded-[28px] border border-slate-200 bg-white p-7 shadow-sm">
        <div className="mb-6 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#1b8f5a]">Create account</p>
          <h1 className="mt-2 text-3xl font-bold text-slate-900">Register</h1>
        </div>

        <form className="space-y-5">
          <div className="grid gap-5 md:grid-cols-2">
            <Input label="Full name" placeholder="Enter your full name" />
            <Input label="Email or mobile" type="email" placeholder="name@example.com" />
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <Input label="Password" type="password" placeholder="Create password" />
            <Input label="Confirm password" type="password" placeholder="Re-enter password" />
          </div>

          <label className="flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-600">
            <input type="checkbox" className="mt-0.5 h-4 w-4 rounded border-slate-300 text-[#0b3b72] focus:ring-sky-200" />
            <span>
              I agree to the terms and understand that this demo interface is for future scheme assistance and will connect to backend services later.
            </span>
          </label>

          <Button className="w-full justify-center gap-2" size="lg">
            Register
            <ArrowRight className="h-4 w-4" />
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-600">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-[#0b3b72] hover:underline">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
}