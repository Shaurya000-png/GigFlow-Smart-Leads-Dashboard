import React from 'react';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(26,39,68,0.25),_transparent_55%)] pointer-events-none" />
        <Navbar />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-7 relative z-10">{children}</main>
      </div>
    </div>
  );
};
