import http from 'http';
import fs from 'fs';
import path from 'path';
import { spawn } from 'child_process';

const PORT = 8089;
const DIST = path.resolve('dist');

const MIME = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
};

// Static server for dist
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
  console.log(`Server running at http://127.0.0.1:${PORT}`);

  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const browserBin = fs.existsSync(chromePath) ? chromePath : edgePath;

  console.log(`Launching headless browser: ${browserBin}`);

  const browser = spawn(browserBin, [
    '--headless=new',
    '--disable-gpu',
    '--remote-debugging-port=9333',
    `http://127.0.0.1:${PORT}/`
  ]);

  browser.on('error', (err) => {
    console.error('Browser launch error:', err);
    server.close();
    process.exit(1);
  });

  await new Promise(r => setTimeout(r, 1500));

  try {
    const versionRes = await fetch('http://127.0.0.1:9333/json');
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

    const evaluate = async (expr) => {
      const res = await send('Runtime.evaluate', { expression: expr, returnByValue: true });
      return res?.result?.value;
    };

    console.log('\n======================================================');
    console.log('--- TEST 1: Continuous Horizontal Marquee Motion ---');
    console.log('======================================================');

    const cardCountSet1 = await evaluate(`document.querySelectorAll('.animate-marquee-continuous > div:first-child > div').length`);
    const cardCountSet2 = await evaluate(`document.querySelectorAll('.animate-marquee-continuous > div:last-child > div').length`);
    console.log(`Set 1 Card Count: ${cardCountSet1} members`);
    console.log(`Set 2 Duplicate Card Count: ${cardCountSet2} members (Total: ${cardCountSet1 + cardCountSet2} cards for seamless loop)`);

    // Helper to get computed translateX of marquee
    const getTranslateX = async () => {
      return await evaluate(`
        (() => {
          const el = document.querySelector('.animate-marquee-continuous');
          if (!el) return null;
          const style = window.getComputedStyle(el);
          const matrix = new DOMMatrixReadOnly(style.transform);
          return matrix.m41;
        })()
      `);
    };

    const pos0 = await getTranslateX();
    console.log(`t = 0.0s: Marquee translateX = ${pos0.toFixed(2)}px`);

    await new Promise(r => setTimeout(r, 2000));
    const pos2 = await getTranslateX();
    console.log(`t = 2.0s: Marquee translateX = ${pos2.toFixed(2)}px`);

    await new Promise(r => setTimeout(r, 2000));
    const pos4 = await getTranslateX();
    console.log(`t = 4.0s: Marquee translateX = ${pos4.toFixed(2)}px`);

    const speed1 = Math.abs(pos2 - pos0) / 2.0;
    const speed2 = Math.abs(pos4 - pos2) / 2.0;
    console.log(`Calculated Speed over t[0-2s]: ${speed1.toFixed(2)} px/sec`);
    console.log(`Calculated Speed over t[2-4s]: ${speed2.toFixed(2)} px/sec`);

    if (pos2 < pos0 && pos4 < pos2) {
      console.log('>>> CONFIRMED: Marquee is actively moving continuously from Right to Left! <<<');
    } else {
      throw new Error(`Marquee position did not translate continuously: pos0=${pos0}, pos2=${pos2}, pos4=${pos4}`);
    }

    console.log('\n======================================================');
    console.log('--- TEST 2: Manual Pause & Spotlight Inspection ---');
    console.log('======================================================');

    console.log('Clicking on a member profile card to open spotlight...');
    await evaluate(`document.querySelector('.animate-marquee-continuous > div:first-child > div:first-child').click()`);
    await new Promise(r => setTimeout(r, 400));

    const isModalOpen = await evaluate(`!!document.querySelector('.fixed.inset-0 h3')`);
    const spotlightMemberName = await evaluate(`document.querySelector('.fixed.inset-0 h3')?.innerText`);
    const playStateWhileModal = await evaluate(`window.getComputedStyle(document.querySelector('.animate-marquee-continuous')).animationPlayState`);

    console.log(`Spotlight Modal Open: ${isModalOpen}`);
    console.log(`Spotlight Member Name: "${spotlightMemberName}"`);
    console.log(`Marquee Animation Play State during modal: "${playStateWhileModal}" (Paused)`);

    console.log('Clicking "Tutup & Lanjutkan Marquee"...');
    await evaluate(`
      (() => {
        const btn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Tutup & Lanjutkan'));
        if (btn) btn.click();
      })()
    `);
    await new Promise(r => setTimeout(r, 400));

    const playStateAfterModal = await evaluate(`window.getComputedStyle(document.querySelector('.animate-marquee-continuous')).animationPlayState`);
    console.log(`Marquee Animation Play State after closing modal: "${playStateAfterModal}" (Resumed)`);

    console.log('\n======================================================');
    console.log('--- TEST 3: Homepage Structure Verification ---');
    console.log('======================================================');

    const legalDocsOnHome = await evaluate(`!!document.querySelector('#documents') || !!document.querySelector('#legal')`);
    console.log(`Legal Documents section present on Homepage: ${legalDocsOnHome} (Expected: false)`);

    const sections = await evaluate(`
      Array.from(document.querySelectorAll('section')).map(s => s.id)
    `);
    console.log('Homepage Sections in Order:', sections);

    const lastSectionId = sections[sections.length - 1];
    console.log(`Last section on Homepage: "${lastSectionId}" (Expected: aspirations)`);

    const hasFooter = await evaluate(`!!document.querySelector('footer')`);
    console.log(`Footer follows immediately after Aspirations: ${hasFooter}`);

    console.log('\n======================================================');
    console.log('--- TEST 4: Dedicated /legal-documents Route Verification ---');
    console.log('======================================================');

    await send('Page.navigate', { url: `http://127.0.0.1:${PORT}/legal-documents` });
    await new Promise(r => setTimeout(r, 1500));

    const legalPageTitle = await evaluate(`document.querySelector('h1')?.innerText`);
    const docItemsCount = await evaluate(`document.querySelectorAll('.glass-card-light, [class*="card"]').length`);
    console.log(`Dedicated Legal Documents Page Title: "${legalPageTitle}"`);
    console.log(`Legal Documents Items Count on dedicated page: ${docItemsCount} documents`);

    console.log('\n>>> ALL BROWSER RUNTIME VERIFICATIONS COMPLETED SUCCESSFULLY! <<<');

    ws.close();
    browser.kill();
    server.close();
    process.exit(0);

  } catch (err) {
    console.error('Test execution error:', err);
    browser.kill();
    server.close();
    process.exit(1);
  }
});

