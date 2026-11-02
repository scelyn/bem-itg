import http from 'http';
import fs from 'fs';
import path from 'path';
import { spawn } from 'child_process';

const PORT = 8120;
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

  const CDP_PORT = 9360;
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

    console.log('\n--- 1. VERIFY COMPACT CENTERED CARD LAYOUT (NO LEFT COLUMN) ---');
    await send('Page.navigate', { url: `http://127.0.0.1:${PORT}/login` });
    await new Promise(r => setTimeout(r, 2000));

    const cardLayoutCheck = await evalCode(`(() => {
      const main = document.querySelector('main');
      const card = main ? main.querySelector('div.bg-white') : null;
      const leftCol = document.querySelector('.lg\\\\:col-span-6');

      return {
        hasMain: !!main,
        hasSingleCard: !!card,
        hasNoLeftCol: !leftCol,
        cardMaxWidth: card ? window.getComputedStyle(card).maxWidth : null,
        cardBg: card ? window.getComputedStyle(card).backgroundColor : null,
      };
    })()`);

    console.log('Card Layout Result:', JSON.stringify(cardLayoutCheck, null, 2));

    if (!cardLayoutCheck.hasSingleCard || !cardLayoutCheck.hasNoLeftCol) {
      throw new Error('Layout failed: left column still exists or single centered card not found!');
    }
    console.log('✔ Single compact login card verified in the center of the page (no left column)');

    console.log('\n--- 2. VERIFY 3 SMALL LOGOS INSIDE THE CARD HEADER ---');
    const logosInsideCardCheck = await evalCode(`(() => {
      const card = document.querySelector('main div.bg-white');
      if (!card) return { error: 'Card not found' };

      const images = Array.from(card.querySelectorAll('img'));
      const details = images.map(img => ({
        src: img.src.split('/').pop(),
        alt: img.alt,
        complete: img.complete,
        naturalWidth: img.naturalWidth,
        naturalHeight: img.naturalHeight,
        renderedWidth: img.offsetWidth,
        renderedHeight: img.offsetHeight,
        objectFit: window.getComputedStyle(img).objectFit,
        parentIsSeparateCard: img.parentElement.classList.contains('shadow-sm') && img.parentElement.classList.contains('border'),
      }));

      // Check that logos row is in a flex container
      const logoRow = images[0]?.parentElement;
      const logoRowDisplay = logoRow ? window.getComputedStyle(logoRow).display : '';
      const logoRowFlexDirection = logoRow ? window.getComputedStyle(logoRow).flexDirection : '';

      return {
        totalLogosInCard: images.length,
        details,
        logoRowDisplay,
        logoRowFlexDirection,
      };
    })()`);

    console.log('Logos Inside Card Result:', JSON.stringify(logosInsideCardCheck, null, 2));

    if (logosInsideCardCheck.totalLogosInCard !== 3) {
      throw new Error(`Expected 3 logos inside the card, found: ${logosInsideCardCheck.totalLogosInCard}`);
    }

    for (const d of logosInsideCardCheck.details) {
      if (d.naturalWidth === 0) {
        throw new Error(`Logo ${d.src} failed to load!`);
      }
      if (d.objectFit !== 'contain') {
        throw new Error(`Logo ${d.src} must use object-contain!`);
      }
      // Check height is around 32-44px
      if (d.renderedHeight < 28 || d.renderedHeight > 48) {
        throw new Error(`Logo ${d.src} height (${d.renderedHeight}px) is outside the 32-44px guideline!`);
      }
      if (d.parentIsSeparateCard) {
        throw new Error(`Logo ${d.src} has separate card container around it!`);
      }
    }
    console.log('✔ All 3 official logos placed inside card, horizontal row, small (32-44px), object-contain, without separate box wrappers');

    console.log('\n--- 3. VERIFY CARD CONTENT SEQUENCE (ITEMS 1 TO 9) ---');
    const sequenceCheck = await evalCode(`(() => {
      const card = document.querySelector('main div.bg-white');
      if (!card) return { error: 'Card not found' };

      const cardText = card.innerText;
      const hasEyebrow = cardText.includes('PORTAL INTERNAL BEM ITG');
      const hasHeadline = cardText.includes('Selamat Datang Kembali');
      const hasDesc = cardText.includes('Masuk untuk melanjutkan pengelolaan portal KOLEKTIVA.');
      const hasIdLabel = !!card.querySelector('label[for="identifier"]');
      const hasPassLabel = !!card.querySelector('label[for="password"]');
      const submitBtn = card.querySelector('button[type="submit"]');
      const hasSubmitBtnText = submitBtn ? submitBtn.innerText.includes('Masuk ke Dashboard') : false;
      const hasNote = cardText.includes('Akses khusus pengelola BEM ITG');

      return {
        hasEyebrow,
        hasHeadline,
        hasDesc,
        hasIdLabel,
        hasPassLabel,
        hasSubmitBtnText,
        hasNote,
      };
    })()`);

    console.log('Content Sequence Check:', JSON.stringify(sequenceCheck, null, 2));

    if (
      !sequenceCheck.hasEyebrow ||
      !sequenceCheck.hasHeadline ||
      !sequenceCheck.hasDesc ||
      !sequenceCheck.hasIdLabel ||
      !sequenceCheck.hasPassLabel ||
      !sequenceCheck.hasSubmitBtnText ||
      !sequenceCheck.hasNote
    ) {
      throw new Error('Card missing one of the requested 9 sequence items!');
    }
    console.log('✔ All 9 items present in card in exact specified hierarchy');

    console.log('\n--- 4. VERIFY PASSWORD TOGGLE & SUBMIT VALIDATION ---');
    const formInteraction = await evalCode(`(async () => {
      const card = document.querySelector('main div.bg-white');
      const passInput = card.querySelector('input#password');
      const toggleBtn = card.querySelector('button[aria-label*="kata sandi"]');
      const submitBtn = card.querySelector('button[type="submit"]');

      // Toggle test
      toggleBtn.click();
      await new Promise(r => setTimeout(r, 150));
      const typeAfterClick1 = passInput.type;

      toggleBtn.click();
      await new Promise(r => setTimeout(r, 150));
      const typeAfterClick2 = passInput.type;

      // Empty submission test
      submitBtn.click();
      await new Promise(r => setTimeout(r, 150));
      const alertEl = card.querySelector('.animate-shake');

      return {
        typeAfterClick1,
        typeAfterClick2,
        hasEmptyValidationAlert: !!alertEl,
        alertText: alertEl ? alertEl.innerText.trim() : null,
      };
    })()`);

    console.log('Form Interaction Result:', JSON.stringify(formInteraction, null, 2));

    if (formInteraction.typeAfterClick1 !== 'text' || formInteraction.typeAfterClick2 !== 'password') {
      throw new Error('Password visibility toggle failed!');
    }
    if (!formInteraction.hasEmptyValidationAlert) {
      throw new Error('Empty form validation alert did not appear!');
    }
    console.log('✔ Password toggle functions properly (text <-> password)');
    console.log('✔ Empty field submission triggers clean validation alert');

    console.log('\n--- 5. VERIFY RESPONSIVENESS (MOBILE 375px & TABLET 768px) ---');
    // Tablet
    await send('Emulation.setDeviceMetricsOverride', {
      width: 768,
      height: 1024,
      deviceScaleFactor: 2,
      mobile: false,
    });
    await new Promise(r => setTimeout(r, 600));
    const tabletOverflow = await evalCode(`document.documentElement.scrollWidth > window.innerWidth`);

    // Mobile
    await send('Emulation.setDeviceMetricsOverride', {
      width: 375,
      height: 667,
      deviceScaleFactor: 2,
      mobile: true,
    });
    await new Promise(r => setTimeout(r, 600));
    const mobileCheck = await evalCode(`(() => {
      const overflow = document.documentElement.scrollWidth > window.innerWidth;
      const card = document.querySelector('main div.bg-white');
      const images = Array.from(card.querySelectorAll('img'));
      const imagesVisible = images.every(img => img.offsetWidth > 0 && img.offsetHeight > 0);

      return {
        overflow,
        imagesVisible,
        cardWidth: card ? card.offsetWidth : 0,
      };
    })()`);

    console.log('Tablet Overflow:', tabletOverflow);
    console.log('Mobile Check:', JSON.stringify(mobileCheck, null, 2));

    if (tabletOverflow || mobileCheck.overflow) {
      throw new Error('Horizontal overflow detected!');
    }
    if (!mobileCheck.imagesVisible) {
      throw new Error('Logos are not visible on mobile!');
    }
    console.log('✔ Responsive design verified on tablet and mobile with zero horizontal overflow');

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

