const $ = s => document.querySelector(s);
const slides = [...document.querySelectorAll('.slide')];
const notes = [
  '목표는 사용자가 좋아할 게임을 효율적으로 찾게 하는 것입니다. 기존 추천을 구현하고 실제 계정에 적용한 뒤, 장르·태그만으로 설명하기 어려운 플레이 경험에 관심을 옮겼습니다. 추천 개선 효과는 아직 검증 전입니다.',
  '근거: run_real_user.py의 nearest_users(), recommend(), 이진 실사용자 벡터 구성과 run_experiment_v2.py의 load_positive(), split_interactions(). 플레이 시간은 0보다 큰지로만 구분하며 User-KNN 입력에 시간 크기를 가중하지 않습니다. 학습 사용자의 긍정 리뷰 게임을 유사도로 가중 합산하고 이미 보유한 게임을 제외합니다.',
  '세 사례는 발표자가 제공한 친구 테스트 관찰입니다. 표본 수, 만족도 또는 정확도 측정값이 없습니다. 이 관찰만으로 특정 장르 추천의 원인이나 개선 효과를 확정하지 않습니다.',
  '이 게임 쌍은 어떤 특징을 분석할지 정하는 동기입니다. 게임의 우열이나 전체 규칙을 확정한 비교가 아닙니다. User-KNN은 후보를 생성하고, 세부 특징으로 재정렬하는 방향을 제안합니다. 아직 통합 구현·사용자 검증은 하지 않았습니다.',
  'README.md의 데이터 소스 A/B/C 정의입니다. A는 상점 짧은+상세 설명, B는 위키+공식 문서, C는 정확히 동일한 B 문단+리뷰입니다. 위키는 확보하지 못해 현재 B/C에 빠져 있습니다. 후속 DIRECT/RETRIEVED 비교는 별도의 실험이며 이 A/B/C와 혼동하지 않습니다. 사람의 원문 검증이 남았습니다.',
  'DATA_QUALITY_REPORT.md quality-004 기록: Isaac 공지 78건 중 관련 설명 15건, 확인 근거 문단 17개 중 B 포함 5개. Hades 42건 중 17건, 19문단 중 4개. 관련 공지와 근거 문단은 단위가 다릅니다. 테스트 33개는 기존 Mock 검증 기록이며 현재 전체 테스트의 실행 개수로 주장하지 않습니다. 최신 실험에는 별도 문서 묶음의 DIRECT/RETRIEVED 점검도 있으나 동일한 분모가 아니므로 합치지 않습니다.',
  '상점 설명에는 세부 시스템 정보가 부족한 경우가 많고 전문 위키는 자동 수집 허용 여부 및 접근 제한을 확인해야 합니다. 검색은 관련 근거를 누락하거나 무관한 문서를 포함하며 버전·DLC가 섞일 수 있습니다. quality-004에서 확인한 근거 문단 Isaac 17개 중 기존 B 입력 포함 5개, Hades 19개 중 4개입니다. 막대는 이 제한된 점검 집합만 표현하며 전체 검색 정확도·재현율이 아닙니다. 원문 확보와 검색 개선 후 실제 LLM 추출을 검증해야 합니다.',
  '위키 접근 제한으로 핵심 문서를 확보하지 못했습니다. 공지에는 버전·DLC·Early Access 규칙이 섞이고 단어 기반 검색은 문맥을 이해하지 못합니다. 자료를 보강하고 실제 LLM 추출을 수행한 뒤 정확도·커버리지와 추천 효과를 각각 검증할 계획입니다.'
];
let index = 0;
slides.forEach((slide, i) => {
  const nav = document.createElement('button'); nav.className = 'nav-button'; nav.textContent = `${String(i + 1).padStart(2, '0')}  ${slide.dataset.title}`; nav.addEventListener('click', () => go(i)); $('#nav').append(nav);
  const dot = document.createElement('button'); dot.setAttribute('aria-label', `${i + 1}번 ${slide.dataset.title}`); dot.addEventListener('click', () => go(i)); $('#dots').append(dot);
});
function hashIndex() { const n = Number(location.hash.match(/^#slide-(\d+)$/)?.[1] || 1); return Math.max(0, Math.min(slides.length - 1, n - 1)); }
function render() {
  slides.forEach((slide, i) => slide.hidden = i !== index);
  [...$('#nav').children].forEach((b, i) => { b.classList.toggle('active', i === index); if (i === index) b.setAttribute('aria-current', 'step'); else b.removeAttribute('aria-current'); });
  [...$('#dots').children].forEach((b, i) => { b.classList.toggle('current', i === index); b.setAttribute('aria-label', `${i + 1}번 ${slides[i].dataset.title}${i === index ? ' (현재)' : ''}`); });
  $('#counter').innerHTML = `<strong>${String(index + 1).padStart(2, '0')}</strong> / 08`;
  $('#previous').disabled = index === 0; $('#next').disabled = index === slides.length - 1;
  $('#progress').style.width = `${(index + 1) / slides.length * 100}%`;
  $('#notes-title').textContent = `${index + 1}. ${slides[index].dataset.title}`; $('#notes-text').textContent = notes[index];
  document.title = `${index + 1}. ${slides[index].dataset.title} · Steam 개발 진행 보고`;
  $('.slide-scroll').scrollTop = 0;
}
function go(n) { index = Math.max(0, Math.min(slides.length - 1, n)); history.replaceState(null, '', `#slide-${index + 1}`); render(); }
function toggleNotes() { $('#notes').hidden = !$('#notes').hidden; $('#notes-toggle').setAttribute('aria-expanded', String(!$('#notes').hidden)); }
async function fullscreen() { try { if (document.fullscreenElement) await document.exitFullscreen(); else await document.documentElement.requestFullscreen(); } catch { $('#notice').textContent = '전체화면을 시작할 수 없습니다. 브라우저의 F11을 사용하세요.'; } }
function fit() { document.documentElement.style.setProperty('--scale', Math.min(innerWidth / 1600, innerHeight / 900)); }
$('#previous').addEventListener('click', () => go(index - 1)); $('#next').addEventListener('click', () => go(index + 1));
$('#fullscreen').addEventListener('click', fullscreen); $('#notes-toggle').addEventListener('click', toggleNotes); $('#notes-close').addEventListener('click', toggleNotes);
document.addEventListener('fullscreenchange', () => { $('#fullscreen').textContent = document.fullscreenElement ? '전체화면 종료 F' : '전체화면 F'; });
addEventListener('keydown', e => {
  if (e.altKey || e.ctrlKey || e.metaKey || e.target.closest('input,textarea,select,[contenteditable=true]')) return;
  const keys = {ArrowRight:index + 1, ArrowLeft:index - 1, PageDown:index + 1, PageUp:index - 1, Home:0, End:7};
  if (Object.hasOwn(keys, e.key)) { e.preventDefault(); go(keys[e.key]); }
  if (e.key.toLowerCase() === 'f') { e.preventDefault(); fullscreen(); }
  if (e.key.toLowerCase() === 'n') { e.preventDefault(); toggleNotes(); }
  if (e.key === 'Escape' && !$('#notes').hidden) toggleNotes();
});
addEventListener('hashchange', () => { index = hashIndex(); render(); }); addEventListener('resize', fit);
fit(); index = hashIndex(); render();
