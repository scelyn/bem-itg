import { CabinetMember, MinistryGroup, OrganizationMember, DepartmentInfo } from '../types';

/**
 * BEM ITG KOLEKTIVA — OFFICIAL CABINET ROSTER (2026/2027)
 * Centralized Single Source of Truth
 * Total Official Positions: Exactly 29 Members
 * Hierarchy:
 * - Level 1: Presiden BEM (1)
 * - Level 2: Wakil Presiden BEM (1)
 * - Level 3: Sekretaris Kabinet (2)
 * - Level 4: 7 Kementerian:
 *    A. Kementerian Keuangan (2)
 *    B. Kementerian Dalam Negeri (4)
 *    C. Kementerian Luar Negeri (4)
 *    D. Kementerian Hukum (4)
 *    E. Kementerian MenKraf (3)
 *    F. Kementerian Mendikristek (4)
 *    G. Kementerian Kominfo (4)
 * Total: 1 + 1 + 2 + 2 + 4 + 4 + 4 + 3 + 4 + 4 = 29 members
 */

export const cabinetMembers: CabinetMember[] = [
  // ===========================================================================
  // LEVEL 1 — PRESIDEN BEM (1 Member)
  // ===========================================================================
  {
    id: 'presiden-bem',
    name: 'Ikbal Suryanto',
    position: 'Presiden BEM',
    level: 'presiden',
    ministryName: 'Presidium Eksekutif',
    faculty: "Fakultas Teknik dan Perencanaan",
    initial: 'IS',
    image: '/images/organization/presiden-bem.jpg',
    linkedin: 'https://linkedin.com',
    instagram: 'https://instagram.com',
    email: 'rayhan.ardiansyah@bem.itg.ac.id',
    order: 1,
    isPlaceholder: false,
    period: '2026/2027',
  },

  // ===========================================================================
  // LEVEL 2 — WAKIL PRESIDEN BEM (1 Member)
  // ===========================================================================
  {
    id: 'wapres-bem',
    name: 'Rindam Susilo',
    position: 'Wakil Presiden BEM',
    level: 'wapres',
    ministryName: 'Presidium Eksekutif',
    faculty: "Fakultas Ilmu Komputer",
    initial: 'RS',
    image: '/images/organization/wapres-bem.jpg',
    linkedin: 'https://linkedin.com',
    instagram: 'https://instagram.com',
    email: 'nabila.larasati@bem.itg.ac.id',
    order: 2,
    isPlaceholder: false,
    period: '2026/2027',
  },

  // ===========================================================================
  // LEVEL 3 — SEKRETARIS KABINET (2 Members)
  // ===========================================================================
  {
    id: 'sekab-1',
    name: 'Dzaki Rahman Fauzi',
    position: 'Sekretaris Kabinet I',
    level: 'sekab',
    ministryName: 'Sekretariat Kabinet',
    faculty: "Fakultas Teknik dan Perencanaan",
    initial: 'DRF',
    image: '/images/organization/sekab-1.jpg',
    instagram: 'https://instagram.com',
    email: 'sekab.1@bem.itg.ac.id',
    order: 3,
    isPlaceholder: false,
    period: '2026/2027',
  },
  {
    id: 'sekab-2',
    name: 'Siti Nuraisah',
    position: 'Sekretaris Kabinet II',
    level: 'sekab',
    ministryName: 'Sekretariat Kabinet',
    faculty: 'Fakultas Teknik dan Perencanaan',
    initial: 'SNA',
    image: '/images/organization/sekab-2.jpg',
    linkedin: 'https://linkedin.com',
    instagram: 'https://instagram.com',
    email: 'rayhan.ardiansyah@bem.itg.ac.id',
    order: 4,
    isPlaceholder: true,
    period: '2026/2027',
  },

  // ===========================================================================
  // LEVEL 4 — KEMENTERIAN KEUANGAN (2 Members)
  // ===========================================================================
  {
    id: 'keuangan-1',
    name: 'Sipa Silpiani',
    position: 'Menteri Keuangan',
    level: 'kementerian',
    ministryId: 'keuangan',
    ministryName: 'Kementerian Keuangan',
    faculty: "Fakultas Ilmu Komputer",
    initial: 'SS',
    image: '/images/organization/keuangan-menteri.jpg',
    linkedin: 'https://linkedin.com',
    instagram: 'https://instagram.com',
    email: 'rayhan.ardiansyah@bem.itg.ac.id',
    order: 5,
    isPlaceholder: false,
    period: '2026/2027',
  },
  {
    id: 'keuangan-2',
    name: 'Sinta Nuraini',
    position: 'Staf Ahli Perbendaharaan & Audit Kas',
    level: 'kementerian',
    ministryId: 'keuangan',
    ministryName: 'Kementerian Keuangan',
    faculty: 'Fakultas Ilmu Komputer',
    initial: 'SN',
    image: '/images/organization/keuangan-staf-1.jpg',
    linkedin: 'https://linkedin.com',
    instagram: 'https://instagram.com',
    email: 'rayhan.ardiansyah@bem.itg.ac.id',
    order: 6,
    isPlaceholder: true,
    period: '2026/2027',
  },

  // ===========================================================================
  // LEVEL 4 — KEMENTERIAN DALAM NEGERI (4 Members)
  // ===========================================================================
  {
    id: 'dagri-1',
    name: 'Izul Muhammad Akbar',
    position: 'Menteri Dalam Negeri',
    level: 'kementerian',
    ministryId: 'dagri',
    ministryName: 'Kementerian Dalam Negeri',
    faculty: 'Fakultas Teknik dan Perencanaan',
    initial: 'IMA',
    image: '/images/organization/dagri-menteri.jpg',
    linkedin: 'https://linkedin.com',
    instagram: 'https://instagram.com',
    email: 'rayhan.ardiansyah@bem.itg.ac.id',
    order: 7,
    isPlaceholder: true,
    period: '2026/2027',
  },
  {
    id: 'dagri-2',
    name: 'Rafi Alghipari',
    position: 'Dirjen Harmonisasi Ormawa Kampus',
    level: 'kementerian',
    ministryId: 'dagri',
    ministryName: 'Kementerian Dalam Negeri',
    faculty: 'Fakultas Teknik dan Perencanaan',
    initial: 'RA',
    image: '/images/organization/dagri-staf-1.jpg',
    linkedin: 'https://linkedin.com',
    instagram: 'https://instagram.com',
    email: 'rayhan.ardiansyah@bem.itg.ac.id',
    order: 8,
    isPlaceholder: true,
    period: '2026/2027',
  },
  {
    id: 'dagri-3',
    name: 'M Nizar Ramadhan',
    position: 'Biro Aspirasi & Hubungan Sivitas',
    level: 'kementerian',
    ministryId: 'dagri',
    ministryName: 'Kementerian Dalam Negeri',
    faculty: 'Fakultas Teknik dan Perencanaan',
    initial: 'MNR',
    image: '/images/organization/dagri-staf-2.jpg',
    linkedin: 'https://linkedin.com',
    instagram: 'https://instagram.com',
    email: 'rayhan.ardiansyah@bem.itg.ac.id',
    order: 9,
    isPlaceholder: true,
    period: '2026/2027',
  },
  {
    id: 'dagri-4',
    name: 'Mochamad Inda Hijazi',
    position: 'Staf Tata Kelola Internal & Pembinaan',
    level: 'kementerian',
    ministryId: 'dagri',
    ministryName: 'Kementerian Dalam Negeri',
    faculty: 'Fakultas Teknik dan Perencanaan',
    initial: 'MIH',
    image: '/images/organization/dagri-staf-3.jpg',
    linkedin: 'https://linkedin.com',
    instagram: 'https://instagram.com',
    email: 'rayhan.ardiansyah@bem.itg.ac.id',
    order: 10,
    isPlaceholder: true,
    period: '2026/2027',
  },
  {
    id: 'dagri-5',
    name: 'Refaldi',
    position: 'Staf Tata Kelola Internal & Pembinaan',
    level: 'kementerian',
    ministryId: 'dagri',
    ministryName: 'Kementerian Dalam Negeri',
    faculty: 'Fakultas Ilmu Komputer',
    initial: 'RF',
    image: '/images/organization/dagri-staf-3.jpg',
    linkedin: 'https://linkedin.com',
    instagram: 'https://instagram.com',
    email: 'rayhan.ardiansyah@bem.itg.ac.id',
    order: 11,
    isPlaceholder: true,
    period: '2026/2027',
  },

  // ===========================================================================
  // LEVEL 4 — KEMENTERIAN LUAR NEGERI (4 Members)
  // ===========================================================================
  {
    id: 'lugri-1',
    name: 'Luthfi Pandu A.M',
    position: 'Menteri Luar Negeri',
    level: 'kementerian',
    ministryId: 'lugri',
    ministryName: 'Kementerian Luar Negeri',
    faculty: 'Fakultas Teknik dan Perencanaan',
    initial: 'LPAM',
    image: '/images/organization/lugri-menteri.jpg',
    linkedin: 'https://linkedin.com',
    instagram: 'https://instagram.com',
    email: 'rayhan.ardiansyah@bem.itg.ac.id',
    order: 12,
    isPlaceholder: true,
    period: '2026/2027',
  },
  {
    id: 'lugri-2',
    name: 'Riandika ',
    position: 'Dirjen Diplomasi & Aliansi Antar-Kampus',
    level: 'kementerian',
    ministryId: 'lugri',
    ministryName: 'Kementerian Luar Negeri',
    faculty: 'Fakultas Teknik dan Perencanaan',
    initial: 'RND',
    image: '/images/organization/lugri-staf-1.jpg',
    linkedin: 'https://linkedin.com',
    instagram: 'https://instagram.com',
    email: 'rayhan.ardiansyah@bem.itg.ac.id',
    order: 13,
    isPlaceholder: true,
    period: '2026/2027',
  },
  {
    id: 'lugri-3',
    name: 'Fahmi Maulana ',
    position: 'Biro Hubungan Komunitas & Alumni',
    level: 'kementerian',
    ministryId: 'lugri',
    ministryName: 'Kementerian Luar Negeri',
    faculty: 'Fakultas Teknik dan Perencanaan',
    initial: 'FML',
    image: '/images/organization/lugri-staf-2.jpg',
    linkedin: 'https://linkedin.com',
    instagram: 'https://instagram.com',
    email: 'rayhan.ardiansyah@bem.itg.ac.id',
    order: 14,
    isPlaceholder: true,
    period: '2026/2027',
  },
  {
    id: 'lugri-4',
    name: 'Rani Nurcahyani',
    position: 'Staf Jejaring Internasional & Pertukaran',
    level: 'kementerian',
    ministryId: 'lugri',
    ministryName: 'Kementerian Luar Negeri',
    faculty: 'Fakultas Ilmu Komputer',
    initial: 'RNC',
    image: '/images/organization/lugri-staf-3.jpg',
    linkedin: 'https://linkedin.com',
    instagram: 'https://instagram.com',
    email: 'rayhan.ardiansyah@bem.itg.ac.id',
    order: 15,
    isPlaceholder: true,
    period: '2026/2027',
  },

  // ===========================================================================
  // LEVEL 4 — KEMENTERIAN HUKUM (4 Members)
  // ===========================================================================
  {
    id: 'hukum-1',
    name: 'Rendi Ramdani',
    position: 'Menteri Hukum & Kebijakan',
    level: 'kementerian',
    ministryId: 'hukum',
    ministryName: 'Kementerian Hukum',
    faculty: "Fakultas Teknik dan Perencanaan",
    initial: 'RR',
    image: '/images/organization/hukum-menteri.jpg',
    linkedin: 'https://linkedin.com',
    instagram: 'https://instagram.com',
    email: 'rayhan.ardiansyah@bem.itg.ac.id',
    order: 16,
    isPlaceholder: false,
    period: '2026/2027',
  },
  {
    id: 'hukum-2',
    name: 'Rafly Fathan',
    position: 'Dirjen Advokasi Hukum & Ruang Aman',
    level: 'kementerian',
    ministryId: 'hukum',
    ministryName: 'Kementerian Hukum',
    faculty: 'Fakultas Teknik dan Perencanaan',
    initial: 'RF',
    image: '/images/organization/hukum-staf-1.jpg',
    linkedin: 'https://linkedin.com',
    instagram: 'https://instagram.com',
    email: 'rayhan.ardiansyah@bem.itg.ac.id',
    order: 17,
    isPlaceholder: true,
    period: '2026/2027',
  },
  {
    id: 'hukum-3',
    name: 'Diana Sri Wahyuni',
    position: 'Biro Legislasi & Harmonisasi Aturan Kampus',
    level: 'kementerian',
    ministryId: 'hukum',
    ministryName: 'Kementerian Hukum',
    faculty: 'Fakultas Teknik dan Perencanaan',
    initial: 'DSW',
    image: '/images/organization/hukum-staf-2.jpg',
    linkedin: 'https://linkedin.com',
    instagram: 'https://instagram.com',
    email: 'rayhan.ardiansyah@bem.itg.ac.id',
    order: 18,
    isPlaceholder: true,
    period: '2026/2027',
  },


  // ===========================================================================
  // LEVEL 4 — KEMENTERIAN MENKRAF (3 Members)
  // ===========================================================================
  {
    id: 'menkraf-1',
    name: 'Ahmad Ihsan Hariri',
    position: 'Menteri MenKraf (Ekonomi Kreatif)',
    level: 'kementerian',
    ministryId: 'menkraf',
    ministryName: 'Kementerian MenKraf',
    faculty: 'Fakultas Teknik dan Perencanaan',
    initial: 'AIH',
    image: '/images/organization/menkraf-menteri.jpg',
    linkedin: 'https://linkedin.com',
    instagram: 'https://instagram.com',
    email: 'rayhan.ardiansyah@bem.itg.ac.id',
    order: 19,
    isPlaceholder: true,
    period: '2026/2027',
  },
  {
    id: 'menkraf-2',
    name: 'Muhamad Ilyas ',
    position: 'Dirjen Inkubasi Bisnis & Kewirausahaan',
    level: 'kementerian',
    ministryId: 'menkraf',
    ministryName: 'Kementerian MenKraf',
    faculty: 'Fakultas Teknik dan Perencanaan',
    initial: 'MI',
    image: '/images/organization/menkraf-staf-1.jpg',
    linkedin: 'https://linkedin.com',
    instagram: 'https://instagram.com',
    email: 'rayhan.ardiansyah@bem.itg.ac.id',
    order: 20,
    isPlaceholder: true,
    period: '2026/2027',
  },

  // ===========================================================================
  // LEVEL 4 — KEMENTERIAN MENDIKRISTEK (4 Members)
  // ===========================================================================
  {
    id: 'mendikristek-1',
    name: 'Najwa Sofwatul Ilmi',
    position: 'Menteri Mendikristek',
    level: 'kementerian',
    ministryId: 'mendikristek',
    ministryName: 'Kementerian Mendikristek',
    faculty: 'Fakultas Ilmu Komputer',
    initial: 'NSI',
    image: '/images/organization/mendikristek-menteri.jpg',
    linkedin: 'https://linkedin.com',
    instagram: 'https://instagram.com',
    email: 'rayhan.ardiansyah@bem.itg.ac.id',
    order: 22,
    isPlaceholder: true,
    period: '2026/2027',
  },
  {
    id: 'mendikristek-2',
    name: '⁠Suci Aulia Agniani',
    position: 'Dirjen Riset Ilmiah & Inovasi Teknologi',
    level: 'kementerian',
    ministryId: 'mendikristek',
    ministryName: 'Kementerian Mendikristek',
    faculty: 'Fakultas Ilmu Komputer',
    initial: 'PR',
    image: '/images/organization/mendikristek-staf-1.jpg',
    linkedin: 'https://linkedin.com',
    instagram: 'https://instagram.com',
    email: 'rayhan.ardiansyah@bem.itg.ac.id',
    order: 23,
    isPlaceholder: true,
    period: '2026/2027',
  },
  {
    id: 'mendikristek-3',
    name: 'Demila Aulia Futri ',
    position: 'Biro Beasiswa & Fasilitasi Akademik',
    level: 'kementerian',
    ministryId: 'mendikristek',
    ministryName: 'Kementerian Mendikristek',
    faculty: 'Fakultas Ilmu Komputer',
    initial: 'DAF',
    image: '/images/organization/mendikristek-staf-2.jpg',
    linkedin: 'https://linkedin.com',
    instagram: 'https://instagram.com',
    email: 'rayhan.ardiansyah@bem.itg.ac.id',
    order: 24,
    isPlaceholder: true,
    period: '2026/2027',
  },
  {
    id: 'mendikristek-4',
    name: '⁠Ripky Nursahbani',
    position: 'Staf Pengkajian Kurikulum & Kebebasan Akademik',
    level: 'kementerian',
    ministryId: 'mendikristek',
    ministryName: 'Kementerian Mendikristek',
    faculty: 'Fakultas Teknik dan Perencanaan',
    initial: 'PR',
    image: '/images/organization/mendikristek-staf-3.jpg',
    linkedin: 'https://linkedin.com',
    instagram: 'https://instagram.com',
    email: 'rayhan.ardiansyah@bem.itg.ac.id',
    order: 25,
    isPlaceholder: true,
    period: '2026/2027',
  },

  // ===========================================================================
  // LEVEL 4 — KEMENTERIAN KOMINFO (4 Members)
  // ===========================================================================
  {
    id: 'kominfo-1',
    name: '⁠Rangga Saputra ',
    position: 'Menteri Kominfo',
    level: 'kementerian',
    ministryId: 'kominfo',
    ministryName: 'Kementerian Kominfo',
    faculty: "Fakultas Teknik dan Perencanaan",
    initial: 'RS',
    image: '/images/organization/kominfo-menteri.jpg',
    linkedin: 'https://linkedin.com',
    instagram: 'https://instagram.com',
    email: 'rayhan.ardiansyah@bem.itg.ac.id',
    order: 26,
    isPlaceholder: false,
    period: '2026/2027',
  },
  {
    id: 'kominfo-2',
    name: 'Moch Fazriel G.P',
    position: 'Dirjen Kreatif & Desain Visual',
    level: 'kementerian',
    ministryId: 'kominfo',
    ministryName: 'Kementerian Kominfo',
    faculty: "Fakultas Teknik dan Perencanaan",
    initial: 'MFG',
    image: '/images/organization/kominfo-staf-1.jpg',
    linkedin: 'https://linkedin.com',
    instagram: 'https://instagram.com',
    email: 'rayhan.ardiansyah@bem.itg.ac.id',
    order: 27,
    isPlaceholder: false,
    period: '2026/2027',
  },
  {
    id: 'kominfo-3',
    name: 'Andhika Eka Pratama',
    position: 'Dirjen Web & Produk Digital',
    level: 'kementerian',
    ministryId: 'kominfo',
    ministryName: 'Kementerian Kominfo',
    faculty: "Fakultas Ilmu Komputer",
    initial: 'AEP',
    image: '/images/organization/kominfo-staf-2.jpg',
    linkedin: 'https://linkedin.com',
    instagram: 'https://instagram.com',
    email: 'rayhan.ardiansyah@bem.itg.ac.id',
    order: 28,
    isPlaceholder: false,
    period: '2026/2027',
  },

];

/**
 * 7 Official Ministries with Metadata
 */
export const ministriesData: MinistryGroup[] = [
  {
    id: 'keuangan',
    name: 'Kementerian Keuangan',
    shortName: 'Kemenkeu',
    description: 'Pusat tata kelola perbendaharaan, transparansi kas belanja kabinet, dan audit berkala anggaran ormawa.',
    expectedCount: 2,
    members: cabinetMembers.filter((m) => m.ministryId === 'keuangan'),
  },
  {
    id: 'dagri',
    name: 'Kementerian Dalam Negeri',
    shortName: 'Kemendagri',
    description: 'Harmonisasi hubungan ormawa fakultas, himpunan mahasiswa, penampungan aspirasi internal sivitas kampus.',
    expectedCount: 4,
    members: cabinetMembers.filter((m) => m.ministryId === 'dagri'),
  },
  {
    id: 'lugri',
    name: 'Kementerian Luar Negeri',
    shortName: 'Kemenlu',
    description: 'Diplomasi antar-kampus, konsolidasi aliansi BEM daerah dan nasional, serta jejaring strategis eksternal.',
    expectedCount: 4,
    members: cabinetMembers.filter((m) => m.ministryId === 'lugri'),
  },
  {
    id: 'hukum',
    name: 'Kementerian Hukum',
    shortName: 'Kemenkum',
    description: 'Kajian yuridis regulasi kampus, pendampingan bantuan hukum sivitas, dan fasilitasi ruang aman anti-kekerasan.',
    expectedCount: 3, // core required count
    members: cabinetMembers.filter((m) => m.ministryId === 'hukum'),
  },
  {
    id: 'menkraf',
    name: 'Kementerian Ekonomi Kreatif',
    shortName: 'MenKraf',
    description: 'Pengembangan ekonomi kreatif mahasiswa, inkubasi wirausaha mandiri, merchandise resmi, dan kemitraan usaha.',
    expectedCount: 3,
    members: cabinetMembers.filter((m) => m.ministryId === 'menkraf'),
  },
  {
    id: 'mendikristek',
    name: 'Kementerian Pendidikan, Riset, dan Teknologi',
    shortName: 'Mendikristek',
    description: 'Akselerasi riset ilmiah sivitas, pendampingan PKM nasional, beasiswa berprestasi, dan evaluasi kurikulum.',
    expectedCount: 4,
    members: cabinetMembers.filter((m) => m.ministryId === 'mendikristek'),
  },
  {
    id: 'kominfo',
    name: 'Kementerian Komunikasi dan Informasi',
    shortName: 'Kominfo',
    description: 'Produksi media visual kreatif, rekayasa produk digital portal web, diseminasi pers, dan humas kampus.',
    expectedCount: 3, // core required count
    members: cabinetMembers.filter((m) => m.ministryId === 'kominfo'),
  },
];

/**
 * Curated list for the Homepage 3D Carousel in the requested order:
 * 1. Presiden BEM
 * 2. Wakil Presiden BEM
 * 3. Sekretaris Kabinet
 * 4. Kementerian Keuangan
 * 5. Kementerian Dalam Negeri
 * 6. Kementerian Luar Negeri
 * 7. Kementerian Hukum
 * 8. Kementerian MenKraf
 * 9. Kementerian Mendikristek
 * 10. Kementerian Kominfo
 * Followed by remaining cabinet officers.
 */
export const getCarouselMembers = (): CabinetMember[] => {
  const pres = cabinetMembers.find((m) => m.level === 'presiden')!;
  const wapres = cabinetMembers.find((m) => m.level === 'wapres')!;
  const sekab = cabinetMembers.find((m) => m.level === 'sekab')!;

  const mKeuangan = cabinetMembers.find((m) => m.id === 'keuangan-1')!;
  const mDagri = cabinetMembers.find((m) => m.id === 'dagri-1')!;
  const mLugri = cabinetMembers.find((m) => m.id === 'lugri-1')!;
  const mHukum = cabinetMembers.find((m) => m.id === 'hukum-1')!;
  const mMenkraf = cabinetMembers.find((m) => m.id === 'menkraf-1')!;
  const mMendikristek = cabinetMembers.find((m) => m.id === 'mendikristek-1')!;
  const mKominfo = cabinetMembers.find((m) => m.id === 'kominfo-1')!;

  const leadershipOrdered = [
    pres,
    wapres,
    sekab,
    mKeuangan,
    mDagri,
    mLugri,
    mHukum,
    mMenkraf,
    mMendikristek,
    mKominfo,
  ];

  const remaining = cabinetMembers.filter(
    (m) => !leadershipOrdered.some((lead) => lead.id === m.id)
  );

  return [...leadershipOrdered, ...remaining];
};

/**
 * Backward compatibility helpers for existing components
 */
export const presidium: OrganizationMember[] = [
  {
    id: 'presiden-bem',
    name: 'Ikbal Suryanto',
    role: 'Presiden BEM Kolektiva',
    faculty: "Fakultas Teknik dan Perencanaan",
    initial: 'IS',
    linkedin: 'https://linkedin.com',
    instagram: 'https://instagram.com',
    email: 'rayhan.ardiansyah@bem.itg.ac.id',
    isActive: true,
  },
  {
    id: 'wapres-bem',
    name: 'Rindam Susilo',
    role: 'Wakil Presiden BEM',
    faculty: "Fakultas Ilmu Komputer",
    initial: 'RS',
    linkedin: 'https://linkedin.com',
    instagram: 'https://instagram.com',
    email: 'nabila.larasati@bem.itg.ac.id',
    isActive: true,
  },
];

export const departmentsData: Record<string, DepartmentInfo> = {
  bph: {
    key: 'bph',
    name: 'Presidium & Sekretariat Kabinet',
    label: 'Presidium Inti',
    description: 'Pusat komando tata kelola eksekutif, koordinasi strategis, dan administrasi naskah dinas resmi.',
    members: cabinetMembers
      .filter((m) => m.level === 'presiden' || m.level === 'wapres' || m.level === 'sekab')
      .map((m) => ({
        id: m.id,
        name: m.name,
        role: m.position,
        faculty: m.faculty,
        initial: m.initial,
        isActive: true,
        image: m.image,
        isPlaceholder: m.isPlaceholder,
      })),
  },
  polkam: {
    key: 'polkam',
    name: 'Kementerian Hukum & Regulasi',
    label: 'Hukum & Regulasi',
    description: 'Pusat telaah yuridis, perlindungan hak konstitusional mahasiswa, dan pengawalan regulasi universitas.',
    members: cabinetMembers
      .filter((m) => m.ministryId === 'hukum')
      .map((m) => ({
        id: m.id,
        name: m.name,
        role: m.position,
        faculty: m.faculty,
        initial: m.initial,
        isActive: true,
        image: m.image,
        isPlaceholder: m.isPlaceholder,
      })),
  },
  advo: {
    key: 'advo',
    name: 'Kementerian Dalam Negeri & Luar Negeri',
    label: 'Hubungan Sivitas & Luar',
    description: 'Harmonisasi ormawa internal kampus, diplomasi antar-perguruan tinggi, dan jejaring aliansi BEM.',
    members: cabinetMembers
      .filter((m) => m.ministryId === 'dagri' || m.ministryId === 'lugri')
      .map((m) => ({
        id: m.id,
        name: m.name,
        role: m.position,
        faculty: m.faculty,
        initial: m.initial,
        isActive: true,
        image: m.image,
        isPlaceholder: m.isPlaceholder,
      })),
  },
  sosmas: {
    key: 'sosmas',
    name: 'Kementerian MenKraf & Mendikristek',
    label: 'Inovasi & Riset',
    description: 'Pengembangan riset ilmiah mahasiswa, fasilitasi PKM, dan inkubasi kewirausahaan kreatif.',
    members: cabinetMembers
      .filter((m) => m.ministryId === 'menkraf' || m.ministryId === 'mendikristek')
      .map((m) => ({
        id: m.id,
        name: m.name,
        role: m.position,
        faculty: m.faculty,
        initial: m.initial,
        isActive: true,
        image: m.image,
        isPlaceholder: m.isPlaceholder,
      })),
  },
  kominfo: {
    key: 'kominfo',
    name: 'Kementerian Komunikasi & Media Digital',
    label: 'Kominfo & Media',
    description: 'Produksi media visual kreatif, portal digital resmi, transparansi data, dan hubungan pers sivitas.',
    members: cabinetMembers
      .filter((m) => m.ministryId === 'kominfo')
      .map((m) => ({
        id: m.id,
        name: m.name,
        role: m.position,
        faculty: m.faculty,
        initial: m.initial,
        isActive: true,
        image: m.image,
        isPlaceholder: m.isPlaceholder,
      })),
  },
};
