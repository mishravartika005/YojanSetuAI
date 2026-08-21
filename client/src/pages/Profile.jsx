import { UserRound } from 'lucide-react';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Sidebar from '../components/layout/Sidebar';

const selectBase = 'w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800';

export default function Profile() {
  return (
    <div className="flex gap-8">
      <Sidebar />

      <div className="flex-1">
        <div className="card-surface rounded-[28px] p-6 md:p-8">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#0b3b72] text-white">
              <UserRound className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#1b8f5a]">Citizen profile</p>
              <h1 className="text-3xl font-bold text-slate-900">Your details</h1>
            </div>
          </div>

          <form className="space-y-6">
            <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              <Input label="Name" placeholder="Enter your name" />
              <Input label="Age" type="number" placeholder="25" />
              <label className="block text-sm font-medium text-slate-700">
                <span className="mb-2 block">Gender</span>
                <select className={selectBase} defaultValue="">
                  <option value="" disabled>Select gender</option>
                  <option>Female</option>
                  <option>Male</option>
                  <option>Non-binary</option>
                  <option>Prefer not to say</option>
                </select>
              </label>
              <label className="block text-sm font-medium text-slate-700">
                <span className="mb-2 block">State</span>
                <select className={selectBase} defaultValue="">
                  <option value="" disabled>Select state</option>
                  <option>Karnataka</option>
                  <option>Maharashtra</option>
                  <option>Delhi</option>
                  <option>Uttar Pradesh</option>
                </select>
              </label>
              <Input label="District" placeholder="Enter district" />
              <Input label="Occupation" placeholder="Occupation" />
            </section>

            <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              <Input label="Annual income" type="number" placeholder="500000" />
              <label className="block text-sm font-medium text-slate-700">
                <span className="mb-2 block">Category</span>
                <select className={selectBase} defaultValue="">
                  <option value="" disabled>Select category</option>
                  <option>General</option>
                  <option>OBC</option>
                  <option>SC</option>
                  <option>ST</option>
                </select>
              </label>
              <label className="block text-sm font-medium text-slate-700">
                <span className="mb-2 block">Rural / Urban</span>
                <select className={selectBase} defaultValue="">
                  <option value="" disabled>Select</option>
                  <option>Rural</option>
                  <option>Urban</option>
                </select>
              </label>
              <label className="block text-sm font-medium text-slate-700">
                <span className="mb-2 block">Disability status</span>
                <select className={selectBase} defaultValue="">
                  <option value="" disabled>Select</option>
                  <option>None</option>
                  <option>Yes</option>
                </select>
              </label>
              <label className="block text-sm font-medium text-slate-700">
                <span className="mb-2 block">Student status</span>
                <select className={selectBase} defaultValue="">
                  <option value="" disabled>Select</option>
                  <option>No</option>
                  <option>Yes</option>
                </select>
              </label>
              <label className="block text-sm font-medium text-slate-700">
                <span className="mb-2 block">Employment status</span>
                <select className={selectBase} defaultValue="">
                  <option value="" disabled>Select</option>
                  <option>Employed</option>
                  <option>Unemployed</option>
                  <option>Self-employed</option>
                  <option>Student</option>
                </select>
              </label>
            </section>

            <div className="flex flex-wrap gap-3 pt-2">
              <Button type="submit">Save profile</Button>
              <Button variant="outline" type="button">Reset</Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}