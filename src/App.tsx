import React, { useState, useEffect } from 'react';
import { User, Language, RegistrationApplication, AuthMode } from './types/auth';
import { Navbar } from './components/Navbar';
import { AuthCard } from './components/AuthCard';
import { RegistrationFlow } from './components/RegistrationFlow';
import { ApplicationTracker } from './components/ApplicationTracker';
import { CsReviewModal } from './components/CsReviewModal';
import { MemberDashboard } from './components/MemberDashboard';
import { getCurrentUser, setCurrentUser, addActivityLog } from './services/storage';
import { translations } from './locales/translations';
import { Lock, RotateCcw, ShieldCheck, Search, Users } from 'lucide-react';

export default function App() {
  const [currentUser, setCurrentUserState] = useState<User | null>(() => getCurrentUser());
  const [authMode, setAuthMode] = useState<AuthMode>('register'); // Default to the requested 4-step registration workflow!
  const [editingApp, setEditingApp] = useState<RegistrationApplication | null>(null);
  const [showCsModal, setShowCsModal] = useState(false);
  const [language, setLanguage] = useState<Language>(() => {
    return (localStorage.getItem('siam_auth_lang_v2') as Language) || 'th';
  });
  const [isDark, setIsDark] = useState<boolean>(() => {
    const saved = localStorage.getItem('siam_auth_theme_v2');
    if (saved) return saved === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // Keep dark class synced with <html>
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('siam_auth_theme_v2', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('siam_auth_theme_v2', 'light');
    }
  }, [isDark]);

  // Listen to custom window events from subcomponents
  useEffect(() => {
    const handleOpenTrack = () => {
      setAuthMode('track_app');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    const handleOpenCs = () => {
      setShowCsModal(true);
    };

    window.addEventListener('open_track_app', handleOpenTrack);
    window.addEventListener('open_cs_console', handleOpenCs);

    return () => {
      window.removeEventListener('open_track_app', handleOpenTrack);
      window.removeEventListener('open_cs_console', handleOpenCs);
    };
  }, []);

  const handleToggleLanguage = () => {
    const nextLang = language === 'th' ? 'en' : 'th';
    setLanguage(nextLang);
    localStorage.setItem('siam_auth_lang_v2', nextLang);
  };

  const handleToggleTheme = () => {
    setIsDark(!isDark);
  };

  const handleLoginSuccess = (user: User) => {
    setCurrentUserState(user);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogout = () => {
    if (currentUser) {
      addActivityLog(`ออกจากระบบ (${currentUser.name})`, 'warning');
    }
    setCurrentUser(null);
    setCurrentUserState(null);
    setAuthMode('login');
  };

  const handleResetAllData = () => {
    if (
      window.confirm(
        language === 'th'
          ? 'คุณต้องการรีเซ็ตข้อมูลและบัญชีทดสอบทั้งหมดกลับเป็นค่าเริ่มต้นหรือไม่?'
          : 'Do you want to reset all mock users and applications to default?'
      )
    ) {
      localStorage.clear();
      window.location.reload();
    }
  };

  const t = translations[language];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      {/* Top Navbar */}
      <Navbar
        user={currentUser}
        language={language}
        onToggleLanguage={handleToggleLanguage}
        isDark={isDark}
        onToggleTheme={handleToggleTheme}
        onLogout={handleLogout}
        activeMode={authMode === 'register' ? 'register' : 'login'}
        onSwitchMode={(mode) => {
          setEditingApp(null);
          setAuthMode(mode);
        }}
      />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col items-center justify-start py-4 sm:py-8 w-full">
        {currentUser ? (
          <MemberDashboard
            user={currentUser}
            onUpdateUser={(updated) => setCurrentUserState(updated)}
            onLogout={handleLogout}
            language={language}
          />
        ) : authMode === 'track_app' ? (
          <ApplicationTracker
            language={language}
            onBackToHome={() => setAuthMode('login')}
            onEditApplication={(app) => {
              setEditingApp(app);
              setAuthMode('register');
            }}
            onLoginWithApprovedApp={(app) => {
              const approvedUser: User = {
                id: `usr_${Date.now()}`,
                name: app.companyNameTh || app.companyName || '',
                username: app.username,
                email: app.email || '',
                phone: app.phone || '',
                role: 'member',
                avatar: '/assets/images/member_avatar_male_1793780213414.jpg',
                bio: '',
                createdAt: app.submittedAt,
                lastLoginAt: new Date().toISOString(),
                twoFactorEnabled: false,
                status: 'active',
                companyName: app.companyName || '',
                companyNameTh: app.companyNameTh || '',
                companyNameEn: app.companyNameEn || '',
                taxId: app.taxId || '',
                nswProfile: app.nswProfile || '',
                nswCategory: app.nswCategory || '',
                applicationId: app.id,
                businessType: app.businessType || '',
                juristicNumber: app.juristicNumber || '',
                paperlessType: app.paperlessType || '',
              };
              setCurrentUser(approvedUser);
              setCurrentUserState(approvedUser);
            }}
          />
        ) : authMode === 'register' ? (
          <RegistrationFlow
            language={language}
            initialApplication={editingApp}
            onSwitchToLogin={() => setAuthMode('login')}
            onSuccessLogin={(user) => {
              setCurrentUserState(user);
            }}
          />
        ) : (
          <AuthCard
            mode="login"
            onSwitchMode={(mode) => {
              setEditingApp(null);
              setAuthMode(mode);
            }}
            language={language}
            onLoginSuccess={handleLoginSuccess}
          />
        )}
      </main>

      {/* CS Reviewer Console Modal (Step 4 Process Simulator) */}
      <CsReviewModal
        isOpen={showCsModal}
        onClose={() => setShowCsModal(false)}
        language={language}
        onApplicationUpdated={() => {
          // re-render current state if needed
        }}
      />

      {/* Clean Footer */}
      <footer className="w-full border-t border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/40 py-5 px-4 sm:px-6 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-700 dark:text-slate-300">
              © {new Date().getFullYear()} SiamAuth & NSW Single Window Portal
            </span>
            <span aria-hidden="true">·</span>
            <span>กระบวนการลงทะเบียนตามมาตรฐาน NSW & CA 4 ขั้นตอน</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setShowCsModal(true)}
              className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline flex items-center gap-1"
            >
              <Users className="w-3.5 h-3.5" />
              <span>เปิดระบบตรวจสอบ CS</span>
            </button>
            <span aria-hidden="true">·</span>
            <span className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
              <Lock className="w-3.5 h-3.5 text-emerald-500" />
              <span>TLS 1.3 / 256-bit SSL</span>
            </span>
            <span aria-hidden="true">·</span>
            <button
              type="button"
              onClick={handleResetAllData}
              title={language === 'th' ? 'รีเซ็ตข้อมูลตัวอย่างกลับเป็นค่าเริ่มต้น' : 'Reset mock data'}
              className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              <span>รีเซ็ตเดโม่</span>
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
