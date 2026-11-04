import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Clock,
  FileText,
  Building2,
  User,
  ArrowRight,
  Filter,
  Check,
} from 'lucide-react';
import { Language, RegistrationApplication } from '../types/auth';
import { translations } from '../locales/translations';
import { getStoredApplications, updateApplicationByCs, addActivityLog } from '../services/storage';

interface CsReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  onApplicationUpdated: () => void;
}

export const CsReviewModal: React.FC<CsReviewModalProps> = ({
  isOpen,
  onClose,
  language,
  onApplicationUpdated,
}) => {
  const [applications, setApplications] = useState<RegistrationApplication[]>(getStoredApplications());
  const [selectedApp, setSelectedApp] = useState<RegistrationApplication | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [reviewNote, setReviewNote] = useState<string>('');
  const [reviewerName, setReviewerName] = useState<string>('เจ้าหน้าที่ CS: ชนนิกานต์ (CS Support)');
  const [feedbackMsg, setFeedbackMsg] = useState<string>('');

  if (!isOpen) return null;
  const t = translations[language];

  const filtered = applications.filter((app) => {
    if (filterStatus === 'all') return true;
    return app.status === filterStatus;
  });

  const handleSelectApp = (app: RegistrationApplication) => {
    setSelectedApp(app);
    setReviewNote(app.csNotes || '');
    setFeedbackMsg('');
  };

  const handleUpdateStatus = (newStatus: 'approved' | 'needs_revision' | 'rejected') => {
    if (!selectedApp) return;

    const noteToSave =
      reviewNote.trim() ||
      (newStatus === 'approved'
        ? 'CS ตรวจสอบข้อมูล ภ.พ.20 และเอกสาร CA ถูกต้องครบถ้วน พร้อมเปิดใช้งานระบบ'
        : 'CS พบข้อผิดพลาด กรุณาแก้ไขข้อมูลหรือยื่นเอกสารเพิ่มเติม');

    const updated = updateApplicationByCs(selectedApp.id, newStatus, noteToSave, reviewerName);
    if (updated) {
      const refreshed = getStoredApplications();
      setApplications(refreshed);
      setSelectedApp(updated);
      setFeedbackMsg(
        newStatus === 'approved'
          ? `อนุมัติคำขอ ${updated.id} สำเร็จ! บัญชีผู้ใช้พร้อมใช้งานแล้ว`
          : `ส่งคำขอให้แก้ไขข้อมูล/ยื่นเอกสารใหม่ เรียบร้อยแล้ว`
      );
      addActivityLog(`เจ้าหน้าที่ CS ปรับสถานะคำขอ ${updated.id} เป็น [${newStatus}]`, newStatus === 'approved' ? 'success' : 'warning');
      onApplicationUpdated();
      setTimeout(() => setFeedbackMsg(''), 4000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-xs">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base flex items-center gap-2">
                <span>ระบบสำหรับเจ้าหน้าที่ CS (Customer Service Review Console)</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 font-mono">
                  FLOW STEP 4
                </span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                ตรวจสอบความถูกต้องครบถ้วนของข้อมูล ภ.พ.20 และเอกสาร CA พร้อมอนุมัติหรือส่งกลับให้ลูกค้าแก้ไข
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body: Left Queue + Right Detail */}
        <div className="grid grid-cols-1 lg:grid-cols-12 flex-1 overflow-hidden">
          {/* Left Column: Application Queue */}
          <div className="lg:col-span-4 border-r border-slate-200 dark:border-slate-800 flex flex-col bg-slate-50/50 dark:bg-slate-900/40">
            {/* Filter pills */}
            <div className="p-3 border-b border-slate-200 dark:border-slate-800 flex items-center gap-1 overflow-x-auto text-xs">
              <button
                type="button"
                onClick={() => setFilterStatus('all')}
                className={`px-2.5 py-1 rounded-lg font-medium whitespace-nowrap transition-colors ${
                  filterStatus === 'all'
                    ? 'bg-indigo-600 text-white shadow-2xs'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
                }`}
              >
                ทั้งหมด ({applications.length})
              </button>
              <button
                type="button"
                onClick={() => setFilterStatus('pending_cs')}
                className={`px-2.5 py-1 rounded-lg font-medium whitespace-nowrap transition-colors ${
                  filterStatus === 'pending_cs'
                    ? 'bg-rose-600 text-white shadow-2xs'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
                }`}
              >
                รอ CS ตรวจสอบ
              </button>
              <button
                type="button"
                onClick={() => setFilterStatus('needs_revision')}
                className={`px-2.5 py-1 rounded-lg font-medium whitespace-nowrap transition-colors ${
                  filterStatus === 'needs_revision'
                    ? 'bg-amber-600 text-white shadow-2xs'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
                }`}
              >
                รอแก้ไข
              </button>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
              {filtered.map((app) => (
                <div
                  key={app.id}
                  onClick={() => handleSelectApp(app)}
                  className={`p-3.5 cursor-pointer transition-all ${
                    selectedApp?.id === app.id
                      ? 'bg-indigo-50 dark:bg-indigo-950/50 border-l-4 border-indigo-600'
                      : 'hover:bg-slate-100/70 dark:hover:bg-slate-800/40'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono text-xs font-bold text-slate-900 dark:text-white">
                      {app.id}
                    </span>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                        app.status === 'approved'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          : app.status === 'needs_revision'
                          ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                          : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                      }`}
                    >
                      {app.status === 'approved' ? 'อนุมัติแล้ว' : app.status === 'needs_revision' ? 'รอแก้ไข' : 'รอ CS ตรวจ'}
                    </span>
                  </div>
                  <div className="font-semibold text-xs text-slate-800 dark:text-slate-200 truncate">
                    {app.companyName}
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                    {app.nswCategory}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Detailed Review & Decision Making */}
          <div className="lg:col-span-8 flex flex-col overflow-y-auto p-6 space-y-5">
            {feedbackMsg && (
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{feedbackMsg}</span>
              </div>
            )}

            {selectedApp ? (
              <>
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div>
                    <span className="text-xs text-slate-400 font-mono">คำขอเลขที่ {selectedApp.id}</span>
                    <h4 className="text-lg font-bold text-slate-900 dark:text-white">
                      {selectedApp.companyName}
                    </h4>
                  </div>

                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      selectedApp.status === 'approved'
                        ? 'bg-emerald-100 text-emerald-800'
                        : selectedApp.status === 'needs_revision'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    สถานะ: {selectedApp.status.toUpperCase()}
                  </span>
                </div>

                {/* Company ภ.พ.20 & NSW verification check */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 space-y-1">
                    <span className="text-slate-400 font-semibold block">ข้อมูลตาม ภ.พ.20</span>
                    <div><strong>เลขผู้เสียภาษี:</strong> {selectedApp.taxId}</div>
                    <div><strong>ประเภทสาขา:</strong> {selectedApp.branchType === 'headquarters' ? 'สำนักงานใหญ่' : `สาขาที่ ${selectedApp.branchNumber}`}</div>
                    <div><strong>ที่อยู่:</strong> {selectedApp.registeredAddress}</div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 space-y-1">
                    <span className="text-slate-400 font-semibold block">ข้อมูลผู้สมัคร & NSW</span>
                    <div><strong>Username:</strong> {selectedApp.username}</div>
                    <div><strong>หมวด:</strong> {selectedApp.nswCategory}</div>
                    <div><strong>NSW Profile:</strong> {selectedApp.nswProfile}</div>
                    <div><strong>ผู้ติดต่อ/e-Tax:</strong> {selectedApp.eTaxEmail} ({selectedApp.phone})</div>
                  </div>
                </div>

                {/* CA Documents Checklist */}
                <div>
                  <h5 className="font-semibold text-xs text-slate-900 dark:text-white mb-2">
                    เอกสารที่จำเป็นสำหรับการใช้งาน CA (Certificate Authority)
                  </h5>
                  <div className="space-y-2 text-xs">
                    {selectedApp.documents.map((doc) => (
                      <div
                        key={doc.id}
                        className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2.5 truncate">
                          <FileText className="w-4 h-4 text-sky-500 shrink-0" />
                          <div className="truncate">
                            <span className="font-semibold text-slate-900 dark:text-white">{doc.name}</span>
                            <span className="text-[11px] text-slate-400 block font-mono truncate">
                              {doc.fileName ? `${doc.fileName} (${doc.fileSize})` : '⚠️ ยังไม่ได้แนบไฟล์'}
                            </span>
                          </div>
                        </div>

                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                            doc.fileName
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                              : 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300'
                          }`}
                        >
                          {doc.fileName ? 'เอกสารครบ' : 'ขาดเอกสาร'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* CS Decision & Notes Form */}
                <div className="p-4 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900/60 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-indigo-900 dark:text-indigo-200">
                      บันทึกคำสั่งและผลการตรวจสอบจาก CS
                    </span>
                    <input
                      type="text"
                      value={reviewerName}
                      onChange={(e) => setReviewerName(e.target.value)}
                      className="text-[11px] px-2 py-1 rounded bg-white dark:bg-slate-800 border border-indigo-200 dark:border-indigo-800 font-mono text-slate-700 dark:text-slate-300"
                    />
                  </div>

                  <textarea
                    rows={2}
                    value={reviewNote}
                    onChange={(e) => setReviewNote(e.target.value)}
                    placeholder="ระบุความคิดเห็นจากเจ้าหน้าที่ CS เช่น เอกสารถูกต้องครบถ้วน หรือ ระบุสิ่งที่ลูกค้าต้องแก้ไข..."
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                  />

                  {/* Decision Buttons (as specified in diagram: "ให้ทาง CS ตรวจสอบข้อมูลถูกต้องครบ พร้อมใช้งาน หากข้อมูลไม่ถูกต้องให้ ลูกค้าแก้ไขข้อมูลหรือยื่นเอกสารแก้ไข") */}
                  <div className="flex items-center gap-3 pt-1 flex-wrap">
                    <button
                      type="button"
                      onClick={() => handleUpdateStatus('approved')}
                      className="flex-1 py-2.5 px-4 rounded-xl text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 transition-colors shadow-xs flex items-center justify-center gap-2"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>อนุมัติ (ข้อมูลถูกต้องครบ พร้อมใช้งาน)</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleUpdateStatus('needs_revision')}
                      className="flex-1 py-2.5 px-4 rounded-xl text-xs font-semibold text-amber-900 bg-amber-200 hover:bg-amber-300 dark:bg-amber-900/80 dark:text-amber-100 transition-colors flex items-center justify-center gap-2"
                    >
                      <AlertTriangle className="w-4 h-4" />
                      <span>ส่งกลับให้แก้ไขข้อมูล / ยื่นเอกสารแก้ไข</span>
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="py-20 text-center text-slate-400 text-sm">
                เลือกคำขอจากรายการทางซ้ายเพื่อเริ่มตรวจสอบ
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
