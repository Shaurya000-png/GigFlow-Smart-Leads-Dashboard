import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'blue' | 'yellow' | 'green' | 'red' | 'gray';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ children, variant = 'gray', className = '' }) => {
  const variants = {
    blue: 'bg-primary/15 text-accent border border-primary/25',
    yellow: 'bg-amber-500/10 text-amber-300/90 border border-amber-500/20',
    green: 'bg-emerald-500/10 text-emerald-300/90 border border-emerald-500/20',
    red: 'bg-red-500/10 text-red-300/90 border border-red-500/20',
    gray: 'bg-surfaceElevated text-textMuted border border-border',
  };

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-md text-2xs font-medium tracking-wide ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  );
};
