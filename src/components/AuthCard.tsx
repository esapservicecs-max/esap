import React, { useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { User, Language } from '../types/auth';
import { LoginForm } from './LoginForm';
import { RegisterForm } from './RegisterForm';
import { ForgotPasswordModal } from './ForgotPasswordModal';
import { TermsModal } from './TermsModal';

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

  return (
    <div className="w-full max-w-md mx-auto my-6 sm:my-10 px-4">
      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-200/80 dark:border-slate-800 p-6 sm:p-8">
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
