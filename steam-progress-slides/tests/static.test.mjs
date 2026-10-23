import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFile, access} from 'node:fs/promises';
import {createHash} from 'node:crypto';
const publicRoot = new URL('../public/', import.meta.url);
test('all presentation and demo static references resolve within the published site', async () => {
  for (const file of ['progress/index.html','demo/index.html','progress/sources.md','demo/data/DATA_QUALITY_REPORT.md']) {
    const url = new URL(file, publicRoot), text = await readFile(url, 'utf8');
    const links = file.endsWith('.html') ? [...text.matchAll(/(?:href|src|data-src)="([^"]+)"/g)].map(m=>m[1]) : [...text.matchAll(/\[[^\]]+\]\(([^)]+)\)/g)].map(m=>m[1]);
    for (const link of links) {
      if (/^(https?:|#)/.test(link)) continue;
      const target = new URL(link.replaceAll('&amp;','&'), url); target.hash='';target.search='';
      // Existing React entry is generated at build time; its input is repository index.html.
      if (target.href === new URL('index.html', publicRoot).href) await access(new URL('../index.html',import.meta.url));
      else { assert.ok(target.href.startsWith(publicRoot.href),`${file}: ${link} stays under site root`); await access(target); }
    }
  }
});
test('bundled demo files match their recorded hashes and original search/corpus snapshot', async () => {
  const manifest = JSON.parse(await readFile(new URL('progress/demo-manifest.json',publicRoot),'utf8'));
  for (const entry of manifest.files) {
    const data = await readFile(new URL(`demo/${entry.path}`,publicRoot));
    assert.equal(createHash('sha256').update(data).digest('hex'),entry.bundled_sha256,entry.path);
    if (!['index.html','data/DATA_QUALITY_REPORT.md'].includes(entry.path)) assert.equal(entry.bundled_sha256,entry.source_sha256,entry.path);
  }
});
test('deck preserves 8 slides, findings and historical metrics without remote runtime assets', async () => {
  const html=await readFile(new URL('progress/index.html',publicRoot),'utf8');
  assert.equal([...html.matchAll(/<section class="slide(?: findings-slide)?"/g)].length,8);
  assert.doesNotMatch(html,/<iframe|demo-frame|LIVE DEMO/);
  assert.match(html,/실험에서 발견한 문제/);
  assert.match(html,/전체 검색 정확도나 재현율을 의미하지 않습니다/);
  for(const value of ['5 / 17','4 / 19','78','42','33']) assert.ok(html.includes(value));
  const results=html.match(/<section class="slide" id="evidence-results"[\s\S]*?<\/section>/)[0];
  assert.doesNotMatch(results,/기존 B 입력|LLM에 전달된/);
  for(const text of ['확인된 근거 문단','검색으로 선택된 문단','검색에서 누락된 문단','17개','5개','12개','19개','4개','15개','LLM에 제공할 입력으로','전체 검색 시스템의 재현율이나 정확도를 의미하지 않습니다']) assert.ok(results.includes(text),text);
  for(const file of ['progress/index.html','progress/progress.css','progress/legacy.css','progress/progress.mjs','demo/index.html']) {
    const source=await readFile(new URL(file,publicRoot),'utf8');
    assert.doesNotMatch(source,/<(?:script|link|iframe)[^>]*(?:src|href)="https?:/);
    assert.doesNotMatch(source,/@import\s+url/);
  }
});
