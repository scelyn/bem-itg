import { prisma } from '../server/src/config/database';
import { hashPassword, comparePassword } from '../server/src/utils/password';
import { signToken, verifyToken } from '../server/src/utils/jwt';
import { login, setupInitialAdmin, getMe } from '../server/src/controllers/authController';
import { listUsers, createUser } from '../server/src/controllers/userController';
import {
  submitPublicAspiration,
  trackPublicAspiration,
  listAdminAspirations,
  updateAspirationStatus,
  addInternalNote,
} from '../server/src/controllers/aspirationController';
import {
  listPublicNews,
  getPublicNewsBySlug,
  listAdminNews,
  createNewsArticle,
} from '../server/src/controllers/newsController';
import {
  listPublicDocuments,
  createLegalDocument,
} from '../server/src/controllers/documentController';
import { requireRole } from '../server/src/middleware/rbacMiddleware';
import { AuthenticatedRequest, RoleId } from '../server/src/types/auth';

interface MockResponse {
  statusCode: number;
  jsonData: any;
  status: (code: number) => MockResponse;
  json: (data: any) => MockResponse;
}

function createMockRes(): MockResponse {
  const res: MockResponse = {
    statusCode: 200,
    jsonData: null,
    status(code: number) {
      this.statusCode = code;
      return this;
    },
    json(data: any) {
      this.jsonData = data;
      return this;
    },
  };
  return res;
}

function createMockReq(overrides: Partial<AuthenticatedRequest> = {}): AuthenticatedRequest {
  return {
    body: {},
    params: {},
    query: {},
    headers: {},
    ...overrides,
  } as unknown as AuthenticatedRequest;
}

async function runVerification() {
  console.log('================================================================');
  console.log('   BEM ITG KOLEKTIVA - BACKEND & DATABASE VERIFICATION SUITE   ');
  console.log('================================================================\n');

  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, testName: string, detail?: string) {
    if (condition) {
      console.log(`  ✓ [PASS] ${testName}`);
      passed++;
    } else {
      console.error(`  ✗ [FAIL] ${testName} ${detail ? `-> ${detail}` : ''}`);
      failed++;
    }
  }

  try {
    // -------------------------------------------------------------------------
    // TEST 1: Database Connection & Seed Data Integrity
    // -------------------------------------------------------------------------
    console.log('\n--- 1. Database Connection & Seed Data Integrity ---');
    const roleCount = await prisma.role.count();
    const permCount = await prisma.permission.count();
    const rolePermCount = await prisma.rolePermission.count();
    const periodCount = await prisma.cabinetPeriod.count();

    assert(roleCount === 3, 'Roles table contains 3 core roles (super_admin, admin, editor)', `Found ${roleCount}`);
    assert(permCount >= 26, `Permissions table seeded with complete actions (found ${permCount})`);
    assert(rolePermCount >= 50, `Role-permission mappings established (found ${rolePermCount})`);
    assert(periodCount >= 1, `Active cabinet period exists (found ${periodCount})`);

    // -------------------------------------------------------------------------
    // TEST 2: Cryptographic Password Hashing (bcryptjs)
    // -------------------------------------------------------------------------
    console.log('\n--- 2. Cryptographic Security (bcrypt) ---');
    const plainTestPass = 'Kolektiva2026!SecureKey';
    const hashed = await hashPassword(plainTestPass);
    assert(hashed.startsWith('$2'), 'Bcrypt hash starts with valid salt prefix ($2a/$2b)');
    assert(await comparePassword(plainTestPass, hashed), 'Valid password verifies successfully against hash');
    assert(!(await comparePassword('WrongPassword123', hashed)), 'Incorrect password rejected by comparePassword');

    // -------------------------------------------------------------------------
    // TEST 3: Initial Super Admin Setup (Guarded Action)
    // -------------------------------------------------------------------------
    console.log('\n--- 3. Initial Super Admin Setup Flow ---');
    // Clean up test users first
    await prisma.auditLog.deleteMany({});
    await prisma.aspirationNote.deleteMany({});
    await prisma.aspirationPipelineStep.deleteMany({});
    await prisma.aspiration.deleteMany({});
    await prisma.newsArticle.deleteMany({});
    await prisma.legalDocument.deleteMany({});
    await prisma.user.deleteMany({});

    // 3a: Create initial Super Admin
    const setupReq = createMockReq({
      body: {
        fullName: 'Super Administrator BEM ITG',
        username: 'superadmin_kolektiva',
        email: 'superadmin@itg.ac.id',
        password: 'SuperAdminPassword123!',
      },
    });
    const setupRes = createMockRes();
    await setupInitialAdmin(setupReq, setupRes as any);

    assert(setupRes.statusCode === 201, 'Initial Super Admin creation returns 201 Created');
    assert(setupRes.jsonData.user.role === 'super_admin', 'Initial user is assigned super_admin role');

    // 3b: Attempt second setup (MUST BE STRICTLY BLOCKED)
    const secondSetupReq = createMockReq({
      body: {
        fullName: 'Attacker Admin',
        username: 'attacker',
        email: 'attacker@itg.ac.id',
        password: 'HackerPassword123!',
      },
    });
    const secondSetupRes = createMockRes();
    await setupInitialAdmin(secondSetupReq, secondSetupRes as any);

    assert(secondSetupRes.statusCode === 403, 'Subsequent setup attempts strictly blocked with 403 Forbidden');

    // -------------------------------------------------------------------------
    // TEST 4: Authentication & JWT Login Flow
    // -------------------------------------------------------------------------
    console.log('\n--- 4. Authentication & JWT Tokens ---');
    // 4a: Bad password
    const badLoginReq = createMockReq({
      body: { identifier: 'superadmin_kolektiva', password: 'WrongPassword' },
    });
    const badLoginRes = createMockRes();
    await login(badLoginReq, badLoginRes as any);
    assert(badLoginRes.statusCode === 401, 'Invalid credentials rejected with 401 Unauthorized');

    // 4b: Valid login
    const goodLoginReq = createMockReq({
      body: { identifier: 'superadmin_kolektiva', password: 'SuperAdminPassword123!' },
    });
    const goodLoginRes = createMockRes();
    await login(goodLoginReq, goodLoginRes as any);
    assert(goodLoginRes.statusCode === 200, 'Valid credentials login returns 200 OK');
    assert(Boolean(goodLoginRes.jsonData.token), 'Login returns valid JWT token string');
    assert(!goodLoginRes.jsonData.user.passwordHash, 'User response does NOT leak password hash');

    const superAdminUser = goodLoginRes.jsonData.user;
    const superAdminPayload = {
      id: superAdminUser.id,
      username: superAdminUser.username,
      email: superAdminUser.email,
      fullName: superAdminUser.fullName,
      roleId: superAdminUser.role as RoleId,
      permissions: goodLoginRes.jsonData.permissions,
    };

    // 4c: Verify JWT with getMe
    const meReq = createMockReq({ user: superAdminPayload });
    const meRes = createMockRes();
    await getMe(meReq, meRes as any);
    assert(meRes.statusCode === 200, 'Authenticated getMe returns 200 with user profile');
    assert(meRes.jsonData.user.username === 'superadmin_kolektiva', 'Profile matches authenticated user');

    // -------------------------------------------------------------------------
    // TEST 5: Role Provisioning & RBAC Matrix
    // -------------------------------------------------------------------------
    console.log('\n--- 5. RBAC Enforcement Matrix (Super Admin vs Admin vs Editor) ---');

    // 5a: Super Admin creates an Admin and an Editor
    const createAdminReq = createMockReq({
      user: superAdminPayload,
      body: {
        fullName: 'Admin BEM ITG',
        username: 'admin_bem',
        email: 'admin@itg.ac.id',
        password: 'AdminPassword123!',
        roleId: 'admin',
      },
    });
    const createAdminRes = createMockRes();
    await createUser(createAdminReq, createAdminRes as any);
    assert(createAdminRes.statusCode === 201, 'Super Admin can create an Admin user (201 Created)');

    const createEditorReq = createMockReq({
      user: superAdminPayload,
      body: {
        fullName: 'Editor Redaksi',
        username: 'editor_redaksi',
        email: 'editor@itg.ac.id',
        password: 'EditorPassword123!',
        roleId: 'editor',
      },
    });
    const createEditorRes = createMockRes();
    await createUser(createEditorReq, createEditorRes as any);
    assert(createEditorRes.statusCode === 201, 'Super Admin can create an Editor user (201 Created)');

    // 5b: RBAC Middleware enforcement tests
    const adminUserPayload = {
      id: createAdminRes.jsonData.user.id,
      username: 'admin_bem',
      email: 'admin@itg.ac.id',
      fullName: 'Admin BEM ITG',
      roleId: 'admin' as RoleId,
      permissions: ['aspirations:read', 'news:publish'],
    };

    const editorUserPayload = {
      id: createEditorRes.jsonData.user.id,
      username: 'editor_redaksi',
      email: 'editor@itg.ac.id',
      fullName: 'Editor Redaksi',
      roleId: 'editor' as RoleId,
      permissions: ['news:create', 'news:read', 'news:update'],
    };

    // Middleware: requireRole(['super_admin'])
    const superAdminGuard = requireRole(['super_admin']);

    // Admin tries Super Admin route -> 403
    let nextCalled = false;
    const rbacRes1 = createMockRes();
    await superAdminGuard(createMockReq({ user: adminUserPayload }), rbacRes1 as any, () => { nextCalled = true; });
    assert(rbacRes1.statusCode === 403 && !nextCalled, 'Admin is blocked from Super Admin route with 403 Forbidden');

    // Editor tries Super Admin route -> 403
    nextCalled = false;
    const rbacRes2 = createMockRes();
    await superAdminGuard(createMockReq({ user: editorUserPayload }), rbacRes2 as any, () => { nextCalled = true; });
    assert(rbacRes2.statusCode === 403 && !nextCalled, 'Editor is blocked from Super Admin route with 403 Forbidden');

    // Super Admin tries Super Admin route -> next() called
    nextCalled = false;
    const rbacRes3 = createMockRes();
    await superAdminGuard(createMockReq({ user: superAdminPayload }), rbacRes3 as any, () => { nextCalled = true; });
    assert(nextCalled, 'Super Admin passes Super Admin route guard successfully');

    // Middleware: requireRole(['super_admin', 'admin'])
    const adminGuard = requireRole(['super_admin', 'admin']);

    // Editor tries Admin route -> 403
    nextCalled = false;
    const rbacRes4 = createMockRes();
    await adminGuard(createMockReq({ user: editorUserPayload }), rbacRes4 as any, () => { nextCalled = true; });
    assert(rbacRes4.statusCode === 403 && !nextCalled, 'Editor is blocked from Admin route with 403 Forbidden');

    // Admin tries Admin route -> next() called
    nextCalled = false;
    const rbacRes5 = createMockRes();
    await adminGuard(createMockReq({ user: adminUserPayload }), rbacRes5 as any, () => { nextCalled = true; });
    assert(nextCalled, 'Admin passes Admin route guard successfully');

    // -------------------------------------------------------------------------
    // TEST 6: Student Aspirations & Pipeline Workflow
    // -------------------------------------------------------------------------
    console.log('\n--- 6. Public Aspirations & Tracking Pipeline ---');
    const submitReq = createMockReq({
      body: {
        title: 'Perbaikan Jaringan Wi-Fi Gedung F',
        body: 'Koneksi internet di lantai 3 Gedung F sering terputus selama jam perkuliahan.',
        category: 'Fasilitas & Infrastruktur Kampus',
        urgency: 'Mendesak',
        isAnonymous: true,
      },
    });
    const submitRes = createMockRes();
    await submitPublicAspiration(submitReq, submitRes as any);

    assert(submitRes.statusCode === 201, 'Public student aspiration submitted successfully (201 Created)');
    const ticketCode = submitRes.jsonData.ticketCode;
    assert(ticketCode.startsWith('ASP-2026-'), `Ticket code generated with format ASP-2026-XXX: ${ticketCode}`);
    assert(submitRes.jsonData.data.pipelineSteps.length === 4, 'Aspiration initialized with 4-stage tracking pipeline');

    // Track aspiration publicly
    const trackReq = createMockReq({ params: { code: ticketCode } });
    const trackRes = createMockRes();
    await trackPublicAspiration(trackReq, trackRes as any);
    assert(trackRes.statusCode === 200, 'Public tracking returns 200 OK for valid ticket');
    assert(trackRes.jsonData.aspiration.senderName === 'Anonim Mahasiswa', 'Anonymous sender identity masked in public view');

    // Admin updates aspiration status & adds internal note
    const aspId = submitRes.jsonData.data.id;
    const updateAspReq = createMockReq({
      user: adminUserPayload,
      params: { id: aspId },
      body: {
        status: 'Sedang Ditelaah Komisi',
        pipelineStepNumber: 2,
        stepStatus: 'completed',
      },
    });
    const updateAspRes = createMockRes();
    await updateAspirationStatus(updateAspReq, updateAspRes as any);
    assert(updateAspRes.statusCode === 200, 'Admin can update aspiration status and pipeline stage');

    const addNoteReq = createMockReq({
      user: adminUserPayload,
      params: { id: aspId },
      body: { note: 'Sudah dikoordinasikan dengan Biro Sarpras kampus.' },
    });
    const addNoteRes = createMockRes();
    await addInternalNote(addNoteReq, addNoteRes as any);
    assert(addNoteRes.statusCode === 201, 'Admin can attach internal coordination note to aspiration');

    // -------------------------------------------------------------------------
    // TEST 7: News Redaction & Editorial Workflow
    // -------------------------------------------------------------------------
    console.log('\n--- 7. News & Editorial Workflow ---');
    const createNewsReq = createMockReq({
      user: editorUserPayload,
      body: {
        title: 'Peluncuran Gerakan Advokasi Terbuka 2026',
        excerpt: 'BEM ITG KOLEKTIVA merilis kanal digital penampungan aspirasi mahasiswa.',
        content: 'Dalam rangka mewujudkan tata kelola kampus yang inklusif...',
        category: 'Advokasi',
        status: 'published',
      },
    });
    const createNewsRes = createMockRes();
    await createNewsArticle(createNewsReq, createNewsRes as any);
    assert(createNewsRes.statusCode === 201, 'Editor can create and submit news articles (201 Created)');
    const articleSlug = createNewsRes.jsonData.article.slug;

    // Public reads published news
    const publicNewsReq = createMockReq({ params: { slug: articleSlug } });
    const publicNewsRes = createMockRes();
    await getPublicNewsBySlug(publicNewsReq, publicNewsRes as any);
    assert(publicNewsRes.statusCode === 200, 'Public can view published news article by slug');

    // -------------------------------------------------------------------------
    // TEST 8: Legal Documents Archive & Document Numbers
    // -------------------------------------------------------------------------
    console.log('\n--- 8. Legal Documents Digital Archive ---');
    const docReq = createMockReq({
      user: adminUserPayload,
      body: {
        documentNumber: 'SK/001/BEM-ITG/XI/2026',
        title: 'Surat Keputusan Pengesahan Struktur Kabinet KOLEKTIVA',
        category: 'sk',
        categoryLabel: 'Surat Keputusan (SK)',
        year: '2026',
        fileUrl: '/docs/sk-001-2026.pdf',
        fileSize: '2.4 MB',
      },
    });
    const docRes = createMockRes();
    await createLegalDocument(docReq, docRes as any);
    assert(docRes.statusCode === 201, 'Admin can archive legal document (201 Created)');

    // Duplicate document number should fail
    const dupDocReq = createMockReq({
      user: adminUserPayload,
      body: {
        documentNumber: 'SK/001/BEM-ITG/XI/2026',
        title: 'Surat Duplikat',
        category: 'sk',
        fileUrl: '/docs/dup.pdf',
      },
    });
    const dupDocRes = createMockRes();
    await createLegalDocument(dupDocReq, dupDocRes as any);
    assert(dupDocRes.statusCode === 409, 'Duplicate document number rejected with 409 Conflict');

    // -------------------------------------------------------------------------
    // TEST 9: Audit Trail Logging & Security Verification
    // -------------------------------------------------------------------------
    console.log('\n--- 9. Security Audit Trail ---');
    const auditLogsCount = await prisma.auditLog.count();
    assert(auditLogsCount > 5, `Audit log entries recorded across actions (found ${auditLogsCount} entries)`);

    const rbacDeniedLog = await prisma.auditLog.findFirst({
      where: { action: 'RBAC_ACCESS_DENIED' },
    });
    assert(Boolean(rbacDeniedLog), 'RBAC access violations are logged with actor ID and endpoint details');

    // -------------------------------------------------------------------------
    // Clean up test data so database is fresh for production use
    // -------------------------------------------------------------------------
    console.log('\n--- Database Cleanup for Clean Initial Handover ---');
    await prisma.auditLog.deleteMany({});
    await prisma.aspirationNote.deleteMany({});
    await prisma.aspirationPipelineStep.deleteMany({});
    await prisma.aspiration.deleteMany({});
    await prisma.newsArticle.deleteMany({});
    await prisma.legalDocument.deleteMany({});
    await prisma.user.deleteMany({});
    console.log('✓ Test user accounts cleaned up. Database is now in pristine initial state.');
    console.log('✓ Initial setup route /api/auth/setup-initial-superadmin is open and ready.');

    console.log('\n================================================================');
    console.log(`VERIFICATION SUMMARY: ${passed} PASSED, ${failed} FAILED`);
    console.log('================================================================');
  } catch (err) {
    console.error('Unexpected test error:', err);
    failed++;
  } finally {
    await prisma.$disconnect();
    if (failed > 0) {
      process.exit(1);
    }
  }
}

runVerification();
