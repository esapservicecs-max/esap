import { User, Session, ActivityLog, RegistrationApplication, CaDocument } from '../types/auth';

export const ASSETS = {
  showcase: '/src/assets/images/auth_brand_showcase_1793780212572.jpg',
  avatarFemale: '/src/assets/images/member_avatar_female_1793780212520.jpg',
  avatarMale: '/src/assets/images/member_avatar_male_1793780213414.jpg',
};

const INITIAL_USERS: User[] = [
  {
    id: 'usr_001',
    name: 'พิมพ์ชนก ศรีสุข',
    username: 'pimchanok',
    email: 'pim@example.com',
    phone: '089-123-4567',
    role: 'pro',
    avatar: ASSETS.avatarFemale,
    bio: 'Product Designer & UX Researcher based in Bangkok, Thailand.',
    createdAt: '2024-01-15T09:30:00Z',
    lastLoginAt: new Date().toISOString(),
    twoFactorEnabled: true,
    status: 'active',
    companyName: 'บริษัท สยาม โลจิสติกส์ โซลูชั่นส์ จำกัด',
    taxId: '0105556012345',
    nswProfile: 'NSW-TH-2024-88912',
    nswCategory: 'NSW Gateway (ระบบเชื่อมโยงข้อมูลศุลกากร)',
  },
  {
    id: 'usr_002',
    name: 'กิตติศักดิ์ วงศ์สวัสดิ์',
    username: 'admin',
    email: 'admin@example.com',
    phone: '081-987-6543',
    role: 'admin',
    avatar: ASSETS.avatarMale,
    bio: 'System Architect & Security Administrator.',
    createdAt: '2023-11-01T08:00:00Z',
    lastLoginAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    twoFactorEnabled: true,
    status: 'active',
    companyName: 'บริษัท ไทยดิจิทัล เกตเวย์ คอนเน็คท์ จำกัด',
    taxId: '0105559098765',
    nswProfile: 'NSW-ADMIN-ROOT',
    nswCategory: 'ผู้ให้บริการระบบ (Service Provider)',
  },
  {
    id: 'usr_003',
    name: 'สมชาย ใจดี',
    username: 'somchai',
    email: 'somchai@example.com',
    phone: '086-555-0199',
    role: 'member',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Somchai',
    bio: 'ผู้จัดการฝ่ายจัดส่งสินค้าและพิธีการศุลกากร',
    createdAt: '2024-03-10T14:20:00Z',
    lastLoginAt: new Date(Date.now() - 86400000).toISOString(),
    twoFactorEnabled: false,
    status: 'active',
    companyName: 'บริษัท ใจดี โกลบอล เทรดดิ้ง จำกัด',
    taxId: '0105561044321',
    nswProfile: 'NSW-TH-2024-11029',
    nswCategory: 'นำเข้า-ส่งออกทั่วไป (Import/Export)',
  },
];

const INITIAL_PASSWORDS: Record<string, string> = {
  'pim@example.com': 'Password123!',
  'admin@example.com': 'Admin123!',
  'somchai@example.com': 'Password123!',
};

const INITIAL_APPLICATIONS: RegistrationApplication[] = [
  {
    id: 'APP-2024-001',
    username: 'siam_inter_trade',
    password: 'Password123!',
    email: 'contact@siamintertrade.co.th',
    phone: '02-888-9999',
    nswCategory: 'นำเข้า-ส่งออกทั่วไป (Import / Export)',
    nswProfile: 'NSW-TH-2024-99881',
    paperlessType: 'Exporter/Importer',
    refIdTest: 'TEST-EXP-00192',
    refIdProduction: 'PROD-EXP-00192',
    companyName: 'บริษัท สยาม อินเตอร์ เทรดดิ้ง จำกัด',
    companyNameTh: 'บริษัท สยาม อินเตอร์ เทรดดิ้ง จำกัด',
    companyNameEn: 'Siam Inter Trading Co., Ltd.',
    businessType: 'ธุรกิจนำเข้าและส่งออกสินค้าอุปโภคบริโภค',
    juristicNumber: '0105558012399',
    taxId: '0105558012399',
    branchType: 'headquarters',
    branchNumber: '00000',
    billingHouseNo: '88/12',
    billingMoo: '-',
    billingBuilding: 'อาคารสยามทาวเวอร์ ชั้น 18',
    billingSoi: '-',
    billingRoad: 'ถนนพระราม 9',
    billingSubDistrict: 'ห้วยขวาง',
    billingDistrict: 'ห้วยขวาง',
    billingProvince: 'กรุงเทพมหานคร',
    billingPostalCode: '10310',
    billingPhone: '02-888-9999',
    billingFax: '02-888-9998',
    billingEmail: 'billing@siamintertrade.co.th',
    installSameAsBilling: true,
    contactPrefix: 'นางสาว',
    contactFirstName: 'วราภรณ์',
    contactLastName: 'มั่นคง',
    contactPosition: 'ผู้จัดการฝ่ายจัดซื้อและพิธีการศุลกากร',
    contactPhone: '02-888-9999',
    contactMobile: '081-444-5555',
    contactEmail: 'waraporn@siamintertrade.co.th',
    registeredAddress: 'เลขที่ 88/12 อาคารสยามทาวเวอร์ ชั้น 18 ถนนพระราม 9 แขวงห้วยขวาง เขตห้วยขวาง กรุงเทพมหานคร 10310',
    status: 'pending_cs',
    submittedAt: '2024-03-24T10:30:00Z',
    updatedAt: '2024-03-24T10:30:00Z',
    csNotes: 'เจ้าหน้าที่ CS กำลังตรวจสอบเอกสาร ภ.พ.20 และคำขอ Certificate Authority (CA)',
    documents: [
      {
        id: 'doc_1',
        name: 'สำเนา ภ.พ.20 (ภพ.20)',
        type: 'pp20',
        fileName: 'PP20_SiamInterTrade.pdf',
        fileSize: '1.4 MB',
        uploadedAt: '2024-03-24 10:28',
        status: 'pending',
      },
      {
        id: 'doc_2',
        name: 'หนังสือรับรองนิติบุคคล (DBD)',
        type: 'company_cert',
        fileName: 'DBD_Certificate_2024.pdf',
        fileSize: '3.1 MB',
        uploadedAt: '2024-03-24 10:29',
        status: 'pending',
      },
      {
        id: 'doc_3',
        name: 'สำเนาบัตรประชาชนกรรมการผู้มีอำนาจ',
        type: 'director_id',
        fileName: 'Director_ID_Card.jpg',
        fileSize: '890 KB',
        uploadedAt: '2024-03-24 10:29',
        status: 'pending',
      },
      {
        id: 'doc_4',
        name: 'เอกสารคำขอใบรับรองอิเล็กทรอนิกส์ (CA Request Form)',
        type: 'ca_request',
        fileName: 'CA_Digital_Signature_Form.pdf',
        fileSize: '2.0 MB',
        uploadedAt: '2024-03-24 10:30',
        status: 'pending',
      },
    ],
  },
  {
    id: 'APP-2024-002',
    username: 'thai_express_cargo',
    password: 'Password123!',
    email: 'cs@thaiexpresscargo.com',
    phone: '089-777-1122',
    nswCategory: 'ผู้ประกอบการขนส่งและชิปปิ้ง (Freight & Broker)',
    nswProfile: 'NSW-TH-2024-77312',
    paperlessType: 'Customs Broker',
    refIdTest: 'TEST-CB-8801',
    refIdProduction: 'PROD-CB-8801',
    companyName: 'บริษัท ไทย เอ็กซ์เพรส คาร์โก้ จำกัด',
    companyNameTh: 'บริษัท ไทย เอ็กซ์เพรส คาร์โก้ จำกัด',
    companyNameEn: 'Thai Express Cargo Co., Ltd.',
    businessType: 'บริการตัวแทนออกของและขนส่งสินค้าระหว่างประเทศ',
    juristicNumber: '0105554033211',
    taxId: '0105554033211',
    branchType: 'branch',
    branchNumber: '00001',
    billingHouseNo: '159',
    billingMoo: '4',
    billingBuilding: 'อาคารคาร์โก้เซ็นเตอร์',
    billingSoi: 'บางนา-ตราด 23',
    billingRoad: 'ถนนบางนา-ตราด',
    billingSubDistrict: 'บางนาเหนือ',
    billingDistrict: 'บางนา',
    billingProvince: 'กรุงเทพมหานคร',
    billingPostalCode: '10260',
    billingPhone: '02-744-1234',
    billingFax: '02-744-1235',
    billingEmail: 'accounting@thaiexpresscargo.com',
    installSameAsBilling: false,
    installHouseNo: '99/1',
    installMoo: '1',
    installBuilding: 'คลังสินค้าสุวรรณภูมิ',
    installSoi: '-',
    installRoad: 'ถนนกิ่งแก้ว',
    installSubDistrict: 'ราชาเทวะ',
    installDistrict: 'บางพลี',
    installProvince: 'สมุทรปราการ',
    installPostalCode: '10540',
    installPhone: '02-134-8888',
    installFax: '-',
    installEmail: 'ops@thaiexpresscargo.com',
    contactPrefix: 'นาย',
    contactFirstName: 'อนันต์',
    contactLastName: 'ภักดี',
    contactPosition: 'ผู้จัดการแผนกปฏิบัติการ',
    contactPhone: '02-744-1234',
    contactMobile: '089-777-1122',
    contactEmail: 'anan@thaiexpresscargo.com',
    registeredAddress: '159 ซอยบางนา-ตราด 23 แขวงบางนาเหนือ เขตบางนา กรุงเทพมหานคร 10260',
    status: 'needs_revision',
    submittedAt: '2024-03-22T14:15:00Z',
    updatedAt: '2024-03-23T09:00:00Z',
    csNotes: 'พบข้อผิดพลาด: หนังสือรับรองบริษัทหมดอายุเกิน 6 เดือน กรุณาอัปโหลดเอกสารฉบับปัจจุบันที่คัดสำเนาไม่เกิน 6 เดือนเพื่อดำเนินการต่อ',
    revisionRequiredFields: ['company_cert'],
    csReviewerName: 'เจ้าหน้าที่ CS: ชนนิกานต์ (CS-04)',
    documents: [
      {
        id: 'doc_201',
        name: 'สำเนา ภ.พ.20 (ภพ.20)',
        type: 'pp20',
        fileName: 'PP20_Cargo.pdf',
        fileSize: '1.2 MB',
        uploadedAt: '2024-03-22 14:10',
        status: 'valid',
      },
      {
        id: 'doc_202',
        name: 'หนังสือรับรองนิติบุคคล (DBD)',
        type: 'company_cert',
        fileName: 'DBD_Outdated_2023.pdf',
        fileSize: '2.8 MB',
        uploadedAt: '2024-03-22 14:11',
        status: 'invalid',
      },
      {
        id: 'doc_203',
        name: 'สำเนาบัตรประชาชนกรรมการผู้มีอำนาจ',
        type: 'director_id',
        fileName: 'Director_Passport.pdf',
        fileSize: '1.1 MB',
        uploadedAt: '2024-03-22 14:12',
        status: 'valid',
      },
      {
        id: 'doc_204',
        name: 'เอกสารคำขอใช้งาน CA',
        type: 'ca_request',
        fileName: 'CA_Application.pdf',
        fileSize: '1.9 MB',
        uploadedAt: '2024-03-22 14:13',
        status: 'valid',
      },
    ],
  },
];

const INITIAL_SESSIONS: Session[] = [
  {
    id: 'sess_1',
    device: 'MacBook Pro 16"',
    browser: 'Chrome 122.0 / macOS Sonoma',
    ip: '171.96.120.45',
    location: 'กรุงเทพมหานคร, ประเทศไทย',
    lastActive: 'กำลังใช้งาน',
    isCurrent: true,
  },
  {
    id: 'sess_2',
    device: 'iPhone 15 Pro Max',
    browser: 'Mobile Safari / iOS 17.4',
    ip: '182.232.74.19',
    location: 'เชียงใหม่, ประเทศไทย',
    lastActive: '2 ชั่วโมงที่แล้ว',
    isCurrent: false,
  },
];

const STORAGE_KEYS = {
  USERS: 'siam_auth_users_v2',
  PASSWORDS: 'siam_auth_passwords_v2',
  CURRENT_USER: 'siam_auth_current_user_v2',
  SESSIONS: 'siam_auth_sessions_v2',
  LOGS: 'siam_auth_activity_logs_v2',
  APPLICATIONS: 'siam_auth_applications_v2',
  THEME: 'siam_auth_theme_v2',
  LANG: 'siam_auth_lang_v2',
};

export function getStoredUsers(): User[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.USERS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(INITIAL_USERS));
      return INITIAL_USERS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_USERS;
  }
}

export function saveUsers(users: User[]) {
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
}

export function getStoredPasswords(): Record<string, string> {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PASSWORDS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.PASSWORDS, JSON.stringify(INITIAL_PASSWORDS));
      return INITIAL_PASSWORDS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_PASSWORDS;
  }
}

export function savePassword(email: string, passwordHash: string) {
  const current = getStoredPasswords();
  current[email.toLowerCase()] = passwordHash;
  localStorage.setItem(STORAGE_KEYS.PASSWORDS, JSON.stringify(current));
}

export function getCurrentUser(): User | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setCurrentUser(user: User | null) {
  if (user) {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
  } else {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  }
}

export function getStoredApplications(): RegistrationApplication[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.APPLICATIONS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(INITIAL_APPLICATIONS));
      return INITIAL_APPLICATIONS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_APPLICATIONS;
  }
}

export function saveApplications(apps: RegistrationApplication[]) {
  localStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(apps));
}

export function saveOrUpdateApplication(app: RegistrationApplication) {
  const current = getStoredApplications();
  const index = current.findIndex((a) => a.id === app.id);
  let updated: RegistrationApplication[];
  if (index >= 0) {
    updated = [...current];
    updated[index] = app;
  } else {
    updated = [app, ...current];
  }
  saveApplications(updated);
  return updated;
}

export function getApplicationById(id: string): RegistrationApplication | undefined {
  const apps = getStoredApplications();
  return apps.find((a) => a.id.toLowerCase() === id.trim().toLowerCase());
}

export function searchApplications(query: string): RegistrationApplication[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const apps = getStoredApplications();
  return apps.filter(
    (a) =>
      a.id.toLowerCase().includes(q) ||
      a.taxId.includes(q) ||
      a.email.toLowerCase().includes(q) ||
      a.companyName.toLowerCase().includes(q) ||
      a.username.toLowerCase().includes(q)
  );
}

export function updateApplicationByCs(
  appId: string,
  newStatus: 'approved' | 'needs_revision' | 'rejected' | 'pending_cs',
  notes: string,
  reviewerName: string = 'เจ้าหน้าที่ CS (Customer Service)'
): RegistrationApplication | null {
  const apps = getStoredApplications();
  const target = apps.find((a) => a.id === appId);
  if (!target) return null;

  const updated: RegistrationApplication = {
    ...target,
    status: newStatus,
    csNotes: notes,
    csReviewerName: reviewerName,
    updatedAt: new Date().toISOString(),
  };

  // If approved, create or activate the user in system!
  if (newStatus === 'approved') {
    const users = getStoredUsers();
    const existing = users.find((u) => u.email.toLowerCase() === target.email.toLowerCase());
    if (!existing) {
      const newUser: User = {
        id: `usr_${Date.now()}`,
        name: target.companyName,
        username: target.username,
        email: target.email,
        phone: target.phone,
        role: 'member',
        avatar: ASSETS.avatarMale,
        bio: `ผู้ประกอบการ ${target.nswCategory} - NSW Profile: ${target.nswProfile}`,
        createdAt: target.submittedAt,
        lastLoginAt: new Date().toISOString(),
        twoFactorEnabled: false,
        status: 'active',
        companyName: target.companyName,
        taxId: target.taxId,
        nswProfile: target.nswProfile,
        nswCategory: target.nswCategory,
        applicationId: target.id,
      };
      saveUsers([newUser, ...users]);
      savePassword(target.email, target.password || 'Password123!');
    }
  }

  saveOrUpdateApplication(updated);
  return updated;
}

export function getSessions(): Session[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SESSIONS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(INITIAL_SESSIONS));
      return INITIAL_SESSIONS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_SESSIONS;
  }
}

export function saveSessions(sessions: Session[]) {
  localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(sessions));
}

export function getActivityLogs(): ActivityLog[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.LOGS);
    if (!raw) {
      const initialLogs: ActivityLog[] = [
        {
          id: 'log_1',
          timestamp: new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }),
          action: 'ระบบเปิดรับใบสมัครสมาชิกผ่าน NSW และ CA',
          device: 'System Gateway',
          ip: '171.96.120.45',
          status: 'success',
        },
      ];
      localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(initialLogs));
      return initialLogs;
    }
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function addActivityLog(action: string, status: 'success' | 'warning' | 'failed' = 'success') {
  const current = getActivityLogs();
  const newLog: ActivityLog = {
    id: `log_${Date.now()}`,
    timestamp: new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }),
    action,
    device: 'Client Web Browser',
    ip: '171.96.120.45',
    status,
  };
  const updated = [newLog, ...current].slice(0, 20);
  localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(updated));
  return updated;
}

export function checkPasswordStrength(password: string): {
  score: number;
  labelTh: string;
  labelEn: string;
  hasLength: boolean;
  hasLetter: boolean;
  hasNumber: boolean;
  hasSpecial: boolean;
} {
  const hasLength = password.length >= 8;
  const hasLetter = /[a-zA-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[^a-zA-Z0-9]/.test(password);

  let score = 0;
  if (hasLength) score++;
  if (hasLetter) score++;
  if (hasNumber) score++;
  if (hasSpecial) score++;

  let labelTh = 'เปราะบาง';
  let labelEn = 'Weak';
  if (score === 2) {
    labelTh = 'พอใช้';
    labelEn = 'Fair';
  } else if (score === 3) {
    labelTh = 'ปลอดภัย';
    labelEn = 'Good';
  } else if (score === 4) {
    labelTh = 'ปลอดภัยสูงมาก';
    labelEn = 'Strong';
  }

  return {
    score,
    labelTh,
    labelEn,
    hasLength,
    hasLetter,
    hasNumber,
    hasSpecial,
  };
}
