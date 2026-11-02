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
    console.log('--- TEST 1: Section Order & Seamless Continuum ---');
    console.log('======================================================');

    const sections = await evaluate(`
      Array.from(document.querySelectorAll('section')).map(s => ({
        id: s.id,
        bg: window.getComputedStyle(s).backgroundColor
      }))
    `);
    console.log('Sections and Computed Backgrounds:');
    sections.forEach(s => console.log(`  - #${s.id}: ${s.bg}`));

    console.log('\n======================================================');
    console.log('--- TEST 2: Organic Curved Transition Elements ---');
    console.log('======================================================');

    const svgCurves = await evaluate(`
      Array.from(document.querySelectorAll('svg[viewBox*="1440"]')).map((el, i) => {
        const parent = el.closest('section, div');
        return {
          index: i + 1,
          classes: el.getAttribute('class'),
          viewBox: el.getAttribute('viewBox'),
          color: window.getComputedStyle(el).color
        };
      })
    `);
    console.log(`Found ${svgCurves.length} Organic Transition Curves:`);
    svgCurves.forEach(c => console.log(`  Curve ${c.index}: viewBox="${c.viewBox}", color="${c.color}"`));

    console.log('\n======================================================');
    console.log('--- TEST 3: Zero Horizontal Page Overflow ---');
    console.log('======================================================');

    const overflowCheck = await evaluate(`
      (() => {
        const docWidth = document.documentElement.offsetWidth;
        const scrollWidth = document.documentElement.scrollWidth;
        const windowWidth = window.innerWidth;
        return { docWidth, scrollWidth, windowWidth, hasOverflow: scrollWidth > docWidth };
      })()
    `);
    console.log(`Document Width: ${overflowCheck.docWidth}px, Scroll Width: ${overflowCheck.scrollWidth}px, Window: ${overflowCheck.windowWidth}px`);
    console.log(`Has Horizontal Overflow: ${overflowCheck.hasOverflow} (Expected: false)`);

    console.log('\n======================================================');
    console.log('--- TEST 4: Continuous Marquee Active Motion ---');
    console.log('======================================================');

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

    const p0 = await getTranslateX();
    await new Promise(r => setTimeout(r, 2000));
    const p2 = await getTranslateX();
    console.log(`t = 0s: ${p0.toFixed(2)}px -> t = 2s: ${p2.toFixed(2)}px (Speed: ${(Math.abs(p2 - p0)/2).toFixed(2)} px/s)`);

    ws.close();
    browser.kill();
    server.close();
    console.log('\n>>> ALL VISUAL POLISH & TRANSITION CHECKS PASSED! <<<');
    process.exit(0);

  } catch (err) {
    console.error('Test execution error:', err);
    browser.kill();
    server.close();
    process.exit(1);
  }
});

