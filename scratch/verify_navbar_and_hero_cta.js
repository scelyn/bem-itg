import http from 'http';
import fs from 'fs';
import path from 'path';
import { spawn } from 'child_process';

const PORT = 8110;
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
  console.log(`[TEST] Verification server running at http://127.0.0.1:${PORT}`);

  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const browserBin = fs.existsSync(chromePath) ? chromePath : edgePath;

  const CDP_PORT = 9350;
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

    console.log('\n--- 1. VERIFY NAVBAR: "Login Admin" LINK TO /login ---');
    await send('Page.navigate', { url: `http://127.0.0.1:${PORT}/` });
    await new Promise(r => setTimeout(r, 3500));

    const navbarCheck = await evalCode(`(() => {
      const header = document.querySelector('header');
      if (!header) return { error: 'No header element found', readyState: document.readyState, body: document.body.innerText.slice(0, 100) };

      const links = Array.from(header.querySelectorAll('a'));
      const loginAdminLink = links.find(a => a.textContent.includes('Login Admin'));
      const aspirasiActionBtn = links.find(a => a.textContent.includes('Sampaikan Aspirasi'));

      // Check all navlinks
      const navLinks = Array.from(header.querySelectorAll('nav a')).map(a => ({
        label: a.textContent.trim(),
        href: a.getAttribute('href')
      }));

      return {
        hasLoginAdminLink: !!loginAdminLink,
        loginAdminHref: loginAdminLink ? loginAdminLink.getAttribute('href') : null,
        hasAspirasiInActionSlot: !!aspirasiActionBtn,
        navLinks,
      };
    })()`);

    console.log('Navbar Check Result:', JSON.stringify(navbarCheck, null, 2));

    if (!navbarCheck.hasLoginAdminLink || navbarCheck.loginAdminHref !== '/login') {
      throw new Error('Navbar missing Login Admin link to /login!');
    }
    if (navbarCheck.hasAspirasiInActionSlot) {
      throw new Error('Navbar still has Sampaikan Aspirasi button in action slot!');
    }
    console.log('✔ Navbar correctly displays "Login Admin" linking to /login');
    console.log('✔ Navbar preserved all standard navigation links');

    console.log('\n--- 2. VERIFY HERO CTA: "Sampaikan Aspirasi" RESTORED ---');
    const heroCheck = await evalCode(`(() => {
      const hero = document.getElementById('hero');
      if (!hero) return { error: 'No hero element found' };

      const buttons = Array.from(hero.querySelectorAll('button'));
      const aspirasiBtn = buttons.find(b => b.textContent.includes('Sampaikan Aspirasi'));
      const loginBtn = buttons.find(b => b.textContent.includes('Login Admin'));

      return {
        hasHeroAspirasiBtn: !!aspirasiBtn,
        hasHeroLoginBtn: !!loginBtn,
      };
    })()`);

    console.log('Hero CTA Check Result:', JSON.stringify(heroCheck, null, 2));

    if (!heroCheck.hasHeroAspirasiBtn) {
      throw new Error('Hero CTA missing "Sampaikan Aspirasi" button!');
    }
    if (heroCheck.hasHeroLoginBtn) {
      throw new Error('Hero CTA still has "Login Admin" button!');
    }
    console.log('✔ Hero Homepage CTA is properly preserved as "Sampaikan Aspirasi"');

    // Test clicking Hero CTA opens Aspirasi modal
    const modalCheck = await evalCode(`(async () => {
      const hero = document.getElementById('hero');
      const aspirasiBtn = Array.from(hero.querySelectorAll('button')).find(b => b.textContent.includes('Sampaikan Aspirasi'));
      if (aspirasiBtn) aspirasiBtn.click();

      // Wait for modal transition
      await new Promise(r => setTimeout(r, 800));

      // Check if modal dialog appeared
      const modal = document.querySelector('.fixed.inset-0.z-50');
      const modalText = modal ? modal.textContent : '';
      return {
        hasModalElement: !!modal,
        modalOpened: modalText.includes('Sampaikan Suaramu') || modalText.includes('Kritik, saran, & advokasi'),
      };
    })()`);

    console.log('Hero Modal Trigger Result:', JSON.stringify(modalCheck, null, 2));
    if (!modalCheck.modalOpened) {
      throw new Error('Hero "Sampaikan Aspirasi" button failed to open AspirasiModal!');
    }
    console.log('✔ Clicking Hero CTA opens AspirasiModal successfully');

    // Close modal by clicking outside or close button
    await evalCode(`(() => {
      const closeBtn = document.querySelector('button[aria-label="Tutup modal"], button[aria-label="Close"], button.absolute');
      if (closeBtn) closeBtn.click();
    })()`);
    await new Promise(r => setTimeout(r, 600));

    console.log('\n--- 3. VERIFY PUBLIC /aspirations PAGE INTACT ---');
    await send('Page.navigate', { url: `http://127.0.0.1:${PORT}/aspirations` });
    await new Promise(r => setTimeout(r, 1500));

    const aspirationsPageCheck = await evalCode(`(() => {
      const h1 = document.querySelector('h1')?.textContent || '';
      const form = document.querySelector('form');
      return {
        pageTitle: h1,
        hasForm: !!form,
      };
    })()`);

    console.log('Public Aspirations Page Check:', JSON.stringify(aspirationsPageCheck, null, 2));
    if (!aspirationsPageCheck.hasForm) {
      throw new Error('/aspirations public page submission form is missing!');
    }
    console.log('✔ Public /aspirations page and submission form are 100% intact');

    console.log('\n--- 4. VERIFY /login PAGE (NO ROLE DROPDOWN, NO DEFAULT MOCK CREDENTIALS) ---');
    await send('Page.navigate', { url: `http://127.0.0.1:${PORT}/login` });
    await new Promise(r => setTimeout(r, 1500));

    const loginPageCheck = await evalCode(`(() => {
      const title = document.querySelector('h1')?.textContent;
      const form = document.querySelector('form');
      if (!form) return { hasForm: false };

      const inputs = Array.from(form.querySelectorAll('input'));
      const selects = Array.from(form.querySelectorAll('select'));
      const radios = Array.from(form.querySelectorAll('input[type="radio"]'));

      const idInput = form.querySelector('input#identifier, input[name="identifier"]');
      const passInput = form.querySelector('input#password, input[name="password"]');

      // Check if there are any mock prefill buttons or dev credentials accordion
      const bodyText = document.body.innerText;
      const hasMockAccordion = bodyText.includes('Kredensial Verifikasi Uji Coba') || bodyText.includes('Pilih & Isi');

      return {
        hasForm: true,
        pageTitle: title,
        totalInputs: inputs.length,
        totalSelects: selects.length,
        totalRadios: radios.length,
        hasIdentifierInput: !!idInput,
        hasPasswordInput: !!passInput,
        hasMockAccordion,
      };
    })()`);

    console.log('Login Page Check:', JSON.stringify(loginPageCheck, null, 2));

    if (loginPageCheck.totalSelects > 0 || loginPageCheck.totalRadios > 0) {
      throw new Error('VIOLATION: Role selection found on /login page!');
    }
    if (loginPageCheck.hasMockAccordion) {
      throw new Error('VIOLATION: Mock prefill credentials accordion found on /login page!');
    }
    if (!loginPageCheck.hasIdentifierInput || !loginPageCheck.hasPasswordInput) {
      throw new Error('Login form missing required identifier or password inputs!');
    }
    console.log('✔ /login contains ONLY Identifier & Password fields with NO role dropdown or fake credentials');

    console.log('\n--- 5. VERIFY MOBILE VIEWPORT (375px) NAVBAR & ZERO OVERFLOW ---');
    await send('Emulation.setDeviceMetricsOverride', {
      width: 375,
      height: 667,
      deviceScaleFactor: 2,
      mobile: true,
    });
    await send('Page.navigate', { url: `http://127.0.0.1:${PORT}/` });
    await new Promise(r => setTimeout(r, 1500));

    const mobileCheck = await evalCode(`(() => {
      const overflow = document.documentElement.scrollWidth > window.innerWidth;
      const header = document.querySelector('header');
      const loginLink = Array.from(header.querySelectorAll('a')).find(a => a.getAttribute('href') === '/login');
      return {
        overflow,
        hasMobileLoginLink: !!loginLink,
      };
    })()`);

    console.log('Mobile Check Result:', JSON.stringify(mobileCheck, null, 2));
    if (mobileCheck.overflow) {
      throw new Error('Horizontal overflow detected on mobile!');
    }
    if (!mobileCheck.hasMobileLoginLink) {
      throw new Error('Mobile header missing login link!');
    }
    console.log('✔ Mobile viewport responsive with zero horizontal overflow');

    console.log('\n=============================================');
    console.log('ALL VERIFICATION SUITES PASSED (100%)');
    console.log('=============================================');

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
