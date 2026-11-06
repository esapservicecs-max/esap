import React, { useState } from 'react';
import {
  User as UserIcon,
  Shield,
  KeyRound,
  Smartphone,
  Laptop,
  Globe,
  Clock,
  CheckCircle2,
  AlertCircle,
  LogOut,
  Save,
  RotateCcw,
  Sparkles,
  Camera,
  Layers,
  History,
  Lock,
  Eye,
  EyeOff,
  Trash2,
  Building2,
  FileText,
  Printer,
  Download,
  MapPin,
  Phone,
  Mail,
  BadgeCheck,
  FileCheck2,
  Check,
  Copy,
  UserCheck,
  Briefcase,
  FileCode,
  Edit3,
  Key,
} from 'lucide-react';
import { User, Session, ActivityLog, Language, RegistrationApplication, CaDocument, NswProfileItem } from '../types/auth';
import { translations } from '../locales/translations';
import {
  ASSETS,
  getStoredUsers,
  saveUsers,
  getStoredPasswords,
  savePassword,
  setCurrentUser,
  getSessions,
  saveSessions,
  getActivityLogs,
  addActivityLog,
  getStoredApplications,
  saveOrUpdateApplication,
} from '../services/storage';

const ESAP_PROGRAM_MAP: Record<string, { label: string; desc: string; logo: string; code: string }> = {
  import: { label: 'Import', desc: 'ใบขนสินค้าขาเข้า', logo: '/assets/programs/import.png', code: 'ESAP IM' },
  export: { label: 'Export', desc: 'ใบขนสินค้าขาออก', logo: '/assets/programs/export.png', code: 'ESAP Ex' },
  goods: { label: 'Goods', desc: 'บัญชีราคาสินค้า', logo: '/assets/programs/goods.png', code: 'ESAP GC' },
  carmanifest: { label: 'Carmanifest', desc: 'บัญชีสินค้าทางรถ', logo: '/assets/programs/carmanifest.png', code: 'ESAP CAR' },
  etransit: { label: 'eTransit', desc: 'ถ่ายลำและผ่านแดน', logo: '/assets/programs/etransit.png', code: 'ESAP TT' },
  airmanifest: { label: 'Airmanifest', desc: 'บัญชีสินค้าทางอากาศ', logo: '/assets/programs/airmanifest.png', code: 'ESAP AIR' },
  rgoods: { label: 'Rgoods', desc: 'คืนอากรและคลังสินค้า', logo: '/assets/programs/rgoods.png', code: 'ESAP FDA' },
};

interface MemberDashboardProps {
  user: User;
  onUpdateUser: (user: User) => void;
  onLogout: () => void;
  language: Language;
}

export const MemberDashboard: React.FC<MemberDashboardProps> = ({
  user,
  onUpdateUser,
  onLogout,
  language,
}) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'esap' | 'security' | 'activity'>('profile');
  const [copiedRef, setCopiedRef] = useState(false);
  const t = translations[language];

  // Security & Activity states
  const [twoFactor, setTwoFactor] = useState(user.twoFactorEnabled);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [sessions, setSessions] = useState<Session[]>(getSessions());
  const [sessionsRevokedMsg, setSessionsRevokedMsg] = useState('');
  const [logs, setLogs] = useState<ActivityLog[]>(getActivityLogs());

  const avatarPresets = [
    ASSETS.avatarFemale,
    ASSETS.avatarMale,
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
  ];

  // Retrieve matching application for this member
  const applications = getStoredApplications();
  const userApp: RegistrationApplication | undefined =
    applications.find(
      (a: RegistrationApplication) =>
        (user.applicationId && a.id === user.applicationId) ||
        (user.taxId && a.taxId && a.taxId === user.taxId) ||
        (user.email && a.email && a.email.toLowerCase() === user.email.toLowerCase()) ||
        (user.username && a.username && a.username.toLowerCase() === user.username.toLowerCase())
    );

  // Edit Profile state
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user.name);
  const [phone, setPhone] = useState(user.phone);
  const [bio, setBio] = useState(user.bio || '');
  const [avatar, setAvatar] = useState(user.avatar);
  const [profileSuccessMsg, setProfileSuccessMsg] = useState('');
  const [showCaPasswordInDashboard, setShowCaPasswordInDashboard] = useState(false);

  // Extended registration fields states for editing and syncing
  const [editCompanyTh, setEditCompanyTh] = useState(user.companyNameTh || userApp?.companyNameTh || user.companyName || '');
  const [editCompanyEn, setEditCompanyEn] = useState(user.companyNameEn || userApp?.companyNameEn || '');
  const [editTaxId, setEditTaxId] = useState(user.taxId || userApp?.taxId || '');
  const [editJuristic, setEditJuristic] = useState(user.juristicNumber || userApp?.juristicNumber || '');
  const [editBusinessType, setEditBusinessType] = useState(user.businessType || userApp?.businessType || '');
  const [editAddress, setEditAddress] = useState(userApp?.registeredAddress || '');
  const [editContactPrefix, setEditContactPrefix] = useState(userApp?.contactPrefix || 'นาย');
  const [editContactFirstName, setEditContactFirstName] = useState(userApp?.contactFirstName || '');
  const [editContactLastName, setEditContactLastName] = useState(userApp?.contactLastName || '');
  const [editContactPosition, setEditContactPosition] = useState(userApp?.contactPosition || '');
  const [editContactMobile, setEditContactMobile] = useState(userApp?.contactMobile || userApp?.contactPhone || user.phone || '');
  const [editContactEmail, setEditContactEmail] = useState(userApp?.contactEmail || user.email || '');
  const [editNswCategory, setEditNswCategory] = useState(user.nswCategory || userApp?.nswCategory || '');
  const [editNswProfileProd, setEditNswProfileProd] = useState(user.nswProfileProd || userApp?.nswProfileProd || '');
  const [editNswProfileTest, setEditNswProfileTest] = useState(user.nswProfileTest || userApp?.nswProfileTest || '');
  const [editSelectedPrograms, setEditSelectedPrograms] = useState<string[]>(
    (user.selectedPrograms && user.selectedPrograms.length > 0)
      ? user.selectedPrograms
      : (userApp?.selectedPrograms || [])
  );
  const [editCaPassword, setEditCaPassword] = useState(user.caPassword || userApp?.caPassword || '');

  // Quick 1-click sample data populate in dashboard
  const handleFillSampleDataInDashboard = () => {
    const randomSuffix = Math.floor(100 + Math.random() * 900);
    const sampleCompanyTh = `บริษัท ไทย ลอจิสติกส์ ซัพพลายเชน ${randomSuffix} จำกัด`;
    const sampleCompanyEn = `Thai Logistics Supply Chain ${randomSuffix} Co., Ltd.`;
    const sampleTaxId = `01055580${randomSuffix}88`;
    const sampleJuristic = `01055580${randomSuffix}88`;
    const sampleBusinessType = 'บริการนำเข้าและส่งออกสินค้าอุตสาหกรรม และโลจิสติกส์';
    const sampleAddress = 'เลขที่ 888/45 อาคารบางกอกบิสซิเนสเซ็นเตอร์ ชั้น 12 ถนนสุขุมวิท 63 แขวงคลองตันเหนือ เขตวัฒนา กรุงเทพมหานคร 10110';
    const sampleCategory = 'NSW Gateway (ระบบเชื่อมโยงข้อมูลศุลกากร), นำเข้า-ส่งออกทั่วไป (Import / Export Customs Clearance)';
    const sampleProfiles: NswProfileItem[] = [
      { id: 'p_prod', type: 'production', code: `NSW-PROD-2024-${randomSuffix}99` },
      { id: 'p_test', type: 'test', code: `NSW-TEST-2024-${randomSuffix}11` },
    ];
    const sampleNswProfile = `โปร: NSW-PROD-2024-${randomSuffix}99 | เทส: NSW-TEST-2024-${randomSuffix}11`;
    const samplePrograms = ['import', 'export', 'goods'];

    setEditCompanyTh(sampleCompanyTh);
    setEditCompanyEn(sampleCompanyEn);
    setEditTaxId(sampleTaxId);
    setEditJuristic(sampleJuristic);
    setEditBusinessType(sampleBusinessType);
    setEditAddress(sampleAddress);
    setEditContactPrefix('นาย');
    setEditContactFirstName('ชลธาร');
    setEditContactLastName('สมบูรณ์สุข');
    setEditContactPosition('ผู้จัดการแผนกพิธีการศุลกากร');
    setEditContactMobile('089-555-8899');
    setEditContactEmail(`choltarn${randomSuffix}@esapservice.co.th`);
    setEditNswCategory(sampleCategory);
    setEditNswProfileProd(`NSW-PROD-2024-${randomSuffix}99`);
    setEditNswProfileTest(`NSW-TEST-2024-${randomSuffix}11`);
    setEditSelectedPrograms(samplePrograms);
    setEditCaPassword('PasswordCA123!');

    const updatedUser: User = {
      ...user,
      name: sampleCompanyTh,
      companyName: sampleCompanyTh,
      companyNameTh: sampleCompanyTh,
      companyNameEn: sampleCompanyEn,
      taxId: sampleTaxId,
      juristicNumber: sampleJuristic,
      businessType: sampleBusinessType,
      paperlessType: 'Exporter/Importer',
      nswCategory: sampleCategory,
      nswProfile: sampleNswProfile,
      nswProfileProd: `NSW-PROD-2024-${randomSuffix}99`,
      nswProfileTest: `NSW-TEST-2024-${randomSuffix}11`,
      nswProfiles: sampleProfiles,
      selectedPrograms: samplePrograms,
      caPassword: 'PasswordCA123!',
      phone: user.phone && user.phone !== '-' ? user.phone : '089-555-8899',
      email: user.email && user.email !== '-' ? user.email : `contact${randomSuffix}@esapservice.co.th`,
    };

    const newApp: RegistrationApplication = userApp
      ? {
          ...userApp,
          companyName: sampleCompanyTh,
          companyNameTh: sampleCompanyTh,
          companyNameEn: sampleCompanyEn,
          taxId: sampleTaxId,
          juristicNumber: sampleJuristic,
          businessType: sampleBusinessType,
          registeredAddress: sampleAddress,
          contactPrefix: 'นาย',
          contactFirstName: 'ชลธาร',
          contactLastName: 'สมบูรณ์สุข',
          contactPosition: 'ผู้จัดการแผนกพิธีการศุลกากร',
          contactPhone: '02-714-8899',
          contactMobile: '089-555-8899',
          contactEmail: updatedUser.email,
          nswCategory: sampleCategory,
          nswProfiles: sampleProfiles,
          nswProfile: sampleNswProfile,
          nswProfileProd: `NSW-PROD-2024-${randomSuffix}99`,
          nswProfileTest: `NSW-TEST-2024-${randomSuffix}11`,
          selectedPrograms: samplePrograms,
          caPassword: 'PasswordCA123!',
          status: 'approved',
          updatedAt: new Date().toISOString(),
        }
      : {
          id: user.applicationId || `APP-ESAP-${randomSuffix}00`,
          username: user.username,
          email: updatedUser.email,
          phone: updatedUser.phone,
          nswCategory: sampleCategory,
          nswProfile: sampleNswProfile,
          nswProfileProd: `NSW-PROD-2024-${randomSuffix}99`,
          nswProfileTest: `NSW-TEST-2024-${randomSuffix}11`,
          nswProfiles: sampleProfiles,
          paperlessType: 'Exporter/Importer',
          refIdTest: `TEST-EXP-${randomSuffix}`,
          refIdProduction: `PROD-EXP-${randomSuffix}`,
          companyName: sampleCompanyTh,
          companyNameTh: sampleCompanyTh,
          companyNameEn: sampleCompanyEn,
          businessType: sampleBusinessType,
          juristicNumber: sampleJuristic,
          taxId: sampleTaxId,
          branchType: 'headquarters',
          branchNumber: '00000',
          billingHouseNo: '888/45',
          billingMoo: '3',
          billingBuilding: 'อาคารบางกอกบิสซิเนสเซ็นเตอร์ ชั้น 12',
          billingSoi: 'สุขุมวิท 63',
          billingRoad: 'ถนนสุขุมวิท',
          billingSubDistrict: 'คลองตันเหนือ',
          billingDistrict: 'วัฒนา',
          billingProvince: 'กรุงเทพมหานคร',
          billingPostalCode: '10110',
          billingPhone: '02-714-8899',
          billingFax: '02-714-8898',
          billingEmail: updatedUser.email,
          installSameAsBilling: true,
          contactPrefix: 'นาย',
          contactFirstName: 'ชลธาร',
          contactLastName: 'สมบูรณ์สุข',
          contactPosition: 'ผู้จัดการแผนกพิธีการศุลกากร',
          contactPhone: '02-714-8899',
          contactMobile: '089-555-8899',
          contactEmail: updatedUser.email,
          selectedPrograms: samplePrograms,
          registeredAddress: sampleAddress,
          documents: [
            { id: 'doc_1', name: 'สำเนา ภ.พ.20 (ภพ.20)', type: 'pp20', fileName: 'PP20_Verified.pdf', fileSize: '1.2 MB', uploadedAt: '10:30', status: 'valid' },
            { id: 'doc_poa', name: 'หนังสือมอบอำนาจพร้อมติดอากรสแตมป์ (ถ้ามี)', type: 'power_of_attorney', fileName: 'Power_Of_Attorney_Stamped.pdf', fileSize: '1.4 MB', uploadedAt: '10:31', status: 'valid' },
            { id: 'doc_attorney_id', name: 'สำเนาบัตรผู้รับมอบอำนาจ', type: 'attorney_id', fileName: 'Attorney_ID_Card.jpg', fileSize: '650 KB', uploadedAt: '10:32', status: 'valid' },
            { id: 'doc_2', name: 'หนังสือรับรองนิติบุคคล (DBD คัดสำเนาไม่เกิน 6 เดือน)', type: 'company_cert', fileName: 'DBD_Certificate_Latest.pdf', fileSize: '2.1 MB', uploadedAt: '10:33', status: 'valid' },
            { id: 'doc_3', name: 'สำเนาบัตรประชาชนกรรมการผู้มีอำนาจ (พร้อมลงนามรับรอง)', type: 'director_id', fileName: 'Director_ID_Signed.pdf', fileSize: '850 KB', uploadedAt: '10:34', status: 'valid' },
            { id: 'doc_4', name: 'เอกสารคำขอใช้งาน Digital Certificate / ใบสมัคร CA (ไฟล์ .p12)', type: 'ca_request', fileName: 'digital_cert_esap.p12', fileSize: '45 KB', uploadedAt: '10:35', status: 'valid' },
          ],
          caPassword: 'PasswordCA123!',
          status: 'approved',
          submittedAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

    saveOrUpdateApplication(newApp);
    const allUsers = getStoredUsers().map((u) => (u.id === user.id ? updatedUser : u));
    saveUsers(allUsers);
    setCurrentUser(updatedUser);
    onUpdateUser(updatedUser);
    addActivityLog('เติมข้อมูลตัวอย่างฟอร์ม ESAP สำเร็จ ข้อมูลสัมพันธ์ครบถ้วน', 'success');
    setProfileSuccessMsg('เติมข้อมูลตัวอย่างสถานประกอบการและแบบฟอร์ม ESAP เรียบร้อยแล้ว!');
    setTimeout(() => setProfileSuccessMsg(''), 4000);
  };

  const handleStartEditing = () => {
    setName(user.name);
    setPhone(user.phone);
    setBio(user.bio || '');
    setAvatar(user.avatar);
    setEditCompanyTh(user.companyNameTh || userApp?.companyNameTh || user.companyName || '');
    setEditCompanyEn(user.companyNameEn || userApp?.companyNameEn || '');
    setEditTaxId(user.taxId || userApp?.taxId || '');
    setEditJuristic(user.juristicNumber || userApp?.juristicNumber || '');
    setEditBusinessType(user.businessType || userApp?.businessType || '');
    setEditAddress(userApp?.registeredAddress || '');
    setEditContactPrefix(userApp?.contactPrefix || 'นาย');
    setEditContactFirstName(userApp?.contactFirstName || '');
    setEditContactLastName(userApp?.contactLastName || '');
    setEditContactPosition(userApp?.contactPosition || '');
    setEditContactMobile(userApp?.contactMobile || userApp?.contactPhone || user.phone || '');
    setEditContactEmail(userApp?.contactEmail || user.email || '');
    setEditNswCategory(user.nswCategory || userApp?.nswCategory || '');
    setEditNswProfileProd(user.nswProfileProd || userApp?.nswProfileProd || '');
    setEditNswProfileTest(user.nswProfileTest || userApp?.nswProfileTest || '');
    setEditSelectedPrograms(
      (user.selectedPrograms && user.selectedPrograms.length > 0)
        ? user.selectedPrograms
        : (userApp?.selectedPrograms || [])
    );
    setEditCaPassword(user.caPassword || userApp?.caPassword || '');
    setIsEditing(true);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanTax = editTaxId.replace(/\D/g, '');
    const cleanContact = `${editContactPrefix ? editContactPrefix + ' ' : ''}${editContactFirstName.trim()} ${editContactLastName.trim()}`.trim();
    const finalDisplayName = editCompanyTh.trim() || cleanContact || name.trim() || user.username;

    const validProfiles: NswProfileItem[] = [
      editNswProfileProd.trim() ? { id: 'p_prod', type: 'production' as const, code: editNswProfileProd.trim() } : null,
      editNswProfileTest.trim() ? { id: 'p_test', type: 'test' as const, code: editNswProfileTest.trim() } : null,
    ].filter(Boolean) as NswProfileItem[];

    const finalNswProfile = validProfiles.map((p) => `${p.type === 'production' ? 'โปร' : 'เทส'}: ${p.code}`).join(' | ');

    const updatedUser: User = {
      ...user,
      name: finalDisplayName,
      phone: editContactMobile.trim() || phone.trim(),
      email: editContactEmail.trim() || user.email,
      bio: bio.trim(),
      avatar,
      companyName: editCompanyTh.trim(),
      companyNameTh: editCompanyTh.trim(),
      companyNameEn: editCompanyEn.trim(),
      taxId: cleanTax,
      juristicNumber: editJuristic.trim() || cleanTax,
      businessType: editBusinessType.trim(),
      nswCategory: editNswCategory.trim(),
      nswProfile: finalNswProfile,
      nswProfileProd: editNswProfileProd.trim(),
      nswProfileTest: editNswProfileTest.trim(),
      nswProfiles: validProfiles,
      selectedPrograms: editSelectedPrograms,
      caPassword: editCaPassword.trim(),
    };

    // Keep matching Application in sync
    const updatedApp: RegistrationApplication = userApp
      ? {
          ...userApp,
          companyName: editCompanyTh.trim(),
          companyNameTh: editCompanyTh.trim(),
          companyNameEn: editCompanyEn.trim(),
          taxId: cleanTax,
          juristicNumber: editJuristic.trim() || cleanTax,
          businessType: editBusinessType.trim(),
          registeredAddress: editAddress.trim(),
          contactPrefix: editContactPrefix,
          contactFirstName: editContactFirstName.trim(),
          contactLastName: editContactLastName.trim(),
          contactPosition: editContactPosition.trim(),
          contactMobile: editContactMobile.trim(),
          contactEmail: editContactEmail.trim(),
          nswCategory: editNswCategory.trim(),
          nswProfiles: validProfiles,
          nswProfile: finalNswProfile,
          nswProfileProd: editNswProfileProd.trim(),
          nswProfileTest: editNswProfileTest.trim(),
          selectedPrograms: editSelectedPrograms,
          caPassword: editCaPassword.trim(),
          updatedAt: new Date().toISOString(),
        }
      : {
          id: user.applicationId || `APP-ESAP-${Math.floor(10000 + Math.random() * 90000)}`,
          username: user.username,
          email: updatedUser.email,
          phone: updatedUser.phone,
          nswCategory: editNswCategory.trim(),
          nswProfile: finalNswProfile,
          nswProfileProd: editNswProfileProd.trim(),
          nswProfileTest: editNswProfileTest.trim(),
          nswProfiles: validProfiles,
          paperlessType: 'Exporter/Importer',
          refIdTest: `TEST-EXP-${Date.now().toString().slice(-4)}`,
          refIdProduction: `PROD-EXP-${Date.now().toString().slice(-4)}`,
          companyName: editCompanyTh.trim(),
          companyNameTh: editCompanyTh.trim(),
          companyNameEn: editCompanyEn.trim(),
          businessType: editBusinessType.trim(),
          juristicNumber: editJuristic.trim() || cleanTax,
          taxId: cleanTax,
          branchType: 'headquarters',
          branchNumber: '00000',
          billingHouseNo: editAddress.trim() || '88/1',
          billingMoo: '-',
          billingBuilding: '',
          billingSoi: '',
          billingRoad: '',
          billingSubDistrict: '',
          billingDistrict: '',
          billingProvince: 'กรุงเทพมหานคร',
          billingPostalCode: '10110',
          billingPhone: editContactMobile.trim(),
          billingFax: '',
          billingEmail: updatedUser.email,
          installSameAsBilling: true,
          contactPrefix: editContactPrefix,
          contactFirstName: editContactFirstName.trim(),
          contactLastName: editContactLastName.trim(),
          contactPosition: editContactPosition.trim(),
          contactPhone: editContactMobile.trim(),
          contactMobile: editContactMobile.trim(),
          contactEmail: editContactEmail.trim(),
          selectedPrograms: editSelectedPrograms,
          registeredAddress: editAddress.trim(),
          documents: [],
          caPassword: editCaPassword.trim(),
          status: 'approved',
          submittedAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

    saveOrUpdateApplication(updatedApp);
    const users = getStoredUsers();
    const updatedUsers = users.map((u) => (u.id === user.id ? updatedUser : u));
    saveUsers(updatedUsers);
    setCurrentUser(updatedUser);
    onUpdateUser(updatedUser);
    setIsEditing(false);
    setProfileSuccessMsg(
      language === 'th' ? 'บันทึกข้อมูลและอัปเดตแบบฟอร์ม ESAP เรียบร้อยแล้ว' : 'Profile & ESAP form updated successfully'
    );
    addActivityLog(`แก้ไขข้อมูลโปรไฟล์ & ใบสมัคร (${updatedUser.name})`, 'success');
    setLogs(getActivityLogs());

    setTimeout(() => setProfileSuccessMsg(''), 4000);
  };

  const handleToggle2FA = () => {
    const nextVal = !twoFactor;
    setTwoFactor(nextVal);
    const users = getStoredUsers();
    const updatedUsers = users.map((u) => (u.id === user.id ? { ...u, twoFactorEnabled: nextVal } : u));
    saveUsers(updatedUsers);
    const updated = { ...user, twoFactorEnabled: nextVal };
    setCurrentUser(updated);
    onUpdateUser(updated);
    addActivityLog(
      nextVal ? 'เปิดใช้งานการยืนยันตัวตน 2 ขั้นตอน (2FA)' : 'ปิดใช้งานการยืนยันตัวตน 2 ขั้นตอน (2FA)',
      'warning'
    );
    setLogs(getActivityLogs());
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    const passwords = getStoredPasswords();
    const userPass = passwords[user.email.toLowerCase()] || 'Password123!';

    if (currentPassword !== userPass) {
      setPasswordError(
        language === 'th' ? 'รหัสผ่านปัจจุบันไม่ถูกต้อง' : 'Current password is incorrect'
      );
      return;
    }
    if (newPassword.length < 8) {
      setPasswordError(
        language === 'th' ? 'รหัสผ่านใหม่ต้องมีอย่างน้อย 8 ตัวอักษร' : 'New password must be at least 8 characters'
      );
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError(
        language === 'th' ? 'รหัสผ่านและยืนยันรหัสผ่านไม่ตรงกัน' : 'Passwords do not match'
      );
      return;
    }

    savePassword(user.email, newPassword);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setPasswordSuccess(
      language === 'th' ? 'เปลี่ยนรหัสผ่านสำเร็จแล้ว' : 'Password changed successfully'
    );
    addActivityLog('เปลี่ยนรหัสผ่านบัญชีผู้ใช้สำเร็จ', 'success');
    setLogs(getActivityLogs());
  };

  const handleRevokeOtherSessions = () => {
    const currentOnly = sessions.filter((s) => s.isCurrent);
    setSessions(currentOnly);
    saveSessions(currentOnly);
    setSessionsRevokedMsg(
      language === 'th'
        ? 'ออกจากระบบจากอุปกรณ์อื่นทั้งหมดเรียบร้อยแล้ว'
        : 'All other sessions have been successfully revoked'
    );
    addActivityLog('ยกเลิกการเข้าสู่ระบบจากทุกอุปกรณ์อื่น', 'warning');
    setLogs(getActivityLogs());
    setTimeout(() => setSessionsRevokedMsg(''), 4000);
  };

  const handleClearLogs = () => {
    localStorage.removeItem('siam_auth_activity_logs_v1');
    setLogs([]);
  };

  const formattedJoinDate = new Date(user.createdAt).toLocaleDateString(
    language === 'th' ? 'th-TH' : 'en-US',
    { year: 'numeric', month: 'long', day: 'numeric' }
  );

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-300">
      {/* Top Welcome & Identity Card */}
      <div className="relative overflow-hidden bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs mb-8 p-6 sm:p-8">
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-indigo-500/10 via-purple-500/5 to-transparent rounded-full blur-2xl pointer-events-none" />

        <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4 sm:gap-5">
            <div className="relative group">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover ring-4 ring-indigo-500/10 shadow-sm"
                referrerPolicy="no-referrer"
              />
              <span className="absolute bottom-0 right-0 w-4 h-4 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-900" />
            </div>

            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                  {user.companyNameTh || user.companyName || user.name || user.username}
                </h1>
                <span
                  className={`px-2.5 py-0.5 text-xs font-semibold rounded-full ${
                    user.role === 'admin'
                      ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300'
                      : user.role === 'pro'
                      ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300'
                      : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                  }`}
                >
                  {user.role === 'admin' ? t.roleAdmin : user.role === 'pro' ? t.rolePro : t.roleMember}
                </span>
              </div>

              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-2 flex-wrap">
                <span className="font-mono">@{user.username}</span>
                {user.email ? (
                  <>
                    <span aria-hidden="true">·</span>
                    <span>{user.email}</span>
                  </>
                ) : (
                  <>
                    <span aria-hidden="true">·</span>
                    <span className="text-slate-400 italic">
                      {language === 'th' ? '(ยังไม่ได้ระบุอีเมล)' : '(No email specified)'}
                    </span>
                  </>
                )}
              </p>

              <div className="flex items-center gap-3 text-xs text-slate-400 dark:text-slate-500 mt-2">
                <span>{t.memberSince}: {formattedJoinDate}</span>
                <span aria-hidden="true">·</span>
                <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
                  <Shield className="w-3.5 h-3.5" />
                  {language === 'th' ? 'สถานะบัญชี: ปกติ' : 'Status: Verified'}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 self-stretch sm:self-auto">
            <button
              type="button"
              onClick={onLogout}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2.5 text-xs sm:text-sm font-semibold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/40 hover:bg-red-100 dark:hover:bg-red-900/40 rounded-xl transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>{t.logout}</span>
            </button>
          </div>
        </div>

        {/* Global Feedback message */}
        {profileSuccessMsg && (
          <div className="mt-4 p-3 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>{profileSuccessMsg}</span>
          </div>
        )}
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 mb-6 pb-2">
        <button
          type="button"
          onClick={() => setActiveTab('profile')}
          className={`flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-colors whitespace-nowrap ${
            activeTab === 'profile'
              ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <UserIcon className="w-4 h-4" />
          <span>{t.profileTab}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('esap')}
          className={`flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-colors whitespace-nowrap ${
            activeTab === 'esap'
              ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>{t.esapTab || 'ใบสมัคร ESAP Paperless'}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('security')}
          className={`flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-colors whitespace-nowrap ${
            activeTab === 'security'
              ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <KeyRound className="w-4 h-4" />
          <span>{t.securityTab}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('activity')}
          className={`flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-colors whitespace-nowrap ${
            activeTab === 'activity'
              ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <History className="w-4 h-4" />
          <span>{t.activityTab}</span>
        </button>
      </div>

      {/* Tab 1: Profile Information */}
      {activeTab === 'profile' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Profile Info & Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Success message banner */}
            {profileSuccessMsg && (
              <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs sm:text-sm font-semibold text-emerald-800 dark:text-emerald-300 flex items-center gap-2 shadow-2xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>{profileSuccessMsg}</span>
              </div>
            )}

            {/* Incomplete / Sample Fill Reminder Banner */}
            {(!user.companyName && !userApp?.companyName && !user.taxId) && (
              <div className="p-4 rounded-2xl bg-amber-50/90 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-amber-100 dark:bg-amber-900/50 flex items-center justify-center shrink-0 text-amber-700 dark:text-amber-300 mt-0.5">
                    <AlertCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-amber-900 dark:text-amber-200">
                      {language === 'th' ? 'ยังไม่ได้ระบุข้อมูลสถานประกอบการและแบบฟอร์ม ESAP' : 'Incomplete Enterprise & ESAP Application Data'}
                    </h4>
                    <p className="text-xs text-amber-700 dark:text-amber-300 mt-0.5 leading-relaxed">
                      {language === 'th'
                        ? 'บัญชีนี้ยังไม่มีข้อมูลเชื่อมโยงกับขั้นตอนสมัครสมาชิก (ภ.พ.20, ผู้ประสานงาน, โปรแกรม ESAP และ CA) คุณสามารถกดเติมข้อมูลตัวอย่างเพื่อทดสอบระบบได้ทันที'
                        : 'This account has no linked registration details (P.P.20, contact person, ESAP programs & CA). Click fill sample to test immediately.'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={handleFillSampleDataInDashboard}
                    className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-amber-600 hover:bg-amber-700 rounded-xl shadow-xs transition-colors"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{language === 'th' ? 'เติมข้อมูลตัวอย่างฟอร์ม ESAP' : 'Fill Sample ESAP Data'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleStartEditing}
                    className="px-3.5 py-2 text-xs font-semibold text-amber-900 dark:text-amber-200 bg-amber-100 dark:bg-amber-900/40 hover:bg-amber-200/80 rounded-xl transition-colors border border-amber-300 dark:border-amber-700"
                  >
                    <span>{language === 'th' ? 'กรอกข้อมูล' : 'Edit'}</span>
                  </button>
                </div>
              </div>
            )}

            {/* Container for profile & registration details */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 mb-5 border-b border-slate-100 dark:border-slate-800 gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-slate-900 dark:text-white text-base">
                      {language === 'th' ? 'ข้อมูลบัญชี & สถานประกอบการ' : 'Account & Enterprise Info'}
                    </h3>
                    <span className="text-[11px] px-2 py-0.5 rounded-full font-medium bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-800/60">
                      {language === 'th' ? 'สัมพันธ์กับขั้นตอนสมัครสมาชิก' : 'Registration Linked'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    {language === 'th'
                      ? 'รวบรวมข้อมูลตามขั้นตอนการสมัครสมาชิก 3 ขั้นตอน (บัญชีผู้ใช้, ภ.พ.20/โปรแกรม ESAP, และเอกสาร CA)'
                      : 'Aggregated across all 3 registration steps (Account, P.P.20/Programs, and CA docs)'}
                  </p>
                </div>

                <div className="flex items-center gap-2 self-stretch sm:self-auto">
                  <button
                    type="button"
                    onClick={handleFillSampleDataInDashboard}
                    title="เติมข้อมูลจำลองครบทุกช่อง"
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/50 hover:bg-amber-100 dark:hover:bg-amber-900/60 border border-amber-200 dark:border-amber-800 rounded-lg transition-colors"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                    <span>{language === 'th' ? 'เติมข้อมูลตัวอย่าง' : 'Fill Sample'}</span>
                  </button>

                  {!isEditing ? (
                    <button
                      type="button"
                      onClick={handleStartEditing}
                      className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 rounded-lg transition-colors border border-indigo-200 dark:border-indigo-800"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>{t.editProfile}</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="px-3.5 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors border border-slate-200 dark:border-slate-700"
                    >
                      {t.cancel}
                    </button>
                  )}
                </div>
              </div>

              {isEditing ? (
                /* EDIT FORM */
                <form onSubmit={handleSaveProfile} className="space-y-6">
                  {/* Avatar Picker */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                      {language === 'th' ? 'เลือกรูปโปรไฟล์' : 'Select Avatar'}
                    </label>
                    <div className="flex items-center gap-3 overflow-x-auto pb-2">
                      {avatarPresets.map((preset, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setAvatar(preset)}
                          className={`relative rounded-xl p-0.5 transition-all shrink-0 ${
                            avatar === preset
                              ? 'ring-2 ring-indigo-600 ring-offset-2 dark:ring-offset-slate-900 scale-105'
                              : 'opacity-70 hover:opacity-100'
                          }`}
                        >
                          <img
                            src={preset}
                            alt="Preset avatar"
                            className="w-12 h-12 rounded-lg object-cover bg-slate-100 dark:bg-slate-800"
                            referrerPolicy="no-referrer"
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Group 1: Contact Person / ผู้ประสานงาน */}
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 space-y-3">
                    <h4 className="text-xs font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5">
                      <UserCheck className="w-3.5 h-3.5" />
                      <span>{language === 'th' ? 'ขั้นตอนที่ 1 & ผู้ประสานงาน: ข้อมูลติดต่อ / ผู้ประสานงาน' : 'Step 1 & Coordinator Contact'}</span>
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">
                          คำนำหน้า
                        </label>
                        <select
                          value={editContactPrefix}
                          onChange={(e) => setEditContactPrefix(e.target.value)}
                          className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                        >
                          <option value="นาย">นาย</option>
                          <option value="นาง">นาง</option>
                          <option value="นางสาว">นางสาว</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">
                          ชื่อผู้ประสานงาน
                        </label>
                        <input
                          type="text"
                          value={editContactFirstName}
                          onChange={(e) => setEditContactFirstName(e.target.value)}
                          placeholder="เช่น วราภรณ์"
                          className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">
                          นามสกุลผู้ประสานงาน
                        </label>
                        <input
                          type="text"
                          value={editContactLastName}
                          onChange={(e) => setEditContactLastName(e.target.value)}
                          placeholder="เช่น มั่นคง"
                          className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">
                          ตำแหน่ง
                        </label>
                        <input
                          type="text"
                          value={editContactPosition}
                          onChange={(e) => setEditContactPosition(e.target.value)}
                          placeholder="เช่น ผู้จัดการฝ่ายพิธีการศุลกากร"
                          className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">
                          เบอร์มือถือ
                        </label>
                        <input
                          type="text"
                          value={editContactMobile}
                          onChange={(e) => setEditContactMobile(e.target.value)}
                          placeholder="081-444-5555"
                          className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">
                          อีเมลผู้ประสานงาน
                        </label>
                        <input
                          type="email"
                          value={editContactEmail}
                          onChange={(e) => setEditContactEmail(e.target.value)}
                          placeholder="contact@company.co.th"
                          className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Group 2: Enterprise P.P.20 */}
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 space-y-3">
                    <h4 className="text-xs font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5" />
                      <span>{language === 'th' ? 'ขั้นตอนที่ 2: ข้อมูลสถานประกอบการ (ภ.พ.20) & ที่อยู่' : 'Step 2: P.P.20 Enterprise & Address'}</span>
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">
                          ชื่อสถานประกอบการ (ภ.พ.20 / ภาษาไทย)
                        </label>
                        <input
                          type="text"
                          value={editCompanyTh}
                          onChange={(e) => setEditCompanyTh(e.target.value)}
                          placeholder="บริษัท ตัวอย่าง จำกัด"
                          className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">
                          ชื่อสถานประกอบการ (ภาษาอังกฤษ)
                        </label>
                        <input
                          type="text"
                          value={editCompanyEn}
                          onChange={(e) => setEditCompanyEn(e.target.value)}
                          placeholder="Example Co., Ltd."
                          className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">
                          เลขประจำตัวผู้เสียภาษี 13 หลัก
                        </label>
                        <input
                          type="text"
                          value={editTaxId}
                          onChange={(e) => setEditTaxId(e.target.value)}
                          maxLength={13}
                          placeholder="0105558000123"
                          className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">
                          ทะเบียนนิติบุคคลเลขที่
                        </label>
                        <input
                          type="text"
                          value={editJuristic}
                          onChange={(e) => setEditJuristic(e.target.value)}
                          placeholder="0105558000123"
                          className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">
                          ประเภทธุรกิจ
                        </label>
                        <input
                          type="text"
                          value={editBusinessType}
                          onChange={(e) => setEditBusinessType(e.target.value)}
                          placeholder="นำเข้า-ส่งออกสินค้า"
                          className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">
                        ที่อยู่จดทะเบียนตาม ภ.พ.20
                      </label>
                      <input
                        type="text"
                        value={editAddress}
                        onChange={(e) => setEditAddress(e.target.value)}
                        placeholder="เลขที่ อาคาร ชั้น ถนน แขวง/ตำบล เขต/อำเภอ จังหวัด รหัสไปรษณีย์"
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                      />
                    </div>
                  </div>

                  {/* Group 3: NSW Profile Codes */}
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 space-y-3">
                    <h4 className="text-xs font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5">
                      <FileCode className="w-3.5 h-3.5" />
                      <span>{language === 'th' ? 'หมวดการใช้งาน NSW & รหัสโปรไฟล์' : 'NSW Service Category & Profile Codes'}</span>
                    </h4>
                    <div>
                      <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">
                        หมวดการใช้งาน NSW (Service Categories)
                      </label>
                      <input
                        type="text"
                        value={editNswCategory}
                        onChange={(e) => setEditNswCategory(e.target.value)}
                        placeholder="เช่น NSW Gateway, นำเข้า-ส่งออกทั่วไป"
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-medium text-emerald-700 dark:text-emerald-400 mb-1">
                          รหัสโปรไฟล์ โปร (Production)
                        </label>
                        <input
                          type="text"
                          value={editNswProfileProd}
                          onChange={(e) => setEditNswProfileProd(e.target.value)}
                          placeholder="เช่น NSW-PROD-2024-001"
                          className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-medium text-amber-700 dark:text-amber-400 mb-1">
                          รหัสโปรไฟล์ เทส (Test)
                        </label>
                        <input
                          type="text"
                          value={editNswProfileTest}
                          onChange={(e) => setEditNswProfileTest(e.target.value)}
                          placeholder="เช่น NSW-TEST-2024-001"
                          className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Group 4: ESAP Programs Checklist */}
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5">
                        <Layers className="w-3.5 h-3.5" />
                        <span>{language === 'th' ? 'เลือกใช้โปรแกรม ESAP (ติ๊กเลือกโปรแกรมที่ต้องการใช้งาน)' : 'ESAP Programs Checklist'}</span>
                      </h4>
                      <button
                        type="button"
                        onClick={() => {
                          const allKeys = Object.keys(ESAP_PROGRAM_MAP);
                          setEditSelectedPrograms(editSelectedPrograms.length === allKeys.length ? [] : allKeys);
                        }}
                        className="text-[11px] text-indigo-600 dark:text-indigo-400 hover:underline"
                      >
                        {editSelectedPrograms.length === Object.keys(ESAP_PROGRAM_MAP).length ? 'ยกเลิกทั้งหมด' : 'เลือกทั้งหมด'}
                      </button>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
                      {Object.entries(ESAP_PROGRAM_MAP).map(([key, prog]) => {
                        const isChecked = editSelectedPrograms.includes(key);
                        return (
                          <div
                            key={key}
                            onClick={() => {
                              setEditSelectedPrograms((prev) =>
                                prev.includes(key) ? prev.filter((p) => p !== key) : [...prev, key]
                              );
                            }}
                            className={`p-2.5 rounded-xl border cursor-pointer transition-all flex items-center gap-2.5 ${
                              isChecked
                                ? 'border-indigo-500 bg-indigo-50/70 dark:bg-indigo-950/60 shadow-xs'
                                : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-slate-300'
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => {}}
                              className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 pointer-events-none"
                            />
                            <img
                              src={prog.logo}
                              alt={prog.label}
                              className="w-7 h-7 object-contain rounded shrink-0 bg-white dark:bg-slate-900 p-0.5"
                            />
                            <div className="min-w-0">
                              <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
                                {prog.label}
                              </div>
                              <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                                {prog.desc}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Group 5: CA Password */}
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 space-y-3">
                    <h4 className="text-xs font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5">
                      <Key className="w-3.5 h-3.5" />
                      <span>{language === 'th' ? 'ขั้นตอนที่ 3: รหัสผ่าน CA (Password CA - .p12 / PFX)' : 'Step 3: CA Password'}</span>
                    </h4>
                    <div className="relative">
                      <input
                        type={showCaPasswordInDashboard ? 'text' : 'password'}
                        value={editCaPassword}
                        onChange={(e) => setEditCaPassword(e.target.value)}
                        placeholder="กรอกรหัสผ่านสำหรับไฟล์ CA (.p12) ถ้ามี"
                        className="w-full px-3 py-2 pr-10 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
                      />
                      <button
                        type="button"
                        onClick={() => setShowCaPasswordInDashboard(!showCaPasswordInDashboard)}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                      >
                        {showCaPasswordInDashboard ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Bio */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      {language === 'th' ? 'เกี่ยวกับฉัน (Bio)' : 'Bio'}
                    </label>
                    <textarea
                      rows={2}
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      placeholder={language === 'th' ? 'เขียนแนะนำตัวเองสั้นๆ...' : 'A brief description...'}
                      className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                    />
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-3 pt-2">
                    <button
                      type="submit"
                      className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors shadow-xs"
                    >
                      <Save className="w-4 h-4" />
                      <span>{t.saveChanges}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                      {t.cancel}
                    </button>
                  </div>
                </form>
              ) : (
                /* VIEW MODE - 4 STRUCTURED SECTIONS */
                <div className="space-y-6">
                  {/* Section 1: ข้อมูลบัญชีผู้ใช้งาน & ผู้ประสานงาน */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-xs text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5 uppercase tracking-wider">
                        <UserCheck className="w-3.5 h-3.5" />
                        <span>{language === 'th' ? '1. ข้อมูลบัญชีผู้ใช้งาน & ผู้ประสานงาน' : '1. Account & Coordinator Contact'}</span>
                      </h4>
                      <span className="text-[10px] text-slate-400">ขั้นตอนที่ 1 & 2</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                      <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                        <span className="text-slate-500 dark:text-slate-400 text-xs block mb-1">
                          {t.username}
                        </span>
                        <span className="font-semibold text-slate-900 dark:text-white text-xs sm:text-sm font-mono text-indigo-600 dark:text-indigo-400">
                          @{user.username}
                        </span>
                      </div>

                      <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                        <span className="text-slate-500 dark:text-slate-400 text-xs block mb-1">
                          {t.email}
                        </span>
                        <span className="font-semibold text-slate-900 dark:text-white text-xs sm:text-sm break-all">
                          {user.email || userApp?.contactEmail || userApp?.email || '-'}
                        </span>
                      </div>

                      <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                        <span className="text-slate-500 dark:text-slate-400 text-xs block mb-1">
                          {t.phone}
                        </span>
                        <span className="font-semibold text-slate-900 dark:text-white text-xs sm:text-sm font-mono">
                          {user.phone || userApp?.contactMobile || userApp?.contactPhone || '-'}
                        </span>
                      </div>

                      <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                        <span className="text-slate-500 dark:text-slate-400 text-xs block mb-1">
                          {language === 'th' ? 'สถานะบัญชี' : 'Status'}
                        </span>
                        <span className="inline-flex items-center gap-1 font-semibold text-emerald-600 dark:text-emerald-400 text-xs">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>{language === 'th' ? 'ปกติ (Active)' : 'Active'}</span>
                        </span>
                      </div>
                    </div>

                    {/* Coordinator Contact Card */}
                    <div className="p-3.5 rounded-xl bg-gradient-to-r from-slate-50 to-indigo-50/30 dark:from-slate-800/60 dark:to-indigo-950/20 border border-slate-200/80 dark:border-slate-800">
                      <div className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-1.5">
                        <Briefcase className="w-3.5 h-3.5 text-indigo-500" />
                        <span>{language === 'th' ? 'ข้อมูลผู้ประสานงาน (ตามแบบฟอร์ม ESAP):' : 'Coordinator Contact Details:'}</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                        <div>
                          <span className="text-slate-500 dark:text-slate-400 block mb-0.5">ชื่อ-นามสกุล / ตำแหน่ง</span>
                          <span className="font-bold text-slate-900 dark:text-white">
                            {userApp?.contactFirstName
                              ? `${userApp.contactPrefix ? userApp.contactPrefix + ' ' : ''}${userApp.contactFirstName} ${userApp.contactLastName || ''}`
                              : (user.name || '-')}
                          </span>
                          {userApp?.contactPosition && (
                            <span className="text-[11px] text-slate-500 dark:text-slate-400 block">
                              ({userApp.contactPosition})
                            </span>
                          )}
                        </div>
                        <div>
                          <span className="text-slate-500 dark:text-slate-400 block mb-0.5">เบอร์มือถือผู้ประสานงาน</span>
                          <span className="font-semibold text-slate-900 dark:text-white font-mono">
                            {userApp?.contactMobile || userApp?.contactPhone || user.phone || '-'}
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-500 dark:text-slate-400 block mb-0.5">อีเมลติดต่อประสานงาน</span>
                          <span className="font-semibold text-slate-900 dark:text-white break-all">
                            {userApp?.contactEmail || user.email || '-'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Section 2: ข้อมูลสถานประกอบการ (ภ.พ.20) & ที่อยู่ */}
                  <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-xs text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5 uppercase tracking-wider">
                        <Building2 className="w-3.5 h-3.5" />
                        <span>{language === 'th' ? '2. ข้อมูลสถานประกอบการ (ภ.พ.20) & ที่อยู่' : '2. Enterprise (P.P.20) & Address'}</span>
                      </h4>
                      <span className="text-[10px] px-2 py-0.5 rounded-md font-medium bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-800/60">
                        ESAP ebXML
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                        <span className="text-slate-500 dark:text-slate-400 text-xs block mb-0.5">
                          {language === 'th' ? 'ชื่อสถานประกอบการ (ภ.พ.20 / ภาษาไทย)' : 'Company Name (P.P.20 / TH)'}
                        </span>
                        <span className="font-semibold text-slate-900 dark:text-white text-xs sm:text-sm">
                          {user.companyNameTh || user.companyName || userApp?.companyNameTh || userApp?.companyName || '-'}
                        </span>
                      </div>

                      <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                        <span className="text-slate-500 dark:text-slate-400 text-xs block mb-0.5">
                          {language === 'th' ? 'ชื่อสถานประกอบการ (ภาษาอังกฤษ)' : 'Company Name (EN)'}
                        </span>
                        <span className="font-semibold text-slate-900 dark:text-white text-xs sm:text-sm">
                          {user.companyNameEn || userApp?.companyNameEn || '-'}
                        </span>
                      </div>

                      <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                        <span className="text-slate-500 dark:text-slate-400 text-xs block mb-0.5">
                          {language === 'th' ? 'เลขประจำตัวผู้เสียภาษี 13 หลัก' : 'Tax ID (13 digits)'}
                        </span>
                        <span className="font-semibold text-slate-900 dark:text-white text-xs sm:text-sm font-mono tracking-wider">
                          {user.taxId || userApp?.taxId || '-'}
                        </span>
                      </div>

                      <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                        <span className="text-slate-500 dark:text-slate-400 text-xs block mb-0.5">
                          {language === 'th' ? 'ทะเบียนนิติบุคคลเลขที่' : 'Juristic Registered No.'}
                        </span>
                        <span className="font-semibold text-slate-900 dark:text-white text-xs font-mono">
                          {user.juristicNumber || userApp?.juristicNumber || user.taxId || '-'}
                        </span>
                      </div>

                      <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                        <span className="text-slate-500 dark:text-slate-400 text-xs block mb-0.5">
                          {language === 'th' ? 'ประเภท Paperless Type / ธุรกิจ' : 'Paperless Type / Business'}
                        </span>
                        <span className="font-semibold text-indigo-700 dark:text-indigo-300 text-xs">
                          {(user.paperlessType || userApp?.paperlessType || 'Exporter/Importer')}
                          {(user.businessType || userApp?.businessType) ? ` • ${user.businessType || userApp?.businessType}` : ''}
                        </span>
                      </div>

                      <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                        <span className="text-slate-500 dark:text-slate-400 text-xs block mb-0.5">
                          {language === 'th' ? 'Ref ID (Production / Test)' : 'Ref ID (Prod / Test)'}
                        </span>
                        <span className="font-semibold text-slate-900 dark:text-white text-xs font-mono">
                          {userApp?.refIdProduction || userApp?.refIdTest
                            ? `${userApp.refIdProduction || '-'} (Prod) / ${userApp.refIdTest || '-'} (Test)`
                            : '-'}
                        </span>
                      </div>

                      {/* Full registered address */}
                      <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 sm:col-span-2">
                        <span className="text-slate-500 dark:text-slate-400 text-xs block mb-0.5 flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-rose-500" />
                          <span>{language === 'th' ? 'ที่อยู่ตาม ภ.พ.20 (สถานที่จัดส่งใบแจ้งค่าใช้บริการ/วางบิล)' : 'Registered Address (P.P.20)'}</span>
                        </span>
                        <span className="font-medium text-slate-800 dark:text-slate-200 text-xs sm:text-sm leading-relaxed">
                          {userApp?.registeredAddress || (userApp?.billingHouseNo ? `${userApp.billingHouseNo} ${userApp.billingBuilding || ''} ${userApp.billingRoad || ''} ${userApp.billingSubDistrict || ''} ${userApp.billingDistrict || ''} ${userApp.billingProvince || ''} ${userApp.billingPostalCode || ''}`.trim() : '-')}
                        </span>
                      </div>

                      {/* NSW Service Category */}
                      <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                        <span className="text-slate-500 dark:text-slate-400 text-xs block mb-1">
                          {language === 'th' ? 'หมวดการใช้งาน NSW' : 'Service Category'}
                        </span>
                        <div className="font-semibold text-slate-900 dark:text-white text-xs leading-relaxed">
                          {user.nswCategory || userApp?.nswCategory ? (
                            <div className="flex flex-wrap gap-1 mt-0.5">
                              {(user.nswCategory || userApp?.nswCategory || '')
                                .split(',')
                                .map((c) => c.trim())
                                .filter(Boolean)
                                .map((cat, i) => (
                                  <span
                                    key={i}
                                    className="inline-flex items-center px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800 text-[11px] font-medium"
                                  >
                                    {cat}
                                  </span>
                                ))}
                            </div>
                          ) : (
                            <span className="text-slate-400 dark:text-slate-500 font-normal">-</span>
                          )}
                        </div>
                      </div>

                      {/* NSW Profile Codes */}
                      <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                        <span className="text-slate-500 dark:text-slate-400 text-xs block mb-1">
                          {language === 'th' ? 'รหัสโปรไฟล์ NSW (โปร & เทส)' : 'NSW Profile Codes (Prod & Test)'}
                        </span>
                        {((user.nswProfiles && user.nswProfiles.length > 0) || (userApp?.nswProfiles && userApp.nswProfiles.length > 0)) ? (
                          <div className="flex flex-col gap-1.5 mt-0.5 font-mono text-xs">
                            {(user.nswProfiles || userApp?.nswProfiles || []).map((p, idx) => (
                              <div key={idx} className="flex items-center gap-1.5 flex-wrap">
                                <span
                                  className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                                    p.type === 'production'
                                      ? 'bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
                                      : 'bg-amber-100 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800'
                                  }`}
                                >
                                  {p.type === 'production' ? 'โปร (Prod)' : 'เทส (Test)'}
                                </span>
                                <span className="font-semibold text-slate-900 dark:text-white">
                                  {p.code}
                                </span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <span className="font-semibold text-emerald-600 dark:text-emerald-400 text-xs font-mono">
                            {user.nswProfile || userApp?.nswProfile || '-'}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Section 3: โปรแกรม ESAP ที่เลือกใช้งาน */}
                  <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-xs text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5 uppercase tracking-wider">
                        <Layers className="w-3.5 h-3.5" />
                        <span>{language === 'th' ? '3. โปรแกรม ESAP ที่เลือกใช้งาน (7 โปรแกรม)' : '3. Selected ESAP Programs'}</span>
                      </h4>
                      <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                        เลือกแล้ว {((user.selectedPrograms || userApp?.selectedPrograms || []).length)} / 7 โปรแกรม
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
                      {Object.entries(ESAP_PROGRAM_MAP).map(([key, prog]) => {
                        const isSelected = (user.selectedPrograms || userApp?.selectedPrograms || []).includes(key);
                        return (
                          <div
                            key={key}
                            className={`p-2.5 rounded-xl border transition-all flex items-center gap-2.5 ${
                              isSelected
                                ? 'border-emerald-400 dark:border-emerald-700 bg-emerald-50/50 dark:bg-emerald-950/30'
                                : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 opacity-60'
                            }`}
                          >
                            <img
                              src={prog.logo}
                              alt={prog.label}
                              className="w-8 h-8 object-contain rounded shrink-0 bg-white dark:bg-slate-900 p-0.5 border border-slate-200 dark:border-slate-700"
                            />
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-slate-900 dark:text-white truncate">
                                  {prog.label}
                                </span>
                                {isSelected ? (
                                  <span className="text-[9px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-900/60 px-1 rounded">
                                    ใช้งาน
                                  </span>
                                ) : (
                                  <span className="text-[9px] text-slate-400">
                                    -
                                  </span>
                                )}
                              </div>
                              <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                                {prog.desc}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Section 4: สถานะเอกสารและรหัสผ่าน CA */}
                  <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-xs text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5 uppercase tracking-wider">
                        <FileCheck2 className="w-3.5 h-3.5" />
                        <span>{language === 'th' ? '4. สถานะเอกสารและรหัสผ่าน CA' : '4. CA Documents & Password'}</span>
                      </h4>
                      <span className="text-[10px] text-slate-400">ขั้นตอนที่ 3</span>
                    </div>

                    {/* CA Documents list */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      {[
                        { title: 'สำเนา ภ.พ.20 (ภพ.20)', type: 'vat_pp20' },
                        { title: 'หนังสือมอบอำนาจพร้อมติดอากรสแตมป์ (ถ้ามี)', type: 'power_of_attorney' },
                        { title: 'สำเนาบัตรผู้รับมอบอำนาจ', type: 'attorney_id' },
                        { title: 'หนังสือรับรองนิติบุคคล (DBD คัดสำเนาไม่เกิน 6 เดือน)', type: 'company_cert' },
                        { title: 'สำเนาบัตรประชาชนกรรมการผู้มีอำนาจ (พร้อมลงนามรับรอง)', type: 'director_id' },
                        { title: 'เอกสารคำขอใช้งาน Digital Certificate / ใบสมัคร CA (ไฟล์ .p12)', type: 'ca_request' },
                      ].map((docItem, idx) => {
                        const matchedDoc = userApp?.documents?.find((d) => d.type === docItem.type && d.fileName);
                        return (
                          <div
                            key={idx}
                            className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2"
                          >
                            <div className="min-w-0">
                              <span className="font-medium text-slate-800 dark:text-slate-200 block truncate">
                                {docItem.title}
                              </span>
                              {matchedDoc?.fileName && (
                                <span className="text-[10px] text-indigo-600 dark:text-indigo-400 truncate block">
                                  📎 {matchedDoc.fileName}
                                </span>
                              )}
                            </div>
                            <span
                              className={`shrink-0 text-[10px] px-2 py-0.5 rounded-full font-medium ${
                                matchedDoc?.fileName
                                  ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300'
                                  : 'bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400'
                              }`}
                            >
                              {matchedDoc?.fileName ? 'แนบแล้ว' : 'ยังไม่ได้แนบ'}
                            </span>
                          </div>
                        );
                      })}
                    </div>

                    {/* CA Password display */}
                    <div className="p-3 rounded-xl bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/50 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Key className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
                        <div>
                          <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 block">
                            รหัสผ่าน CA (Password CA - .p12 / PFX)
                          </span>
                          <span className="text-[11px] font-mono text-slate-600 dark:text-slate-300">
                            {showCaPasswordInDashboard
                              ? (user.caPassword || userApp?.caPassword || '(ไม่ได้ระบุรหัสผ่าน)')
                              : '••••••••••••'}
                          </span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setShowCaPasswordInDashboard(!showCaPasswordInDashboard)}
                        className="text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 flex items-center gap-1 px-2.5 py-1 rounded-lg hover:bg-indigo-100/50 dark:hover:bg-indigo-900/40"
                      >
                        {showCaPasswordInDashboard ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        <span>{showCaPasswordInDashboard ? 'ซ่อน' : 'แสดง'}</span>
                      </button>
                    </div>
                  </div>

                  {/* Navigation to full ebXML printable view */}
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => setActiveTab('esap')}
                      className="w-full py-2.5 px-4 rounded-xl border border-indigo-200 dark:border-indigo-800/80 bg-indigo-50/60 dark:bg-indigo-950/40 text-xs font-semibold text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 flex items-center justify-center gap-2 transition-colors shadow-2xs"
                    >
                      <FileText className="w-4 h-4" />
                      <span>
                        {language === 'th'
                          ? 'เปิดดูใบสมัครสมาชิกโปรแกรม ESAP (Paperless ebXML) ฉบับเต็ม'
                          : 'Open Full ESAP Paperless ebXML Application'}
                      </span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Membership Badge & Verification Sidebar */}
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-950 text-white rounded-2xl p-6 shadow-md relative overflow-hidden">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <img
                    src="/assets/aistudio/image_7cb182a3.png"
                    alt="ESAP"
                    className="h-5 w-auto object-contain bg-white/10 rounded px-1.5 py-0.5"
                  />
                  <span className="text-xs uppercase tracking-widest text-indigo-200 font-bold font-mono">
                    ESAP DIGITAL ID
                  </span>
                </div>
                <Shield className="w-5 h-5 text-indigo-400" />
              </div>

              <div className="mb-6">
                <div className="text-xs text-indigo-300 mb-0.5">{t.memberRole}</div>
                <div className="text-xl font-bold">
                  {user.role === 'admin' ? t.roleAdmin : user.role === 'pro' ? t.rolePro : t.roleMember}
                </div>
              </div>

              <div className="pt-4 border-t border-indigo-800/60 flex items-center justify-between text-xs font-mono text-indigo-200">
                <span>UID: {user.id}</span>
                <span>PDPA VERIFIED</span>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs">
              <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">
                {language === 'th' ? 'ความพร้อมด้านความปลอดภัย' : 'Security Health'}
              </h4>
              <div className="space-y-2.5 text-xs">
                <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                  <span className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <span>{language === 'th' ? 'อีเมลได้รับการยืนยัน' : 'Email Verified'}</span>
                  </span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-semibold font-mono">100%</span>
                </div>

                <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                  <span className="flex items-center gap-2">
                    <CheckCircle2 className={`w-4 h-4 ${twoFactor ? 'text-emerald-500' : 'text-slate-400'}`} />
                    <span>{t.twoFactorTitle}</span>
                  </span>
                  <span className={twoFactor ? 'text-emerald-600 dark:text-emerald-400 font-semibold' : 'text-slate-400'}>
                    {twoFactor ? (language === 'th' ? 'เปิด' : 'ON') : (language === 'th' ? 'ปิด' : 'OFF')}
                  </span>
                </div>

                <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                  <span className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <span>{language === 'th' ? 'การเข้ารหัสข้อมูล' : 'Encryption'}</span>
                  </span>
                  <span className="font-mono text-slate-700 dark:text-slate-300">AES-256</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab: ESAP Paperless ebXML Application Form */}
      {activeTab === 'esap' && (
        <div className="space-y-6">
          {/* Top Actions & Summary Banner */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <span className="font-mono text-xs px-2.5 py-1 rounded-md bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 font-bold border border-indigo-200/60 dark:border-indigo-800/60">
                  {userApp?.id || `APP-ESAP-${user.taxId?.slice(-5) || '2024'}`}
                </span>
                <span className="text-xs px-2.5 py-1 rounded-md bg-emerald-50 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 font-medium flex items-center gap-1 border border-emerald-200/60 dark:border-emerald-800/60">
                  <BadgeCheck className="w-3.5 h-3.5" />
                  <span>
                    {userApp?.status === 'needs_revision'
                      ? 'CS แจ้งให้ยื่นเอกสารเพิ่มเติม'
                      : userApp?.status === 'pending_cs'
                      ? 'รอ CS ตรวจสอบข้อมูล'
                      : 'อนุมัติเรียบร้อย (Active)'}
                  </span>
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  ยื่นคำขอเมื่อ {userApp?.submittedAt ? new Date(userApp.submittedAt).toLocaleDateString('th-TH') : 'วันนี้'}
                </span>
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                ใบสมัครสมาชิกโปรแกรม ESAP (Paperless ebXML – Application Form)
              </h3>
            </div>

            <div className="flex items-center gap-2 self-stretch sm:self-auto flex-wrap">
              <button
                type="button"
                onClick={() => {
                  const refText = userApp?.refIdProduction || userApp?.refIdTest || '-';
                  navigator.clipboard.writeText(refText);
                  setCopiedRef(true);
                  setTimeout(() => setCopiedRef(false), 2000);
                }}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-colors"
              >
                {copiedRef ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedRef ? 'คัดลอก Ref ID แล้ว' : 'คัดลอก Ref ID'}</span>
              </button>

              <button
                type="button"
                onClick={() => window.print()}
                className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors shadow-xs"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>พิมพ์แบบฟอร์ม (Print / PDF)</span>
              </button>
            </div>
          </div>

          {/* Paper Form Preview Container */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border-2 border-slate-300 dark:border-slate-700 shadow-md p-6 sm:p-8 font-sans">
            {/* Form Header */}
            <div className="text-center pb-4 mb-6 border-b-2 border-slate-300 dark:border-slate-700">
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                ใบสมัครสมาชิกโปรแกรม ESAP
              </h2>
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mt-0.5">
                (Paperless ebXML – Application Form)
              </p>
            </div>

            {/* Section 1: Ref ID Paperless Type */}
            <div className="mb-6 pb-5 border-b border-dashed border-slate-300 dark:border-slate-700 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 text-xs sm:text-sm">
                <span className="font-semibold text-slate-800 dark:text-slate-200 whitespace-nowrap min-w-36">
                  Ref ID Paperless Type :
                </span>
                <div className="flex flex-wrap items-center gap-4 sm:gap-6">
                  {(['Customs Broker', 'Service Counter', 'Exporter/Importer'] as const).map((type) => {
                    const isSelected = (userApp?.paperlessType || user.paperlessType || '') === type;
                    return (
                      <div key={type} className="flex items-center gap-2">
                        <div
                          className={`w-4 h-4 rounded-xs border flex items-center justify-center transition-colors ${
                            isSelected
                              ? 'bg-indigo-600 border-indigo-600 text-white'
                              : 'border-slate-400 dark:border-slate-600 bg-white dark:bg-slate-800'
                          }`}
                        >
                          {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                        <span className={`text-xs ${isSelected ? 'font-bold text-indigo-900 dark:text-indigo-200' : 'text-slate-600 dark:text-slate-400'}`}>
                          {type}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-slate-700 dark:text-slate-300 min-w-16">Test :</span>
                  <span className="font-mono bg-slate-50 dark:bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 flex-1">
                    {userApp?.refIdTest || '-'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-slate-700 dark:text-slate-300 min-w-20">Production :</span>
                  <span className="font-mono bg-slate-50 dark:bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 flex-1 font-bold text-indigo-700 dark:text-indigo-300">
                    {userApp?.refIdProduction || '-'}
                  </span>
                </div>
              </div>
            </div>

            {/* Section 2: ข้อมูลผู้ขอใช้บริการ */}
            <div className="mb-6 pb-5 border-b border-dashed border-slate-300 dark:border-slate-700">
              <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white mb-3">
                ข้อมูลผู้ขอใช้บริการ :
              </h4>
              <div className="space-y-2.5 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 sm:items-center">
                  <span className="sm:col-span-3 text-slate-600 dark:text-slate-400 font-medium">
                    ▪ ชื่อบริษัท/นิติบุคคล (ภาษาไทย)
                  </span>
                  <div className="sm:col-span-9 p-2 rounded-lg bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 font-semibold text-slate-900 dark:text-white">
                    {userApp?.companyNameTh || userApp?.companyName || user.companyNameTh || user.companyName || '-'}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 sm:items-center">
                  <span className="sm:col-span-3 text-slate-600 dark:text-slate-400 font-medium">
                    ชื่อ (ภาษาอังกฤษ)
                  </span>
                  <div className="sm:col-span-9 p-2 rounded-lg bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200">
                    {userApp?.companyNameEn || user.companyNameEn || '-'}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 sm:items-center">
                  <span className="sm:col-span-3 text-slate-600 dark:text-slate-400 font-medium">
                    ประเภทธุรกิจ
                  </span>
                  <div className="sm:col-span-4 p-2 rounded-lg bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200">
                    {userApp?.businessType || user.businessType || '-'}
                  </div>
                  <span className="sm:col-span-2 text-slate-600 dark:text-slate-400 font-medium sm:text-right">
                    ทะเบียนนิติบุคคลเลขที่
                  </span>
                  <div className="sm:col-span-3 p-2 rounded-lg bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 font-mono text-slate-800 dark:text-slate-200">
                    {userApp?.juristicNumber || user.juristicNumber || '-'}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 sm:items-center">
                  <span className="sm:col-span-3 text-slate-600 dark:text-slate-400 font-medium">
                    เลขประจำตัวผู้เสียภาษีอากร
                  </span>
                  <div className="sm:col-span-4 p-2 rounded-lg bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 font-mono text-slate-900 dark:text-white font-semibold">
                    {userApp?.taxId || user.taxId || '-'}
                  </div>
                  <span className="sm:col-span-2 text-slate-600 dark:text-slate-400 font-medium sm:text-right">
                    สาขา
                  </span>
                  <div className="sm:col-span-3 p-2 rounded-lg bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 font-mono text-slate-800 dark:text-slate-200">
                    {userApp?.branchType === 'branch' && userApp.branchNumber
                      ? `สาขา ${userApp.branchNumber}`
                      : userApp?.branchType === 'headquarters'
                      ? 'สำนักงานใหญ่ (00000)'
                      : '-'}
                  </div>
                </div>
              </div>
            </div>

            {/* Section 3: สถานที่จัดส่งใบแจ้งค่าใช้บริการ/วางบิล */}
            <div className="mb-6 pb-5 border-b border-dashed border-slate-300 dark:border-slate-700">
              <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white mb-3">
                สถานที่จัดส่งใบแจ้งค่าใช้บริการ/วางบิล :
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-2 text-xs">
                <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
                  <span className="text-[10px] text-slate-400 block">เลขที่</span>
                  <span className="font-medium text-slate-800 dark:text-slate-200">{userApp?.billingHouseNo || '-'}</span>
                </div>
                <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
                  <span className="text-[10px] text-slate-400 block">หมู่ที่</span>
                  <span className="font-medium text-slate-800 dark:text-slate-200">{userApp?.billingMoo || '-'}</span>
                </div>
                <div className="col-span-2 p-2 rounded-lg bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
                  <span className="text-[10px] text-slate-400 block">หมู่บ้าน/อาคาร</span>
                  <span className="font-medium text-slate-800 dark:text-slate-200">{userApp?.billingBuilding || '-'}</span>
                </div>
                <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
                  <span className="text-[10px] text-slate-400 block">ซอย</span>
                  <span className="font-medium text-slate-800 dark:text-slate-200">{userApp?.billingSoi || '-'}</span>
                </div>
                <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
                  <span className="text-[10px] text-slate-400 block">ถนน</span>
                  <span className="font-medium text-slate-800 dark:text-slate-200">{userApp?.billingRoad || '-'}</span>
                </div>
                <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
                  <span className="text-[10px] text-slate-400 block">ตำบล/แขวง</span>
                  <span className="font-medium text-slate-800 dark:text-slate-200">{userApp?.billingSubDistrict || '-'}</span>
                </div>
                <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
                  <span className="text-[10px] text-slate-400 block">อำเภอ/เขต</span>
                  <span className="font-medium text-slate-800 dark:text-slate-200">{userApp?.billingDistrict || '-'}</span>
                </div>
                <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
                  <span className="text-[10px] text-slate-400 block">จังหวัด</span>
                  <span className="font-medium text-slate-800 dark:text-slate-200">{userApp?.billingProvince || '-'}</span>
                </div>
                <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
                  <span className="text-[10px] text-slate-400 block">รหัสไปรษณีย์</span>
                  <span className="font-medium font-mono text-slate-800 dark:text-slate-200">{userApp?.billingPostalCode || '-'}</span>
                </div>
                <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
                  <span className="text-[10px] text-slate-400 block">โทรศัพท์</span>
                  <span className="font-medium font-mono text-slate-800 dark:text-slate-200">{userApp?.billingPhone || user.phone || '-'}</span>
                </div>
                <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
                  <span className="text-[10px] text-slate-400 block">โทรสาร</span>
                  <span className="font-medium font-mono text-slate-800 dark:text-slate-200">{userApp?.billingFax || '-'}</span>
                </div>
                <div className="col-span-2 lg:col-span-4 p-2 rounded-lg bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
                  <span className="text-[10px] text-slate-400 block">e-mail</span>
                  <span className="font-medium text-slate-800 dark:text-slate-200">{userApp?.billingEmail || user.email || '-'}</span>
                </div>
              </div>
            </div>

            {/* Section 4: สถานที่ติดตั้งระบบ */}
            <div className="mb-6 pb-5 border-b border-dashed border-slate-300 dark:border-slate-700">
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-3">
                <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                  สถานที่ติดตั้งระบบ :
                </h4>
                <div className="flex items-center gap-4 text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-xs border border-indigo-600 bg-indigo-600 text-white flex items-center justify-center">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </div>
                    <span className="text-slate-700 dark:text-slate-300 font-medium">
                      {userApp?.installSameAsBilling ? 'ที่อยู่ตามสถานที่จัดส่งใบแจ้งค่าใช้บริการ/วางบิล' : 'ที่อยู่อื่นๆ ที่ระบุ'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 5: ข้อมูลติดต่อ/ผู้ประสานงาน */}
            <div className="mb-6 pb-5 border-b border-dashed border-slate-300 dark:border-slate-700">
              <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white mb-3">
                ข้อมูลติดต่อ/ผู้ประสานงาน :
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
                <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
                  <span className="text-[10px] text-slate-400 block">ชื่อ-นามสกุล ผู้ประสานงาน</span>
                  <span className="font-semibold text-slate-900 dark:text-white">
                    {(userApp?.contactFirstName || userApp?.contactLastName)
                      ? `${userApp?.contactPrefix || ''} ${userApp?.contactFirstName || ''} ${userApp?.contactLastName || ''}`.trim()
                      : '-'}
                  </span>
                </div>

                <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
                  <span className="text-[10px] text-slate-400 block">ตำแหน่ง</span>
                  <span className="font-medium text-slate-800 dark:text-slate-200">
                    {userApp?.contactPosition || '-'}
                  </span>
                </div>

                <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
                  <span className="text-[10px] text-slate-400 block">เบอร์โทรศัพท์ / มือถือ</span>
                  <span className="font-medium font-mono text-slate-800 dark:text-slate-200">
                    {userApp?.contactMobile || userApp?.contactPhone || user.phone || '-'}
                  </span>
                </div>

                <div className="col-span-1 sm:col-span-2 lg:col-span-3 p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
                  <span className="text-[10px] text-slate-400 block">อีเมลประสานงาน (e-mail)</span>
                  <span className="font-medium text-slate-800 dark:text-slate-200">
                    {userApp?.contactEmail || user.email || '-'}
                  </span>
                </div>
              </div>
            </div>

            {/* Section 6: โปรแกรม ESAP ที่เลือกใช้งาน (Selected Programs) */}
            <div className="mb-6 pb-5 border-b border-dashed border-slate-300 dark:border-slate-700">
              <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white mb-3 flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Laptop className="w-4 h-4 text-amber-500" />
                  <span>โปรแกรม ESAP ที่เลือกใช้งาน (Selected Programs) :</span>
                </span>
                <span className="text-xs font-normal text-slate-500">
                  {((userApp?.selectedPrograms && userApp.selectedPrograms.length > 0)
                    ? userApp.selectedPrograms
                    : (user.selectedPrograms || [])
                  ).length > 0
                    ? `เลือกแล้ว ${((userApp?.selectedPrograms && userApp.selectedPrograms.length > 0) ? userApp.selectedPrograms : (user.selectedPrograms || [])).length} โปรแกรม`
                    : 'ไม่ได้ระบุ'}
                </span>
              </h4>

              {(() => {
                const activePrograms =
                  userApp?.selectedPrograms && userApp.selectedPrograms.length > 0
                    ? userApp.selectedPrograms
                    : user.selectedPrograms || [];

                if (activePrograms.length === 0) {
                  return (
                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs text-slate-500 dark:text-slate-400">
                      ไม่ได้เลือกโปรแกรมเฉพาะเจาะจง (สามารถแจ้งเจ้าหน้าที่ CS เพื่อเปิดใช้งานโมดูลเพิ่มเติมได้ตลอดเวลา)
                    </div>
                  );
                }

                return (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {activePrograms.map((progId) => {
                      const progInfo = ESAP_PROGRAM_MAP[progId] || { label: progId, desc: progId, logo: '', code: '' };
                      return (
                        <div
                          key={progId}
                          className="flex items-center gap-2.5 p-2.5 rounded-xl bg-amber-50/80 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 text-xs text-slate-900 dark:text-white"
                        >
                          {progInfo.logo && (
                            <img
                              src={progInfo.logo}
                              alt={progInfo.label}
                              className="h-8 w-auto max-w-[55px] object-contain shrink-0"
                            />
                          )}
                          <div className="min-w-0">
                            <span className="font-bold text-amber-900 dark:text-amber-200 block truncate">
                              {progInfo.label}
                            </span>
                            <span className="text-[10px] text-slate-500 dark:text-slate-400 block truncate">
                              {progInfo.desc}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              })()}
            </div>

            {/* Section 7: เอกสารประกอบและสถานะใบรับรองดิจิทัล (CA) */}
            <div>
              <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white mb-3 flex items-center justify-between">
                <span>รายการเอกสารแนบเพื่อใช้งานระบบ CA (Digital Certificate) :</span>
                {userApp?.documents && userApp.documents.some((d: CaDocument) => Boolean(d.fileName)) ? (
                  <span className="text-xs font-normal text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> แนบเอกสารแล้ว
                  </span>
                ) : (
                  <span className="text-xs font-normal text-slate-400 flex items-center gap-1">
                    ยังไม่มีการแนบเอกสาร (เว้นว่างตามที่สมัคร)
                  </span>
                )}
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {(
                  userApp?.documents || [
                    { id: '1', name: 'สำเนา ภ.พ.20 (ภพ.20)', type: 'pp20', fileName: '', fileSize: '', uploadedAt: '', status: 'pending' },
                    { id: 'poa', name: 'หนังสือมอบอำนาจพร้อมติดอากรสแตมป์ (ถ้ามี)', type: 'power_of_attorney', fileName: '', fileSize: '', uploadedAt: '', status: 'pending' },
                    { id: 'attorney_id', name: 'สำเนาบัตรผู้รับมอบอำนาจ', type: 'attorney_id', fileName: '', fileSize: '', uploadedAt: '', status: 'pending' },
                    { id: '2', name: 'หนังสือรับรองนิติบุคคล (DBD คัดสำเนาไม่เกิน 6 เดือน)', type: 'company_cert', fileName: '', fileSize: '', uploadedAt: '', status: 'pending' },
                    { id: '3', name: 'สำเนาบัตรประชาชนกรรมการผู้มีอำนาจ (พร้อมลงนามรับรอง)', type: 'director_id', fileName: '', fileSize: '', uploadedAt: '', status: 'pending' },
                    { id: '4', name: 'เอกสารคำขอใช้งาน Digital Certificate / ใบสมัคร CA (ไฟล์ .p12)', type: 'ca_request', fileName: '', fileSize: '', uploadedAt: '', status: 'pending' },
                  ]
                ).map((doc: CaDocument) => {
                  const isAttached = Boolean(doc.fileName);
                  return (
                    <div
                      key={doc.id}
                      className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2.5 overflow-hidden">
                        <FileCheck2
                          className={`w-5 h-5 shrink-0 ${
                            isAttached ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-300 dark:text-slate-600'
                          }`}
                        />
                        <div className="truncate">
                          <span className="font-semibold text-slate-800 dark:text-slate-200 block truncate">
                            {doc.name}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono truncate block">
                            {isAttached ? `${doc.fileName} ${doc.fileSize ? `(${doc.fileSize})` : ''}` : '(ยังไม่แนบเอกสาร)'}
                          </span>
                        </div>
                      </div>
                      <span
                        className={`shrink-0 text-[10px] font-semibold px-2 py-0.5 rounded-md ${
                          isAttached
                            ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300'
                            : 'bg-slate-200/80 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                        }`}
                      >
                        {isAttached ? 'ตรวจรับรองแล้ว' : 'ยังไม่แนบ'}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* รหัสผ่าน CA (ไฟล์ .p12) */}
              <div className="mt-3.5 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1.5">
                  <div className="flex items-center gap-2">
                    <KeyRound className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                    <span className="font-semibold text-xs text-slate-800 dark:text-slate-200">
                      {language === 'th' ? 'รหัสผ่าน CA (Password CA - ไฟล์ .p12 / PFX)' : 'CA Password (.p12 / PFX File)'}
                    </span>
                  </div>
                  {(user.caPassword || userApp?.caPassword) && (
                    <button
                      type="button"
                      onClick={() => setShowCaPasswordInDashboard(!showCaPasswordInDashboard)}
                      className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 font-medium self-start sm:self-auto cursor-pointer"
                    >
                      {showCaPasswordInDashboard ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      <span>{showCaPasswordInDashboard ? (language === 'th' ? 'ซ่อนรหัสผ่าน' : 'Hide') : (language === 'th' ? 'แสดงรหัสผ่าน' : 'Show')}</span>
                    </button>
                  )}
                </div>
                <div className="text-xs font-mono">
                  {user.caPassword || userApp?.caPassword ? (
                    <span className="font-semibold text-slate-900 dark:text-white bg-white dark:bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 inline-block">
                      {showCaPasswordInDashboard ? (user.caPassword || userApp?.caPassword) : '••••••••••••'}
                    </span>
                  ) : (
                    <span className="text-slate-400 dark:text-slate-500 font-sans">- (ไม่ได้ระบุรหัสผ่านไฟล์ CA)</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Security & Sessions */}
      {activeTab === 'security' && (
        <div className="space-y-6">
          {/* 2FA Toggle Card */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white text-base">
                  {t.twoFactorTitle}
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                  {t.twoFactorDesc}
                </p>
              </div>

              <button
                type="button"
                onClick={handleToggle2FA}
                className={`relative inline-flex h-6 w-12 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                  twoFactor ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-700'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                    twoFactor ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Change Password */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs">
            <h3 className="font-bold text-slate-900 dark:text-white text-base mb-1">
              {t.changePasswordTitle}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-5">
              {language === 'th'
                ? 'รหัสผ่านควรมีความยาวอย่างน้อย 8 ตัวอักษรและไม่ซ้ำกับบริการอื่น'
                : 'Your password should be at least 8 characters and not shared with other sites'}
            </p>

            <form onSubmit={handleChangePassword} className="max-w-md space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  {t.currentPassword}
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    required
                    className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
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
                  {t.newPassword}
                </label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder={t.passwordPlaceholder}
                  required
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  {t.confirmPassword}
                </label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {passwordError && (
                <div className="p-2.5 bg-red-50 dark:bg-red-950/40 rounded-xl border border-red-200 dark:border-red-900 text-xs text-red-600 dark:text-red-400 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{passwordError}</span>
                </div>
              )}

              {passwordSuccess && (
                <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-700 dark:text-emerald-300 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                  <span>{passwordSuccess}</span>
                </div>
              )}

              <button
                type="submit"
                className="px-5 py-2.5 text-xs sm:text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors shadow-xs"
              >
                {t.updatePasswordButton}
              </button>
            </form>
          </div>

          {/* Active Sessions */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-5">
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white text-base">
                  {t.activeSessionsTitle}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {language === 'th' ? 'รายการอุปกรณ์ที่กำลังล็อกอินค้างอยู่ในระบบ' : 'Devices currently signed into this account'}
                </p>
              </div>

              {sessions.length > 1 && (
                <button
                  type="button"
                  onClick={handleRevokeOtherSessions}
                  className="px-3 py-1.5 text-xs font-semibold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/40 hover:bg-red-100 rounded-lg transition-colors border border-red-200 dark:border-red-900"
                >
                  {t.revokeAllSessions}
                </button>
              )}
            </div>

            {sessionsRevokedMsg && (
              <div className="mb-4 p-3 bg-amber-50 dark:bg-amber-950/40 rounded-xl border border-amber-200 dark:border-amber-800 text-xs text-amber-800 dark:text-amber-200 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0" />
                <span>{sessionsRevokedMsg}</span>
              </div>
            )}

            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {sessions.map((sess) => (
                <div key={sess.id} className="py-3.5 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3.5">
                    <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                      {sess.device.includes('iPhone') || sess.device.includes('iPad') ? (
                        <Smartphone className="w-5 h-5" />
                      ) : (
                        <Laptop className="w-5 h-5" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-slate-900 dark:text-white text-xs sm:text-sm">
                          {sess.device}
                        </span>
                        {sess.isCurrent && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300">
                            {t.currentDevice}
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        <span>{sess.browser}</span>
                        <span className="mx-1.5" aria-hidden="true">·</span>
                        <span className="font-mono">{sess.ip}</span>
                        <span className="mx-1.5" aria-hidden="true">·</span>
                        <span>{sess.location}</span>
                      </div>
                    </div>
                  </div>

                  <span className="text-xs text-slate-400 dark:text-slate-500 whitespace-nowrap">
                    {sess.lastActive}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Activity & Audit Logs */}
      {activeTab === 'activity' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs">
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">
                {language === 'th' ? 'บันทึกประวัติความปลอดภัยและการเข้าใช้งาน' : 'Security & Access Logs'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {language === 'th' ? 'ตรวจสอบประวัติกิจกรรมที่เกิดขึ้นกับบัญชีนี้' : 'Review recent authentication activity'}
              </p>
            </div>
            {logs.length > 0 && (
              <button
                type="button"
                onClick={handleClearLogs}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-500 hover:text-red-600 dark:hover:text-red-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>{language === 'th' ? 'ล้างประวัติ' : 'Clear Logs'}</span>
              </button>
            )}
          </div>

          {logs.length === 0 ? (
            <div className="py-12 text-center text-slate-400">
              <Clock className="w-8 h-8 mx-auto mb-2 opacity-40" />
              <p className="text-xs">{language === 'th' ? 'ยังไม่มีประวัติกิจกรรม' : 'No activity logs found'}</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400">
                    <th className="py-2.5 px-3 font-semibold">{language === 'th' ? 'เวลา' : 'Timestamp'}</th>
                    <th className="py-2.5 px-3 font-semibold">{language === 'th' ? 'กิจกรรม' : 'Action'}</th>
                    <th className="py-2.5 px-3 font-semibold">{language === 'th' ? 'อุปกรณ์' : 'Client'}</th>
                    <th className="py-2.5 px-3 font-semibold font-mono text-right">IP Address</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                  {logs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 px-3 text-slate-500 dark:text-slate-400 whitespace-nowrap font-mono tabular-nums">
                        {log.timestamp}
                      </td>
                      <td className="py-3 px-3 font-medium text-slate-900 dark:text-white">
                        <div className="flex items-center gap-2">
                          <span
                            className={`w-2 h-2 rounded-full shrink-0 ${
                              log.status === 'success'
                                ? 'bg-emerald-500'
                                : log.status === 'warning'
                                ? 'bg-amber-500'
                                : 'bg-red-500'
                            }`}
                          />
                          <span>{log.action}</span>
                        </div>
                      </td>
                      <td className="py-3 px-3 text-slate-600 dark:text-slate-300 whitespace-nowrap">
                        {log.device}
                      </td>
                      <td className="py-3 px-3 text-slate-500 dark:text-slate-400 font-mono text-right tabular-nums">
                        {log.ip}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
