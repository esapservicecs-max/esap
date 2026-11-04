import React, { useState, useEffect, useRef } from 'react';
import { X, KeyRound, ShieldCheck, RefreshCw, CheckCircle2, ArrowRight } from 'lucide-react';
import { Language } from '../types/auth';
import { translations } from '../locales/translations';

interface OtpVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetEmailOrPhone: string;
  expectedOtp: string;
  onSuccess: () => void;
  language: Language;
}

export const OtpVerificationModal: React.FC<OtpVerificationModalProps> = ({
  isOpen,
  onClose,
  targetEmailOrPhone,
  expectedOtp,
  onSuccess,
  language,
}) => {
  const [digits, setDigits] = useState<string[]>(['', '', '', '', '', '']);
  const [countdown, setCountdown] = useState<number>(45);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const t = translations[language];

  useEffect(() => {
    if (isOpen) {
      setDigits(['', '', '', '', '', '']);
      setErrorMsg('');
      setCountdown(45);
      setTimeout(() => {
        inputRefs.current[0]?.focus();
      }, 100);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || countdown <= 0) return;
    const timer = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [isOpen, countdown]);

  if (!isOpen) return null;

  const handleChange = (index: number, value: string) => {
    const char = value.slice(-1);
    if (char && !/^\d+$/.test(char)) return;

    const nextDigits = [...digits];
    nextDigits[index] = char;
    setDigits(nextDigits);
    setErrorMsg('');

    if (char && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').trim();
    if (/^\d{6}$/.test(pasted)) {
      const split = pasted.split('');
      setDigits(split);
      inputRefs.current[5]?.focus();
    }
  };

  const handleAutoFill = () => {
    setDigits(expectedOtp.split(''));
    setErrorMsg('');
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const fullCode = digits.join('');
    if (fullCode.length < 6) {
      setErrorMsg(language === 'th' ? 'กรุณากรอกรหัส OTP ให้ครบ 6 หลัก' : 'Please enter all 6 digits of the OTP code');
      return;
    }

    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      if (fullCode === expectedOtp) {
        onSuccess();
      } else {
        setErrorMsg(language === 'th' ? 'รหัส OTP ไม่ถูกต้อง กรุณาลองใหม่อีกครั้ง' : 'Incorrect OTP code, please try again');
      }
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <KeyRound className="w-4 h-4" />
            </div>
            <h3 className="font-semibold text-slate-900 dark:text-white text-base">
              {t.otpTitle}
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
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mb-1">
            {t.otpSubtitle}
          </p>
          <p className="text-sm font-semibold text-slate-900 dark:text-white mb-4 tracking-wide font-mono">
            {targetEmailOrPhone}
          </p>

          {/* Demo hint with 1-click fill */}
          <div className="mb-6 p-3 bg-indigo-50 dark:bg-indigo-950/40 rounded-xl border border-indigo-100 dark:border-indigo-900/50 flex items-center justify-between gap-2">
            <div className="text-xs text-indigo-900 dark:text-indigo-200">
              <span className="font-medium">{t.otpDemoHint}</span>{' '}
              <span className="font-mono font-bold tracking-widest text-indigo-600 dark:text-indigo-400 ml-1">
                {expectedOtp}
              </span>
            </div>
            <button
              type="button"
              onClick={handleAutoFill}
              className="px-2.5 py-1 text-[11px] font-semibold text-indigo-700 dark:text-indigo-300 bg-indigo-100/70 dark:bg-indigo-900/60 hover:bg-indigo-200 dark:hover:bg-indigo-800 rounded-md transition-colors whitespace-nowrap"
            >
              {language === 'th' ? 'กรอกรหัสอัตโนมัติ' : 'Auto-fill'}
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            {/* 6 Digit Inputs */}
            <div className="flex items-center justify-between gap-2 mb-4">
              {digits.map((digit, idx) => (
                <input
                  key={idx}
                  ref={(el) => {
                    inputRefs.current[idx] = el;
                  }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(idx, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(idx, e)}
                  onPaste={handlePaste}
                  className="w-12 h-14 text-center text-xl font-bold font-mono rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all shadow-xs"
                />
              ))}
            </div>

            {errorMsg && (
              <p className="text-xs text-red-600 dark:text-red-400 mb-3 text-center font-medium animate-shake">
                {errorMsg}
              </p>
            )}

            <button
              type="submit"
              disabled={isVerifying}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:scale-[0.99] disabled:opacity-60 transition-all shadow-md shadow-indigo-600/20"
            >
              {isVerifying ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>{language === 'th' ? 'กำลังตรวจสอบ...' : 'Verifying...'}</span>
                </>
              ) : (
                <>
                  <span>{t.verifyOtpButton}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Resend OTP */}
          <div className="mt-5 text-center text-xs text-slate-500 dark:text-slate-400">
            {countdown > 0 ? (
              <span>
                {t.resendOtpCountdown.replace('{seconds}', countdown.toString())}
              </span>
            ) : (
              <button
                type="button"
                onClick={() => setCountdown(45)}
                className="font-medium text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                {t.resendOtp}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
