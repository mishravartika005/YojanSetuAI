import { NavLink } from 'react-router-dom';
import { LayoutDashboard, UserRound, Search, Bookmark, ClipboardList } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

const items = [
  { labelKey: 'dashboard', to: '/dashboard', icon: LayoutDashboard },
  { labelKey: 'profile', to: '/profile', icon: UserRound },
  { labelKey: 'findSchemes', to: '/schemes', icon: Search },
  { labelKey: 'savedSchemes', to: '/saved', icon: Bookmark },
  { labelKey: 'applications', to: '/applications', icon: ClipboardList },
];

export default function Sidebar() {
  const { t } = useLanguage();
  return (
    <aside aria-label="Sidebar" className="hidden w-64 shrink-0 lg:block">
      <div className="card-surface sticky top-24 rounded-2xl p-4">
        <p className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">{t('navigation')}</p>
        <nav className="space-y-2">
          {items.map(({ labelKey, to, icon: Icon }) => (
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
              {t(labelKey)}
            </NavLink>
          ))}
        </nav>
      </div>
    </aside>
  );
}