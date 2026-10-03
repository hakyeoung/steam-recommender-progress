import { useEffect, useRef, useState } from 'react';
import { Icon, slides, slideComponents } from './slides.jsx';

function indexFromHash() {
  const match = window.location.hash.match(/^#slide-([1-6])$/);
  return match ? Number(match[1]) - 1 : 0;
}

export default function App() {
  const [index, setIndex] = useState(indexFromHash);
  const slideContainer = useRef(null);
  const slide = slides[index];
  const SlideContent = slideComponents[index];

  function goTo(nextIndex) {
    const target = Math.max(0, Math.min(slides.length - 1, nextIndex));
    setIndex(target);
    const hash = `#slide-${target + 1}`;
    if (window.location.hash !== hash) window.location.hash = hash;
  }

  useEffect(() => {
    function onHashChange() { setIndex(indexFromHash()); }
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  useEffect(() => {
    function onKeyDown(event) {
      if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey || event.target.closest('input, textarea, select, [contenteditable="true"]')) return;
      if ((event.key === ' ' || event.key === 'Enter') && event.target.closest('button, a')) return;
      const next = ['ArrowRight', 'ArrowDown', 'PageDown', ' '].includes(event.key);
      const previous = ['ArrowLeft', 'ArrowUp', 'PageUp'].includes(event.key);
      if (next || previous || event.key === 'Home' || event.key === 'End') {
        event.preventDefault();
        goTo(event.key === 'Home' ? 0 : event.key === 'End' ? slides.length - 1 : index + (next ? 1 : -1));
      }
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [index]);

  useEffect(() => {
    document.title = `${index + 1}. ${slides[index].title} · Steam Recommender`;
    slideContainer.current?.scrollTo({ top: 0 });
  }, [index]);

  return <div className="app-shell">
    <a className="skip-link" href="#presentation" onClick={(event) => { event.preventDefault(); document.getElementById('presentation')?.focus(); }}>슬라이드 본문으로 이동</a>
    <aside className="sidebar">
      <a className="brand" href="#slide-1" aria-label="Steam Recommender 첫 슬라이드"><div className="brand-mark"><Icon name="game" size={26} /></div><div>STEAM<span>RECOMMENDER</span></div></a>
      <div className="sidebar-caption">PERSONAL PROJECT</div>
      <nav className="slide-nav" aria-label="슬라이드 목차">
        {slides.map((item, itemIndex) => <div className="nav-item" key={item.title}>
          {(itemIndex === 1 || itemIndex === 4) && <div className="nav-group">{itemIndex === 1 ? '09 / 9월 진행상황' : '10 / 10월 계획'}</div>}
          <button type="button" onClick={() => goTo(itemIndex)} className={`nav-button ${index === itemIndex ? 'active' : ''}`} aria-current={index === itemIndex ? 'step' : undefined} aria-label={`${itemIndex + 1}번 슬라이드: ${item.title}`}><Icon name={item.icon} size={18} /><span>{item.short}</span><span className="nav-number">{String(itemIndex + 1).padStart(2, '0')}</span></button>
        </div>)}
      </nav>
      <div className="sidebar-footer"><span className="live-dot" /> SEPTEMBER → OCTOBER<p>실험하고, 연결하고, 개선하기.</p><span className="sidebar-tech">REACT + VITE / WEB SLIDES</span></div>
    </aside>
    <main id="presentation" className="presentation" tabIndex={-1}>
      <header className="topbar"><span>PROJECT JOURNAL <span className="topbar-divider">/</span> 진행 보고</span><div className={`month-badge ${slide.month === 'october' ? 'october' : ''}`}><span className="tiny-dot" />{slide.month === 'october' ? '10월 계획' : slide.month === 'september' ? '9월 진행' : '9월 → 10월'}</div></header>
      <div className="slide-scroll" ref={slideContainer}>
        <section className={`slide slide-${index + 1}`} key={index} aria-labelledby="slide-title">
          {index !== 0 && <div className="slide-heading"><div className="eyebrow">{slide.label}</div><h1 id="slide-title">{slide.title}</h1><p>{slide.description}</p></div>}
          {index === 0 && <h2 id="slide-title" className="sr-only">프로젝트 소개: Steam 기반 개인 게임 추천 서비스</h2>}
          <SlideContent />
        </section>
      </div>
      <footer className="controls">
        <div className="keyboard-hint"><kbd>←</kbd><kbd>→</kbd><span>슬라이드 이동</span></div>
        <div className="pagination" aria-label="슬라이드 선택">{slides.map((item, itemIndex) => <button key={item.title} onClick={() => goTo(itemIndex)} className={index === itemIndex ? 'current' : ''} aria-label={`${itemIndex + 1}번 슬라이드로 이동: ${item.title}`} aria-current={index === itemIndex ? 'step' : undefined} />)}</div>
        <div className="page-controls"><span className="page-count" role="status" aria-live="polite" aria-atomic="true"><strong>{String(index + 1).padStart(2, '0')}</strong><span> / 06</span><span className="sr-only"> {slide.title}</span></span><button className="arrow-button previous" onClick={() => goTo(index - 1)} disabled={index === 0} aria-label="이전 슬라이드"><Icon name="arrow" size={19} /></button><button className="arrow-button next" onClick={() => goTo(index + 1)} disabled={index === slides.length - 1} aria-label="다음 슬라이드"><Icon name="arrow" size={19} /></button></div>
      </footer>
      <div className="progress-track" aria-hidden="true"><div style={{ width: `${((index + 1) / slides.length) * 100}%` }} /></div>
    </main>
  </div>;
}
