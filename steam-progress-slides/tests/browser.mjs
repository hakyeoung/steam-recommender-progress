// Dependency-free Chromium DevTools smoke test on a project-prefixed static server.
import {createServer} from 'node:http';
import {readFile,writeFile,mkdir,mkdtemp,rm} from 'node:fs/promises';
import {resolve,extname,sep,join} from 'node:path';
import {tmpdir} from 'node:os';
import {spawn} from 'node:child_process';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
const root=fileURLToPath(new URL('../dist/',import.meta.url));
const artifacts=fileURLToPath(new URL('./artifacts/',import.meta.url));
const prefix=process.env.SITE_PREFIX || '/steam-project/';
const types={'.js':'text/javascript; charset=utf-8','.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.mjs':'text/javascript; charset=utf-8','.json':'application/json; charset=utf-8','.md':'text/plain; charset=utf-8','.csv':'text/csv; charset=utf-8'};
const server=createServer(async(req,res)=>{
  try{
    const url=new URL(req.url,'http://localhost');
    if(!url.pathname.startsWith(prefix)){res.writeHead(404).end();return;}
    let path=resolve(root,decodeURIComponent(url.pathname.slice(prefix.length))||'index.html');
    if(!path.startsWith(resolve(root)+sep)&&path!==resolve(root)){res.writeHead(403).end();return;}
    if(url.pathname.endsWith('/'))path=join(path,'index.html');
    const body=await readFile(path);res.writeHead(200,{'Content-Type':types[extname(path)]||'application/octet-stream'}).end(body);
  }catch{res.writeHead(404).end();}
});
await new Promise(r=>server.listen(0,'127.0.0.1',r));
const origin=process.env.SITE_ORIGIN || `http://127.0.0.1:${server.address().port}`;
const demo=origin+prefix+'demo/index.html';
const profile=await mkdtemp(join(tmpdir(),'steam-evidence-browser-'));
const browser=process.env.CHROME_PATH||'C:/Program Files/Google/Chrome/Application/chrome.exe';
const child=spawn(browser,['--headless=new','--disable-gpu','--no-first-run','--no-default-browser-check','--remote-debugging-port=0',`--user-data-dir=${profile}`,'about:blank'],{windowsHide:true,stdio:'ignore'});
let socket;let id=0;const pending=new Map();const checks=[];const errors=[];let lastError;
const delay=ms=>new Promise(r=>setTimeout(r,ms));
async function eventually(fn,timeout=20000){const start=Date.now();while(Date.now()-start<timeout){try{if(await fn())return;}catch(e){lastError=e;}await delay(100);}throw new Error('Timed out: '+(lastError?.message||fn.toString()));}
function send(method,params={}){return new Promise((resolve,reject)=>{const n=++id;pending.set(n,{resolve,reject});socket.send(JSON.stringify({id:n,method,params}));});}
async function js(expression){const r=await send('Runtime.evaluate',{expression,awaitPromise:true,returnByValue:true});if(r.exceptionDetails)throw new Error(JSON.stringify(r.exceptionDetails));return r.result.value;}
async function click(selector){assert.ok(await js(`!!document.querySelector(${JSON.stringify(selector)})`),selector);await js(`document.querySelector(${JSON.stringify(selector)}).click()`);}
async function ready(){await eventually(()=>js(`!!document.querySelector('#game-name') && document.querySelector('#game-name').textContent.includes('Isaac')`));}
async function shot(name){const r=await send('Page.captureScreenshot',{format:'png',captureBeyondViewport:false});await writeFile(join(artifacts,name+'.png'),Buffer.from(r.data,'base64'));}
function pass(name){checks.push(name);process.stdout.write('PASS '+name+'\n');}
try{
  let port;
  child.on('error',e=>{lastError=e;});
  await eventually(async()=>{const lines=(await readFile(join(profile,'DevToolsActivePort'),'utf8')).split('\n');port=Number(lines[0]);return port>0;});
  const targets=await (await fetch(`http://127.0.0.1:${port}/json/list`)).json();
  const target=targets.find(t=>t.type==='page');
  socket=new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((r,j)=>{socket.addEventListener('open',r,{once:true});socket.addEventListener('error',j,{once:true});});
  socket.addEventListener('message',e=>{const m=JSON.parse(e.data);if(m.id){const p=pending.get(m.id);pending.delete(m.id);if(m.error)p.reject(new Error(m.error.message));else p.resolve(m.result);}else if(m.method==='Runtime.exceptionThrown')errors.push(m.params.exceptionDetails.text);});
  await send('Page.enable');await send('Runtime.enable');await send('Emulation.setDeviceMetricsOverride',{width:1440,height:1080,deviceScaleFactor:1,mobile:false});
  await mkdir(artifacts,{recursive:true});
  await send('Page.navigate',{url:demo});await ready();
  assert.match(await js(`document.querySelector('#content').textContent`),/78/);assert.match(await js(`document.querySelector('#content').textContent`),/36/);pass('real JSON loaded on project-prefixed static path');
  await shot('01-inventory');
  await click('[data-action="source"]');await eventually(()=>js(`document.querySelector('dialog').open && document.querySelector('.integrity').textContent.includes('일치')`));
  assert.ok(await js(`document.querySelector('#source-content a').href.startsWith('https://')`));pass('source modal, original URL and browser SHA-256 check');await click('#close-dialog');
  await click('[data-view="search"]');await click('[data-id="passive item"]');
  const first=await js(`document.querySelector('.result').dataset.paragraph`);
  await click('[data-id="effect stacking"]');const second=await js(`document.querySelector('.result').dataset.paragraph`);assert.notEqual(first,second);pass('different query produces different actual top result');await shot('02-search');
  await js(`document.querySelector('#query').value='zzzzunfindabletokenzzzz'; document.querySelector('#search-form').requestSubmit()`);
  assert.equal(await js(`document.querySelectorAll('.result').length`),0);assert.match(await js(`document.querySelector('#search-results').textContent`),/일치하는 문단이 없습니다/);pass('no-match does not generate results');
  await js(`document.querySelector('#scope').value='wiki';document.querySelector('#scope').dispatchEvent(new Event('change'))`);
  assert.equal(await js(`document.querySelectorAll('.result').length`),0);assert.match(await js(`document.querySelector('#search-results').textContent`),/수집된 문서가 없습니다/);pass('missing wiki source is explicitly empty');
  await click('[data-action="compare"]');await eventually(()=>js(`document.querySelector('#comparison').textContent.includes('52 / 52')`));pass('all 52 Python/JavaScript comparisons also pass in browser');
  await click('[data-view="quality"]');assert.match(await js(`document.querySelector('#content').textContent`),/17/);await shot('03-quality-missing');
  await click('[data-id="false"]');assert.match(await js(`document.querySelector('.case-reason').textContent`),/검색 목적과 무관/);
  const audited=await js(`document.querySelector('.result').dataset.paragraph`);
  const auditedRank=await js(`Number(document.querySelector('.rank-number').textContent.replace('#',''))`);await shot('04-quality-false-positive');
  await click('[data-action="audit-search"]');assert.equal(await js(`document.querySelectorAll('.result')[${auditedRank-1}].dataset.paragraph`),audited);pass('audited false positive reproduces at its recorded rank via actual search');
  await click('[data-game="1145360"]');assert.equal(await js(`document.querySelector('#game-name').textContent`),'Hades');
  await click('[data-view="inventory"]');assert.match(await js(`document.querySelector('#content').textContent`),/42/);assert.match(await js(`document.querySelector('#content').textContent`),/51/);pass('game switch loads Hades counts and corpus');
  await click('[data-view="quality"]');await click('[data-id="version"]');assert.match(await js(`document.querySelector('#content').textContent`),/Early Access/);pass('version mixing examples and original evidence available');
  await click('[data-view="status"]');assert.match(await js(`document.querySelector('#content').textContent`),/33개通過|33개 통과/);assert.match(await js(`document.querySelector('#content').textContent`),/미실행/);await shot('05-status');pass('Mock record and unexecuted API status separated');
  await send('Page.navigate',{url:origin+prefix+'progress/index.html#slide-7'});
  await eventually(()=>js(`!document.querySelectorAll('.slide')[6].hidden`));
  assert.equal(await js(`document.querySelectorAll('iframe').length`),0);
  assert.match(await js(`document.querySelector('#title-7').textContent`),/근거 확보와 검색의 한계/);
  assert.equal(await js(`document.querySelectorAll('.findings-table tbody tr').length`),2);
  assert.match(await js(`document.querySelector('.findings-caveat').textContent`),/전체 검색 정확도나 재현율을 의미하지 않습니다/);
  await shot('06-experiment-findings');pass('findings replaces iframe with scoped evidence inclusion results');
  await click('#next');assert.equal(await js(`document.querySelectorAll('.slide')[7].hidden`),false);pass('presentation next button reaches slide 8');
  await send('Emulation.setDeviceMetricsOverride',{width:1600,height:900,deviceScaleFactor:1,mobile:false});
  for(let n=1;n<=8;n++){
    await js(`location.hash='#slide-${n}'`);
    await eventually(()=>js(`!document.querySelectorAll('.slide')[${n-1}].hidden`));
    await delay(350);
    await shot(`slide-${n}`);
    assert.equal(await js(`document.querySelectorAll('.slide')[${n-1}].scrollHeight <= document.querySelectorAll('.slide')[${n-1}].clientHeight+1`),true,`slide ${n} content fits`);
    assert.equal(await js(`document.querySelector('.slide-scroll').scrollHeight <= document.querySelector('.slide-scroll').clientHeight+1`),true,`slide ${n} container fits`);
  }
  assert.equal(await js(`getComputedStyle(document.documentElement).color`),'rgb(230, 237, 244)');
  pass('all 8 desktop slides fit the 16:9 canvas with correct base contrast');
  await js(`location.hash='#slide-6'`);await eventually(()=>js(`!document.querySelectorAll('.slide')[5].hidden`));
  await send('Input.dispatchKeyEvent',{type:'keyDown',key:'ArrowRight',code:'ArrowRight',windowsVirtualKeyCode:39});
  await eventually(()=>js(`!document.querySelectorAll('.slide')[6].hidden`));pass('keyboard navigation reaches experiment findings');
  await click('#notes-toggle');assert.equal(await js(`document.querySelector('#notes').hidden`),false);await click('#notes-close');pass('presenter notes toggle');
  await click('#fullscreen');await eventually(()=>js(`!!document.fullscreenElement`));await js(`document.exitFullscreen()`);pass('fullscreen enters and exits');
  await send('Emulation.setDeviceMetricsOverride',{width:390,height:844,deviceScaleFactor:1,mobile:true});
  for(let n=1;n<=8;n++) {await js(`location.hash='#slide-${n}'`);await eventually(()=>js(`!document.querySelectorAll('.slide')[${n-1}].hidden`));assert.equal(await js(`document.documentElement.scrollWidth <= innerWidth`),true,`mobile slide ${n} fits width`);assert.deepEqual(await js(`[...document.querySelectorAll('.slide:not([hidden]) h1,.slide:not([hidden]) h3,.slide:not([hidden]) p,.slide:not([hidden]) li,.slide:not([hidden]) td')].filter(e=>e.scrollWidth>e.clientWidth+1).map(e=>e.textContent)`),[],`mobile slide ${n} text fits`);}
  await js(`location.hash='#slide-7'`);await eventually(()=>js(`!document.querySelectorAll('.slide')[6].hidden`));await delay(350);await shot('08-mobile-presentation');
  await js(`document.querySelector('.slide-scroll').scrollTop=document.querySelector('.slide-scroll').scrollHeight`);
  assert.equal(await js(`document.querySelector('.findings-caveat').getBoundingClientRect().bottom <= document.querySelector('.slide-scroll').getBoundingClientRect().bottom+1`),true,'mobile findings disclaimer is reachable');
  await shot('09-mobile-findings-results');pass('all 8 mobile slides fit text and findings results remain reachable by scrolling');
  await send('Emulation.setDeviceMetricsOverride',{width:390,height:844,deviceScaleFactor:1,mobile:true});await send('Page.navigate',{url:demo});await ready();
  assert.equal(await js(`document.documentElement.scrollWidth <= innerWidth`),true);await shot('07-mobile');pass('390px responsive layout has no horizontal overflow');
  // Failure scenario: real 404, no fallback data. Independent new document.
  const injection=await send('Page.addScriptToEvaluateOnNewDocument',{source:`const realFetch=window.fetch;window.fetch=(url,...args)=>String(url).includes('corpus.json')?Promise.resolve(new Response('',{status:404})):realFetch(url,...args);`});
  await send('Page.navigate',{url:demo});await eventually(()=>js(`!!document.querySelector('.load-error')`));assert.equal(await js(`document.querySelectorAll('.result').length`),0);pass('JSON HTTP failure displays explicit error without fallback');
  await send('Page.removeScriptToEvaluateOnNewDocument',{identifier:injection.identifier});
  await send('Page.addScriptToEvaluateOnNewDocument',{source:`window.fetch=()=>Promise.resolve(new Response('{}',{status:200,headers:{'Content-Type':'application/json'}}));`});
  await send('Page.navigate',{url:demo});await eventually(()=>js(`!!document.querySelector('.load-error')`));pass('malformed JSON schema displays explicit error');
  assert.deepEqual(errors,[]);pass('no browser JavaScript exceptions');
  await writeFile(join(artifacts,'browser-results.json'),JSON.stringify({checks,errors,static_prefix:prefix,screenshots:17},null,2)+'\n');
  process.stdout.write(`${checks.length} browser checks passed.\n`);
}finally{
  if(socket?.readyState===1){try{await send('Browser.close');}catch{}socket.close();}
  child.kill();server.closeAllConnections();await new Promise(r=>server.close(r));
  // Delete only the exact uniquely-created temporary browser profile.
  await delay(400);await rm(profile,{recursive:true,force:true,maxRetries:5,retryDelay:200}).catch(()=>{});
}
