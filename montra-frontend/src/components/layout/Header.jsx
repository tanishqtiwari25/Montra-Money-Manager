import React, { useContext } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { ThemeContext } from '../../context/ThemeContext'; // Direct Context Import
import { Button } from '../ui/Button';

export const Header = ({ onMobileMenuOpen }) => {
  const { logout, user } = useAuth();
  
  // ThemeContext direct read kar rahe hain
  const context = useContext(ThemeContext);
  const theme = context?.theme || 'dark';
  const toggleTheme = context?.toggleTheme || (() => console.log("ThemeContext not found"));

  return (
    <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 md:px-8 flex items-center justify-between sticky top-0 z-10">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onMobileMenuOpen}
          className="md:hidden p-2 rounded-md text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
          aria-label="Open sidebar"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-200 hidden sm:block">
          Financial Overview
        </h2>
      </div>

      <div className="flex items-center gap-4">
        {/* Theme Toggle Button */}
        <button
          type="button"
          onClick={toggleTheme}
          className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:opacity-80 transition-opacity cursor-pointer"
          aria-label="Toggle Theme"
        >
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>

        {/* User Badge / Profile */}
        <div className="text-xs text-right hidden sm:block">
          <p className="font-semibold text-slate-700 dark:text-slate-200">{user?.username || 'User Workspace'}</p>
          <p className="text-slate-400">{user?.role || 'Admin'}</p>
        </div>

        {/* Logout CTA */}
        <Button variant="outline" size="sm" onClick={logout}>
          Logout
        </Button>
      </div>
    </header>
  );
};