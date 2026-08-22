import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Menu, X, Search, UserCircle2 } from 'lucide-react';
import Button from '../common/Button';
import useAuth from '../../hooks/useAuth';
import { useLanguage } from '../../context/LanguageContext';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated, logoutUser } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const navigate = useNavigate();

  const navItems = [
    { labelKey: 'home', to: '/' },
    ...(isAuthenticated ? [{ labelKey: 'dashboard', to: '/dashboard' }] : []),
  ];
  const handleLogout = async () => {
    await logoutUser();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur-sm">
      <nav aria-label="Main navigation" className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-3 text-slate-900" aria-label="YojanSetu AI home">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0b3b72] text-lg font-bold text-white">Y</div>
          <div>
            <div className="text-lg font-bold tracking-tight">YojanSetu AI</div>
            <div className="text-[10px] uppercase tracking-[0.18em] text-slate-500">{t('citizenAssistant')}</div>
          </div>
        </Link>

        <div className="hidden items-center gap-6 md:flex">
          {navItems.map(({ labelKey, to }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `text-sm font-medium transition ${isActive ? 'text-[#0b3b72]' : 'text-slate-600 hover:text-slate-900'}`
              }
            >
              {t(labelKey)}
            </NavLink>
          ))}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <div className="relative flex items-center gap-1.5 mr-2">
            <span className="text-slate-500 text-sm">🌐</span>
            <select
              aria-label="Select language"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="rounded-xl border border-slate-200 bg-white px-2 py-1.5 text-sm font-medium text-slate-700 shadow-sm focus:border-sky-500 focus:outline-none"
            >
              <option value="en">English</option>
              <option value="hi">हिन्दी</option>
            </select>
          </div>
          {isAuthenticated ? (
            <Button size="sm" onClick={handleLogout}>{t('logout')}</Button>
          ) : (
            <>
              <Link to="/login">
                <Button variant="outline" size="sm" className="gap-2">
                  <UserCircle2 className="h-4 w-4" />
                  {t('login')}
                </Button>
              </Link>
              <Link to="/register">
                <Button size="sm">{t('register')}</Button>
              </Link>
            </>
          )}
        </div>

        <button
          type="button"
          aria-label="Toggle mobile navigation"
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 text-slate-700 md:hidden"
          onClick={() => setIsOpen((prev) => !prev)}
        >
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {isOpen ? (
        <div className="border-t border-slate-200 bg-white px-4 py-4 md:hidden">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-1.5 px-3 py-1.5 border-b border-slate-100 pb-3">
              <span className="text-slate-500 text-sm">🌐 Language:</span>
              <select
                aria-label="Select language"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="rounded-xl border border-slate-200 bg-white px-2 py-1.5 text-sm font-medium text-slate-700 shadow-sm focus:border-sky-500 focus:outline-none"
              >
                <option value="en">English</option>
                <option value="hi">हिन्दी</option>
              </select>
            </div>
            {navItems.map(({ labelKey, to }) => (
              <NavLink
                key={to}
                to={to}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `rounded-lg px-3 py-2 text-sm font-medium ${isActive ? 'bg-slate-100 text-[#0b3b72]' : 'text-slate-700'}`
                }
              >
                {t(labelKey)}
              </NavLink>
            ))}
            {isAuthenticated ? (
              <Button className="w-full justify-center" onClick={() => { setIsOpen(false); handleLogout(); }}>
                {t('logout')}
              </Button>
            ) : (
              <>
                <Link to="/login" onClick={() => setIsOpen(false)}>
                  <Button variant="outline" className="mt-2 w-full justify-center">
                    {t('login')}
                  </Button>
                </Link>
                <Link to="/register" onClick={() => setIsOpen(false)}>
                  <Button className="w-full justify-center">{t('register')}</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      ) : null}
    </header>
  );
}