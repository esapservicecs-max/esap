import React from 'react';
import { ShieldCheck, Moon, Sun, Globe, LogOut, User as UserIcon } from 'lucide-react';
import { User, Language } from '../types/auth';
import { translations } from '../locales/translations';

interface NavbarProps {
  user: User | null;
  language: Language;
  onToggleLanguage: () => void;
  isDark: boolean;
  onToggleTheme: () => void;
  onLogout: () => void;
  activeMode: 'login' | 'register';
  onSwitchMode: (mode: 'login' | 'register') => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  user,
  language,
  onToggleLanguage,
  isDark,
  onToggleTheme,
  onLogout,
  activeMode,
  onSwitchMode,
}) => {
  const t = translations[language];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4 md:gap-8">
        {/* Zone 1: Brand Wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-blue-500 flex items-center justify-center text-white shadow-sm shadow-indigo-500/20">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white leading-tight">
              {t.brandName}
            </span>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 hidden sm:inline">
              {t.tagline}
            </span>
          </div>
        </div>

        {/* Zone 2: Navigation Links / Segmented Mode Toggles */}
        <div className="flex items-center gap-2">
          {!user && (
            <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
              <button
                type="button"
                onClick={() => onSwitchMode('login')}
                className={`px-3.5 py-1.5 text-xs sm:text-sm font-medium rounded-lg transition-all whitespace-nowrap shrink-0 ${
                  activeMode === 'login'
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs font-semibold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {t.login}
              </button>
              <button
                type="button"
                onClick={() => onSwitchMode('register')}
                className={`px-3.5 py-1.5 text-xs sm:text-sm font-medium rounded-lg transition-all whitespace-nowrap shrink-0 ${
                  activeMode === 'register'
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs font-semibold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {t.register}
              </button>
            </div>
          )}

          <button
            type="button"
            onClick={() => window.dispatchEvent(new CustomEvent('open_track_app'))}
            className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-lg transition-colors whitespace-nowrap shrink-0"
          >
            <span>{t.trackApplication}</span>
          </button>

          {user && (
            <div className="hidden md:flex items-center gap-3 text-xs text-slate-600 dark:text-slate-400">
              <span className="font-medium text-slate-900 dark:text-white">{t.memberPortal}</span>
              <span aria-hidden="true">·</span>
              <span>{user.role === 'admin' ? t.roleAdmin : user.role === 'pro' ? t.rolePro : t.roleMember}</span>
            </div>
          )}
        </div>

        {/* Zone 3: Actions & Controls */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Language Switcher */}
          <button
            type="button"
            onClick={onToggleLanguage}
            title={language === 'th' ? 'Switch to English' : 'เปลี่ยนเป็นภาษาไทย'}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors border border-slate-200 dark:border-slate-800"
          >
            <Globe className="w-3.5 h-3.5 text-slate-500" />
            <span className="font-semibold uppercase">{language}</span>
          </button>

          {/* Theme Switcher */}
          <button
            type="button"
            onClick={onToggleTheme}
            title={isDark ? 'โหมดสว่าง (Light Mode)' : 'โหมดมืด (Dark Mode)'}
            className="p-2 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors border border-slate-200 dark:border-slate-800"
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
          </button>

          {/* User Profile or Primary CTA */}
          {user ? (
            <div className="flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-800">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-8 h-8 rounded-full object-cover ring-2 ring-indigo-500/20"
                referrerPolicy="no-referrer"
              />
              <button
                type="button"
                onClick={onLogout}
                title={t.logout}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/40 hover:bg-red-100 dark:hover:bg-red-900/40 rounded-lg transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{t.logout}</span>
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => onSwitchMode(activeMode === 'login' ? 'register' : 'login')}
              className="px-4 py-2 text-xs sm:text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors shadow-xs shadow-indigo-600/20 whitespace-nowrap shrink-0"
            >
              {activeMode === 'login' ? t.signUpButton : t.signInButton}
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
