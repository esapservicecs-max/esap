import React from 'react';
import { X, ShieldCheck, FileText, CheckCircle2 } from 'lucide-react';
import { Language } from '../types/auth';
import { translations } from '../locales/translations';

interface TermsModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  onAccept?: () => void;
}

export const TermsModal: React.FC<TermsModalProps> = ({
  isOpen,
  onClose,
  language,
  onAccept,
}) => {
  if (!isOpen) return null;
  const t = translations[language];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-slate-900 dark:text-white">
                {language === 'th' ? 'ข้อกำหนดการใช้งานและนโยบายคุ้มครองข้อมูลส่วนบุคคล' : 'Terms of Service & Privacy Policy'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {language === 'th' ? 'สอดคล้องตาม พ.ร.บ. คุ้มครองข้อมูลส่วนบุคคล พ.ศ. 2562 (PDPA)' : 'In compliance with PDPA & International Data Protection Standards'}
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

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          {language === 'th' ? (
            <>
              <div className="p-3.5 bg-indigo-50 dark:bg-indigo-950/30 rounded-xl border border-indigo-100 dark:border-indigo-900/50 text-indigo-900 dark:text-indigo-200 flex items-start gap-2.5">
                <ShieldCheck className="w-5 h-5 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
                <span>
                  SiamAuth ให้ความสำคัญสูงสุดกับความปลอดภัยของข้อมูลส่วนบุคคลของท่าน ข้อมูลที่รวบรวมจะถูกเข้ารหัสระดับมาตรฐานสากล (AES-256) และไม่มีการเปิดเผยต่อบุคคลที่สามโดยไม่ได้รับความยินยอม
                </span>
              </div>

              <h4 className="font-semibold text-slate-900 dark:text-white text-sm">
                1. วัตถุประสงค์ในการเก็บรวบรวมข้อมูลส่วนบุคคล
              </h4>
              <p>
                ผู้ให้บริการจะเก็บรวบรวมข้อมูลส่วนบุคคลของท่าน เช่น ชื่อ นามสกุล ชื่อผู้ใช้ ที่อยู่อีเมล หมายเลขโทรศัพท์ และข้อมูลการเข้าใช้งานระบบ เพื่อวัตถุประสงค์ในการยืนยันตัวตน ให้บริการสมาชิก รักษาความปลอดภัยของบัญชีผู้ใช้ และการติดต่อสื่อสารที่จำเป็น
              </p>

              <h4 className="font-semibold text-slate-900 dark:text-white text-sm">
                2. การรักษาความมั่นคงปลอดภัยของข้อมูล
              </h4>
              <p>
                เราใช้มาตรการทางเทคนิคและการบริหารจัดการที่เข้มงวด รวมถึงการเข้ารหัสรหัสผ่านด้วยกระบวนการทางคณิตศาสตร์ความปลอดภัยสูง ระบบตรวจจับการเข้าใช้งานที่ผิดปกติ และการจำกัดสิทธิ์การเข้าถึงข้อมูลเฉพาะเจ้าหน้าที่ที่ได้รับอนุญาต
              </p>

              <h4 className="font-semibold text-slate-900 dark:text-white text-sm">
                3. สิทธิของเจ้าของข้อมูลส่วนบุคคล (ตาม พ.ร.บ. PDPA)
              </h4>
              <p>
                ท่านมีสิทธิในการขอเข้าถึง ขอรับสำเนา ขอแก้ไขข้อมูลส่วนบุคคลให้ถูกต้อง ขอระงับการใช้ หรือขอให้ลบทำลายข้อมูลส่วนบุคคลของท่านได้ตลอดเวลาผ่านแดชบอร์ดสมาชิกหรือการติดต่อฝ่ายบริการความปลอดภัย
              </p>

              <h4 className="font-semibold text-slate-900 dark:text-white text-sm">
                4. ข้อปฏิบัติและหน้าที่ของผู้ใช้งาน
              </h4>
              <p>
                ผู้ใช้งานตกลงว่าจะรักษาความลับของรหัสผ่านและข้อมูลรับรองตัวตน ไม่ยินยอมให้บุคคลอื่นใช้บัญชีของตน และไม่กระทำการใดๆ ที่ขัดต่อกฎหมายหรือส่งผลกระทบต่อความมั่นคงของระบบ
              </p>
            </>
          ) : (
            <>
              <div className="p-3.5 bg-indigo-50 dark:bg-indigo-950/30 rounded-xl border border-indigo-100 dark:border-indigo-900/50 text-indigo-900 dark:text-indigo-200 flex items-start gap-2.5">
                <ShieldCheck className="w-5 h-5 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
                <span>
                  SiamAuth adheres strictly to international privacy regulations and the Personal Data Protection Act (PDPA). All personal information is encrypted with bank-grade AES-256 protocols.
                </span>
              </div>

              <h4 className="font-semibold text-slate-900 dark:text-white text-sm">
                1. Data Collection & Purpose
              </h4>
              <p>
                We collect personal identifiers such as your name, email address, phone number, and authentication tokens strictly for identity verification, account recovery, security fraud prevention, and essential customer service communications.
              </p>

              <h4 className="font-semibold text-slate-900 dark:text-white text-sm">
                2. Information Security Standards
              </h4>
              <p>
                Passwords are cryptographically hashed and never stored in plain text. Multi-factor authentication mechanisms and anomaly detection algorithms protect your account around the clock.
              </p>

              <h4 className="font-semibold text-slate-900 dark:text-white text-sm">
                3. Your Rights as Data Subject
              </h4>
              <p>
                You retain full rights to access, rectify, restrict processing, or request the complete deletion of your account data directly from the member security dashboard.
              </p>
            </>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
          >
            {t.cancel}
          </button>
          {onAccept && (
            <button
              type="button"
              onClick={() => {
                onAccept();
                onClose();
              }}
              className="flex items-center gap-1.5 px-4 py-2 text-xs sm:text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors shadow-xs"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{language === 'th' ? 'ฉันเข้าใจและยอมรับ' : 'I Understand & Agree'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
