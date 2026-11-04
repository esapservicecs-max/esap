import React, { useState } from 'react';
import {
  Search,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ArrowRight,
  FileText,
  Building2,
  ShieldCheck,
  RefreshCw,
  ExternalLink,
} from 'lucide-react';
import { Language, RegistrationApplication, User } from '../types/auth';
import { translations } from '../locales/translations';
import { getStoredApplications, searchApplications, updateApplicationByCs } from '../services/storage';

interface ApplicationTrackerProps {
  language: Language;
  onEditApplication: (app: RegistrationApplication) => void;
  onLoginWithApprovedApp: (app: RegistrationApplication) => void;
  onBackToHome: () => void;
}

export const ApplicationTracker: React.FC<ApplicationTrackerProps> = ({
  language,
  onEditApplication,
  onLoginWithApprovedApp,
  onBackToHome,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedApp, setSelectedApp] = useState<RegistrationApplication | null>(null);
  const [searchResults, setSearchResults] = useState<RegistrationApplication[]>([]);
  const [searched, setSearched] = useState(false);

  const t = translations[language];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    const results = searchApplications(searchQuery);
    setSearchResults(results);
    setSelectedApp(results[0] || null);
    setSearched(true);
  };

  const allApps = getStoredApplications();

  return (
    <div className="w-full max-w-4xl mx-auto my-6 px-4">
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xl mb-6">
        <div className="mb-6 pb-4 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Search className="w-5 h-5 text-indigo-600" />
              <span>{t.trackApplication}</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              ค้นหาสถานะคำขอสมัครด้วยรหัสคำขอ (เช่น APP-2024-001) หรือเลขประจำตัวผู้เสียภาษี 13 หลัก
            </p>
          </div>

          <button
            type="button"
            onClick={onBackToHome}
            className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline self-start sm:self-auto"
          >
            ← กลับหน้าหลัก
          </button>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="mb-6">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ระบุรหัสคำขอ APP-XXXX หรือเลขผู้เสียภาษี 13 หลัก หรืออีเมล..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors shadow-xs"
            >
              ค้นหา
            </button>
          </div>

          {/* Quick preset badges */}
          <div className="flex items-center gap-2 mt-2.5 text-xs text-slate-500 flex-wrap">
            <span>ตัวอย่างคำขอในระบบ:</span>
            {allApps.slice(0, 3).map((app) => (
              <button
                key={app.id}
                type="button"
                onClick={() => {
                  setSearchQuery(app.id);
                  setSelectedApp(app);
                  setSearched(true);
                }}
                className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono text-[11px] hover:bg-slate-200"
              >
                {app.id} ({app.status === 'approved' ? 'อนุมัติ' : app.status === 'needs_revision' ? 'รอแก้ไข' : 'รอ CS'})
              </button>
            ))}
          </div>
        </form>

        {/* Detail view of selected application */}
        {selectedApp ? (
          <div className="space-y-6 pt-4 border-t border-slate-100 dark:border-slate-800">
            {/* Status Header */}
            <div
              className={`p-5 rounded-2xl border ${
                selectedApp.status === 'approved'
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800'
                  : selectedApp.status === 'needs_revision'
                  ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-800'
                  : 'bg-rose-50 dark:bg-rose-950/40 border-rose-300 dark:border-rose-900'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                      selectedApp.status === 'approved'
                        ? 'bg-emerald-600 text-white'
                        : selectedApp.status === 'needs_revision'
                        ? 'bg-amber-500 text-white'
                        : 'bg-rose-500 text-white'
                    }`}
                  >
                    {selectedApp.status === 'approved' ? (
                      <CheckCircle2 className="w-5 h-5" />
                    ) : selectedApp.status === 'needs_revision' ? (
                      <AlertTriangle className="w-5 h-5" />
                    ) : (
                      <Clock className="w-5 h-5" />
                    )}
                  </div>
                  <div>
                    <span className="font-mono text-xs text-slate-500 dark:text-slate-400">
                      รหัสคำขอ: {selectedApp.id}
                    </span>
                    <h3 className="font-bold text-base text-slate-900 dark:text-white">
                      {selectedApp.status === 'approved'
                        ? t.statusApproved
                        : selectedApp.status === 'needs_revision'
                        ? t.statusNeedsRevision
                        : t.statusPendingCs}
                    </h3>
                  </div>
                </div>

                <div className="text-right text-xs text-slate-500 font-mono">
                  <div>ยื่นเมื่อ: {new Date(selectedApp.submittedAt).toLocaleDateString('th-TH')}</div>
                  <div className="text-[11px] text-slate-400">ปรับปรุงล่าสุด: {new Date(selectedApp.updatedAt).toLocaleTimeString('th-TH')}</div>
                </div>
              </div>

              {/* CS Notes */}
              <div className="p-3.5 bg-white/80 dark:bg-slate-900/80 rounded-xl border border-slate-200 dark:border-slate-800 text-xs space-y-1">
                <div className="flex items-center justify-between text-slate-500">
                  <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-indigo-500" />
                    <span>ผลการตรวจสอบจากฝ่าย CS</span>
                  </span>
                  <span>{selectedApp.csReviewerName || 'Customer Service'}</span>
                </div>
                <p className="text-slate-800 dark:text-slate-200 font-medium">
                  {selectedApp.csNotes || 'เจ้าหน้าที่ CS กำลังตรวจสอบเอกสารตามลำดับคิว'}
                </p>
              </div>
            </div>

            {/* Application Data Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 space-y-1.5">
                <span className="text-slate-400 block">ข้อมูลสถานประกอบการ (ภ.พ.20)</span>
                <div className="font-bold text-slate-900 dark:text-white text-sm">{selectedApp.companyName}</div>
                <div className="font-mono text-slate-600 dark:text-slate-300">เลขประจำตัวผู้เสียภาษี: {selectedApp.taxId}</div>
                <div className="text-slate-600 dark:text-slate-300">{selectedApp.registeredAddress}</div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 space-y-1.5">
                <span className="text-slate-400 block">ข้อมูลบัญชี & หมวด NSW</span>
                <div className="font-bold text-slate-900 dark:text-white text-sm">@{selectedApp.username}</div>
                <div className="text-slate-600 dark:text-slate-300">หมวด: {selectedApp.nswCategory}</div>
                <div className="font-mono text-emerald-600 dark:text-emerald-400">NSW Profile: {selectedApp.nswProfile}</div>
                <div className="text-slate-500">{selectedApp.email} · {selectedApp.phone}</div>
              </div>
            </div>

            {/* Attached CA Documents */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
              <span className="text-slate-500 text-xs font-semibold block mb-2">
                เอกสารที่ยื่นสำหรับ Certificate Authority (CA)
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {selectedApp.documents.map((d) => (
                  <div
                    key={d.id}
                    className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2 truncate">
                      <FileText className="w-4 h-4 text-sky-500 shrink-0" />
                      <div className="truncate">
                        <div className="font-semibold text-slate-900 dark:text-white truncate">{d.name}</div>
                        <div className="text-[11px] text-slate-400 font-mono truncate">{d.fileName || 'ยังไม่ได้แนบไฟล์'}</div>
                      </div>
                    </div>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-semibold shrink-0 ${
                        d.fileName ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {d.fileName ? 'แนบแล้ว' : 'ยังไม่แนบ'}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons based on status */}
            <div className="flex items-center gap-3 pt-2">
              {selectedApp.status === 'approved' && (
                <button
                  type="button"
                  onClick={() => onLoginWithApprovedApp(selectedApp)}
                  className="px-6 py-3 rounded-xl text-xs sm:text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 transition-colors shadow-md flex items-center gap-2"
                >
                  <span>เข้าสู่ระบบด้วยบัญชีนี้ทันที</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}

              {selectedApp.status === 'needs_revision' && (
                <button
                  type="button"
                  onClick={() => onEditApplication(selectedApp)}
                  className="px-6 py-3 rounded-xl text-xs sm:text-sm font-semibold text-white bg-amber-600 hover:bg-amber-700 transition-colors shadow-md flex items-center gap-2"
                >
                  <span>แก้ไขข้อมูลหรือยื่นเอกสารแก้ไขตามที่ CS แจ้ง</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}

              <button
                type="button"
                onClick={onBackToHome}
                className="px-4 py-3 rounded-xl text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                กลับหน้าหลัก
              </button>
            </div>
          </div>
        ) : searched ? (
          <div className="py-8 text-center text-slate-500 text-sm">
            ไม่พบคำขอสมัครสมาชิกที่ตรงกับคำค้นหา กรุณาตรวจสอบรหัสคำขอหรือเลขประจำตัวผู้เสียภาษีอีกครั้ง
          </div>
        ) : null}
      </div>
    </div>
  );
};
