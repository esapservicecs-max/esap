import React, { useState } from 'react';
import { ShieldCheck, Lock, Shield, CheckCircle2, Award, Zap } from 'lucide-react';
import { User, Language } from '../types/auth';
import { translations } from '../locales/translations';
import { LoginForm } from './LoginForm';
import { RegisterForm } from './RegisterForm';
import { ForgotPasswordModal } from './ForgotPasswordModal';
import { TermsModal } from './TermsModal';
import { ASSETS } from '../services/storage';

interface AuthCardProps {
  mode: 'login' | 'register';
  onSwitchMode: (mode: 'login' | 'register') => void;
  language: Language;
  onLoginSuccess: (user: User) => void;
}

export const AuthCard: React.FC<AuthCardProps> = ({
  mode,
  onSwitchMode,
  language,
  onLoginSuccess,
}) => {
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [resetNotice, setResetNotice] = useState<string | null>(null);

  const t = translations[language];

  return (
    <div className="w-full max-w-5xl mx-auto my-6 sm:my-10 px-4">
      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-200/80 dark:border-slate-800 overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[640px]">
        {/* Left Side: Editorial & Brand Showcase */}
        <div className="relative hidden lg:flex lg:col-span-5 flex-col justify-between p-8 sm:p-10 bg-slate-950 text-white overflow-hidden">
          {/* Background Image with Deep Gradient Scrim */}
          <img
            src={ASSETS.showcase}
            alt="SiamAuth Secure Workspace"
            className="absolute inset-0 w-full h-full object-cover opacity-35 mix-blend-luminosity scale-105"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-indigo-950/50" />

          {/* Top Brand Element */}
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-xs font-medium text-indigo-200 mb-6 border border-white/10">
              <ShieldCheck className="w-4 h-4 text-indigo-400" />
              <span>Next-Gen Identity & Access</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white leading-tight">
              {language === 'th' ? (
                <>
                  เข้าถึงทุกบริการอย่างปลอดภัย{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-300 to-sky-300">
                    ด้วยระบบยืนยันตัวตนชั้นนำ
                  </span>
                </>
              ) : (
                <>
                  Secure Access to Every Service{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-300 to-sky-300">
                    with Digital Confidence
                  </span>
                </>
              )}
            </h2>
            <p className="mt-3 text-xs sm:text-sm text-slate-300 leading-relaxed">
              {language === 'th'
                ? 'ระบบพิสูจน์และยืนยันตัวตนดิจิทัลความเร็วสูง ปลอดภัยตามมาตรฐานสากล รองรับการทำงานร่วมกับองค์กรและธุรกิจทุกขนาด'
                : 'High-speed identity verification with bank-grade security protocols, designed for modern workflows and seamless user experiences.'}
            </p>
          </div>

          {/* Feature Highlights */}
          <div className="relative z-10 space-y-3.5 my-6">
            <div className="flex items-center gap-3 text-xs text-slate-200">
              <div className="w-6 h-6 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-3.5 h-3.5" />
              </div>
              <span>{t.featureSecured}</span>
            </div>
            <div className="flex items-center gap-3 text-xs text-slate-200">
              <div className="w-6 h-6 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-3.5 h-3.5" />
              </div>
              <span>{t.featurePdpa}</span>
            </div>
            <div className="flex items-center gap-3 text-xs text-slate-200">
              <div className="w-6 h-6 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-3.5 h-3.5" />
              </div>
              <span>{t.featureCloud}</span>
            </div>
          </div>

          {/* Trust Footer */}
          <div className="relative z-10 pt-4 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-400 font-mono">
            <span>THAILAND DIGITAL HUB</span>
            <span>TLS 1.3 / AES-256</span>
          </div>
        </div>

        {/* Right Side: Form Container */}
        <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-center">
          {/* Reset password notification notice if returned */}
          {resetNotice && (
            <div className="mb-4 p-3 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>{resetNotice}</span>
            </div>
          )}

          {mode === 'login' ? (
            <LoginForm
              language={language}
              onSuccess={onLoginSuccess}
              onForgotPassword={() => setShowForgotModal(true)}
              onSwitchToRegister={() => onSwitchMode('register')}
            />
          ) : (
            <RegisterForm
              language={language}
              onSuccess={onLoginSuccess}
              onOpenTerms={() => setShowTermsModal(true)}
              onSwitchToLogin={() => onSwitchMode('login')}
            />
          )}
        </div>
      </div>

      {/* Modals */}
      <ForgotPasswordModal
        isOpen={showForgotModal}
        onClose={() => setShowForgotModal(false)}
        language={language}
        onSuccess={(email) => {
          setResetNotice(
            language === 'th'
              ? `รหัสผ่านสำหรับ ${email} ได้รับการอัปเดตแล้ว สามารถเข้าสู่ระบบด้วยรหัสใหม่ได้ทันที`
              : `Password for ${email} has been updated. You can now sign in.`
          );
          setTimeout(() => setResetNotice(null), 6000);
        }}
      />

      <TermsModal
        isOpen={showTermsModal}
        onClose={() => setShowTermsModal(false)}
        language={language}
        onAccept={() => setShowTermsModal(false)}
      />
    </div>
  );
};
