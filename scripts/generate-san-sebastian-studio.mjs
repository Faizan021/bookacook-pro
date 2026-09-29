import fs from 'fs/promises';
import path from 'path';

async function generate() {
  // Photos for preview
  const p1 = (await fs.readFile('public/magazin/san-sebastian-berlin/san-sebastian-hd-03-showcase-varieties.jpg')).toString('base64');
  const p2 = (await fs.readFile('public/magazin/san-sebastian-berlin/san-sebastian-hd-02-pistachio-gold.jpg')).toString('base64');
  const p3 = (await fs.readFile('public/magazin/san-sebastian-berlin/san-sebastian-hd-01-choc-waterfall.jpg')).toString('base64');
  const p4 = (await fs.readFile('public/magazin/san-sebastian-berlin/san-sebastian-hd-06-moss-wall-neon.jpg')).toString('base64');

  // Pre-rendered HD PNG slides (1080×1350)
  const s1 = (await fs.readFile('public/instagram/san-sebastian-berlin/slide-1.png')).toString('base64');
  const s2 = (await fs.readFile('public/instagram/san-sebastian-berlin/slide-2.png')).toString('base64');
  const s3 = (await fs.readFile('public/instagram/san-sebastian-berlin/slide-3.png')).toString('base64');
  const s4 = (await fs.readFile('public/instagram/san-sebastian-berlin/slide-4.png')).toString('base64');
  const s5 = (await fs.readFile('public/instagram/san-sebastian-berlin/slide-5.png')).toString('base64');

  const html = `<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Speisely Carousel Studio — San Sebastian The Original® Berlin</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,700;0,9..144,800;0,9..144,900;1,9..144,700&family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
  <style>
    :root {
      --forest:      #173C32;
      --forest-dark: #0f2720;
      --forest-deep: #0a1f1a;
      --gold:        #E6B84A;
      --gold-light:  #f7ca5e;
      --clay:        #A85C36;
      --sand:        #FAF7F0;
      --white:       #FFFFFF;
    }

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      font-family: 'Inter', sans-serif;
      background: #0d2218;
      color: var(--sand);
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      -webkit-font-smoothing: antialiased;
    }

    header {
      background: rgba(15, 39, 32, 0.97);
      border-bottom: 1px solid rgba(230,184,74,0.2);
      padding: 0 28px;
      height: 64px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      backdrop-filter: blur(16px);
      position: sticky;
      top: 0;
      z-index: 50;
    }
    .brand { display: flex; align-items: center; gap: 14px; }
    .brand-badge {
      background: var(--clay);
      color: #fff;
      font-size: 10px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 1.5px;
      padding: 4px 12px;
      border-radius: 999px;
    }
    .brand-name {
      font-family: 'Fraunces', serif;
      font-size: 19px;
      font-weight: 800;
      color: var(--sand);
    }
    .brand-name span { color: var(--gold); }

    .hdr-actions { display: flex; gap: 10px; }
    .btn {
      display: inline-flex;
      align-items: center;
      gap: 7px;
      font-family: 'Inter', sans-serif;
      font-size: 13px;
      font-weight: 700;
      padding: 9px 18px;
      border-radius: 999px;
      border: none;
      cursor: pointer;
      transition: all 0.18s ease;
      white-space: nowrap;
    }
    .btn-gold  { background: var(--gold); color: var(--forest); }
    .btn-gold:hover { background: var(--gold-light); transform: translateY(-1px); box-shadow: 0 6px 20px rgba(230,184,74,0.35); }
    .btn-outline { background: transparent; color: var(--sand); border: 1.5px solid rgba(255,255,255,0.22); }
    .btn-outline:hover { background: rgba(255,255,255,0.1); }

    .app-grid {
      display: grid;
      grid-template-columns: 320px 1fr 360px;
      flex: 1;
      height: calc(100vh - 64px);
      overflow: hidden;
    }

    .sidebar {
      background: var(--forest);
      border-right: 1px solid rgba(255,255,255,0.07);
      padding: 28px 20px;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      gap: 28px;
    }
    .label {
      font-size: 10px;
      font-weight: 800;
      letter-spacing: 2px;
      text-transform: uppercase;
      color: var(--gold);
      margin-bottom: 10px;
    }
    .slide-list { display: flex; flex-direction: column; gap: 8px; }
    .slide-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 13px 14px;
      border-radius: 14px;
      border: 2px solid transparent;
      cursor: pointer;
      transition: all 0.18s;
      background: rgba(255,255,255,0.04);
    }
    .slide-item:hover { background: rgba(255,255,255,0.09); }
    .slide-item.active {
      border-color: var(--gold);
      background: rgba(230,184,74,0.1);
    }
    .slide-num {
      width: 30px;
      height: 30px;
      border-radius: 50%;
      background: rgba(255,255,255,0.12);
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 900;
      font-size: 12px;
      flex-shrink: 0;
      transition: all 0.18s;
    }
    .slide-item.active .slide-num { background: var(--gold); color: var(--forest); }
    .slide-label strong { font-size: 13px; font-weight: 700; display: block; color: var(--sand); }
    .slide-label span { font-size: 11px; color: rgba(255,255,255,0.55); }

    .info-card {
      background: rgba(0,0,0,0.2);
      border: 1px solid rgba(255,255,255,0.08);
      border-radius: 14px;
      padding: 16px;
      font-size: 12px;
      line-height: 1.6;
      color: rgba(255,255,255,0.65);
    }
    .info-card .info-title { font-weight: 700; color: var(--gold); margin-bottom: 6px; font-size: 11px; text-transform: uppercase; letter-spacing: 1.5px; }

    .stage {
      background: #0a1810;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 32px 24px;
      overflow-y: auto;
      gap: 20px;
    }

    .ratio-bar {
      display: flex;
      gap: 6px;
      background: rgba(255,255,255,0.07);
      border-radius: 999px;
      padding: 4px;
    }
    .ratio-btn {
      font-size: 11.5px;
      font-weight: 700;
      padding: 6px 14px;
      border-radius: 999px;
      border: none;
      background: transparent;
      color: rgba(255,255,255,0.6);
      cursor: pointer;
      transition: all 0.18s;
    }
    .ratio-btn.on { background: var(--gold); color: var(--forest); }

    .canvas-shell {
      border-radius: 20px;
      overflow: hidden;
      box-shadow: 0 30px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.05);
      transition: all 0.3s ease;
    }
    .slide-canvas {
      width: 432px;
      height: 540px;
      position: relative;
      overflow: hidden;
      user-select: none;
      display: flex;
      flex-direction: column;
    }
    .slide-canvas.sq { width: 460px; height: 460px; }
    .slide-canvas.st { width: 350px; height: 622px; }

    .cover-wrap {
      position: relative;
      width: 100%;
      height: 100%;
      overflow: hidden;
    }
    .cover-photo {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: center;
    }
    .cover-grad {
      position: absolute;
      inset: 0;
      background: linear-gradient(180deg,
        rgba(10,31,26,0.5) 0%,
        rgba(10,31,26,0.0) 20%,
        rgba(10,31,26,0.0) 45%,
        rgba(10,31,26,0.65) 65%,
        rgba(10,31,26,0.90) 80%,
        rgba(10,31,26,0.97) 100%);
    }
    .cover-top-grad {
      position: absolute;
      inset: 0;
      background: linear-gradient(180deg, rgba(10,31,26,0.48) 0%, transparent 18%);
    }
    .slide-topbar {
      position: absolute;
      top: 14px;
      left: 14px;
      right: 14px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      z-index: 10;
    }
    .pill-magazine {
      background: var(--forest);
      color: var(--sand);
      font-size: 9px;
      font-weight: 900;
      letter-spacing: 2px;
      text-transform: uppercase;
      padding: 6px 13px;
      border-radius: 999px;
    }
    .pill-counter {
      background: rgba(10,31,26,0.72);
      color: var(--sand);
      font-size: 11px;
      font-weight: 800;
      padding: 5px 11px;
      border-radius: 999px;
      border: 1px solid rgba(250,247,240,0.22);
    }
    .cover-bottom {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      padding: 0 22px 18px;
      z-index: 5;
    }
    .pill-story {
      display: inline-block;
      background: var(--gold);
      color: var(--forest);
      font-size: 9px;
      font-weight: 900;
      text-transform: uppercase;
      letter-spacing: 2px;
      padding: 6px 14px;
      border-radius: 999px;
      margin-bottom: 11px;
    }
    .cover-title {
      font-family: 'Fraunces', serif;
      font-size: 22px;
      font-weight: 900;
      line-height: 1.15;
      color: #FFFFFF;
      margin-bottom: 7px;
    }
    .cover-sub {
      font-size: 12px;
      color: rgba(250,247,240,0.82);
      line-height: 1.4;
      margin-bottom: 13px;
    }
    .dots { display: flex; gap: 5px; }
    .dot { width: 6px; height: 6px; border-radius: 50%; background: rgba(255,255,255,0.35); }
    .dot.on { width: 17px; border-radius: 999px; background: var(--gold); }

    .split-wrap {
      display: flex;
      flex-direction: column;
      height: 100%;
      background: var(--white);
    }
    .split-photo-box {
      position: relative;
      flex: 1;
      overflow: hidden;
    }
    .split-photo-box img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .split-photo-topbar {
      position: absolute;
      top: 14px;
      left: 14px;
      right: 14px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      z-index: 5;
    }
    .pill-community {
      background: var(--forest);
      color: var(--sand);
      font-size: 9px;
      font-weight: 900;
      letter-spacing: 2px;
      text-transform: uppercase;
      padding: 6px 13px;
      border-radius: 999px;
    }
    .split-photo-top-grad {
      position: absolute;
      top: 0; left: 0; right: 0;
      height: 110px;
      background: linear-gradient(180deg, rgba(10,31,26,0.52) 0%, transparent 100%);
    }
    .split-card {
      padding: 18px 20px 16px;
      background: #FFFFFF;
      border-top: 2px solid rgba(23,60,50,0.08);
      position: relative;
    }
    .split-card::before {
      content: '';
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      width: 4px;
      background: var(--gold);
      border-radius: 0 2px 2px 0;
    }
    .split-kicker {
      font-size: 10px;
      font-weight: 900;
      text-transform: uppercase;
      letter-spacing: 2.5px;
      color: var(--clay);
      margin-bottom: 5px;
    }
    .split-heading {
      font-family: 'Fraunces', serif;
      font-size: 20px;
      font-weight: 800;
      color: var(--forest);
      line-height: 1.2;
      margin-bottom: 7px;
    }
    .split-body {
      font-size: 12px;
      color: rgba(23,60,50,0.78);
      line-height: 1.5;
    }

    .outro-wrap {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-between;
      height: 100%;
      background: radial-gradient(ellipse at 50% 40%, #1e5242 0%, #173C32 55%, #0f2720 100%);
      padding: 22px 20px;
      text-align: center;
    }
    .outro-icon { margin-bottom: 6px; }
    .outro-brand { font-family: 'Fraunces', serif; font-size: 30px; font-weight: 900; color: var(--gold); }
    .outro-venue { font-size: 10px; font-weight: 900; letter-spacing: 3px; text-transform: uppercase; color: var(--gold); margin-top: 2px; }
    .outro-divider { width: 60px; height: 2.5px; background: var(--gold); border-radius: 999px; margin: 10px auto; }
    .outro-headline { font-family: 'Fraunces', serif; font-size: 23px; font-weight: 900; color: #fff; line-height: 1.2; margin-bottom: 8px; }
    .outro-subline { font-size: 11.5px; color: rgba(250,247,240,0.65); line-height: 1.4; }
    .outro-actions {
      width: 100%;
      border: 1.5px solid rgba(230,184,74,0.4);
      border-radius: 999px;
      padding: 10px 16px;
      display: flex;
      justify-content: space-around;
      font-size: 11.5px;
      font-weight: 700;
      color: var(--sand);
      margin-bottom: 12px;
    }
    .outro-cta {
      border: 2.5px solid var(--gold);
      color: var(--gold);
      font-size: 13px;
      font-weight: 900;
      letter-spacing: 1px;
      padding: 10px 28px;
      border-radius: 999px;
    }

    .right-panel {
      background: var(--forest);
      border-left: 1px solid rgba(255,255,255,0.07);
      padding: 28px 20px;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      gap: 22px;
    }
    .ig-mock {
      display: flex;
      align-items: center;
      gap: 11px;
    }
    .ig-avatar {
      width: 44px;
      height: 44px;
      border-radius: 50%;
      background: var(--forest-dark);
      border: 2.5px solid var(--gold);
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: 'Fraunces', serif;
      font-size: 15px;
      font-weight: 900;
      color: var(--gold);
      flex-shrink: 0;
    }
    .ig-info .ig-name { font-size: 14px; font-weight: 800; color: var(--sand); }
    .ig-info .ig-loc { font-size: 11px; color: rgba(255,255,255,0.55); margin-top: 1px; }

    .caption-area {
      background: rgba(0,0,0,0.22);
      border: 1px solid rgba(255,255,255,0.1);
      border-radius: 14px;
      padding: 16px;
      font-size: 12.5px;
      line-height: 1.6;
      color: var(--sand);
      white-space: pre-wrap;
      flex: 1;
    }

    .download-section { display: flex; flex-direction: column; gap: 8px; }
    .download-label { font-size: 10px; font-weight: 800; letter-spacing: 2px; text-transform: uppercase; color: var(--gold); }
    .download-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
    .dl-btn {
      display: flex;
      align-items: center;
      gap: 7px;
      padding: 10px 12px;
      border-radius: 12px;
      background: rgba(255,255,255,0.06);
      border: 1px solid rgba(255,255,255,0.1);
      cursor: pointer;
      transition: all 0.18s;
      font-size: 12px;
      font-weight: 700;
      color: var(--sand);
    }
    .dl-btn:hover { background: rgba(255,255,255,0.13); border-color: rgba(230,184,74,0.4); color: var(--gold); }
    .dl-btn.full { grid-column: 1/-1; justify-content: center; background: rgba(230,184,74,0.12); border-color: rgba(230,184,74,0.35); }
    .dl-btn.full:hover { background: var(--gold); color: var(--forest); }

    .toast {
      position: fixed;
      bottom: 28px;
      right: 28px;
      background: var(--gold);
      color: var(--forest);
      font-weight: 800;
      font-size: 13px;
      padding: 12px 24px;
      border-radius: 999px;
      box-shadow: 0 10px 35px rgba(0,0,0,0.5);
      opacity: 0;
      transform: translateY(16px);
      transition: all 0.28s ease;
      z-index: 200;
      pointer-events: none;
    }
    .toast.show { opacity: 1; transform: translateY(0); }

    ::-webkit-scrollbar { width: 6px; }
    ::-webkit-scrollbar-track { background: transparent; }
    ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.15); border-radius: 99px; }
  </style>
</head>
<body>

<header>
  <div class="brand">
    <span class="brand-badge">Instagram Studio</span>
    <span class="brand-name">Speisely <span>×</span> San Sebastian Berlin</span>
  </div>
  <div class="hdr-actions">
    <button class="btn btn-outline" onclick="copyCaption()">📋 Caption kopieren</button>
    <button class="btn btn-gold" onclick="downloadCurrent()">⬇ HD Slide laden</button>
    <button class="btn btn-outline" onclick="downloadAll()">📦 Alle 5 Slides</button>
  </div>
</header>

<div class="app-grid">
  <!-- ═══ LEFT SIDEBAR ═══ -->
  <aside class="sidebar">
    <div>
      <div class="label">Carousel Slides</div>
      <div class="slide-list">
        <div class="slide-item active" onclick="gotoSlide(1)" id="tab-1">
          <div class="slide-num">1</div>
          <div class="slide-label">
            <strong>Cover · Die Vielfalt</strong>
            <span>12 Sorten. Ein Mythos.</span>
          </div>
        </div>
        <div class="slide-item" onclick="gotoSlide(2)" id="tab-2">
          <div class="slide-num">2</div>
          <div class="slide-label">
            <strong>01 · Das baskische Original</strong>
            <span>San Sebastián 1990 &amp; La Viña</span>
          </div>
        </div>
        <div class="slide-item" onclick="gotoSlide(3)" id="tab-3">
          <div class="slide-num">3</div>
          <div class="slide-label">
            <strong>02 · Der Signature Pour</strong>
            <span>Heiße Schokolade on Top</span>
          </div>
        </div>
        <div class="slide-item" onclick="gotoSlide(4)" id="tab-4">
          <div class="slide-num">4</div>
          <div class="slide-label">
            <strong>03 · Die Atmosphäre</strong>
            <span>Mooswand &amp; Neon-Vibes</span>
          </div>
        </div>
        <div class="slide-item" onclick="gotoSlide(5)" id="tab-5">
          <div class="slide-num">5</div>
          <div class="slide-label">
            <strong>Outro · CTA</strong>
            <span>Lies die ganze Story</span>
          </div>
        </div>
      </div>
    </div>

    <div class="info-card">
      <div class="info-title">📐 Speisely Design System</div>
      Farbschema: Forest Green #173C32 · Gold #E6B84A · Clay #A85C36 · Sand #FAF7F0. 100% authentische Community-Fotos. Downloads als 1080×1350 px PNG in voller HD-Auflösung.
    </div>
  </aside>

  <!-- ═══ CENTER STAGE ═══ -->
  <main class="stage">
    <div class="ratio-bar">
      <button class="ratio-btn on" onclick="setRatio('45', this)">4:5 Post</button>
      <button class="ratio-btn" onclick="setRatio('11', this)">1:1 Square</button>
      <button class="ratio-btn" onclick="setRatio('916', this)">9:16 Story</button>
    </div>

    <div class="canvas-shell">

      <!-- ── SLIDE 1: COVER ── -->
      <div class="slide-canvas" id="s1" style="display:flex">
        <div class="cover-wrap">
          <img class="cover-photo" src="data:image/jpeg;base64,${p1}" alt="San Sebastian Showcase Varieties">
          <div class="cover-top-grad"></div>
          <div class="cover-grad"></div>
          <div class="slide-topbar">
            <div class="pill-magazine">Speisely Magazin</div>
            <div class="pill-counter">1 / 5</div>
          </div>
          <div class="cover-bottom">
            <div class="pill-story">✨ Speisely Community Story</div>
            <h1 class="cover-title">12 Sorten. Ein Mythos.<br>Der Hype um Berlins cremigsten Cheesecake.</h1>
            <p class="cover-sub">Warum jeder Bissen süchtig macht — und wo das Original wartet.</p>
            <div class="dots">
              <div class="dot on"></div>
              <div class="dot"></div>
              <div class="dot"></div>
              <div class="dot"></div>
              <div class="dot"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- ── SLIDE 2 ── -->
      <div class="slide-canvas" id="s2" style="display:none">
        <div class="split-wrap">
          <div class="split-photo-box">
            <img src="data:image/jpeg;base64,${p2}" alt="Pistachio on gold plate">
            <div class="split-photo-top-grad"></div>
            <div class="split-photo-topbar">
              <div class="pill-community">Speisely Community</div>
              <div class="pill-counter">2 / 5</div>
            </div>
          </div>
          <div class="split-card">
            <div class="split-kicker">01 · Das baskische Original</div>
            <h2 class="split-heading">1990 in San Sebastián erfunden</h2>
            <p class="split-body">Kein Keksboden. Höllenhitze. Cremiger Kern. Das Original-Rezept aus der legendären Bar La Viña.</p>
          </div>
        </div>
      </div>

      <!-- ── SLIDE 3 ── -->
      <div class="slide-canvas" id="s3" style="display:none">
        <div class="split-wrap">
          <div class="split-photo-box">
            <img src="data:image/jpeg;base64,${p3}" alt="Warm chocolate pour">
            <div class="split-photo-top-grad"></div>
            <div class="split-photo-topbar">
              <div class="pill-community">Speisely Community</div>
              <div class="pill-counter">3 / 5</div>
            </div>
          </div>
          <div class="split-card">
            <div class="split-kicker">02 · Der Signature Pour</div>
            <h2 class="split-heading">Flüssige Schokolade on Top</h2>
            <p class="split-body">Belgische Vollmilch, Zartbitter oder Pistazie — frisch und warm vor deinen Augen übergossen.</p>
          </div>
        </div>
      </div>

      <!-- ── SLIDE 4 ── -->
      <div class="slide-canvas" id="s4" style="display:none">
        <div class="split-wrap">
          <div class="split-photo-box">
            <img src="data:image/jpeg;base64,${p4}" alt="Moss wall and neon atmosphere">
            <div class="split-photo-top-grad"></div>
            <div class="split-photo-topbar">
              <div class="pill-community">Speisely Community</div>
              <div class="pill-counter">4 / 5</div>
            </div>
          </div>
          <div class="split-card">
            <div class="split-kicker">03 · Die Atmosphäre</div>
            <h2 class="split-heading">Grüne Mooswand &amp; Neon-Vibes</h2>
            <p class="split-body">Ob Ku'damm oder Gropius Passagen: Purer Genuss im stylischen Boutique-Café.</p>
          </div>
        </div>
      </div>

      <!-- ── SLIDE 5: OUTRO ── -->
      <div class="slide-canvas" id="s5" style="display:none">
        <div class="outro-wrap">
          <div class="slide-topbar" style="position:relative; top:auto; left:auto; right:auto; padding:0; margin-bottom:6px; width:100%;">
            <div class="pill-magazine">Speisely Magazin</div>
            <div class="pill-counter" style="background:rgba(255,255,255,0.1); border-color:rgba(255,255,255,0.3);">5 / 5</div>
          </div>

          <div class="outro-icon">
            <svg width="44" height="44" viewBox="0 0 60 60" fill="none">
              <path d="M12 8C12 17 20 22 24 26L6 44C4 46 4 49 6 51C8 53 11 53 13 51L31 31C27 27 22 19 12 8Z" fill="#E6B84A"/>
              <path d="M48 8C48 17 40 22 36 26L54 44C56 46 56 49 54 51C52 53 49 53 47 51L29 31C33 27 38 19 48 8Z" fill="#E6B84A"/>
              <circle cx="30" cy="26" r="3.5" fill="#E6B84A"/>
            </svg>
          </div>
          <div class="outro-brand">Speisely</div>
          <div class="outro-venue">San Sebastian The Original® Berlin</div>
          <div class="outro-divider"></div>

          <div>
            <h2 class="outro-headline">Lust auf das Original<br>in Berlin bekommen?</h2>
            <p class="outro-subline">Uhlandstraße 167 (Ku'damm) &amp; Gropius Passagen</p>
          </div>

          <div style="width:100%">
            <div class="outro-actions">
              <span>🔖 Speichern</span>
              <span style="width:1px;background:rgba(255,255,255,0.2);align-self:stretch"></span>
              <span>🔗 Teilen</span>
              <span style="width:1px;background:rgba(255,255,255,0.2);align-self:stretch"></span>
              <span>❤️ Liken</span>
            </div>
            <div class="outro-cta">↗ speisely.de ↗</div>
          </div>
        </div>
      </div>

    </div>
  </main>

  <!-- ═══ RIGHT PANEL ═══ -->
  <aside class="right-panel">
    <div class="label">Instagram Vorschau</div>
    <div class="ig-mock">
      <div class="ig-avatar">S</div>
      <div class="ig-info">
        <div class="ig-name">speisely</div>
        <div class="ig-loc">📍 Berlin, Deutschland</div>
      </div>
    </div>

    <div class="caption-area" id="caption">🍰 12 Sorten. Ein weltberühmter Mythos.

Wusstest du, dass der originale San Sebastian Cheesecake 1990 in der baskischen Bar „La Viña“ in Nordspanien erfunden wurde? 🇪🇸

Das Geheimnis: Kein Keksboden, dafür bei extremer Höllenhitze gebacken. Außen entsteht eine dunkle, karamellisierte Kruste mit tiefen Röstaromen — innen bleibt der Kern fließend, cremig und löffelweich.

Ein Speisely Community Mitglied hat @sansebastian.de in Berlin besucht:
🍫 Heißer belgischer Schokofluss direkt am Tisch
💚 Pistazienstaub auf edlem Goldteller
🌿 Stylische Mooswand & Café-Vibes am Ku'damm

👉 Swipe nach links für die Highlights!

📍 Uhlandstraße 167, 10719 Berlin (Ku'damm) & Gropius Passagen
✦ Ganze Story & Historie jetzt auf speisely.de lesen

#speisely #speiselycommunity #sansebastiancheesecake #basqueburntcheesecake #berlinfood #berlinfoodguide #kudamm #cheesecakelovers #berlindessert #foodguideberlin #foodspotsberlin #gastroberlin</div>

    <div class="download-section">
      <div class="download-label">📥 1-Click HD Downloads (1080×1350 px)</div>
      <div class="download-grid">
        <div class="dl-btn" onclick="dl(1)">🖼 Slide 1 · Cover</div>
        <div class="dl-btn" onclick="dl(2)">🖼 Slide 2 · Original</div>
        <div class="dl-btn" onclick="dl(3)">🖼 Slide 3 · Schokofluss</div>
        <div class="dl-btn" onclick="dl(4)">🖼 Slide 4 · Mooswand</div>
        <div class="dl-btn" onclick="dl(5)">🖼 Slide 5 · Outro</div>
        <div class="dl-btn full" onclick="downloadAll()">🚀 Alle 5 Slides auf einmal laden</div>
      </div>
    </div>

    <button class="btn btn-outline" style="width:100%;justify-content:center;" onclick="copyCaption()">
      📋 Caption kopieren
    </button>
  </aside>
</div>

<div class="toast" id="toast"></div>

<script>
  const slides = { 1:'data:image/png;base64,${s1}', 2:'data:image/png;base64,${s2}', 3:'data:image/png;base64,${s3}', 4:'data:image/png;base64,${s4}', 5:'data:image/png;base64,${s5}' };
  let current = 1;

  function gotoSlide(n) {
    document.getElementById('s' + current).style.display = 'none';
    document.getElementById('tab-' + current).classList.remove('active');
    current = n;
    document.getElementById('s' + n).style.display = 'flex';
    document.getElementById('tab-' + n).classList.add('active');
  }

  function setRatio(r, btn) {
    document.querySelectorAll('.ratio-btn').forEach(b => b.classList.remove('on'));
    btn.classList.add('on');
    const canvases = document.querySelectorAll('.slide-canvas');
    canvases.forEach(c => {
      c.classList.remove('sq', 'st');
      if (r === '11') c.classList.add('sq');
      if (r === '916') c.classList.add('st');
    });
  }

  function toast(msg) {
    const t = document.getElementById('toast');
    t.textContent = msg;
    t.classList.add('show');
    setTimeout(() => t.classList.remove('show'), 2400);
  }

  function dl(n) {
    const a = document.createElement('a');
    a.download = 'speisely-san-sebastian-berlin-slide-' + n + '.png';
    a.href = slides[n];
    a.click();
    toast('Slide ' + n + ' wird heruntergeladen (1080×1350 HD)...');
  }

  function downloadCurrent() { dl(current); }

  function downloadAll() {
    [1,2,3,4,5].forEach((n, i) => {
      setTimeout(() => dl(n), i * 350);
    });
    toast('Alle 5 HD-Slides werden heruntergeladen!');
  }

  function copyCaption() {
    const text = document.getElementById('caption').innerText;
    navigator.clipboard.writeText(text).then(() => {
      toast('Caption in die Zwischenablage kopiert! 📋');
    });
  }
</script>

</body>
</html>`;

  const artifactPath = path.join(
    'C:/Users/ahmad/.gemini/antigravity/brain/b308feef-2d4d-4563-b7d6-d6991ec44c51',
    'san_sebastian_carousel_studio.html'
  );
  await fs.writeFile(artifactPath, html);
  console.log('✅ Generated artifact:', artifactPath);

  await fs.writeFile('public/san-sebastian-carousel.html', html);
  console.log('✅ Generated public file: public/san-sebastian-carousel.html');
}

generate().catch(console.error);
