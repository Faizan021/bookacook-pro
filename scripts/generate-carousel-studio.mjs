import fs from 'fs/promises';
import path from 'path';

async function generate() {
  const p1 = (await fs.readFile('public/magazin/chicken-krush-prag/chicken-krush-real-01.jpg')).toString('base64');
  const p2 = (await fs.readFile('public/magazin/chicken-krush-prag/chicken-krush-real-02.jpg')).toString('base64');
  const p3 = (await fs.readFile('public/magazin/chicken-krush-prag/chicken-krush-real-03.jpg')).toString('base64');
  const p4 = (await fs.readFile('public/magazin/chicken-krush-prag/chicken-krush-real-04.jpg')).toString('base64');
  const p5 = (await fs.readFile('public/magazin/chicken-krush-prag/chicken-krush-real-05.jpg')).toString('base64');

  const html = `<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Speisely Carousel Studio — Chicken Krush Prag</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,600;0,9..144,700;0,9..144,800;1,9..144,600&family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <script src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js"></script>
  <style>
    :root {
      --forest: #173C32;
      --forest-dark: #0f2720;
      --clay: #A85C36;
      --gold: #E6B84A;
      --sand: #FAF7F0;
      --card-bg: #FFFFFF;
    }

    * { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      font-family: 'Inter', sans-serif;
      background: #12241f;
      color: #F5EFEB;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
    }

    /* Top Bar */
    header {
      background: rgba(18, 36, 31, 0.95);
      border-bottom: 1px solid rgba(255,255,255,0.1);
      padding: 16px 28px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      backdrop-filter: blur(10px);
    }

    .brand {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .brand-tag {
      background: var(--clay);
      color: white;
      font-size: 11px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 1px;
      padding: 4px 10px;
      border-radius: 999px;
    }

    .brand-title {
      font-family: 'Fraunces', serif;
      font-size: 20px;
      font-weight: 700;
      color: #FAF7F0;
    }

    .actions-bar {
      display: flex;
      gap: 12px;
    }

    button.btn {
      font-family: 'Inter', sans-serif;
      font-size: 13px;
      font-weight: 700;
      padding: 10px 18px;
      border-radius: 999px;
      border: none;
      cursor: pointer;
      transition: all 0.2s ease;
      display: inline-flex;
      align-items: center;
      gap: 8px;
    }

    button.btn-primary {
      background: var(--gold);
      color: var(--forest);
    }
    button.btn-primary:hover {
      background: #f7ca5e;
      transform: translateY(-1px);
    }

    button.btn-secondary {
      background: rgba(255,255,255,0.12);
      color: #FAF7F0;
      border: 1px solid rgba(255,255,255,0.2);
    }
    button.btn-secondary:hover {
      background: rgba(255,255,255,0.2);
    }

    /* Main Container */
    .app-body {
      display: grid;
      grid-template-columns: 360px 1fr 380px;
      flex: 1;
      height: calc(100vh - 65px);
      overflow: hidden;
    }

    /* Left Sidebar: Slide Selector */
    .sidebar {
      background: #173C32;
      border-right: 1px solid rgba(255,255,255,0.08);
      padding: 24px;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .section-label {
      font-size: 11px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 1.5px;
      color: var(--gold);
      margin-bottom: 8px;
    }

    .slide-thumbs {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .slide-thumb-card {
      background: rgba(255,255,255,0.05);
      border: 2px solid transparent;
      border-radius: 12px;
      padding: 12px 14px;
      cursor: pointer;
      transition: all 0.2s;
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .slide-thumb-card:hover {
      background: rgba(255,255,255,0.1);
    }
    .slide-thumb-card.active {
      border-color: var(--gold);
      background: rgba(230, 184, 74, 0.12);
    }

    .thumb-num {
      width: 28px;
      height: 28px;
      border-radius: 50%;
      background: rgba(255,255,255,0.15);
      font-weight: 800;
      font-size: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #FAF7F0;
    }
    .slide-thumb-card.active .thumb-num {
      background: var(--gold);
      color: var(--forest);
    }

    .thumb-info {
      flex: 1;
    }
    .thumb-title {
      font-size: 13px;
      font-weight: 700;
      color: #FAF7F0;
    }
    .thumb-sub {
      font-size: 11px;
      color: rgba(255,255,255,0.6);
      margin-top: 2px;
    }

    /* Stage Area */
    .stage {
      background: #0f1d19;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 24px;
      overflow-y: auto;
      position: relative;
    }

    .aspect-switch {
      display: flex;
      gap: 8px;
      margin-bottom: 16px;
      background: rgba(255,255,255,0.08);
      padding: 4px;
      border-radius: 999px;
    }
    .aspect-btn {
      padding: 6px 14px;
      border-radius: 999px;
      border: none;
      background: transparent;
      color: rgba(255,255,255,0.7);
      font-size: 12px;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.2s;
    }
    .aspect-btn.active {
      background: var(--gold);
      color: var(--forest);
    }

    /* THE SLIDE CANVAS (1080 x 1350 default Instagram Portrait) */
    .canvas-wrapper {
      box-shadow: 0 25px 60px rgba(0,0,0,0.6);
      border-radius: 18px;
      overflow: hidden;
      transform-origin: center center;
    }

    .slide-canvas {
      width: 440px;
      height: 550px; /* 4:5 aspect ratio */
      background: #FAF7F0;
      color: #173C32;
      position: relative;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      user-select: none;
    }

    .slide-canvas.ratio-1-1 {
      width: 460px;
      height: 460px;
    }

    .slide-canvas.ratio-9-16 {
      width: 360px;
      height: 640px;
    }

    /* Slide Layout Components */
    .slide-inner {
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      position: relative;
    }

    /* Cover / Slide 1 */
    .cover-hero-img {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .cover-overlay {
      position: absolute;
      inset: 0;
      background: linear-gradient(180deg, rgba(15,39,32,0.3) 0%, rgba(15,39,32,0.05) 35%, rgba(15,39,32,0.88) 75%, rgba(15,39,32,0.98) 100%);
      z-index: 1;
    }
    .cover-content {
      position: relative;
      z-index: 2;
      margin-top: auto;
      padding: 30px;
      color: #FAF7F0;
    }
    .cover-badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      background: var(--gold);
      color: var(--forest);
      font-size: 11px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 1.5px;
      padding: 5px 12px;
      border-radius: 999px;
      margin-bottom: 12px;
    }
    .cover-title {
      font-family: 'Fraunces', serif;
      font-size: 25px;
      line-height: 1.15;
      font-weight: 800;
      margin-bottom: 8px;
    }
    .cover-sub {
      font-size: 13px;
      color: rgba(250,247,240,0.85);
      line-height: 1.4;
    }
    .cover-dots {
      display: flex;
      gap: 6px;
      margin-top: 14px;
    }
    .dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: rgba(255,255,255,0.4);
    }
    .dot.active {
      background: var(--gold);
      width: 18px;
      border-radius: 999px;
    }

    /* Slide Top Branding */
    .slide-header {
      position: absolute;
      top: 20px;
      left: 20px;
      right: 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      z-index: 3;
    }
    .pill-brand {
      background: rgba(23, 60, 50, 0.9);
      backdrop-filter: blur(8px);
      color: #FAF7F0;
      padding: 6px 14px;
      border-radius: 999px;
      font-size: 10.5px;
      font-weight: 800;
      letter-spacing: 1.2px;
      text-transform: uppercase;
      border: 1px solid rgba(255,255,255,0.18);
    }
    .pill-counter {
      background: rgba(0,0,0,0.55);
      backdrop-filter: blur(8px);
      color: #FAF7F0;
      padding: 5px 11px;
      border-radius: 999px;
      font-size: 11px;
      font-weight: 700;
    }

    /* Split Card Slides (2, 3, 4, 5) */
    .split-slide {
      display: flex;
      flex-direction: column;
      height: 100%;
      background: #FAF7F0;
    }
    .split-image-box {
      flex: 1;
      position: relative;
      overflow: hidden;
    }
    .split-image-box img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .nav-arrow {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      width: 30px;
      height: 30px;
      border-radius: 50%;
      background: rgba(255,255,255,0.85);
      color: #173C32;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
      font-weight: 800;
      box-shadow: 0 4px 10px rgba(0,0,0,0.15);
      z-index: 2;
    }
    .nav-arrow.left { left: 14px; }
    .nav-arrow.right { right: 14px; }

    .split-card-footer {
      padding: 22px 24px;
      background: #FFFFFF;
      border-top: 1px solid rgba(23,60,50,0.08);
      position: relative;
      z-index: 2;
    }
    .split-step-num {
      font-size: 11px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 1.5px;
      color: var(--clay);
      margin-bottom: 4px;
    }
    .split-heading {
      font-family: 'Fraunces', serif;
      font-size: 19px;
      font-weight: 700;
      color: var(--forest);
      line-height: 1.25;
      margin-bottom: 6px;
    }
    .split-text {
      font-size: 12.5px;
      color: rgba(23,60,50,0.8);
      line-height: 1.45;
    }

    /* Outro Slide (Option in Slide 5) */
    .spot-pass-box {
      background: rgba(23,60,50,0.04);
      border: 1px solid rgba(23,60,50,0.1);
      border-radius: 12px;
      padding: 12px 14px;
      display: flex;
      flex-direction: column;
      gap: 6px;
      margin-top: 10px;
    }
    .spot-row {
      display: flex;
      justify-content: space-between;
      font-size: 11.5px;
      border-bottom: 1px solid rgba(23,60,50,0.06);
      padding-bottom: 4px;
    }
    .spot-row:last-child {
      border-bottom: none;
      padding-bottom: 0;
    }
    .spot-k {
      color: rgba(23,60,50,0.6);
      font-weight: 600;
    }
    .spot-v {
      color: var(--forest);
      font-weight: 700;
    }

    /* Right Sidebar: Instagram Mockup & Copy */
    .post-panel {
      background: #173C32;
      border-left: 1px solid rgba(255,255,255,0.08);
      padding: 24px;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .ig-header {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .ig-avatar {
      width: 42px;
      height: 42px;
      border-radius: 50%;
      background: var(--forest-dark);
      border: 2px solid var(--gold);
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: 'Fraunces', serif;
      font-weight: 800;
      color: var(--gold);
      font-size: 14px;
    }
    .ig-user-name {
      font-size: 14px;
      font-weight: 700;
      color: #FAF7F0;
    }
    .ig-user-loc {
      font-size: 11px;
      color: rgba(255,255,255,0.6);
    }

    .caption-box {
      background: rgba(255,255,255,0.06);
      border: 1px solid rgba(255,255,255,0.12);
      border-radius: 12px;
      padding: 16px;
      font-size: 12.5px;
      line-height: 1.55;
      color: #FAF7F0;
      white-space: pre-wrap;
      font-family: 'Inter', sans-serif;
    }

    .toast {
      position: fixed;
      bottom: 24px;
      right: 24px;
      background: var(--gold);
      color: var(--forest);
      font-weight: 800;
      font-size: 13px;
      padding: 12px 24px;
      border-radius: 999px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.4);
      opacity: 0;
      transform: translateY(20px);
      transition: all 0.3s;
      z-index: 100;
      pointer-events: none;
    }
    .toast.show {
      opacity: 1;
      transform: translateY(0);
    }
  </style>
</head>
<body>

  <header>
    <div class="brand">
      <span class="brand-tag">Community Story</span>
      <span class="brand-title">Chicken Krush Prag — Carousel Studio</span>
    </div>
    <div class="actions-bar">
      <button class="btn btn-secondary" onclick="copyCaption()">
        📋 Caption kopieren
      </button>
      <button class="btn btn-primary" onclick="downloadCurrentSlide()">
        ⬇ Aktuellen Slide als PNG
      </button>
      <button class="btn btn-secondary" onclick="downloadAllSlides()">
        📦 Alle 5 Slides
      </button>
    </div>
  </header>

  <div class="app-body">
    <!-- Left: Slide Picker -->
    <aside class="sidebar">
      <div>
        <div class="section-label">Carousel Slides (5)</div>
        <div class="slide-thumbs">
          <div class="slide-thumb-card active" onclick="selectSlide(1)" id="thumb-1">
            <div class="thumb-num">1</div>
            <div class="thumb-info">
              <div class="thumb-title">Cover · Headline</div>
              <div class="thumb-sub">Goldener Crunch in Prag</div>
            </div>
          </div>
          <div class="slide-thumb-card" onclick="selectSlide(2)" id="thumb-2">
            <div class="thumb-num">2</div>
            <div class="thumb-info">
              <div class="thumb-title">01 · Die Location</div>
              <div class="thumb-sub">Leuchtschild & Touchscreen</div>
            </div>
          </div>
          <div class="slide-thumb-card" onclick="selectSlide(3)" id="thumb-3">
            <div class="thumb-num">3</div>
            <div class="thumb-info">
              <div class="thumb-title">02 · Slow Fried</div>
              <div class="thumb-sub">Hauchdünner Crunch</div>
            </div>
          </div>
          <div class="slide-thumb-card" onclick="selectSlide(4)" id="thumb-4">
            <div class="thumb-num">4</div>
            <div class="thumb-info">
              <div class="thumb-title">03 · Die Glasur</div>
              <div class="thumb-sub">Yangnyeom & Mandeln</div>
            </div>
          </div>
          <div class="slide-thumb-card" onclick="selectSlide(5)" id="thumb-5">
            <div class="thumb-num">5</div>
            <div class="thumb-info">
              <div class="thumb-title">04 · Die Tafel</div>
              <div class="thumb-sub">Rose Tteokbokki & Chimaek</div>
            </div>
          </div>
        </div>
      </div>

      <div>
        <div class="section-label">Über diese Story</div>
        <p style="font-size: 12px; line-height: 1.5; color: rgba(255,255,255,0.7);">
          Echte Community-Einsendung aus Prag-Nové Město. Farblich und typografisch exakt abgestimmt auf das Speisely Editorial Design System.
        </p>
      </div>
    </aside>

    <!-- Center: Live Stage Canvas -->
    <main class="stage">
      <div class="aspect-switch">
        <button class="aspect-btn active" onclick="setRatio('4-5')">Portrait 4:5 (Instagram)</button>
        <button class="aspect-btn" onclick="setRatio('1-1')">Square 1:1</button>
        <button class="aspect-btn" onclick="setRatio('9-16')">Story 9:16</button>
      </div>

      <div class="canvas-wrapper" id="canvas-container">
        <!-- Slide 1 (Cover) -->
        <div class="slide-canvas" id="slide-1" style="display: flex;">
          <div class="slide-inner">
            <img class="cover-hero-img" src="data:image/jpeg;base64,${p1}" alt="Chicken Krush Hero">
            <div class="cover-overlay"></div>
            
            <div class="slide-header">
              <div class="pill-brand">Speisely Magazin</div>
              <div class="pill-counter">1/5</div>
            </div>

            <div class="cover-content">
              <div class="cover-badge">✨ Speisely Community Story</div>
              <h1 class="cover-title">Goldener Crunch, Yangnyeom-Glanz & Rose Tteokbokki</h1>
              <p class="cover-sub">Zu Besuch bei Chicken Krush in Prag-Nové Město.</p>
              <div class="cover-dots">
                <div class="dot active"></div>
                <div class="dot"></div>
                <div class="dot"></div>
                <div class="dot"></div>
                <div class="dot"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Slide 2 (Location / Neon Sign) -->
        <div class="slide-canvas" id="slide-2" style="display: none;">
          <div class="slide-inner split-slide">
            <div class="slide-header">
              <div class="pill-brand">Speisely Community</div>
              <div class="pill-counter">2/5</div>
            </div>

            <div class="split-image-box">
              <img src="data:image/jpeg;base64,${p2}" alt="Chicken Krush Neon Sign">
              <div class="nav-arrow left">‹</div>
              <div class="nav-arrow right">›</div>
            </div>

            <div class="split-card-footer">
              <div class="split-step-num">01 · Die Location</div>
              <h2 class="split-heading">Neonschein & Touchscreen-Order</h2>
              <p class="split-text">Versteckt in der ruhigen Příčná-Straße: Urbanes K-Food-Ambiente mit eigener digitaler Bestellkonsole an jedem Tisch.</p>
            </div>
          </div>
        </div>

        <!-- Slide 3 (Slow Fried / Taste Respect) -->
        <div class="slide-canvas" id="slide-3" style="display: none;">
          <div class="slide-inner split-slide">
            <div class="slide-header">
              <div class="pill-brand">Speisely Community</div>
              <div class="pill-counter">3/5</div>
            </div>

            <div class="split-image-box">
              <img src="data:image/jpeg;base64,${p3}" alt="Slow Fried Chicken Crunch">
              <div class="nav-arrow left">‹</div>
              <div class="nav-arrow right">›</div>
            </div>

            <div class="split-card-footer">
              <div class="split-step-num">02 · Das Slow-Fried-Prinzip</div>
              <h2 class="split-heading">Hauchdünner Crunch & saftiger Kern</h2>
              <p class="split-text">Feine Stärkepanade, punktgenau frittiert: Die Kruste bricht mit lautem Knacken, während das Fleisch innen saftig bleibt.</p>
            </div>
          </div>
        </div>

        <!-- Slide 4 (Yangnyeom Glaze) -->
        <div class="slide-canvas" id="slide-4" style="display: none;">
          <div class="slide-inner split-slide">
            <div class="slide-header">
              <div class="pill-brand">Speisely Community</div>
              <div class="pill-counter">4/5</div>
            </div>

            <div class="split-image-box">
              <img src="data:image/jpeg;base64,${p4}" alt="Yangnyeom Glazed Chicken">
              <div class="nav-arrow left">‹</div>
              <div class="nav-arrow right">›</div>
            </div>

            <div class="split-card-footer">
              <div class="split-step-num">03 · Die Glasur</div>
              <h2 class="split-heading">Klebrig-süße Schärfe mit Gochujang</h2>
              <p class="split-text">Dick eingekochte Sauce mit Honig, Knoblauch und Chili, abgerundet mit gerösteten Mandeln für extra Biss.</p>
            </div>
          </div>
        </div>

        <!-- Slide 5 (Tafel & Outro) -->
        <div class="slide-canvas" id="slide-5" style="display: none;">
          <div class="slide-inner split-slide">
            <div class="slide-header">
              <div class="pill-brand">Speisely Community</div>
              <div class="pill-counter">5/5</div>
            </div>

            <div class="split-image-box">
              <img src="data:image/jpeg;base64,${p5}" alt="Shared Table Feast">
              <div class="nav-arrow left">‹</div>
              <div class="nav-arrow right">›</div>
            </div>

            <div class="split-card-footer">
              <div class="split-step-num">04 · Die Tafel & Spot-Pass</div>
              <h2 class="split-heading">Rose Tteokbokki in der Edelstahlpfanne</h2>
              <p class="split-text">Cremig-scharfe Reiskuchen, Pommes und Dips zum Teilen am Tisch.</p>
              <div class="spot-pass-box">
                <div class="spot-row">
                  <span class="spot-k">📍 Ort</span>
                  <span class="spot-v">Příčná 1632/9, Prag-Nové Město</span>
                </div>
                <div class="spot-row">
                  <span class="spot-k">✨ Story</span>
                  <span class="spot-v">speisely.de/magazin/community/...</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Right: Instagram Post Mockup -->
    <aside class="post-panel">
      <div class="section-label">Instagram Post Vorschau</div>
      <div class="ig-header">
        <div class="ig-avatar">S</div>
        <div>
          <div class="ig-user-name">speisely</div>
          <div class="ig-user-loc">Prag, Tschechische Republik</div>
        </div>
      </div>

      <div class="caption-box" id="caption-text">🍗 Goldener Crunch. Klebrige Gochujang-Glasur. Eine dampfende Pfanne Rose Tteokbokki in der Mitte des Tisches.

Ein Mitglied aus unserer Speisely Community hat auf seiner Prag-Reise einen besonderen Stopp eingelegt: @chickenkrush in der Příčná-Straße (Nové Město).

Hier gibt es kein langes Warten: An jedem Tisch ist ein eigener digitaler Touchscreen angebracht. Bestellen, zurücklehnen und zusehen, wie die schweren Holzbretter mit frisch frittiertem Hähnchen und Beilagen serviert werden.

👉 Swipe durch unsere Community-Story für alle Highlights vom Tisch!

📍 Příčná 1632/9, 110 00 Praha 1 (Nové Město)
✦ Die ganze Geschichte jetzt im Speisely Magazin lesen auf speisely.de

#speisely #speiselycommunity #chickenkrush #praguefood #koreanfriedchicken #tteokbokki #chimaek #praguefoodguide #foodculture</div>

      <button class="btn btn-primary" style="width:100%; justify-content:center;" onclick="copyCaption()">
        📋 Caption in Zwischenablage
      </button>
    </aside>
  </div>

  <div class="toast" id="toast">In die Zwischenablage kopiert!</div>

  <script>
    let currentSlide = 1;

    function selectSlide(num) {
      currentSlide = num;
      for (let i = 1; i <= 5; i++) {
        const slide = document.getElementById('slide-' + i);
        if (slide) slide.style.display = (i === num ? 'flex' : 'none');
        const thumb = document.getElementById('thumb-' + i);
        if (thumb) {
          if (i === num) thumb.classList.add('active');
          else thumb.classList.remove('active');
        }
      }
    }

    function setRatio(ratio) {
      document.querySelectorAll('.aspect-btn').forEach(btn => btn.classList.remove('active'));
      event.target.classList.add('active');
      const canvases = document.querySelectorAll('.slide-canvas');
      canvases.forEach(c => {
        c.className = 'slide-canvas';
        if (ratio === '1-1') c.classList.add('ratio-1-1');
        if (ratio === '9-16') c.classList.add('ratio-9-16');
      });
    }

    function showToast(msg) {
      const toast = document.getElementById('toast');
      toast.innerText = msg;
      toast.classList.add('show');
      setTimeout(() => toast.classList.remove('show'), 2500);
    }

    function copyCaption() {
      const text = document.getElementById('caption-text').innerText;
      navigator.clipboard.writeText(text).then(() => {
        showToast('📋 Instagram-Caption kopiert!');
      });
    }

    async function downloadCurrentSlide() {
      const activeSlide = document.getElementById('slide-' + currentSlide);
      showToast('Rendering Slide ' + currentSlide + '...');
      const canvas = await html2canvas(activeSlide, { scale: 3, useCORS: true });
      const link = document.createElement('a');
      link.download = 'speisely-chicken-krush-slide-' + currentSlide + '.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
      showToast('✅ Slide ' + currentSlide + ' heruntergeladen!');
    }

    async function downloadAllSlides() {
      showToast('Erstelle alle 5 Slides...');
      for (let i = 1; i <= 5; i++) {
        selectSlide(i);
        await new Promise(r => setTimeout(r, 200));
        const slide = document.getElementById('slide-' + i);
        const canvas = await html2canvas(slide, { scale: 3, useCORS: true });
        const link = document.createElement('a');
        link.download = 'speisely-chicken-krush-slide-' + i + '.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
        await new Promise(r => setTimeout(r, 400));
      }
      selectSlide(1);
      showToast('🎉 Alle 5 Slides heruntergeladen!');
    }
  </script>
</body>
</html>`;

  const targetPath = 'C:/Users/ahmad/.gemini/antigravity/brain/b308feef-2d4d-4563-b7d6-d6991ec44c51/chicken_krush_carousel_studio.html';
  await fs.writeFile(targetPath, html, 'utf8');
  console.log('Done creating carousel studio HTML at:', targetPath);
}

generate().catch(console.error);
