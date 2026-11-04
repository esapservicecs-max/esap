export type UserRole = 'member' | 'pro' | 'admin' | 'cs_staff';

export interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  phone: string;
  role: UserRole;
  avatar: string;
  bio?: string;
  createdAt: string;
  lastLoginAt?: string;
  twoFactorEnabled: boolean;
  status: 'active' | 'suspended';

  // Enterprise & NSW linkage
  companyName?: string;
  companyNameTh?: string;
  companyNameEn?: string;
  taxId?: string;
  nswProfile?: string;
  nswCategory?: string;
  applicationId?: string;
  businessType?: string;
  juristicNumber?: string;
  paperlessType?: string;
}

export interface Session {
  id: string;
  device: string;
  browser: string;
  ip: string;
  location: string;
  lastActive: string;
  isCurrent: boolean;
}

export interface ActivityLog {
  id: string;
  timestamp: string;
  action: string;
  device: string;
  ip: string;
  status: 'success' | 'warning' | 'failed';
}

export type ApplicationStatus = 'pending_cs' | 'needs_revision' | 'approved' | 'rejected';

export interface CaDocument {
  id: string;
  name: string;
  type: 'pp20' | 'company_cert' | 'director_id' | 'ca_request' | 'other';
  fileName: string;
  fileSize: string;
  uploadedAt: string;
  fileUrl?: string;
  status: 'valid' | 'invalid' | 'pending';
}

export interface RegistrationApplication {
  id: string;
  // Step 1: ข้อมูลสมัครสมาชิก & NSW
  username: string;
  password?: string;
  email: string;
  phone: string;
  nswCategory: string;
  nswProfile: string;

  // Step 2: ข้อมูลตามแบบฟอร์ม ESAP (Paperless ebXML – Application Form)
  // ส่วน Ref ID Paperless Type
  paperlessType: 'Customs Broker' | 'Service Counter' | 'Exporter/Importer';
  refIdTest: string;
  refIdProduction: string;

  // ข้อมูลผู้ขอใช้บริการ
  companyName: string;
  companyNameTh: string;
  companyNameEn: string;
  businessType: string;
  juristicNumber: string; // ทะเบียนนิติบุคคลเลขที่
  taxId: string; // เลขประจำตัวผู้เสียภาษีอากร
  branchType: 'headquarters' | 'branch';
  branchNumber?: string;

  // สถานที่จัดส่งใบแจ้งค่าใช้บริการ/วางบิล
  billingHouseNo: string;
  billingMoo: string;
  billingBuilding: string;
  billingSoi: string;
  billingRoad: string;
  billingSubDistrict: string;
  billingDistrict: string;
  billingProvince: string;
  billingPostalCode: string;
  billingPhone: string;
  billingFax: string;
  billingEmail: string;

  // สถานที่ติดตั้งระบบ
  installSameAsBilling: boolean;
  installHouseNo?: string;
  installMoo?: string;
  installBuilding?: string;
  installSoi?: string;
  installRoad?: string;
  installSubDistrict?: string;
  installDistrict?: string;
  installProvince?: string;
  installPostalCode?: string;
  installPhone?: string;
  installFax?: string;
  installEmail?: string;

  // ข้อมูลติดต่อ/ผู้ประสานงาน
  contactPrefix: 'นาย' | 'นาง' | 'นางสาว' | string;
  contactFirstName: string;
  contactLastName: string;
  contactPosition: string;
  contactPhone: string;
  contactMobile: string;
  contactEmail: string;

  // Compatibility fields
  registeredAddress?: string;
  billingAddressSameAsPp20?: boolean;
  billingAddress?: string;
  eTaxEmail?: string;
  billingContactName?: string;
  billingContactPhone?: string;

  // Step 3: เอกสารสำหรับ CA
  documents: CaDocument[];

  // Step 4: ประมวลผลและ CS Review
  status: ApplicationStatus;
  submittedAt: string;
  updatedAt: string;
  csNotes?: string;
  revisionRequiredFields?: string[];
  csReviewerName?: string;
}

export type AuthMode = 'login' | 'register' | 'forgot' | 'track_app' | 'cs_review';
export type Language = 'th' | 'en';
