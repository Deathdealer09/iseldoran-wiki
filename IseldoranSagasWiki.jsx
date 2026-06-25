const { useState, useEffect, useRef } = React;

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Cinzel+Decorative:wght@400;700;900&family=Cinzel:wght@400;600;700&family=IM+Fell+English:ital@0;1&family=Crimson+Pro:ital,wght@0,300;0,400;0,600;1,300;1,400&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --void: #08070a; --forge: #0f0d12; --iron: #1a1620; --ash: #2a2430;
    --ember: #3d2f1a; --gold: #c9a84c; --gold-bright: #e8c76a; --gold-dim: #7a5e28;
    --rust: #8b3a1e; --rust-bright: #c4522a; --blood: #5c1515; --bone: #d4c9b0;
    --parchment: #e8dfc8; --smoke: #6b6070; --mist: #9a8fa0; --violet: #4a2d6b;
    --font-display: 'Cinzel Decorative', serif; --font-title: 'Cinzel', serif;
    --font-body: 'Crimson Pro', serif; --font-lore: 'IM Fell English', serif;
    --transition: 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }
  html { scroll-behavior: smooth; }
  body { background: var(--void); color: var(--bone); font-family: var(--font-body); font-size: 18px; line-height: 1.7; overflow-x: hidden; }
  body::before { content: ''; position: fixed; inset: 0; background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E"); pointer-events: none; z-index: 9999; opacity: 0.6; }
  ::-webkit-scrollbar { width: 6px; } ::-webkit-scrollbar-track { background: var(--void); } ::-webkit-scrollbar-thumb { background: var(--gold-dim); }
  .nav { position: fixed; top: 0; left: 0; right: 0; z-index: 1000; background: linear-gradient(180deg, rgba(8,7,10,0.98) 0%, rgba(8,7,10,0.85) 100%); border-bottom: 1px solid rgba(201,168,76,0.2); backdrop-filter: blur(12px); padding: 0 1.5rem; display: flex; align-items: center; justify-content: space-between; height: 64px; }
  .nav-brand { font-family: var(--font-display); font-size: 0.78rem; color: var(--gold); letter-spacing: 0.08em; cursor: pointer; transition: color var(--transition); }
  .nav-brand:hover { color: var(--gold-bright); }
  .nav-links { display: flex; gap: 0.1rem; list-style: none; flex-wrap: wrap; }
  .nav-links button { background: none; border: none; color: var(--mist); font-family: var(--font-title); font-size: 0.6rem; letter-spacing: 0.1em; text-transform: uppercase; padding: 0.45rem 0.7rem; cursor: pointer; transition: color var(--transition); position: relative; }
  .nav-links button::after { content: ''; position: absolute; bottom: 2px; left: 50%; right: 50%; height: 1px; background: var(--gold); transition: left var(--transition), right var(--transition); }
  .nav-links button:hover { color: var(--gold); }
  .nav-links button:hover::after, .nav-links button.active::after { left: 0.7rem; right: 0.7rem; }
  .nav-links button.active { color: var(--gold-bright); }
  .hero { min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; position: relative; overflow: hidden; padding: 6rem 2rem 4rem; }
  .hero-bg { position: absolute; inset: 0; background: radial-gradient(ellipse 80% 60% at 50% 100%, rgba(61,47,26,0.6) 0%, transparent 70%), radial-gradient(ellipse 40% 40% at 20% 20%, rgba(139,58,30,0.15) 0%, transparent 60%), radial-gradient(ellipse 30% 30% at 80% 70%, rgba(74,45,107,0.12) 0%, transparent 60%), linear-gradient(180deg, #08070a 0%, #0f0d12 40%, #1a1620 100%); }
  .hero-grid { position: absolute; inset: 0; background-image: linear-gradient(rgba(201,168,76,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(201,168,76,0.04) 1px, transparent 1px); background-size: 60px 60px; mask-image: radial-gradient(ellipse at center, black 20%, transparent 75%); }
  .hero-ring { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 600px; height: 600px; border: 1px solid rgba(201,168,76,0.06); border-radius: 50%; animation: slowRotate 120s linear infinite; }
  .hero-ring::before { content: ''; position: absolute; inset: 30px; border: 1px solid rgba(201,168,76,0.04); border-radius: 50%; animation: slowRotate 80s linear infinite reverse; }
  @keyframes slowRotate { to { transform: translate(-50%, -50%) rotate(360deg); } }
  .hero-content { position: relative; z-index: 1; text-align: center; max-width: 900px; }
  .hero-eyebrow { font-family: var(--font-title); font-size: 0.65rem; letter-spacing: 0.4em; text-transform: uppercase; color: var(--gold-dim); margin-bottom: 1.5rem; animation: fadeUp 1s ease 0.2s both; display: block; }
  .hero-title { font-family: var(--font-display); font-size: clamp(2.6rem, 6.5vw, 5.5rem); font-weight: 900; color: var(--gold); line-height: 1.05; text-shadow: 0 0 60px rgba(201,168,76,0.3), 0 4px 30px rgba(0,0,0,0.8); letter-spacing: 0.04em; margin-bottom: 0.5rem; animation: fadeUp 1s ease 0.4s both; }
  .hero-subtitle { font-family: var(--font-title); font-size: clamp(0.65rem, 1.8vw, 0.85rem); color: var(--rust-bright); letter-spacing: 0.3em; text-transform: uppercase; margin-bottom: 2rem; animation: fadeUp 1s ease 0.6s both; }
  .hero-rule { display: flex; align-items: center; gap: 1rem; justify-content: center; margin: 1.5rem 0 2.5rem; animation: fadeUp 1s ease 0.7s both; }
  .hero-rule::before, .hero-rule::after { content: ''; flex: 1; max-width: 160px; height: 1px; background: linear-gradient(90deg, transparent, var(--gold-dim)); }
  .hero-rule::after { background: linear-gradient(270deg, transparent, var(--gold-dim)); }
  .hero-gem { width: 8px; height: 8px; background: var(--gold); transform: rotate(45deg); box-shadow: 0 0 12px var(--gold); }
  .hero-lore { font-family: var(--font-lore); font-style: italic; font-size: 1.1rem; color: var(--mist); max-width: 640px; margin: 0 auto 3rem; animation: fadeUp 1s ease 0.8s both; }
  .hero-cta { display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap; animation: fadeUp 1s ease 1s both; }
  @keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
  .btn-primary { font-family: var(--font-title); font-size: 0.68rem; letter-spacing: 0.18em; text-transform: uppercase; color: var(--void); background: linear-gradient(135deg, var(--gold-bright), var(--gold)); border: none; padding: 0.85rem 2rem; cursor: pointer; transition: all var(--transition); clip-path: polygon(8px 0%, 100% 0%, calc(100% - 8px) 100%, 0% 100%); }
  .btn-primary:hover { background: linear-gradient(135deg, #fff0a0, var(--gold-bright)); transform: translateY(-2px); box-shadow: 0 8px 30px rgba(201,168,76,0.4); }
  .btn-secondary { font-family: var(--font-title); font-size: 0.68rem; letter-spacing: 0.18em; text-transform: uppercase; color: var(--gold); background: transparent; border: 1px solid var(--gold-dim); padding: 0.85rem 2rem; cursor: pointer; transition: all var(--transition); clip-path: polygon(8px 0%, 100% 0%, calc(100% - 8px) 100%, 0% 100%); }
  .btn-secondary:hover { border-color: var(--gold); background: rgba(201,168,76,0.08); transform: translateY(-2px); }
  .section { padding: 5rem 2rem; max-width: 1400px; margin: 0 auto; }
  .section-header { text-align: center; margin-bottom: 3.5rem; }
  .section-eyebrow { font-family: var(--font-title); font-size: 0.58rem; letter-spacing: 0.45em; text-transform: uppercase; color: var(--rust-bright); margin-bottom: 1rem; display: block; }
  .section-title { font-family: var(--font-display); font-size: clamp(1.6rem, 3.5vw, 2.6rem); color: var(--gold); line-height: 1.2; text-shadow: 0 0 40px rgba(201,168,76,0.2); }
  .section-rule { display: flex; align-items: center; gap: 1rem; justify-content: center; margin: 1.25rem 0; }
  .section-rule::before, .section-rule::after { content: ''; flex: 1; max-width: 100px; height: 1px; background: linear-gradient(90deg, transparent, var(--gold-dim)); }
  .section-rule::after { background: linear-gradient(270deg, transparent, var(--gold-dim)); }
  .section-rule-icon { color: var(--gold-dim); font-size: 0.75rem; }
  .section-desc { font-family: var(--font-lore); font-style: italic; color: var(--mist); max-width: 600px; margin: 0 auto; font-size: 1rem; }
  .stats-bar { background: linear-gradient(135deg, var(--ember) 0%, var(--blood) 50%, var(--forge) 100%); border-top: 1px solid rgba(201,168,76,0.15); border-bottom: 1px solid rgba(201,168,76,0.15); padding: 2rem; display: grid; grid-template-columns: repeat(5, 1fr); gap: 1.5rem; text-align: center; }
  .stat-number { font-family: var(--font-display); font-size: 2rem; color: var(--gold); display: block; text-shadow: 0 0 30px rgba(201,168,76,0.3); }
  .stat-label { font-family: var(--font-title); font-size: 0.52rem; letter-spacing: 0.22em; text-transform: uppercase; color: var(--smoke); margin-top: 0.2rem; }
  /* BOOK COVERS */
  .books-filter { display: flex; gap: 0.5rem; flex-wrap: wrap; margin-bottom: 2rem; align-items: center; }
  .filter-btn { font-family: var(--font-title); font-size: 0.55rem; letter-spacing: 0.15em; text-transform: uppercase; padding: 0.35rem 0.75rem; background: transparent; border: 1px solid var(--ash); color: var(--smoke); cursor: pointer; transition: all var(--transition); }
  .filter-btn:hover { border-color: var(--gold-dim); color: var(--gold); }
  .filter-btn.active { background: rgba(201,168,76,0.12); border-color: var(--gold); color: var(--gold); }
  .books-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(185px, 1fr)); gap: 1.1rem; }
  .book-card { background: linear-gradient(160deg, var(--iron) 0%, var(--forge) 100%); border: 1px solid rgba(201,168,76,0.12); position: relative; cursor: pointer; transition: all var(--transition); overflow: hidden; }
  .book-card:hover { border-color: rgba(201,168,76,0.4); transform: translateY(-4px); box-shadow: 0 20px 50px rgba(0,0,0,0.6), 0 0 25px rgba(201,168,76,0.08); }
  .book-cover { width: 100%; aspect-ratio: 2/3; background: linear-gradient(160deg, var(--ember), var(--blood)); display: flex; align-items: center; justify-content: center; position: relative; overflow: hidden; }
  .book-cover img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.4s ease; }
  .book-card:hover .book-cover img { transform: scale(1.04); }
  .book-cover-ph { font-family: var(--font-display); font-size: 0.6rem; color: rgba(201,168,76,0.3); text-align: center; padding: 0.75rem; letter-spacing: 0.08em; line-height: 1.4; }
  .book-num { position: absolute; top: 0.5rem; left: 0.5rem; font-family: var(--font-title); font-size: 0.5rem; letter-spacing: 0.2em; color: var(--gold-dim); background: rgba(8,7,10,0.88); padding: 0.12rem 0.38rem; }
  .book-series-tag { position: absolute; top: 0.5rem; right: 0.5rem; font-family: var(--font-title); font-size: 0.45rem; letter-spacing: 0.15em; text-transform: uppercase; padding: 0.12rem 0.4rem; }
  .book-series-tag.iseldoran { background: rgba(201,168,76,0.2); color: var(--gold); }
  .book-series-tag.martyrs { background: rgba(74,45,107,0.3); color: #a070d0; }
  .book-info { padding: 0.75rem; }
  .book-title { font-family: var(--font-title); font-size: 0.75rem; color: var(--parchment); margin-bottom: 0.15rem; line-height: 1.3; }
  .book-subtitle-sm { font-family: var(--font-lore); font-style: italic; color: var(--smoke); font-size: 0.7rem; margin-bottom: 0.45rem; line-height: 1.3; }
  .book-words { font-family: var(--font-title); font-size: 0.5rem; letter-spacing: 0.12em; color: var(--ash); margin-bottom: 0.5rem; }
  .book-links { display: flex; gap: 0.35rem; }
  .book-link { font-family: var(--font-title); font-size: 0.48rem; letter-spacing: 0.13em; text-transform: uppercase; padding: 0.28rem 0.55rem; border: 1px solid; cursor: pointer; transition: all var(--transition); text-decoration: none; display: inline-block; }
  .book-link.kindle { color: var(--gold); border-color: var(--gold-dim); }
  .book-link.kindle:hover { background: rgba(201,168,76,0.15); border-color: var(--gold); }
  .book-link.print { color: var(--mist); border-color: var(--ash); }
  .book-link.print:hover { background: rgba(255,255,255,0.05); border-color: var(--smoke); }
  /* CHARACTER PORTRAITS */
  .portraits-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 1rem; }
  .portrait-card { background: var(--forge); border: 1px solid rgba(201,168,76,0.1); overflow: hidden; transition: all var(--transition); cursor: pointer; }
  .portrait-card:hover { border-color: rgba(201,168,76,0.35); transform: translateY(-3px); box-shadow: 0 12px 40px rgba(0,0,0,0.5); }
  .portrait-img { width: 100%; aspect-ratio: 3/4; object-fit: cover; object-position: top; display: block; }
  .portrait-img-ph { width: 100%; aspect-ratio: 3/4; background: linear-gradient(160deg, var(--iron), var(--ash)); display: flex; align-items: center; justify-content: center; font-size: 2rem; color: rgba(201,168,76,0.2); }
  .portrait-name { font-family: var(--font-title); font-size: 0.62rem; color: var(--parchment); padding: 0.5rem 0.6rem 0.2rem; line-height: 1.3; }
  .portrait-epithet { font-family: var(--font-lore); font-style: italic; font-size: 0.58rem; color: var(--rust-bright); padding: 0 0.6rem 0.6rem; }
  /* LORE */
  .lore-layout { display: grid; grid-template-columns: 210px 1fr; gap: 2rem; align-items: start; }
  .lore-sidebar { position: sticky; top: 80px; background: var(--forge); border: 1px solid rgba(201,168,76,0.12); overflow: hidden; }
  .lore-sidebar-header { background: linear-gradient(135deg, var(--ember), var(--blood)); padding: 0.75rem 0.9rem; font-family: var(--font-title); font-size: 0.55rem; letter-spacing: 0.3em; text-transform: uppercase; color: var(--gold); border-bottom: 1px solid rgba(201,168,76,0.2); }
  .lore-cat-btn { display: flex; width: 100%; text-align: left; background: none; border: none; border-bottom: 1px solid rgba(255,255,255,0.04); padding: 0.65rem 0.9rem; font-family: var(--font-title); font-size: 0.56rem; letter-spacing: 0.1em; text-transform: uppercase; color: var(--smoke); cursor: pointer; transition: all var(--transition); align-items: center; gap: 0.4rem; }
  .lore-cat-btn:hover { background: rgba(201,168,76,0.06); color: var(--gold); }
  .lore-cat-btn.active { background: rgba(201,168,76,0.1); color: var(--gold-bright); border-left: 2px solid var(--gold); }
  .lore-cat-count { margin-left: auto; background: rgba(201,168,76,0.1); color: var(--gold-dim); font-size: 0.52rem; padding: 0.08rem 0.32rem; }
  .lore-search-input { width: 100%; background: var(--forge); border: 1px solid rgba(201,168,76,0.15); color: var(--bone); font-family: var(--font-body); font-size: 0.92rem; padding: 0.65rem 0.9rem; outline: none; transition: border-color var(--transition); margin-bottom: 1.25rem; display: block; }
  .lore-search-input::placeholder { color: var(--smoke); font-style: italic; }
  .lore-search-input:focus { border-color: var(--gold-dim); }
  .lore-entries { display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 0.85rem; }
  .lore-entry { background: var(--forge); border: 1px solid rgba(201,168,76,0.1); padding: 1rem; cursor: pointer; transition: all var(--transition); position: relative; overflow: hidden; }
  .lore-entry::before { content: ''; position: absolute; left: 0; top: 0; bottom: 0; width: 2px; background: linear-gradient(180deg, transparent, var(--gold), transparent); opacity: 0; transition: opacity var(--transition); }
  .lore-entry:hover { border-color: rgba(201,168,76,0.3); transform: translateY(-2px); }
  .lore-entry:hover::before { opacity: 1; }
  .lore-entry-tag { font-family: var(--font-title); font-size: 0.48rem; letter-spacing: 0.22em; text-transform: uppercase; color: var(--rust-bright); margin-bottom: 0.35rem; }
  .lore-entry-title { font-family: var(--font-title); font-size: 0.88rem; color: var(--parchment); margin-bottom: 0.35rem; }
  .lore-entry-excerpt { font-family: var(--font-lore); font-style: italic; font-size: 0.78rem; color: var(--smoke); line-height: 1.5; }
  /* MODAL */
  .modal-overlay { position: fixed; inset: 0; background: rgba(8,7,10,0.92); z-index: 2000; display: flex; align-items: center; justify-content: center; padding: 2rem; animation: fadeIn 0.2s ease; }
  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  .modal { background: var(--forge); border: 1px solid rgba(201,168,76,0.25); max-width: 760px; width: 100%; max-height: 85vh; overflow-y: auto; position: relative; animation: slideUp 0.3s ease; }
  @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
  .modal-header { background: linear-gradient(135deg, rgba(61,47,26,0.8), rgba(92,21,21,0.4)); padding: 1.75rem; border-bottom: 1px solid rgba(201,168,76,0.15); position: relative; }
  .modal-tag { font-family: var(--font-title); font-size: 0.52rem; letter-spacing: 0.35em; text-transform: uppercase; color: var(--rust-bright); margin-bottom: 0.4rem; }
  .modal-title { font-family: var(--font-display); font-size: 1.5rem; color: var(--gold); text-shadow: 0 0 30px rgba(201,168,76,0.3); }
  .modal-close { position: absolute; top: 0.9rem; right: 0.9rem; background: none; border: 1px solid rgba(201,168,76,0.2); color: var(--smoke); width: 30px; height: 30px; cursor: pointer; font-size: 0.9rem; display: flex; align-items: center; justify-content: center; transition: all var(--transition); }
  .modal-close:hover { border-color: var(--gold); color: var(--gold); }
  .modal-body { padding: 1.75rem; }
  .modal-body p { font-family: var(--font-body); color: var(--bone); margin-bottom: 0.9rem; line-height: 1.85; }
  .modal-quote { font-family: var(--font-lore); font-style: italic; color: var(--mist); border-left: 2px solid var(--gold-dim); padding-left: 1rem; margin: 1.25rem 0; line-height: 1.7; }
  .modal-meta { display: grid; grid-template-columns: 1fr 1fr; gap: 0.85rem; margin-top: 1.25rem; padding-top: 1.25rem; border-top: 1px solid rgba(201,168,76,0.1); }
  .modal-meta label { font-family: var(--font-title); font-size: 0.48rem; letter-spacing: 0.22em; text-transform: uppercase; color: var(--gold-dim); display: block; margin-bottom: 0.2rem; }
  .modal-meta span { font-family: var(--font-body); color: var(--bone); font-size: 0.92rem; }
  /* TIMELINE */
  .timeline { position: relative; padding-left: 2rem; }
  .timeline::before { content: ''; position: absolute; left: 0; top: 0; bottom: 0; width: 1px; background: linear-gradient(180deg, transparent, var(--gold-dim) 10%, var(--gold-dim) 90%, transparent); }
  .timeline-era { position: relative; margin-bottom: 2.75rem; }
  .timeline-dot { position: absolute; left: -2.35rem; top: 0.35rem; width: 10px; height: 10px; background: var(--gold); transform: rotate(45deg); box-shadow: 0 0 10px rgba(201,168,76,0.5); }
  .timeline-era-title { font-family: var(--font-display); font-size: 1rem; color: var(--gold); margin-bottom: 0.35rem; }
  .timeline-era-date { font-family: var(--font-title); font-size: 0.52rem; letter-spacing: 0.22em; color: var(--rust-bright); text-transform: uppercase; margin-bottom: 0.65rem; }
  .timeline-era-desc { font-family: var(--font-body); color: var(--mist); max-width: 700px; line-height: 1.8; margin-bottom: 0.85rem; }
  .timeline-events { display: flex; flex-direction: column; gap: 0.45rem; }
  .timeline-event { display: flex; gap: 1rem; align-items: baseline; }
  .timeline-event-year { font-family: var(--font-title); font-size: 0.58rem; color: var(--gold-dim); min-width: 90px; letter-spacing: 0.08em; }
  .timeline-event-text { font-family: var(--font-body); color: var(--bone); font-size: 0.9rem; line-height: 1.5; }
  /* IXORIA / NINE HOUSES */
  .nine-houses-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(270px, 1fr)); gap: 1.1rem; }
  .house-card { background: var(--forge); border: 1px solid rgba(201,168,76,0.1); padding: 1.35rem; transition: all var(--transition); }
  .house-card:hover { border-color: rgba(201,168,76,0.28); box-shadow: 0 8px 28px rgba(0,0,0,0.4); }
  .house-name { font-family: var(--font-display); font-size: 0.92rem; color: var(--gold); margin-bottom: 0.2rem; }
  .house-specialty { font-family: var(--font-title); font-size: 0.55rem; letter-spacing: 0.18em; text-transform: uppercase; color: var(--rust-bright); margin-bottom: 0.6rem; }
  .house-motto { font-family: var(--font-lore); font-style: italic; color: var(--mist); font-size: 0.85rem; margin-bottom: 0.6rem; }
  .house-desc { font-family: var(--font-body); color: var(--smoke); font-size: 0.85rem; line-height: 1.6; }
  /* COVER GALLERY */
  .cover-gallery { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 1.25rem; }
  .cover-item { position: relative; overflow: hidden; border: 1px solid rgba(201,168,76,0.12); transition: all var(--transition); }
  .cover-item:hover { border-color: rgba(201,168,76,0.4); transform: translateY(-3px); box-shadow: 0 15px 40px rgba(0,0,0,0.6); }
  .cover-item img { width: 100%; display: block; }
  .cover-caption { position: absolute; bottom: 0; left: 0; right: 0; background: linear-gradient(transparent, rgba(8,7,10,0.95)); padding: 1.5rem 0.85rem 0.75rem; font-family: var(--font-title); font-size: 0.55rem; letter-spacing: 0.15em; text-transform: uppercase; color: var(--gold); }
  /* FOOTER */
  .footer { background: var(--void); border-top: 1px solid rgba(201,168,76,0.1); padding: 2.5rem 2rem; text-align: center; }
  .footer-brand { font-family: var(--font-display); font-size: 0.9rem; color: var(--gold-dim); margin-bottom: 0.4rem; }
  .footer-tagline { font-family: var(--font-lore); font-style: italic; color: var(--smoke); font-size: 0.88rem; margin-bottom: 1.25rem; }
  .footer-links { display: flex; gap: 1.25rem; justify-content: center; list-style: none; flex-wrap: wrap; margin-bottom: 1.25rem; }
  .footer-links a { font-family: var(--font-title); font-size: 0.55rem; letter-spacing: 0.18em; text-transform: uppercase; color: var(--smoke); text-decoration: none; transition: color var(--transition); cursor: pointer; }
  .footer-links a:hover { color: var(--gold); }
  .footer-copy { font-family: var(--font-title); font-size: 0.52rem; letter-spacing: 0.12em; color: var(--ash); text-transform: uppercase; }
  @media (max-width: 900px) { .lore-layout { grid-template-columns: 1fr; } .lore-sidebar { position: static; } .stats-bar { grid-template-columns: repeat(3, 1fr); } .nav-links button { font-size: 0.52rem; padding: 0.4rem 0.5rem; } }
  @media (max-width: 600px) { .stats-bar { grid-template-columns: repeat(2, 1fr); } .modal-meta { grid-template-columns: 1fr; } .portraits-grid { grid-template-columns: repeat(auto-fill, minmax(120px, 1fr)); } }
  /* BESTIARY */
  .bestiary-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1.4rem; }
  .beast-card { background: linear-gradient(160deg, var(--iron) 0%, var(--forge) 100%); border: 1px solid rgba(201,168,76,0.12); overflow: hidden; transition: all var(--transition); display: flex; flex-direction: column; }
  .beast-card:hover { border-color: rgba(201,168,76,0.4); transform: translateY(-4px); box-shadow: 0 20px 50px rgba(0,0,0,0.6), 0 0 25px rgba(201,168,76,0.08); }
  .beast-plate { width: 100%; aspect-ratio: 2/3; background: linear-gradient(160deg, var(--iron), var(--ash)); position: relative; overflow: hidden; }
  .beast-plate img { width: 100%; height: 100%; object-fit: cover; display: block; transition: transform 0.4s ease; }
  .beast-card:hover .beast-plate img { transform: scale(1.03); }
  .beast-plate-ph { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 0.6rem; color: rgba(201,168,76,0.35); text-align: center; padding: 1rem; }
  .beast-plate-ph .glyph { font-size: 2.4rem; }
  .beast-plate-ph .ph-name { font-family: var(--font-display); font-size: 0.85rem; letter-spacing: 0.08em; color: rgba(201,168,76,0.45); }
  .beast-plate-ph .ph-note { font-family: var(--font-title); font-size: 0.5rem; letter-spacing: 0.18em; text-transform: uppercase; color: var(--smoke); }
  .beast-num { position: absolute; top: 0.5rem; left: 0.5rem; font-family: var(--font-title); font-size: 0.5rem; letter-spacing: 0.2em; color: var(--gold-dim); background: rgba(8,7,10,0.88); padding: 0.12rem 0.45rem; z-index: 2; }
  .beast-info { padding: 0.9rem 1rem 1.1rem; }
  .beast-name { font-family: var(--font-display); font-size: 1rem; color: var(--gold); line-height: 1.2; margin-bottom: 0.1rem; }
  .beast-class { font-family: var(--font-lore); font-style: italic; font-size: 0.78rem; color: var(--mist); margin-bottom: 0.7rem; }
  .beast-meta { display: flex; flex-direction: column; gap: 0.35rem; margin-bottom: 0.7rem; }
  .beast-row { display: flex; gap: 0.5rem; font-size: 0.72rem; line-height: 1.3; }
  .beast-row .k { font-family: var(--font-title); font-size: 0.5rem; letter-spacing: 0.15em; text-transform: uppercase; color: var(--smoke); min-width: 92px; padding-top: 0.15rem; }
  .beast-row .v { font-family: var(--font-body); color: var(--bone); flex: 1; }
  .beast-notes { font-family: var(--font-body); font-size: 0.8rem; color: var(--mist); line-height: 1.55; border-top: 1px solid rgba(201,168,76,0.1); padding-top: 0.6rem; }
`;

// ─── IMAGE PATHS ─────────────────────────────────────────────────────────────
// These will be served as uploaded assets — use base64 embeds for covers
// For deployment, replace with CDN URLs
const IMG = {
  generalisima1: "/uploads/518CF5A4-5C4E-4778-9BF6-5A3839E424D4.png",
  generalisima2: "/uploads/E59D039C-47F8-4148-8FC0-A13D08518661.png",
  fiveSwords1: "/uploads/FullSizeRender.jpeg",
  fiveSwords2: "/uploads/C5C1B4E7-3496-4544-B8D9-D53FAA0755B6.png",
  emperors20: "/uploads/9B0996B6-B0D3-43D8-92F0-59A0A41C0D0B.png",
  generalisima3: "/uploads/17A04476-6862-4FC2-A015-AF45D7BBB247.png",
  characters14: "/uploads/IMG_5071.jpeg",
  characters14wide: "/uploads/IMG_5045.jpeg",
  leraq: "/uploads/IMG_5021.jpeg",
};

// ─── DATA ────────────────────────────────────────────────────────────────────

const SERIES = {
  iseldoran: { label: "The Iseldoran Sagas", color: "var(--gold)" },
  martyrs: { label: "Code of Martyrs", color: "#a070d0" },
  generalisima: { label: "La Generalísima", color: "var(--gold)" },
};

const BOOKS = [
  // ISELDORAN SAGAS — 30 volumes
  { id: 1, title: "No Gods No Masters", sub: "Compiled from the Imperial Archives · Volume I", words: "45,707", series: "iseldoran", k: "#", p: "#",
    desc: "Being the complete account of the reign of Lucius Luceron I — God Emperor, The Founder of the Modern Imperial Line. Republican in words. Sovereign in deeds. Part One follows Raja the Brilliant — the President-then-King who abolished monarchy, founded the Universal Republic, and was forced by public pressure to restore the royal title. Part Two chronicles the rise of Lucius Luceron I, grandson of Romulus Secundus, who clawed power back to the Dragon Throne. Opening quote: 'No gods. No masters. A king, because someone must choose.'" },
  { id: 2, title: "Black Death: Kaelen I", sub: "A Novel of Empire, War, and the Edge of Known Space", words: "88,690", series: "iseldoran", k: "#", p: "#",
    desc: "War, and the Edge of Known Space. Kaelen Pierre von Care — The Living Weapon. Black armor. Green eyes with golden specks. Golden dreadlocks. The God Emperor who bound the empire to himself through personal force. The Luceron Compact Years 17–57. Fifty thousand Vexori. The coronation on Ignis. The binding of the wolf. The marriage to Aurelia Pierre von Care — The Goddess Empress. Drawn from sealed Imperial archive." },
  { id: 3, title: "The Wedding War", sub: "The War That Made the Twin Thrones", words: "80,437", series: "iseldoran", k: "#", p: "#",
    desc: "Being the full account of the Failed Red Wedding of Iseldora, the Battle of Mars, and the Revelation of the Father's Gift. The forward marriage barges are burning. Not the whole convoy — not yet. Reconstructed by order of the Dragon Throne for permanent deposit in the Imperial Historical Registry. Classification: Restricted Canon. The war that transformed a wedding into a dynasty. 'The empire is not land. It is continuity.' — Kaelen Pierre von Care" },
  { id: 4, title: "The Chronicle of Aurelian", sub: "Being the Complete Account of the Reign of Aurelian Pierre von Care", words: "20,507", series: "iseldoran", k: "#", p: "#",
    desc: "God Emperor · The Beloved. Compiled from three primary sources: the Imperial Historical Chronicle under Kaelen I, the Sand Journals of Aurelian (partially destroyed by their author), and the account of Plutarchus Venator, Imperial Historian of the Third Age. Where they conflict, the conflict is preserved rather than resolved. 'He was murdered by a room full of men who had agreed, months before, to do it. Nobody counted on the fact that he would be loved afterwards.' — Lothor of Ixoria" },
  { id: 5, title: "The Soldier Emperors", sub: "Cassander I · Lucius Luceron II · The Schism of the Two Flames", words: "79,247", series: "iseldoran", k: "#", p: "#",
    desc: "Continues directly from The Chronicle of Aurelian. Aurelian, heir to Kaelen, was assassinated on Remisión 9 by conspirators of the Malfoy houses. What follows is his brother Cassander's response — total, methodical, and without mercy — and then the long arc of Lucius Luceron II, who inherited Cassander's empire and tried to do something different with it. The Schism that ended Luceron II's dynasty. Lucius Luceron III follows in the next volume. 'He did not rule gently. He did not pretend reconciliation was possible when it was not.'" },
  { id: 6, title: "Lucius Luceron III", sub: "The Philosopher Emperor", words: "66,569", series: "iseldoran", k: "#", p: "#",
    desc: "The Philosopher Emperor — later The Philosopher Who Went to War. Crowned Prince, later God-Emperor of the Universal Khanate. Foster father: Iskandar, God-Emperor of the Copper Realms. His mother Aurelia, Princess of the Violet Sectors. His allies: Adulfus Khan (shield and brother-in-arms), Emma Comemna (strategist, adviser, prophet, lover), Germionus de Maldor (Grand Marshal, trainer). His enemy: Ra'ah, Anunaki sovereign intelligence. 'The philosopher who refuses force becomes decoration. The conqueror who refuses thought becomes ruin. I will be neither.' — Lucius Luceron III, My Musings" },
  { id: 7, title: "Amira's Rule", sub: "The Flame of Bundchen", words: "114,725", series: "iseldoran", k: "#", p: "#",
    desc: "She did not come to the throne. The throne came to her. It arrived in pieces, over years, carried by people who had no idea they were carrying it. Daughter of Lucius Luceron III and Amira Kers. Daughter-heir, strategist, commander, and eventually Empress Amira — The Bastard Goddess. Two books: The Formation (the girl on the rampart, three lessons, the first war, the question of marriage, Fharion, the Senate) and The War Years (the shifting mirrors of Bundchen, the crossing). Dedicated to His Divine Majesty Augustus Julius II." },
  { id: 8, title: "The Bastard God: Augustus Rex", sub: "God-Emperor of Mankind · Beyond the Rim", words: "67,537", series: "iseldoran", k: "#", p: "#",
    desc: "A god who arrives without announcement is either very confident or very late. Augustus Rex was neither. He was simply inevitable. The Ship That Screamed. The March Beyond the Rim. The Fall of Ra'ah. Ninety billion soldiers. The War at the Mouth of Creation. The Breaking of the Rim. He led armies beyond the edge of known space and returned having replaced a god. The Dragon Throne carries his passage in its stone. 'He who goes to the Rim goes to meet the Flame and the Void at the same address.' — Adulfus Khan, Universal Minister of Bundchen Prime" },
  { id: 9, title: "Niccolò: Thunderborn", sub: "The Storm-Child of House Hapsburgi", words: "27,738", series: "iseldoran", k: "#", p: "#",
    desc: "The moment Niccolò Kerron von Hapsburgi was born, lightning struck through the glass atrium and the servants fled. His mother, Duchess Lucrezia Aurelia Trumpf von Hapsburgi, did not scream — Trumpf women were forged from older iron. His first wail: a thunderclap. Candles guttered when he entered rooms. Metal hummed near his skin. At five he disarmed his fencing instructor and broke the carbon-steel blade across his knee. The Thunderborn. One of the Four Captains. Afro-Mongolian features, green eyes with golden specks, golden dreadlocks." },
  { id: 10, title: "The Strangling of the Belt", sub: "The Merchant War: Prelude", words: "69,964", series: "iseldoran", k: "#", p: "#",
    desc: "The Front Is Broken. Allies Become Targets. The Breaking of the Gahmih. The Tribunal of Asterion. The Thirty Years Burn. The Final Convergence. Livius — The Maintainer — holds the throne during the empire's longest slow-burn economic stranglehold. 312 supply lines go dark in eleven days. No shots fired. The starvation begins. The war of economic annihilation that preceded the Merchant War proper. The Belt learns that death can come without a fleet. Baiju refuses judgment. Sisters at war. The cost of stillness." },
  { id: 11, title: "Wolves and War", sub: "Books I & II · The Making of Asha Kers I", words: "137,270", series: "iseldoran", k: "#", p: "#",
    desc: "Book I: The Orbital Battle of Tarrid. The Khotai Pass. Hesh-Kar — the sixth war that made a weapon. The Council of Three. The summoning of Nayra of Kithoun. The birth of Asha Kers I. The nineteen years. Saldin votes against her. The departure. Book II: First blood, the communications relays, the second belt, the Dragon Throne, the taking, the new succession. The first Ashari'i Rite. Coda: The Long Rule. 'He did not stop.' — Over New Terra. Khuvius Pierre von Care — Crown Prince of War — and the Star Wolves fight five frontier wars. The sixth war is Hesh-Kar." },
  { id: 12, title: "The Quiet King", sub: "Germionus de Maldor · The Immune System", words: "70,091", series: "iseldoran", k: "#", p: "#",
    desc: "He was not murdered by a man. He was murdered by a room full of them who had agreed, before he arrived, that nothing he said would matter. The Great Interregnum: twenty-five years without stable sovereignty. Twenty-six pretenders eliminated by Germionus. The empire did not fall — that is the horror. The empire continued. It ran on his death the way a river runs on rain it does not remember. Raised in Vol. 6 under Iskandar as foster father. The Quiet King. The Immune System. The reclaimer of the line. Compiled from the Sahkud Investigative Archive." },
  { id: 13, title: "Haradakus", sub: "The Eastern Sectors · A Popular Fiction of Historical Record", words: "55,477", series: "iseldoran", k: "#", p: "#",
    desc: "God-Emperor Mettenik I Pierre von Care read this novel three times and annotated his copy extensively — those annotations are preserved separately in Vault Sixty-Two. For the Haradakn people, who lost everything twice and rebuilt both times without asking permission. Part I: Exile and Preservation. The birth of Mehmet al Sa'ud von Hapsburgi. The Sword of Ozman. The eastern sectors' own account of what it meant to exist at the edge of an empire that categorized you before it knew you." },
  { id: 14, title: "Father's Gift", sub: "The Runeus Question · Events Following the Wedding War", words: "80,126", series: "iseldoran", k: "#", p: "#",
    desc: "Geology does not lie. It does not simplify either. What it tells you is exactly what happened, in a language that takes years to learn and a lifetime to stop misreading. Reconstructed from: the personal journals of Aurel von Rothschild; the operational correspondence of Roahan Germion; the medical research files of Neva Hardin; the diplomatic archives of the Transit Compact. Events follow directly from the Wedding War. Readers unfamiliar with the Wedding War are advised to consult it first. The Dragon Throne Chronicles, Vol. IV, Ch. XI: 'The Runeus Question.'" },
  { id: 15, title: "Aurelia: The Goddess Empress", sub: "Book of the Daughter · Second Edition", words: "69,513", series: "iseldoran", k: "#", p: "#",
    desc: "In the forty-first year of Asha Kers I's rule, the empire held its breath for seventeen days. The daughter's fire. Act I: The Sands Still Warm. Act II: The Weight of the Empty Hall. Asha Kers II — The Heir Goddess — takes the throne her mother built and inherits the weight of what La Diosa left unresolved. The Book of the Daughter. The empire's most intimate succession: from a goddess who walked to the platform to a daughter who had watched her do it." },
  { id: 16, title: "Mettenik I: Restorer of the Dragon Throne", sub: "A Chronicle of the Twenty-Seven", words: "137,720", series: "iseldoran", k: "#", p: "#",
    desc: "For the Twenty-Seven — and for everyone who has ever had to write a name down the way it was said. Clean words come from courts. True words come from galley tables. — Sechen of the Rim. The chronicle of the Ghega-Khan'i confederation, told in oral tradition. Chapters arranged in compositional rather than strictly chronological order. The Kurultai of Twenty-Seven. The Refusal Chain. Bundchen Orbit. Engines Delivered. Twenty Years of Iron. The Horse Reborn in Vacuum. Khublai Ghega Khan. The son. The line holds. El Escritorio." },
  { id: 17, title: "The First Khan", sub: "A Chronicle of the Twenty-Seven · 144,571 words", words: "144,571", series: "iseldoran", k: "#", p: "#",
    desc: "The longest volume of the Iseldoran Sagas. Dhaka's failed coup on the command deck of the Izikhali. Chayun breaks the brig at Prefecture Seven. The Kurultai of Twenty-Seven. The Laws of Slow Death. Chegai, Agayuk, Sornai, Yasa. Bundchen Orbit. Engines Delivered. Twenty Years of Iron. The Blood Riders. The Khanik fighter doctrine — Horse into Vacuum. Manke, Ogedei, Tolui. Dhaka taken alive. Law and Blood. Night of Esther. The Seven. Dhaka Island. El Escritorio. The line to Kaelen Rainmaker, 500 years forward. Third Edition · Imperial Archivist Edition." },
  { id: 18, title: "The Iberian Wars: Book One", sub: "The Crown and the Crescent · Exile: The Hidden Prince", words: "18,630", series: "iseldoran", k: "#", p: "#",
    desc: "History does not repeat itself. It merely finds new mouths to say the same prayers. — Inscription on the Gate Alhambra-Station, Author Unknown. The Iberian Wars Series, Vol. III of the Va Sumir Chronicles. The Exile arc. The Hidden Prince. Old Earth campaigns. House Jaza of Mars. The seats and soldiers of the Iberian Sector. An open archive record. The continuation — The Concordat Wars — is held in partial completion in the Imperial Archive." },
  { id: 19, title: "Leraq: An Autobiography", sub: "In His Own Words · 5,157 Words", words: "5,157", series: "iseldoran", k: "#", p: "#",
    desc: "I write it because there are certain things that certain parties would prefer remain unsaid. — Leraq, Foreword. The shortest primary source in the archive. Leraq of Vath, the Va Sumir Advisor: non-human, pale, pointed ears, gold lattice crown. Navigator of first contact. Held in Anunaki mental bondage. Defector. Adviser. Grand Admiral. Ancient. Monster. Wise — by people who had never met wise. He writes not because autobiography is dignified (it is vanity wearing the coat of record) but because the archivists will argue over his eye color and miss the forty years that saved eight species from cognitive silence." },
  { id: 20, title: "Cassander's Revenge", sub: "The Vengeance Era · The Purge at Remisión 9", words: "31,362", series: "iseldoran", k: "#", p: "#",
    desc: "On Remisión Prime, the twin Empresses received the body in silence. The capital's sky drowned in incense smoke. Every tower chimed with coded grief. Cassander Pierre von Care — grandson of Kaelen, son of Ysinde, brother-cousin of the slain — rises. 'This throne was meant for me in another age, but I take it now, too early, because the gods themselves demand retribution. To strike at the divine blood is to invite extinction.' The War Council. The coronation. The Purge. The return to Remisión 9. Blood answers Blood; Fire answers Treason." },
  { id: 21, title: "Notes on Cassander's Final Years", sub: "Supplemental Scenes and Testimony · Companion to The Soldier Emperors", words: "8,489", series: "iseldoran", k: "#", p: "#",
    desc: "The heat reached me before the sound did. It crawled up the greaves and settled behind the knees. — Roahan de Maldor, personal record. Cassander advancing with a flamethrower through a burning city, unhurried, precise, methodical. Roahan de Maldor at his side, watching obedience become complicity. The Breaking Point. The Severing and the Offer. The handoff of Germionus de Maldor. 'I have spoken for the Flame long enough. Let it speak for itself.' Compiled from Roahan de Maldor's personal record and sealed testimony." },
  { id: 22, title: "Lucius Luceron II", sub: "The Philosopher Emperor Who Went to War", words: "36,840", series: "iseldoran", k: "#", p: "#",
    desc: "Parts: The Fostered Heir · The Charge Beyond the Rim · The Philosopher Emperor · The Shadow of a God · The Fracture of the Rim · The Dragon Throne. Lucius Luceron III — raised by Iskandar (Emperor of the Copper Realms) — inherits the empire and is tested by Ra'ah, the Anunaki sovereign intelligence. His allies: Adulfus Khan, Emma Comemna, Khalid al-Hapsburgi, Germionus de Maldor. He accepted full godhood at death. 'For those who sit alone with fear and call it duty.' — Dedication" },
  { id: 23, title: "No Gods No Masters: Appendices & Notes", sub: "Vol. I Companion · The Codex of Restoration", words: "3,276", series: "iseldoran", k: "#", p: "#",
    desc: "Three appendices. I: The Codex of Restoration — the Lucien X era (Year 49,884 A.E.), which established the theological infrastructure Pious III inherited. The abolition of God Emperor, replaced by Custodian Eternal. II: The Veil of the Gods (49,963–50,011 A.E.) — the epoch after Lucien X. 'Be still. You are the Flame.' III: Omega-Prime operational dossier on Kemeht-Gruhz — appended to Agent Rodríguez's Ramaka transmission. His stated personal objective: to kill Ra himself. Not a disqualification. A guarantee of motivation." },
  { id: 24, title: "The Twin Thrones", sub: "Ysinde and Isolde · The Dawn Empresses", words: "87,082", series: "iseldoran", k: "#", p: "#",
    desc: "The convoy was burning. Not the whole convoy. Not yet. But the forward marriage barges — those vast silk-bannered vessels commissioned from the Iseldoran yards eighteen months before. The Twin Thrones: Ysinde (The Dawn Empress) and Isolde (The Twin Throne). They did not fight as two generals sharing a battlefield. They fought as one general inhabiting two bodies. — Lothor of Vexon. The Four Who Sat the East. Aurel de Rothschild and Tariq al-Sa'ud. The Long Peace. The empire is not land. It is continuity." },
  { id: 25, title: "Khutun's Revenge", sub: "The Administrative Annihilation · The Kasparian Belt", words: "64,737", series: "iseldoran", k: "#", p: "#",
    desc: "The murder of Niccolò Kerron von Hapsburgi at Vey Kashar was not simply murder. It was a communication addressed to Livius's Empire. And Khutun's response could not be proportional. Books: The World That Was · The Last Day · The First Response · The Administrative Annihilation · The Long Correction · Parmenion · The Absence. The Belt — a civilization built from transit mathematics — and the nineteen-year systematic erasure that followed one man's killing. The Belt's organizational tiers: sovereign carrier fleets, corridor lords, refinery clans, frontier clans." },
  { id: 26, title: "Dominus and Olympia", sub: "The Divine Pair · Narrated by the Granddaughter", words: "33,165", series: "iseldoran", k: "#", p: "#",
    desc: "He was like standing near something very large that was also very quiet. You did not necessarily feel afraid. You just felt how small you were, and that the smallness was accurate. — The author's grandmother, on Augustus Dominus. Narrated by his granddaughter, Master Archivist of the Imperial Record Division. Set down in the manner of Livy and Plutarch, with the gravity of Herbert and the moral weight of Martin. The most documented and most misunderstood reign. The man is in the margins. In the one-sentence replies to complex petitions." },
  { id: 27, title: "The Supreme Rule", sub: "Augustus Dominus Rex · Parts I–VII", words: "35,591", series: "iseldoran", k: "#", p: "#",
    desc: "He said it openly: 'If the civil service hesitates, the Empire dies.' So it did not hesitate. Births recorded the same day. Permits issued before impatience formed. Loans approved or denied without ritual delay. Shipyards broke ground within hours of request. The people loved him for this — not because he was kind, but because life moved again. His wife Olympia: daughter of Parmenion, King of the Belt. Trained by the Yanauikii. Modified by the Ashari'i. She emerged more than human, but not less. Part biography, part testament." },
  { id: 28, title: "Augustus Dominus Rex: The Final God", sub: "The Closing Era", words: "32,817", series: "iseldoran", k: "#", p: "#",
    desc: "The Final God. The last God-Emperor to hold the title as a lived reality rather than an institutional inheritance. Companion volume to The Supreme Rule and Dominus and Olympia. Grandson of Asha Kers I. The civil service machine he built. Olympia — daughter of Parmenion, forged in Vah'Sumir Ashari'i depths on a sea-world where training happened beneath crushing pressure. Increased mass. Ashari'i-derived endurance. Amphibious respiration. By the time she reached court age, she was already a myth. 'Not romance — but something more architecturally correct.'" },
  { id: 29, title: "VSGE Imperial Chronicles Vol. II", sub: "The Asha Kers I Era · The Purge", words: "14,263", series: "iseldoran", k: "#", p: "#",
    desc: "The Purge finds its floor. Two billion, eight hundred million dead. Forty-seven planets restructured under emergency governance. Aurelia decides. Hassan builds a file. Mercurio sends sealed transmissions through a cipher no active agent manages. Year Nine: the republican idea stops spreading — not dramatically, but the way a fire dies, the gradual exhaustion of fuel. 'What we lose when we lose an idea is not the buildings. It is the knowledge that such buildings were possible.' — Scholar of Old Constantinople, recovered fragment" },
  { id: 30, title: "VSGE Imperial Chronicles Vol. III", sub: "The Commission · What Asha Builds Next", words: "20,180", series: "iseldoran", k: "#", p: "#",
    desc: "Mercurio lived alone in the eleventh year. Not alone in the sense of solitude — but alone in the sense that the interior architecture of his life had reduced to its load-bearing elements. He was reading a history of a city called Constantinople. Its fall described in terms he found familiar. The Gran Yani Tubah'halai testifies. The Commission's fourth report: three hundred and forty pages. Asha read it in two sittings, lights going from day to gray to dark. At the bottom of the final page, in her own hand: Acknowledged. The Lattice Ethics Protocols follow." },
  // LA GENERALÍSIMA
  { id: 31, title: "La Generalísima", sub: "The Seven Days, The Fall of the Meraud Free Republic", words: "TBA", series: "generalisima", k: "#", p: "#", cover: IMG.generalisima3, desc: "Selene Jaza. First Generalísima of the Black Death. The Seven Days. Twenty-five years of praise. 'The Emperor builds the empire. The Generalísima defends its existence. The Archivist ensures its memory.' — Kairoh Pierre von Care", featured: true },
  { id: 32, title: "La Generalísima: Appendices & Notes", sub: "Authorised Publisher's Edition", words: "TBA", series: "generalisima", k: "#", p: "#", cover: IMG.generalisima2, desc: "The sealed archive. The Seven Days canon notes. The character registry. The Muskus timeline. The al-Saud Compact. Loyalty is reality. Reality is law. Law is eternal." },
  // FIVE SWORDS, ONE THRONE
  { id: 33, title: "Five Swords, One Throne", sub: "Part One · Brotherhood, Blood and the Fall of the Pharaoh", words: "TBA", series: "iseldoran", k: "#", p: "#", cover: IMG.fiveSwords1, desc: "Five men. Five swords. Raised in blood. Bound by brotherhood. Forged by war. From the training pits of Solera to the fall of a Pharaoh, their legend is written in blood, and history will never know the truth.", featured: true },
  // CODE OF MARTYRS
  { id: 34, title: "The Sapphire Eye", sub: "Code of Martyrs · Book I", words: "~50K", series: "martyrs", k: "#", p: "#", desc: "The Dragon Throne of Maldorus. Shapur the Eternal. The brothers Ashim the Lion and Ishak the Fox. The rot that hides in the perfume. Nashim XII in the Baths of Kasparia." },
  { id: 35, title: "The Withered King", sub: "Code of Martyrs · Book II", words: "~60K", series: "martyrs", k: "#", p: "#", desc: "Ishak — The Withered King. The secret hunger of the empire. The continuation of the brothers' war." },
  { id: 36, title: "The Winnowing of Maldorus", sub: "Code of Martyrs · Book III", words: "~65K", series: "martyrs", k: "#", p: "#", desc: "The Engine of Bone. The Hestian Arks — welded corpses. Hulls of dead destroyers stitched together with erratic welds. The galaxy consuming its own fleets." },
  { id: 37, title: "The Chronicles of the Glass Eye", sub: "Code of Martyrs · Book IV", words: "~70K", series: "martyrs", k: "#", p: "#", desc: "Kaisar Vane — The Iron God. Gamelon the Jester. The Victory of Peace. The soul pulled from the Lattice. The most terrible victory of all." },
  { id: 38, title: "Code of Martyrs: Complete Saga", sub: "Books I–IV", words: "686 pages", series: "martyrs", k: "#", p: "#", desc: "The complete Code of Martyrs saga in a single volume — all four books from the Dragon Throne of Maldorus to the final victory of the Iron God." },
];

const PORTRAITS_20 = [
  { n: "Kerron Pierre von Care", e: "The Dragon Emperor", era: "Founding Era" },
  { n: "Isabelle of Mallorca", e: "The Moving Empress", era: "Founding Era" },
  { n: "Hamish Pierre von Care", e: "The Shielded King", era: "Founding Era" },
  { n: "Cassian I Pierre von Care", e: "The First God-King", era: "Founding Era" },
  { n: "Cassiel", e: "The Wandering Emperor", era: "Cassiel Withdrawal Era" },
  { n: "Lucius Luceron I", e: "The Flame Bearer", era: "First Luceron Restoration" },
  { n: "Kaelen Rainmaker", e: "The Living Weapon", era: "First Luceron Restoration" },
  { n: "Isolde Pierre von Care", e: "The Twin Throne", era: "First Luceron Restoration" },
  { n: "Ysinde Pierre von Care", e: "The Dawn Empress", era: "First Luceron Restoration" },
  { n: "Aurelian", e: "The Murdered Sun", era: "First Luceron Restoration" },
  { n: "Cassander I", e: "The Avenger", era: "First Luceron Restoration" },
  { n: "Lucius Luceron II", e: "The Restorer", era: "Second Luceron Restoration" },
  { n: "Empress Amira", e: "The Bastard Goddess", era: "Goddesses and Dominion" },
  { n: "Augustus Rex", e: "The Bastard God", era: "Goddesses and Dominion" },
  { n: "Livius", e: "The Maintainer", era: "Goddesses and Dominion" },
  { n: "Niccolò Kerron von Hapsburgi", e: "The Thunderborn", era: "Goddesses and Dominion" },
  { n: "Khutun Ghega Khan", e: "Queen of the Belt", era: "Khanate Era" },
  { n: "Khutulun", e: "The Empress-Warrior", era: "Khanate Era" },
  { n: "Khuvius", e: "Crown Prince of War — Star Wolf Prince", era: "Star Wolf Era" },
  { n: "Asha Kers I", e: "La Diosa · Queen of the Vah'Sumir", era: "Goddesses and Dominion" },
];

const PORTRAITS_14 = [
  { n: "Kaelen I Rainmaker", e: "The God Emperor · The Black Death" },
  { n: "Asha Kers I", e: "The Bastard Goddess · The Star-Strider" },
  { n: "Augustus Dominus Rex", e: "The Final God" },
  { n: "Niccolò von Hapsburgi", e: "Thunderborn" },
  { n: "Germionus de Maldor", e: "The Quiet King · The Immune System" },
  { n: "Leraq of Vath", e: "The Va Sumir Advisor" },
  { n: "Isolde & Ysinde", e: "The Twin Empresses" },
  { n: "Laurentis Kers", e: "The Stone Giant" },
  { n: "Ishak", e: "The Withered King" },
  { n: "Gamelon", e: "The Jester · The Accountant" },
  { n: "Kaisar Vane", e: "The Iron God" },
  { n: "Marcellus von Care", e: "The Mud Prince" },
  { n: "Dhaka", e: "The Rebel Commander" },
  { n: "Chayun", e: "The Dock Worker" },
];

// The Great Bestiary of the Rim — Imperial Academy Xenobiological Archives.
// Plate images (when rendered) live at assets/bestiary/NNN.png; see species.mjs.
const BESTIARY = [
  { n: "Imperial Human", cls: "Homo Imperialis (Optimized Strain)", home: "Terra (Holy World)", metric: "1.88 m (6'2\")", notes: "Genetically optimized human at the peak of Imperial refinement. Athletic build, exceptional health, high cognitive capacity, and disciplined bearing." },
  { n: "Noirak", cls: "Noirak Nobilis", home: "Noirak Prime", metric: "2.45 – 2.75 m (8'0\" – 9'0\")", notes: "Ancient and noble species. Human-presenting but subtly alien. Natural leaders with enhanced physiology and long lifespans." },
  { n: "Vah'Sumir", cls: "Vah'Sumir Maximus", home: "Sumir Prime", metric: "3.0 – 3.6 m (9'10\" – 11'10\")", notes: "Massive apex warriors. Digitigrade stance, armored hide, and predatory physiology built for domination and endurance." },
  { n: "Ashari'i", cls: "Ashari'i Immortalis", home: "Ashar", metric: "2.3 – 2.9 m (7'6\" – 9'6\")", notes: "Ancient immortal warrior caste. Elegant and refined features with advanced longevity and ceremonial traditions." },
  { n: "Gor'nath Brute", cls: "Gor'nath Colossus", home: "Gor'nath", metric: "3.5 – 4.2 m (11'6\" – 13'9\")", notes: "Gigantic and powerfully built. Incredible strength, dense skeletal structure, and armor-like skin plates." },
  { n: "Yurshak Brood", cls: "Yurshak Broodling", home: "Yurshak Hive Worlds", metric: "2.0 – 2.6 m (6'7\" – 8'6\")", notes: "Hive-evolved predators. Insectoid-reptilian morphology, multiple sensory organs, and natural weapons." },
  { n: "Shal'mak Aerophage", cls: "Shal'mak Dominus", home: "High Atmosphere Layers", label: "Wingspan", metric: "6.0 – 7.5 m (19'8\" – 24'7\")", notes: "Aerial apex organisms. Large wings, light but strong anatomy, and adaptations for high-speed aerial hunting." },
  { n: "Oolak Luminary", cls: "Oolak Sapientis", home: "Oolak", metric: "2.2 – 2.7 m (7'3\" – 8'10\")", notes: "Bioluminescent beings. Their bodies produce natural light through organic structures. Ancient, wise, and highly spiritual." },
  { n: "Threxx War-Smith", cls: "Threxx Ferrum-Artifex", home: "Threxx Forge Worlds", metric: "2.6 – 3.2 m (8'6\" – 10'6\")", notes: "Forge-adapted engineer-warriors. Built for industry, warfare, and the creation of advanced technology." },
  { n: "Razeen Flesh-Weaver", cls: "Razeen Artifex", home: "Razeen Vaults", metric: "2.1 – 2.6 m (6'11\" – 8'6\")", notes: "Bio-engineers and sculptors of flesh. Advanced sensory organs, elegant physiology, and masters of organic architecture." },
  { n: "Haal'tek Voidwalker", cls: "Haal'tek Exuvia", home: "Deep Void / Unknown", metric: "3.0 – 3.8 m (9'10\" – 12'6\")", notes: "Void-adapted entities. Their bodies are optimized for microgravity and extreme isolation between stars." },
];

const LORE_CATS = [
  { id: "all", label: "All Entries", icon: "◈" },
  { id: "character", label: "Characters", icon: "⚔" },
  { id: "faction", label: "Factions", icon: "⚑" },
  { id: "location", label: "Locations", icon: "◉" },
  { id: "event", label: "Events", icon: "✦" },
  { id: "technology", label: "Technology", icon: "⚙" },
  { id: "tradition", label: "Traditions", icon: "☽" },
];

const LORE = [
  { id: 1, cat: "character", title: "Selene Jaza", era: "La Generalísima Era", aliases: "The First Generalísima", appeared: "La Generalísima",
    excerpt: "Daughter of Augustus Lucius Jaza. Age 41 at Year One. Dark eyes, angular precision, her mother's colouring. Led the Black Death for 48 years. Never sought the throne; sought the thing the throne is supposed to do.",
    full: "Selene Jaza is the First Generalísima of the Black Death — daughter of Augustus Lucius Jaza de Mérida, The Generalísimo. She was 41 at Year One of her tenure and led the institution for 48 years before abdicating.\n\nHer operative character: dark eyes, angular precision, her mother's colouring. She never sought the throne. She sought the thing the throne is supposed to do.\n\nThe Seven Days: three succession candidates eliminated in seven days — Orazah'hux (Day 2), von Hapsburgi (Day 4), Muskus (Day 6). The investiture proceeded at 1100 on Day 7 before the imperial assembly.\n\nTo the prisoner Callum Resh she said: 'I am not claiming anything. I am not here for right. I am not here for my father's name. I am here because my God Emperor needs this institution, and this institution needs a hand on it, and I am that hand. Any man who moves against me moves against him.'\n\nIn Year 48 she abdicated. Demetrius became Generalísimo. He ran the Black Death for 36 years.",
    quote: "I am not here for right. I am not here for my father's name. I am here because my God Emperor needs this institution, and I am that hand." },
  { id: 2, cat: "character", title: "Demetrius Jaza", era: "La Generalísima Era", aliases: "The Architect of Kharvat", appeared: "La Generalísima",
    excerpt: "Son of Selene. Age 20 at Year One — administrative record falsified to read 31. Orchestrated the Seven Days cabal. Married Dara al-Saud in Year 11. Architect of the Compact of Kharvat.",
    full: "Demetrius Jaza is the son of Selene Jaza and architect of the Seven Days succession engineering. His correct age at Year One was 20 — the administrative register falsified it to 31, a figure appearing in garrison records, the Goliath's personnel rolls, and the Assembly's formal citation. The archive establishes: the correct age is 20.\n\nHe orchestrated the cabal with precision: Alexa von Stoiban positioned on the Goliath for 8 months; Cassiel Rho producing the 17-second surveillance gap; Angolia identifying Palas Vren; Hemmings and Angolia together forming the planning process.\n\nHe married Dara al-Saud in Year 11. Their daughter Aurelia Jaza al-Saud was born in Year 20 — named deliberately. In Year 23 he arranged marriage to Leila al-Saud of Kharvat.\n\nThe Compact of Kharvat extends four centuries from the investiture — longer than the Black Death has existed as an institution. The Dragon Throne has never faced an heir carrying the Jaza name, the al-Saud commercial inheritance, and the Sun Prince of Kharvat title simultaneously.\n\nWhen his mother asked him — once, indirectly — about Remi Vey's disappearance on a Wednesday, Demetrius said only that the thirty-seven seconds had finally been answered. He did not elaborate.",
    quote: "The thirty-seven seconds had finally been answered." },
  { id: 3, cat: "character", title: "Kaelen Rainmaker", era: "The Luceron Compact", aliases: "God Emperor Kaelen I, The Living Weapon, The Black Death", appeared: "Vol. 2, 15",
    excerpt: "Black armor. Green eyes. The God Emperor. 'We are the God Emperor. We are your lord. The universe is ours. We do not speak of the abstract. We speak of the tactile, bleeding, physical reality.'",
    full: "Kaelen Rainmaker was already legend before he turned seventeen. Black armor. Green eyes. Fifty thousand Vexori. His coronation declaration was not ceremony — it was statement: 'We are the God Emperor. We are your lord. The universe is ours. We do not speak of the abstract. We speak of the tactile, bleeding, physical reality.'\n\nHe married Aurelia Pierre von Care. The marriage transformed both into something the empire had not calculated. He was loyal not to Augustus Julius II but to what the man stood in place of — the passage of Augustus Rex, poured into the Dragon Throne's stone.",
    quote: "We are the God Emperor. We are your lord. The universe is ours." },
  { id: 4, cat: "character", title: "Augustus Lucius Jaza", era: "The Merchant War", aliases: "The Generalísimo, Lord of Mérida", appeared: "Seven Victories Appendices, La Generalísima",
    excerpt: "Second son of House Jaza of Mars. Lord of Mérida on old Earth. The finest operational commander of his generation. Eyes the silver-grey of a cooling reactor core. Died at the Ardenne Passage refusing Vah'Sumir lattice treatment on Mérida theological grounds.",
    full: "Augustus Lucius Jaza was the second son of House Jaza of Mars. Lord of Mérida — an old Earth seat so minor that even his family archivists sometimes forgot to record it. Second sons of great houses did not inherit wars. They went looking for them.\n\nHe was fifty-one during the Merchant War. Hair gone white at the temples twelve years prior. Face carved rather than grown. Eyes the silver-grey of a cooling reactor core. People who met them looked away quickly.\n\nHe killed Talassar Vey with a personal blade in the marble strategy chamber — held him upright afterward until the synthetic eyes stopped tracking. Prince Kairoh spent forty years trying to explain that detail. The answer always arrived at the same place: you do not let a man like that die on the floor.\n\nHe refused the Vah'Sumir neural-regenerative lattice treatment at the Ardenne Passage. The Lords of Mérida theology holds such intervention a transgression against the form that Tengri has given. He died for this conviction.",
    quote: "My function is to prevent that outcome." },
  { id: 5, cat: "character", title: "Asha Kers I", era: "The Star Wolf Era", aliases: "The Bastard Goddess, The Star-Strider, Queen of the Vah'Sumir", appeared: "Vol. 11, 17",
    excerpt: "She stood six feet and four inches. She carried Death Dealer. She kept a list of 17,426 names. On the autumn equinox of her forty-first year she read it from first to last, left the purple cape on the hook, and walked to the platform.",
    full: "Asha Kers I ruled for forty-one years. The small list — a folio of plain dark wood — grew to 17,426 names. In the autumn equinox of year forty-one she read it from first to last. The reading took the better part of an hour.\n\nShe closed the folio. Set it at the head of the bed. Removed the black field plate herself, in the sequence she had been executing since her ninth year. Dressed in plain dark wool — the riding clothes of the Khoth plain. Set Death Dealer at her right hip. Left the purple cape on the hook at the door.\n\nShe walked to the transit platform carrying the folio under her right arm, and nothing else. She was gone from New Terra's orbital approach within forty minutes.\n\nPrince Kairoh: she was not becoming a tyrant. She was becoming Asha. She had always been becoming Asha. I did not understand this until after she was gone.",
    quote: "" },
  { id: 6, cat: "character", title: "Isolde Pierre von Care", era: "The Twin Thrones", aliases: "The Twin Empress, Dawn Empress", appeared: "Vol. 24",
    excerpt: "She watched the forward wedding barges die from the command deck of the Pale Meridian. Surprise requires expectation. She had expected this. She had said so.",
    full: "Isolde Pierre von Care placed a fleet projection on the table three months before the convoy attack and traced the approach corridors and said, clearly, that the Houses would move during the transit window. Her ministers thanked her for the analysis. Her admirals nodded.\n\nThe convoy burned. The silk caught first. Then the decorative lacquer. Then the fuel lines that had not been armoured because no one had armoured a wedding barge in four hundred years.\n\nFrom the command deck of the Pale Meridian — a fleet-carrier retrofitted for command in the six weeks since it became clear this was no longer a convoy but a war — Isolde watched the barges die and felt nothing that could be called surprise.\n\nShe ruled the Eastern Sectors alongside her sister Y'sinde, their husbands Aurel de Rothschild and Tariq al-Sa'ud. The Four Who Sat the East.",
    quote: "The empire is not land. It is continuity." },
  { id: 7, cat: "character", title: "Leraq of Vath", era: "All Eras", aliases: "The Va Sumir Advisor", appeared: "Vol. 19",
    excerpt: "Leraq of Vath — the Va Sumir Advisor. Not human. An elder of an ancient order. His autobiography is one of the primary sources of the Iseldoran Sagas.",
    full: "Leraq of Vath is the Va Sumir Advisor — a non-human figure whose autobiography (Volume 19 of the Iseldoran Sagas, 5,157 words) constitutes one of the primary sources of the archival record. He is described in the Code of Martyrs as 'The Va Sumir Advisor' — an ancient intelligence whose relationship to the empire spans multiple eras.\n\nHis portrait shows: a pale, deeply lined face; pointed ears; gold lattice crown; grey-blue deep-set eyes. He wears a dark uniform with gold pauldrons and a crimson inner cloak, with a blue stone at the chest. His expression carries the particular stillness of someone who has watched multiple civilizations rise and decline.",
    quote: "" },
  { id: 8, cat: "character", title: "Germionus de Maldor", era: "The Quiet King Era", aliases: "The Quiet King, The Immune System", appeared: "Vol. 12",
    excerpt: "He did not fight. He absorbed. The Quiet King — the emperor the empire didn't know how to understand, and therefore couldn't destroy.",
    full: "Germionus de Maldor bears two epithets that define his reign: The Quiet King and The Immune System. He governed not through force but through a kind of institutional impenetrability — adapting to threats, rendering them irrelevant, continuing. The empire's antibodies moved through him and past him without finding purchase.\n\nHis portrait shows: Asian features, dark eyes, cropped black hair worn up, black high-collar uniform. An expression of contained, patient intelligence.",
    quote: "" },
  { id: 9, cat: "character", title: "Ishak", era: "Code of Martyrs", aliases: "The Withered King, The Fox", appeared: "Code of Martyrs Books I–IV",
    excerpt: "Ishak the Fox — secret hunger of the state. Brother to Ashim the Lion. The Withered King. His purple-crackling eyes have seen what the empire chose to forget.",
    full: "Ishak is one of the two brothers at the centre of the Code of Martyrs saga — Ashim the Lion and Ishak the Fox, the shield and the secret hunger of the Dragon Throne of Maldorus.\n\nHis portrait shows: a face of extreme damage — cracked and mapped with veins of purple energy, glowing eyes, white hair radiating outward. He wears dark robes with purple accents and carries a crackling purple spear. He is The Withered King — a figure who has survived something that should have killed him, and who carries that survival visibly.",
    quote: "" },
  { id: 10, cat: "character", title: "Kaisar Vane", era: "Code of Martyrs", aliases: "The Iron God", appeared: "Code of Martyrs Book IV",
    excerpt: "Kaisar Vane — The Iron God. He pulled the soul from the Lattice. The Victory of Peace. The most terrible victory of all.",
    full: "Kaisar Vane is The Iron God of the Code of Martyrs — the antagonist of the final volume, who achieves the Victory of Peace by removing all disorder from the Lattice, including the parts of it that were human.\n\nHis portrait shows: heavy, battle-scarred armour in black and dark metal; a mechanical red eye on the left side of his face; the massive build of a figure who has replaced parts of himself with something harder. He represents the endpoint of the empire's logic — order achieved by removing everything that resisted it.",
    quote: "" },
  { id: 11, cat: "character", title: "Gamelon", era: "Code of Martyrs", aliases: "The Jester, The Accountant", appeared: "Code of Martyrs Books I–IV",
    excerpt: "The Jester who traded his laughter for a seat at the feet of the Machine. The Accountant who kept the ledgers of the empire's costs.",
    full: "Gamelon occupies the peculiar position of The Jester and The Accountant simultaneously in the Code of Martyrs. His two epithets are not contradictory — they describe the same function from different angles: one who makes visible the absurdity of what is being calculated, while calculating it precisely.\n\nHis portrait shows: white face paint, blue diamond beneath the left eye, theatrical costume in white and black. An expression caught between performance and private knowledge — the face of someone who has understood the joke and found it no longer funny, but continues performing it because the alternative is worse.",
    quote: "" },
  { id: 12, cat: "character", title: "Prince Kairoh Pierre von Care", era: "All Eras (Compiler)", aliases: "Master Archivist, Grand Marshal", appeared: "All volumes — narrator/compiler",
    excerpt: "Master Archivist and Grand Marshal simultaneously. He gave Jaza his first order. He compiled the record of what Jaza became. He commissioned the legal opinion that ended Asha's reign. He is the voice of the Iseldoran Sagas.",
    full: "Prince Kairoh Pierre von Care is the Master Archivist of the Imperial Archive at Bundchen Prime — and simultaneously, during the Generalísima era, Grand Marshal of the Black Death. He held Aurelia's Wrath for 20 years before transferring it to Selene.\n\nHe gave Augustus Lucius Jaza his first order. He compiled the Seven Victories forty years later and confessed he had not reached a conclusion about whether the order was correct.\n\nHe commissioned the legal opinion that removed Asha Kers I from the Dragon Throne. He did not tell Asha he had commissioned it.\n\nDescribed as: tired and composed; hands always steady.\n\nThe sealed archive of La Generalísima is addressed to his son Livian Pierre von Care — future Master Archivist. The archive records: the archive is not passive. It is a civilisational argument. Let the record stand.",
    quote: "The archive is not passive. It records. And what it records, it preserves — as argument, as judgement, as the shape of what was done." },
  { id: 13, cat: "faction", title: "The Black Death", era: "All Eras", aliases: "The Emperor's Final Argument", appeared: "All volumes",
    excerpt: "They do not fight wars. They remove resistance. 'Where they stand, the empire survives. Where they leave, the people whisper softer afterward.'",
    full: "The Black Death is the Dragon Throne's elite institutional force — the only organization that remained sharp when the Vexori became bureaucracies and the Sullied Legions became habit.\n\nUnder Jaza it became something it had not been before: not just a military instrument but a transformation engine. Prince Kairoh aimed it at a crisis and received an institution at the end that was more dangerous to the throne it had preserved than any force arrayed against it.\n\nUnder Selene Jaza it became something else again: the thing the throne is supposed to do, without the throne's theatrics.\n\nThe succession logic of the Generalísima era: the Black Death's founding moment was the Seven Days. The curriculum teaches the investiture, the Varos exchange, the VISHALAY chant. It does not teach what happened to Orazah'hux, von Hapsburgi, or Muskus. Selene's argument: an institution that teaches its operators that succession transitions cleanly will be surprised the next time one doesn't.",
    quote: "Where they stand, the empire survives. Where they leave, the people whisper softer afterward." },
  { id: 14, cat: "faction", title: "The Nine Foundry Houses of Ixoria", era: "All Eras", aliases: "The Houses, The Forge Dynasties", appeared: "Ixoria Canon Archive, La Generalísima Appendix VII",
    excerpt: "Nine semi-feudal industrial sovereignties. No House could openly challenge the throne. Several came close. The empire tolerated their power because no alternative existed.",
    full: "The Nine Foundry Houses emerged during the late Luceron industrial expansions and became hereditary industrial sovereignties embedded inside the imperial structure itself. Each controlled specialized forge sectors, hereditary labor populations, orbital dock chains, convoy access corridors, furnace cities, and private security cadres.\n\nHouse Varekh (armanite smelting), House Serrakai (hull reinforcement lattices), House Malzhur (reactor core housings), House Thessar (orbital drydock construction), House Ixen (military armor fabrication — refuses to melt armor that has earned a name), House Dravos (foldgate anchor construction — movement equals sovereignty), House Korvel (munition production), House Nazhet (atmospheric filtration — controls breathable air), House Oryx (shipbreaking and battlefield reclamation — 'The ships are still serving').\n\nIxoria does not merely produce ships. Ixoria maintains civilization-scale military continuity.",
    quote: "Some steel has already earned eternity. — House Ixen" },
  { id: 15, cat: "faction", title: "The Star Wolves", era: "The Star Wolf Era", aliases: "The Eleven, The Assembly", appeared: "Vol. 11, 17",
    excerpt: "Eleven commanders who stood at Khuvius's shoulder across five frontier wars. Mercurio of the Third Wing. Nayra of Kithoun. Vor'Dressal of the First Horde. The sixth war was Hesh-Kar, and Hesh-Kar made his daughter.",
    full: "The Star Wolves were eleven commanders who stood at the shoulder of Khuvius Augustus Pierre von Care across five wars across the Trinitarian frontier rim: Mercurio of the Third Wing, Nayra of Kithoun, Vor'Dressal of the First Horde, Saksai of the Black Steppe, and seven others.\n\nEach campaign tightened them. Each campaign carved one more ridge of scar across the gauntlets of Mercurio.\n\nMercurio of the Third Wing is the biological father of Empress Aurelia I. He was Asha's protector, her commander, her witness, and the man who loved her before the universe did. Born on Runeon, heir to the de Rothschild quantite mining empire — he was approximately ten years senior to Emperor Livius, thirty to Crown Prince Khuvius, fifty to Asha Kers I. He did not appear any of these things.",
    quote: "" },
  { id: 16, cat: "faction", title: "The Meraud Free Republic", era: "La Generalísima Era", aliases: "The Republic, The Outer Coalition", appeared: "La Generalísima",
    excerpt: "Remi Vey raised the Republic flag at age 23. He moved in three years rather than fifteen — his father's error, one generation later. Nine years of war. Selene commanded from the Sable Absolute.",
    full: "The Meraud Free Republic was raised by Remi Vey — son of Talassar Vey — at age 23, approximately 18 years before Year One of the Generalísima's tenure. He moved in three years rather than fifteen, making his father's error one generation later.\n\nThe Republic War lasted nine years. Key engagements: Cassian Drift (Year 2 of the war, loss of the Relentless), Meraud Station (atmosphere siege), Corridor of Yren (Year 5 — Talos Briath's attack, Selene wounded), Seven Moons of Harak (Year 8 — decisive), The Duel.\n\nTalos Briath: took seven vessels through the Corridor of Yren using 8% debris-cycle variance. Selene studied him for three months. She used his method at Harak. At the duel: 'You cheated twice.' Her response: 'The code says the fight ends when one combatant cannot continue. The code is satisfied.'\n\nRemi Vey read Prince Kairoh's archival account of his father's death fourteen times. He disappeared on a Wednesday aged 32. His argument was wrong about method, right about substance.",
    quote: "Loyalty is reality. Reality is law. Law is eternal." },
  { id: 17, cat: "location", title: "Ixoria", era: "All Eras", aliases: "The Forge-Moon, The Foundry", appeared: "All volumes",
    excerpt: "The dock-rings had no night cycle to pause for. Steel remembers the hand that shaped it. The hand does not wait to see where the steel goes.",
    full: "The Sable Absolute's armor was built on Ixoria. So was every weapon it carried. The forge-moon in the Kasparian Belt had been producing the Black Death's equipment since the organization's founding — all of it forged in a place that smelled of burnt metal and machine oil and the particular welding ozone of operations that never paused for darkness because the dock-rings above Ixoria had no night cycle to pause for.\n\nJaza launched seven battle fleets from Ixorian dock-rings within thirty-six hours during the final mobilization of the Merchant War. The orbital sky burned gold for three nights. Workers went back to their stations without ceremony when it was over.\n\nThis is what Ixoria does. It makes things and releases them into the wars and returns to making more things.",
    quote: "Steel remembers the hand that shaped it. The hand does not wait to see where the steel goes." },
  { id: 18, cat: "location", title: "The Sable Absolute", era: "The Merchant War, La Generalísima Era", aliases: "The Flagship", appeared: "Seven Victories Appendices, La Generalísima",
    excerpt: "The only Black Death ship whose name was publicly recorded. Nine hundred and forty crew, listed as two hundred. Twenty degrees below standard comfort specifications. One connection to the Dragon Throne at the end of the corridor.",
    full: "The Sable Absolute was the only Black Death ship whose name was publicly recorded — a deliberate choice. Listed as 'medium-grade command carrier' with 200 crew. Actual crew: 940. Four identical decoy hulls were built.\n\nIt ran twenty degrees below standard Imperial Navy comfort specifications. Cold reduced fatigue errors. People slightly uncomfortable were slightly more alert.\n\nAt the end of the central corridor: the communications vault. A single chair. A single encrypted console. A single connection to the Dragon Throne.\n\nIn Year 25 of the Generalísima's tenure, Prince Kairoh boarded the Sable Absolute for the final interview of the sealed archive. The ship smelled the same.",
    quote: "" },
  { id: 19, cat: "location", title: "The Dragon Throne of Maldorus", era: "Code of Martyrs", aliases: "The Lattice Throne", appeared: "Code of Martyrs Books I–IV",
    excerpt: "Polished by the backs of fourteen emperors. Shapur the Eternal sat it. The rot hides in the perfume. The Baths of Kasparia steam thick enough to chew.",
    full: "The Dragon Throne of Maldorus is the imperial seat of the Code of Martyrs universe — a parallel or prior empire to the main Iseldoran Sagas timeline, presided over by Shapur the Eternal (whose veins flow with the fluids of indefinite life) and contested by the brothers Ashim the Lion and Ishak the Fox.\n\nThe empire is called the Empire of the Lattice — an algorithmic civilization where 'the stars moved in clockwork precision and the hearts of men beat to the rhythm of the algorithm.' The rot was always present. It hid in the perfume.",
    quote: "Sing, O Muse of the Golden Cage, of the days before the silence fell." },
  { id: 20, cat: "event", title: "The Seven Days", era: "La Generalísima Era", aliases: "The Investiture, The Sealed Archive", appeared: "La Generalísima",
    excerpt: "Day 2: Orazah'hux. Day 4: von Hapsburgi. Day 6, 0600: Muskus. Day 7, 1100: the ceremony. Augustus descends at 1342. Does not look back.",
    full: "The Seven Days are the founding moment of the Generalísima's tenure — the succession transition engineered by Demetrius Jaza over seven days following the death of Augustus Lucius Jaza at 0317:43 on Day 0.\n\nDay 2: General Orazah'hux killed by Alexa von Stoiban at 0545. Filed as frame failure. Cassiel Rho spends six hours eliminating a routing anomaly.\n\nDay 4: General Prince Remus von Hapsburgi shot by Palas Vren at 0847. Seventeen-second surveillance gap. Single round. Six years of reasons.\n\nDay 6, 0600: Arch General Dará Muskus dies. Livian Pierre von Care had made her tea. She knew the shape. She stayed.\n\nDay 7, 1100–1347: The investiture. Kairoh performs Sennath Rha. VISHALAY chant. Callum Resh executed. Augustus descends at 1342. Departs 1347. Does not look back. Described as: the most sophisticated political act of his reign.",
    quote: "" },
  { id: 21, cat: "event", title: "The Killing of Talassar Vey", era: "The Merchant War", aliases: "The Sangfroid, The Marble Strategy Chamber", appeared: "Seven Victories Appendices, La Generalísima Appendix I",
    excerpt: "Thirty-seven seconds between picking up the abdication instrument and setting it back down. The knife was personal, not military-issue. He held Vey upright afterward until the synthetic eyes stopped tracking.",
    full: "Three answers, wrote Prince Kairoh Pierre von Care after forty years of study.\n\nThe institutional answer: the abdication instrument was produced under manufactured duress. Not a free act.\n\nThe doctrinal answer: Vey had turned the Black Death's founding principle against the institution itself. The knife was stepping outside the procedure.\n\nThe personal answer: when Jaza asked what would happen to Augustus Julius II, Vey said 'that depends on how the interregnum develops' and 'then decisions will need to be made.' He communicated the Emperor's conditional survival while maintaining plausible deniability. Jaza was a soldier. Soldiers understand that kind of statement.\n\nThe knife was personal — carried everywhere in the tradition of the Lords of Mérida since old Earth's southern continent. Not brought to a killing. A tool that became one.\n\nJaza held Vey upright afterward. Until the synthetic eyes stopped tracking. You do not let a man like that die on the floor. Even when you are the reason he is dying.",
    quote: "You do not let a man like that die on the floor. Even when you are the reason he is dying." },
  { id: 22, cat: "event", title: "The Seven Fleet Launch", era: "The Merchant War", aliases: "The Gold Sky", appeared: "Seven Victories Appendices",
    excerpt: "Seven battle fleets in thirty-six hours. The orbital sky burned gold for three nights. Workers watched through refinery smoke and went back to their stations without ceremony.",
    full: "Jaza launched seven battle fleets from Ixorian dock-rings within thirty-six hours during the final mobilization of the Merchant War. The orbital sky above the forge-moon burned gold for three nights from engine ignition.\n\nWorkers on the surface watched through refinery smoke as the constellations of the dock-rings emptied. They reportedly went back to their stations without ceremony when it was over.\n\nThis is what Ixoria does.",
    quote: "" },
  { id: 23, cat: "event", title: "The Cooling Riots", era: "The Luceron Industrial Era", aliases: "The Varekh Disaster", appeared: "Ixoria Canon Archive",
    excerpt: "House Varekh redirected coolant. 2.4 million dead. Eleven days. Director Havel Tor Varekh. His name remains a curse. Workers still spit after saying it aloud.",
    full: "The Cooling Riots began during the reign of Lucius Luceron I after House Varekh redirected coolant resources toward military production quotas during a frontier emergency. Habitation temperatures in the Lower Furnace Districts exceeded survivable thresholds.\n\nEstimated dead: 2.4 million. The riots lasted eleven days.\n\nThe responsible overseer was Director Havel Tor Varekh. His refusal to reduce military production became one of Ixorian history's defining traumas. His name remains a curse in lower habitation sectors. Workers still spit after saying it aloud.",
    quote: "" },
  { id: 24, cat: "tradition", title: "The Mérida Theology", era: "House Jaza / La Generalísima Era", aliases: "", appeared: "La Generalísima Appendix II",
    excerpt: "The Lords of Mérida hold that neural-regenerative lattice treatment is a transgression against the form that Tengri has given. You carry what you have earned. Augustus Lucius Jaza died for this conviction.",
    full: "The Mérida theology holds that interventions such as the Vah'Sumir neural-regenerative lattice treatment constitute a transgression against the form that Tengri has given. You carry what you have earned.\n\nAugustus Lucius Jaza refused the treatment at the Ardenne Passage and died for this conviction.\n\nWhether Selene holds the same belief is unresolved in the archive. She has authorised Vah'Sumir procedures for operators under her command when the alternative was death. These facts answer a question about pragmatism. The Mérida theology is not about pragmatism. It concerns what earned cost does to the person who bears it — whether the weight, kept, makes something, or only damages.\n\nPrince Kairoh watched Selene for twenty-five years and found no evidence of the corrosion that destroys most people under equivalent weight. He does not know whether this is the theology at work or something else entirely. The archive records the uncertainty.",
    quote: "" },
  { id: 25, cat: "tradition", title: "The Death-Steel Tradition", era: "All Eras (Ixoria)", aliases: "The Mortuary Forges, The Honored Dead", appeared: "Ixoria Canon Archive",
    excerpt: "House Ixen maintains armor crypts. House Oryx refuses to scrap Black Death cruiser fragments. 'Some steel has already earned eternity.' 'The ships are still serving.'",
    full: "The death-steel tradition on Ixoria holds that metal which has served in war is not merely material to be recycled.\n\nHouse Ixen maintains ceremonial armor crypts beneath their forge cathedrals — entire vaults of preserved armor from extinct military orders. They refuse to melt armor carrying confirmed Black Death kill marks, command inscriptions, or bloodline seals.\n\nHouse Oryx processes destroyed fleets and recovers battlefield dead. Their workers spend entire lives dismantling burned warships and corpse-filled compartments. They have refused to scrap recovered Black Death cruiser fragments: 'The ships are still serving.'\n\nWhen Ixen leadership was pressured by Imperial procurement officials, they declared: 'Some steel has already earned eternity.'",
    quote: "Some steel has already earned eternity." },
  { id: 26, cat: "technology", title: "The Sullied Legions", era: "The Clone Wars / Early Imperial", aliases: "The Sullied, Clone Legions, Vat-Born", appeared: "Vol. 1",
    excerpt: "Humanoid clones from the Muskite Forges. Could replicate themselves, digest iron dust, survive half-oxygen atmospheres. At first they were tools. Then they were habit.",
    full: "The Sullied Legions were humanoid clones built by the Muskite Forges and sold in regiments like grain. They could replicate themselves, digest iron dust for sustenance, survive on half-oxygen atmospheres. A commander could lose a thousand and still keep formation.\n\nAt first they were tools. Then they were habit. The patricians congratulated themselves on their efficiency. They no longer recruited from their own sons.\n\nThe first Sullied who spoke publicly did so at a 'public consultation' on the moon Nackañia Prime. His serial read R4-KYA-11. The crowd remembered him as Rakya-a-lel: 'We already protect the pure. We fight your pirates, your heretics, your boredom. Why should we guard anyone?'",
    quote: "Obedience always seeks an owner. If the throne hesitates even once, they will find another master — one they can see." },
  { id: 27, cat: "technology", title: "The Vah'Sumir Neural-Regenerative Lattice", era: "The Generalísima Era and After", aliases: "Lattice Treatment", appeared: "La Generalísima Appendix II",
    excerpt: "The treatment that slows biological aging and repairs neural degradation. Refused by Augustus Lucius Jaza on Mérida theological grounds. Used by Selene for operators facing death.",
    full: "The Vah'Sumir neural-regenerative lattice treatment is an imperial-era medical technology capable of slowing biological aging, repairing neural degradation, and extending viable combat lifespan.\n\nThe Lords of Mérida hold it a transgression against the form that Tengri has given. Augustus Lucius Jaza refused it at the Ardenne Passage and died for this conviction.\n\nSelene Jaza has authorised the treatment for operators under her command when the alternative was death. The archive records the gap between pragmatism and theology without resolving it.",
    quote: "" },
];

const SOVEREIGNS = [
  { era: "The Founding Era", color: "#c9a84c", rulers: [
    { name: "Eustace I Bartholamer Pierre von Care", epithet: "The Architect", note: "Conceived the Trinitarian Empire in bloodline, alliance, and law. Died before its execution." },
    { name: "Kerron Pierre von Care", epithet: "The Dragon Emperor", note: "Founded the Trinitarian Empire by conquest. Established ritual submission." },
    { name: "Hamish Pierre von Care", epithet: "The Shielded King", note: "Preserved and consolidated the early empire." },
    { name: "Cassian I", epithet: "The God-King", note: "Executed 433 rival princes. Ended competing dynasties. Made God-Emperorship a lived reality." },
  ]},
  { era: "The Cassiel Withdrawal Era", color: "#7a5e28", rulers: [
    { name: "Cassiel I", epithet: "The Absent Emperor", note: "" },
    { name: "Cassiel II", epithet: "The Seeker", note: "" },
    { name: "Cassiel III", epithet: "The Silent Flame", note: "" },
    { name: "Cassiel IV (Manjooni Lucencius)", epithet: "The Last Withdrawn", note: "" },
  ]},
  { era: "Second Cassian Restoration", color: "#8b3a1e", rulers: [
    { name: "Cassian II", epithet: "The Reclaimer", note: "" },
    { name: "Cassian III", epithet: "The Iron Regent", note: "" },
    { name: "Cassian IV", epithet: "The Consolidator", note: "" },
    { name: "Cassian V", epithet: "The Administrator", note: "" },
    { name: "Cassian VI", epithet: "The Exhausted Lion", note: "" },
  ]},
  { era: "The Quiet Eustacian Line", color: "#6b6070", rulers: [
    { name: "Eustace II", epithet: "The Caretaker", note: "" },
    { name: "Eustace III", epithet: "The Clerk Emperor", note: "" },
    { name: "Eustace IV", epithet: "The Auditor", note: "" },
    { name: "Eustace V", epithet: "The Surveyor", note: "" },
    { name: "Eustace VI", epithet: "The Jurist", note: "" },
    { name: "Eustace VII", epithet: "The Balancer", note: "" },
    { name: "Eustace VIII", epithet: "The Endurer", note: "" },
  ]},
  { era: "The Napoleonic God-Emperors", color: "#c9a84c", rulers: [
    { name: "Napoleon IV", epithet: "The Renamer", note: "" },
    { name: "Napoleon V", epithet: "The Lawgiver", note: "" },
    { name: "Napoleon VI", epithet: "The Fleet-Builder", note: "" },
    { name: "Napoleon VII", epithet: "The Colonizer", note: "" },
    { name: "Napoleon VIII", epithet: "The Innovator", note: "" },
    { name: "Napoleon IX", epithet: "The Integrator", note: "" },
    { name: "Napoleon X", epithet: "The Mediator", note: "" },
    { name: "Napoleon XI", epithet: "The Listener", note: "" },
    { name: "Napoleon XII", epithet: "The Younger", note: "" },
    { name: "Napoleon XIII", epithet: "The Restless", note: "" },
    { name: "Napoleon XIV", epithet: "The Formalist", note: "" },
    { name: "Napoleon XV", epithet: "The Administrator", note: "" },
    { name: "Napoleon XVI", epithet: "The Enforcer", note: "" },
    { name: "Napoleon XVII", epithet: "The Stabilizer", note: "" },
    { name: "Napoleon XVIII", epithet: "The Reformer", note: "" },
    { name: "Napoleon XIX", epithet: "The Quiet", note: "" },
    { name: "— Usurpation: Naim al-Hapsburgi —", epithet: "Not counted", note: "Usurper. Not recognized in the official line." },
    { name: "Napoleon XX (Lucius Pierre von Care)", epithet: "The Reclaimer", note: "" },
    { name: "Napoleon XXI", epithet: "The Builder", note: "" },
    { name: "Napoleon XXII", epithet: "The Arbiter", note: "" },
    { name: "Napoleon XXIII", epithet: "The Watcher", note: "" },
    { name: "Napoleon XXIV", epithet: "The Militarist", note: "" },
    { name: "Napoleon XXV", epithet: "The Organizer", note: "" },
    { name: "Napoleon XXVI", epithet: "The Patient", note: "" },
    { name: "Napoleon XXVII", epithet: "The Strategist", note: "" },
    { name: "Napoleon XXVIII", epithet: "The Keeper", note: "" },
    { name: "Napoleon XXIX", epithet: "The Accountant", note: "" },
    { name: "Napoleon XXX", epithet: "The Defender", note: "" },
    { name: "Napoleon XXXI", epithet: "The Reconciler", note: "" },
    { name: "Napoleon XXXII", epithet: "The Veteran", note: "" },
    { name: "Napoleon XXXIII", epithet: "The Elder", note: "" },
    { name: "Napoleon XXXIV", epithet: "The Waiting King", note: "" },
    { name: "Napoleon XXXV", epithet: "The Silent God", note: "" },
  ]},
  { era: "Post-Napoleonic Fracture", color: "#9a8fa0", rulers: [
    { name: "Eustace IX", epithet: "The Avenger's Father", note: "Abdicated after stabilizing the empire." },
  ]},
  { era: "The Liberal Collapse", color: "#5c1515", rulers: [
    { name: "Erulius Bobitus", epithet: "The Scholar King", note: "Son of Eustace IX. Denounced overt godhood. Strengthened civil governance. Weakened the metaphysical authority of the Dragon Throne." },
    { name: "Romulus Secundus", epithet: "The Pageant King", note: "Fiscally reckless. Indulgent. Overthrown after treasury collapse." },
  ]},
  { era: "The Republican Experiment", color: "#6b6070", rulers: [
    { name: "Raja the Brilliant", epithet: "President, then King", note: "Abolished monarchy. Founded the Universal Republic. Public pressure forced restoration of the royal title. Died without issue." },
  ]},
  { era: "The First Luceron Restoration", color: "#c9a84c", rulers: [
    { name: "Lucius Luceron I", epithet: "The Flame Bearer", note: "Grandson of Romulus Secundus. Republican in words. Sovereign in deeds. Clawed power back to the Dragon Throne." },
    { name: "Kaelen Pierre von Care", epithet: "The Living Weapon", note: "" },
    { name: "Ysinde", epithet: "The Dawn Empress", note: "" },
    { name: "Isolde", epithet: "The Twin Throne", note: "" },
    { name: "Aurelian", epithet: "The Murdered Sun", note: "" },
    { name: "Cassander I", epithet: "The Avenger", note: "" },
    { name: "Cassander II", epithet: "The Stabilizer", note: "" },
  ]},
  { era: "The Great Interregnum", color: "#5c1515", rulers: [
    { name: "Twenty-five years without stable sovereignty", epithet: "The Interregnum", note: "Twenty-six pretenders eliminated by Germionus de Maldor." },
  ]},
  { era: "The Fractured Claimants", color: "#6b6070", rulers: [
    { name: "Joffrey the Generous", epithet: "Populist Redistributionist", note: "Unsustainable." },
    { name: "Gabriel", epithet: "Administrative Reformer", note: "Weak support." },
    { name: "Igor the Idiot", epithet: "Force-Based Rule", note: "Collapsed quickly." },
  ]},
  { era: "The Second Luceron Restoration", color: "#c9a84c", rulers: [
    { name: "Lucius Luceron II", epithet: "The Restorer", note: "Republican façade. Gradual consolidation. Restored effective monarchy. Named his son God-Emperor at death." },
  ]},
  { era: "The Copper and Violet Era", color: "#7a5e28", rulers: [
    { name: "Iskandar", epithet: "Emperor of the Copper West", note: "Preserved imperial structure during transition." },
    { name: "Aurelia", epithet: "Empress of the Violet East", note: "Preserved imperial structure during transition." },
    { name: "Lars Miraj", epithet: "Regent", note: "Preserved imperial structure during transition." },
    { name: "Lucius Luceron III", epithet: "The Philosopher Who Went to War", note: "Re-imperialized the state. Accepted full godhood at death." },
  ]},
  { era: "Goddesses and Dominion", color: "#c9a84c", rulers: [
    { name: "Empress Amira", epithet: "The Bastard Goddess", note: "" },
    { name: "Augustus Rex", epithet: "The Bastard God", note: "Led ninety billion soldiers Beyond the Rim. The Dragon Throne carries his passage in its stone." },
    { name: "Livius", epithet: "The Maintainer", note: "" },
    { name: "Asha Kers I", epithet: "La Diosa", note: "Codified Universal Khanate Law." },
    { name: "Asha Kers II (Aurelia)", epithet: "The Heir Goddess", note: "" },
    { name: "Augustus Dominus", epithet: "The Final God", note: "" },
    { name: "Augustus Julius I", epithet: "The Successor", note: "" },
    { name: "Augustus Julius II", epithet: "The Custodian", note: "Reigning during the Merchant War and the Generalísima investiture." },
    { name: "Augustus Julius III", epithet: "The Last Augustan", note: "" },
  ]},
  { era: "The al-Sa'ud Era", color: "#7a5e28", rulers: [
    { name: "Saldin I al-Sa'ud", epithet: "The Sun Prince", note: "" },
    { name: "The al-Sa'ud Dynasty", epithet: "Ten Thousand Years", note: "" },
    { name: "Sookraj", epithet: "The Final Saudi God-Emperor", note: "" },
  ]},
  { era: "Restoration of the Bloodline", color: "#c9a84c", rulers: [
    { name: "Mettenik I Pierre von Care", epithet: "Restorer of the Dragon Throne", note: "The line returns. The empire is made whole." },
  ]},
];

const TIMELINE = [
  { id: 1, title: "The Founding Era", date: "Eustace I → Cassian I", desc: "Eustace I Bartholamer Pierre von Care conceives the Trinitarian Empire and dies before seeing it executed. Kerron Pierre von Care founds it by conquest. Cassian I ends all rival dynasties by executing 433 princes — making God-Emperorship a lived reality rather than a claim.", events: [{ y: "Foundation", t: "Kerron Pierre von Care — The Dragon Emperor — founds the Trinitarian Empire by conquest. Ritual submission established." }, { y: "Cassian I", t: "433 rival princes executed. Competing dynasties ended. The God-Emperor is no longer a title. It is a fact." }] },
  { id: 2, title: "The Withdrawal & Restoration Eras", date: "Cassiel I → Napoleon XXXV", desc: "Four Cassiel emperors withdraw from active rule. The Cassian line restores, then the Eustacian line administers. The Napoleonic God-Emperors — thirty-five in succession, interrupted once by the usurper Naim al-Hapsburgi — expand, colonize, integrate, and finally exhaust the empire's institutional momentum.", events: [{ y: "Cassiel Era", t: "Four Withdrawn emperors. The throne persists without its occupant." }, { y: "Eustacian Line", t: "Seven Eustacian emperors — caretakers, clerks, auditors, jurists. The empire maintained by administration rather than conquest." }, { y: "Napoleonic Era", t: "Napoleon IV through XXXV. Thirty-five sovereigns across fleet-building, colonization, integration, and slow decline." }, { y: "Usurpation", t: "Naim al-Hapsburgi seizes the throne. Not counted in the official line. Napoleon XX (Lucius Pierre von Care) reclaims it." }] },
  { id: 3, title: "The Liberal Collapse & Republican Experiment", date: "Eustace IX → Raja the Brilliant", desc: "Erulius Bobitus denounces overt godhood and weakens the Dragon Throne's metaphysical authority. Romulus Secundus collapses the treasury. Raja the Brilliant abolishes monarchy entirely — then is forced by public pressure to restore the royal title. He dies without issue.", events: [{ y: "Erulius Bobitus", t: "The Scholar King. Son of Eustace IX. Denounced overt godhood. Strengthened civil governance. Weakened what the throne was." }, { y: "Romulus Secundus", t: "The Pageant King. Fiscally reckless. Overthrown after treasury collapse." }, { y: "Raja the Brilliant", t: "Abolished monarchy. Founded the Universal Republic. Forced to restore the royal title. Died without issue." }] },
  { id: 4, title: "The First Luceron Restoration", date: "Lucius Luceron I → Cassander II", desc: "Lucius Luceron I — grandson of Romulus Secundus, The Flame Bearer — is republican in words and sovereign in deeds. He claws power back to the Dragon Throne. The line runs through Kaelen, the Twin Thrones, Aurelian the Murdered Sun, and the two Cassanders.", events: [{ y: "Lucius Luceron I", t: "The Flame Bearer. Republican in words. Sovereign in deeds. Power returns to the Dragon Throne." }, { y: "Kaelen Pierre von Care", t: "The Living Weapon. Black armor. Green eyes. The God Emperor." }, { y: "Ysinde & Isolde", t: "The Twin Thrones — The Dawn Empress and The Twin Throne. The Four Who Sat the East." }, { y: "Aurelian", t: "The Murdered Sun. Aurelian made them love him." }, { y: "Cassander I & II", t: "The Avenger and The Stabilizer. Cassander made them obey." }] },
  { id: 5, title: "The Great Interregnum & Fractured Claimants", date: "25 Years Without Sovereignty", desc: "Twenty-five years without stable sovereignty. Twenty-six pretenders eliminated by Germionus de Maldor — The Quiet King, The Immune System. Three named claimants leave only wreckage before the Second Luceron Restoration.", events: [{ y: "The Interregnum", t: "Twenty-six pretenders. Germionus de Maldor eliminates each one. The throne waits." }, { y: "Joffrey, Gabriel, Igor", t: "Populist redistribution, administrative reform, force. Each collapses. None holds." }] },
  { id: 6, title: "The Second Luceron Restoration & Copper-Violet Era", date: "Lucius Luceron II → Lucius Luceron III", desc: "Lucius Luceron II — The Restorer — maintains a republican façade while gradually consolidating monarchy. He names his son God-Emperor at death. The Copper and Violet Era follows — Iskandar, Aurelia, and Regent Lars Miraj preserve structure through transition. Lucius Luceron III re-imperializes the state and accepts full godhood at death.", events: [{ y: "Lucius Luceron II", t: "Republican façade. Gradual consolidation. Named his son God-Emperor at death." }, { y: "The Copper and Violet Era", t: "Iskandar (Copper West), Aurelia (Violet East), Lars Miraj (Regent) — the triumvirate that holds the empire through transition." }, { y: "Lucius Luceron III", t: "The Philosopher Who Went to War. Re-imperialized the state. Accepted full godhood at death." }] },
  { id: 7, title: "Goddesses and Dominion", date: "Empress Amira → Augustus Julius III", desc: "The age of Bastard Gods and Goddesses. Empress Amira. Augustus Rex — who went Beyond the Rim and returned having replaced a god. Livius the Maintainer. Asha Kers I, who codified Universal Khanate Law. The Augustan line ends with Julius III.", events: [{ y: "Empress Amira", t: "The Bastard Goddess — The First Goddess-Empress." }, { y: "Augustus Rex", t: "The Bastard God. Led ninety billion soldiers Beyond the Rim. The Dragon Throne carries his passage in its stone." }, { y: "Asha Kers I", t: "La Diosa. Codified Universal Khanate Law. Ruled forty-one years. Walked to the platform with 17,426 names under her arm." }, { y: "The Augustan Line", t: "Augustus Dominus (The Final God), Augustus Julius I, II (The Custodian — reigning during the Merchant War), III (The Last Augustan)." }] },
  { id: 8, title: "The al-Sa'ud Era & Restoration of the Bloodline", date: "Saldin I → Mettenik I", desc: "The al-Sa'ud dynasty — Saldin I through Sookraj, the Final Saudi God-Emperor — holds the throne for what the records call Ten Thousand Years. The compact Demetrius Jaza built with Leila al-Sa'ud four centuries prior finally matures. Mettenik I Pierre von Care restores the bloodline.", events: [{ y: "Saldin I al-Sa'ud", t: "The Sun Prince. The Saudi era begins." }, { y: "The al-Sa'ud Dynasty", t: "Ten Thousand Years. The longest unbroken tenure in the history of the Dragon Throne." }, { y: "Sookraj", t: "The Final Saudi God-Emperor." }, { y: "Mettenik I Pierre von Care", t: "Restorer of the Dragon Throne. The Pierre von Care bloodline returns. The empire is made whole." }] },
];


// ─── COMPONENTS ───────────────────────────────────────────────────────────────

function StyleInjector() {
  useEffect(() => {
    const tag = document.createElement("style");
    tag.textContent = STYLES;
    document.head.appendChild(tag);
    return () => document.head.removeChild(tag);
  }, []);
  return null;
}

function Nav({ page, go }) {
  const pages = ["home","novels","characters","bestiary","compendium","sovereigns","timeline","ixoria","covers","about"];
  return (
    <nav className="nav">
      <div className="nav-brand" onClick={() => go("home")}>The Iseldoran Sagas</div>
      <ul className="nav-links">
        {pages.map(p => (
          <li key={p}><button className={page === p ? "active" : ""} onClick={() => go(p)}>{p}</button></li>
        ))}
      </ul>
    </nav>
  );
}

function HomePage({ go }) {
  return (
    <>
      <div className="hero">
        <div className="hero-bg" /><div className="hero-grid" /><div className="hero-ring" />
        <div className="hero-content">
          <span className="hero-eyebrow">The Official Archive of</span>
          <h1 className="hero-title">The Iseldoran Sagas</h1>
          <div className="hero-subtitle">Dragon Throne · Black Death · The Forge-Moon · The Star Wolves · La Generalísima · Code of Martyrs</div>
          <div className="hero-rule"><div className="hero-gem" /></div>
          <p className="hero-lore">
            Thirty-eight volumes across two universes. 1,747,478+ words. Eight eras of empire.
            From Augustus Rex Beyond the Rim to the Compact of Kharvat four centuries hence.
            The official compendium — every emperor, every commander, every war, every world.
          </p>
          <div className="hero-cta">
            <button className="btn-primary" onClick={() => go("novels")}>Browse All Volumes</button>
            <button className="btn-secondary" onClick={() => go("compendium")}>Enter the Compendium</button>
          </div>
        </div>
      </div>
      <div className="stats-bar">
        {[{n:"38",l:"Volumes"},{n:"1.74M+",l:"Words"},{n:"8",l:"Imperial Eras"},{n:"9",l:"Foundry Houses"},{n:"2",l:"Universes"}].map(s => (
          <div key={s.l}><span className="stat-number">{s.n}</span><div className="stat-label">{s.l}</div></div>
        ))}
      </div>
    </>
  );
}

function NovelsPage() {
  const [search, setSearch] = useState("");
  const [seriesFilter, setSeriesFilter] = useState("all");
  const filtered = BOOKS.filter(b => {
    const ms = b.title.toLowerCase().includes(search.toLowerCase()) || b.desc.toLowerCase().includes(search.toLowerCase());
    const mf = seriesFilter === "all" || b.series === seriesFilter;
    return ms && mf;
  });
  return (
    <div style={{paddingTop:"80px"}}>
      <div className="section">
        <div className="section-header">
          <span className="section-eyebrow">The Complete Library · 1,747,478+ Words</span>
          <h2 className="section-title">All Volumes</h2>
          <div className="section-rule"><span className="section-rule-icon">◈</span></div>
          <p className="section-desc">Compiled by Prince Kairoh Pierre von Care, Master Archivist of the Imperial Archive, Bundchen Prime.</p>
        </div>
        <div className="books-filter">
          <input className="global-search" placeholder="Search by title or theme…" value={search} onChange={e => setSearch(e.target.value)} style={{marginRight:"0.5rem"}} />
          {["all","iseldoran","generalisima","martyrs"].map(s => (
            <button key={s} className={`filter-btn ${seriesFilter===s?"active":""}`} onClick={() => setSeriesFilter(s)}>
              {s === "all" ? "All Series" : s === "iseldoran" ? "Iseldoran Sagas" : s === "generalisima" ? "La Generalísima" : "Code of Martyrs"}
            </button>
          ))}
        </div>
        <div className="books-grid">
          {filtered.map(b => (
            <div className="book-card" key={b.id}>
              <div className="book-cover">
                <div className="book-num">#{b.id}</div>
                <span className={`book-series-tag ${b.series === "martyrs" ? "martyrs" : "iseldoran"}`}>
                  {b.series === "martyrs" ? "Code of Martyrs" : b.series === "generalisima" ? "Generalísima" : "Iseldoran"}
                </span>
                {b.cover
                  ? <img src={b.cover} alt={b.title} />
                  : <div className="book-cover-ph"><div style={{fontSize:"1.6rem",opacity:0.18,marginBottom:"0.3rem"}}>◈</div>{b.title}</div>
                }
              </div>
              <div className="book-info">
                <div className="book-title">{b.title}</div>
                <div className="book-subtitle-sm">{b.sub}</div>
                <div className="book-words">{b.words} words</div>
                <div className="book-links">
                  <a className="book-link kindle" href={b.k} onClick={e=>{e.preventDefault();alert("Add your Kindle URL for: "+b.title);}}>Kindle</a>
                  <a className="book-link print" href={b.p} onClick={e=>{e.preventDefault();alert("Add your print URL for: "+b.title);}}>Print</a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function CharactersPage() {
  const [gallery, setGallery] = useState("20");
  return (
    <div style={{paddingTop:"80px"}}>
      <div className="section">
        <div className="section-header">
          <span className="section-eyebrow">Imperial Portrait Archive · Bundchen Prime</span>
          <h2 className="section-title">Character Portraits</h2>
          <div className="section-rule"><span className="section-rule-icon">◈</span></div>
          <p className="section-desc">The God Emperors, commanders, advisors, and figures of the Iseldoran Sagas and Code of Martyrs.</p>
        </div>
        <div className="books-filter" style={{marginBottom:"2.5rem"}}>
          <button className={`filter-btn ${gallery==="20"?"active":""}`} onClick={()=>setGallery("20")}>20 God Emperors</button>
          <button className={`filter-btn ${gallery==="14"?"active":""}`} onClick={()=>setGallery("14")}>14 Major Characters</button>
          <button className={`filter-btn ${gallery==="leraq"?"active":""}`} onClick={()=>setGallery("leraq")}>Leraq of Vath</button>
        </div>

        {gallery === "20" && (
          <>
            <div style={{marginBottom:"1.5rem"}}>
              <img src={IMG.emperors20} alt="20 God Emperors" style={{width:"100%",border:"1px solid rgba(201,168,76,0.2)",display:"block"}} />
            </div>
            <div className="portraits-grid">
              {PORTRAITS_20.map((p,i) => (
                <div className="portrait-card" key={i}>
                  <div className="portrait-img-ph">◈</div>
                  <div className="portrait-name">{i+1}. {p.n}</div>
                  <div className="portrait-epithet">{p.e}</div>
                </div>
              ))}
            </div>
          </>
        )}

        {gallery === "14" && (
          <>
            <div style={{marginBottom:"1.5rem",display:"grid",gridTemplateColumns:"1fr 1fr",gap:"1rem"}}>
              <img src={IMG.characters14} alt="14 Characters" style={{width:"100%",border:"1px solid rgba(201,168,76,0.2)",display:"block"}} />
              <img src={IMG.characters14wide} alt="14 Characters Wide" style={{width:"100%",border:"1px solid rgba(201,168,76,0.2)",display:"block"}} />
            </div>
            <div className="portraits-grid">
              {PORTRAITS_14.map((p,i) => (
                <div className="portrait-card" key={i}>
                  <div className="portrait-img-ph">◈</div>
                  <div className="portrait-name">{i+1}. {p.n}</div>
                  <div className="portrait-epithet">{p.e}</div>
                </div>
              ))}
            </div>
          </>
        )}

        {gallery === "leraq" && (
          <div style={{display:"flex",gap:"2rem",alignItems:"flex-start",flexWrap:"wrap"}}>
            <img src={IMG.leraq} alt="Leraq of Vath" style={{maxWidth:"320px",width:"100%",border:"1px solid rgba(201,168,76,0.2)"}} />
            <div style={{flex:1,minWidth:"260px"}}>
              <div style={{fontFamily:"var(--font-display)",fontSize:"1.4rem",color:"var(--gold)",marginBottom:"0.5rem"}}>Leraq of Vath</div>
              <div style={{fontFamily:"var(--font-title)",fontSize:"0.6rem",letterSpacing:"0.25em",textTransform:"uppercase",color:"var(--rust-bright)",marginBottom:"1rem"}}>The Va Sumir Advisor</div>
              <p style={{fontFamily:"var(--font-body)",color:"var(--bone)",lineHeight:1.85,marginBottom:"1rem"}}>An elder of an ancient non-human order — the Va Sumir. His autobiography (Volume 19, 5,157 words) constitutes one of the primary sources of the Imperial Archive. He served as advisor across multiple eras of the empire.</p>
              <p style={{fontFamily:"var(--font-body)",color:"var(--bone)",lineHeight:1.85}}>His portrait shows: a pale, deeply lined face; pointed ears; gold lattice crown; grey-blue deep-set eyes. A dark uniform with gold pauldrons, crimson inner cloak, blue stone at the chest. The particular stillness of someone who has watched multiple civilizations rise and decline.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function LoreModal({ entry, onClose }) {
  if (!entry) return null;
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e=>e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-tag">{LORE_CATS.find(c=>c.id===entry.cat)?.label} · {entry.era}</div>
          <h2 className="modal-title">{entry.title}</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          {entry.full.split("\n\n").map((p,i)=><p key={i}>{p}</p>)}
          {entry.quote && <div className="modal-quote">"{entry.quote}"</div>}
          <div className="modal-meta">
            {entry.aliases && <div><label>Also Known As</label><span>{entry.aliases}</span></div>}
            <div><label>Era</label><span>{entry.era}</span></div>
            <div><label>Classification</label><span>{LORE_CATS.find(c=>c.id===entry.cat)?.label}</span></div>
            {entry.appeared && <div><label>Appears In</label><span>{entry.appeared}</span></div>}
          </div>
        </div>
      </div>
    </div>
  );
}

function CompendiumPage() {
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
          <p className="section-desc">Characters, factions, locations, events, traditions, and technology across all eras and series. Drawn from primary manuscripts and the sealed archive.</p>
        </div>
        <div className="lore-layout">
          <div className="lore-sidebar">
            <div className="lore-sidebar-header">Archive Categories</div>
            {LORE_CATS.map(c=>(
              <button key={c.id} className={`lore-cat-btn ${cat===c.id?"active":""}`} onClick={()=>setCat(c.id)}>
                <span>{c.icon}</span><span>{c.label}</span><span className="lore-cat-count">{counts[c.id]}</span>
              </button>
            ))}
          </div>
          <div>
            <input className="lore-search-input" placeholder="Search the archive…" value={search} onChange={e=>setSearch(e.target.value)} />
            <div className="lore-entries">
              {filtered.map(e=>(
                <div className="lore-entry" key={e.id} onClick={()=>setSelected(e)}>
                  <div className="lore-entry-tag">{LORE_CATS.find(c=>c.id===e.cat)?.icon} {LORE_CATS.find(c=>c.id===e.cat)?.label} · {e.era}</div>
                  <div className="lore-entry-title">{e.title}</div>
                  <div className="lore-entry-excerpt">{e.excerpt}</div>
                </div>
              ))}
              {filtered.length===0 && <div style={{gridColumn:"1/-1",textAlign:"center",padding:"4rem",color:"var(--smoke)",fontFamily:"var(--font-lore)",fontStyle:"italic"}}>No entries match your search.</div>}
            </div>
          </div>
        </div>
      </div>
      {selected && <LoreModal entry={selected} onClose={()=>setSelected(null)} />}
    </div>
  );
}

function TimelinePage() {
  return (
    <div style={{paddingTop:"80px"}}>
      <div className="section">
        <div className="section-header">
          <span className="section-eyebrow">Eight Eras · Augustus Rex to the Compact of Kharvat</span>
          <h2 className="section-title">The Imperial Timeline</h2>
          <div className="section-rule"><span className="section-rule-icon">◈</span></div>
          <p className="section-desc">The shape of an empire across time — compiled from primary records at Bundchen Prime.</p>
        </div>
        <div className="timeline">
          {TIMELINE.map(era=>(
            <div className="timeline-era" key={era.id}>
              <div className="timeline-dot" />
              <div className="timeline-era-date">{era.date}</div>
              <div className="timeline-era-title">{era.title}</div>
              <div className="timeline-era-desc">{era.desc}</div>
              <div className="timeline-events">
                {era.events.map((ev,i)=>(
                  <div className="timeline-event" key={i}>
                    <div className="timeline-event-year">{ev.y}</div>
                    <div className="timeline-event-text">{ev.t}</div>
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

function IxoriaPage() {
  return (
    <div style={{paddingTop:"80px"}}>
      <div className="section">
        <div className="section-header">
          <span className="section-eyebrow">The Forge-Moon · The Kasparian Belt</span>
          <h2 className="section-title">Ixoria</h2>
          <div className="section-rule"><span className="section-rule-icon">◈</span></div>
          <p className="section-desc" style={{maxWidth:"720px"}}>Steel remembers the hand that shaped it. The hand does not wait to see where the steel goes.</p>
        </div>
        <div style={{fontFamily:"var(--font-body)",color:"var(--bone)",lineHeight:1.85,marginBottom:"3rem",maxWidth:"800px"}}>
          <p style={{marginBottom:"1.25rem"}}>The Sable Absolute's armor was built on Ixoria. So was every weapon it carried. The forge-moon in the Kasparian Belt had been producing the Black Death's equipment since the organization's founding — all of it forged in a place that smelled of burnt metal and machine oil and the particular welding ozone of operations that never paused for darkness because the dock-rings above Ixoria had no night cycle to pause for.</p>
          <p style={{marginBottom:"1.25rem"}}>Jaza launched seven battle fleets from Ixorian dock-rings within thirty-six hours during the final mobilization of the Merchant War. Workers watched through refinery smoke as the dock-rings emptied. They went back to their stations without ceremony when it was over. This is what Ixoria does.</p>
          <p style={{fontFamily:"var(--font-lore)",fontStyle:"italic",color:"var(--mist)",borderLeft:"2px solid var(--gold-dim)",paddingLeft:"1.25rem"}}>The empire tolerated their power because no alternative existed. Ixoria did not merely produce ships. Ixoria maintained civilization-scale military continuity.</p>
        </div>
        <div style={{fontFamily:"var(--font-title)",fontSize:"0.58rem",letterSpacing:"0.35em",textTransform:"uppercase",color:"var(--rust-bright)",marginBottom:"1.5rem"}}>The Nine Houses of the Forge</div>
        <div className="nine-houses-grid">
          {NINE_HOUSES.map(h=>(
            <div className="house-card" key={h.name}>
              <div className="house-name">{h.name}</div>
              <div className="house-specialty">{h.specialty}</div>
              <div className="house-motto">{h.motto}</div>
              <div className="house-desc">{h.desc}</div>
            </div>
          ))}
        </div>
        <div style={{marginTop:"3rem",padding:"1.75rem",background:"var(--forge)",border:"1px solid rgba(201,168,76,0.12)"}}>
          <div style={{fontFamily:"var(--font-title)",fontSize:"0.58rem",letterSpacing:"0.3em",textTransform:"uppercase",color:"var(--rust-bright)",marginBottom:"0.7rem"}}>Hard Canon · The Cooling Riots</div>
          <p style={{fontFamily:"var(--font-body)",color:"var(--bone)",lineHeight:1.8,marginBottom:"0.9rem"}}>House Varekh redirected coolant resources toward military production during a frontier emergency. Habitation temperatures in the Lower Furnace Districts exceeded survivable thresholds. Estimated dead: 2.4 million. Eleven days. Director Havel Tor Varekh was responsible. His name remains a curse in lower habitation sectors. Workers still spit after saying it aloud.</p>
        </div>
      </div>
    </div>
  );
}

function CoversPage() {
  const covers = [
    { src: IMG.generalisima3, cap: "La Generalísima — Cover Art III" },
    { src: IMG.generalisima1, cap: "La Generalísima — Cover Art I" },
    { src: IMG.generalisima2, cap: "La Generalísima: Appendices & Notes" },
    { src: IMG.fiveSwords1, cap: "Five Swords, One Throne" },
    { src: IMG.fiveSwords2, cap: "Five Swords, One Throne — Full Wrap" },
    { src: IMG.emperors20, cap: "20 God Emperors Portrait Gallery" },
    { src: IMG.characters14, cap: "14 Major Characters" },
    { src: IMG.characters14wide, cap: "14 Characters — Wide Format" },
    { src: IMG.leraq, cap: "Leraq of Vath" },
  ];
  return (
    <div style={{paddingTop:"80px"}}>
      <div className="section">
        <div className="section-header">
          <span className="section-eyebrow">Official Cover Art & Character Portraits</span>
          <h2 className="section-title">The Art Archive</h2>
          <div className="section-rule"><span className="section-rule-icon">◈</span></div>
          <p className="section-desc">Cover art, full wraps, and character portrait galleries from across the Iseldoran Sagas and Code of Martyrs.</p>
        </div>
        <div className="cover-gallery">
          {covers.map((c,i) => (
            <div className="cover-item" key={i}>
              <img src={c.src} alt={c.cap} />
              <div className="cover-caption">{c.cap}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function AboutPage() {
  return (
    <div style={{paddingTop:"80px"}}>
      <div className="section" style={{maxWidth:"820px"}}>
        <div className="section-header">
          <span className="section-eyebrow">The Archive · Bundchen Prime</span>
          <h2 className="section-title">About the Sagas</h2>
          <div className="section-rule"><span className="section-rule-icon">◈</span></div>
        </div>
        <div style={{fontFamily:"var(--font-body)",color:"var(--bone)",lineHeight:1.9,fontSize:"1.05rem"}}>
          <p style={{marginBottom:"1.5rem"}}>The Iseldoran Sagas is a thirty-volume, 1,747,478-word science fantasy universe spanning eight imperial eras — from the age of Augustus Rex Beyond the Rim to the Compact of Kharvat, four centuries hence. The universe also includes La Generalísima, the sealed archive of Selene Jaza, and the Code of Martyrs saga — four volumes set in the Dragon Throne of Maldorus universe.</p>
          <p style={{marginBottom:"1.5rem"}}>All volumes are compiled by Prince Kairoh Pierre von Care, Master Archivist of the Imperial Archive at Bundchen Prime — himself a figure within the history he records. He gave Augustus Lucius Jaza his first order. He commissioned the legal opinion that ended Asha Kers I's reign. He held Aurelia's Wrath for twenty years. He sealed the archive in Year Twenty-Five of the Generalísima. The archive is addressed to his son Livian.</p>
          <div style={{fontFamily:"var(--font-lore)",fontStyle:"italic",color:"var(--mist)",borderLeft:"2px solid var(--gold-dim)",paddingLeft:"1.25rem",margin:"2rem 0",lineHeight:1.75}}>
            "The Emperor builds the empire. The Generalísima defends its existence. The Archivist ensures its memory."
            <span style={{fontFamily:"var(--font-title)",fontSize:"0.65rem",letterSpacing:"0.15em",color:"var(--gold-dim)",display:"block",marginTop:"0.65rem"}}>— Kairoh Pierre von Care</span>
          </div>
          <div style={{fontFamily:"var(--font-lore)",fontStyle:"italic",color:"var(--mist)",borderLeft:"2px solid var(--gold-dim)",paddingLeft:"1.25rem",margin:"2rem 0",lineHeight:1.75}}>
            "Loyalty is reality. Reality is law. Law is eternal."
            <span style={{fontFamily:"var(--font-title)",fontSize:"0.65rem",letterSpacing:"0.15em",color:"var(--gold-dim)",display:"block",marginTop:"0.65rem"}}>— La Generalísima motto</span>
          </div>
          <div style={{display:"flex",gap:"1rem",flexWrap:"wrap"}}>
            <button className="btn-primary" onClick={()=>alert("Add your author page / contact link here")}>Author Contact</button>
            <button className="btn-secondary" onClick={()=>alert("Add your newsletter or social link here")}>Newsletter</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Footer({ go }) {
  const pages = ["home","novels","characters","bestiary","compendium","sovereigns","timeline","ixoria","covers","about"];
  return (
    <footer className="footer">
      <div className="footer-brand">The Iseldoran Sagas</div>
      <div className="footer-tagline">"Loyalty is reality. Reality is law. Law is eternal."</div>
      <ul className="footer-links">{pages.map(p=><li key={p}><a onClick={()=>go(p)}>{p}</a></li>)}</ul>
      <div className="footer-copy">© {new Date().getFullYear()} Prince Kairoh Pierre von Care · The Iseldoran Press · All rights reserved · Bundchen Prime</div>
    </footer>
  );
}

function SovereignsPage() {
  const [search, setSearch] = useState("");
  const [activeEra, setActiveEra] = useState("all");
  const eras = ["all", ...SOVEREIGNS.map(e => e.era)];
  const filtered = SOVEREIGNS.filter(e => activeEra === "all" || e.era === activeEra).map(eraGroup => ({
    ...eraGroup,
    rulers: eraGroup.rulers.filter(r =>
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.epithet.toLowerCase().includes(search.toLowerCase()) ||
      r.note.toLowerCase().includes(search.toLowerCase())
    )
  })).filter(e => activeEra !== "all" || e.rulers.length > 0);

  const totalSovereigns = SOVEREIGNS.reduce((acc, e) => acc + e.rulers.filter(r => !r.epithet.includes("Not counted") && !r.epithet.includes("Interregnum")).length, 0);

  return (
    <div style={{paddingTop:"80px"}}>
      <div className="section">
        <div className="section-header">
          <span className="section-eyebrow">The Authoritative Chronological Record</span>
          <h2 className="section-title">Dragon Throne Sovereigns</h2>
          <div className="section-rule"><span className="section-rule-icon">◈</span></div>
          <p className="section-desc">From Eustace I to Mettenik I — the complete line of God-Emperors of the Trinitarian Empire.</p>
        </div>

        <div style={{display:"flex",gap:"1rem",marginBottom:"2rem",flexWrap:"wrap",alignItems:"center"}}>
          <input
            className="global-search"
            placeholder="Search sovereigns by name or epithet…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{maxWidth:"320px"}}
          />
          <div style={{fontFamily:"var(--font-title)",fontSize:"0.58rem",letterSpacing:"0.2em",color:"var(--smoke)",textTransform:"uppercase"}}>
            {totalSovereigns} sovereigns across {SOVEREIGNS.length} eras
          </div>
        </div>

        <div style={{display:"flex",gap:"0.4rem",flexWrap:"wrap",marginBottom:"2.5rem"}}>
          <button className={`filter-btn ${activeEra==="all"?"active":""}`} onClick={()=>setActiveEra("all")}>All Eras</button>
          {SOVEREIGNS.map(e => (
            <button key={e.era} className={`filter-btn ${activeEra===e.era?"active":""}`} onClick={()=>setActiveEra(e.era)} style={{fontSize:"0.5rem"}}>
              {e.era}
            </button>
          ))}
        </div>

        <div style={{display:"flex",flexDirection:"column",gap:"2.5rem"}}>
          {filtered.map((eraGroup, gi) => eraGroup.rulers.length > 0 && (
            <div key={gi}>
              <div style={{
                display:"flex",alignItems:"center",gap:"1rem",marginBottom:"1.1rem",
                paddingBottom:"0.6rem",borderBottom:`1px solid ${eraGroup.color}44`
              }}>
                <div style={{width:"3px",height:"1.4rem",background:eraGroup.color,flexShrink:0}} />
                <div style={{fontFamily:"var(--font-display)",fontSize:"0.85rem",color:eraGroup.color}}>
                  {eraGroup.era}
                </div>
                <div style={{fontFamily:"var(--font-title)",fontSize:"0.5rem",letterSpacing:"0.18em",color:"var(--smoke)",textTransform:"uppercase",marginLeft:"auto"}}>
                  {eraGroup.rulers.filter(r=>!r.epithet.includes("Not counted")&&!r.epithet.includes("Interregnum")).length} sovereign{eraGroup.rulers.filter(r=>!r.epithet.includes("Not counted")&&!r.epithet.includes("Interregnum")).length!==1?"s":""}
                </div>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:"0.75rem"}}>
                {eraGroup.rulers.map((r, ri) => (
                  <div key={ri} style={{
                    background: r.epithet === "Not counted" ? "rgba(92,21,21,0.15)" : "var(--forge)",
                    border: `1px solid ${r.epithet === "Not counted" ? "rgba(92,21,21,0.3)" : "rgba(201,168,76,0.1)"}`,
                    padding:"0.9rem 1rem",
                    transition:"all var(--transition)",
                  }}
                  onMouseEnter={e=>e.currentTarget.style.borderColor="rgba(201,168,76,0.3)"}
                  onMouseLeave={e=>e.currentTarget.style.borderColor=r.epithet==="Not counted"?"rgba(92,21,21,0.3)":"rgba(201,168,76,0.1)"}
                  >
                    <div style={{
                      fontFamily:"var(--font-title)",fontSize:"0.78rem",
                      color: r.epithet === "Not counted" ? "var(--rust-bright)" : "var(--parchment)",
                      marginBottom:"0.2rem",lineHeight:1.35
                    }}>{r.name}</div>
                    <div style={{
                      fontFamily:"var(--font-lore)",fontStyle:"italic",fontSize:"0.75rem",
                      color:eraGroup.color,marginBottom: r.note ? "0.45rem" : 0
                    }}>{r.epithet}</div>
                    {r.note && <div style={{fontFamily:"var(--font-body)",fontSize:"0.8rem",color:"var(--smoke)",lineHeight:1.55}}>{r.note}</div>}
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

function BeastCard({ b, i }) {
  const [imgOk, setImgOk] = useState(true);
  const num = String(i + 1).padStart(3, "0");
  return (
    <div className="beast-card">
      <div className="beast-plate">
        <span className="beast-num">No. {String(i + 1).padStart(2, "0")}</span>
        {imgOk ? (
          <img src={`assets/bestiary/${num}.png`} alt={`${b.n} specimen plate`} onError={() => setImgOk(false)} />
        ) : (
          <div className="beast-plate-ph">
            <span className="glyph">◈</span>
            <span className="ph-name">{b.n}</span>
            <span className="ph-note">Plate Pending</span>
          </div>
        )}
      </div>
      <div className="beast-info">
        <div className="beast-name">{b.n}</div>
        <div className="beast-class">{b.cls}</div>
        <div className="beast-meta">
          <div className="beast-row"><span className="k">Homeworld</span><span className="v">{b.home}</span></div>
          <div className="beast-row"><span className="k">{b.label || "Average Height"}</span><span className="v">{b.metric}</span></div>
        </div>
        <div className="beast-notes">{b.notes}</div>
      </div>
    </div>
  );
}

function BestiaryPage() {
  return (
    <div style={{paddingTop:"80px"}}>
      <div className="section">
        <div className="section-header">
          <span className="section-eyebrow">Imperial Academy · Xenobiological Archives</span>
          <h2 className="section-title">The Great Bestiary of the Rim</h2>
          <div className="section-rule"><span className="section-rule-icon">◈</span></div>
          <p className="section-desc">Catalogued specimens of the sentient and engineered species of the Iseldoran Rim — classification, homeworld, scale, and physical record.</p>
        </div>
        <div className="bestiary-grid">
          {BESTIARY.map((b, i) => <BeastCard b={b} i={i} key={i} />)}
        </div>
      </div>
    </div>
  );
}

function App() {
  const [page, setPage] = useState("home");
  const go = p => { setPage(p); window.scrollTo({top:0,behavior:"smooth"}); };
  return (
    <>
      <StyleInjector />
      <Nav page={page} go={go} />
      {page==="home" && <HomePage go={go} />}
      {page==="novels" && <NovelsPage />}
      {page==="characters" && <CharactersPage />}
      {page==="bestiary" && <BestiaryPage />}
      {page==="compendium" && <CompendiumPage />}
      {page==="sovereigns" && <SovereignsPage />}
      {page==="timeline" && <TimelinePage />}
      {page==="ixoria" && <IxoriaPage />}
      {page==="covers" && <CoversPage />}
      {page==="about" && <AboutPage />}
      <Footer go={go} />
    </>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
