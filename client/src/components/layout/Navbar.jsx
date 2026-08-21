import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Menu, X, Search, UserCircle2 } from 'lucide-react';
import Button from '../common/Button';

const navItems = [
  { label: 'Home', to: '/' },
  { label: 'Find Schemes', to: '/schemes' },
  { label: 'About', to: '/#about' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur-sm">
      <nav aria-label="Main navigation" className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-3 text-slate-900" aria-label="YojanSetu AI home">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0b3b72] text-lg font-bold text-white">Y</div>
          <div>
            <div className="text-lg font-bold tracking-tight">YojanSetu AI</div>
            <div className="text-[10px] uppercase tracking-[0.18em] text-slate-500">Citizen assistance</div>
          </div>
        </Link>

        <div className="hidden items-center gap-6 md:flex">
          {navItems.map(({ label, to }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `text-sm font-medium transition ${isActive ? 'text-[#0b3b72]' : 'text-slate-600 hover:text-slate-900'}`
              }
            >
              {label}
            </NavLink>
          ))}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <Button variant="outline" size="sm" onClick={() => {}} className="gap-2">
            <Search className="h-4 w-4" />
            Explore
          </Button>
          <Link to="/login">
            <Button variant="outline" size="sm" className="gap-2">
              <UserCircle2 className="h-4 w-4" />
              Login
            </Button>
          </Link>
          <Link to="/register">
            <Button size="sm">Register</Button>
          </Link>
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
            {navItems.map(({ label, to }) => (
              <NavLink
                key={to}
                to={to}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `rounded-lg px-3 py-2 text-sm font-medium ${isActive ? 'bg-slate-100 text-[#0b3b72]' : 'text-slate-700'}`
                }
              >
                {label}
              </NavLink>
            ))}
            <Link to="/login" onClick={() => setIsOpen(false)}>
              <Button variant="outline" className="mt-2 w-full justify-center">
                Login
              </Button>
            </Link>
            <Link to="/register" onClick={() => setIsOpen(false)}>
              <Button className="w-full justify-center">Register</Button>
            </Link>
          </div>
        </div>
      ) : null}
    </header>
  );
}