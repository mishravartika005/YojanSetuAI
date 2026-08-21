import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../components/common/Button';
import Input from '../components/common/Input';

export default function Login() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center py-10">
      <div className="w-full max-w-md rounded-[28px] border border-slate-200 bg-white p-7 shadow-sm">
        <div className="mb-6 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#1b8f5a]">Welcome back</p>
          <h1 className="mt-2 text-3xl font-bold text-slate-900">Login</h1>
        </div>

        <form className="space-y-5">
          <Input label="Email or mobile" type="email" placeholder="name@example.com" />
          <Input label="Password" type="password" placeholder="Enter your password" />

          <div className="flex items-center justify-between gap-3 text-sm">
            <label className="flex items-center gap-2 text-slate-600">
              <input type="checkbox" className="h-4 w-4 rounded border-slate-300 text-[#0b3b72] focus:ring-sky-200" />
              Remember me
            </label>
            <Link to="/forgot-password" className="font-medium text-[#0b3b72] hover:underline">
              Forgot password?
            </Link>
          </div>

          <Button className="w-full justify-center gap-2" size="lg">
            Login
            <ArrowRight className="h-4 w-4" />
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-600">
          New here?{' '}
          <Link to="/register" className="font-semibold text-[#0b3b72] hover:underline">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}