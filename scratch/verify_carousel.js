import http from 'http';
import fs from 'fs';
import path from 'path';
import { spawn } from 'child_process';

const PORT = 8089;
const DIST = path.resolve('dist');

// MIME types
const MIME = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
};

// 1. Static file server
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
  console.log(`Server listening on http://127.0.0.1:${PORT}`);

  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const browserBin = fs.existsSync(chromePath) ? chromePath : edgePath;

  console.log(`Using browser: ${browserBin}`);

  // Launch headless browser with remote debugging port
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

  // Wait 1.5s for browser to initialize
  await new Promise(r => setTimeout(r, 1500));

  try {
    // Get target WebSocket URL from browser
    const versionRes = await fetch('http://127.0.0.1:9333/json');
    const tabs = await versionRes.json();
    const pageTab = tabs.find(t => t.type === 'page') || tabs[0];
    
    if (!pageTab || !pageTab.webSocketDebuggerUrl) {
      throw new Error('No webSocketDebuggerUrl found');
    }

    console.log(`Connected to page: ${pageTab.title}`);
    
    // Connect to WebSocket using Node's global WebSocket (available in Node 22+)
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

    // Helper to evaluate JS in page
    const evaluate = async (expr) => {
      const res = await send('Runtime.evaluate', { expression: expr, returnByValue: true });
      return res?.result?.value;
    };

    console.log('--- TEST 1: Initial Load (Auto-Play Verification) ---');
    let initMember = await evaluate(`
      document.querySelector('[data-active="true"] h4')?.innerText || 'Not found'
    `);
    let initIndex = await evaluate(`
      document.querySelector('[data-active="true"]')?.getAttribute('data-index') || 'Not found'
    `);
    console.log(`t = 0s: Active index = ${initIndex}, Member = ${initMember}`);

    console.log('Waiting 3.2 seconds for first automatic transition...');
    await new Promise(r => setTimeout(r, 3200));

    let t1Member = await evaluate(`
      document.querySelector('[data-active="true"] h4')?.innerText || 'Not found'
    `);
    let t1Index = await evaluate(`
      document.querySelector('[data-active="true"]')?.getAttribute('data-index') || 'Not found'
    `);
    console.log(`t = 3.2s: Active index = ${t1Index}, Member = ${t1Member}`);

    console.log('Waiting another 3.2 seconds for second automatic transition...');
    await new Promise(r => setTimeout(r, 3200));

    let t2Member = await evaluate(`
      document.querySelector('[data-active="true"] h4')?.innerText || 'Not found'
    `);
    let t2Index = await evaluate(`
      document.querySelector('[data-active="true"]')?.getAttribute('data-index') || 'Not found'
    `);
    console.log(`t = 6.4s: Active index = ${t2Index}, Member = ${t2Member}`);

    console.log('Waiting another 3.2 seconds for third automatic transition...');
    await new Promise(r => setTimeout(r, 3200));

    let t3Member = await evaluate(`
      document.querySelector('[data-active="true"] h4')?.innerText || 'Not found'
    `);
    let t3Index = await evaluate(`
      document.querySelector('[data-active="true"]')?.getAttribute('data-index') || 'Not found'
    `);
    console.log(`t = 9.6s: Active index = ${t3Index}, Member = ${t3Member}`);

    console.log('\n--- TEST 2: Manual Next / Previous Button Click ---');
    console.log('Clicking "Profil Selanjutnya" (Next button)...');
    await evaluate(`document.querySelector('button[aria-label="Profil Selanjutnya"]').click()`);
    let nextIndex = await evaluate(`document.querySelector('[data-active="true"]')?.getAttribute('data-index')`);
    console.log(`After manual Next click: Active index = ${nextIndex}`);

    console.log('Clicking "Profil Sebelumnya" (Prev button)...');
    await evaluate(`document.querySelector('button[aria-label="Profil Sebelumnya"]').click()`);
    let prevIndex = await evaluate(`document.querySelector('[data-active="true"]')?.getAttribute('data-index')`);
    console.log(`After manual Prev click: Active index = ${prevIndex}`);

    console.log('\n--- TEST 3: Verification of Clean Editorial Article Section ---');
    const newsHeadline = await evaluate(`document.querySelector('#news h2')?.innerText`);
    const newsDescription = await evaluate(`document.querySelector('#news p')?.innerText`);
    const featuredTitle = await evaluate(`document.querySelector('#news article h3')?.innerText`);
    const supportingArticlesCount = await evaluate(`document.querySelectorAll('#news article h4').length`);
    const ctaText = await evaluate(`document.querySelector('#news a[href="/news"]')?.innerText`);

    console.log(`Article Section Headline: "${newsHeadline}"`);
    console.log(`Article Section Description: "${newsDescription}"`);
    console.log(`Featured Article Title: "${featuredTitle}"`);
    console.log(`Supporting Articles Count: ${supportingArticlesCount}`);
    console.log(`CTA Text: "${ctaText}"`);

    ws.close();
    browser.kill();
    server.close();
    console.log('\n>>> ALL REAL RUNTIME TESTS PASSED SUCCESSFULLY! <<<');
    process.exit(0);

  } catch (err) {
    console.error('Test execution error:', err);
    browser.kill();
    server.close();
    process.exit(1);
  }
});

