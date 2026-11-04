import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Sparkles, AlertCircle, Check } from 'lucide-react';
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
  const [selectedDemoUser, setSelectedDemoUser] = useState<string | null>(null);

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

  const handleDemoSelect = (email: string, pass: string) => {
    setIdentifier(email);
    setPassword(pass);
    setSelectedDemoUser(email);
    setErrorMsg('');
  };

  const handleSocialLogin = (provider: string) => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      const users = getStoredUsers();
      const targetUser = users[0] || {
        id: `usr_${Date.now()}`,
        name: `ผู้ใช้ ${provider}`,
        username: `${provider.toLowerCase()}_user`,
        email: `${provider.toLowerCase()}@social.auth`,
        phone: '089-999-8888',
        role: 'member' as const,
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=SocialUser',
        createdAt: new Date().toISOString(),
        lastLoginAt: new Date().toISOString(),
        twoFactorEnabled: false,
        status: 'active' as const,
      };

      setCurrentUser(targetUser);
      addActivityLog(`เข้าสู่ระบบผ่าน ${provider} สำเร็จ`, 'success');
      onSuccess(targetUser);
    }, 600);
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

      {/* One-Click Demo Switcher */}
      <div className="mb-6 p-3.5 bg-slate-100/80 dark:bg-slate-800/60 rounded-xl border border-slate-200/80 dark:border-slate-700/60">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>{t.quickDemoLogin}</span>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() => handleDemoSelect('pim@example.com', 'Password123!')}
            className={`px-2.5 py-1.5 text-left rounded-lg text-xs transition-all border ${
              selectedDemoUser === 'pim@example.com'
                ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-indigo-400'
            }`}
          >
            <div className="font-semibold truncate">พิมพ์ชนก (Pro)</div>
            <div className={`text-[10px] truncate ${selectedDemoUser === 'pim@example.com' ? 'text-indigo-100' : 'text-slate-400'}`}>
              pim@example.com
            </div>
          </button>

          <button
            type="button"
            onClick={() => handleDemoSelect('admin@example.com', 'Admin123!')}
            className={`px-2.5 py-1.5 text-left rounded-lg text-xs transition-all border ${
              selectedDemoUser === 'admin@example.com'
                ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-indigo-400'
            }`}
          >
            <div className="font-semibold truncate">กิตติศักดิ์ (Admin)</div>
            <div className={`text-[10px] truncate ${selectedDemoUser === 'admin@example.com' ? 'text-indigo-100' : 'text-slate-400'}`}>
              admin@example.com
            </div>
          </button>

          <button
            type="button"
            onClick={() => handleDemoSelect('somchai@example.com', 'Password123!')}
            className={`px-2.5 py-1.5 text-left rounded-lg text-xs transition-all border ${
              selectedDemoUser === 'somchai@example.com'
                ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-indigo-400'
            }`}
          >
            <div className="font-semibold truncate">สมชาย (Member)</div>
            <div className={`text-[10px] truncate ${selectedDemoUser === 'somchai@example.com' ? 'text-indigo-100' : 'text-slate-400'}`}>
              somchai@...
            </div>
          </button>
        </div>
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
          className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:scale-[0.99] disabled:opacity-60 transition-all shadow-md shadow-indigo-600/20"
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

      {/* Social Logins */}
      <div className="mt-6">
        <div className="relative flex items-center justify-center mb-4">
          <div className="border-t border-slate-200 dark:border-slate-800 w-full absolute" />
          <span className="bg-white dark:bg-slate-900 px-3 text-[11px] font-medium text-slate-500 dark:text-slate-400 relative">
            {t.orContinueWith}
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2.5">
          {/* LINE */}
          <button
            type="button"
            onClick={() => handleSocialLogin('LINE')}
            className="flex items-center justify-center gap-2 py-2 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-200 text-xs font-medium transition-all shadow-2xs"
          >
            <div className="w-4 h-4 rounded-full bg-[#06C755] flex items-center justify-center text-white text-[10px] font-bold">
              L
            </div>
            <span>LINE</span>
          </button>

          {/* Google */}
          <button
            type="button"
            onClick={() => handleSocialLogin('Google')}
            className="flex items-center justify-center gap-2 py-2 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-200 text-xs font-medium transition-all shadow-2xs"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.66v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.15z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.94H1.24v3.15C3.26 21.36 7.33 24 12 24z"
              />
              <path
                fill="#FBBC05"
                d="M5.28 14.26c-.25-.72-.38-1.49-.38-2.26s.13-1.54.38-2.26V6.59H1.24C.45 8.16 0 9.94 0 12s.45 3.84 1.24 5.41l4.04-3.15z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.24 6.59l4.04 3.15c.95-2.84 3.6-4.99 6.72-4.99z"
              />
            </svg>
            <span>Google</span>
          </button>

          {/* Apple */}
          <button
            type="button"
            onClick={() => handleSocialLogin('Apple')}
            className="flex items-center justify-center gap-2 py-2 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-200 text-xs font-medium transition-all shadow-2xs"
          >
            <svg className="w-4 h-4 fill-current" viewBox="0 0 170 170">
              <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.69-3.08-7.73-7.97-12.1-14.67-6.08-9.41-10.88-20.06-14.41-31.96-3.53-11.9-5.3-23.01-5.3-33.34 0-14.63 3.69-26.68 11.07-36.16 7.38-9.48 16.53-14.32 27.46-14.54 4.58 0 9.8 1.25 15.66 3.75 5.86 2.5 9.74 3.79 11.64 3.87 1.63 0 5.67-1.32 12.1-3.95 6.43-2.63 11.83-3.83 16.2-3.6 12.15.54 22.09 4.73 29.82 12.57-10.66 6.43-15.88 15.46-15.66 27.1.22 9.04 3.77 16.7 10.66 22.98 6.89 6.28 15.07 9.87 24.54 10.77-2.07 6.31-4.68 12.76-7.83 19.34zM119.22 31.86c0-7.39 2.68-14.28 8.04-20.67 5.36-6.39 12.01-10.45 19.95-12.19.22 1.3.33 2.39.33 3.27 0 7.28-2.82 14.18-8.47 20.7-5.65 6.52-12.39 10.37-20.21 11.55-.22-.87-.33-1.76-.33-2.66z" />
            </svg>
            <span>Apple</span>
          </button>
        </div>
      </div>

      {/* Switch to Register link & Track Application */}
      <div className="mt-6 pt-5 border-t border-slate-200 dark:border-slate-800 space-y-2.5 text-center text-xs text-slate-500 dark:text-slate-400">
        <p>
          {t.dontHaveAccount}{' '}
          <button
            type="button"
            onClick={onSwitchToRegister}
            className="font-bold text-indigo-600 dark:text-indigo-400 hover:underline inline-flex items-center gap-1"
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
            className="text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors flex items-center gap-1.5"
          >
            <span>🔍 {t.trackApplication}</span>
          </button>
          <span aria-hidden="true" className="text-slate-300 dark:text-slate-700">·</span>
          <button
            type="button"
            onClick={() => {
              window.dispatchEvent(new CustomEvent('open_cs_console'));
            }}
            className="text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors flex items-center gap-1.5"
          >
            <span>🛡️ {t.csConsole}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
