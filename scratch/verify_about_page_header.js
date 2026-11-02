import http from 'http';
import fs from 'fs';
import path from 'path';
import { spawn } from 'child_process';

const PORT = 8094;
const DIST = path.resolve('dist');

const MIME = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
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
  console.log(`Server running at http://127.0.0.1:${PORT}`);

  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const browserBin = fs.existsSync(chromePath) ? chromePath : edgePath;

  console.log(`Launching headless browser: ${browserBin}`);

  const browser = spawn(browserBin, [
    '--headless=new',
    '--disable-gpu',
    '--remote-debugging-port=9335',
    `http://127.0.0.1:${PORT}/about`
  ]);

  browser.on('error', (err) => {
    console.error('Browser launch error:', err);
    server.close();
    process.exit(1);
  });

  await new Promise(r => setTimeout(r, 1500));

  try {
    const versionRes = await fetch('http://127.0.0.1:9335/json');
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
    console.log('--- TEST 1: Inspect AboutPage Header (Desktop 1280px) ---');
    console.log('======================================================');

    await send('Emulation.setDeviceMetricsOverride', {
      width: 1280,
      height: 800,
      deviceScaleFactor: 1,
      mobile: false,
    });

    // Wait for route to render
    await new Promise(r => setTimeout(r, 600));

    const aboutPageInfo = await evaluate(`
      (() => {
        const header = document.querySelector('section.bg-brand-navy');
        if (!header) return { error: 'No header section found in AboutPage' };
        
        const eyebrow = header.querySelector('.tracking-\\\\[0\\\\.25em\\\\]');
        const headline = header.querySelector('h1');
        const yellowAccent = headline ? headline.querySelector('.text-brand-yellow') : null;
        const descParagraphs = Array.from(header.querySelectorAll('.lg\\\\:border-l p')).map(p => p.textContent.trim());
        const hasLegacyBadge = !!header.querySelector('.bg-brand-yellow\\\\/20.rounded-full');
        const svgCurve = header.querySelector('svg[viewBox*="1440"]');

        const docWidth = document.documentElement.offsetWidth;
        const scrollWidth = document.documentElement.scrollWidth;

        return {
          currentUrl: window.location.pathname,
          eyebrowText: eyebrow ? eyebrow.textContent.trim() : null,
          headlineText: headline ? headline.innerText.trim() : null,
          accentWord: yellowAccent ? yellowAccent.textContent.trim() : null,
          descParagraphs,
          hasLegacyBadge,
          hasOrganicCurve: !!svgCurve,
          docWidth,
          scrollWidth,
          hasOverflow: scrollWidth > docWidth
        };
      })()
    `);

    console.log('Current URL Path:', aboutPageInfo.currentUrl);
    console.log('Eyebrow Text:', aboutPageInfo.eyebrowText);
    console.log('Headline Text:\n' + aboutPageInfo.headlineText);
    console.log('Accent Word:', aboutPageInfo.accentWord);
    console.log('Descriptions Count:', aboutPageInfo.descParagraphs?.length);
    console.log('Has Legacy Pill Badge:', aboutPageInfo.hasLegacyBadge);
    console.log('Has Organic Curve Transition:', aboutPageInfo.hasOrganicCurve);
    console.log(`Desktop Overflow: ${aboutPageInfo.hasOverflow ? 'FAIL (Overflow)' : 'PASS (No overflow)'}`);

    console.log('\n======================================================');
    console.log('--- TEST 2: Inspect AboutPage Header (Mobile 375px) ---');
    console.log('======================================================');

    await send('Emulation.setDeviceMetricsOverride', {
      width: 375,
      height: 667,
      deviceScaleFactor: 2,
      mobile: true,
    });

    await new Promise(r => setTimeout(r, 500));

    const mobileInfo = await evaluate(`
      (() => {
        const docWidth = document.documentElement.offsetWidth;
        const scrollWidth = document.documentElement.scrollWidth;
        const headline = document.querySelector('section.bg-brand-navy h1');
        const headlineRect = headline ? headline.getBoundingClientRect() : null;
        return {
          docWidth,
          scrollWidth,
          hasOverflow: scrollWidth > docWidth,
          headlineWidth: headlineRect ? headlineRect.width : null
        };
      })()
    `);

    console.log(`Mobile Doc Width: ${mobileInfo.docWidth}px, Scroll Width: ${mobileInfo.scrollWidth}px`);
    console.log(`Mobile Headline Width: ${mobileInfo.headlineWidth}px`);
    console.log(`Mobile Overflow Check: ${mobileInfo.hasOverflow ? 'FAIL (Overflow)' : 'PASS (No overflow)'}`);

    ws.close();
    browser.kill();
    server.close();
    console.log('\n>>> ABOUTPAGE HEADER REFINEMENT VERIFICATION COMPLETE! <<<');
    process.exit(0);

  } catch (err) {
    console.error('Test execution error:', err);
    browser.kill();
    server.close();
    process.exit(1);
  }
});
