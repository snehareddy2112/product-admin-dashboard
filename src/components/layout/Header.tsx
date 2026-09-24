'use client';

import React from 'react';
import { Menu, Moon, Sun, Monitor, ShieldCheck } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';

export interface HeaderProps {
  onMenuClick?: () => void;
  title?: React.ReactNode;
}

export function Header({ onMenuClick, title }: HeaderProps) {
  const { theme, setTheme } = useTheme();
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-4 sm:px-6 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md">
      {/* Left side: Hamburger button + Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="p-2 -ml-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 md:hidden cursor-pointer"
          aria-label="Open menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {title && <div className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100">{title}</div>}
      </div>

      {/* Right side: Global Actions */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Auth Badge */}
        <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs font-medium">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          <span>Authenticated: @{user?.username}</span>
        </div>

        {/* Theme Toggle Button */}
        <div className="flex items-center border border-slate-200 dark:border-slate-800 rounded-lg p-0.5 bg-slate-100/70 dark:bg-slate-800/70">
          <button
            onClick={() => setTheme('light')}
            className={
              'p-1.5 rounded-md text-xs transition-colors cursor-pointer ' +
              (theme === 'light'
                ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-xs'
                : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200')
            }
            title="Light mode"
            aria-label="Light mode"
          >
            <Sun className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setTheme('dark')}
            className={
              'p-1.5 rounded-md text-xs transition-colors cursor-pointer ' +
              (theme === 'dark'
                ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-xs'
                : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200')
            }
            title="Dark mode"
            aria-label="Dark mode"
          >
            <Moon className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setTheme('system')}
            className={
              'p-1.5 rounded-md text-xs transition-colors cursor-pointer ' +
              (theme === 'system'
                ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-xs'
                : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200')
            }
            title="System theme"
            aria-label="System theme"
          >
            <Monitor className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* User Mini Avatar */}
        {user?.image && (
          <img
            src={user.image}
            alt={user.firstName}
            className="w-8 h-8 rounded-full border border-slate-200 dark:border-slate-700 object-cover ml-1"
          />
        )}
      </div>
    </header>
  );
}