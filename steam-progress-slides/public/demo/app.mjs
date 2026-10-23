import { rank, terms, validateCorpus } from './search.mjs';

const $ = selector => document.querySelector(selector);
const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const kind = {store:'상점 설명', official:'개발사 공지', review:'기존 리뷰', wiki:'위키'};
const topics = {group_rules:'효과군',retention:'유지·교체',application:'누적·동시 적용',interaction:'상호작용',ordinary_acquisition:'일반 획득',attack_change:'공격 변화'};
const shortDate = value => value ? String(value).slice(0,10) : '미확인';
const labels = {inventory:'수집 자료',search:'근거 검색',quality:'품질 점검',status:'진행 상태'};
let corpus, game = 250900, view = 'inventory', docFilter = 'all', page = 0, qualityMode = 'missing', caseIndex = 0;
let query = 'passive item', scope = 'all', limit = 10, comparison = '';
let searchPerformed = false;
const docs = () => corpus.documents.filter(d => d.game_id === game);
const ps = () => corpus.paragraphs.filter(p => p.game_id === game);
const pool = () => ps().filter(p => scope === 'all' || p.source_type === scope);
const getP = id => corpus.paragraphs.find(p => p.paragraph_id === id);
const getD = id => corpus.documents.find(d => d.document_id === id);
const metric = (label, value, unit, foot) => `<div class="metric"><div class="metric-label">${label}</div><div class="metric-number">${value}<small>${unit}</small></div><div class="metric-foot">${foot}</div></div>`;
const tag = (text, type='neutral') => `<span class="tag ${type}">${esc(text)}</span>`;
const button = (label, action, id='', className='text-button') => `<button class="${className}" data-action="${action}" data-id="${esc(id)}">${esc(label)}</button>`;

function update() {
  const current = corpus.games.find(g => g.id === game);
  $('#games').innerHTML = corpus.games.map((g,i) => `<button class="game-button ${g.id===game?'active':''}" data-game="${g.id}" aria-pressed="${g.id===game}"><span class="game-number">0${i+1}</span><span><b>${g.id===250900?'The Binding of Isaac':'Hades'}</b><small>${g.id===250900?'REBIRTH / APP 250900':'APP 1145360'}</small></span></button>`).join('');
  $('#game-id').textContent = `APP ${game} / COLLECTED CORPUS`;
  $('#game-name').textContent = current.name;
  $('#breadcrumb').textContent = labels[view];
  document.querySelectorAll('[data-view]').forEach(b => b.setAttribute('aria-current', b.dataset.view===view?'page':'false'));
  $('#snapshot').textContent = `감사 스냅샷 ${shortDate(corpus.audit_created_at)} · Mock 결과 제외`;
  $('#content').innerHTML = ({inventory:renderInventory, search:renderSearch, quality:renderQuality, status:renderStatus})[view]();
  if (view==='search') {
    $('#search-form').addEventListener('submit', e => { e.preventDefault(); query=$('#query').value; scope=$('#scope').value; searchPerformed=true; renderResults(); });
    $('#scope').addEventListener('change', () => {query=$('#query').value;scope=$('#scope').value; if(searchPerformed) renderResults();});
    if (searchPerformed) renderResults();
  }
  if (view==='quality') {
    $('#case-select')?.addEventListener('change', e => {caseIndex=Number(e.target.value);update();});
  }
}

function renderInventory() {
  const current=corpus.games.find(g=>g.id===game), count=current.document_counts;
  const filtered=docs().filter(d=>docFilter==='all'||d.source_type===docFilter).sort((a,b)=>(b.collected_at||'').localeCompare(a.collected_at||'')||a.document_id.localeCompare(b.document_id));
  const pages=Math.ceil(filtered.length/8);page=Math.min(page,Math.max(0,pages-1));
  return `<div class="metrics">${metric('STEAM 상점 설명',count.store||0,'건','수집 시점별 스냅샷 포함')}${metric('개발사 공지',count.official||0,'건','한정된 수집 창 · 전체 이력 아님')}${metric('기존 리뷰',count.review||0,'건','기존 CSV에서 읽은 실제 리뷰')}${metric('수집 문단',current.paragraph_count,'개','정규화 후 분할 · 관련성 미보장')}</div>
  <div class="section-title"><h3>수집 문서 보관함</h3><span class="subtle">${filtered.length}개 문서 · 원문 해시 보존</span></div>
  <div class="filters">${['all','store','official','review','wiki'].map(k=>button(k==='all'?'전체':kind[k], 'filter',k,`chip ${docFilter===k?'active':''}`)).join('')}</div>
  ${filtered.length?`<div class="document-list">${filtered.slice(page*8,page*8+8).map(d=>`<div class="document-row">${tag(kind[d.source_type])}<div><div class="document-title">${esc(d.title)}</div><div class="document-meta">수집 ${shortDate(d.collected_at)} · 게시 ${shortDate(d.published_at)} · ${d.paragraph_count}개 문단 · ${esc(d.acquisition_method||'방법 미확인')}</div></div>${button('원문 보기 ↗','source',d.document_id)}</div>`).join('')}</div><div class="pager"><button class="small-button" data-action="prev" ${page===0?'disabled':''}>← 이전</button><span>${page+1} / ${pages}</span><button class="small-button" data-action="next" ${page+1>=pages?'disabled':''}>다음 →</button></div>`:`<div class="empty">${docFilter==='wiki'?'확보된 위키 문서가 없습니다. 수집 정책·접근 제한이 기록되어 있으며 검색 대상에도 포함되지 않습니다.':'이 범위에 수집된 문서가 없습니다.'}</div>`}
  <div class="notice">상점 설명은 게임별 3개 수집 스냅샷이며 별개의 게임 정보 3건을 뜻하지 않습니다. 공지에는 출시 전·업데이트·DLC와 게임 외 소식이 함께 있습니다. 리뷰는 시스템 규칙의 검증된 근거로 간주하지 않습니다. 원본 메타데이터의 버전·DLC 미확인 상태를 그대로 표시합니다.</div>
  <details><summary>자료 출처와 수집 이력 확인</summary><div class="document-list">${corpus.collection_events.filter(e=>e.game_id===game).map(e=>`<div class="document-row">${tag(kind[e.source_type])}<div class="document-meta">${esc(e.at)}<br>${esc(e.status)}${e.documents!==null?' · '+esc(e.documents)+'건':''}<br>${esc(e.reason||'수집 이벤트 기록')}</div>${e.url?`<a href="${esc(e.url)}" target="_blank" rel="noopener noreferrer">출처 ↗</a>`:''}</div>`).join('')}</div></details>`;
}

function renderSearch() {
  return `<form id="search-form" class="search-form"><label for="query">실제 수집 문서에서 근거 문단 검색</label><div class="search-line"><input id="query" type="search" autocomplete="off" value="${esc(query)}" placeholder="예: passive item" aria-describedby="search-help"><button class="primary" type="submit">검색 ↗</button></div><div class="search-options"><label for="scope">검색 범위 <select id="scope">${[['all','전체 수집 자료'],['official','개발사 공지만'],['store','상점 설명만'],['review','기존 리뷰만'],['wiki','위키 (미확보)']].map(([k,v])=>`<option value="${k}" ${scope===k?'selected':''}>${v}</option>`).join('')}</select></label><span class="subtle">BM25 · 제목 + 문단 · 영어 키워드</span></div><div class="examples"><span class="subtle">TRY</span>${['passive item','effect stacking','boon replacement','weapon interaction'].map(q=>`<button type="button" data-action="example" data-id="${q}">${q}</button>`).join('')}</div></form>
  <p id="search-help" class="subtle">현재 게임의 저장된 문서만 검색합니다. 한글·의미 검색, 어간 처리, 동의어 확장은 지원하지 않습니다. 점수는 관련성 확률이나 정확도가 아닙니다.</p>
  <div id="search-results">${searchPerformed?'':'<div class="empty">검색어를 입력하거나 예시를 선택하면 실제 문단의 점수와 순위를 계산합니다.</div>'}</div>
  <details><summary>Python 원본과 JavaScript의 동작 비교</summary><p class="subtle">Python <code>retrieve.rank</code>의 영어 토큰화, BM25(k1=1.2, b=0.75), 중복 검색어 제거, 동점 시 문단 ID 정렬을 옮겼습니다. JS의 부동소수점 덧셈 순서에 따른 미세 오차를 허용합니다(1e-10). 화면은 단일 질의 순위를 보여주며, B 입력을 만드는 4개 질의 순환 선택·중복 제거·32,000자 예산의 <code>select</code>는 실행하지 않습니다. 품질 점검의 B 포함 여부는 기존 감사 산출물을 읽습니다.</p>${button('동일 검색어 52개 조합 비교 실행','compare','','small-button')}<div id="comparison" aria-live="polite">${comparison}</div></details>`;
}

function highlighted(text) {
  const wanted=new Set(terms(query));
  return text.split(/([A-Za-z]+)/).map(part=>wanted.has(part.toLowerCase())?`<mark>${esc(part)}</mark>`:esc(part)).join('');
}

function resultHTML(p, position, score, highlight=false) {
  return `<article class="result" data-paragraph="${esc(p.paragraph_id)}"><div class="result-top"><span class="rank-number">${typeof position==='number'?'#'+String(position).padStart(2,'0'):esc(position)}</span>${tag(kind[p.source_type])}${tag('버전·DLC 현행 여부 미확인','warning')}${score!==null?`<span class="score">BM25 ${Number(score).toFixed(6)}</span>`:''}</div><h3>${esc(p.title)}</h3><p>${highlight?highlighted(p.text):esc(p.text)}</p><div class="document-meta mono">${esc(p.paragraph_id)} · normalized.md L${p.normalized_line_start}–${p.normalized_line_end}<br>게시 ${shortDate(p.published_at)} · version: ${esc(p.game_version)} · DLC: ${esc(p.dlc)}</div><div class="result-bottom"><a href="${esc(p.source_url)}" target="_blank" rel="noopener noreferrer">원문 출처 ↗</a>${button('전체 문맥·해시 확인','paragraph',p.paragraph_id)}</div></article>`;
}

function renderResults() {
  const candidates=pool(), results=rank(candidates,query);
  let html=`<div class="section-title"><h3>검색 결과 <span class="subtle">${results.length}개</span></h3><span class="subtle">${candidates.length}개 문단 대상 · 상위 ${Math.min(limit,results.length)}개 표시</span></div>`;
  if (!candidates.length) html+='<div class="empty">이 범위에는 수집된 문서가 없습니다. 결과를 생성하지 않았습니다.</div>';
  else if (!terms(query).length) html+='<div class="empty">영어 검색어를 입력해 주세요. 현재 검색기는 a–z 토큰만 처리합니다.</div>';
  else if (!results.length) html+='<div class="empty">일치하는 문단이 없습니다. 문서 부족 또는 단어 불일치일 수 있으며, 게임에 해당 기능이 없다는 뜻은 아닙니다.</div>';
  else html+=results.slice(0,limit).map((r,i)=>resultHTML(r.paragraph,i+1,r.score,true)).join('')+(results.length>limit?button('결과 10개 더 보기','more','','small-button'):'');
  $('#search-results').innerHTML=html;
}

function cases() {
  if (qualityMode==='false') return corpus.audit.assessments.filter(a=>Number(a.game_id)===game&&a.scope==='official_only'&&a.agent_judgment==='irrelevant');
  if (qualityMode==='version') return corpus.audit.evidence.filter(e=>e.game_id===game&& (game===250900?/d-d96564ad35c78cf12c9fb419|d-da3b743b0dd4866d6c1774f4/.test(e.document_id):/d-a9550ddd1968393f4458ce4b|d-5f934a20684631f86db898a3/.test(e.document_id)));
  const notSelected=new Set(corpus.audit.rankings.filter(r=>r.game_id===game&&!r.in_existing_B_selection).map(r=>r.paragraph_id));
  return corpus.audit.evidence.filter((e,i,all)=>e.game_id===game&&notSelected.has(e.paragraph_id)&&all.findIndex(x=>x.paragraph_id===e.paragraph_id)===i);
}

function renderQuality() {
  const s=corpus.audit.summary.games.find(g=>g.game_id===game);
  const items=cases();caseIndex=Math.min(caseIndex,Math.max(0,items.length-1));const item=items[caseIndex];
  let caseHTML='<div class="empty">이 범위에 기록된 점검 사례가 없습니다.</div>';
  if(item) {
    const p=getP(item.paragraph_id);
    let context='';
    if(qualityMode==='false') {
      context=`<div class="case-reason"><strong>에이전트 판정: 검색 목적과 무관</strong><br>${esc(item.judgment_reason)}</div><div class="subtle">기존 감사 질의: ${esc(topics[item.query_feature])} · 공식 자료 검색 ${esc(item.rank)}위</div><code class="query-code">${esc(item.query)}</code>${button('이 질의로 실제 검색 재실행','audit-search',item.query_feature,'small-button')}`;
    } else if(qualityMode==='missing') {
      const r=corpus.audit.rankings.find(r=>r.evidence_id===item.evidence_id);
      context=`<div class="case-reason"><strong>근거가 저장되어 있지만 기존 B 입력에 미포함</strong><br>${esc(item.interpretation)}</div><div class="subtle">기존 공식 자료 단일 질의 순위 (최종 B 선택 순위와 다름)</div><div class="filters">${Object.entries(r.rank_by_query).map(([key,n])=>button(`${topics[key]} ${n===null?'미일치':n+'위'}`,'audit-search',key,'chip')).join('')}</div><p class="subtle">기존 B 선택: 4개 질의 순환, 중복 제거, 32,000자 예산. 질의 순위가 높아도 최종 입력에서 빠질 수 있습니다.</p>`;
    } else {
      context=`<div class="case-reason"><strong>게시 당시의 설명 · 현재 버전으로 검증되지 않음</strong><br>${esc(item.interpretation)}</div><p class="subtle">${game===250900?'COMBO BREAKER!에는 OG·Rebirth·Repentance 설명이 함께 있고, Book of Virtues 글은 Repentance 출시 전 설명입니다. 한 문단을 같은 버전의 보편 규칙으로 읽으면 안 됩니다.':'Early Access·정식 출시·업데이트 공지가 같은 코퍼스에 있습니다. 예를 들어 초기 World Smasher 설명과 이후 삭제 공지는 현행 공존 규칙으로 합칠 수 없습니다. 모루의 해머 교체는 핵심 은혜 슬롯 교체의 근거가 아닙니다.'}</p>`;
    }
    caseHTML=`<div class="case-selector"><label for="case-select">기존 품질 점검의 실제 사례 선택 · ${items.length}건</label><select id="case-select">${items.map((e,i)=>`<option value="${i}" ${i===caseIndex?'selected':''}>${esc(getP(e.paragraph_id).title)} · ${qualityMode==='false'?topics[e.query_feature]+' '+e.rank+'위':e.evidence_id}</option>`).join('')}</select>${context}</div>${resultHTML(p,qualityMode==='false'?Number(item.rank):'EVIDENCE',qualityMode==='false'?Number(item.score):null)}`;
  }
  return `<div class="notice"><strong>기존 에이전트 품질 점검 결과입니다.</strong> 독립적인 사람 평가나 전체 검색 재현율·추출 정확도가 아닙니다. 분모는 이 점검에서 선정한 근거 문단이며, 중복 공지의 문단이 포함됩니다. 새 검색어에 기존 판정을 자동 적용하지 않습니다.</div>
  <div class="quality-grid"><div class="quality-card"><div class="metric-label">관련 설명을 확인한 공지</div><div class="big-ratio">${s.qualifying_documents} <span>/ ${s.official_documents}</span></div><div class="bar"><span style="width:${s.qualifying_documents/s.official_documents*100}%"></span></div><p>120건 공지의 제목·키워드 구간을 1차 점검<br>미포함 = 이번 점검에서 근거 미확인</p></div><div class="quality-card"><div class="metric-label">확인한 근거 중 기존 B 입력에 포함</div><div class="big-ratio">${s.known_evidence_paragraphs_selected} <span>/ ${s.known_evidence_paragraphs_total}</span></div><div class="bar"><span style="width:${s.known_evidence_paragraphs_selected/s.known_evidence_paragraphs_total*100}%"></span></div><p>선정한 근거 집합의 입력 포함 수<br>전체 문서의 재현율로 해석할 수 없음</p></div></div>
  <div class="section-title"><h3>문제를 원문에서 확인하기</h3><span class="subtle">AGENT AUDIT · ${shortDate(corpus.audit_created_at)}</span></div>
  <div class="filters quality-tabs">${[['missing','01 검색 누락'],['false','02 오탐'],['version','03 버전 혼합']].map(([k,v])=>button(v,'quality-mode',k,`chip ${qualityMode===k?'active':''}`)).join('')}</div>${caseHTML}
  <div class="report-links"><a href="data/DATA_QUALITY_REPORT.md" target="_blank">기존 품질 보고서 ↗</a><a href="data/audit/search_top3.csv" download>검색 상위 3개 · 72건 CSV ↓</a><a href="data/audit/official_inventory.csv" download>공지 120건 목록 ↓</a><a href="data/audit/retrieval_ranks.json" target="_blank">근거별 순위 JSON ↗</a></div>`;
}

function renderStatus() {
  const rows=[['데이터 수집','일부 완료','상점 설명·개발사 공지·기존 리뷰 확보. 핵심 위키 문서는 미확보.','warning'],['문서 검색','구현 완료 · 개선 필요','실제 문단 BM25 검색 가능. 관련 근거 누락·무관 문서 오탐 확인.','collected'],['구조화된 특징 추출 코드','구현 완료','구조화 출력 코드와 고정 입력·출처 추적 구현. 실제 분석 결과는 없음.','collected'],['Mock 테스트','33개 통과 (기존 기록)','Mock·합성 자료를 이용한 코드 검증 기록. 실제 특징 추출의 정확도 검증이 아님.','neutral'],['OpenAI 실제 특징 추출','미실행','실제 OpenAI 특징 추출 API 호출 0회. 이 데모도 호출 기능을 제공하지 않음.','warning'],['A/B/C 비교 실험','미완료','입력 준비·dry-run·Mock 단계. 실제 추출 결과의 조건별 비교는 미완료.','warning']];
  return `<div class="section-title"><h3>실험 파이프라인의 현재 위치</h3>${tag('실제 LLM 결과 없음','warning')}</div><div class="status-list">${rows.map(([name,status,desc,type],i)=>`<div class="status-row"><span class="step">0${i+1}</span><div><b>${name}</b><p>${desc}</p></div>${tag(status,type)}</div>`).join('')}</div>
  <div class="notice">A = 상점 설명, B = 위키·공식 문서, C = 동일한 B + 리뷰. 위키가 없는 현재 입력은 부분 자료입니다. 이 데모에는 실제 추출된 게임 특징·특징 점수·추천 결과가 없습니다. 기존 Steam User-KNN 알고리즘은 변경하지 않았습니다.</div>
  <h3>이 브라우저에서 실행하는 것</h3><table class="compare-table"><thead><tr><th>단계</th><th>동작 방식</th><th>자료 구분</th></tr></thead><tbody><tr><td>수집 자료 조회</td><td>기존 파일 → 해시 검증 → 정적 JSON</td><td>실제 수집 문서</td></tr><tr><td>근거 검색</td><td>브라우저 JavaScript BM25</td><td>입력어마다 실제 점수 계산</td></tr><tr><td>품질 점검</td><td>quality-004 감사 산출물 조회</td><td>기존 에이전트 판정</td></tr><tr><td>특징 추출·추천</td><td>미실행 / 데모 범위 제외</td><td>결과 미생성</td></tr></tbody></table><p class="status-note">Mock 출력은 웹 JSON에 포함하지 않습니다. Python은 사전 데이터 변환·검증에만 사용하며 GitHub Pages에서는 HTML·CSS·JavaScript·JSON만 제공합니다.</p>`;
}

async function openSource(documentId, paragraphId) {
  const d=getD(documentId);if(!d)return;
  const paragraphs=corpus.paragraphs.filter(p=>p.document_id===documentId).sort((a,b)=>a.ordinal-b.ordinal);
  const fields=[['문서 ID',d.document_id],['자료 종류',`${kind[d.source_type]} · 실제 수집 문서`],['수집 시점',d.collected_at],['게시 시점',d.published_at||'미확인'],['버전 / DLC / 모드',`${d.game_version} / ${d.dlc} / ${d.mode}`],['수집 방법',d.acquisition_method],['원본 SHA-256',d.raw_sha256],['정규화 SHA-256',d.normalized_sha256],['기록된 이용 조건',d.license],['기록된 확보 근거',d.access_basis]];
  $('#source-content').innerHTML=`<h2>${esc(d.title)}</h2><a href="${esc(d.url)}" target="_blank" rel="noopener noreferrer">${esc(d.url)} ↗</a><dl class="source-meta">${fields.map(([key,v])=>`<dt>${esc(key)}</dt><dd>${esc(v)}</dd>`).join('')}</dl><p class="subtle">저장된 정규화 본문 전체입니다. 아래 위치는 로컬 원문의 normalized.md 기준이며 원격 페이지의 행 번호가 아닙니다. 원본 raw.bin 해시는 변환 시 검증합니다.</p>${paragraphs.map(p=>`<section id="source-${esc(p.paragraph_id)}" class="source-paragraph ${p.paragraph_id===paragraphId?'focus':''}"><div class="mono">${esc(p.paragraph_id)} · L${p.normalized_line_start}–${p.normalized_line_end}</div><pre>${esc(p.text)}</pre><div class="integrity" data-hash-id="${esc(p.paragraph_id)}">문단 SHA-256 검증 중…</div></section>`).join('')}`;
  $('#source-dialog').showModal();
  if(paragraphId) document.getElementById(`source-${paragraphId}`)?.scrollIntoView({block:'center'});
  for(const p of paragraphs){
    const target=[...document.querySelectorAll('[data-hash-id]')].find(e=>e.dataset.hashId===p.paragraph_id);
    if(!target)continue;
    if(!globalThis.crypto?.subtle){target.textContent='문단 해시 검증은 HTTPS 또는 localhost에서 지원됩니다.';continue;}
    const bytes=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(p.text));
    const hash=[...new Uint8Array(bytes)].map(b=>b.toString(16).padStart(2,'0')).join('');
    target.textContent=hash===p.text_sha256?'✓ 문단 SHA-256 일치': '문단 SHA-256 불일치 — 데이터 재생성 필요';
    if(hash!==p.text_sha256)target.classList.add('error');
  }
}

async function compare() {
  $('#comparison').textContent='Python 고정 결과와 JS 실제 계산을 비교 중…';
  try {
    const response=await fetch('data/python-rankings.json');if(!response.ok)throw new Error(`HTTP ${response.status}`);
    const {fixtures}=await response.json();
    let failures=0,maxError=0;
    const rows=fixtures.map(f=>{
      const candidates=corpus.paragraphs.filter(p=>p.game_id===f.game_id&&(f.scope==='all'||p.source_type===f.scope));
      const actual=rank(candidates,f.query);
      let ok=actual.length===f.results.length;
      actual.forEach((r,i)=>{const expected=f.results[i]; const err=expected?Math.abs(r.score-expected.score):Infinity;maxError=Math.max(maxError,err);if(!expected||r.paragraph.paragraph_id!==expected.paragraph_id||err>1e-10)ok=false;});
      if(!ok)failures++;
      return `<tr><td>${f.game_id===250900?'Isaac':'Hades'} / ${f.scope}</td><td>${esc(f.query||'(빈 질의)')}</td><td>${actual.length}</td><td class="${ok?'ok':'error'}">${ok?'순위·점수 일치':'불일치'}</td></tr>`;
    });
    comparison=`<div class="notice"><strong>${fixtures.length-failures} / ${fixtures.length}개 조합 통과</strong> · 모든 반환 문단 ID·순위·점수 비교 · 최대 점수 차이 ${maxError.toExponential(2)}<br>점검 6개 질의 + 예시 4개 + 빈 질의·불일치·한글 × 2게임 × 2검색 범위. 사전 Python 결과는 비교에만 사용하며 검색 결과 표시에 사용하지 않습니다.</div><table class="compare-table"><thead><tr><th>게임 / 범위</th><th>동일 검색어</th><th>결과 수</th><th>비교</th></tr></thead><tbody>${rows.join('')}</tbody></table>`;
    $('#comparison').innerHTML=comparison;
  }catch(error){$('#comparison').textContent=`비교 파일을 읽지 못했습니다: ${error.message}. 비교 성공으로 처리하지 않았습니다.`;}
}

document.addEventListener('click', e=>{
  const gameButton=e.target.closest('[data-game]');
  if(gameButton&&corpus){game=Number(gameButton.dataset.game);page=0;caseIndex=0;limit=10;update();return;}
  const tab=e.target.closest('[data-view]');if(tab&&corpus){view=tab.dataset.view;update();return;}
  const b=e.target.closest('[data-action]');if(!b||!corpus)return;
  const id=b.dataset.id;
  switch(b.dataset.action){
    case 'filter':docFilter=id;page=0;update();break;
    case 'prev':page--;update();break;
    case 'next':page++;update();break;
    case 'source':openSource(id);break;
    case 'paragraph':openSource(getP(id).document_id,id);break;
    case 'example':query=id;searchPerformed=true;limit=10;update();break;
    case 'more':limit+=10;renderResults();break;
    case 'quality-mode':qualityMode=id;caseIndex=0;update();break;
    case 'audit-search':query=corpus.queries[id];scope='official';searchPerformed=true;view='search';limit=10;update();break;
    case 'compare':compare();break;
  }
});
$('#close-dialog').addEventListener('click',()=>$('#source-dialog').close());
try {
  const response=await fetch('data/corpus.json');
  if(!response.ok)throw new Error(`수집 데이터 HTTP ${response.status}`);
  corpus=validateCorpus(await response.json());
  const params=new URLSearchParams(location.search);
  if(params.get('embed')==='1')document.body.classList.add('embedded');
  if(corpus.games.some(g=>String(g.id)===params.get('game')))game=Number(params.get('game'));
  if(labels[params.get('view')])view=params.get('view');
  if(params.has('q')){query=params.get('q');searchPerformed=true;view='search';}
  update();
}catch(error){
  $('#content').innerHTML=`<div class="empty error load-error"><h3>수집 데이터를 읽을 수 없습니다</h3><p>${esc(error.message)}</p><p>대체·Mock 결과를 생성하지 않았습니다. HTTP 정적 서버에서 열고 data/corpus.json 배치를 확인해 주세요.</p><button class="small-button" onclick="location.reload()">다시 읽기</button></div>`;
  $('#game-name').textContent='데이터 로드 실패';$('#snapshot').textContent='실제 데이터 미확인';
}
