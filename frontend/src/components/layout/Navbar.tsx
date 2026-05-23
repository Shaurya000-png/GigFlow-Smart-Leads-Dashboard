import React from 'react';
import { LogOut, Sun, Moon } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { useThemeStore } from '../../store/themeStore';
import { Badge } from '../ui/Badge';
import { useNavigate } from 'react-router-dom';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuthStore();
  const { isDark, toggleTheme } = useThemeStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header
      className="h-14 border-b border-border bg-surface backdrop-blur-xl flex items-center justify-between px-4 lg:px-6 sticky top-0 z-40 shrink-0"
      style={{ backgroundColor: 'color-mix(in srgb, var(--color-surface) 92%, transparent)' }}
    >
      <div className="flex items-center gap-3 md:hidden">
        <h1 className="text-sm font-heading font-semibold tracking-premium">
          <span className="text-accent">Gig</span>Flow
        </h1>
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            `text-2xs font-medium px-2.5 py-1 rounded-md border transition-colors ${
              isActive
                ? 'bg-primary/10 text-accent border-primary/25'
                : 'text-textMuted border-border hover:text-textMain'
            }`
          }
        >
          Dashboard
        </NavLink>
      </div>

      <div className="hidden md:block" />

      <div className="flex items-center gap-4">
        <button
          onClick={toggleTheme}
          className="text-textMuted hover:text-accent transition-colors duration-200 p-1"
          title="Toggle Theme"
        >
          {isDark ? <Sun size={17} /> : <Moon size={17} />}
        </button>

        <div className="h-6 w-px bg-border hidden sm:block" />

        <div className="hidden sm:flex items-center gap-2.5">
          <div className="text-right">
            <p className="text-xs font-medium text-textMain leading-none tracking-tight">{user?.name}</p>
            <p className="text-2xs text-textMuted mt-0.5 truncate max-w-[140px]">{user?.email}</p>
          </div>
          <Badge variant={user?.role === 'admin' ? 'blue' : 'gray'}>
            {user?.role === 'admin' ? 'Admin' : 'Sales'}
          </Badge>
        </div>
        <div className="h-6 w-px bg-border hidden sm:block" />
        <button
          onClick={handleLogout}
          className="flex items-center gap-1.5 text-2xs font-medium text-textMuted hover:text-red-400 transition-colors duration-200"
        >
          <LogOut size={15} />
          <span className="hidden sm:inline tracking-wide">Logout</span>
        </button>
      </div>
    </header>
  );
};
