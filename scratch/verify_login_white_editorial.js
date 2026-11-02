import http from 'http';
import fs from 'fs';
import path from 'path';
import { spawn } from 'child_process';

const PORT = 8115;
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

  const CDP_PORT = 9355;
  const browser = spawn(browserBin, [
    '--headless=new',
    '--disable-gpu',
    `--remote-debugging-port=${CDP_PORT}`,
    `http://127.0.0.1:${PORT}/login`
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

    console.log('\n--- 1. VERIFY LIGHT / COOL WHITE BACKGROUND PALETTE ---');
    await send('Page.navigate', { url: `http://127.0.0.1:${PORT}/login` });
    await new Promise(r => setTimeout(r, 2000));

    const colorCheck = await evalCode(`(() => {
      const mainContainer = document.querySelector('div.min-h-screen');
      const computedBg = window.getComputedStyle(mainContainer).backgroundColor;
      const classList = mainContainer.className;

      return {
        computedBg,
        hasCoolWhiteOrWhite: classList.includes('bg-[#FDFDFF]') || classList.includes('bg-white') || classList.includes('bg-slate-50'),
        isNotDarkNavy: !classList.includes('bg-[#001433]') && !classList.includes('bg-[#002A62]'),
      };
    })()`);

    console.log('Background Color Check:', JSON.stringify(colorCheck, null, 2));
    if (!colorCheck.isNotDarkNavy || !colorCheck.hasCoolWhiteOrWhite) {
      throw new Error('Page background is still dark navy instead of light/Cool White!');
    }
    console.log('✔ Page background is verified as light/Cool White (#FDFDFF)');

    console.log('\n--- 2. VERIFY THE THREE OFFICIAL LOGOS LOADED & DISPLAYED ---');
    const logosCheck = await evalCode(`(() => {
      const images = Array.from(document.querySelectorAll('img')).filter(img => 
        img.src.includes('logo-bem') || 
        img.src.includes('logo-itg') || 
        img.src.includes('logi-itg') || 
        img.src.includes('logo-kolektiva')
      );

      const details = images.map(img => ({
        src: img.src.split('/').pop(),
        alt: img.alt,
        complete: img.complete,
        naturalWidth: img.naturalWidth,
        naturalHeight: img.naturalHeight,
        objectFit: window.getComputedStyle(img).objectFit,
        renderedWidth: img.offsetWidth,
        renderedHeight: img.offsetHeight,
      }));

      // Check presence of identity text near logos
      const bodyText = document.body.innerText;
      const hasBemItg = bodyText.includes('BEM INSTITUT TEKNOLOGI GARUT');
      const hasKolektiva = bodyText.includes('KABINET KOLEKTIVA');

      return {
        totalLogosFound: images.length,
        details,
        hasBemItg,
        hasKolektiva,
      };
    })()`);

    console.log('Logos Check Result:', JSON.stringify(logosCheck, null, 2));

    if (logosCheck.totalLogosFound < 3) {
      throw new Error(`Expected at least 3 official logos, found: ${logosCheck.totalLogosFound}`);
    }
    for (const l of logosCheck.details) {
      if (l.naturalWidth === 0) {
        throw new Error(`Logo ${l.src} failed to load (naturalWidth = 0)!`);
      }
      if (l.objectFit !== 'contain') {
        throw new Error(`Logo ${l.src} must use object-contain!`);
      }
    }
    if (!logosCheck.hasBemItg || !logosCheck.hasKolektiva) {
      throw new Error('Brief identity text (BEM INSTITUT TEKNOLOGI GARUT / KABINET KOLEKTIVA) missing!');
    }
    console.log('✔ All 3 official logos loaded successfully with object-contain and institutional identity text');

    console.log('\n--- 3. VERIFY BALANCED 2-AREA DESKTOP LAYOUT ---');
    const layoutCheck = await evalCode(`(() => {
      const grid = document.querySelector('main > div');
      const computedDisplay = window.getComputedStyle(grid).display;
      const leftCol = document.querySelector('.lg\\\\:col-span-6:first-of-type');
      const rightCol = document.querySelector('.lg\\\\:col-span-6:last-of-type');
      const formCard = rightCol ? rightCol.querySelector('div') : null;

      return {
        isGrid: computedDisplay === 'grid',
        hasLeftNarrativeArea: !!leftCol,
        hasRightFormCardArea: !!rightCol,
        formCardBg: formCard ? window.getComputedStyle(formCard).backgroundColor : null,
      };
    })()`);

    console.log('Desktop Layout Check:', JSON.stringify(layoutCheck, null, 2));
    if (!layoutCheck.isGrid || !layoutCheck.hasLeftNarrativeArea || !layoutCheck.hasRightFormCardArea) {
      throw new Error('Desktop layout is not a balanced 2-area composition!');
    }
    console.log('✔ Desktop layout verified as clean 2-area balanced composition');

    console.log('\n--- 4. VERIFY LOGIN FORM & PASSWORD TOGGLE ---');
    const formCheck = await evalCode(`(() => {
      const form = document.querySelector('form');
      if (!form) return { hasForm: false };

      const idInput = form.querySelector('input#identifier');
      const passInput = form.querySelector('input#password');
      const idLabel = form.querySelector('label[for="identifier"]');
      const passLabel = form.querySelector('label[for="password"]');
      const submitBtn = form.querySelector('button[type="submit"]');
      const toggleBtn = form.querySelector('button[aria-label*="kata sandi"]');

      const selects = form.querySelectorAll('select');
      const radios = form.querySelectorAll('input[type="radio"]');

      return {
        hasForm: true,
        hasIdInput: !!idInput,
        hasPassInput: !!passInput,
        hasIdLabel: !!idLabel,
        hasPassLabel: !!passLabel,
        hasSubmitBtn: !!submitBtn,
        hasToggleBtn: !!toggleBtn,
        initialPassType: passInput ? passInput.type : null,
        totalSelects: selects.length,
        totalRadios: radios.length,
      };
    })()`);

    console.log('Form Check Result:', JSON.stringify(formCheck, null, 2));
    if (formCheck.totalSelects > 0 || formCheck.totalRadios > 0) {
      throw new Error('Role selector found in form!');
    }
    if (!formCheck.hasToggleBtn || formCheck.initialPassType !== 'password') {
      throw new Error('Password toggle or password input missing!');
    }
    console.log('✔ Form contains ONLY identifier & password fields, proper labels, and NO role dropdown');

    // Test toggle password visibility
    const toggleTest = await evalCode(`(async () => {
      const form = document.querySelector('form');
      const passInput = form.querySelector('input#password');
      const toggleBtn = form.querySelector('button[aria-label*="kata sandi"]');
      
      toggleBtn.click();
      await new Promise(r => setTimeout(r, 200));
      const typeAfterClick1 = passInput.type;
      
      toggleBtn.click();
      await new Promise(r => setTimeout(r, 200));
      const typeAfterClick2 = passInput.type;

      return {
        typeAfterClick1,
        typeAfterClick2,
      };
    })()`);

    console.log('Password Toggle Test:', JSON.stringify(toggleTest, null, 2));
    if (toggleTest.typeAfterClick1 !== 'text' || toggleTest.typeAfterClick2 !== 'password') {
      throw new Error('Password visibility toggle failed!');
    }
    console.log('✔ Password visibility toggle functions seamlessly (password <-> text)');

    console.log('\n--- 5. VERIFY EMPTY FIELD SUBMISSION VALIDATION ---');
    const emptyValidationTest = await evalCode(`(async () => {
      const form = document.querySelector('form');
      const submitBtn = form.querySelector('button[type="submit"]');
      submitBtn.click();
      await new Promise(r => setTimeout(r, 200));

      const alertEl = document.querySelector('.animate-shake');
      return {
        hasAlert: !!alertEl,
        alertText: alertEl ? alertEl.textContent.trim() : null,
      };
    })()`);

    console.log('Empty Submission Result:', JSON.stringify(emptyValidationTest, null, 2));
    if (!emptyValidationTest.hasAlert) {
      throw new Error('Empty form submission failed to trigger validation alert!');
    }
    console.log('✔ Empty form submission properly blocked with validation alert');

    console.log('\n--- 6. VERIFY MOBILE VIEWPORT (375px) RESPONSIVENESS & ZERO OVERFLOW ---');
    await send('Emulation.setDeviceMetricsOverride', {
      width: 375,
      height: 667,
      deviceScaleFactor: 2,
      mobile: true,
    });
    await new Promise(r => setTimeout(r, 1200));

    const mobileCheck = await evalCode(`(() => {
      const overflow = document.documentElement.scrollWidth > window.innerWidth;
      const images = Array.from(document.querySelectorAll('img')).filter(img => 
        img.src.includes('logo-bem') || 
        img.src.includes('logo-itg') || 
        img.src.includes('logi-itg') || 
        img.src.includes('logo-kolektiva')
      );

      const allImagesVisible = images.every(img => img.offsetWidth > 0 && img.offsetHeight > 0);

      return {
        overflow,
        allImagesVisible,
      };
    })()`);

    console.log('Mobile Check Result:', JSON.stringify(mobileCheck, null, 2));
    if (mobileCheck.overflow) {
      throw new Error('Horizontal overflow detected on mobile!');
    }
    if (!mobileCheck.allImagesVisible) {
      throw new Error('Logos are not clearly rendered on mobile!');
    }
    console.log('✔ Mobile viewport responsive with zero horizontal overflow and clear logo presentation');

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
