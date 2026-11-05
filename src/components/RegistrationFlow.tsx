import React, { useState } from 'react';
import {
  CheckCircle2,
  AlertCircle,
  Upload,
  FileText,
  Trash2,
  Eye,
  EyeOff,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  ShieldCheck,
  Building2,
  Clock,
  RotateCcw,
  Check,
  AlertTriangle,
  RefreshCw,
  Zap,
  MapPin,
  Phone,
  Mail,
  User as UserIcon,
} from 'lucide-react';
import { Language, RegistrationApplication, CaDocument, User } from '../types/auth';
import { translations } from '../locales/translations';
import {
  checkPasswordStrength,
  saveOrUpdateApplication,
  updateApplicationByCs,
  setCurrentUser,
  addActivityLog,
  getStoredUsers,
  saveUsers,
  savePassword,
} from '../services/storage';

interface RegistrationFlowProps {
  language: Language;
  onSuccessLogin: (user: User) => void;
  onSwitchToLogin: () => void;
  initialApplication?: RegistrationApplication | null;
}

export const RegistrationFlow: React.FC<RegistrationFlowProps> = ({
  language,
  onSuccessLogin,
  onSwitchToLogin,
  initialApplication,
}) => {
  const [currentStep, setCurrentStep] = useState<number>(initialApplication ? 3 : 1);
  const [errorMsg, setErrorMsg] = useState<string>('');

  // Step 1: User & NSW
  const [username, setUsername] = useState(initialApplication?.username || '');
  const [password, setPassword] = useState(initialApplication?.password || '');
  const [confirmPassword, setConfirmPassword] = useState(initialApplication?.password || '');
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState(initialApplication?.email || '');
  const [phone, setPhone] = useState(initialApplication?.phone || '');
  const [selectedNswCategories, setSelectedNswCategories] = useState<string[]>(() => {
    if (!initialApplication?.nswCategory) return [];
    return initialApplication.nswCategory.split(',').map((s) => s.trim()).filter(Boolean);
  });
  const [nswProfile, setNswProfile] = useState(initialApplication?.nswProfile || '');

  const toggleNswCategory = (category: string) => {
    setSelectedNswCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]
    );
  };

  // Step 2: ESAP Paperless ebXML Application Form (ตามรูปที่แนบ)
  // Section 1: Ref ID Paperless Type
  const [paperlessType, setPaperlessType] = useState<string>(
    initialApplication?.paperlessType || ''
  );
  const [refIdTest, setRefIdTest] = useState(initialApplication?.refIdTest || '');
  const [refIdProduction, setRefIdProduction] = useState(initialApplication?.refIdProduction || '');

  // Section 2: ข้อมูลผู้ขอใช้บริการ
  const [companyNameTh, setCompanyNameTh] = useState(
    initialApplication?.companyNameTh || initialApplication?.companyName || ''
  );
  const [companyNameEn, setCompanyNameEn] = useState(initialApplication?.companyNameEn || '');
  const [businessType, setBusinessType] = useState(initialApplication?.businessType || '');
  const [juristicNumber, setJuristicNumber] = useState(initialApplication?.juristicNumber || '');
  const [taxId, setTaxId] = useState(initialApplication?.taxId || '');
  const [branchType, setBranchType] = useState<string>(
    initialApplication?.branchType || ''
  );
  const [branchNumber, setBranchNumber] = useState(initialApplication?.branchNumber || '');

  // Section 3: สถานที่จัดส่งใบแจ้งค่าใช้บริการ/วางบิล
  const [billingHouseNo, setBillingHouseNo] = useState(initialApplication?.billingHouseNo || '');
  const [billingMoo, setBillingMoo] = useState(initialApplication?.billingMoo || '');
  const [billingBuilding, setBillingBuilding] = useState(initialApplication?.billingBuilding || '');
  const [billingSoi, setBillingSoi] = useState(initialApplication?.billingSoi || '');
  const [billingRoad, setBillingRoad] = useState(initialApplication?.billingRoad || '');
  const [billingSubDistrict, setBillingSubDistrict] = useState(initialApplication?.billingSubDistrict || '');
  const [billingDistrict, setBillingDistrict] = useState(initialApplication?.billingDistrict || '');
  const [billingProvince, setBillingProvince] = useState(initialApplication?.billingProvince || '');
  const [billingPostalCode, setBillingPostalCode] = useState(initialApplication?.billingPostalCode || '');
  const [billingPhone, setBillingPhone] = useState(initialApplication?.billingPhone || '');
  const [billingFax, setBillingFax] = useState(initialApplication?.billingFax || '');
  const [billingEmail, setBillingEmail] = useState(initialApplication?.billingEmail || '');

  // Section 4: สถานที่ติดตั้งระบบ
  const [installSameAsBilling, setInstallSameAsBilling] = useState<boolean>(
    initialApplication ? initialApplication.installSameAsBilling : true
  );
  const [installHouseNo, setInstallHouseNo] = useState(initialApplication?.installHouseNo || '');
  const [installMoo, setInstallMoo] = useState(initialApplication?.installMoo || '');
  const [installBuilding, setInstallBuilding] = useState(initialApplication?.installBuilding || '');
  const [installSoi, setInstallSoi] = useState(initialApplication?.installSoi || '');
  const [installRoad, setInstallRoad] = useState(initialApplication?.installRoad || '');
  const [installSubDistrict, setInstallSubDistrict] = useState(initialApplication?.installSubDistrict || '');
  const [installDistrict, setInstallDistrict] = useState(initialApplication?.installDistrict || '');
  const [installProvince, setInstallProvince] = useState(initialApplication?.installProvince || '');
  const [installPostalCode, setInstallPostalCode] = useState(initialApplication?.installPostalCode || '');
  const [installPhone, setInstallPhone] = useState(initialApplication?.installPhone || '');
  const [installFax, setInstallFax] = useState(initialApplication?.installFax || '');
  const [installEmail, setInstallEmail] = useState(initialApplication?.installEmail || '');

  // Section 5: ข้อมูลติดต่อ/ผู้ประสานงาน
  const [contactPrefix, setContactPrefix] = useState<string>(
    initialApplication?.contactPrefix || ''
  );
  const [contactFirstName, setContactFirstName] = useState(initialApplication?.contactFirstName || '');
  const [contactLastName, setContactLastName] = useState(initialApplication?.contactLastName || '');
  const [contactPosition, setContactPosition] = useState(initialApplication?.contactPosition || '');
  const [contactPhone, setContactPhone] = useState(initialApplication?.contactPhone || '');
  const [contactMobile, setContactMobile] = useState(initialApplication?.contactMobile || '');
  const [contactEmail, setContactEmail] = useState(initialApplication?.contactEmail || '');

  // Step 3: CA Documents
  const [documents, setDocuments] = useState<CaDocument[]>(
    initialApplication?.documents || [
      {
        id: 'doc_1',
        name: 'สำเนา ภ.พ.20 (ภพ.20)',
        type: 'pp20',
        fileName: '',
        fileSize: '',
        uploadedAt: '',
        status: 'pending',
      },
      {
        id: 'doc_2',
        name: 'หนังสือรับรองนิติบุคคล (DBD คัดสำเนาไม่เกิน 6 เดือน)',
        type: 'company_cert',
        fileName: '',
        fileSize: '',
        uploadedAt: '',
        status: 'pending',
      },
      {
        id: 'doc_3',
        name: 'สำเนาบัตรประชาชนกรรมการผู้มีอำนาจ (พร้อมลงนามรับรอง)',
        type: 'director_id',
        fileName: '',
        fileSize: '',
        uploadedAt: '',
        status: 'pending',
      },
      {
        id: 'doc_4',
        name: 'เอกสารคำขอใช้งาน Digital Certificate / ใบสมัคร CA',
        type: 'ca_request',
        fileName: '',
        fileSize: '',
        uploadedAt: '',
        status: 'pending',
      },
    ]
  );

  // Step 4: Application Record
  const [submittedApp, setSubmittedApp] = useState<RegistrationApplication | null>(initialApplication || null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [csSimulating, setCsSimulating] = useState(false);

  const t = translations[language];
  const strength = checkPasswordStrength(password || 'Password123!');

  // NSW category options
  const nswCategories = [
    'NSW Gateway (ระบบเชื่อมโยงข้อมูลศุลกากร)',
    'นำเข้า-ส่งออกทั่วไป (Import / Export Customs Clearance)',
    'คลังสินค้าทัณฑ์บนและเขตปลอดอากร (Bonded Warehouse / Free Zone)',
    'ระบบใบกำกับภาษีอิเล็กทรอนิกส์ (e-Tax Invoice / e-Receipt)',
    'ตัวแทนออกของและชิปปิ้ง (Customs Broker)',
    'ผู้ประกอบการขนส่งสินค้าระหว่างประเทศ (Freight Forwarder / Carrier)',
  ];

  // Auto fill entire form with full realistic ESAP data
  const handleAutoFillSampleData = () => {
    const randomSuffix = Math.floor(100 + Math.random() * 900);
    setUsername(`thai_trader_${randomSuffix}`);
    setPassword('Pass@2024Secure');
    setConfirmPassword('Pass@2024Secure');
    setEmail(`trader${randomSuffix}@esapservice.co.th`);
    setPhone('089-555-8899');
    setSelectedNswCategories([
      'NSW Gateway (ระบบเชื่อมโยงข้อมูลศุลกากร)',
      'นำเข้า-ส่งออกทั่วไป (Import / Export Customs Clearance)',
    ]);
    setNswProfile(`NSW-TH-2024-${randomSuffix}99`);

    // ESAP Form Data
    setPaperlessType('Exporter/Importer');
    setRefIdTest(`TEST-EXP-${randomSuffix}`);
    setRefIdProduction(`PROD-EXP-${randomSuffix}`);
    setCompanyNameTh(`บริษัท ไทย ลอจิสติกส์ อินเตอร์เทรด ${randomSuffix} จำกัด`);
    setCompanyNameEn(`Thai Logistics Intertrade ${randomSuffix} Co., Ltd.`);
    setBusinessType('บริการนำเข้าและส่งออกสินค้าอุตสาหกรรม และโลจิสติกส์');
    setJuristicNumber(`01055580${randomSuffix}88`);
    setTaxId(`01055580${randomSuffix}88`);
    setBranchType('headquarters');
    setBranchNumber('00000');

    // Billing Address
    setBillingHouseNo('888/45');
    setBillingMoo('3');
    setBillingBuilding('อาคารบางกอกบิสซิเนสเซ็นเตอร์ ชั้น 12');
    setBillingSoi('สุขุมวิท 63');
    setBillingRoad('ถนนสุขุมวิท');
    setBillingSubDistrict('คลองตันเหนือ');
    setBillingDistrict('วัฒนา');
    setBillingProvince('กรุงเทพมหานคร');
    setBillingPostalCode('10110');
    setBillingPhone('02-714-8899');
    setBillingFax('02-714-8898');
    setBillingEmail(`billing${randomSuffix}@esapservice.co.th`);

    // Install Address
    setInstallSameAsBilling(true);

    // Contact
    setContactPrefix('นาย');
    setContactFirstName('ชลธาร');
    setContactLastName('สมบูรณ์สุข');
    setContactPosition('ผู้จัดการแผนกพิธีการศุลกากร (Import/Export)');
    setContactPhone('02-714-8899 ต่อ 104');
    setContactMobile('089-555-8899');
    setContactEmail(`choltarn@esapservice.co.th`);

    // Attach sample documents
    setDocuments([
      {
        id: 'doc_1',
        name: 'สำเนา ภ.พ.20 (ภพ.20)',
        type: 'pp20',
        fileName: 'PP20_Verified_2024.pdf',
        fileSize: '1.2 MB',
        uploadedAt: new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }),
        status: 'valid',
      },
      {
        id: 'doc_2',
        name: 'หนังสือรับรองนิติบุคคล (DBD คัดสำเนาไม่เกิน 6 เดือน)',
        type: 'company_cert',
        fileName: 'DBD_Certificate_Latest.pdf',
        fileSize: '2.4 MB',
        uploadedAt: new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }),
        status: 'valid',
      },
      {
        id: 'doc_3',
        name: 'สำเนาบัตรประชาชนกรรมการผู้มีอำนาจ (พร้อมลงนามรับรอง)',
        type: 'director_id',
        fileName: 'Director_Thai_ID_Signed.jpg',
        fileSize: '950 KB',
        uploadedAt: new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }),
        status: 'valid',
      },
      {
        id: 'doc_4',
        name: 'เอกสารคำขอใช้งาน Digital Certificate / ใบสมัคร CA',
        type: 'ca_request',
        fileName: 'CA_Application_Form_Filled.pdf',
        fileSize: '1.8 MB',
        uploadedAt: new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }),
        status: 'valid',
      },
    ]);

    setErrorMsg('');
  };

  // Step 1: No mandatory blocking!
  const handleNextFromStep1 = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setCurrentStep(2);
    window.scrollTo({ top: 100, behavior: 'smooth' });
  };

  // Step 2: No mandatory blocking!
  const handleNextFromStep2 = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setCurrentStep(3);
    window.scrollTo({ top: 100, behavior: 'smooth' });
  };

  // Document upload simulation
  const handleSimulateFileUpload = (docId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const sizeFormatted = (file.size / (1024 * 1024)).toFixed(1) + ' MB';
    setDocuments((prev) =>
      prev.map((d) =>
        d.id === docId
          ? {
              ...d,
              fileName: file.name,
              fileSize: sizeFormatted,
              uploadedAt: new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }),
              status: 'valid',
            }
          : d
      )
    );
  };

  const handleRemoveDoc = (docId: string) => {
    setDocuments((prev) =>
      prev.map((d) =>
        d.id === docId ? { ...d, fileName: '', fileSize: '', uploadedAt: '', status: 'pending' } : d
      )
    );
  };

  // Registration completion helper
  const completeRegistrationAndGoToDashboard = () => {
    setIsSubmitting(true);

    const finalUsername = username.trim() || `user_${Date.now().toString().slice(-4)}`;
    const finalPassword = password || '';
    const finalEmail = email.trim();
    const finalPhone = phone.trim();
    const finalNswCategory = selectedNswCategories.join(', ');
    const finalNswProfile = nswProfile.trim();
    const finalCompanyName = companyNameTh.trim();
    const finalCompanyNameEn = companyNameEn.trim();
    const finalTaxId = taxId.trim().replace(/\D/g, '');
    const finalJuristic = juristicNumber.trim() || (finalTaxId ? finalTaxId : '');
    const finalBusinessType = businessType.trim();

    // Formulate registered address only from fields actually entered
    const addrParts = [
      billingHouseNo.trim() ? `เลขที่ ${billingHouseNo.trim()}` : '',
      billingMoo.trim() && billingMoo.trim() !== '-' ? `หมู่ ${billingMoo.trim()}` : '',
      billingBuilding.trim() ? billingBuilding.trim() : '',
      billingSoi.trim() && billingSoi.trim() !== '-' ? `ซอย ${billingSoi.trim()}` : '',
      billingRoad.trim() ? `ถนน ${billingRoad.trim()}` : '',
      billingSubDistrict.trim() ? `แขวง/ตำบล ${billingSubDistrict.trim()}` : '',
      billingDistrict.trim() ? `เขต/อำเภอ ${billingDistrict.trim()}` : '',
      billingProvince.trim() ? `จังหวัด ${billingProvince.trim()}` : '',
      billingPostalCode.trim() ? billingPostalCode.trim() : '',
    ]
      .filter(Boolean)
      .join(' ');

    // Only keep documents that the user actually uploaded
    const finalDocs: CaDocument[] = documents.map((d) => ({
      ...d,
      fileName: d.fileName || '',
      fileSize: d.fileSize || '',
      uploadedAt: d.uploadedAt || '',
      status: d.fileName ? 'valid' : 'pending',
    }));

    const newAppId = `APP-ESAP-${Math.floor(10000 + Math.random() * 90000)}`;
    const application: RegistrationApplication = {
      id: submittedApp ? submittedApp.id : newAppId,
      username: finalUsername,
      password: finalPassword,
      email: finalEmail,
      phone: finalPhone,
      nswCategory: finalNswCategory,
      nswProfile: finalNswProfile,
      paperlessType,
      refIdTest: refIdTest.trim(),
      refIdProduction: refIdProduction.trim(),
      companyName: finalCompanyName,
      companyNameTh: finalCompanyName,
      companyNameEn: finalCompanyNameEn,
      businessType: finalBusinessType,
      juristicNumber: finalJuristic,
      taxId: finalTaxId,
      branchType,
      branchNumber: branchType === 'branch' ? branchNumber.trim() : '',

      billingHouseNo: billingHouseNo.trim(),
      billingMoo: billingMoo.trim(),
      billingBuilding: billingBuilding.trim(),
      billingSoi: billingSoi.trim(),
      billingRoad: billingRoad.trim(),
      billingSubDistrict: billingSubDistrict.trim(),
      billingDistrict: billingDistrict.trim(),
      billingProvince: billingProvince.trim(),
      billingPostalCode: billingPostalCode.trim(),
      billingPhone: billingPhone.trim(),
      billingFax: billingFax.trim(),
      billingEmail: billingEmail.trim(),

      installSameAsBilling,
      installHouseNo: installHouseNo.trim(),
      installMoo: installMoo.trim(),
      installBuilding: installBuilding.trim(),
      installSoi: installSoi.trim(),
      installRoad: installRoad.trim(),
      installSubDistrict: installSubDistrict.trim(),
      installDistrict: installDistrict.trim(),
      installProvince: installProvince.trim(),
      installPostalCode: installPostalCode.trim(),
      installPhone: installPhone.trim(),
      installFax: installFax.trim(),
      installEmail: installEmail.trim(),

      contactPrefix: (contactFirstName.trim() || contactLastName.trim()) ? contactPrefix : '',
      contactFirstName: contactFirstName.trim(),
      contactLastName: contactLastName.trim(),
      contactPosition: contactPosition.trim(),
      contactPhone: contactPhone.trim(),
      contactMobile: contactMobile.trim(),
      contactEmail: contactEmail.trim(),

      registeredAddress: addrParts,
      billingAddressSameAsPp20: true,
      eTaxEmail: billingEmail.trim() || finalEmail,
      billingContactName: `${contactPrefix} ${contactFirstName} ${contactLastName}`.trim(),
      billingContactPhone: contactMobile.trim() || finalPhone,

      documents: finalDocs,
      status: 'approved',
      submittedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      csNotes: 'คำขอสมัครสมาชิกโปรแกรม ESAP บันทึกข้อมูลและเปิดใช้งานบัญชีเรียบร้อยแล้ว',
    };

    saveOrUpdateApplication(application);

    const contactFullName = `${contactPrefix ? contactPrefix + ' ' : ''}${contactFirstName.trim()} ${contactLastName.trim()}`.trim();
    const finalName = finalCompanyName || contactFullName || '';

    // Create user in system and log in directly with exact registered data
    const newUser: User = {
      id: `usr_${Date.now()}`,
      name: finalName,
      username: finalUsername,
      email: finalEmail,
      phone: finalPhone,
      role: 'member',
      avatar: '/assets/images/member_avatar_male_1793780213414.jpg',
      bio: '',
      createdAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString(),
      twoFactorEnabled: false,
      status: 'active',
      companyName: finalCompanyName,
      companyNameTh: finalCompanyName,
      companyNameEn: finalCompanyNameEn,
      taxId: finalTaxId,
      nswProfile: finalNswProfile,
      nswCategory: finalNswCategory,
      applicationId: application.id,
      businessType: finalBusinessType,
      juristicNumber: finalJuristic,
      paperlessType: paperlessType,
    };

    const existingUsers = getStoredUsers();
    saveUsers([
      newUser,
      ...existingUsers.filter(
        (u) =>
          (finalEmail && u.email.toLowerCase() !== finalEmail.toLowerCase()) ||
          (!finalEmail && u.username.toLowerCase() !== finalUsername.toLowerCase())
      ),
    ]);
    if (finalEmail) savePassword(finalEmail, finalPassword);
    if (finalUsername) savePassword(finalUsername, finalPassword);
    setCurrentUser(newUser);
    addActivityLog(`สมัครสมาชิกสำเร็จ (@${finalUsername})`, 'success');

    setTimeout(() => {
      setIsSubmitting(false);
      onSuccessLogin(newUser);
    }, 450);
  };

  const handleSubmitToCs = (e: React.FormEvent) => {
    e.preventDefault();
    completeRegistrationAndGoToDashboard();
  };

  return (
    <div className="w-full max-w-4xl mx-auto my-6 px-4">
      {/* 4-Step Diagram Flow Visualizer */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-7 border border-slate-200 dark:border-slate-800 shadow-md mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-3 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2.5 flex-wrap">
              <span>{t.createYourAccount}</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-medium">
                โหมดทดสอบ (ไม่ต้องกรอกครบทุกช่อง)
              </span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              ขั้นตอนที่ 2 ปรับฟอร์มเป็น &quot;ใบสมัครสมาชิกโปรแกรม ESAP (Paperless ebXML)&quot; ตามแบบฟอร์มที่ระบุ
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handleAutoFillSampleData}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50 hover:bg-indigo-100 rounded-xl transition-colors border border-indigo-200 dark:border-indigo-800"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>เติมข้อมูลตัวอย่างฟอร์ม ESAP</span>
            </button>

            <button
              type="button"
              onClick={completeRegistrationAndGoToDashboard}
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 rounded-xl shadow-xs transition-all"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>สมัครแล้วไปหน้าจัดการบัญชีทันที ➔</span>
            </button>
          </div>
        </div>

        {/* 3 Nodes Flow Diagram */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div
            onClick={() => setCurrentStep(1)}
            className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
              currentStep === 1
                ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 ring-2 ring-emerald-500/20'
                : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800'
            }`}
          >
            <div className="flex items-center gap-3 mb-2">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm shrink-0 shadow-xs ${
                  currentStep >= 1 ? 'bg-emerald-600 text-white' : 'bg-slate-300 dark:bg-slate-700 text-slate-700'
                }`}
              >
                1
              </div>
              <div className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white leading-tight">
                {t.step1Title}
              </div>
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-snug line-clamp-2">
              {t.step1Desc}
            </p>
          </div>

          <div
            onClick={() => setCurrentStep(2)}
            className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
              currentStep === 2
                ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-500 ring-2 ring-amber-500/20'
                : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800'
            }`}
          >
            <div className="flex items-center gap-3 mb-2">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm shrink-0 shadow-xs ${
                  currentStep >= 2 ? 'bg-amber-500 text-white' : 'bg-slate-300 dark:bg-slate-700 text-slate-700'
                }`}
              >
                2
              </div>
              <div className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white leading-tight">
                {t.step2Title} (แบบฟอร์ม ESAP)
              </div>
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-snug line-clamp-2">
              กรอกข้อมูลตามใบสมัครโปรแกรม ESAP (Paperless ebXML)
            </p>
          </div>

          <div
            onClick={() => setCurrentStep(3)}
            className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
              currentStep === 3
                ? 'bg-sky-50 dark:bg-sky-950/40 border-sky-500 ring-2 ring-sky-500/20'
                : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800'
            }`}
          >
            <div className="flex items-center gap-3 mb-2">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm shrink-0 shadow-xs ${
                  currentStep >= 3 ? 'bg-sky-500 text-white' : 'bg-slate-300 dark:bg-slate-700 text-slate-700'
                }`}
              >
                3
              </div>
              <div className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white leading-tight">
                {t.step3Title}
              </div>
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-snug line-clamp-2">
              {t.step3Desc}
            </p>
          </div>
        </div>
      </div>

      {/* Main Form Body */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-10 border border-slate-200 dark:border-slate-800 shadow-xl">
        {errorMsg && (
          <div className="mb-6 p-3.5 bg-amber-50 dark:bg-amber-950/40 rounded-xl border border-amber-200 dark:border-amber-900/50 flex items-start gap-2.5 text-xs text-amber-800 dark:text-amber-300">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <span className="font-medium">{errorMsg}</span>
          </div>
        )}

        {/* STEP 1: กดสมัครสมาชิก */}
        {currentStep === 1 && (
          <form onSubmit={handleNextFromStep1} className="space-y-4">
            <div className="pb-3 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                  ขั้นตอนที่ 1 / 3 (กดถัดไปได้ทันที)
                </span>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-0.5">
                  {t.step1Title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {t.step1Desc}
                </p>
              </div>

              <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-lg">
                ทดสอบ: ว่างไว้ได้
              </span>
            </div>

            {/* Username & Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  {t.username}
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                  placeholder="เช่น siam_logistics (เว้นว่างได้)"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-emerald-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  {t.email}
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.co.th (เว้นว่างได้)"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            {/* Password & Confirm */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  {t.password}
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="อย่างน้อย 8 ตัวอักษร (ค่าเริ่มต้น: Password123!)"
                    className="w-full pl-3.5 pr-10 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-emerald-500"
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

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  {t.confirmPassword}
                </label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="กรอกรหัสผ่านซ้ำอีกครั้ง"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                {t.phone}
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="เช่น 081-234-5678"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-emerald-500 font-mono"
              />
            </div>

            {/* NSW Specific Fields */}
            <div className="p-4 bg-emerald-50/70 dark:bg-emerald-950/30 rounded-2xl border border-emerald-100 dark:border-emerald-900/40 space-y-3.5">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 dark:text-emerald-300">
                <ShieldCheck className="w-4 h-4" />
                <span>ข้อมูลการเชื่อมโยงระบบ National Single Window (NSW)</span>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    {t.nswCategory} <span className="font-normal text-slate-400 dark:text-slate-500">(บล็อคเช็ก - ติ๊กเลือกได้มากกว่า 1 หมวด)</span>
                  </label>
                  {selectedNswCategories.length > 0 && (
                    <span className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-100/80 dark:bg-emerald-950/80 px-2 py-0.5 rounded-md border border-emerald-300 dark:border-emerald-800">
                      เลือกแล้ว {selectedNswCategories.length} หมวด
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {nswCategories.map((cat, idx) => {
                    const isChecked = selectedNswCategories.includes(cat);
                    return (
                      <button
                        type="button"
                        key={idx}
                        onClick={() => toggleNswCategory(cat)}
                        className={`flex items-start gap-3 p-3 text-left rounded-xl border transition-all cursor-pointer ${
                          isChecked
                            ? 'bg-emerald-50/90 dark:bg-emerald-950/60 border-emerald-500 ring-2 ring-emerald-500/20 text-slate-900 dark:text-white shadow-2xs'
                            : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        <div
                          className={`w-4 h-4 rounded-md border mt-0.5 flex items-center justify-center transition-colors shrink-0 ${
                            isChecked
                              ? 'bg-emerald-600 border-emerald-600 text-white'
                              : 'border-slate-400 dark:border-slate-600 bg-white dark:bg-slate-800'
                          }`}
                        >
                          {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                        <span className="text-xs font-medium leading-relaxed select-none">
                          {cat}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    {t.nswProfile}
                  </label>
                  <button
                    type="button"
                    onClick={() => setNswProfile('NSW-TH-2024-88319')}
                    className="text-[11px] text-emerald-700 dark:text-emerald-400 font-medium hover:underline"
                  >
                    ใส่ตัวอย่างโปรไฟล์ NSW
                  </button>
                </div>
                <input
                  type="text"
                  value={nswProfile}
                  onChange={(e) => setNswProfile(e.target.value.toUpperCase())}
                  placeholder={t.nswProfilePlaceholder}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-emerald-500 font-mono tracking-wide"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4">
              <button
                type="button"
                onClick={onSwitchToLogin}
                className="text-xs text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
              >
                มีบัญชีอยู่แล้ว? เข้าสู่ระบบ
              </button>

              <div className="flex items-center gap-2.5 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={completeRegistrationAndGoToDashboard}
                  className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-3 rounded-xl text-xs sm:text-sm font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-100/80 dark:bg-emerald-950/80 hover:bg-emerald-200 transition-colors"
                >
                  <Zap className="w-4 h-4" />
                  <span>สมัครด่วน & ไปหน้าจัดการบัญชี</span>
                </button>

                <button
                  type="submit"
                  className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-xs sm:text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 transition-colors shadow-md shadow-emerald-600/20"
                >
                  <span>{t.nextStep}: กรอกแบบฟอร์ม ESAP</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </form>
        )}

        {/* STEP 2: กรอกข้อมูลเพิ่มเติมตามแบบฟอร์ม ESAP (ตามรูปที่แนบมา) */}
        {currentStep === 2 && (
          <form onSubmit={handleNextFromStep2} className="space-y-6">
            {/* Form Document Header matching the uploaded document */}
            <div className="text-center pb-4 border-b-2 border-slate-300 dark:border-slate-700">
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white tracking-wide">
                ใบสมัครสมาชิกโปรแกรม ESAP
              </h3>
              <p className="text-sm font-semibold text-slate-600 dark:text-slate-300 mt-0.5">
                (Paperless ebXML – Application Form)
              </p>
              <div className="inline-block mt-2 px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-200 text-xs font-medium">
                ขั้นตอนที่ 2 / 3: กรอกข้อมูลเพิ่มเติม (ไม่บังคับกรอก - ทดสอบได้เลย)
              </div>
            </div>

            {/* 1. Ref ID Paperless Type */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 text-xs sm:text-sm font-medium">
                <span className="font-bold text-slate-900 dark:text-white shrink-0">
                  Ref ID Paperless Type :
                </span>
                <div className="flex items-center gap-4 flex-wrap">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="paperlessType"
                      checked={paperlessType === 'Customs Broker'}
                      onChange={() => setPaperlessType('Customs Broker')}
                      className="text-amber-600 focus:ring-amber-500"
                    />
                    <span>Customs Broker</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="paperlessType"
                      checked={paperlessType === 'Service Counter'}
                      onChange={() => setPaperlessType('Service Counter')}
                      className="text-amber-600 focus:ring-amber-500"
                    />
                    <span>Service Counter</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="paperlessType"
                      checked={paperlessType === 'Exporter/Importer'}
                      onChange={() => setPaperlessType('Exporter/Importer')}
                      className="text-amber-600 focus:ring-amber-500"
                    />
                    <span>Exporter/Importer</span>
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 text-xs">
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 mb-1 font-semibold">
                    Test Ref ID :
                  </label>
                  <input
                    type="text"
                    value={refIdTest}
                    onChange={(e) => setRefIdTest(e.target.value)}
                    placeholder="เช่น TEST-EXP-00123"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono text-xs sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 mb-1 font-semibold">
                    Production Ref ID :
                  </label>
                  <input
                    type="text"
                    value={refIdProduction}
                    onChange={(e) => setRefIdProduction(e.target.value)}
                    placeholder="เช่น PROD-EXP-00123"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono text-xs sm:text-sm"
                  />
                </div>
              </div>
            </div>

            {/* 2. ข้อมูลผู้ขอใช้บริการ */}
            <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-3.5">
              <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <Building2 className="w-4 h-4 text-amber-600" />
                <span>ข้อมูลผู้ขอใช้บริการ :</span>
              </h4>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  ▪ ชื่อบริษัท / นิติบุคคล (ชื่อภาษาไทย) :
                </label>
                <input
                  type="text"
                  value={companyNameTh}
                  onChange={(e) => setCompanyNameTh(e.target.value)}
                  placeholder="เช่น บริษัท สยาม อินเตอร์เนชั่นแนล เทรดดิ้ง จำกัด"
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  ▪ ชื่อ (ภาษาอังกฤษ) :
                </label>
                <input
                  type="text"
                  value={companyNameEn}
                  onChange={(e) => setCompanyNameEn(e.target.value)}
                  placeholder="e.g. Siam International Trading Co., Ltd."
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    ประเภทธุรกิจ :
                  </label>
                  <input
                    type="text"
                    value={businessType}
                    onChange={(e) => setBusinessType(e.target.value)}
                    placeholder="เช่น นำเข้าและส่งออกสินค้าอุตสาหกรรม"
                    className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    ทะเบียนนิติบุคคลเลขที่ :
                  </label>
                  <input
                    type="text"
                    value={juristicNumber}
                    onChange={(e) => setJuristicNumber(e.target.value)}
                    placeholder="เช่น 0105558012399"
                    className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    เลขประจำตัวผู้เสียภาษีอากร :
                  </label>
                  <input
                    type="text"
                    maxLength={13}
                    value={taxId}
                    onChange={(e) => setTaxId(e.target.value.replace(/\D/g, '').slice(0, 13))}
                    placeholder="0105558012399 (13 หลัก)"
                    className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono tracking-wider"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    สาขา :
                  </label>
                  <select
                    value={branchType}
                    onChange={(e) => setBranchType(e.target.value)}
                    className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  >
                    <option value="">-- ไม่ระบุ --</option>
                    <option value="headquarters">สำนักงานใหญ่</option>
                    <option value="branch">สาขา</option>
                  </select>
                </div>
              </div>
            </div>

            {/* 3. สถานที่จัดส่งใบแจ้งค่าใช้บริการ/วางบิล */}
            <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-3.5">
              <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <MapPin className="w-4 h-4 text-amber-600" />
                <span>สถานที่จัดส่งใบแจ้งค่าใช้บริการ / วางบิล :</span>
              </h4>

              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2.5 text-xs">
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 mb-1">เลขที่ :</label>
                  <input
                    type="text"
                    value={billingHouseNo}
                    onChange={(e) => setBillingHouseNo(e.target.value)}
                    placeholder="88/12"
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 mb-1">หมู่ที่ :</label>
                  <input
                    type="text"
                    value={billingMoo}
                    onChange={(e) => setBillingMoo(e.target.value)}
                    placeholder="-"
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
                <div className="col-span-3 sm:col-span-4">
                  <label className="block text-slate-600 dark:text-slate-400 mb-1">หมู่บ้าน / อาคาร :</label>
                  <input
                    type="text"
                    value={billingBuilding}
                    onChange={(e) => setBillingBuilding(e.target.value)}
                    placeholder="อาคารสยามทาวเวอร์ ชั้น 18"
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 mb-1">ซอย :</label>
                  <input
                    type="text"
                    value={billingSoi}
                    onChange={(e) => setBillingSoi(e.target.value)}
                    placeholder="-"
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 mb-1">ถนน :</label>
                  <input
                    type="text"
                    value={billingRoad}
                    onChange={(e) => setBillingRoad(e.target.value)}
                    placeholder="ถนนพระราม 9"
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 mb-1">ตำบล / แขวง :</label>
                  <input
                    type="text"
                    value={billingSubDistrict}
                    onChange={(e) => setBillingSubDistrict(e.target.value)}
                    placeholder="ห้วยขวาง"
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 mb-1">อำเภอ / เขต :</label>
                  <input
                    type="text"
                    value={billingDistrict}
                    onChange={(e) => setBillingDistrict(e.target.value)}
                    placeholder="ห้วยขวาง"
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 mb-1">จังหวัด :</label>
                  <input
                    type="text"
                    value={billingProvince}
                    onChange={(e) => setBillingProvince(e.target.value)}
                    placeholder="กรุงเทพมหานคร"
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 mb-1">รหัสไปรษณีย์ :</label>
                  <input
                    type="text"
                    maxLength={5}
                    value={billingPostalCode}
                    onChange={(e) => setBillingPostalCode(e.target.value)}
                    placeholder="10310"
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs pt-1">
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 mb-1">โทรศัพท์ :</label>
                  <input
                    type="tel"
                    value={billingPhone}
                    onChange={(e) => setBillingPhone(e.target.value)}
                    placeholder="02-888-9999"
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 mb-1">โทรสาร (Fax) :</label>
                  <input
                    type="text"
                    value={billingFax}
                    onChange={(e) => setBillingFax(e.target.value)}
                    placeholder="02-888-9998"
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 mb-1">e-mail :</label>
                  <input
                    type="email"
                    value={billingEmail}
                    onChange={(e) => setBillingEmail(e.target.value)}
                    placeholder="billing@company.co.th"
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
              </div>
            </div>

            {/* 4. สถานที่ติดตั้งระบบ */}
            <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-3.5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-amber-600" />
                  <span>สถานที่ติดตั้งระบบ :</span>
                </h4>
                <div className="flex items-center gap-4 text-xs">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="installLocation"
                      checked={installSameAsBilling}
                      onChange={() => setInstallSameAsBilling(true)}
                      className="text-amber-600 focus:ring-amber-500"
                    />
                    <span>ที่อยู่ตามสถานที่จัดส่งใบแจ้งค่าใช้บริการ/วางบิล</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="installLocation"
                      checked={!installSameAsBilling}
                      onChange={() => setInstallSameAsBilling(false)}
                      className="text-amber-600 focus:ring-amber-500"
                    />
                    <span>อื่นๆ</span>
                  </label>
                </div>
              </div>

              {!installSameAsBilling && (
                <div className="pt-2 border-t border-slate-200 dark:border-slate-700 space-y-2.5 text-xs">
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                    <div>
                      <label className="block text-slate-500 mb-0.5">เลขที่ :</label>
                      <input
                        type="text"
                        value={installHouseNo}
                        onChange={(e) => setInstallHouseNo(e.target.value)}
                        placeholder="99/1"
                        className="w-full px-2 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-500 mb-0.5">หมู่ที่ :</label>
                      <input
                        type="text"
                        value={installMoo}
                        onChange={(e) => setInstallMoo(e.target.value)}
                        placeholder="1"
                        className="w-full px-2 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                      />
                    </div>
                    <div className="col-span-3 sm:col-span-4">
                      <label className="block text-slate-500 mb-0.5">หมู่บ้าน/อาคาร :</label>
                      <input
                        type="text"
                        value={installBuilding}
                        onChange={(e) => setInstallBuilding(e.target.value)}
                        placeholder="คลังสินค้าสุวรรณภูมิ"
                        className="w-full px-2 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <div>
                      <label className="block text-slate-500 mb-0.5">ถนน :</label>
                      <input
                        type="text"
                        value={installRoad}
                        onChange={(e) => setInstallRoad(e.target.value)}
                        placeholder="กิ่งแก้ว"
                        className="w-full px-2 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-500 mb-0.5">ตำบล/แขวง :</label>
                      <input
                        type="text"
                        value={installSubDistrict}
                        onChange={(e) => setInstallSubDistrict(e.target.value)}
                        placeholder="ราชาเทวะ"
                        className="w-full px-2 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-500 mb-0.5">อำเภอ/เขต :</label>
                      <input
                        type="text"
                        value={installDistrict}
                        onChange={(e) => setInstallDistrict(e.target.value)}
                        placeholder="บางพลี"
                        className="w-full px-2 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <div>
                      <label className="block text-slate-500 mb-0.5">จังหวัด :</label>
                      <input
                        type="text"
                        value={installProvince}
                        onChange={(e) => setInstallProvince(e.target.value)}
                        placeholder="สมุทรปราการ"
                        className="w-full px-2 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-500 mb-0.5">รหัสไปรษณีย์ :</label>
                      <input
                        type="text"
                        value={installPostalCode}
                        onChange={(e) => setInstallPostalCode(e.target.value)}
                        placeholder="10540"
                        className="w-full px-2 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-500 mb-0.5">โทรศัพท์ :</label>
                      <input
                        type="text"
                        value={installPhone}
                        onChange={(e) => setInstallPhone(e.target.value)}
                        placeholder="02-134-8888"
                        className="w-full px-2 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* 5. ข้อมูลติดต่อ/ผู้ประสานงาน */}
            <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-3.5">
              <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <UserIcon className="w-4 h-4 text-amber-600" />
                <span>ข้อมูลติดต่อ / ผู้ประสานงาน :</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5 text-xs">
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 mb-1">คำนำหน้า :</label>
                  <select
                    value={contactPrefix}
                    onChange={(e) => setContactPrefix(e.target.value)}
                    className="w-full px-2.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  >
                    <option value="">-- ไม่ระบุ --</option>
                    <option value="นาย">นาย</option>
                    <option value="นาง">นาง</option>
                    <option value="นางสาว">นางสาว</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 mb-1">ชื่อ :</label>
                  <input
                    type="text"
                    value={contactFirstName}
                    onChange={(e) => setContactFirstName(e.target.value)}
                    placeholder="วราภรณ์"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 mb-1">นามสกุล :</label>
                  <input
                    type="text"
                    value={contactLastName}
                    onChange={(e) => setContactLastName(e.target.value)}
                    placeholder="มั่นคง"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 mb-1">ตำแหน่ง :</label>
                  <input
                    type="text"
                    value={contactPosition}
                    onChange={(e) => setContactPosition(e.target.value)}
                    placeholder="ผู้จัดการฝ่ายพิธีการศุลกากร"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs pt-1">
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 mb-1">โทรศัพท์ :</label>
                  <input
                    type="tel"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    placeholder="02-888-9999"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 mb-1">มือถือ :</label>
                  <input
                    type="tel"
                    value={contactMobile}
                    onChange={(e) => setContactMobile(e.target.value)}
                    placeholder="081-444-5555"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 mb-1">e-mail :</label>
                  <input
                    type="email"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    placeholder="contact@company.co.th"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
              </div>
            </div>

            {/* Stepper buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setCurrentStep(1)}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>{t.prevStep}</span>
              </button>

              <div className="flex items-center gap-2.5 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={completeRegistrationAndGoToDashboard}
                  className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-3 rounded-xl text-xs sm:text-sm font-semibold text-amber-800 dark:text-amber-200 bg-amber-100/80 dark:bg-amber-950/80 hover:bg-amber-200 transition-colors"
                >
                  <Zap className="w-4 h-4" />
                  <span>สมัครด่วน & ไปหน้าจัดการบัญชี</span>
                </button>

                <button
                  type="submit"
                  className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-xs sm:text-sm font-semibold text-white bg-amber-500 hover:bg-amber-600 transition-colors shadow-md shadow-amber-500/20"
                >
                  <span>{t.nextStep}: {t.step3Title}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </form>
        )}

        {/* STEP 3: อัปโหลดเอกสาร */}
        {currentStep === 3 && (
          <form onSubmit={handleSubmitToCs} className="space-y-4">
            <div className="pb-3 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span className="text-xs font-semibold text-sky-600 dark:text-sky-400 uppercase tracking-wider">
                  ขั้นตอนที่ 3 / 3 (ไม่บังคับอัปโหลด)
                </span>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-0.5">
                  {t.caDocsTitle}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {t.caDocsSubtitle} (หากไม่อัปโหลด ระบบจะใช้เอกสารจำลองให้อัตโนมัติ)
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setDocuments([
                    {
                      id: 'doc_1',
                      name: 'สำเนา ภ.พ.20 (ภพ.20)',
                      type: 'pp20',
                      fileName: 'PP20_Certified_True_Copy.pdf',
                      fileSize: '1.4 MB',
                      uploadedAt: 'เพิ่งอัปโหลด',
                      status: 'valid',
                    },
                    {
                      id: 'doc_2',
                      name: 'หนังสือรับรองนิติบุคคล (DBD คัดสำเนาไม่เกิน 6 เดือน)',
                      type: 'company_cert',
                      fileName: 'DBD_Certificate_Valid_2024.pdf',
                      fileSize: '2.8 MB',
                      uploadedAt: 'เพิ่งอัปโหลด',
                      status: 'valid',
                    },
                    {
                      id: 'doc_3',
                      name: 'สำเนาบัตรประชาชนกรรมการผู้มีอำนาจ (พร้อมลงนามรับรอง)',
                      type: 'director_id',
                      fileName: 'Director_Thai_ID_Card.pdf',
                      fileSize: '920 KB',
                      uploadedAt: 'เพิ่งอัปโหลด',
                      status: 'valid',
                    },
                    {
                      id: 'doc_4',
                      name: 'เอกสารคำขอใช้งาน Digital Certificate / ใบสมัคร CA',
                      type: 'ca_request',
                      fileName: 'CA_Application_Form_Completed.pdf',
                      fileSize: '1.9 MB',
                      uploadedAt: 'เพิ่งอัปโหลด',
                      status: 'valid',
                    },
                  ]);
                }}
                className="px-3 py-1.5 text-xs font-semibold text-sky-700 dark:text-sky-300 bg-sky-50 dark:bg-sky-950/60 hover:bg-sky-100 rounded-lg transition-colors border border-sky-200 dark:border-sky-800 flex items-center gap-1.5 shrink-0 self-start sm:self-auto"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>{t.useSampleDocs}</span>
              </button>
            </div>

            {/* Document Slots */}
            <div className="space-y-3">
              {documents.map((doc) => (
                <div
                  key={doc.id}
                  className={`p-4 rounded-2xl border transition-all ${
                    doc.fileName
                      ? 'bg-sky-50/40 dark:bg-sky-950/20 border-sky-200 dark:border-sky-800'
                      : 'bg-slate-50/80 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div
                        className={`p-2.5 rounded-xl shrink-0 ${
                          doc.fileName
                            ? 'bg-sky-500 text-white shadow-xs'
                            : 'bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-300'
                        }`}
                      >
                        <FileText className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-semibold text-xs sm:text-sm text-slate-900 dark:text-white">
                            {doc.name}
                          </span>
                        </div>

                        {doc.fileName ? (
                          <div className="text-xs text-sky-700 dark:text-sky-300 mt-1 flex items-center gap-2 flex-wrap font-mono">
                            <span className="font-medium underline truncate max-w-[200px] sm:max-w-xs">{doc.fileName}</span>
                            <span aria-hidden="true">·</span>
                            <span>{doc.fileSize}</span>
                            <span aria-hidden="true">·</span>
                            <span>{doc.uploadedAt}</span>
                          </div>
                        ) : (
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                            {doc.type === 'pp20'
                              ? t.docPp20Desc
                              : doc.type === 'company_cert'
                              ? t.docCompanyCertDesc
                              : doc.type === 'director_id'
                              ? t.docDirectorIdDesc
                              : t.docCaRequestDesc}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-auto">
                      {doc.fileName ? (
                        <button
                          type="button"
                          onClick={() => handleRemoveDoc(doc.id)}
                          className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-lg transition-colors"
                          title="ลบไฟล์"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      ) : (
                        <label className="cursor-pointer inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-sky-700 dark:text-sky-300 bg-white dark:bg-slate-800 hover:bg-sky-50 dark:hover:bg-slate-700 rounded-xl transition-all border border-slate-300 dark:border-slate-700 shadow-2xs">
                          <Upload className="w-3.5 h-3.5" />
                          <span>{t.uploadBtn}</span>
                          <input
                            type="file"
                            accept=".pdf,.jpg,.jpeg,.png"
                            onChange={(e) => handleSimulateFileUpload(doc.id, e)}
                            className="hidden"
                          />
                        </label>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Stepper buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4">
              <button
                type="button"
                onClick={() => setCurrentStep(2)}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>{t.prevStep}</span>
              </button>

              <div className="flex items-center gap-2.5 w-full sm:w-auto">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-7 py-3 rounded-xl text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-600 hover:opacity-95 transition-all shadow-md shadow-emerald-600/20 disabled:opacity-60"
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>กำลังสร้างบัญชีและเปิดหน้าจัดการ...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>สมัครสมาชิก & ไปหน้าจัดการบัญชีทันที ➔</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
