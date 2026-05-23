import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Sparkles } from 'lucide-react';
import { AnimatedText } from '../ui/AnimatedText';
import { useAuthStore } from '../../store/authStore';

export const Sidebar: React.FC = () => {
  const user = useAuthStore((state) => state.user);

  return (
    <aside className="w-56 bg-surface border-r border-border h-full flex flex-col hidden md:flex shrink-0">
      <div className="px-5 py-5 border-b border-border">
        <AnimatedText as="h1" animation="text-reveal" className="text-lg font-heading font-semibold text-premium">
          <span className="text-accent">Gig</span>
          <span className="text-textMain">Flow</span>
        </AnimatedText>
        <AnimatedText as="p" delay={120} className="text-2xs text-textMuted mt-1 tracking-wide">
          Lead intelligence
        </AnimatedText>
      </div>

      <nav className="flex-1 p-3 space-y-1">
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            `flex items-center gap-2.5 px-3 py-2 rounded-lg transition-all duration-200 text-xs font-medium ${
              isActive
                ? 'bg-primary/10 text-accent border border-primary/20'
                : 'text-textMuted hover:bg-surfaceElevated hover:text-textMain border border-transparent'
            }`
          }
        >
          <LayoutDashboard size={16} strokeWidth={1.75} />
          Dashboard
        </NavLink>

        <div className="mt-4 mx-1 p-3.5 rounded-xl bg-surfaceElevated border border-border">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles size={14} className="text-accent" />
            <span className="text-2xs font-medium text-textMuted uppercase tracking-label">Workspace</span>
          </div>
          <p className="text-xs text-textMain leading-relaxed">
            Signed in as <span className="font-medium text-accent">{user?.name}</span>
          </p>
          <p className="text-2xs text-textMuted mt-1.5 capitalize">{user?.role} access</p>
        </div>
      </nav>

      <div className="px-4 py-3 border-t border-border">
        <p className="text-2xs text-textMuted text-center tracking-wide opacity-70">
          &copy; {new Date().getFullYear()} GigFlow
        </p>
      </div>
    </aside>
  );
};
