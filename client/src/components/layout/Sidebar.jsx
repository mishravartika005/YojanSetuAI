import { NavLink } from 'react-router-dom';
import { LayoutDashboard, UserRound, Search, Bookmark, ClipboardList } from 'lucide-react';

const items = [
  { label: 'Dashboard', to: '/dashboard', icon: LayoutDashboard },
  { label: 'Profile', to: '/profile', icon: UserRound },
  { label: 'Find Schemes', to: '/schemes', icon: Search },
  { label: 'Saved Schemes', to: '/saved', icon: Bookmark },
  { label: 'Applications', to: '/applications', icon: ClipboardList },
];

export default function Sidebar() {
  return (
    <aside aria-label="Sidebar" className="hidden w-64 shrink-0 lg:block">
      <div className="card-surface sticky top-24 rounded-2xl p-4">
        <p className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Navigation</p>
        <nav className="space-y-2">
          {items.map(({ label, to, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                  isActive ? 'bg-[#0b3b72] text-white' : 'text-slate-700 hover:bg-slate-100'
                }`
              }
            >
              <Icon className="h-4 w-4" />
              {label}
            </NavLink>
          ))}
        </nav>
      </div>
    </aside>
  );
}