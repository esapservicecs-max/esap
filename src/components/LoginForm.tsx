import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, ArrowRight, AlertCircle } from 'lucide-react';
import { User, Language } from '../types/auth';
import { translations } from '../locales/translations';
import { getStoredUsers, getStoredPasswords, setCurrentUser, addActivityLog } from '../services/storage';

interface LoginFormProps {
  language: Language;
  onSuccess: (user: User) => void;
  onForgotPassword: () => void;
  onSwitchToRegister: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({
  language,
  onSuccess,
  onForgotPassword,
  onSwitchToRegister,
}) => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const t = translations[language];

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim()) {
      setErrorMsg(language === 'th' ? 'กรุณากรอกอีเมลหรือชื่อผู้ใช้' : 'Please enter your email or username');
      return;
    }
    if (!password) {
      setErrorMsg(language === 'th' ? 'กรุณากรอกรหัสผ่าน' : 'Please enter your password');
      return;
    }

    setIsLoading(true);
    setErrorMsg('');

    setTimeout(() => {
      setIsLoading(false);
      const users = getStoredUsers();
      const passwords = getStoredPasswords();
      const cleanIdent = identifier.trim().toLowerCase();

      const user = users.find(
        (u) => u.email.toLowerCase() === cleanIdent || u.username.toLowerCase() === cleanIdent
      );

      if (!user) {
        setErrorMsg(
          language === 'th'
            ? 'ไม่พบบัญชีผู้ใช้งานนี้ในระบบ กรุณาตรวจสอบอีกครั้งหรือสมัครสมาชิกใหม่'
            : 'Account not found. Please verify your details or sign up.'
        );
        addActivityLog(`พยายามเข้าสู่ระบบไม่สำเร็จ (${identifier})`, 'failed');
        return;
      }

      const storedPass = passwords[user.email.toLowerCase()] || 'Password123!';
      if (password !== storedPass) {
        setErrorMsg(
          language === 'th'
            ? 'รหัสผ่านไม่ถูกต้อง กรุณาลองใหม่อีกครั้ง หรือใช้ลิงก์ลืมรหัสผ่าน'
            : 'Incorrect password. Please try again or reset your password.'
        );
        addActivityLog(`เข้าสู่ระบบผิดพลาด: รหัสผ่านไม่ถูกต้อง (${user.email})`, 'warning');
        return;
      }

      // Successful login
      const updatedUser: User = {
        ...user,
        lastLoginAt: new Date().toISOString(),
      };
      setCurrentUser(updatedUser);
      addActivityLog(`เข้าสู่ระบบสำเร็จ (${user.name})`, 'success');
      onSuccess(updatedUser);
    }, 550);
  };

  return (
    <div className="w-full">
      <div className="mb-6">
        <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          {t.loginToAccount}
        </h2>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          {t.loginSubtitle}
        </p>
      </div>

      <form onSubmit={handleLogin} className="space-y-4">
        {/* Identifier */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            {t.emailOrUsername}
          </label>
          <div className="relative">
            <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={identifier}
              onChange={(e) => {
                setIdentifier(e.target.value);
                setErrorMsg('');
              }}
              placeholder={t.emailOrUsernamePlaceholder}
              autoComplete="username"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all placeholder:text-slate-400"
            />
          </div>
        </div>

        {/* Password */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
              {t.password}
            </label>
            <button
              type="button"
              onClick={onForgotPassword}
              className="text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              {t.forgotPassword}
            </button>
          </div>
          <div className="relative">
            <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setErrorMsg('');
              }}
              placeholder={t.passwordPlaceholder}
              autoComplete="current-password"
              className="w-full pl-10 pr-11 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all placeholder:text-slate-400 font-sans"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Remember Me */}
        <div className="flex items-center">
          <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-600 dark:text-slate-400">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="w-4 h-4 rounded border-slate-300 dark:border-slate-700 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
            />
            <span>{t.rememberMe}</span>
          </label>
        </div>

        {/* Error message */}
        {errorMsg && (
          <div className="p-3 bg-red-50 dark:bg-red-950/40 rounded-xl border border-red-200 dark:border-red-900/50 flex items-start gap-2.5 text-xs text-red-700 dark:text-red-300">
            <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:scale-[0.99] disabled:opacity-60 transition-all shadow-md shadow-indigo-600/20 cursor-pointer"
        >
          {isLoading ? (
            <span>{language === 'th' ? 'กำลังตรวจสอบ...' : 'Signing in...'}</span>
          ) : (
            <>
              <span>{t.signInButton}</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      {/* Switch to Register link & Track Application */}
      <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-800 space-y-3 text-center text-xs text-slate-500 dark:text-slate-400">
        <p>
          {t.dontHaveAccount}{' '}
          <button
            type="button"
            onClick={onSwitchToRegister}
            className="font-bold text-indigo-600 dark:text-indigo-400 hover:underline inline-flex items-center gap-1 cursor-pointer"
          >
            <span>{t.register} (ขั้นตอน NSW & CA)</span>
          </button>
        </p>

        <div className="flex items-center justify-center gap-4 text-xs pt-1 font-medium">
          <button
            type="button"
            onClick={() => {
              window.dispatchEvent(new CustomEvent('open_track_app'));
            }}
            className="text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <span>🔍 {t.trackApplication}</span>
          </button>
          <span aria-hidden="true" className="text-slate-300 dark:text-slate-700">·</span>
          <button
            type="button"
            onClick={() => {
              window.dispatchEvent(new CustomEvent('open_cs_console'));
            }}
            className="text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <span>🛡️ {t.csConsole}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
