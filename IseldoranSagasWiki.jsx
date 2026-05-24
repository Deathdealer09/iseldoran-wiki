import { useState, useEffect, useRef } from "react";

// ─── STYLES ──────────────────────────────────────────────────────────────────
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Cinzel+Decorative:wght@400;700;900&family=Cinzel:wght@400;600;700&family=IM+Fell+English:ital@0;1&family=Crimson+Pro:ital,wght@0,300;0,400;0,600;1,300;1,400;1,600&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --void: #07060a; --forge: #0e0c11; --iron: #18151e; --ash: #252030;
    --ember: #3a2c18; --gold: #c9a84c; --gold-bright: #e8c76a; --gold-dim: #7a5e28;
    --gold-pale: rgba(201,168,76,0.08); --rust: #8b3a1e; --rust-bright: #c4522a;
    --blood: #5c1515; --bone: #d4c9b0; --parchment: #e8dfc8; --cream: #f0ead8;
    --smoke: #6b6070; --mist: #9a8fa0; --violet: #4a2d6b; --steel: #3a4a5a;
    --font-display: 'Cinzel Decorative', serif;
    --font-title: 'Cinzel', serif;
    --font-body: 'Crimson Pro', serif;
    --font-lore: 'IM Fell English', serif;
    --tr: 0.3s cubic-bezier(0.4,0,0.2,1);
  }

  html { scroll-behavior: smooth; }
  body {
    background: var(--void); color: var(--bone);
    font-family: var(--font-body); font-size: 18px; line-height: 1.75;
    overflow-x: hidden;
  }
  body::before {
    content:''; position:fixed; inset:0; pointer-events:none; z-index:9999;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");
    opacity:0.5;
  }

  ::-webkit-scrollbar { width:5px; }
  ::-webkit-scrollbar-track { background:var(--void); }
  ::-webkit-scrollbar-thumb { background:var(--gold-dim); border-radius:2px; }

  /* NAV */
  .nav {
    position:fixed; top:0; left:0; right:0; z-index:1000;
    background:linear-gradient(180deg,rgba(7,6,10,0.97) 0%,rgba(7,6,10,0.88) 100%);
    border-bottom:1px solid rgba(201,168,76,0.18); backdrop-filter:blur(14px);
    padding:0 2rem; display:flex; align-items:center; justify-content:space-between;
    height:62px;
  }
  .nav-brand {
    font-family:var(--font-display); font-size:0.72rem; color:var(--gold);
    letter-spacing:0.07em; cursor:pointer; transition:color var(--tr); white-space:nowrap;
  }
  .nav-brand:hover { color:var(--gold-bright); }
  .nav-links { display:flex; gap:0; list-style:none; flex-wrap:wrap; }
  .nav-links button {
    background:none; border:none; color:var(--mist); font-family:var(--font-title);
    font-size:0.56rem; letter-spacing:0.12em; text-transform:uppercase;
    padding:0.45rem 0.65rem; cursor:pointer; transition:color var(--tr); position:relative;
  }
  .nav-links button::after {
    content:''; position:absolute; bottom:2px; left:50%; right:50%;
    height:1px; background:var(--gold); transition:left var(--tr),right var(--tr);
  }
  .nav-links button:hover { color:var(--gold); }
  .nav-links button:hover::after,.nav-links button.active::after { left:0.5rem; right:0.5rem; }
  .nav-links button.active { color:var(--gold-bright); }

  /* HERO */
  .hero {
    min-height:100vh; display:flex; flex-direction:column; align-items:center;
    justify-content:center; position:relative; overflow:hidden; padding:7rem 2rem 5rem;
  }
  .hero-bg {
    position:absolute; inset:0;
    background:
      radial-gradient(ellipse 80% 55% at 50% 105%, rgba(58,44,24,0.65) 0%, transparent 70%),
      radial-gradient(ellipse 45% 35% at 15% 15%, rgba(139,58,30,0.18) 0%, transparent 65%),
      radial-gradient(ellipse 35% 30% at 85% 75%, rgba(74,45,107,0.14) 0%, transparent 60%),
      linear-gradient(180deg,#07060a 0%,#0e0c11 45%,#18151e 100%);
  }
  .hero-grid {
    position:absolute; inset:0;
    background-image:linear-gradient(rgba(201,168,76,0.035) 1px,transparent 1px),
      linear-gradient(90deg,rgba(201,168,76,0.035) 1px,transparent 1px);
    background-size:55px 55px;
    mask-image:radial-gradient(ellipse at center, black 15%, transparent 70%);
  }
  .hero-ring {
    position:absolute; top:50%; left:50%; transform:translate(-50%,-50%);
    width:700px; height:700px; border:1px solid rgba(201,168,76,0.05);
    border-radius:50%; animation:slowRotate 140s linear infinite;
  }
  .hero-ring::before {
    content:''; position:absolute; inset:40px;
    border:1px solid rgba(201,168,76,0.04); border-radius:50%;
    animation:slowRotate 90s linear infinite reverse;
  }
  .hero-ring::after {
    content:''; position:absolute; inset:120px;
    border:1px solid rgba(201,168,76,0.03); border-radius:50%;
    animation:slowRotate 60s linear infinite;
  }
  @keyframes slowRotate { to { transform:translate(-50%,-50%) rotate(360deg); } }
  @keyframes fadeUp { from{opacity:0;transform:translateY(22px)} to{opacity:1;transform:translateY(0)} }
  @keyframes fadeIn { from{opacity:0} to{opacity:1} }
  @keyframes shimmer { 0%,100%{opacity:0.6} 50%{opacity:1} }
  @keyframes pulse { 0%,100%{box-shadow:0 0 12px rgba(201,168,76,0.3)} 50%{box-shadow:0 0 28px rgba(201,168,76,0.6)} }

  .hero-content { position:relative; z-index:1; text-align:center; max-width:960px; }
  .hero-eyebrow {
    font-family:var(--font-title); font-size:0.62rem; letter-spacing:0.45em;
    text-transform:uppercase; color:var(--gold-dim); margin-bottom:1.75rem;
    animation:fadeUp 1s ease 0.2s both; display:block;
  }
  .hero-title {
    font-family:var(--font-display); font-size:clamp(2.4rem,6vw,5.2rem);
    font-weight:900; color:var(--gold); line-height:1.05;
    text-shadow:0 0 80px rgba(201,168,76,0.25),0 4px 40px rgba(0,0,0,0.9);
    letter-spacing:0.04em; margin-bottom:0.6rem; animation:fadeUp 1s ease 0.4s both;
  }
  .hero-sub {
    font-family:var(--font-title); font-size:clamp(0.6rem,1.6vw,0.78rem);
    color:var(--rust-bright); letter-spacing:0.32em; text-transform:uppercase;
    margin-bottom:2.5rem; animation:fadeUp 1s ease 0.55s both;
  }
  .hero-rule {
    display:flex; align-items:center; gap:1rem; justify-content:center;
    margin:0 auto 2.5rem; max-width:500px; animation:fadeUp 1s ease 0.65s both;
  }
  .hero-rule::before,.hero-rule::after {
    content:''; flex:1; height:1px;
    background:linear-gradient(90deg,transparent,var(--gold-dim));
  }
  .hero-rule::after { background:linear-gradient(270deg,transparent,var(--gold-dim)); }
  .hero-gem {
    width:9px; height:9px; background:var(--gold); transform:rotate(45deg);
    box-shadow:0 0 15px var(--gold); animation:pulse 3s ease infinite;
  }
  .hero-lore {
    font-family:var(--font-lore); font-style:italic; font-size:1.08rem;
    color:var(--mist); max-width:680px; margin:0 auto 3.5rem;
    animation:fadeUp 1s ease 0.8s both; line-height:1.8;
  }
  .hero-stats {
    display:flex; gap:2.5rem; justify-content:center; flex-wrap:wrap;
    margin-bottom:3rem; animation:fadeUp 1s ease 0.9s both;
  }
  .hero-stat { text-align:center; }
  .hero-stat-n {
    font-family:var(--font-display); font-size:1.8rem; color:var(--gold);
    display:block; line-height:1;
  }
  .hero-stat-l {
    font-family:var(--font-title); font-size:0.48rem; letter-spacing:0.22em;
    text-transform:uppercase; color:var(--smoke); margin-top:0.3rem;
  }
  .hero-cta {
    display:flex; gap:1rem; justify-content:center; flex-wrap:wrap;
    animation:fadeUp 1s ease 1s both;
  }
  .btn-primary {
    font-family:var(--font-title); font-size:0.66rem; letter-spacing:0.18em;
    text-transform:uppercase; color:var(--void);
    background:linear-gradient(135deg,var(--gold-bright),var(--gold));
    border:none; padding:0.9rem 2.2rem; cursor:pointer; transition:all var(--tr);
    clip-path:polygon(8px 0%,100% 0%,calc(100% - 8px) 100%,0% 100%);
  }
  .btn-primary:hover {
    background:linear-gradient(135deg,#fff5b0,var(--gold-bright));
    transform:translateY(-2px); box-shadow:0 10px 35px rgba(201,168,76,0.45);
  }
  .btn-secondary {
    font-family:var(--font-title); font-size:0.66rem; letter-spacing:0.18em;
    text-transform:uppercase; color:var(--gold); background:transparent;
    border:1px solid var(--gold-dim); padding:0.9rem 2.2rem; cursor:pointer;
    transition:all var(--tr);
    clip-path:polygon(8px 0%,100% 0%,calc(100% - 8px) 100%,0% 100%);
  }
  .btn-secondary:hover {
    border-color:var(--gold); background:rgba(201,168,76,0.09);
    transform:translateY(-2px);
  }

  /* SECTIONS */
  .section { padding:5.5rem 2rem; max-width:1440px; margin:0 auto; }
  .section-header { text-align:center; margin-bottom:4rem; }
  .section-eyebrow {
    font-family:var(--font-title); font-size:0.56rem; letter-spacing:0.48em;
    text-transform:uppercase; color:var(--rust-bright); margin-bottom:1rem; display:block;
  }
  .section-title {
    font-family:var(--font-display); font-size:clamp(1.5rem,3.2vw,2.5rem);
    color:var(--gold); margin-bottom:1.2rem; letter-spacing:0.04em;
  }
  .section-rule { display:flex; align-items:center; gap:1rem; justify-content:center; margin:1rem auto 1.5rem; max-width:400px; }
  .section-rule::before,.section-rule::after { content:''; flex:1; height:1px; background:linear-gradient(90deg,transparent,var(--gold-dim)); }
  .section-rule::after { background:linear-gradient(270deg,transparent,var(--gold-dim)); }
  .section-rule-icon { color:var(--gold-dim); font-size:0.7rem; }
  .section-desc { font-family:var(--font-lore); font-style:italic; color:var(--mist); max-width:680px; margin:0 auto; font-size:0.98rem; }

  /* NOVELS GRID */
  .filter-bar { display:flex; gap:0.5rem; flex-wrap:wrap; margin-bottom:2.5rem; align-items:center; }
  .global-search {
    background:rgba(255,255,255,0.04); border:1px solid rgba(201,168,76,0.2);
    color:var(--bone); font-family:var(--font-body); font-size:0.9rem;
    padding:0.55rem 1rem; outline:none; transition:border-color var(--tr);
    flex:1; min-width:220px; max-width:320px;
  }
  .global-search:focus { border-color:var(--gold-dim); }
  .global-search::placeholder { color:var(--smoke); font-style:italic; }
  .filter-btn {
    font-family:var(--font-title); font-size:0.52rem; letter-spacing:0.14em;
    text-transform:uppercase; color:var(--smoke); background:transparent;
    border:1px solid rgba(201,168,76,0.12); padding:0.45rem 0.9rem;
    cursor:pointer; transition:all var(--tr);
  }
  .filter-btn:hover { border-color:var(--gold-dim); color:var(--gold); }
  .filter-btn.active { background:rgba(201,168,76,0.1); border-color:var(--gold); color:var(--gold-bright); }

  .books-grid {
    display:grid; grid-template-columns:repeat(auto-fill,minmax(200px,1fr));
    gap:1.25rem;
  }
  .book-card {
    background:linear-gradient(160deg,var(--iron) 0%,var(--forge) 100%);
    border:1px solid rgba(201,168,76,0.1); transition:all var(--tr);
    cursor:pointer;
  }
  .book-card:hover {
    border-color:rgba(201,168,76,0.4); transform:translateY(-5px);
    box-shadow:0 16px 50px rgba(0,0,0,0.6),0 0 0 1px rgba(201,168,76,0.15);
  }
  .book-cover {
    position:relative; width:100%; aspect-ratio:2/3; overflow:hidden;
    background:linear-gradient(160deg,var(--ember) 0%,var(--blood) 50%,var(--void) 100%);
  }
  .book-cover-ph {
    width:100%; height:100%; display:flex; flex-direction:column;
    align-items:center; justify-content:center; padding:1.5rem 1rem; text-align:center;
    gap:0.5rem;
  }
  .book-cover-ph-title {
    font-family:var(--font-display); font-size:0.65rem; color:rgba(201,168,76,0.7);
    line-height:1.3; letter-spacing:0.06em;
  }
  .book-cover-ph-icon { font-size:1.4rem; opacity:0.15; }
  .book-num {
    position:absolute; top:0.5rem; left:0.5rem;
    font-family:var(--font-title); font-size:0.48rem; letter-spacing:0.15em;
    color:var(--gold); background:rgba(0,0,0,0.7); padding:0.15rem 0.4rem;
    border:1px solid rgba(201,168,76,0.3);
  }
  .book-series-tag {
    position:absolute; top:0.5rem; right:0.5rem;
    font-family:var(--font-title); font-size:0.44rem; letter-spacing:0.12em;
    text-transform:uppercase; padding:0.15rem 0.4rem;
  }
  .book-series-tag.iseldoran { background:rgba(201,168,76,0.18); color:var(--gold); }
  .book-series-tag.martyrs { background:rgba(74,45,107,0.35); color:#b080e0; }
  .book-series-tag.generalisima { background:rgba(139,58,30,0.3); color:var(--rust-bright); }

  .book-info { padding:0.85rem; }
  .book-title { font-family:var(--font-title); font-size:0.76rem; color:var(--parchment); margin-bottom:0.2rem; line-height:1.3; }
  .book-subtitle-sm { font-family:var(--font-lore); font-style:italic; color:var(--smoke); font-size:0.7rem; margin-bottom:0.4rem; line-height:1.35; }
  .book-words { font-family:var(--font-title); font-size:0.48rem; letter-spacing:0.12em; color:var(--gold-dim); text-transform:uppercase; margin-bottom:0.7rem; }
  .book-excerpt { font-family:var(--font-body); font-size:0.78rem; color:var(--smoke); line-height:1.55; margin-bottom:0.7rem; display:-webkit-box; -webkit-line-clamp:3; -webkit-box-orient:vertical; overflow:hidden; }
  .book-links { display:flex; gap:0.4rem; }
  .book-link {
    font-family:var(--font-title); font-size:0.46rem; letter-spacing:0.12em;
    text-transform:uppercase; padding:0.3rem 0.6rem; border:1px solid;
    cursor:pointer; transition:all var(--tr); background:none; text-decoration:none;
  }
  .book-link.kindle { color:var(--gold); border-color:var(--gold-dim); }
  .book-link.kindle:hover { background:rgba(201,168,76,0.12); }
  .book-link.read { color:var(--rust-bright); border-color:rgba(196,82,42,0.4); }
  .book-link.read:hover { background:rgba(196,82,42,0.1); }

  /* READING MODAL */
  .modal-overlay {
    position:fixed; inset:0; background:rgba(7,6,10,0.93); z-index:2000;
    display:flex; align-items:flex-start; justify-content:center;
    padding:2rem 1rem; overflow-y:auto; animation:fadeIn 0.25s ease;
  }
  .modal {
    background:var(--forge); border:1px solid rgba(201,168,76,0.22);
    max-width:800px; width:100%; animation:fadeUp 0.3s ease;
    position:relative; margin:auto;
  }
  .modal-header {
    background:linear-gradient(135deg,rgba(58,44,24,0.85),rgba(92,21,21,0.5));
    padding:1.75rem 2rem; border-bottom:1px solid rgba(201,168,76,0.15);
    position:relative;
  }
  .modal-tag { font-family:var(--font-title); font-size:0.52rem; letter-spacing:0.38em; text-transform:uppercase; color:var(--gold-dim); margin-bottom:0.5rem; }
  .modal-title { font-family:var(--font-display); font-size:1.45rem; color:var(--gold); letter-spacing:0.04em; line-height:1.2; }
  .modal-subtitle { font-family:var(--font-lore); font-style:italic; color:var(--mist); font-size:0.9rem; margin-top:0.4rem; }
  .modal-close {
    position:absolute; top:1rem; right:1rem; background:none;
    border:1px solid rgba(201,168,76,0.25); color:var(--mist);
    width:32px; height:32px; cursor:pointer; transition:all var(--tr);
    font-size:0.9rem; display:flex; align-items:center; justify-content:center;
  }
  .modal-close:hover { border-color:var(--gold); color:var(--gold); }
  .modal-body { padding:2rem; }
  .modal-reading {
    font-family:var(--font-body); color:var(--bone); line-height:1.85;
    font-size:1rem; max-height:420px; overflow-y:auto; margin-bottom:1.5rem;
    padding-right:0.5rem;
  }
  .modal-reading::-webkit-scrollbar { width:4px; }
  .modal-reading::-webkit-scrollbar-thumb { background:var(--gold-dim); }
  .modal-reading p { margin-bottom:1rem; }
  .modal-reading em { font-style:italic; color:var(--parchment); }
  .modal-reading strong { color:var(--gold); font-weight:600; }
  .modal-quote {
    font-family:var(--font-lore); font-style:italic; color:var(--mist);
    border-left:2px solid var(--gold-dim); padding:0.85rem 1.2rem;
    margin:1.25rem 0; font-size:0.95rem; line-height:1.7;
  }
  .modal-meta {
    display:grid; grid-template-columns:repeat(auto-fit,minmax(140px,1fr));
    gap:1rem; margin-top:1.5rem; padding-top:1.5rem;
    border-top:1px solid rgba(201,168,76,0.1);
  }
  .modal-meta label { font-family:var(--font-title); font-size:0.46rem; letter-spacing:0.22em; text-transform:uppercase; color:var(--gold-dim); display:block; margin-bottom:0.3rem; }
  .modal-meta span { font-family:var(--font-body); color:var(--bone); font-size:0.9rem; }

  /* DISCUSSION */
  .discussion { margin-top:2rem; border-top:1px solid rgba(201,168,76,0.1); padding-top:1.5rem; }
  .discussion-title { font-family:var(--font-title); font-size:0.62rem; letter-spacing:0.22em; text-transform:uppercase; color:var(--gold-dim); margin-bottom:1rem; }
  .discussion-threads { display:flex; flex-direction:column; gap:0.75rem; margin-bottom:1.25rem; }
  .thread {
    background:rgba(255,255,255,0.03); border:1px solid rgba(201,168,76,0.08);
    padding:0.85rem 1rem;
  }
  .thread-author { font-family:var(--font-title); font-size:0.52rem; letter-spacing:0.12em; color:var(--gold); margin-bottom:0.25rem; }
  .thread-text { font-family:var(--font-body); font-size:0.85rem; color:var(--mist); line-height:1.6; }
  .thread-time { font-family:var(--font-title); font-size:0.44rem; color:var(--smoke); letter-spacing:0.1em; margin-top:0.35rem; }
  .thread-input {
    width:100%; background:rgba(255,255,255,0.04); border:1px solid rgba(201,168,76,0.18);
    color:var(--bone); font-family:var(--font-body); font-size:0.9rem; padding:0.7rem 1rem;
    outline:none; resize:vertical; min-height:70px; transition:border-color var(--tr);
  }
  .thread-input:focus { border-color:var(--gold-dim); }
  .thread-input::placeholder { color:var(--smoke); font-style:italic; }
  .thread-submit {
    margin-top:0.5rem; font-family:var(--font-title); font-size:0.54rem;
    letter-spacing:0.14em; text-transform:uppercase; color:var(--void);
    background:var(--gold); border:none; padding:0.55rem 1.4rem; cursor:pointer;
    transition:all var(--tr);
  }
  .thread-submit:hover { background:var(--gold-bright); }

  /* CHARACTERS */
  .portraits-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(160px,1fr)); gap:1rem; }
  .portrait-card {
    background:var(--iron); border:1px solid rgba(201,168,76,0.1);
    overflow:hidden; transition:all var(--tr); cursor:pointer;
  }
  .portrait-card:hover { border-color:rgba(201,168,76,0.35); transform:translateY(-3px); box-shadow:0 10px 30px rgba(0,0,0,0.5); }
  .portrait-ph {
    width:100%; aspect-ratio:3/4;
    background:linear-gradient(160deg,var(--ember) 0%,var(--iron) 60%,var(--void) 100%);
    display:flex; align-items:center; justify-content:center;
    font-size:2.5rem; opacity:0.12; font-family:var(--font-display);
  }
  .portrait-info { padding:0.7rem; }
  .portrait-name { font-family:var(--font-title); font-size:0.65rem; color:var(--parchment); margin-bottom:0.2rem; line-height:1.3; }
  .portrait-epithet { font-family:var(--font-lore); font-style:italic; font-size:0.62rem; color:var(--gold-dim); line-height:1.3; }
  .portrait-era { font-family:var(--font-title); font-size:0.44rem; letter-spacing:0.1em; color:var(--smoke); margin-top:0.25rem; }

  /* LORE COMPENDIUM */
  .lore-layout { display:grid; grid-template-columns:220px 1fr; gap:2rem; align-items:start; }
  .lore-sidebar {
    position:sticky; top:82px; background:var(--iron);
    border:1px solid rgba(201,168,76,0.12); overflow:hidden;
  }
  .lore-sidebar-hdr {
    background:linear-gradient(135deg,var(--ember),var(--blood));
    padding:0.8rem 1rem; font-family:var(--font-title); font-size:0.55rem;
    letter-spacing:0.25em; text-transform:uppercase; color:var(--gold);
  }
  .lore-cat-btn {
    display:flex; width:100%; text-align:left; background:none;
    border:none; border-bottom:1px solid rgba(201,168,76,0.06);
    color:var(--mist); font-family:var(--font-body); font-size:0.88rem;
    padding:0.7rem 1rem; cursor:pointer; transition:all var(--tr);
    align-items:center; gap:0.6rem;
  }
  .lore-cat-btn:hover { background:rgba(201,168,76,0.05); color:var(--gold); }
  .lore-cat-btn.active { background:rgba(201,168,76,0.08); color:var(--gold-bright); border-left:2px solid var(--gold); }
  .lore-cat-count {
    margin-left:auto; background:rgba(201,168,76,0.1);
    color:var(--gold-dim); font-family:var(--font-title); font-size:0.48rem;
    letter-spacing:0.1em; padding:0.1rem 0.4rem; border-radius:2px;
  }
  .lore-search {
    width:100%; background:rgba(255,255,255,0.04); border:none;
    border-bottom:1px solid rgba(201,168,76,0.15); color:var(--bone);
    font-family:var(--font-body); font-size:0.88rem; padding:0.65rem 1rem;
    outline:none; transition:border-color var(--tr);
  }
  .lore-search:focus { border-bottom-color:var(--gold-dim); }
  .lore-search::placeholder { color:var(--smoke); font-style:italic; }
  .lore-entries { display:grid; grid-template-columns:repeat(auto-fill,minmax(260px,1fr)); gap:1rem; }
  .lore-entry {
    background:var(--iron); border:1px solid rgba(201,168,76,0.08);
    padding:1.1rem; transition:all var(--tr); cursor:pointer; position:relative;
  }
  .lore-entry::before {
    content:''; position:absolute; left:0; top:0; bottom:0; width:2px;
    background:var(--gold); opacity:0; transition:opacity var(--tr);
  }
  .lore-entry:hover { border-color:rgba(201,168,76,0.28); transform:translateY(-2px); }
  .lore-entry:hover::before { opacity:1; }
  .lore-entry-tag { font-family:var(--font-title); font-size:0.47rem; letter-spacing:0.22em; text-transform:uppercase; color:var(--gold-dim); margin-bottom:0.4rem; }
  .lore-entry-title { font-family:var(--font-title); font-size:0.88rem; color:var(--parchment); margin-bottom:0.5rem; line-height:1.35; }
  .lore-entry-excerpt { font-family:var(--font-lore); font-style:italic; font-size:0.78rem; color:var(--smoke); line-height:1.55; display:-webkit-box; -webkit-line-clamp:3; -webkit-box-orient:vertical; overflow:hidden; }

  /* TIMELINE */
  .timeline { position:relative; padding-left:2.5rem; }
  .timeline::before { content:''; position:absolute; left:0.6rem; top:0; bottom:0; width:1px; background:linear-gradient(180deg,transparent,var(--gold-dim) 10%,var(--gold-dim) 90%,transparent); }
  .tl-era { position:relative; margin-bottom:3rem; }
  .tl-dot { position:absolute; left:-2rem; top:0.5rem; width:12px; height:12px; background:var(--gold); transform:rotate(45deg); box-shadow:0 0 12px rgba(201,168,76,0.5); }
  .tl-era-date { font-family:var(--font-title); font-size:0.52rem; letter-spacing:0.28em; text-transform:uppercase; color:var(--gold-dim); margin-bottom:0.4rem; }
  .tl-era-title { font-family:var(--font-display); font-size:1.05rem; color:var(--gold); margin-bottom:0.5rem; letter-spacing:0.04em; }
  .tl-era-desc { font-family:var(--font-body); color:var(--mist); max-width:680px; line-height:1.7; font-size:0.95rem; margin-bottom:0.75rem; }
  .tl-events { display:flex; flex-direction:column; gap:0.4rem; }
  .tl-event { display:flex; gap:1rem; align-items:baseline; }
  .tl-event-y { font-family:var(--font-title); font-size:0.55rem; color:var(--gold-dim); letter-spacing:0.1em; min-width:70px; flex-shrink:0; }
  .tl-event-t { font-family:var(--font-body); color:var(--bone); font-size:0.88rem; line-height:1.5; }

  /* IXORIA / HOUSES */
  .houses-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(280px,1fr)); gap:1.25rem; }
  .house-card {
    background:var(--iron); border:1px solid rgba(201,168,76,0.1);
    padding:1.5rem; transition:all var(--tr);
  }
  .house-card:hover { border-color:rgba(201,168,76,0.28); box-shadow:0 8px 30px rgba(0,0,0,0.4); }
  .house-name { font-family:var(--font-display); font-size:0.9rem; color:var(--gold); margin-bottom:0.25rem; }
  .house-specialty { font-family:var(--font-title); font-size:0.52rem; letter-spacing:0.18em; text-transform:uppercase; color:var(--rust-bright); margin-bottom:0.6rem; }
  .house-motto { font-family:var(--font-lore); font-style:italic; color:var(--mist); font-size:0.85rem; margin-bottom:0.75rem; border-left:2px solid var(--gold-dim); padding-left:0.75rem; }
  .house-desc { font-family:var(--font-body); color:var(--smoke); font-size:0.85rem; line-height:1.6; }

  /* SOVEREIGNS */
  .sovereign-era { margin-bottom:3rem; }
  .sovereign-era-hdr {
    display:flex; align-items:center; gap:1rem; margin-bottom:1.25rem;
    padding-bottom:0.75rem; border-bottom:1px solid rgba(201,168,76,0.12);
  }
  .sovereign-era-bar { width:3px; height:1.5rem; flex-shrink:0; }
  .sovereign-era-name { font-family:var(--font-display); font-size:0.92rem; color:var(--gold); }
  .sovereign-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(260px,1fr)); gap:0.75rem; }
  .sovereign-card {
    background:var(--iron); border:1px solid rgba(201,168,76,0.08);
    padding:0.9rem 1rem; transition:border-color var(--tr);
  }
  .sovereign-card:hover { border-color:rgba(201,168,76,0.28); }
  .sovereign-name { font-family:var(--font-title); font-size:0.78rem; color:var(--parchment); margin-bottom:0.2rem; }
  .sovereign-epithet { font-family:var(--font-lore); font-style:italic; font-size:0.76rem; margin-bottom:0.35rem; }
  .sovereign-note { font-family:var(--font-body); font-size:0.8rem; color:var(--smoke); line-height:1.5; }

  /* FOOTER */
  .footer {
    background:var(--void); border-top:1px solid rgba(201,168,76,0.1);
    padding:3rem 2rem; text-align:center;
  }
  .footer-brand { font-family:var(--font-display); font-size:0.9rem; color:var(--gold-dim); margin-bottom:0.5rem; }
  .footer-tagline { font-family:var(--font-lore); font-style:italic; color:var(--smoke); font-size:0.9rem; margin-bottom:1.5rem; }
  .footer-links { display:flex; gap:1.5rem; justify-content:center; list-style:none; flex-wrap:wrap; margin-bottom:1.5rem; }
  .footer-links button { background:none; border:none; font-family:var(--font-title); font-size:0.55rem; letter-spacing:0.18em; text-transform:uppercase; color:var(--smoke); cursor:pointer; transition:color var(--tr); }
  .footer-links button:hover { color:var(--gold); }
  .footer-copy { font-family:var(--font-title); font-size:0.5rem; letter-spacing:0.12em; color:rgba(107,96,112,0.5); text-transform:uppercase; }

  /* AUDIO/EBOOK */
  .release-banner {
    background:linear-gradient(135deg,var(--ember),var(--blood),var(--violet));
    border:1px solid rgba(201,168,76,0.25); padding:2rem; text-align:center;
    margin-bottom:3rem;
  }
  .release-banner h3 { font-family:var(--font-display); color:var(--gold); font-size:1.1rem; margin-bottom:0.5rem; }
  .release-banner p { font-family:var(--font-lore); font-style:italic; color:var(--mist); font-size:0.95rem; margin-bottom:1rem; }
  .notify-form { display:flex; gap:0.5rem; justify-content:center; flex-wrap:wrap; }
  .notify-input {
    background:rgba(255,255,255,0.07); border:1px solid rgba(201,168,76,0.25);
    color:var(--bone); font-family:var(--font-body); font-size:0.9rem;
    padding:0.6rem 1rem; outline:none; min-width:240px;
  }
  .notify-input:focus { border-color:var(--gold-dim); }
  .notify-btn {
    font-family:var(--font-title); font-size:0.58rem; letter-spacing:0.16em;
    text-transform:uppercase; color:var(--void); background:var(--gold);
    border:none; padding:0.6rem 1.4rem; cursor:pointer; transition:background var(--tr);
  }
  .notify-btn:hover { background:var(--gold-bright); }

  @media (max-width:900px) {
    .lore-layout { grid-template-columns:1fr; }
    .lore-sidebar { position:static; }
    .nav-links { display:none; }
    .nav-mobile-menu { display:flex; }
  }
  @media (max-width:600px) {
    .books-grid { grid-template-columns:repeat(auto-fill,minmax(155px,1fr)); }
    .portraits-grid { grid-template-columns:repeat(auto-fill,minmax(130px,1fr)); }
  }
`;

// ─── DATA ─────────────────────────────────────────────────────────────────────

const BOOKS = [
  { id:1, title:"No Gods No Masters", sub:"Va Sumir Chronicles · Volume I", words:"45,707", series:"iseldoran",
    excerpt:"The complete account of the reign of Lucius Luceron I. Republican in words. Sovereign in deeds. Raja the Brilliant abolishes monarchy, founds the Universal Republic — and is forced by public pressure to restore the royal title.",
    opening:`The Legion of Tired Gods arrived at Old Terra without announcement and without apology, as was their custom. They came in seventeen ships — none of them military vessels, all of them carrying the kind of damage that accumulates over decades of being in the wrong place at the wrong time. They anchored in the high orbit without filing approach vectors and waited.\n\nThree days passed.\n\nOn the fourth day, Raja the Brilliant sent a single functionary to inquire as to their purpose.\n\nThe functionary did not return.\n\nOn the fifth day, Raja the Brilliant sent himself.\n\nThe meeting lasted eleven hours and changed everything that followed.`,
    quote:'"No gods. No masters. A king, because someone must choose." — The Doctrine of Limitation',
    era:"First Luceron Restoration", status:"Complete" },
  { id:2, title:"The Black Death: Kaelen I", sub:"A Novel of Empire, War, and the Edge of Known Space", words:"88,690", series:"iseldoran",
    excerpt:"Kaelen Pierre von Care — The Living Weapon. Black armour. Green eyes with golden specks. Golden dreadlocks. The God Emperor who bound the empire to himself through personal force. The Luceron Compact, Years 17–57.",
    opening:`The first time my father spoke Kaelen Rainmaker's name to me, the air in the audience chamber smelled of myrrh and warm wax.\n\nIncense smoke curled in pale blue threads toward the coffered ceiling of Nova Constantinople's western hall. Light from the afternoon sun poured through the high windows and struck the mosaic floor so that the gold tesserae glimmered like scales. I stood beside the pillar of Saint Iseldora, fingers laced before me, listening to petitions. Silk brushed my ankles. My pulse moved steady and calm.\n\nMy father dismissed the final supplicant with a lift of two fingers.\n\nThe doors shut with a low thud.\n\nOnly the inner circle remained: Prime Minister Nazzir al-Hapsburgi, two silent Sardukar captains, and me.\n\nMy father did not look at me at first. He looked at the floor. That was the first sign something heavy was coming.\n\nWhen Luceron Pierre von Care looked down, men died or empires shifted.`,
    quote:'"We are the God Emperor. We are your lord. The universe is ours." — Kaelen I, Coronation Declaration',
    era:"First Luceron Restoration", status:"Complete · Tenth Edition" },
  { id:3, title:"The Wedding War", sub:"The War That Made the Twin Thrones", words:"80,437", series:"iseldoran",
    excerpt:"The forward marriage barges are burning. Not the whole convoy — not yet. The failed Red Wedding of Iseldora, the Battle of Mars, and the revelation of the Father's Gift.",
    opening:`The convoy was burning. Not the whole convoy. Not yet. But the forward marriage barges were dying — she could see it from the command deck of the Pale Meridian, the flame reflected in the dark of the port observation window, orange against the absolute black of open space.\n\nIsolde Pierre von Care had placed a fleet projection on the table three months before this moment and told the admiralty exactly which vessels would burn first and why.\n\nThey had thanked her for the analysis and done nothing.\n\nNow she watched the analysis prove itself.`,
    quote:'"The empire is not land. It is continuity." — Isolde Pierre von Care',
    era:"First Luceron Restoration", status:"Complete" },
  { id:4, title:"The Chronicle of Aurelian", sub:"The Beloved · The Murdered Sun", words:"20,507", series:"iseldoran",
    excerpt:"God Emperor Aurelian — The Beloved. Assassinated on Remisión 9 by Respurien von Malfoy, thirteen years old, Yanauikii-trained. The shortest reign in the modern imperial record.",
    opening:`He was called the Beloved, and then he was called the Murdered Sun, and both names were given to him by the same people, which is the most honest thing the empire ever did.\n\nAurelian Pierre von Care ruled for four years, two months, and eleven days. He was twenty-three when he ascended and twenty-seven when he died. In that time he passed seventeen reforms, eliminated four hereditary governorships, and made more enemies than any emperor in living memory — not through cruelty, but through the specific offence of being right.`,
    quote:'"The Beloved. The Murdered Sun. Both names from the same mouths." — Imperial Archive notation',
    era:"First Luceron Restoration", status:"Complete" },
  { id:5, title:"The Soldier Emperors", sub:"Cassander I · Lucius Luceron II · The Schism of Two Flames", words:"79,247", series:"iseldoran",
    excerpt:"Cassander's total war of revenge following Aurelian's assassination. The Schism of Two Flames. Two claims, one throne — and a civilisation that survived the answer.",
    opening:`Cassander did not grieve in any form the court recognised. He did not weep. He did not wear black. He did not speak of Aurelian in the past tense for eleven months — the court eventually understood this was not confusion but refusal, and stopped correcting him.\n\nWhat he did instead was make a list.\n\nThe list had forty-seven names on it when he ascended. By the time it was finished, it had two hundred and nineteen. This was considered, by the historians who came after, the most methodical act of vengeance in imperial record.`,
    quote:'"The list had forty-seven names when he ascended. It had two hundred and nineteen when he was done." — Imperial Archive',
    era:"Second Luceron Restoration", status:"Complete" },
  { id:6, title:"Lucius Luceron III", sub:"The Philosopher Emperor", words:"66,569", series:"iseldoran",
    excerpt:"The Philosopher Emperor — later The Philosopher Who Went to War. Crowned Prince, later turned soldier. The question of what follows victory occupies him until the day of his death.",
    opening:`He had read every treaty the empire had signed in three centuries and could recite the conditions of each from memory. He had annotated seventeen volumes of administrative law before the age of twenty. He knew six languages and had begun work on a seventh.\n\nHe was, by any measurement, the most prepared emperor the Dragon Throne had ever received.\n\nThe empire, by any measurement, was the most unprepared it had ever been to receive him.`,
    quote:'"The prepared emperor. The unprepared throne." — Mercurio de Rothschild, Journals of the Five',
    era:"Copper and Violet Era", status:"Complete" },
  { id:7, title:"Amira's Rule", sub:"The Flame of Bundchen", words:"114,725", series:"iseldoran",
    excerpt:"She did not come to the throne. The throne came to her. It arrived in pieces, over years, carried by people who had no idea they were carrying it. The Bastard Goddess.",
    opening:`She did not come to the throne. The throne came to her. It arrived in pieces, over years, carried by people who had no idea they were carrying it.\n\nThe first piece was the inheritance she did not expect — a letter from a solicitor she had never met, in a city she had left at the age of nine, concerning a property she did not know existed on a planet she had not thought about in twenty years.\n\nThe second piece was the Senate's emergency session, called in the eighteenth year of her life, concerning a governance crisis that should not have touched her at all.`,
    quote:'"She did not come to the throne. The throne came to her." — Adulfus Khan, Afterword of the Witness',
    era:"Goddesses and Dominion", status:"Complete · Tenth Edition" },
  { id:8, title:"The Bastard God: Augustus Rex", sub:"God-Emperor · Beyond the Rim", words:"67,537", series:"iseldoran",
    excerpt:"A god who arrives without announcement is either very confident or very late. Augustus Rex led ninety billion soldiers beyond the Rim. The Flame carried openly.",
    opening:`He arrived without announcement. This was, the court later agreed, the single most accurate preview of his entire reign.\n\nAugustus Rex Pierre von Care did not announce himself because he did not believe announcements were a form of respect. He believed they were a form of permission-seeking, and he had not sought permission for anything in forty-two years, and did not intend to begin.\n\nThe guards at the eastern gate of the High Council's chamber let him pass because he walked the way people walk when stopping them has already been considered and rejected.`,
    quote:'"A god who arrives without announcement is either very confident or very late. He was neither. He was right." — Imperial Record',
    era:"Goddesses and Dominion", status:"Complete" },
  { id:9, title:"Niccolò: Thunderborn", sub:"The Greatest Warrior Since Kaelen", words:"27,738", series:"iseldoran",
    excerpt:"Born in a storm that stopped the moment he arrived. Golden dreadlocks, dark skin, pale gold eyes flecked with ember-red. The finest warrior since Kaelen — he knew it and never let it stop him from learning.",
    opening:`The storm began at midnight over Tyrelis. Not a gentle rain or soft sky-moan, but the kind of storm that makes you wonder if the planet itself is angry about something. Purple lightning webbed across the mountains. Thunder cracked so loud it knocked paintings off walls.\n\nInside the palace, Duke Lorenzo-Abdul von Hapsburgi paced the corridor outside his wife's room. He was a big man, dark-skinned, and proud. But tonight his hands shook.\n\nWhen the light returned, there was a baby. The baby had its eyes open.\n\n"It is a boy," the midwife whispered. "But — my Duke — do you feel that?"\n\nLorenzo-Abdul did. The palace was humming. As if the thunder had followed the child in from somewhere else and was still deciding whether to leave.\n\nOutside, abruptly, the storm stopped. Not died down. Stopped. Like a door closing.`,
    quote:'"The storm did not make him. He made the storm." — Mercurio de Rothschild, Journals of the Five',
    era:"Goddesses and Dominion", status:"Complete" },
  { id:10, title:"The Strangling of the Belt", sub:"The Thirty-Year War of Blood, Oaths, and Family", words:"69,964", series:"iseldoran",
    excerpt:"The Kasparian Belt, strangled by empire, commerce, and betrayal. The Four Names the Belt Remembers: Niccolò · Khutun · Baiju · Livius. The Merchant War prelude.",
    opening:`The belt was not a place people went to willingly. It was a place people went to because everywhere else had become impossible.\n\nThis had been true for eight hundred years. The Kasparian Belt — a three-hundred-thousand-kilometre arc of rock, gas, ice, and improbable human habitation — had been receiving the empire's overflow since the second expansion. The people who lived there had long since stopped calling themselves settlers or colonists. They called themselves Belters, and they said it the way people say a name that has been carved rather than given.`,
    quote:'"The Four Names the Belt Remembers: Niccolò. Khutun. Baiju. Livius." — Kasparian Chronicle',
    era:"Goddesses and Dominion", status:"Complete" },
  { id:11, title:"Wolves and War", sub:"Books I & II · The Making of Asha Kers I", words:"137,270", series:"iseldoran",
    excerpt:"Crown Prince Khuvius's five frontier campaigns. Hesh-Kar, the sixth war that wasn't won. The conception of Asha Kers I. The eighteen-year wait. Asha's thirty-nine-year reign. La Coña.",
    opening:`For the names on the small list.\n\nAll seventeen thousand four hundred and twenty-six of them.\n\nAnd for Ruskat, where the folio is sealed and the Keeper has not been seen.\n\n— K.P.V.C.\n\nBook I begins at the Orbital Battle of Tarrid. It ends at Hesh-Kar, where Crown Prince Khuvius Auguste Pierre von Care fought the sixth frontier war — and came back changed in ways that took decades to understand.\n\nBook II begins eighteen years later, when Asha Kers I picked up the folio and read the names.`,
    quote:'"For the names on the small list. All seventeen thousand four hundred and twenty-six of them." — Dedication',
    era:"Star Wolf Era", status:"Complete · Eighth Edition" },
  { id:12, title:"The Quiet King", sub:"Germionus de Maldor · The Immune System", words:"70,091", series:"iseldoran",
    excerpt:"He was not murdered by a man. He was murdered by a room full of them who had agreed, before he arrived, that nothing he said would matter.",
    opening:`The reconstruction was prepared under the authority of the Sahkud Investigative Archive by order of Napoleon XX, called The Reclaimer.\n\nThe events described occurred between Year 31, Month 9 and Year of Restoration 19. All dates, personnel, and administrative actions have been verified against recovered primary documents.\n\nThe account that follows is not a history of the usurpation only. It is a history of the mechanisms that made the usurpation possible — and what the empire did when it understood, too late, what it had allowed to happen.`,
    quote:'"He was not murdered by a man. He was murdered by a room full of them who had agreed nothing he said would matter." — Lothor of Ix',
    era:"Napoleonic Era", status:"Complete" },
  { id:13, title:"Haradakus", sub:"A Space Opera of Historical Record", words:"55,477", series:"iseldoran",
    excerpt:"God-Emperor Mettenik I read this novel three times and annotated his copy. Popular fiction — but the Haradakn people, who lost everything twice and rebuilt both times without asking permission, are real.",
    opening:`Then Mehmet al Sa'ud von Hapsburgi was born.\n\nThis is not the beginning of the story, but it is where the story stops being theoretical. The Haradakus Wars had been building for forty years before he drew his first breath. The political architecture that would shape his entire life — the treaties, the resentments, the impossible compromises — was already in place.\n\nHe did not choose it. He chose what to do with it. That is the distinction the novel is interested in.`,
    quote:'"God-Emperor Mettenik I read this novel three times. His annotations are in Vault Sixty-Two." — Prince Kairoh Pierre von Care',
    era:"al-Sa\'ud Era", status:"Complete" },
  { id:14, title:"Father's Gift", sub:"The Account of Aurel von Rothschild · Vault Twenty-Two", words:"80,126", series:"iseldoran",
    excerpt:"Geology does not lie. The Runeus Question. What the vault contained, and what Aurel chose to do about it. Events following the Wedding War.",
    opening:`Geology does not lie. It does not simplify, either. What it tells you is exactly what happened, in a language that takes years to learn and a lifetime to stop misreading.\n\nThe survey team's report was nine pages long. The geologist who wrote it had been at the Runeus Research Station for three years and had seen things she could not explain, which was unusual — Dr. Amara Solis was not someone who had trouble explaining things.\n\nShe sent the report through the standard channels and then she sent it again through a different channel. When neither produced a response, she sent it a third time, directly to the archive at Bundchen Prime, flagged as a matter of historical significance.`,
    quote:'"Geology does not lie. It does not simplify, either." — Dr. Amara Solis, Survey Team Lead',
    era:"First Luceron Restoration", status:"Complete" },
  { id:15, title:"Aurelia: The Goddess Empress", sub:"Book of the Daughter · Second Edition", words:"69,513", series:"iseldoran",
    excerpt:"In the forty-first year of Asha Kers I's rule, the empire held its breath for seventeen days. Mother of Augustus Dominus Rex. The heir the empire did not expect.",
    opening:`In the forty-first year of Asha Kers I's rule, the empire held its breath for seventeen days.\n\nThe heir's name was not announced. The announcement of an heir was a political act — it created enemies as surely as it created allies, and Asha Kers I had lived long enough to understand that enemies made from hope are more dangerous than enemies made from fear.\n\nShe told no one. She told her physicians, who were sworn. She told the archive, which did not speak. She told herself, which was the only audience she had ever fully trusted.`,
    quote:'"In the forty-first year of her rule, the empire held its breath for seventeen days." — Opening of the Archive Record',
    era:"Star Wolf Era", status:"Complete · Second Edition" },
  { id:16, title:"Mettenik I: Restorer of the Dragon Throne", sub:"A Chronicle of the Twenty-Seven · Complete Edition", words:"137,720", series:"iseldoran",
    excerpt:"For the Twenty-Seven — and for everyone who has ever had to write a name down the side of a list they did not choose and carry it anyway. The throne stands only while the ground consents.",
    opening:`The throne stands only while the ground consents.\n\nThis was carved into the oldest section of the palace, in a script that predated three restoration projects, a fire, and a bombing. The palace archivists had debated whether to preserve it. The God-Emperor who read it as a five-year-old boy in Tyrelis did not know he would spend forty-nine years thinking about what it meant.\n\nMettenik I Pierre von Care arrived at the Dragon Throne by a route that the imperial succession protocols had not anticipated, which was perhaps appropriate — the protocols had been written by people who assumed the bloodline would not require a twenty-seven-year detour through oblivion and back.`,
    quote:'"The throne stands only while the ground consents." — Inscription, oldest section of the palace',
    era:"Restoration of the Bloodline", status:"Complete · Including Volumes I–III" },
  { id:17, title:"The First Khan", sub:"A Chronicle of the Twenty-Seven · 144,571 Words", words:"144,571", series:"iseldoran",
    excerpt:"The longest volume of the Iseldoran Sagas. Dhaka's failed coup on the command deck of the Sable Fury. The Twenty-Seven and what they carried. The origin of the Ghega-Khan'i.",
    opening:`Dhaka moved before the vote was finished.\n\nThis was the first mistake — not because it failed, exactly, but because it established a pattern. Dhaka always moved before the thing that would have stopped him was complete. This was sometimes called decisiveness. It was also sometimes called the reason everything he built eventually collapsed.\n\nOn the command deck of the Sable Fury, in the third hour of the coup that was not supposed to be a coup, Dhaka raised his right hand and gave the order that changed the shape of the next three centuries.`,
    quote:'"Dhaka moved before the vote was finished. This was the first mistake." — Opening passage',
    era:"Khanate Era", status:"Complete · Third Authorised Edition" },
  { id:18, title:"The Iberian Wars: Book One", sub:"Exile: The Hidden Prince · The Crown and the Crescent", words:"18,630", series:"iseldoran",
    excerpt:"History does not repeat itself. It merely finds new mouths to say the same prayers. The exile years. The Hidden Prince's formation. Alhambra Station.",
    opening:`The inscription on the gate of Alhambra-Station read: History does not repeat itself. It merely finds new mouths to say the same prayers.\n\nNo one knew who had written it. The station had been through seven administrative regimes and four wars and the inscription had survived all of them, which the station's archivists considered either an omen or a coincidence. They had decided not to investigate which.`,
    quote:'"History does not repeat itself. It merely finds new mouths to say the same prayers." — Gate of Alhambra-Station',
    era:"Pre-Star Wolf Era", status:"Book One Complete" },
  { id:19, title:"Leraq: An Autobiography", sub:"As Dictated to No One · And Therefore True", words:"5,157", series:"iseldoran",
    excerpt:"I write this because the records that survive me will be wrong in specific ways. Grand Admiral of the Auxiliaries. Non-human. Elder of the Va Sumir. Witness to eight eras.",
    opening:`I do not write this because I believe autobiography is a dignified form. It is not. It is vanity wearing the coat of record.\n\nI write this because the records that survive me will be wrong in specific ways — the archivists will argue over my eye color and miss the forty years I spent building the structure that kept eight species from dying in cognitive silence. They will describe my height and forget that height means nothing in a room full of people who do not yet know what Ra'ah is.\n\nSo I will say it plainly, once, in my own arrangement.\n\nMy name is Leraq. That is the only name the records will find.`,
    quote:'"I write this because the records that survive me will be wrong in specific ways." — Leraq, Foreword',
    era:"All Eras", status:"Sealed Record · Complete" },
  { id:20, title:"Cassander's Revenge", sub:"The Vengeance Era · The Purge at Remisión 9", words:"31,362", series:"iseldoran",
    excerpt:"On Remisión Prime, the twin Empresses received the body in silence. The capital's mourning lasted eleven days. Cassander's mourning lasted the rest of his life and took the form of work.",
    opening:`On Remisión Prime, the twin Empresses received the body in silence.\n\nThe functionaries who carried it expected ceremony. They had prepared remarks. They had arranged a formal reception with the appropriate military honours and the relevant members of the senior civil service in attendance.\n\nIsolde dismissed them with a gesture. Ysinde did not look up.\n\nThe body was placed in the state room and the doors were closed.\n\nThe capital's mourning lasted eleven days. Cassander's mourning lasted the rest of his life and took the form of work.`,
    quote:'"The capital\'s mourning lasted eleven days. Cassander\'s lasted the rest of his life." — Imperial Record',
    era:"Second Luceron Restoration", status:"Complete" },
  { id:21, title:"Notes on Cassander's Final Years", sub:"Supplemental Scenes and Testimony", words:"8,489", series:"iseldoran",
    excerpt:"The heat reached me before the sound did. Eyewitness accounts of the campaigns, the decisions, and the years when the empire held its shape through the weight of one man's refusal to stop.",
    opening:`The heat reached me before the sound did. It crawled up the greaves and settled beneath the edge of the chest plate, the way heat always does when you have been standing in the same position for too long.\n\nI had been standing in the same position for too long.\n\nCassander had given no order to move. Cassander had given no order at all for the past forty minutes. He was looking at the city — what remained of it — with an expression I had learned, over the years, to associate with decisions already made.`,
    quote:'"Cassander had given no order at all for forty minutes. He was looking at the city with an expression I had learned to associate with decisions already made." — Eyewitness account',
    era:"Second Luceron Restoration", status:"Complete" },
  { id:22, title:"Lucius Luceron II", sub:"The Philosopher Emperor Who Went to War", words:"36,840", series:"iseldoran",
    excerpt:"The Fostered Heir. The Charge Beyond the Rim. The Schism of Two Flames — two claims, one empire, and the question of which one the people would follow.",
    opening:`They called him the Philosopher Emperor before he had done anything to deserve the name, which was typical of courts — they assigned the epithet they wished for rather than the one that had been earned.\n\nLucius Luceron II had, at the time of his coronation, published four volumes of political theory, overseen the reform of three administrative codes, and personally mediated a border dispute that had been running for sixty years. None of this was military achievement. None of this looked like empire.\n\nThis turned out to be exactly what the empire needed.`,
    quote:'"They assigned the epithet they wished for rather than the one that had been earned." — Imperial Record',
    era:"Second Luceron Restoration", status:"Complete" },
  { id:23, title:"No Gods No Masters: Appendices & Notes", sub:"Vol. I Companion · The Codex of Restoration", words:"3,276", series:"iseldoran",
    excerpt:"Three appendices. I: The Codex of Restoration. II: The Lucien X era. III: The Decline of the Servile Legions. Compiled by Prince Kairoh Pierre von Care.",
    opening:`The following appendices were compiled from primary sources held in the Trinitarian Imperial Archive at Bundchen Prime. They are issued as a companion to Volume I of the Va Sumir Chronicles and are intended to be read after the main narrative.\n\nThe Codex of Restoration is the foundational document of the Luceron Compact. It is reproduced here in full, with annotations by the compiler.`,
    quote:'"The Codex of Restoration is reproduced here in full, with annotations by the compiler." — Archival note',
    era:"First Luceron Restoration", status:"Complete" },
  { id:24, title:"The Twin Thrones", sub:"Ysinde and Isolde · The Dawn Empresses", words:"87,082", series:"iseldoran",
    excerpt:"The forward marriage barges are burning. Ysinde and Isolde — the Mothers who demanded belonging where the God-Emperors had only demanded obedience. The Mourning Corridor Crisis.",
    opening:`The convoy was burning. Not the whole convoy. Not yet. But the forward marriage barges were dying, and Isolde Pierre von Care had placed a fleet projection on the table three months before this moment and told the admiralty exactly which vessels would burn first.\n\nThey had thanked her for the analysis and done nothing.\n\nNow she watched the analysis prove itself, from the command deck of the Pale Meridian, and she felt nothing — not because she was cold, but because she had already felt it all three months ago, when she first understood they would not listen.`,
    quote:'"The God-Emperors demanded obedience. The Mothers demanded belonging. Men die for obedience. Entire civilisations die for belonging." — Defining axiom of the Twin Thrones era',
    era:"First Luceron Restoration", status:"Complete · Second Edition" },
  { id:25, title:"Khutun's Revenge", sub:"The Administrative Annihilation · The Kasparian Khanate", words:"64,737", series:"iseldoran",
    excerpt:"The murder of Niccolò Kerron von Hapsburgi at Vey Kashar was not simply murder. It was a political act. Khutun Ghega Khan collected the debt the empire had been ignoring for thirty years.",
    opening:`The murder of Niccolò Kerron von Hapsburgi at Vey Kashar was not simply murder. Everyone who had been paying attention knew this. The difficulty was that very few people had been paying attention.\n\nKhutun Ghega Khan had been paying attention for thirty years. She had been documenting, recording, and filing. She had a room — in the main administrative building on Vey Kashar, in the Belt district that bore her family's name — that contained nothing but boxes. Each box was labelled. Each label was a year.`,
    quote:'"She had a room that contained nothing but boxes. Each box was labelled. Each label was a year." — Chronicle of the Khanate',
    era:"Khanate Era", status:"Complete" },
  { id:26, title:"Dominus and Olympia", sub:"The Divine Pair · Narrated by the Granddaughter", words:"33,165", series:"iseldoran",
    excerpt:"He was like standing near something very large that was also very quiet. Two rulers, one throne, an empire watching. Narrated by Kairoh Pierre von Care, granddaughter of both.",
    opening:`He was like standing near something very large that was also very quiet. You did not feel it as weight, exactly. You felt it as attention — the specific quality of attention that very few people ever learn to direct, which is the kind that does not require you to know you are being paid it.\n\nMy grandfather did not watch rooms. He held them.\n\nI am aware that this sounds like the kind of thing a granddaughter would say. I have spent forty years in the archive and I can confirm that primary sources from six different administrations say substantially the same thing, in the specific language of people who were not trying to be complimentary.`,
    quote:'"He did not watch rooms. He held them." — Prince Kairoh Pierre von Care',
    era:"Goddesses and Dominion", status:"Complete" },
  { id:27, title:"The Supreme Rule", sub:"Augustus Dominus Rex · Parts I–VII", words:"35,591", series:"iseldoran",
    excerpt:"He said it openly: 'If the civil service hesitates, the Empire dies.' So it did not hesitate. The Final God — ruling as a lived reality rather than a ceremonial title.",
    opening:`He said it openly, which was considered either extremely honest or extremely dangerous depending on who was listening: "If the civil service hesitates, the Empire dies."\n\nThe civil service did not hesitate after that. Whether this was because they agreed with him or because they were afraid of him was a question that several generations of scholars have debated without resolution. The practical effect was the same.`,
    quote:'"If the civil service hesitates, the Empire dies." — Augustus Dominus Rex, first address to the High Council',
    era:"Goddesses and Dominion", status:"Complete" },
  { id:28, title:"Augustus Dominus Rex: The Final God", sub:"The Closing Era", words:"32,817", series:"iseldoran",
    excerpt:"The last God-Emperor to hold the title as a lived reality rather than a ceremonial designation. He meant it. The empire felt the difference.",
    opening:`The difference between a God-Emperor who believes he is a god and one who does not is not visible in the laws he passes or the wars he authorises or the reforms he implements. It is visible in the specific quality of attention he pays to the people in the room.\n\nAugustus Dominus Rex believed he was a god. This was not a performance and not a political calculation. The people in the room knew it immediately.`,
    quote:'"The last God-Emperor to hold the title as a lived reality. He meant it. The empire felt the difference." — Imperial Archive notation',
    era:"Goddesses and Dominion", status:"Complete" },
  { id:29, title:"VSGE Imperial Chronicles Vol. II", sub:"The Asha Kers I Era · The Purge", words:"14,263", series:"iseldoran",
    excerpt:"The Purge finds its floor. Two billion, eight hundred million dead. Forty-seven planets affected. The archive's own account of the eras between the major reigns.",
    opening:`The archive's account is not a narrative. It is a record. The distinction matters.\n\nA narrative imposes meaning. A record imposes only itself.\n\nThe VSGE Imperial Chronicles are a record. They do not argue. They do not explain. They document. Where the documentation is incomplete, it says so. Where the documentation conflicts, it says so. What it does not do is choose.`,
    quote:'"The archive\'s account is not a narrative. It is a record. The distinction matters." — VSGE Chronicle, editorial prefatory note',
    era:"Star Wolf Era", status:"Complete" },
  { id:30, title:"VSGE Imperial Chronicles Vol. III", sub:"The Commission · What Asha Built", words:"20,180", series:"iseldoran",
    excerpt:"Mercurio lived alone in the eleventh year. Not alone in the sense of solitude — but in the sense of having made a choice that the world had not yet caught up with.",
    opening:`Mercurio lived alone in the eleventh year. Not alone in the sense of solitude — he had the commission's correspondence, the survey teams' reports, the constant flow of technical documentation that is the texture of building something that has never been built before. He was not lonely. He was simply operating in a space that no one else had yet entered.`,
    quote:'"He was operating in a space that no one else had yet entered." — VSGE Chronicle Vol. III',
    era:"Star Wolf Era", status:"Complete" },
  { id:31, title:"La Generalísima", sub:"The Seven Days · The Fall of the Meraud Free Republic", words:"47,969", series:"generalisima",
    excerpt:"Selene Jaza. Age 41 at Year One. Daughter of Augustus Lucius Jaza, architect of the Merchant War. The Seven Days. The fall of Remi Vey. The birth of the title.",
    opening:`She sat across from him. She looked at him for a moment.\n\n"The next station that makes me do this," she said, "I wait longer."\n\nRemi Vey was not used to being spoken to that way. He was twenty-three, and he had raised a Republic flag at that age, and he had moved in three years rather than the expected thirty, and the speed of it had given him the impression that this was simply how things went when you moved fast enough.\n\nSelene Jaza had been watching people move fast for forty years. She knew what fast looked like. She knew what fast that had outrun its own foundations looked like. She sat back and waited.`,
    quote:'"I am not here for right. I am not here for my father\'s name. I am here because my orders say I am here." — Selene Jaza',
    era:"La Generalísima Era", status:"Complete · 93/100 Publisher Score" },
  { id:32, title:"La Generalísima: Appendices & Notes", sub:"Authorised Publisher's Edition", words:"~28,000", series:"generalisima",
    excerpt:"The complete intelligence record. The Seven Days documented hour by hour. Talassar Vey's assassination — the thirty-seven seconds. The Sable Absolute. Jaza's operational files.",
    opening:`The following appendices contain the complete operational record of the events designated in the imperial calendar as the Seven Days — the succession of administrative actions by which the First Generalísima of the Black Death established the post-Republic governance framework of the Meraud sector.\n\nAll documentation is primary source material from the Imperial Archive. Nothing has been invented. Interpretations are the compiler's own and should be treated accordingly.`,
    quote:'"Thirty-seven seconds between picking up the abdication instrument and setting it down. Three answers exist. All of them are true." — Prince Kairoh Pierre von Care',
    era:"La Generalísima Era", status:"Complete" },
  { id:33, title:"Five Swords, One Throne", sub:"Brotherhood, Blood, and the Fall of a Pharaoh", words:"TBD", series:"iseldoran",
    excerpt:"Five men. Five swords. Raised in blood. Bound by brotherhood. Forged by war. From the training pits of Solera to the fall of a Pharaoh. The De Maldor brothers.",
    opening:`Five men stood in the training pit on Solera before any of them had earned the right to stand anywhere in particular.\n\nThis was by design. The pits did not care about right. They cared about result. Whether you left the pit having improved was the only question that mattered, and improvement was not assumed, and it was not assigned. It was extracted.`,
    quote:'"Five men. Five swords. Raised in blood. Bound by brotherhood." — Manuscript tagline',
    era:"Pre-Quiet King Era", status:"In Development" },
  { id:34, title:"The Sapphire Eye", sub:"Code of Martyrs · Book I", words:"~50,000", series:"martyrs",
    excerpt:"Ishak the Fox — secret hunger of the state. The Withered King. The beginning of the Code of Martyrs saga, set in the universe of the Dragon Throne of Maldorus.",
    opening:`The Dragon Throne of Maldorus had been polished by the backs of fourteen emperors. Shapur the Eternal sat it longest. The rot began at the joints — not the throne's joints, but the joints of the empire — and by the time anyone in the capital could smell it, the provinces had been breathing it for decades.\n\nIshak arrived in the capital without announcement, which was how he arrived everywhere. The fox does not knock.`,
    quote:'"The Withered King. The fox who arrived everywhere without announcement." — Imperial Dossier',
    era:"Code of Martyrs Universe", status:"Complete" },
  { id:35, title:"The Withered King", sub:"Code of Martyrs · Book II", words:"~60,000", series:"martyrs",
    excerpt:"The throne and its cost. Ashim the Lion and Ishak the Fox — brothers at the centre of an empire's collapse. What the Lattice does to those who reach for it too quickly.",
    opening:`Two brothers. One throne. The Lattice between them.\n\nAshim had always been the Lion — the name had preceded him into every room he entered since childhood, and he had grown into it the way you grow into a coat left by someone larger: with effort, and with the constant awareness that it had been someone else's first.\n\nIshak had always been the Fox. The Fox does not want the coat. The Fox wants what is in the coat's pockets.`,
    quote:'"Two brothers. One throne. The Lattice between them." — Code of Martyrs, Book II opening',
    era:"Code of Martyrs Universe", status:"Complete" },
  { id:36, title:"The Winnowing of Maldorus", sub:"Code of Martyrs · Book III", words:"~65,000", series:"martyrs",
    excerpt:"The winnowing has begun. The empire separating what it needs from what it can no longer afford. Gamelon the Jester — The Accountant — counts the cost.",
    opening:`Gamelon did not laugh anymore. This was noticed.\n\nThe Jester who does not laugh is either dying or has understood something. The court had spent three weeks trying to determine which. The bet, by the end of the third week, was running eight to one in favour of understanding something — but the something was disagreed upon, and the disagreement was getting louder.`,
    quote:'"The Jester who does not laugh is either dying or has understood something." — Code of Martyrs, Book III',
    era:"Code of Martyrs Universe", status:"Complete" },
  { id:37, title:"The Chronicles of the Glass Eye", sub:"Code of Martyrs · Book IV", words:"~70,000", series:"martyrs",
    excerpt:"Kaisar Vane — The Iron God. He pulled the soul from the Lattice. The Victory of the Hollow. The final accounting of the Code of Martyrs.",
    opening:`Kaisar Vane walked through the ruins of what had been the Eastern Administrative Quarter and did not look at the bodies. He had decided, some time earlier, that looking at the bodies was a form of sentiment, and sentiment was a form of weakness, and weakness was a form of defeat, and he had not come this far to be defeated by the sight of a thing he had ordered.\n\nHe looked at the Lattice instead. The Lattice was still standing. This was the important thing.`,
    quote:'"He did not look at the bodies. Looking at bodies was a form of sentiment. Sentiment was defeat." — Code of Martyrs, Book IV',
    era:"Code of Martyrs Universe", status:"Complete" },
];

const CHARACTERS = [
  { n:"Lucius Luceron I", e:"The Flame Bearer", era:"First Luceron Restoration",
    desc:"Youngest son of Romulus Secundus. Sent to Ixoria at age 4 via the Fosterage of Flame. Romulus and his other sons were massacred by Sullied clones at Hagia Sofia spaceport 18 months later. Founded the Luceron Compact. Wife: Armenatia al-Hapsburgi. Hazel eyes, silver-white hair in age. Abdicates after his son Lucien dies. Life ends on Asha IX.",
    appears:"No Gods No Masters, Wolves and War", faction:"Dragon Throne" },
  { n:"Kaelen I Rainmaker", e:"The Living Weapon · The God Emperor", era:"First Luceron Restoration",
    desc:"Golden dreadlocks. Strong Afro-Mongolian features — dark skin, high cheekbones, broad nose, epicanthic fold. Green eyes with golden specks. Lean physique built for speed and strength. Black armour. The God Emperor who bound the empire to himself through personal force. Married Aurelia Pierre von Care.",
    appears:"The Black Death: Kaelen I", faction:"Black Death · Dragon Throne" },
  { n:"Isolde Pierre von Care", e:"The Twin Throne", era:"First Luceron Restoration",
    desc:"She watched the forward wedding barges burn from the command deck of the Pale Meridian. She had predicted it. She had been ignored. She ruled the Twin Thrones alongside her sister with administrative precision that her contemporaries called cold and later generations called visionary.",
    appears:"The Twin Thrones, The Wedding War", faction:"Dragon Throne" },
  { n:"Ysinde Pierre von Care", e:"The Dawn Empress", era:"First Luceron Restoration",
    desc:"The other half of the Twin Thrones — the voice where Isolde was silence, the warmth where Isolde was precision. Their combined reign defined the maternal sovereignty model. Violence as administration. Belonging over obedience.",
    appears:"The Twin Thrones", faction:"Dragon Throne" },
  { n:"Empress Amira", e:"The Bastard Goddess", era:"Goddesses and Dominion",
    desc:"She did not come to the throne. The throne came to her — in pieces, over years, carried by people who had no idea they were carrying it. The Bastard Goddess. What female sovereignty costs in the Iseldoran succession.",
    appears:"Amira's Rule", faction:"Dragon Throne" },
  { n:"Augustus Rex", e:"The Bastard God", era:"Goddesses and Dominion",
    desc:"Led ninety billion soldiers beyond the Rim. The Flame carried openly. A god who arrived without announcement — which was, the court agreed, the most accurate preview of his entire reign. He did not seek permission for anything in forty-two years.",
    appears:"The Bastard God: Augustus Rex", faction:"Dragon Throne · Black Death" },
  { n:"Niccolò Kerron von Hapsburgi", e:"The Thunderborn", era:"Goddesses and Dominion",
    desc:"Golden dreadlocks, dark skin, pale gold eyes flecked with ember-red. Born in a storm that stopped the moment he arrived. The finest warrior since Kaelen — he knew it, and never let it stop him from learning. Murdered at Vey Kashar.",
    appears:"Niccolò: Thunderborn, Strangling of the Belt", faction:"House Hapsburgi · Black Death" },
  { n:"Khutun Ghega Khan", e:"Queen of the Belt", era:"Khanate Era",
    desc:"She had a room containing nothing but boxes. Each box labelled. Each label a year. Thirty years of documentation before she collected the debt. The administrative annihilation of those who murdered Niccolò.",
    appears:"Khutun's Revenge, Strangling of the Belt", faction:"Kasparian Khanate" },
  { n:"Khuvius Auguste Pierre von Care", e:"Crown Prince of War · Star Wolf Prince", era:"Star Wolf Era",
    desc:"Five frontier campaigns. Hesh-Kar — the sixth war that wasn't won. Came back changed in ways that took decades to understand. Father of Asha Kers I.",
    appears:"Wolves and War", faction:"Dragon Throne · Star Wolves" },
  { n:"Asha Kers I", e:"La Diosa · Queen of the Vah'Sumir", era:"Star Wolf Era",
    desc:"She stood six feet and four inches. She carried Death Dealer. She kept a list — a folio of plain dark wood — of seventeen thousand four hundred and twenty-six names. Ruled for thirty-nine years. The Purge. Codified Universal Khanate Law. The empire's greatest administrator.",
    appears:"Wolves and War, VSGE Chronicles", faction:"Dragon Throne · Khanate" },
  { n:"Germionus de Maldor", e:"The Quiet King · The Immune System", era:"Napoleonic Era",
    desc:"He did not fight. He absorbed. He was not murdered by a man — he was murdered by a room full of them who had agreed, before he arrived, that nothing he said would matter. The emperor the empire didn't know it had lost until it needed him.",
    appears:"The Quiet King", faction:"Dragon Throne · De Maldor" },
  { n:"Mettenik I Pierre von Care", e:"Restorer of the Dragon Throne", era:"Restoration of the Bloodline",
    desc:"Arrived at the Dragon Throne by a route the succession protocols had not anticipated. The twenty-seven-year detour through oblivion. Read Haradakus three times. Annotated his copy. His notes are in Vault Sixty-Two.",
    appears:"Mettenik I", faction:"Dragon Throne" },
  { n:"Selene Jaza", e:"The First Generalísima", era:"La Generalísima Era",
    desc:"Daughter of Augustus Lucius Jaza. Age 41 at Year One. Dark eyes, angular precision. 'I am not here for right. I am not here for my father's name. I am here because my orders say I am here.' The Seven Days. The fall of the Meraud Free Republic.",
    appears:"La Generalísima", faction:"Black Death · House Jaza" },
  { n:"Augustus Lucius Jaza", e:"The Black Spider", era:"Merchant War",
    desc:"Second son of House Jaza of Mars. Lord of Mérida. The finest operational intelligence architect in three centuries. 'My function is to prevent that outcome.' Launched seven battle fleets from Ixorian dock-rings in thirty-six hours.",
    appears:"La Generalísima", faction:"Black Death · House Jaza" },
  { n:"Leraq of Vath", e:"Grand Admiral of the Auxiliaries · Va Sumir Advisor", era:"All Eras",
    desc:"Not human. Elder of an ancient order. His autobiography spans eight eras. 'The archivists will argue over my eye color and miss the forty years I spent building the structure that kept eight species from dying in cognitive silence.' The only constant across the entire saga.",
    appears:"All volumes", faction:"Va Sumir · Auxiliaries" },
  { n:"Prince Kairoh Pierre von Care", e:"Master Archivist · Grand Marshal", era:"All Eras (Compiler)",
    desc:"He gave Jaza his first order. He compiled the entire archive. Master Archivist and Grand Marshal simultaneously. The narrator and organising intelligence of the whole Iseldoran Sagas. 'The archive is not passive. It records. And what it records, it preserves — as argument.'",
    appears:"All volumes (compiler)", faction:"Dragon Throne · Imperial Archive" },
  { n:"Cassander I", e:"The Avenger", era:"Second Luceron Restoration",
    desc:"Did not grieve in any form the court recognised. He made a list. The list had forty-seven names when he ascended. It had two hundred and nineteen when it was finished. The most methodical act of vengeance in imperial record.",
    appears:"Cassander's Revenge, The Soldier Emperors", faction:"Dragon Throne" },
  { n:"Aurelian Pierre von Care", e:"The Beloved · The Murdered Sun", era:"First Luceron Restoration",
    desc:"Ruled for four years, two months, and eleven days. Twenty-three when he ascended, twenty-seven when he died. Seventeen reforms. Made more enemies through being right than any emperor in living memory. Assassinated by Respurien von Malfoy, age thirteen.",
    appears:"The Chronicle of Aurelian", faction:"Dragon Throne" },
  { n:"Ishak", e:"The Withered King · The Fox", era:"Code of Martyrs",
    desc:"Brother to Ashim the Lion. Secret hunger of the state. The Fox does not want the coat — the Fox wants what is in the coat's pockets. The Withered King who reaches for the Lattice.",
    appears:"Code of Martyrs I–IV", faction:"Maldorus Empire" },
  { n:"Kaisar Vane", e:"The Iron God", era:"Code of Martyrs",
    desc:"He pulled the soul from the Lattice. The Victory of the Hollow. Did not look at the bodies — looking at bodies was a form of sentiment, and sentiment was defeat. The antagonist of the final volume.",
    appears:"Code of Martyrs IV", faction:"Maldorus Empire" },
];

const LORE = [
  { id:1, cat:"faction", title:"The Black Death", era:"All Eras",
    excerpt:"They do not fight wars. They remove resistance. Debt collectors of the Dragon Throne. Men who arrive after negotiation fails.",
    full:"The Black Death is the Dragon Throne's elite institutional force — the only organisation in the empire that has never changed its name across eight eras of governance. They do not fight wars. They remove resistance. Where they stand, the empire survives. Where they leave, the people whisper softer. Their advance is in silence — only boots, respirator filters, distant artillery. 'The Emperor's final argument.'",
    quote:'"Where they stand, the empire survives. Where they leave, the people whisper softer." — Janissary field report' },
  { id:2, cat:"location", title:"Ixoria", era:"All Eras",
    excerpt:"The Forge-Moon. The dock-rings that burned the orbital sky gold for three nights. Steel remembers the hand that shaped it.",
    full:"Ixoria is a forge-moon in the Kasparian Belt, orbiting Vey Ashur, three foldgates from New Terra. The largest military foundry in the setting. Founded as a prison-mining moon under the Luceron emperors. Culture frames labour as religion: 'Steel remembers the hand that shaped it.' The dead are scattered into smelters. 'Built on Ixoria' is shorthand for war-ready. The Seven Fleet Launch — seven battle fleets launched from Ixorian dock-rings in thirty-six hours — burned the orbital sky gold for three nights.",
    quote:'"Steel remembers the hand that shaped it. The hand does not wait to see where the steel lands." — House Ixen motto' },
  { id:3, cat:"faction", title:"The Star Wolves", era:"Star Wolf Era",
    excerpt:"Eleven commanders who stood at Khuvius's shoulder across five frontier wars. Met at Hesh-Kar. Scattered by time.",
    full:"The Star Wolves were eleven commanders who stood at the shoulder of Khuvius Auguste Pierre von Care across five frontier campaigns. They met at Hesh-Kar — the sixth war that wasn't won. The title was given to them by the soldiers they commanded and the enemies they faced, in that order. By the time the empire gave it to them formally, they had already given it to each other.",
    quote:'"The title was given to them by soldiers and enemies, in that order." — Wolves and War, Foreword' },
  { id:4, cat:"event", title:"The Seven Days", era:"La Generalísima Era",
    excerpt:"Day 2: Orazah'hux. Day 4: von Hapsburgi. Day 6, 0600: Muskus. Day 7, 1100: the title established.",
    full:"The Seven Days are the founding moment of the Generalísima's tenure — the succession of administrative actions by which Selene Jaza established the post-Republic governance framework of the Meraud sector. Each day, a removal. Each removal, a silence. By the seventh day, the title existed because nothing that had preceded it remained to contest it.",
    quote:'"The thirty-seven seconds had finally been answered." — Demetrius Jaza' },
  { id:5, cat:"technology", title:"The Sullied Legions", era:"Clone Wars / Early Imperial",
    excerpt:"Humanoid clones from the Muskite Forges. Could replicate themselves. Massacred the Luceron line at Hagia Sofia spaceport.",
    full:"The Sullied Legions were humanoid clones built by the Muskite Forges and sold in regional conflicts as auxiliary forces. They could replicate themselves under certain conditions, could digest iron-rich compounds for energy conversion, and were sold with loyalty architectures that their buyers consistently overestimated. They massacred Romulus Secundus and all but one of his sons at Hagia Sofia spaceport. The one who survived was Lucius Luceron I, who had been sent to Ixoria at age four.",
    quote:'"Obedience always seeks an owner. If the throne hesitates even once, they will find one." — Imperial security assessment' },
  { id:6, cat:"tradition", title:"The Death-Steel Tradition", era:"All Eras (Ixoria)",
    excerpt:"Metal which has served in war is not scrap. House Ixen maintains armour crypts. House Oryx refuses to scrap Black Death cruisers.",
    full:"The death-steel tradition on Ixoria holds that metal which has served in war is not merely material — it has earned a form of standing that precludes its reduction back to raw stock. House Ixen maintains armour crypts where battle-worn plating is preserved rather than smelted. House Oryx refused, for sixty years, to scrap a specific class of Black Death cruiser whose service record they considered equivalent to a distinguished career. Names are inscribed in reactor housings. Workers refuse to scrap famous armour.",
    quote:'"Some steel has already earned eternity." — House Ixen' },
  { id:7, cat:"event", title:"The Seven Fleet Launch", era:"Merchant War",
    excerpt:"Seven battle fleets in thirty-six hours. The orbital sky burned gold for three nights. Jaza's answer to the Coalition's sabotage.",
    full:"The Seven Fleet Launch is the operational event that defined Augustus Lucius Jaza's reputation. Coalition sabotage cells had targeted Ixorian coolant networks — Jaza's response was to deploy Black Death battalions inside the foundries and execute the saboteurs beside the assembly lines they had targeted. Then, in thirty-six hours, he launched seven battle fleets from Ixorian dock-rings simultaneously. The exhaust of seven fleet-scale drives burned the orbital sky gold for three nights.",
    quote:'"The orbital sky burned gold for three nights." — La Generalísima, Chapter IV' },
  { id:8, cat:"character", title:"The Nine Foundry Houses of Ixoria", era:"All Eras",
    excerpt:"Nine semi-feudal industrial sovereignties. No House could openly challenge the Dragon Throne — but no Emperor could arm without them.",
    full:"The Nine Foundry Houses emerged during the late Luceron industrial expansions. They are semi-feudal industrial sovereignties operating within the imperial framework — technically subjects of the Dragon Throne, practically indispensable to it. No House could openly challenge the emperor. No emperor could arm, equip, or supply a military campaign without them. This structural codependency has shaped imperial politics for six centuries. The most powerful are House Ixen (armour crypts, traditional construction), House Oryx (cruiser manufacture, loyalty records), and House Varekh (coolant infrastructure, industrial supply chains — implicated in the Cooling Riots).",
    quote:'"No House can challenge the throne. No throne can arm without the Houses." — Imperial economic assessment' },
  { id:9, cat:"event", title:"The Mourning Corridor Crisis", era:"Twin Thrones Era",
    excerpt:"The defining legacy event of Isolde and Ysinde's reign. Violence as administration. Resource stabilisation. Protective isolation.",
    full:"The Mourning Corridor Crisis is the defining legacy event of the Twin Thrones era. The language of the crisis management — 'removals' not executions, 'resource stabilisation' not starvation, 'protective isolation' not quarantine — established a model of administrative sovereignty that subsequent scholars have described as either the most sophisticated governance framework in imperial history or the most terrifying euphemism system ever devised. Isolde and Ysinde were both. They knew it.",
    quote:'"The Mothers demanded belonging. Men die for obedience. Entire civilisations die for belonging." — Twin Thrones axiom' },
  { id:10, cat:"location", title:"The Dragon Throne of Maldorus", era:"Code of Martyrs",
    excerpt:"Polished by the backs of fourteen emperors. Shapur the Eternal sat it longest. The rot began at the joints of the empire.",
    full:"The Dragon Throne of Maldorus is the imperial seat of the Code of Martyrs universe — a parallel setting to the Iseldoran Sagas, operating under different historical conditions and with different technological architectures. The Throne has been occupied by fourteen emperors across four dynasties. The Lattice — the neural-digital interface network that connects the throne's governance apparatus — is both its greatest instrument and its greatest vulnerability.",
    quote:'"Sing, O Muse of the Golden Cage, of the days before the silence fell." — Code of Martyrs epigraph' },
  { id:11, cat:"faction", title:"The Meraud Free Republic", era:"La Generalísima Era",
    excerpt:"Remi Vey raised the Republic flag at age 23. He moved in three years rather than the expected thirty. The speed outran the foundations.",
    full:"The Meraud Free Republic was raised by Remi Vey — son of Talassar Vey — at age 23. He moved in three years rather than the expected thirty, and the speed of it gave him the impression that this was simply how things went when you moved fast enough. Selene Jaza had been watching people move fast for forty years. She knew what fast that had outrun its own foundations looked like. The Republic lasted six years, two months, and seven days.",
    quote:'"Loyalty is reality. Reality is law. Law is eternal." — Republic founding charter' },
  { id:12, cat:"tradition", title:"The Vah'Sumir Neural-Regenerative Lattice", era:"Imperial Era",
    excerpt:"The treatment that slows biological aging. Refused by the Lords of Mérida on theological grounds. Accepted by the core empire.",
    full:"The Vah'Sumir neural-regenerative lattice treatment is an imperial-era medical technology that significantly slows biological aging and repairs neural degradation. It is standard for the imperial family and senior civil service. The Lords of Mérida — House Jaza's theological position — hold that the treatment constitutes a transgression against the natural order and refuse it categorically. This creates a practical distinction: Jaza operatives age. Imperial administrators do not. The strategic implications of this have been studied for two centuries.",
    quote:'"The treatment does not make you immortal. It makes you patient." — Imperial medical archive notation' },
];

const LORE_CATS = [
  { id:"all", label:"All Entries", icon:"◈" },
  { id:"character", label:"Characters", icon:"⚔" },
  { id:"faction", label:"Factions & Orders", icon:"⚑" },
  { id:"location", label:"Locations", icon:"◉" },
  { id:"event", label:"Events", icon:"✦" },
  { id:"technology", label:"Technology", icon:"⚙" },
  { id:"tradition", label:"Traditions", icon:"☽" },
];

const NINE_HOUSES = [
  { name:"House Ixen", specialty:"Armour Fabrication & Crypts", motto:'"Some steel has already earned eternity."', desc:"The oldest of the Nine Houses. Maintains armour crypts where battle-worn plating is preserved rather than smelted. Their metallurgical theology holds that sufficiently distinguished steel earns a form of standing that precludes reduction." },
  { name:"House Oryx", specialty:"Cruiser Manufacture & Records", motto:'"The hull remembers. So do we."', desc:"The largest shipbuilding operation in the Belt. Refused for sixty years to scrap a specific class of Black Death cruiser on the grounds of distinguished service record. The admiralty eventually negotiated a memorial hull classification." },
  { name:"House Varekh", specialty:"Coolant Infrastructure", motto:'"Flow is sovereignty."', desc:"Controls the coolant networks that regulate Ixoria's industrial temperature. Implicated in the Cooling Riots — House Varekh redirected coolant in a revenue dispute, resulting in 2.4 million deaths over eleven days. Director Havel was executed. The House survived." },
  { name:"House Kesseth", specialty:"Weapons Testing & Certification", motto:'"We do not make weapons. We certify them."', desc:"Operates the testing ranges in Ixoria's polar sectors. Every weapon system that leaves the Belt has a Kesseth certification mark. This makes them indispensable and deeply resented in approximately equal measure." },
  { name:"House Murn", specialty:"Labour Allocation & Records", motto:'"The ledger does not lie about the living."', desc:"Maintains the workforce records for the entire moon. Their administrative control over labour assignment gives them leverage over every other House. They use it with the precision of a surgical instrument and the frequency of a blunt one." },
  { name:"House Taleth", specialty:"Orbital Dock-Ring Operations", motto:'"What leaves Ixoria, leaves through us."', desc:"Controls the dock-rings that launched seven battle fleets in thirty-six hours during the Merchant War. Their operational logs from that period are classified at the highest imperial level and have never been publicly released." },
  { name:"House Draek", specialty:"Alloy Research & Development", motto:'"Better is always possible. Better is always expected."', desc:"The research arm of Ixoria's industrial complex. Their alloy innovations have given the empire military advantages that have lasted, in some cases, for centuries. They receive imperial research funding and imperial scrutiny in equal proportions." },
  { name:"House Senn", specialty:"Medical & Augmentation Services", motto:'"The body is a tool. We keep the tools sharp."', desc:"Provides the medical and augmentation services for Ixoria's workforce. Industrial bodily damage — artificial lungs, weld blindness, heat scarring, tremors — is their primary caseload. They do their work without sentiment, which is the only way the work can be done." },
  { name:"House Vor", specialty:"Intelligence & Security", motto:'"We know what the others have not told us."', desc:"The security apparatus of the Nine Houses. Monitors the other eight for sabotage, defection, and disloyalty to the Belt's collective interests. Their relationship with the Black Death is formally cooperative and practically adversarial." },
];

const SOVEREIGNS_DATA = [
  { era:"The Founding Era", color:"#c9a84c", rulers:[
    { name:"Eustace I Bartholamer Pierre von Care", epithet:"The Architect", note:"Conceived the Trinitarian structure. Never sat the throne — died before it was completed. The empire he designed was built by those he trained." },
    { name:"Kerron Pierre von Care", epithet:"The Dragon Emperor", note:"Founded the Trinitarian Empire. First to sit the Dragon Throne. Established the succession protocols that would bind and occasionally fracture the empire for eight eras." },
    { name:"Hamish Pierre von Care", epithet:"The Shielded King", note:"Preserved and consolidated Kerron's gains. The empire was built by his father. It was made to last by him." },
    { name:"Cassian I", epithet:"The God-King", note:"Executed 433 rival princes. Ended succession conflicts through the specific mechanism of eliminating everyone who could cause them. This was considered effective." },
  ]},
  { era:"The Cassiel Withdrawal Era", color:"#7a5e28", rulers:[
    { name:"Cassiel I", epithet:"The Absent Emperor", note:"Withdrew from active governance. The reasons remain disputed." },
    { name:"Cassiel II–IV", epithet:"The Seekers", note:"Continued the withdrawal tradition. Three emperors who governed through intermediaries and are remembered primarily through those intermediaries' records." },
  ]},
  { era:"Second Cassian Restoration & Quiet Eustacian Line", color:"#6b6070", rulers:[
    { name:"Cassian II–VI", epithet:"The Reclaimers and Administrators", note:"Five emperors over two centuries. The empire was stable, which is the highest praise the administrative record offers." },
    { name:"Eustace II–VIII", epithet:"The Clerks, Auditors, and Surveyors", note:"Seven emperors. The empire was not exciting. The empire was solvent. Later generations considered this an achievement." },
  ]},
  { era:"The Napoleonic God-Emperors", color:"#c9a84c", rulers:[
    { name:"Napoleon IV–XXXV", epithet:"Thirty-Two Emperors", note:"The longest sustained dynastic period in the imperial record. Thirty-two emperors across four centuries. Napoleon IV renamed everything. Napoleon XXV organised everything. Napoleon XXXV was very quiet and nobody knew what to do about that." },
    { name:"Naim al-Hapsburgi", epithet:"The Usurper · Not Counted", note:"Usurped the throne between Napoleon XX and Napoleon XXI. Not counted in the official record. The Correction of Naim remains one of the most studied administrative operations in imperial history." },
  ]},
  { era:"The Liberal Collapse & Republican Experiment", color:"#5c1515", rulers:[
    { name:"Eustace IX", epithet:"The Avenger's Father", note:"Abdicated after stabilising the post-Napoleonic fracture. His son would become Erulius Bobitus." },
    { name:"Erulius Bobitus", epithet:"The Scholar King", note:"Son of Eustace IX. Denounced imperial militarism. Reduced the military by sixty percent. This was considered enlightened until it was considered catastrophic." },
    { name:"Romulus Secundus", epithet:"The Pageant King", note:"Fiscally reckless. Indulgent. Massacred at Hagia Sofia spaceport by Sullied clones alongside all but one of his sons. The surviving son became Lucius Luceron I." },
    { name:"Raja the Brilliant", epithet:"President, then King", note:"Abolished monarchy. Founded the Universal Republic. Was forced by public pressure to restore the royal title. The republic lasted less than a generation. The monarchy lasted another three centuries." },
  ]},
  { era:"The First Luceron Restoration", color:"#c9a84c", rulers:[
    { name:"Lucius Luceron I", epithet:"The Flame Bearer", note:"Youngest son of Romulus Secundus. Founded the Luceron Compact. Married Armenatia al-Hapsburgi. Abdicated after his son Lucien died. Life ends on Asha IX." },
    { name:"Kaelen Pierre von Care", epithet:"The Living Weapon", note:"The God Emperor. Black armour, green eyes, golden dreadlocks. Bound the empire to himself through personal force." },
    { name:"Isolde & Ysinde Pierre von Care", epithet:"The Twin Empresses · The Dawn Mothers", note:"Governed the Twin Thrones era. Maternal sovereignty. The Mourning Corridor Crisis." },
    { name:"Aurelian Pierre von Care", epithet:"The Beloved · The Murdered Sun", note:"Assassinated at 27. Seventeen reforms. More enemies than any emperor — through being right." },
    { name:"Cassander I & II", epithet:"The Avenger · The Stabiliser", note:"Cassander I made the list. Two hundred and nineteen names. Cassander II kept what his father built standing." },
  ]},
  { era:"Second Luceron Restoration & Copper-Violet Era", color:"#7a5e28", rulers:[
    { name:"Lucius Luceron II", epithet:"The Restorer · The Philosopher Who Went to War", note:"Republican façade. Gradual consolidation. The Schism of Two Flames." },
    { name:"Iskandar, Aurelia, Lars Miraj, Lucius Luceron III", epithet:"The Copper and Violet Era", note:"A transitional period of divided authority, regency, and eventual philosophical re-imperialisation." },
  ]},
  { era:"Goddesses and Dominion", color:"#c9a84c", rulers:[
    { name:"Empress Amira", epithet:"The Bastard Goddess", note:"She did not come to the throne. The throne came to her." },
    { name:"Augustus Rex", epithet:"The Bastard God", note:"Led ninety billion soldiers Beyond the Rim. The Flame carried openly." },
    { name:"Livius", epithet:"The Maintainer", note:"Held what the others built. The empire was in better shape when he left it than when he found it. This is rare." },
    { name:"Asha Kers I", epithet:"La Diosa · Queen of the Vah'Sumir", note:"Thirty-nine years. The small list. Seventeen thousand four hundred and twenty-six names. The Purge. Codified Universal Khanate Law." },
    { name:"Augustus Dominus Rex", epithet:"The Final God", note:"The last God-Emperor to hold the title as a lived reality. He meant it. The empire felt the difference." },
    { name:"Augustus Julius I–III", epithet:"The Successors", note:"Three emperors managing the transition from divine to administrative rule. The empire did not collapse. This required significant effort." },
  ]},
  { era:"The al-Sa'ud Era & Restoration", color:"#c9a84c", rulers:[
    { name:"Saldin I al-Sa'ud", epithet:"The Sun Prince", note:"Founded the al-Sa'ud dynasty on the base the Augustan emperors had built." },
    { name:"The al-Sa'ud Dynasty", epithet:"Ten Thousand Years", note:"The longest unbroken dynastic succession in imperial history." },
    { name:"Mettenik I Pierre von Care", epithet:"Restorer of the Dragon Throne", note:"The twenty-seven-year detour through oblivion and back. Read Haradakus three times. His annotations are in Vault Sixty-Two." },
  ]},
];

const TIMELINE = [
  { id:1, title:"The Founding Era", date:"Eustace I → Cassian I",
    desc:"Eustace I conceives the Trinitarian structure. Kerron founds the Dragon Throne. Cassian I ends succession conflicts by eliminating everyone who could cause them.",
    events:[
      { y:"Year 0", t:"Kerron Pierre von Care founds the Trinitarian Empire. The Dragon Throne is seated." },
      { y:"Year 12", t:"Cassian I executes 433 rival princes in what the archive describes as a 'succession resolution action.'" },
      { y:"Year 45", t:"The Trinitarian structure achieves administrative stability for the first time." },
    ]},
  { id:2, title:"The Withdrawal, Restoration, and Quiet Eras", date:"Cassiel I → Napoleon XXXV",
    desc:"Four centuries of managed governance. The Cassiels withdraw. The Cassians restore. The Eustaces audit. The Napoleons rename, law-give, and colonise. The empire is stable. This is the achievement.",
    events:[
      { y:"Year 200", t:"Cassiel I begins the Withdrawal era. Governance passes to intermediaries." },
      { y:"Year 380", t:"Cassian II begins the Second Restoration. Direct imperial governance returns." },
      { y:"Year 610", t:"Napoleon IV begins the longest dynastic period in imperial history." },
      { y:"Year 890", t:"Napoleon XXXV — the Silent God — rules. No one knows what he is thinking." },
    ]},
  { id:3, title:"The Liberal Collapse & Republican Experiment", date:"Eustace IX → Raja the Brilliant",
    desc:"Erulius Bobitus reduces the military by sixty percent. Romulus Secundus spends the treasury. Sullied clones massacre the Luceron line at Hagia Sofia. Raja the Brilliant abolishes monarchy — then restores it.",
    events:[
      { y:"Year 920", t:"Erulius Bobitus reduces the military by sixty percent. Called enlightened. Later called catastrophic." },
      { y:"Year 941", t:"Romulus Secundus and his sons massacred at Hagia Sofia spaceport. One survives: Lucius Luceron I, age four, already on Ixoria." },
      { y:"Year 943", t:"Raja the Brilliant abolishes monarchy. Founds the Universal Republic." },
      { y:"Year 958", t:"Public pressure forces restoration of the royal title. The republic lasts less than a generation." },
    ]},
  { id:4, title:"The First Luceron Restoration", date:"Lucius Luceron I → Cassander II",
    desc:"The Luceron Compact. The Black Death. Kaelen's coronation. The Twin Thrones. Aurelian, the Murdered Sun. Cassander's list.",
    events:[
      { y:"Year 960", t:"Lucius Luceron I founds the Luceron Compact. Marries Armenatia al-Hapsburgi." },
      { y:"Year 977", t:"Kaelen I Rainmaker's coronation. The Coronation Declaration: 'We are the God Emperor.'" },
      { y:"Year 1017", t:"Kaelen dies. The Twin Thrones era begins — Isolde and Ysinde rule jointly." },
      { y:"Year 1041", t:"Aurelian Pierre von Care assassinated at age 27 by Respurien von Malfoy, thirteen years old." },
      { y:"Year 1043", t:"Cassander I ascends. Makes the list. Two hundred and nineteen names. Forty-seven when he started." },
    ]},
  { id:5, title:"Goddesses and Dominion", date:"Empress Amira → Augustus Julius III",
    desc:"Amira — the throne came to her. Augustus Rex beyond the Rim. Niccolò, Thunderborn and murdered. Khutun collects the debt. Khuvius, the Star Wolf Prince. Asha Kers I and the small list. The Purge. Dominus Rex — the final god who meant it.",
    events:[
      { y:"Year 1200", t:"Empress Amira ascends. The throne came to her in pieces." },
      { y:"Year 1230", t:"Augustus Rex leads ninety billion soldiers beyond the Rim." },
      { y:"Year 1255", t:"Niccolò Kerron von Hapsburgi — Thunderborn — murdered at Vey Kashar." },
      { y:"Year 1258", t:"Khutun Ghega Khan opens the boxes. The administrative annihilation begins." },
      { y:"Year 1280", t:"Khuvius Auguste Pierre von Care fights five frontier campaigns. Hesh-Kar. Returns changed." },
      { y:"Year 1298", t:"Asha Kers I begins her thirty-nine-year reign. The small list: 17,426 names." },
      { y:"Year 1337", t:"Augustus Dominus Rex — the Final God — ascends. He means it. The empire feels the difference." },
    ]},
  { id:6, title:"The Merchant War & La Generalísima Era", date:"Augustus Julius II's reign",
    desc:"Coalition sabotage targets Ixorian coolant networks. Jaza deploys Black Death inside the foundries. The Seven Fleet Launch. Remi Vey raises the Republic flag. Selene Jaza — the Seven Days.",
    events:[
      { y:"Year 1390", t:"Merchant War begins. Coalition sabotage cells target Ixorian coolant networks." },
      { y:"Year 1392", t:"Jaza launches the Seven Fleet Launch. Seven battle fleets in thirty-six hours. Sky burns gold for three nights." },
      { y:"Year 1401", t:"Remi Vey raises the Meraud Free Republic flag at age 23." },
      { y:"Year 1407", t:"Selene Jaza begins the Seven Days. Six years, two months, seven days later: the Republic is gone." },
    ]},
  { id:7, title:"The al-Sa'ud Era & Restoration of the Bloodline", date:"Saldin I → Mettenik I",
    desc:"The longest dynasty. Ten thousand years. Then Mettenik I Pierre von Care — the twenty-seven-year detour through oblivion and back.",
    events:[
      { y:"Year 1500", t:"Saldin I al-Sa'ud founds the dynasty on the Augustan base." },
      { y:"Year ~11500", t:"The al-Sa'ud dynasty ends. The twenty-seven-year interregnum." },
      { y:"Year 11527", t:"Mettenik I Pierre von Care restores the Dragon Throne. His annotations on Haradakus are in Vault Sixty-Two." },
    ]},
];

// ─── DISCUSSION DATA (seeded) ───────────────────────────────────────────────
const SEED_DISCUSSIONS = {
  1: [
    { author:"Imperial_Scholar", text:"The contrast between Raja's idealism and Lucius Luceron I's realism is one of the most interesting arcs in the saga. Raja builds the republic — and then the people he built it for demand the king back.", time:"3 days ago" },
    { author:"ArchiveReader", text:"'No gods. No masters. A king, because someone must choose.' That quote has been living in my head for weeks. The whole book is in that sentence.", time:"1 day ago" },
  ],
  2: [
    { author:"KaelenFan", text:"The prologue alone is one of the best openings in the series. Aurelia's perspective on her father, the marriage announcement, the way it captures the weight of being in a political family — extraordinary.", time:"5 days ago" },
    { author:"BookshelfVigilante", text:"The Aurelia's Wrath sections hit different when you know what comes after Wolves and War. The whole arc is constructed so precisely.", time:"2 days ago" },
  ],
  9: [
    { author:"ThunderbornFan", text:"The storm stopping the moment he arrived. That detail is everything. It tells you exactly who this person is before you've read a single word about him.", time:"4 days ago" },
    { author:"WolvesReader", text:"He knew he was the best since Kaelen. And he kept learning anyway. That's the whole character right there.", time:"1 day ago" },
  ],
  11: [
    { author:"WolvesAndWarCommunity", text:"The dedication — 'For the names on the small list. All seventeen thousand four hundred and twenty-six of them.' — I read it three times before I could start the book.", time:"6 days ago" },
    { author:"AshaKersI_Fan", text:"Asha's thirty-nine-year reign is the backbone of the entire middle of the saga and she doesn't appear in half the books that reference her. That absence is doing serious narrative work.", time:"3 days ago" },
  ],
  31: [
    { author:"GeneralisimaReader", text:"The Seven Days sequence is the best political thriller I've read. Each day another removal. Each removal another silence. By day seven you understand exactly who Selene Jaza is.", time:"2 days ago" },
    { author:"MeraudScholar", text:"Remi Vey's Republic failed because he moved fast without foundations. Selene knew it before she arrived. That's the tragedy of it — he never had a chance.", time:"1 day ago" },
  ],
};

// ─── UTILITY ─────────────────────────────────────────────────────────────────
function StyleInjector() {
  useEffect(() => {
    const tag = document.createElement("style");
    tag.textContent = STYLES;
    document.head.appendChild(tag);
    return () => document.head.removeChild(tag);
  }, []);
  return null;
}

// ─── NAV ─────────────────────────────────────────────────────────────────────
const PAGES = ["home","library","characters","lore","sovereigns","timeline","ixoria","discuss","releases"];

function Nav({ page, go }) {
  return (
    <nav className="nav">
      <div className="nav-brand" onClick={() => go("home")}>The Iseldoran Sagas</div>
      <ul className="nav-links">
        {PAGES.map(p => (
          <li key={p}>
            <button className={page === p ? "active" : ""} onClick={() => go(p)}>
              {p === "discuss" ? "Forum" : p === "releases" ? "Audio & eBooks" : p.charAt(0).toUpperCase() + p.slice(1)}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}

// ─── HOME ─────────────────────────────────────────────────────────────────────
function HomePage({ go }) {
  return (
    <>
      <div className="hero">
        <div className="hero-bg" />
        <div className="hero-grid" />
        <div className="hero-ring" />
        <div className="hero-content">
          <span className="hero-eyebrow">The Official Archive of</span>
          <h1 className="hero-title">The Iseldoran Sagas</h1>
          <div className="hero-sub">Dragon Throne · Black Death · The Forge-Moon · The Star Wolves</div>
          <div className="hero-rule"><div className="hero-gem" /></div>
          <p className="hero-lore">
            Thirty-eight volumes across two universes. 1,747,478+ words. Eight eras of empire, war, and sovereignty.<br />
            From Lucius Luceron I and the Luceron Compact to Mettenik I and the restoration of the bloodline.<br />
            The complete compendium — every emperor, every commander, every war, every world.<br />
            <em style={{color:"var(--gold-dim)"}}>The audiobooks and eBooks are coming. The archive is open now.</em>
          </p>
          <div className="hero-stats">
            {[{n:"38",l:"Volumes"},{n:"1.74M+",l:"Words"},{n:"8",l:"Imperial Eras"},{n:"9",l:"Foundry Houses"},{n:"100+",l:"Characters"},{n:"2",l:"Universes"}].map(s => (
              <div className="hero-stat" key={s.l}>
                <span className="hero-stat-n">{s.n}</span>
                <div className="hero-stat-l">{s.l}</div>
              </div>
            ))}
          </div>
          <div className="hero-cta">
            <button className="btn-primary" onClick={() => go("library")}>Browse All Volumes</button>
            <button className="btn-secondary" onClick={() => go("lore")}>Enter the Compendium</button>
            <button className="btn-secondary" onClick={() => go("releases")}>Audio & eBooks</button>
          </div>
        </div>
      </div>

      {/* Featured quote */}
      <div style={{background:"var(--iron)",borderTop:"1px solid rgba(201,168,76,0.15)",borderBottom:"1px solid rgba(201,168,76,0.15)",padding:"3rem 2rem",textAlign:"center"}}>
        <div style={{maxWidth:"760px",margin:"0 auto"}}>
          <div style={{fontFamily:"var(--font-lore)",fontStyle:"italic",fontSize:"1.25rem",color:"var(--parchment)",lineHeight:1.7,marginBottom:"1rem"}}>
            "The God-Emperors demanded obedience. The Mothers demanded belonging. Men die for obedience. Entire civilisations die for belonging."
          </div>
          <div style={{fontFamily:"var(--font-title)",fontSize:"0.55rem",letterSpacing:"0.25em",color:"var(--gold-dim)",textTransform:"uppercase"}}>
            — Defining axiom of the Twin Thrones era · The Iseldoran Sagas
          </div>
        </div>
      </div>

      {/* Series overview */}
      <div className="section">
        <div className="section-header">
          <span className="section-eyebrow">Two Universes · Thirty-Eight Volumes</span>
          <h2 className="section-title">The Complete Library</h2>
          <div className="section-rule"><span className="section-rule-icon">◈</span></div>
          <p className="section-desc">Compiled by Prince Kairoh Pierre von Care, Master Archivist of the Imperial Archives at Bundchen Prime. All volumes typeset in Garamond. All rights reserved.</p>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))",gap:"1.5rem"}}>
          {[
            { label:"The Iseldoran Sagas", vols:"30 Volumes · 1,747,478 Words", desc:"The complete history of the Dragon Throne — from the Founding Era to the Restoration of the Bloodline. Eight eras. Every emperor. Every war.", color:"var(--gold)", action:"library" },
            { label:"La Generalísima", vols:"2 Volumes + Appendices", desc:"The Seven Days. The fall of the Meraud Free Republic. Selene Jaza and the birth of a title that would outlast the empire it was built to serve.", color:"var(--rust-bright)", action:"library" },
            { label:"Code of Martyrs", vols:"4 Books + Complete Saga", desc:"The Dragon Throne of Maldorus. Ashim and Ishak. The Lattice. The Iron God. A parallel universe built on the same structural tensions as the Iseldoran Sagas.", color:"#b080e0", action:"library" },
          ].map(s => (
            <div key={s.label} style={{background:"var(--iron)",border:"1px solid rgba(201,168,76,0.1)",padding:"1.75rem",transition:"all var(--tr)",cursor:"pointer"}}
              onClick={() => go(s.action)}
              onMouseEnter={e=>e.currentTarget.style.borderColor="rgba(201,168,76,0.3)"}
              onMouseLeave={e=>e.currentTarget.style.borderColor="rgba(201,168,76,0.1)"}
            >
              <div style={{fontFamily:"var(--font-display)",fontSize:"0.9rem",color:s.color,marginBottom:"0.5rem"}}>{s.label}</div>
              <div style={{fontFamily:"var(--font-title)",fontSize:"0.52rem",letterSpacing:"0.18em",textTransform:"uppercase",color:"var(--gold-dim)",marginBottom:"0.85rem"}}>{s.vols}</div>
              <div style={{fontFamily:"var(--font-body)",fontSize:"0.9rem",color:"var(--smoke)",lineHeight:1.65}}>{s.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

// ─── LIBRARY ─────────────────────────────────────────────────────────────────
function BookModal({ book, onClose, discussions, onAddComment }) {
  const [comment, setComment] = useState("");
  const [author, setAuthor] = useState("");
  const threads = discussions[book.id] || [];

  const handleSubmit = () => {
    if (comment.trim() && author.trim()) {
      onAddComment(book.id, { author, text: comment, time: "just now" });
      setComment(""); setAuthor("");
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-tag">{book.series === "martyrs" ? "Code of Martyrs" : book.series === "generalisima" ? "La Generalísima" : "The Iseldoran Sagas"} · Vol. {book.id}</div>
          <h2 className="modal-title">{book.title}</h2>
          <div className="modal-subtitle">{book.sub}</div>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          <div className="modal-reading">
            {book.opening.split("\n\n").map((p, i) => (
              <p key={i} style={{fontStyle: p.startsWith('"') || p.startsWith("'") ? "italic" : "normal"}}>{p}</p>
            ))}
          </div>
          {book.quote && <div className="modal-quote">{book.quote}</div>}
          <div className="modal-meta">
            <div><label>Word Count</label><span>{book.words}</span></div>
            <div><label>Era</label><span>{book.era}</span></div>
            <div><label>Status</label><span>{book.status}</span></div>
            <div><label>Series</label><span>{book.series === "martyrs" ? "Code of Martyrs" : book.series === "generalisima" ? "La Generalísima" : "Iseldoran Sagas"}</span></div>
          </div>
          <div className="discussion">
            <div className="discussion-title">Reader Discussion</div>
            <div className="discussion-threads">
              {threads.length === 0 && <div style={{fontFamily:"var(--font-lore)",fontStyle:"italic",color:"var(--smoke)",fontSize:"0.88rem"}}>Be the first to discuss this volume.</div>}
              {threads.map((t, i) => (
                <div className="thread" key={i}>
                  <div className="thread-author">{t.author}</div>
                  <div className="thread-text">{t.text}</div>
                  <div className="thread-time">{t.time}</div>
                </div>
              ))}
            </div>
            <input
              type="text" placeholder="Your name…" value={author}
              onChange={e => setAuthor(e.target.value)}
              style={{width:"100%",background:"rgba(255,255,255,0.04)",border:"1px solid rgba(201,168,76,0.18)",color:"var(--bone)",fontFamily:"var(--font-body)",fontSize:"0.9rem",padding:"0.55rem 1rem",outline:"none",marginBottom:"0.5rem"}}
            />
            <textarea className="thread-input" placeholder="Share your thoughts on this volume…" value={comment} onChange={e => setComment(e.target.value)} />
            <button className="thread-submit" onClick={handleSubmit}>Post Comment</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function LibraryPage() {
  const [search, setSearch] = useState("");
  const [series, setSeries] = useState("all");
  const [selected, setSelected] = useState(null);
  const [discussions, setDiscussions] = useState(SEED_DISCUSSIONS);

  const filtered = BOOKS.filter(b => {
    const ms = b.title.toLowerCase().includes(search.toLowerCase()) || b.excerpt.toLowerCase().includes(search.toLowerCase()) || b.era.toLowerCase().includes(search.toLowerCase());
    const mf = series === "all" || b.series === series;
    return ms && mf;
  });

  const addComment = (bookId, comment) => {
    setDiscussions(prev => ({ ...prev, [bookId]: [...(prev[bookId] || []), comment] }));
  };

  return (
    <div style={{paddingTop:"80px"}}>
      <div className="section">
        <div className="section-header">
          <span className="section-eyebrow">The Complete Library · 1,747,478+ Words · 38 Volumes</span>
          <h2 className="section-title">All Volumes</h2>
          <div className="section-rule"><span className="section-rule-icon">◈</span></div>
          <p className="section-desc">Compiled by Prince Kairoh Pierre von Care, Master Archivist. Click any volume to read the opening and join the discussion.</p>
        </div>
        <div className="filter-bar">
          <input className="global-search" placeholder="Search by title, era, or theme…" value={search} onChange={e => setSearch(e.target.value)} />
          {[["all","All Series"],["iseldoran","Iseldoran Sagas"],["generalisima","La Generalísima"],["martyrs","Code of Martyrs"]].map(([val,lab]) => (
            <button key={val} className={`filter-btn ${series===val?"active":""}`} onClick={() => setSeries(val)}>{lab}</button>
          ))}
        </div>
        <div className="books-grid">
          {filtered.map(b => (
            <div className="book-card" key={b.id} onClick={() => setSelected(b)}>
              <div className="book-cover">
                <div className="book-num">#{b.id.toString().padStart(2,"0")}</div>
                <span className={`book-series-tag ${b.series}`}>
                  {b.series === "martyrs" ? "Martyrs" : b.series === "generalisima" ? "Generalísima" : "Iseldoran"}
                </span>
                <div className="book-cover-ph">
                  <div className="book-cover-ph-icon">◈</div>
                  <div className="book-cover-ph-title">{b.title}</div>
                </div>
              </div>
              <div className="book-info">
                <div className="book-title">{b.title}</div>
                <div className="book-subtitle-sm">{b.sub}</div>
                <div className="book-words">{b.words} words</div>
                <div className="book-excerpt">{b.excerpt}</div>
                <div className="book-links">
                  <button className="book-link read" onClick={e=>{e.stopPropagation();setSelected(b);}}>Read Opening</button>
                  <button className="book-link kindle" onClick={e=>{e.stopPropagation();alert("eBook & audiobook releases coming soon. Notify me via the Releases page.");}}>Notify Me</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {selected && <BookModal book={selected} onClose={() => setSelected(null)} discussions={discussions} onAddComment={addComment} />}
    </div>
  );
}

// ─── CHARACTERS ───────────────────────────────────────────────────────────────
function CharacterModal({ char, onClose }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-tag">Character Archive · {char.era}</div>
          <h2 className="modal-title">{char.n}</h2>
          <div className="modal-subtitle">{char.e}</div>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          <div className="modal-reading" style={{maxHeight:"none"}}>
            <p>{char.desc}</p>
          </div>
          <div className="modal-meta">
            <div><label>Era</label><span>{char.era}</span></div>
            <div><label>Faction</label><span>{char.faction}</span></div>
            <div><label>Appears In</label><span>{char.appears}</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CharactersPage() {
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState("");
  const filtered = CHARACTERS.filter(c => c.n.toLowerCase().includes(search.toLowerCase()) || c.e.toLowerCase().includes(search.toLowerCase()) || c.era.toLowerCase().includes(search.toLowerCase()) || c.faction.toLowerCase().includes(search.toLowerCase()));
  return (
    <div style={{paddingTop:"80px"}}>
      <div className="section">
        <div className="section-header">
          <span className="section-eyebrow">Imperial Portrait Archive · Bundchen Prime</span>
          <h2 className="section-title">Characters</h2>
          <div className="section-rule"><span className="section-rule-icon">◈</span></div>
          <p className="section-desc">The God-Emperors, commanders, advisors, and figures of the Iseldoran Sagas. Click any portrait to read the full character entry.</p>
        </div>
        <div className="filter-bar" style={{marginBottom:"2.5rem"}}>
          <input className="global-search" placeholder="Search characters…" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div className="portraits-grid">
          {filtered.map((c, i) => (
            <div className="portrait-card" key={i} onClick={() => setSelected(c)}>
              <div className="portrait-ph">◈</div>
              <div className="portrait-info">
                <div className="portrait-name">{c.n}</div>
                <div className="portrait-epithet">{c.e}</div>
                <div className="portrait-era">{c.era}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {selected && <CharacterModal char={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}

// ─── LORE COMPENDIUM ─────────────────────────────────────────────────────────
function LoreModal({ entry, onClose }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-tag">{LORE_CATS.find(c=>c.id===entry.cat)?.label} · {entry.era}</div>
          <h2 className="modal-title">{entry.title}</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          <div className="modal-reading" style={{maxHeight:"none"}}>
            {entry.full.split("\n\n").map((p,i) => <p key={i}>{p}</p>)}
          </div>
          {entry.quote && <div className="modal-quote">{entry.quote}</div>}
        </div>
      </div>
    </div>
  );
}

function LorePage() {
  const [cat, setCat] = useState("all");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);
  const filtered = LORE.filter(e => (cat==="all"||e.cat===cat) && (e.title.toLowerCase().includes(search.toLowerCase())||e.excerpt.toLowerCase().includes(search.toLowerCase())));
  const counts = Object.fromEntries(LORE_CATS.map(c=>[c.id,c.id==="all"?LORE.length:LORE.filter(e=>e.cat===c.id).length]));
  return (
    <div style={{paddingTop:"80px"}}>
      <div className="section">
        <div className="section-header">
          <span className="section-eyebrow">Imperial Archive · Bundchen Prime</span>
          <h2 className="section-title">The Lore Compendium</h2>
          <div className="section-rule"><span className="section-rule-icon">◈</span></div>
          <p className="section-desc">Characters, factions, locations, events, traditions, and technology. Every entry compiled from primary sources by Prince Kairoh Pierre von Care.</p>
        </div>
        <div className="lore-layout">
          <div className="lore-sidebar">
            <div className="lore-sidebar-hdr">Archive Categories</div>
            <input className="lore-search" placeholder="Search the archive…" value={search} onChange={e => setSearch(e.target.value)} />
            {LORE_CATS.map(c => (
              <button key={c.id} className={`lore-cat-btn ${cat===c.id?"active":""}`} onClick={() => setCat(c.id)}>
                <span>{c.icon}</span><span>{c.label}</span>
                <span className="lore-cat-count">{counts[c.id]}</span>
              </button>
            ))}
          </div>
          <div>
            <div className="lore-entries">
              {filtered.map(e => (
                <div className="lore-entry" key={e.id} onClick={() => setSelected(e)}>
                  <div className="lore-entry-tag">{LORE_CATS.find(c=>c.id===e.cat)?.icon} {LORE_CATS.find(c=>c.id===e.cat)?.label} · {e.era}</div>
                  <div className="lore-entry-title">{e.title}</div>
                  <div className="lore-entry-excerpt">{e.excerpt}</div>
                </div>
              ))}
              {filtered.length === 0 && <div style={{gridColumn:"1/-1",textAlign:"center",padding:"3rem",color:"var(--smoke)",fontFamily:"var(--font-lore)",fontStyle:"italic"}}>No entries found for that search.</div>}
            </div>
          </div>
        </div>
      </div>
      {selected && <LoreModal entry={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}

// ─── SOVEREIGNS ───────────────────────────────────────────────────────────────
function SovereignsPage() {
  const [search, setSearch] = useState("");
  const [activeEra, setActiveEra] = useState("all");
  const eras = ["all", ...SOVEREIGNS_DATA.map(e => e.era)];
  const filtered = SOVEREIGNS_DATA
    .filter(e => activeEra === "all" || e.era === activeEra)
    .map(e => ({...e, rulers: e.rulers.filter(r => r.name.toLowerCase().includes(search.toLowerCase()) || r.epithet.toLowerCase().includes(search.toLowerCase()))}))
    .filter(e => e.rulers.length > 0);

  return (
    <div style={{paddingTop:"80px"}}>
      <div className="section">
        <div className="section-header">
          <span className="section-eyebrow">The Authoritative Chronological Record · Dragon Throne</span>
          <h2 className="section-title">Sovereigns of the Dragon Throne</h2>
          <div className="section-rule"><span className="section-rule-icon">◈</span></div>
          <p className="section-desc">From Eustace I to Mettenik I — the complete line of God-Emperors, Empresses, and those who held the throne by force or by right.</p>
        </div>
        <div style={{display:"flex",gap:"1rem",marginBottom:"2rem",flexWrap:"wrap",alignItems:"center"}}>
          <input className="global-search" placeholder="Search sovereigns…" value={search} onChange={e => setSearch(e.target.value)} style={{maxWidth:"300px"}} />
        </div>
        <div style={{display:"flex",gap:"0.4rem",flexWrap:"wrap",marginBottom:"2.5rem"}}>
          {eras.map(e => (
            <button key={e} className={`filter-btn ${activeEra===e?"active":""}`} onClick={() => setActiveEra(e)}>
              {e === "all" ? "All Eras" : e}
            </button>
          ))}
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:"2.5rem"}}>
          {filtered.map((eraGroup, gi) => (
            <div className="sovereign-era" key={gi}>
              <div className="sovereign-era-hdr">
                <div className="sovereign-era-bar" style={{background:eraGroup.color}} />
                <div className="sovereign-era-name" style={{color:eraGroup.color}}>{eraGroup.era}</div>
              </div>
              <div className="sovereign-grid">
                {eraGroup.rulers.map((r, ri) => (
                  <div className="sovereign-card" key={ri}>
                    <div className="sovereign-name">{r.name}</div>
                    <div className="sovereign-epithet" style={{color:eraGroup.color}}>{r.epithet}</div>
                    {r.note && <div className="sovereign-note">{r.note}</div>}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── TIMELINE ─────────────────────────────────────────────────────────────────
function TimelinePage() {
  return (
    <div style={{paddingTop:"80px"}}>
      <div className="section">
        <div className="section-header">
          <span className="section-eyebrow">Eight Eras · The Shape of an Empire Across Time</span>
          <h2 className="section-title">The Imperial Timeline</h2>
          <div className="section-rule"><span className="section-rule-icon">◈</span></div>
          <p className="section-desc">Compiled from primary sources by Prince Kairoh Pierre von Care, Master Archivist. All dates subject to archival revision.</p>
        </div>
        <div className="timeline">
          {TIMELINE.map(era => (
            <div className="tl-era" key={era.id}>
              <div className="tl-dot" />
              <div className="tl-era-date">{era.date}</div>
              <div className="tl-era-title">{era.title}</div>
              <div className="tl-era-desc">{era.desc}</div>
              <div className="tl-events">
                {era.events.map((ev, i) => (
                  <div className="tl-event" key={i}>
                    <div className="tl-event-y">{ev.y}</div>
                    <div className="tl-event-t">{ev.t}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── IXORIA ───────────────────────────────────────────────────────────────────
function IxoriaPage() {
  return (
    <div style={{paddingTop:"80px"}}>
      <div className="section">
        <div className="section-header">
          <span className="section-eyebrow">The Forge-Moon · The Kasparian Belt · Vey Ashur</span>
          <h2 className="section-title">Ixoria</h2>
          <div className="section-rule"><span className="section-rule-icon">◈</span></div>
          <p className="section-desc" style={{maxWidth:"720px"}}>Steel remembers the hand that shaped it. The largest military foundry in the known worlds. Three foldgates from New Terra. Built on Ixoria is shorthand for war-ready.</p>
        </div>

        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(300px,1fr))",gap:"2rem",marginBottom:"3rem"}}>
          {[
            { title:"The Dock-Rings", desc:"Controlled by House Taleth. What leaves Ixoria, leaves through them. The Seven Fleet Launch — seven battle fleets in thirty-six hours — was executed from these rings. The exhaust burned the orbital sky gold for three nights." },
            { title:"The Death-Steel Tradition", desc:"Metal that has served in war is not scrap. House Ixen maintains armour crypts. Names are inscribed in reactor housings. Workers refuse to scrap famous armour. The dead are scattered into smelters — the culture's highest honour." },
            { title:"The Cooling Riots", desc:"House Varekh redirected coolant in a revenue dispute. 2.4 million dead. Eleven days. Director Havel was executed. The House survived. The archive classified it as an 'industrial administrative incident.'" },
          ].map(item => (
            <div key={item.title} style={{background:"var(--iron)",border:"1px solid rgba(201,168,76,0.1)",padding:"1.5rem"}}>
              <div style={{fontFamily:"var(--font-title)",fontSize:"0.72rem",letterSpacing:"0.18em",textTransform:"uppercase",color:"var(--gold)",marginBottom:"0.75rem"}}>{item.title}</div>
              <div style={{fontFamily:"var(--font-body)",color:"var(--smoke)",fontSize:"0.9rem",lineHeight:1.65}}>{item.desc}</div>
            </div>
          ))}
        </div>

        <div className="modal-quote" style={{marginBottom:"3rem",maxWidth:"680px"}}>
          "Steel remembers the hand that shaped it. The hand does not wait to see where the steel lands."
          <div style={{fontFamily:"var(--font-title)",fontSize:"0.48rem",letterSpacing:"0.2em",marginTop:"0.5rem",color:"var(--gold-dim)"}}>— HOUSE IXEN MOTTO</div>
        </div>

        <div style={{fontFamily:"var(--font-title)",fontSize:"0.58rem",letterSpacing:"0.35em",textTransform:"uppercase",color:"var(--gold-dim)",marginBottom:"1.5rem",textAlign:"center"}}>The Nine Foundry Houses</div>
        <div className="houses-grid">
          {NINE_HOUSES.map(h => (
            <div className="house-card" key={h.name}>
              <div className="house-name">{h.name}</div>
              <div className="house-specialty">{h.specialty}</div>
              <div className="house-motto">{h.motto}</div>
              <div className="house-desc">{h.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── DISCUSSION FORUM ─────────────────────────────────────────────────────────
function DiscussPage() {
  const [activeThread, setActiveThread] = useState("general");
  const [threads, setThreads] = useState({
    general: [
      { author:"ArchiveReader", text:"The moment I understood that Leraq has been present through all eight eras — watching, advising, recording — the entire saga reconfigured itself in my head. He's not a character in the story. He's the reason we have the story.", time:"5 days ago" },
      { author:"IseldoranFan", text:"The thing that gets me about the Black Death is the silence. 'Advance in silence — only boots, respirator filters, distant artillery.' That restraint in how they're described makes them terrifying.", time:"3 days ago" },
      { author:"CompendiumScholar", text:"Waiting for someone to do a full analysis of the Mourning Corridor Crisis. The Twin Thrones era is the most politically sophisticated writing in the series.", time:"1 day ago" },
    ],
    characters: [
      { author:"KaelenFan", text:"Asha Kers I carried the small list for thirty-nine years. Seventeen thousand four hundred and twenty-six names. The folio of plain dark wood. That detail is the whole character.", time:"4 days ago" },
      { author:"ThunderbornReader", text:"Niccolò's death hits differently after you've read Khutun's Revenge. You read the setup and the aftermath in the same archive. Khutun's thirty years of boxes. Each label a year.", time:"2 days ago" },
      { author:"MaldorusFan", text:"Augustus Dominus Rex believed he was a god. Not as a political performance. Genuinely. And the terrifying thing is you understand why, by the end.", time:"1 day ago" },
    ],
    lore: [
      { author:"IxoriaScholar", text:"The Death-Steel tradition is one of the most originally conceived cultural details in the saga. The idea that the dead are scattered into smelters — that metal carries memory — and then the workers refusing to scrap famous armour. It's completely coherent.", time:"6 days ago" },
      { author:"BeltReader", text:"House Varekh redirected coolant and 2.4 million people died in eleven days, and the House survived. The archive calls it an 'industrial administrative incident.' That gap between reality and language is very deliberately constructed.", time:"3 days ago" },
      { author:"CompendiumScholar", text:"Leraq's distinction between being called 'wise by those who had never met wise' and actually being wise is one of the sharpest things in the whole archive.", time:"1 day ago" },
    ],
    releases: [
      { author:"AudiobookWatcher", text:"Which volumes are getting audiobooks first? I'd assume Kaelen I and La Generalísima have the strongest audio potential.", time:"2 days ago" },
      { author:"eBookFan", text:"Is there a release order for the ebooks? Reading the saga in publication order versus chronological order gives such different experiences.", time:"1 day ago" },
      { author:"ArchiveReader", text:"The reading order question is fascinating. I'd argue chronological for first timers. Publication order rewards people who already know the arc.", time:"12 hours ago" },
    ],
  });
  const [newText, setNewText] = useState("");
  const [newAuthor, setNewAuthor] = useState("");

  const FORUM_TABS = [
    { id:"general", label:"General Discussion" },
    { id:"characters", label:"Characters" },
    { id:"lore", label:"Lore & World" },
    { id:"releases", label:"Audio & eBooks" },
  ];

  const addPost = () => {
    if (newText.trim() && newAuthor.trim()) {
      setThreads(prev => ({ ...prev, [activeThread]: [...(prev[activeThread]||[]), { author:newAuthor, text:newText, time:"just now" }] }));
      setNewText(""); setNewAuthor("");
    }
  };

  return (
    <div style={{paddingTop:"80px"}}>
      <div className="section">
        <div className="section-header">
          <span className="section-eyebrow">Community · Open to All Readers</span>
          <h2 className="section-title">The Reader's Forum</h2>
          <div className="section-rule"><span className="section-rule-icon">◈</span></div>
          <p className="section-desc">Discuss the Iseldoran Sagas before the audiobooks and eBooks launch. Every voice recorded. Every name remembered.</p>
        </div>

        <div className="filter-bar" style={{marginBottom:"2rem"}}>
          {FORUM_TABS.map(t => (
            <button key={t.id} className={`filter-btn ${activeThread===t.id?"active":""}`} onClick={() => setActiveThread(t.id)}>{t.label}</button>
          ))}
        </div>

        <div style={{display:"grid",gridTemplateColumns:"1fr 340px",gap:"2rem",alignItems:"start"}}>
          <div>
            <div className="discussion-threads" style={{marginBottom:"1.5rem"}}>
              {(threads[activeThread]||[]).map((t,i) => (
                <div className="thread" key={i}>
                  <div className="thread-author">{t.author}</div>
                  <div className="thread-text">{t.text}</div>
                  <div className="thread-time">{t.time}</div>
                </div>
              ))}
            </div>
            <div style={{background:"var(--iron)",border:"1px solid rgba(201,168,76,0.1)",padding:"1.5rem"}}>
              <div className="discussion-title">Add to the Discussion</div>
              <input type="text" placeholder="Your archive name…" value={newAuthor} onChange={e=>setNewAuthor(e.target.value)}
                style={{width:"100%",background:"rgba(255,255,255,0.04)",border:"1px solid rgba(201,168,76,0.15)",color:"var(--bone)",fontFamily:"var(--font-body)",fontSize:"0.9rem",padding:"0.55rem 1rem",outline:"none",marginBottom:"0.75rem"}} />
              <textarea className="thread-input" placeholder="Share your thoughts…" value={newText} onChange={e=>setNewText(e.target.value)} style={{minHeight:"90px"}} />
              <button className="thread-submit" onClick={addPost}>Post to Archive</button>
            </div>
          </div>

          <div style={{display:"flex",flexDirection:"column",gap:"1rem"}}>
            <div style={{background:"var(--iron)",border:"1px solid rgba(201,168,76,0.1)",padding:"1.25rem"}}>
              <div style={{fontFamily:"var(--font-title)",fontSize:"0.55rem",letterSpacing:"0.22em",textTransform:"uppercase",color:"var(--gold-dim)",marginBottom:"1rem"}}>Forum Topics</div>
              {[
                "Who is the most significant character in the saga?",
                "Best political thriller moment in the archive",
                "Leraq's role — what does the Va Sumir Advisor know?",
                "The small list — 17,426 names. Who were they?",
                "Death-Steel: the most original worldbuilding detail?",
                "Reading order: chronological vs publication?",
              ].map((q,i) => (
                <div key={i} style={{fontFamily:"var(--font-body)",fontSize:"0.85rem",color:"var(--smoke)",padding:"0.5rem 0",borderBottom:"1px solid rgba(201,168,76,0.06)",lineHeight:1.5,cursor:"pointer"}}
                  onMouseEnter={e=>e.currentTarget.style.color="var(--bone)"}
                  onMouseLeave={e=>e.currentTarget.style.color="var(--smoke)"}
                >{q}</div>
              ))}
            </div>
            <div className="modal-quote" style={{fontSize:"0.88rem"}}>
              "The archive is not passive. It records. And what it records, it preserves — as argument."
              <div style={{fontFamily:"var(--font-title)",fontSize:"0.45rem",letterSpacing:"0.2em",marginTop:"0.5rem",color:"var(--gold-dim)"}}>— PRINCE KAIROH PIERRE VON CARE</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── RELEASES ─────────────────────────────────────────────────────────────────
function ReleasesPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [pref, setPref] = useState("both");

  const handleNotify = () => {
    if (email.trim()) { setSubmitted(true); }
  };

  const UPCOMING = [
    { format:"Audiobook", vol:"The Black Death: Kaelen I", desc:"Full cast. 88,690 words. The coronation declaration. The edge of known space.", status:"In Production" },
    { format:"Audiobook", vol:"La Generalísima", desc:"Single narrator. The Seven Days. The fall of the Meraud Free Republic.", status:"In Production" },
    { format:"eBook", vol:"Complete Iseldoran Sagas Library", desc:"All 30 volumes. Fully formatted. Garamond typeset. Publisher-ready editions.", status:"Final Formatting" },
    { format:"eBook", vol:"La Generalísima — Complete Edition", desc:"Narrative + Appendices & Notes. 93/100 publisher score.", status:"Ready" },
    { format:"Audiobook", vol:"Wolves and War", desc:"Books I & II. 137,270 words. The small list. Hesh-Kar.", status:"Scheduled" },
    { format:"Audiobook", vol:"No Gods No Masters", desc:"The Legion of Tired Gods. Raja the Brilliant. The Luceron Compact.", status:"Scheduled" },
    { format:"eBook", vol:"Code of Martyrs — Complete Saga", desc:"Books I–IV. The Dragon Throne of Maldorus. The Lattice.", status:"In Formatting" },
  ];

  return (
    <div style={{paddingTop:"80px"}}>
      <div className="section">
        <div className="section-header">
          <span className="section-eyebrow">Coming Soon · Audio & Digital Editions</span>
          <h2 className="section-title">Audio & eBook Releases</h2>
          <div className="section-rule"><span className="section-rule-icon">◈</span></div>
          <p className="section-desc">The Iseldoran Sagas are coming to audio and digital formats. Register below to be notified when each volume releases.</p>
        </div>

        <div className="release-banner">
          <h3>The Archive Opens</h3>
          <p>Thirty-eight volumes. 1,747,478 words. Eight eras of empire, war, and sovereignty. Coming to your ears and your screen.</p>
          {!submitted ? (
            <div className="notify-form">
              <input className="notify-input" placeholder="Your email address…" value={email} onChange={e => setEmail(e.target.value)} />
              <select value={pref} onChange={e=>setPref(e.target.value)} style={{background:"rgba(255,255,255,0.07)",border:"1px solid rgba(201,168,76,0.25)",color:"var(--bone)",fontFamily:"var(--font-body)",fontSize:"0.9rem",padding:"0.6rem 1rem",outline:"none"}}>
                <option value="both">Audio & eBooks</option>
                <option value="audio">Audiobooks only</option>
                <option value="ebook">eBooks only</option>
              </select>
              <button className="notify-btn" onClick={handleNotify}>Notify Me</button>
            </div>
          ) : (
            <div style={{fontFamily:"var(--font-lore)",fontStyle:"italic",color:"var(--gold)",fontSize:"1rem"}}>
              ✦ Registered. Your name is in the archive. You will be notified.
            </div>
          )}
        </div>

        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(320px,1fr))",gap:"1.25rem",marginBottom:"3rem"}}>
          {UPCOMING.map((item, i) => (
            <div key={i} style={{background:"var(--iron)",border:"1px solid rgba(201,168,76,0.1)",padding:"1.5rem",display:"flex",flexDirection:"column",gap:"0.5rem"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <div style={{fontFamily:"var(--font-title)",fontSize:"0.52rem",letterSpacing:"0.18em",textTransform:"uppercase",color:item.format==="Audiobook"?"var(--rust-bright)":"#b080e0"}}>{item.format}</div>
                <div style={{fontFamily:"var(--font-title)",fontSize:"0.47rem",letterSpacing:"0.14em",color:item.status==="Ready"?"var(--gold)":"var(--smoke)",textTransform:"uppercase"}}>{item.status}</div>
              </div>
              <div style={{fontFamily:"var(--font-title)",fontSize:"0.82rem",color:"var(--parchment)",lineHeight:1.3}}>{item.vol}</div>
              <div style={{fontFamily:"var(--font-body)",fontSize:"0.85rem",color:"var(--smoke)",lineHeight:1.55}}>{item.desc}</div>
            </div>
          ))}
        </div>

        <div style={{background:"var(--iron)",border:"1px solid rgba(201,168,76,0.1)",padding:"2rem",textAlign:"center"}}>
          <div style={{fontFamily:"var(--font-title)",fontSize:"0.58rem",letterSpacing:"0.3em",textTransform:"uppercase",color:"var(--gold-dim)",marginBottom:"1rem"}}>Release Schedule</div>
          <div style={{fontFamily:"var(--font-lore)",fontStyle:"italic",color:"var(--mist)",fontSize:"0.95rem",marginBottom:"0.5rem"}}>
            All releases will be announced via email notification and posted to this page first.
          </div>
          <div style={{fontFamily:"var(--font-body)",color:"var(--smoke)",fontSize:"0.88rem",lineHeight:1.6,maxWidth:"580px",margin:"0 auto"}}>
            The Iseldoran Sagas are publisher-ready. Volumes are being released in strategic order — the most complete standalone narratives first, followed by the longer saga arcs. Register above to follow each release.
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── FOOTER ─────────────────────────────────────────────────────────────────
function Footer({ go }) {
  return (
    <footer className="footer">
      <div className="footer-brand">The Iseldoran Sagas</div>
      <div className="footer-tagline">"Loyalty is reality. Reality is law. Law is eternal."</div>
      <ul className="footer-links">
        {PAGES.map(p => (
          <li key={p}>
            <button onClick={() => go(p)}>
              {p === "discuss" ? "Forum" : p === "releases" ? "Audio & eBooks" : p.charAt(0).toUpperCase() + p.slice(1)}
            </button>
          </li>
        ))}
      </ul>
      <div className="footer-copy">© {new Date().getFullYear()} Prince Kairoh Pierre von Care · The Imperial Archives at Bundchen Prime · All rights reserved</div>
    </footer>
  );
}

// ─── APP ─────────────────────────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState("home");
  const go = p => { setPage(p); window.scrollTo({ top: 0, behavior: "smooth" }); };

  return (
    <>
      <StyleInjector />
      <Nav page={page} go={go} />
      {page === "home" && <HomePage go={go} />}
      {page === "library" && <LibraryPage />}
      {page === "characters" && <CharactersPage />}
      {page === "lore" && <LorePage />}
      {page === "sovereigns" && <SovereignsPage />}
      {page === "timeline" && <TimelinePage />}
      {page === "ixoria" && <IxoriaPage />}
      {page === "discuss" && <DiscussPage />}
      {page === "releases" && <ReleasesPage />}
      <Footer go={go} />
    </>
  );
}
