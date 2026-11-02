export type DepartmentKey = 'bph' | 'polkam' | 'advo' | 'sosmas' | 'kominfo';

export type HierarchyLevel = 'presiden' | 'wapres' | 'sekab' | 'kementerian';

export type MinistryId =
  | 'keuangan'
  | 'dagri'
  | 'lugri'
  | 'hukum'
  | 'menkraf'
  | 'mendikristek'
  | 'kominfo';

export interface CabinetMember {
  id: string;
  name: string;
  position: string;
  level: HierarchyLevel;
  ministryId?: MinistryId;
  ministryName?: string;
  faculty: string;
  initial: string;
  image?: string;
  bio?: string;
  linkedin?: string;
  instagram?: string;
  email?: string;
  order: number;
  isPlaceholder?: boolean;
  period?: string;
}

export interface MinistryGroup {
  id: MinistryId;
  name: string;
  shortName: string;
  description: string;
  expectedCount: number;
  members: CabinetMember[];
}

// Backward-compatible interface for legacy references
export interface OrganizationMember {
  id: string;
  name: string;
  role: string;
  faculty: string;
  initial: string;
  bio?: string;
  linkedin?: string;
  instagram?: string;
  email?: string;
  isActive: boolean;
  image?: string;
  isPlaceholder?: boolean;
}

export interface DepartmentInfo {
  key: DepartmentKey;
  name: string;
  label: string;
  description: string;
  members: OrganizationMember[];
}

export interface NewsArticle {
  id: string;
  slug: string;
  title: string;
  category: 'Kajian Strategis' | 'Advokasi' | 'Kajian Isu' | 'Event' | 'Sosial Masyarakat';
  readTime: string;
  publishedDate: string;
  excerpt: string;
  content: string[];
  department: string;
  archiveNumber: string;
  coverImage: string;
  isFeatured?: boolean;
  tags: string[];
}

export type DocumentCategory = 'sk' | 'po' | 'lpj' | 'sop';

export interface LegalDocument {
  id: string;
  code: string;
  year: string;
  title: string;
  description: string;
  category: DocumentCategory;
  categoryLabel: string;
  fileSize: string;
  fileFormat: 'PDF' | 'DOCX';
  downloadUrl?: string;
  verifiedStatus: string;
}

export type AspirationCategory =
  | 'Fasilitas & Infrastruktur Kampus'
  | 'Kebijakan UKT & Finansial'
  | 'Layanan Akademik & Dosen'
  | 'Keamanan & Ruang Aman Kampus'
  | 'Kegiatan Kemahasiswaan & Ormawa';

export type AspirationUrgency = 'Normal' | 'Mendesak' | 'Kritis';

export type PipelineStepStatus = 'completed' | 'in-progress' | 'pending';

export interface PipelineStep {
  step: number;
  title: string;
  description: string;
  status: PipelineStepStatus;
  date?: string;
}

export interface AspirationTicket {
  ticketId: string;
  title: string;
  body: string;
  category: AspirationCategory;
  urgency: AspirationUrgency;
  isAnonymous: boolean;
  senderName?: string;
  senderNim?: string;
  status: 'Baru Diterima' | 'Sedang Ditelaah Komisi' | 'Audiensi Pimpinan' | 'Selesai & Diterbitkan';
  createdAt: string;
  pipeline: PipelineStep[];
}

// =============================================================================
// AUTHENTICATION & ROLE-BASED ACCESS CONTROL (RBAC)
// =============================================================================
export type UserRole = 'super_admin' | 'admin' | 'editor';

export interface AuthUser {
  id: string;
  username: string;
  email: string;
  fullName: string;
  role: UserRole;
  avatar?: string;
  lastLogin?: string;
}

export interface LoginCredentials {
  identifier: string;
  password?: string;
}

