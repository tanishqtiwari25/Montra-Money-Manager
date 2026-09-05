import React from 'react';

import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../context/ThemeContext';

import { Button } from '../ui/Button';

export const Header = ({
  onMobileMenuOpen,
}) => {

  const {
    logout,
    user,
  } = useAuth();

  const {
    theme,
    toggleTheme,
  } = useTheme();


  const handleLogout = () => {

    logout();

  };


  return (
    <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 md:px-8 flex items-center justify-between sticky top-0 z-10">

      {/* Left */}

      <div className="flex items-center gap-3">

        <button
          type="button"
          onClick={onMobileMenuOpen}
          className="md:hidden p-2 rounded-md text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
          aria-label="Open sidebar"
        >

          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >

            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16M4 18h16"
            />

          </svg>

        </button>


        <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-200 hidden sm:block">
          Financial Overview
        </h2>

      </div>


      {/* Right */}

      <div className="flex items-center gap-4">


        {/* Theme */}

        <button
          type="button"
          onClick={toggleTheme}
          className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:opacity-80 transition-opacity cursor-pointer"
          aria-label="Toggle Theme"
          title="Toggle Theme"
        >
          {theme === 'dark'
            ? '☀️'
            : '🌙'}
        </button>


        {/* User */}

        <div className="text-xs text-right hidden sm:block">

          <p className="font-semibold text-slate-700 dark:text-slate-200">
            {user?.username ||
              user?.fullName ||
              'User Workspace'}
          </p>

          <p className="text-slate-400">
            {user?.role ||
              'Admin'}
          </p>

        </div>


        {/* Logout */}

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleLogout}
        >
          Logout
        </Button>

      </div>

    </header>
  );
};

export default Header;