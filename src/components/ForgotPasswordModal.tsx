import React, { useState } from 'react';
import { X, Mail, KeyRound, CheckCircle2, ArrowRight, Lock, Eye, EyeOff } from 'lucide-react';
import { Language } from '../types/auth';
import { translations } from '../locales/translations';
import { getStoredUsers, savePassword } from '../services/storage';

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  onSuccess: (email: string) => void;
}

export const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({
  isOpen,
  onClose,
  language,
  onSuccess,
}) => {
  const [step, setStep] = useState<'email' | 'code' | 'new-password' | 'done'>('email');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const t = translations[language];

  if (!isOpen) return null;

  const handleSendCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setErrorMsg(language === 'th' ? 'กรุณากรอกอีเมล' : 'Please enter your email');
      return;
    }

    const users = getStoredUsers();
    const user = users.find((u) => u.email.toLowerCase() === email.trim().toLowerCase());
    if (!user) {
      setErrorMsg(
        language === 'th'
          ? 'ไม่พบบัญชีผู้ใช้นี้ในระบบ (ลองใช้ pim@example.com หรือ somchai@example.com)'
          : 'No account found with this email. (Try pim@example.com or somchai@example.com)'
      );
      return;
    }

    setErrorMsg('');
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setStep('code');
    }, 600);
  };

  const handleVerifyCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (code.trim() !== '889900') {
      setErrorMsg(
        language === 'th' ? 'รหัสยืนยันไม่ถูกต้อง กรุณากรอก 889900' : 'Invalid code. Please enter 889900'
      );
      return;
    }
    setErrorMsg('');
    setStep('new-password');
  };

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 8) {
      setErrorMsg(
        language === 'th' ? 'รหัสผ่านใหม่ต้องมีความยาวอย่างน้อย 8 ตัวอักษร' : 'New password must be at least 8 characters'
      );
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setErrorMsg(
        language === 'th' ? 'รหัสผ่านและยืนยันรหัสผ่านไม่ตรงกัน' : 'Passwords do not match'
      );
      return;
    }

    savePassword(email.trim(), newPassword);
    setStep('done');
  };

  const handleFinish = () => {
    onSuccess(email);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <KeyRound className="w-4 h-4" />
            </div>
            <h3 className="font-semibold text-slate-900 dark:text-white text-base">
              {t.forgotTitle}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {step === 'email' && (
            <form onSubmit={handleSendCode}>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mb-4">
                {t.forgotSubtitle}
              </p>

              <div className="mb-4">
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                  {t.email}
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setErrorMsg('');
                    }}
                    placeholder={t.emailPlaceholder}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              {errorMsg && (
                <p className="text-xs text-red-600 dark:text-red-400 mb-3 font-medium">
                  {errorMsg}
                </p>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition-all disabled:opacity-60"
              >
                {isLoading ? (
                  <span>{language === 'th' ? 'กำลังส่งข้อมูล...' : 'Sending...'}</span>
                ) : (
                  <>
                    <span>{t.sendResetLink}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

          {step === 'code' && (
            <form onSubmit={handleVerifyCode}>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mb-3">
                {language === 'th'
                  ? `ระบบจำลองส่งรหัสยืนยัน 6 หลักไปยัง ${email}`
                  : `A verification code was simulated for ${email}`}
              </p>

              <div className="mb-4 p-3 bg-amber-50 dark:bg-amber-950/30 rounded-xl border border-amber-200 dark:border-amber-900 text-xs text-amber-900 dark:text-amber-200 flex items-center justify-between">
                <span>
                  {language === 'th' ? 'รหัสทดสอบสำหรับรีเซ็ต:' : 'Test recovery code:'}{' '}
                  <strong className="font-mono text-sm ml-1">889900</strong>
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setCode('889900');
                    setErrorMsg('');
                  }}
                  className="px-2 py-1 bg-amber-200/70 dark:bg-amber-800 text-amber-950 dark:text-amber-100 rounded text-[11px] font-medium"
                >
                  {language === 'th' ? 'กรอกเลย' : 'Use'}
                </button>
              </div>

              <div className="mb-4">
                <input
                  type="text"
                  maxLength={6}
                  value={code}
                  onChange={(e) => {
                    setCode(e.target.value);
                    setErrorMsg('');
                  }}
                  placeholder="889900"
                  className="w-full text-center tracking-widest font-mono text-xl py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              {errorMsg && (
                <p className="text-xs text-red-600 dark:text-red-400 mb-3 font-medium text-center">
                  {errorMsg}
                </p>
              )}

              <button
                type="submit"
                className="w-full py-2.5 px-4 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition-all"
              >
                {language === 'th' ? 'ตรวจสอบรหัส' : 'Verify Code'}
              </button>
            </form>
          )}

          {step === 'new-password' && (
            <form onSubmit={handleResetPassword}>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mb-4">
                {language === 'th' ? 'กำหนดรหัสผ่านใหม่สำหรับบัญชีนี้' : 'Set a new password for your account'}
              </p>

              <div className="mb-3">
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  {t.newPassword}
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder={t.passwordPlaceholder}
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  {t.confirmPassword}
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                    placeholder={t.confirmPasswordPlaceholder}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm"
                  />
                </div>
              </div>

              {errorMsg && (
                <p className="text-xs text-red-600 dark:text-red-400 mb-3 font-medium">
                  {errorMsg}
                </p>
              )}

              <button
                type="submit"
                className="w-full py-2.5 px-4 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition-all"
              >
                {t.updatePasswordButton}
              </button>
            </form>
          )}

          {step === 'done' && (
            <div className="text-center py-4">
              <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto mb-3">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-slate-900 dark:text-white text-base mb-1">
                {t.resetSuccessTitle}
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 mb-6">
                {t.resetSuccessDesc}
              </p>
              <button
                type="button"
                onClick={handleFinish}
                className="w-full py-2.5 px-4 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition-all"
              >
                {t.backToLogin}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
