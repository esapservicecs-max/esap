import React from 'react';
import { ShieldCheck, Moon, Sun, Globe, LogOut, User as UserIcon } from 'lucide-react';
import { User, Language, AuthMode } from '../types/auth';
import { translations } from '../locales/translations';

interface NavbarProps {
  user: User | null;
  language: Language;
  onToggleLanguage: () => void;
  isDark: boolean;
  onToggleTheme: () => void;
  onLogout: () => void;
  activeMode: AuthMode;
  onSwitchMode: (mode: AuthMode) => void;
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
        {/* Zone 1: Brand Wordmark (กรอบที่ 1: ESAP TEST LOGIN) */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="h-10 sm:h-11 px-2 py-1 bg-white rounded-xl shadow-xs border border-slate-200 dark:border-slate-700 flex items-center justify-center shrink-0">
            <img
              src="/assets/aistudio/image_7cb182a3.png"
              alt="ESAP Logo"
              className="h-8 sm:h-9 w-auto max-w-[120px] object-contain"
            />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white leading-tight uppercase">
              ESAP TEST LOGIN
            </span>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 hidden sm:inline">
              {t.tagline}
            </span>
          </div>
        </div>

        {/* Zone 2: Navigation Links for Logged-in User */}
        {user && (
          <div className="hidden md:flex items-center gap-3 text-xs text-slate-600 dark:text-slate-400">
            <span className="font-medium text-slate-900 dark:text-white">{t.memberPortal}</span>
            <span aria-hidden="true">·</span>
            <span>{user.role === 'admin' ? t.roleAdmin : user.role === 'pro' ? t.rolePro : t.roleMember}</span>
          </div>
        )}

        {/* Zone 3: Actions & Controls (ขวาสุด: ภาษา โหมดมืด เข้าสู่ระบบ และ กรอบที่ 3) */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Language Switcher */}
          <button
            type="button"
            onClick={onToggleLanguage}
            title={language === 'th' ? 'Switch to English' : 'เปลี่ยนเป็นภาษาไทย'}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors border border-slate-200 dark:border-slate-800 cursor-pointer"
          >
            <Globe className="w-3.5 h-3.5 text-slate-500" />
            <span className="font-semibold uppercase">{language}</span>
          </button>

          {/* Theme Switcher */}
          <button
            type="button"
            onClick={onToggleTheme}
            title={isDark ? 'โหมดสว่าง (Light Mode)' : 'โหมดมืด (Dark Mode)'}
            className="p-2 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors border border-slate-200 dark:border-slate-800 cursor-pointer"
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
          </button>

          {/* User Profile or Auth Navigation */}
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
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/40 hover:bg-red-100 dark:hover:bg-red-900/40 rounded-lg transition-colors cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{t.logout}</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 sm:gap-2">
              {/* ปุ่ม: เข้าสู่ระบบ */}
              <button
                type="button"
                onClick={() => onSwitchMode('login')}
                className={`px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium rounded-lg transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                  activeMode === 'login'
                    ? 'bg-indigo-600 text-white shadow-xs font-semibold'
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 border border-slate-200 dark:border-slate-700'
                }`}
              >
                {t.login}
              </button>

              {/* กรอบที่ 3: ย้ายมาอยู่ด้านขวาสุด หลังเข้าสู่ระบบ (สมัครสมาชิก + ติดตามสถานะการสมัคร) */}
              <button
                type="button"
                onClick={() => onSwitchMode('register')}
                className={`px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium rounded-lg transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                  activeMode === 'register'
                    ? 'bg-indigo-600 text-white shadow-xs font-semibold'
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 border border-slate-200 dark:border-slate-700'
                }`}
              >
                {t.register}
              </button>

              <button
                type="button"
                onClick={() => onSwitchMode('track_app')}
                className={`px-2.5 sm:px-3.5 py-1.5 sm:py-2 text-xs sm:text-sm font-medium rounded-lg transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                  activeMode === 'track_app'
                    ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-300 dark:border-indigo-800 font-semibold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 border border-transparent'
                }`}
              >
                <span>{t.trackApplication}</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
