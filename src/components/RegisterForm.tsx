import React, { useState } from 'react';
import { User as UserIcon, Mail, Phone, Lock, Eye, EyeOff, ArrowRight, Check, AlertCircle, ShieldCheck } from 'lucide-react';
import { User, Language } from '../types/auth';
import { translations } from '../locales/translations';
import { checkPasswordStrength, getStoredUsers, saveUsers, savePassword, setCurrentUser, addActivityLog } from '../services/storage';
import { OtpVerificationModal } from './OtpVerificationModal';

interface RegisterFormProps {
  language: Language;
  onSuccess: (user: User) => void;
  onOpenTerms: () => void;
  onSwitchToLogin: () => void;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({
  language,
  onSuccess,
  onOpenTerms,
  onSwitchToLogin,
}) => {
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // OTP state
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [generatedOtp, setGeneratedOtp] = useState('742890');

  const t = translations[language];
  const strength = checkPasswordStrength(password);

  const handlePhoneChange = (val: string) => {
    // Basic Thai phone formatting (e.g. 081-234-5678)
    const digits = val.replace(/\D/g, '').slice(0, 10);
    let formatted = digits;
    if (digits.length > 3 && digits.length <= 6) {
      formatted = `${digits.slice(0, 3)}-${digits.slice(3)}`;
    } else if (digits.length > 6) {
      formatted = `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`;
    }
    setPhone(formatted);
  };

  const handleInitiateRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) {
      setErrorMsg(language === 'th' ? 'กรุณากรอกชื่อ-นามสกุล' : 'Please enter your full name');
      return;
    }
    if (!username.trim() || username.length < 3) {
      setErrorMsg(
        language === 'th' ? 'ชื่อผู้ใช้ต้องมีอย่างน้อย 3 ตัวอักษร' : 'Username must be at least 3 characters'
      );
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setErrorMsg(language === 'th' ? 'กรุณากรอกอีเมลให้ถูกต้อง' : 'Please enter a valid email address');
      return;
    }
    if (strength.score < 2) {
      setErrorMsg(
        language === 'th'
          ? 'รหัสผ่านเปราะบางเกินไป กรุณาใช้อย่างน้อย 8 ตัวอักษรพร้อมตัวเลขหรือสัญลักษณ์'
          : 'Password is too weak. Please use at least 8 characters with numbers or symbols.'
      );
      return;
    }
    if (password !== confirmPassword) {
      setErrorMsg(language === 'th' ? 'รหัสผ่านและยืนยันรหัสผ่านไม่ตรงกัน' : 'Passwords do not match');
      return;
    }
    if (!agreeTerms) {
      setErrorMsg(
        language === 'th'
          ? 'กรุณายอมรับข้อกำหนดการให้บริการและนโยบายความเป็นส่วนตัว'
          : 'Please agree to the Terms of Service and Privacy Policy'
      );
      return;
    }

    // Check duplicate
    const existingUsers = getStoredUsers();
    if (existingUsers.some((u) => u.email.toLowerCase() === email.trim().toLowerCase())) {
      setErrorMsg(
        language === 'th'
          ? 'อีเมลนี้มีผู้ใช้งานแล้ว กรุณาเข้าสู่ระบบหรือใช้อีเมลอื่น'
          : 'This email is already registered. Please sign in.'
      );
      return;
    }
    if (existingUsers.some((u) => u.username.toLowerCase() === username.trim().toLowerCase())) {
      setErrorMsg(
        language === 'th' ? 'ชื่อผู้ใช้นี้ถูกใช้งานแล้ว กรุณาเลือกชื่ออื่น' : 'This username is already taken'
      );
      return;
    }

    setErrorMsg('');
    // Generate a random 6-digit OTP for testing
    const randomOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(randomOtp);
    setShowOtpModal(true);
  };

  const handleOtpVerified = () => {
    setShowOtpModal(false);
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      const existingUsers = getStoredUsers();
      const newUser: User = {
        id: `usr_${Date.now()}`,
        name: fullName.trim(),
        username: username.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim() || '081-000-0000',
        role: 'member',
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(username.trim())}`,
        bio: language === 'th' ? 'สมาชิกใหม่ของ SiamAuth' : 'New SiamAuth member',
        createdAt: new Date().toISOString(),
        lastLoginAt: new Date().toISOString(),
        twoFactorEnabled: false,
        status: 'active',
      };

      const updatedUsers = [newUser, ...existingUsers];
      saveUsers(updatedUsers);
      savePassword(newUser.email, password);
      setCurrentUser(newUser);
      addActivityLog(`สมัครสมาชิกและเปิดใช้งานบัญชีสำเร็จ (${newUser.name})`, 'success');
      onSuccess(newUser);
    }, 400);
  };

  return (
    <div className="w-full">
      <div className="mb-5">
        <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          {t.createYourAccount}
        </h2>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          {t.registerSubtitle}
        </p>
      </div>

      <form onSubmit={handleInitiateRegister} className="space-y-3.5">
        {/* Full Name & Username in 2 columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              {t.fullName} <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <UserIcon className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder={t.fullNamePlaceholder}
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              {t.username} <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
              placeholder={t.usernamePlaceholder}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500 font-mono"
            />
          </div>
        </div>

        {/* Email & Phone */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              {t.email} <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t.emailPlaceholder}
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              {t.phone}
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="tel"
                value={phone}
                onChange={(e) => handlePhoneChange(e.target.value)}
                placeholder={t.phonePlaceholder}
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500 font-mono"
              />
            </div>
          </div>
        </div>

        {/* Password */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            {t.password} <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={t.passwordPlaceholder}
              className="w-full pl-9 pr-10 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          {/* Password Strength Meter */}
          {password && (
            <div className="mt-2 space-y-1.5">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-slate-500 dark:text-slate-400 font-medium">
                  {t.passwordStrength}:{' '}
                  <span
                    className={`font-semibold ${
                      strength.score <= 1
                        ? 'text-red-600 dark:text-red-400'
                        : strength.score === 2
                        ? 'text-amber-600 dark:text-amber-400'
                        : strength.score === 3
                        ? 'text-blue-600 dark:text-blue-400'
                        : 'text-emerald-600 dark:text-emerald-400'
                    }`}
                  >
                    {language === 'th' ? strength.labelTh : strength.labelEn}
                  </span>
                </span>
              </div>
              <div className="grid grid-cols-4 gap-1.5 h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${
                    strength.score >= 1 ? 'bg-red-500' : 'bg-transparent'
                  }`}
                />
                <div
                  className={`h-full rounded-full transition-all ${
                    strength.score >= 2 ? 'bg-amber-500' : 'bg-transparent'
                  }`}
                />
                <div
                  className={`h-full rounded-full transition-all ${
                    strength.score >= 3 ? 'bg-blue-500' : 'bg-transparent'
                  }`}
                />
                <div
                  className={`h-full rounded-full transition-all ${
                    strength.score >= 4 ? 'bg-emerald-500' : 'bg-transparent'
                  }`}
                />
              </div>

              {/* Requirement ticks */}
              <div className="grid grid-cols-2 gap-x-2 gap-y-1 pt-1 text-[11px] text-slate-500 dark:text-slate-400">
                <div className={`flex items-center gap-1 ${strength.hasLength ? 'text-emerald-600 dark:text-emerald-400 font-medium' : ''}`}>
                  <Check className={`w-3 h-3 ${strength.hasLength ? 'opacity-100' : 'opacity-30'}`} />
                  <span>{t.reqLength}</span>
                </div>
                <div className={`flex items-center gap-1 ${strength.hasLetter ? 'text-emerald-600 dark:text-emerald-400 font-medium' : ''}`}>
                  <Check className={`w-3 h-3 ${strength.hasLetter ? 'opacity-100' : 'opacity-30'}`} />
                  <span>{t.reqLetter}</span>
                </div>
                <div className={`flex items-center gap-1 ${strength.hasNumber ? 'text-emerald-600 dark:text-emerald-400 font-medium' : ''}`}>
                  <Check className={`w-3 h-3 ${strength.hasNumber ? 'opacity-100' : 'opacity-30'}`} />
                  <span>{t.reqNumber}</span>
                </div>
                <div className={`flex items-center gap-1 ${strength.hasSpecial ? 'text-emerald-600 dark:text-emerald-400 font-medium' : ''}`}>
                  <Check className={`w-3 h-3 ${strength.hasSpecial ? 'opacity-100' : 'opacity-30'}`} />
                  <span>{t.reqSpecial}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Confirm Password */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            {t.confirmPassword} <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type={showPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder={t.confirmPasswordPlaceholder}
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          {confirmPassword && (
            <p
              className={`text-[11px] mt-1 font-medium ${
                password === confirmPassword
                  ? 'text-emerald-600 dark:text-emerald-400'
                  : 'text-red-600 dark:text-red-400'
              }`}
            >
              {password === confirmPassword ? t.passwordsMatch : t.passwordsDoNotMatch}
            </p>
          )}
        </div>

        {/* Terms agreement checkbox */}
        <div className="pt-1">
          <label className="flex items-start gap-2.5 cursor-pointer text-xs text-slate-600 dark:text-slate-400">
            <input
              type="checkbox"
              checked={agreeTerms}
              onChange={(e) => setAgreeTerms(e.target.checked)}
              className="w-4 h-4 mt-0.5 rounded border-slate-300 dark:border-slate-700 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
            />
            <span className="leading-snug">
              {t.agreeToTerms}{' '}
              <button
                type="button"
                onClick={onOpenTerms}
                className="text-indigo-600 dark:text-indigo-400 underline font-medium hover:text-indigo-700"
              >
                {t.termsOfService}
              </button>{' '}
              {t.and}{' '}
              <button
                type="button"
                onClick={onOpenTerms}
                className="text-indigo-600 dark:text-indigo-400 underline font-medium hover:text-indigo-700"
              >
                {t.privacyPolicy}
              </button>
            </span>
          </label>
        </div>

        {/* Error message */}
        {errorMsg && (
          <div className="p-2.5 bg-red-50 dark:bg-red-950/40 rounded-xl border border-red-200 dark:border-red-900/50 flex items-start gap-2 text-xs text-red-700 dark:text-red-300">
            <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:scale-[0.99] disabled:opacity-60 transition-all shadow-md shadow-indigo-600/20"
        >
          {isSubmitting ? (
            <span>{language === 'th' ? 'กำลังสร้างบัญชี...' : 'Creating Account...'}</span>
          ) : (
            <>
              <span>{t.signUpButton}</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      {/* Switch to Login link */}
      <p className="mt-5 text-center text-xs text-slate-500 dark:text-slate-400">
        {t.alreadyHaveAccount}{' '}
        <button
          type="button"
          onClick={onSwitchToLogin}
          className="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
        >
          {t.login}
        </button>
      </p>

      {/* OTP verification dialog */}
      <OtpVerificationModal
        isOpen={showOtpModal}
        onClose={() => setShowOtpModal(false)}
        targetEmailOrPhone={phone || email}
        expectedOtp={generatedOtp}
        onSuccess={handleOtpVerified}
        language={language}
      />
    </div>
  );
};
