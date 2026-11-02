import http from 'http';
import fs from 'fs';
import path from 'path';
import { spawn } from 'child_process';

const PORT = 8105;
const DIST = path.resolve('dist');

const MIME = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
};

const server = http.createServer((req, res) => {
  let reqPath = req.url.split('?')[0];
  if (reqPath === '/') reqPath = '/index.html';
  let filePath = path.join(DIST, reqPath);
  
  if (!fs.existsSync(filePath)) {
    filePath = path.join(DIST, 'index.html');
  }

  const ext = path.extname(filePath);
  res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' });
  fs.createReadStream(filePath).pipe(res);
});

server.listen(PORT, async () => {
  console.log(`[TEST] Verification server listening at http://127.0.0.1:${PORT}`);

  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const browserBin = fs.existsSync(chromePath) ? chromePath : edgePath;

  const CDP_PORT = 9345;
  const browser = spawn(browserBin, [
    '--headless=new',
    '--disable-gpu',
    `--remote-debugging-port=${CDP_PORT}`,
    `http://127.0.0.1:${PORT}/`
  ]);

  browser.on('error', (err) => {
    console.error('Browser launch error:', err);
    server.close();
    process.exit(1);
  });

  await new Promise(r => setTimeout(r, 2000));

  try {
    const versionRes = await fetch(`http://127.0.0.1:${CDP_PORT}/json`);
    const tabs = await versionRes.json();
    const pageTab = tabs.find(t => t.type === 'page') || tabs[0];
    if (!pageTab || !pageTab.webSocketDebuggerUrl) {
      throw new Error('No webSocketDebuggerUrl found');
    }

    const ws = new WebSocket(pageTab.webSocketDebuggerUrl);

    let id = 1;
    const send = (method, params = {}) => {
      return new Promise((resolve) => {
        const curId = id++;
        const handler = (msg) => {
          const data = JSON.parse(msg.data);
          if (data.id === curId) {
            ws.removeEventListener('message', handler);
            resolve(data.result);
          }
        };
        ws.addEventListener('message', handler);
        ws.send(JSON.stringify({ id: curId, method, params }));
      });
    };

    await new Promise(resolve => ws.onopen = resolve);
    console.log('[TEST] Connected to Chrome DevTools Protocol');

    await send('Page.enable');
    await send('Runtime.enable');
    await send('Emulation.setDeviceMetricsOverride', {
      width: 1440,
      height: 900,
      deviceScaleFactor: 1,
      mobile: false,
    });

    const evalCode = async (expression) => {
      const res = await send('Runtime.evaluate', {
        expression,
        returnByValue: true,
        awaitPromise: true,
      });
      return res?.result?.value;
    };

    console.log('\n--- 1. VERIFY HERO CTA ON HOMEPAGE ---');
    await send('Page.navigate', { url: `http://127.0.0.1:${PORT}/` });
    await new Promise(r => setTimeout(r, 2000));

    const heroCheck = await evalCode(`(() => {
      const hero = document.getElementById('hero');
      if (!hero) return { found: false, error: 'Hero element not found' };

      // Find CTA buttons
      const links = Array.from(hero.querySelectorAll('a'));
      const loginLink = links.find(a => a.textContent.includes('Login Admin'));
      const exploreLink = links.find(a => a.textContent.includes('Jelajahi Portal'));
      const aspirasiOldButton = links.find(a => a.textContent.includes('Sampaikan Aspirasi'));

      return {
        found: true,
        hasLoginAdminButton: !!loginLink,
        loginAdminHref: loginLink ? loginLink.getAttribute('href') : null,
        hasExploreButton: !!exploreLink,
        exploreHref: exploreLink ? exploreLink.getAttribute('href') : null,
        hasOldAspirasiButton: !!aspirasiOldButton,
      };
    })()`);

    console.log('Hero CTA Result:', JSON.stringify(heroCheck, null, 2));

    if (!heroCheck.hasLoginAdminButton || heroCheck.loginAdminHref !== '/login') {
      throw new Error(`Hero CTA failed: Login Admin button missing or wrong href: ${heroCheck.loginAdminHref}`);
    }
    if (heroCheck.hasOldAspirasiButton) {
      throw new Error('Old "Sampaikan Aspirasi" CTA still exists in Hero area!');
    }
    console.log('✔ Hero CTA successfully updated to "Login Admin" pointing to /login');

    console.log('\n--- 2. VERIFY LOGIN PAGE STRUCTURE (NO ROLE SELECTION) ---');
    await send('Page.navigate', { url: `http://127.0.0.1:${PORT}/login` });
    await new Promise(r => setTimeout(r, 1500));

    const loginPageCheck = await evalCode(`(() => {
      const title = document.querySelector('h1')?.textContent;
      const form = document.querySelector('form');
      if (!form) return { hasForm: false };

      const inputs = Array.from(form.querySelectorAll('input'));
      const selects = Array.from(form.querySelectorAll('select'));
      const radios = Array.from(form.querySelectorAll('input[type="radio"]'));

      const identifierInput = form.querySelector('input#identifier, input[name="identifier"]');
      const passwordInput = form.querySelector('input#password, input[name="password"]');

      return {
        hasForm: true,
        pageTitle: title,
        totalInputs: inputs.length,
        totalSelects: selects.length,
        totalRadios: radios.length,
        hasIdentifierInput: !!identifierInput,
        hasPasswordInput: !!passwordInput,
        // Ensure no role choices inside the form
        hasRoleDropdownInForm: selects.length > 0,
        hasRoleRadioInForm: radios.length > 0,
      };
    })()`);

    console.log('Login Page Form Check:', JSON.stringify(loginPageCheck, null, 2));

    if (loginPageCheck.totalSelects > 0 || loginPageCheck.totalRadios > 0) {
      throw new Error('VIOLATION: Role selection dropdown or radios found in login form!');
    }
    if (!loginPageCheck.hasIdentifierInput || !loginPageCheck.hasPasswordInput) {
      throw new Error('Login form missing required identifier or password inputs!');
    }
    console.log('✔ Login page correctly contains only Identifier and Password (No role selection)');

    console.log('\n--- 3. VERIFY INVALID CREDENTIALS ERROR HANDLING ---');
    const invalidAuthResult = await evalCode(`(async () => {
      const setVal = (el, val) => {
        const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
        setter.call(el, val);
        el.dispatchEvent(new Event('input', { bubbles: true }));
        el.dispatchEvent(new Event('change', { bubbles: true }));
      };

      const form = document.querySelector('form');
      const idInput = form.querySelector('input#identifier');
      const passInput = form.querySelector('input#password');
      const submitBtn = form.querySelector('button[type="submit"]');

      // Set invalid credentials
      setVal(idInput, 'unknown_user');
      setVal(passInput, 'wrong_password_999');

      // Submit form
      submitBtn.click();
      await new Promise(r => setTimeout(r, 1500));

      const alertEl = document.querySelector('.animate-shake, [class*="bg-red"]');
      return {
        hasErrorAlert: !!alertEl,
        errorMessage: alertEl ? alertEl.textContent.trim() : null,
        currentPath: window.location.pathname,
      };
    })()`);

    console.log('Invalid Auth Test Result:', JSON.stringify(invalidAuthResult, null, 2));
    if (!invalidAuthResult.hasErrorAlert || invalidAuthResult.currentPath !== '/login') {
      throw new Error('Failed to reject invalid credentials!');
    }
    console.log('✔ Invalid credentials properly rejected with error notice');

    console.log('\n--- 4. VERIFY SUPER ADMIN LOGIN & AUTO-REDIRECT ---');
    const superAdminLogin = await evalCode(`(async () => {
      const setVal = (el, val) => {
        const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
        setter.call(el, val);
        el.dispatchEvent(new Event('input', { bubbles: true }));
        el.dispatchEvent(new Event('change', { bubbles: true }));
      };

      const form = document.querySelector('form');
      const idInput = form.querySelector('input#identifier');
      const passInput = form.querySelector('input#password');
      const submitBtn = form.querySelector('button[type="submit"]');

      setVal(idInput, 'superadmin');
      setVal(passInput, 'password123');

      submitBtn.click();
      await new Promise(r => setTimeout(r, 2000));

      return {
        currentPath: window.location.pathname,
        pageText: document.body.innerText.slice(0, 500),
      };
    })()`);

    console.log('Super Admin Redirect:', superAdminLogin.currentPath);
    if (superAdminLogin.currentPath !== '/dashboard/super-admin') {
      throw new Error('Expected redirect to /dashboard/super-admin, got: ' + superAdminLogin.currentPath);
    }
    console.log('✔ Super Admin automatically routed to /dashboard/super-admin');

    // Logout from Super Admin
    await evalCode(`(() => {
      const logoutBtn = document.querySelector('[data-testid="logout-button"]');
      if (logoutBtn) logoutBtn.click();
    })()`);
    await new Promise(r => setTimeout(r, 1500));
    const pathAfterLogout1 = await evalCode(`window.location.pathname`);
    console.log('Path after Super Admin logout:', pathAfterLogout1);

    console.log('\n--- 5. VERIFY ADMIN LOGIN & AUTO-REDIRECT ---');
    const adminLogin = await evalCode(`(async () => {
      const setVal = (el, val) => {
        const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
        setter.call(el, val);
        el.dispatchEvent(new Event('input', { bubbles: true }));
        el.dispatchEvent(new Event('change', { bubbles: true }));
      };

      const form = document.querySelector('form');
      if (!form) return { error: 'No login form found', currentPath: window.location.pathname };
      const idInput = form.querySelector('input#identifier');
      const passInput = form.querySelector('input#password');
      const submitBtn = form.querySelector('button[type="submit"]');

      setVal(idInput, 'admin');
      setVal(passInput, 'password123');

      submitBtn.click();
      await new Promise(r => setTimeout(r, 2000));

      return {
        currentPath: window.location.pathname,
        hasOperationalTitle: document.body.innerText.includes('Operational Management') || document.body.innerText.includes('Sekretaris Jenderal'),
      };
    })()`);

    console.log('Admin Redirect:', JSON.stringify(adminLogin));
    if (adminLogin.currentPath !== '/dashboard/admin') {
      throw new Error('Expected redirect to /dashboard/admin, got: ' + adminLogin.currentPath);
    }
    console.log('✔ Admin automatically routed to /dashboard/admin');

    // Logout from Admin
    await evalCode(`(() => {
      const logoutBtn = document.querySelector('[data-testid="logout-button"]');
      if (logoutBtn) logoutBtn.click();
    })()`);
    await new Promise(r => setTimeout(r, 1500));
    const pathAfterLogout2 = await evalCode(`window.location.pathname`);
    console.log('Path after Admin logout:', pathAfterLogout2);

    console.log('\n--- 6. VERIFY EDITOR LOGIN & AUTO-REDIRECT ---');
    const editorLogin = await evalCode(`(async () => {
      const setVal = (el, val) => {
        const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
        setter.call(el, val);
        el.dispatchEvent(new Event('input', { bubbles: true }));
        el.dispatchEvent(new Event('change', { bubbles: true }));
      };

      const form = document.querySelector('form');
      if (!form) return { error: 'No login form found', currentPath: window.location.pathname };
      const idInput = form.querySelector('input#identifier');
      const passInput = form.querySelector('input#password');
      const submitBtn = form.querySelector('button[type="submit"]');

      setVal(idInput, 'editor');
      setVal(passInput, 'password123');

      submitBtn.click();
      await new Promise(r => setTimeout(r, 2000));

      return {
        currentPath: window.location.pathname,
        hasEditorTitle: document.body.innerText.includes('Meja Redaksi') || document.body.innerText.includes('Editor Redaksi'),
      };
    })()`);

    console.log('Editor Redirect:', editorLogin.currentPath);
    if (editorLogin.currentPath !== '/dashboard/editor') {
      throw new Error(`Expected redirect to /dashboard/editor, got: ${editorLogin.currentPath}`);
    }
    console.log('✔ Editor automatically routed to /dashboard/editor');

    console.log('\n--- 7. VERIFY RBAC ACCESS CONTROL (EDITOR TRYING TO ACCESS SUPER ADMIN) ---');
    // While authenticated as Editor, navigate directly to /dashboard/super-admin
    await send('Page.navigate', { url: `http://127.0.0.1:${PORT}/dashboard/super-admin` });
    await new Promise(r => setTimeout(r, 1500));

    const rbacViolationCheck = await evalCode(`(() => {
      const bodyText = document.body.innerText;
      return {
        currentPath: window.location.pathname,
        has403Notice: bodyText.includes('403') || bodyText.includes('Akses Terbatas') || bodyText.includes('Otoritas Tidak Memadai'),
        hasRoleNotice: bodyText.includes('Editor Redaksi'),
      };
    })()`);

    console.log('RBAC Protection Check Result:', JSON.stringify(rbacViolationCheck, null, 2));
    if (!rbacViolationCheck.has403Notice) {
      throw new Error('RBAC Failed: Editor was able to view Super Admin dashboard without 403 restriction!');
    }
    console.log('✔ RBAC Route Protection successfully blocked unauthorized role with 403 explanation');

    console.log('\n--- 8. VERIFY UNAUTHENTICATED DIRECT ACCESS TO PROTECTED ROUTE ---');
    // Clear session and attempt direct access to /dashboard/admin
    await evalCode(`sessionStorage.clear()`);
    await send('Page.navigate', { url: `http://127.0.0.1:${PORT}/dashboard/admin` });
    await new Promise(r => setTimeout(r, 1500));

    const unauthCheck = await evalCode(`(() => {
      return {
        currentPath: window.location.pathname,
      };
    })()`);

    console.log('Unauthenticated Direct Access Result:', unauthCheck.currentPath);
    if (unauthCheck.currentPath !== '/login') {
      throw new Error(`Expected redirect to /login for unauthenticated user, got: ${unauthCheck.currentPath}`);
    }
    console.log('✔ Unauthenticated direct route access correctly redirected to /login');

    console.log('\n--- 9. VERIFY RESPONSIVE LAYOUT & ZERO HORIZONTAL OVERFLOW ---');
    // Check desktop
    await send('Page.navigate', { url: `http://127.0.0.1:${PORT}/login` });
    await new Promise(r => setTimeout(r, 1000));
    const desktopOverflow = await evalCode(`document.documentElement.scrollWidth > window.innerWidth`);

    // Check mobile (375x667)
    await send('Emulation.setDeviceMetricsOverride', {
      width: 375,
      height: 667,
      deviceScaleFactor: 2,
      mobile: true,
    });
    await new Promise(r => setTimeout(r, 1000));
    const mobileOverflow = await evalCode(`document.documentElement.scrollWidth > window.innerWidth`);

    console.log(`Desktop overflow: ${desktopOverflow}, Mobile overflow: ${mobileOverflow}`);
    if (desktopOverflow || mobileOverflow) {
      throw new Error('Horizontal overflow detected!');
    }
    console.log('✔ Zero horizontal overflow on desktop and mobile viewports');

    console.log('\n========================================');
    console.log('ALL VERIFICATION SUITES PASSED (100%)');
    console.log('========================================');

    ws.close();
    browser.kill();
    server.close();
    process.exit(0);
  } catch (err) {
    console.error('[TEST ERROR]', err);
    browser.kill();
    server.close();
    process.exit(1);
  }
});
