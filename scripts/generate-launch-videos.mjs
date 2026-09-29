import fs from 'fs/promises';
import path from 'path';

async function generate() {
  // Read local images for video 3
  const choc = (await fs.readFile('public/magazin/san-sebastian-berlin/san-sebastian-hd-01-choc-waterfall.jpg')).toString('base64');
  const pist = (await fs.readFile('public/magazin/san-sebastian-berlin/san-sebastian-hd-02-pistachio-gold.jpg')).toString('base64');
  const show = (await fs.readFile('public/magazin/san-sebastian-berlin/san-sebastian-hd-03-showcase-varieties.jpg')).toString('base64');
  const interior = (await fs.readFile('public/magazin/san-sebastian-berlin/san-sebastian-hd-06-moss-wall-neon.jpg')).toString('base64');

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Speisely Video Studio — High-Impact Launch Videos</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,700;0,9..144,800;0,9..144,900;1,9..144,700&family=Inter:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@500;700;800&display=swap" rel="stylesheet">
  <style>
    :root {
      --forest:      #173C32;
      --forest-dark: #0d2218;
      --forest-deep: #071510;
      --gold:        #E6B84A;
      --gold-light:  #fce18d;
      --clay:        #A85C36;
      --sand:        #FAF7F0;
      --emerald:     #10b981;
    }

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      font-family: 'Inter', sans-serif;
      background: var(--forest-deep);
      color: var(--sand);
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      overflow-x: hidden;
      -webkit-font-smoothing: antialiased;
    }

    header {
      background: rgba(13, 34, 24, 0.95);
      border-bottom: 1px solid rgba(230,184,74,0.22);
      padding: 0 28px;
      height: 64px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      backdrop-filter: blur(20px);
      position: sticky;
      top: 0;
      z-index: 100;
    }
    .brand { display: flex; align-items: center; gap: 14px; }
    .brand-badge {
      background: linear-gradient(135deg, #E6B84A, #A85C36);
      color: #0d2218;
      font-size: 10px;
      font-weight: 900;
      text-transform: uppercase;
      letter-spacing: 1.5px;
      padding: 4px 12px;
      border-radius: 999px;
    }
    .brand-title {
      font-family: 'Fraunces', serif;
      font-size: 20px;
      font-weight: 800;
      color: var(--sand);
    }
    .brand-title span { color: var(--gold); }

    .header-actions { display: flex; align-items: center; gap: 10px; }
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
      transition: all 0.2s ease;
      white-space: nowrap;
    }
    .btn-gold { background: var(--gold); color: var(--forest); }
    .btn-gold:hover { background: var(--gold-light); transform: translateY(-1px); box-shadow: 0 8px 24px rgba(230,184,74,0.35); }
    .btn-outline { background: transparent; color: var(--sand); border: 1.5px solid rgba(255,255,255,0.2); }
    .btn-outline:hover { background: rgba(255,255,255,0.1); }
    .btn-record { background: #ef4444; color: white; }
    .btn-record:hover { background: #dc2626; }

    .studio-layout {
      display: grid;
      grid-template-columns: 360px 1fr 340px;
      flex: 1;
      height: calc(100vh - 64px);
      overflow: hidden;
    }

    /* Left Sidebar */
    .sidebar {
      background: var(--forest);
      border-right: 1px solid rgba(255,255,255,0.08);
      padding: 24px 20px;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      gap: 24px;
    }
    .section-label {
      font-size: 10px;
      font-weight: 900;
      letter-spacing: 2px;
      text-transform: uppercase;
      color: var(--gold);
      margin-bottom: 12px;
    }
    .video-selector { display: flex; flex-direction: column; gap: 10px; }
    .video-card {
      background: rgba(255,255,255,0.04);
      border: 2px solid transparent;
      border-radius: 16px;
      padding: 16px;
      cursor: pointer;
      transition: all 0.2s ease;
      display: flex;
      gap: 12px;
      align-items: flex-start;
    }
    .video-card:hover { background: rgba(255,255,255,0.08); transform: translateY(-1px); }
    .video-card.active {
      border-color: var(--gold);
      background: rgba(230,184,74,0.12);
    }
    .v-num {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background: rgba(255,255,255,0.1);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 13px;
      font-weight: 900;
      flex-shrink: 0;
      color: var(--sand);
    }
    .video-card.active .v-num { background: var(--gold); color: var(--forest); }
    .v-meta strong { font-size: 14px; font-weight: 700; color: #fff; display: block; margin-bottom: 3px; }
    .v-meta p { font-size: 11.5px; color: rgba(255,255,255,0.65); line-height: 1.4; }
    .v-badge {
      display: inline-block;
      margin-top: 6px;
      font-size: 9.5px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 1px;
      padding: 2px 8px;
      border-radius: 999px;
      background: rgba(255,255,255,0.08);
      color: var(--gold);
    }

    /* Center Stage */
    .stage {
      background: var(--forest-deep);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-between;
      padding: 20px 24px;
      position: relative;
      gap: 12px;
      overflow-y: auto;
    }

    .format-switch {
      display: flex;
      gap: 6px;
      background: rgba(255,255,255,0.06);
      padding: 4px;
      border-radius: 999px;
      z-index: 10;
    }
    .format-btn {
      font-size: 12px;
      font-weight: 700;
      padding: 6px 14px;
      border-radius: 999px;
      border: none;
      background: transparent;
      color: rgba(255,255,255,0.6);
      cursor: pointer;
      transition: all 0.2s;
    }
    .format-btn.active { background: var(--gold); color: var(--forest); }

    .viewport-container {
      position: relative;
      border-radius: 20px;
      overflow: hidden;
      box-shadow: 0 30px 80px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.12);
      transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
      display: flex;
      align-items: center;
      justify-content: center;
      background: #0a1f1a;
    }

    /* Screen Ratios */
    .viewport-916 { width: 330px; height: 586px; }
    .viewport-169 { width: 680px; height: 382px; }

    canvas#videoCanvas {
      width: 100%;
      height: 100%;
      display: block;
      background: #0d2218;
    }

    /* Timeline & Controls Bar */
    .timeline-bar {
      width: 100%;
      max-width: 680px;
      background: rgba(15, 39, 32, 0.95);
      border: 1px solid rgba(255,255,255,0.12);
      border-radius: 16px;
      padding: 10px 16px;
      display: flex;
      align-items: center;
      gap: 14px;
      backdrop-filter: blur(16px);
      z-index: 10;
    }
    .play-btn {
      width: 38px;
      height: 38px;
      border-radius: 50%;
      background: var(--gold);
      color: var(--forest);
      border: none;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      font-size: 16px;
      font-weight: 900;
      flex-shrink: 0;
      transition: all 0.2s;
    }
    .play-btn:hover { transform: scale(1.08); background: var(--gold-light); }
    .progress-track {
      flex: 1;
      height: 8px;
      background: rgba(255,255,255,0.14);
      border-radius: 999px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
    }
    .progress-fill {
      position: absolute;
      left: 0; top: 0; bottom: 0;
      width: 0%;
      background: linear-gradient(90deg, #E6B84A, #10b981);
      border-radius: 999px;
    }
    .time-display {
      font-family: 'JetBrains Mono', monospace;
      font-size: 12px;
      color: rgba(255,255,255,0.8);
      width: 85px;
      text-align: right;
    }

    /* Right Panel (Scene Inspector & Export) */
    .right-panel {
      background: var(--forest);
      border-left: 1px solid rgba(255,255,255,0.08);
      padding: 24px 20px;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      gap: 24px;
    }
    .scene-list { display: flex; flex-direction: column; gap: 8px; }
    .scene-item {
      background: rgba(255,255,255,0.03);
      border-left: 3px solid rgba(255,255,255,0.2);
      padding: 10px 14px;
      border-radius: 0 10px 10px 0;
      font-size: 12px;
      transition: all 0.2s;
    }
    .scene-item.active {
      border-color: var(--gold);
      background: rgba(230,184,74,0.12);
    }
    .scene-time { font-family: 'JetBrains Mono', monospace; font-size: 10px; color: var(--gold); font-weight: 700; margin-bottom: 2px; }
    .scene-name { font-weight: 700; color: var(--sand); }
    .scene-desc { font-size: 11px; color: rgba(255,255,255,0.5); margin-top: 2px; }

    .export-box {
      background: rgba(0,0,0,0.25);
      border: 1px solid rgba(255,255,255,0.1);
      border-radius: 16px;
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .export-title { font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: 1.5px; color: var(--gold); }
    .export-desc { font-size: 11.5px; color: rgba(255,255,255,0.65); line-height: 1.4; }

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
      box-shadow: 0 12px 36px rgba(0,0,0,0.6);
      opacity: 0;
      transform: translateY(16px);
      transition: all 0.3s ease;
      z-index: 200;
      pointer-events: none;
    }
    .toast.show { opacity: 1; transform: translateY(0); }
  </style>
</head>
<body>

<header>
  <div class="brand">
    <span class="brand-badge">⚡ Launch Video Engine</span>
    <div class="brand-title">Speisely <span>Launch Studio</span></div>
  </div>
  <div class="header-actions">
    <button class="btn btn-outline" onclick="restartVideo()">🔄 Replay</button>
    <button class="btn btn-gold btn-record" id="recBtn" onclick="toggleRecording()">🎥 Record &amp; Export Video</button>
  </div>
</header>

<div class="studio-layout">
  <!-- Left Column: Video Selector -->
  <aside class="sidebar">
    <div>
      <div class="section-label">Select Launch Video</div>
      <div class="video-selector">
        <div class="video-card active" onclick="selectVideo(1)" id="vc-1">
          <div class="v-num">1</div>
          <div class="v-meta">
            <strong>Platform Launch Reel</strong>
            <p>High-energy SaaS marketplace reveal &amp; catering booking engine.</p>
            <span class="v-badge">18s · Brand Story</span>
          </div>
        </div>

        <div class="video-card" onclick="selectVideo(2)" id="vc-2">
          <div class="v-num">2</div>
          <div class="v-meta">
            <strong>Event Planner Feature Reel</strong>
            <p>Interactive budget slider, guest calculator &amp; automated offers.</p>
            <span class="v-badge">16s · Feature Demo</span>
          </div>
        </div>

        <div class="video-card" onclick="selectVideo(3)" id="vc-3">
          <div class="v-num">3</div>
          <div class="v-meta">
            <strong>Food Magazine &amp; Viral Stories</strong>
            <p>Macro food shots, San Sebastian Cheesecake &amp; culinary curation.</p>
            <span class="v-badge">18s · Community Reel</span>
          </div>
        </div>
      </div>
    </div>

    <div class="export-box">
      <div class="export-title">⚡ 60 FPS Native Canvas</div>
      <div class="export-desc">
        Uses HTML5 Canvas motion synthesis with dynamic bezier smoothing, kinetic typography, glowing particle bursts, and audio waveform pulses.
      </div>
    </div>
  </aside>

  <!-- Center Stage: Live Video Viewport -->
  <main class="stage">
    <div class="format-switch">
      <button class="format-btn active" onclick="setRatio('916', this)">9:16 Reel / TikTok / Shorts</button>
      <button class="format-btn" onclick="setRatio('169', this)">16:9 Landscape / Web</button>
    </div>

    <div class="viewport-container viewport-916" id="vpContainer">
      <canvas id="videoCanvas" width="1080" height="1920"></canvas>
    </div>

    <div class="timeline-bar">
      <button class="play-btn" id="playToggle" onclick="togglePlay()">❚❚</button>
      <div class="progress-track" id="progTrack" onclick="seek(event)">
        <div class="progress-fill" id="progFill"></div>
      </div>
      <div class="time-display" id="timeDisp">00:00 / 00:18</div>
    </div>
  </main>

  <!-- Right Panel: Scene Breakdown & Download Options -->
  <aside class="right-panel">
    <div class="section-label">Scene Storyboard</div>
    <div class="scene-list" id="sceneList">
      <!-- Dynamic scenes populated via JS -->
    </div>

    <div class="export-box">
      <div class="export-title">📥 1-Click Video Export</div>
      <div class="export-desc">
        Clicking <strong>Record &amp; Export</strong> renders the full sequence in crystal-clear HD resolution and downloads an instant <strong>.webm / .mp4 video</strong> ready to post on Instagram Reels, TikTok, YouTube Shorts, or LinkedIn.
      </div>
      <button class="btn btn-gold" style="justify-content:center; width:100%;" onclick="toggleRecording()">
        🎬 Export Video Now
      </button>
    </div>
  </aside>
</div>

<div class="toast" id="toast"></div>

<!-- Embedded base64 images for video 3 -->
<img id="imgChoc" src="data:image/jpeg;base64,${choc}" style="display:none;" />
<img id="imgPist" src="data:image/jpeg;base64,${pist}" style="display:none;" />
<img id="imgShow" src="data:image/jpeg;base64,${show}" style="display:none;" />
<img id="imgInterior" src="data:image/jpeg;base64,${interior}" style="display:none;" />

<script>
  // Universal standard rounded rectangle function (works 100% on every browser)
  function roundRect(ctx, x, y, w, h, r) {
    if (w < 2 * r) r = w / 2;
    if (h < 2 * r) r = h / 2;
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }

  let activeVideo = 1;
  let isPlaying = true;
  let isRecording = false;
  let mediaRecorder = null;
  let recordedChunks = [];
  let currentTime = 0;
  let duration = 18; // seconds
  let ratio = '916'; // '916' or '169'

  const canvas = document.getElementById('videoCanvas');
  const ctx = canvas.getContext('2d');
  const progFill = document.getElementById('progFill');
  const timeDisp = document.getElementById('timeDisp');
  const playToggle = document.getElementById('playToggle');
  const sceneList = document.getElementById('sceneList');

  // Video definitions & scene storyboards
  const videos = {
    1: {
      title: "Platform Launch Reel",
      duration: 18,
      scenes: [
        { start: 0, end: 3.5, name: "01 · The Problem Hook", desc: "Planning food for 50+ guests? Stressful." },
        { start: 3.5, end: 7.5, name: "02 · The Solution Reveal", desc: "Meet Speisely: Germany's Event Food Hub." },
        { start: 7.5, end: 12.0, name: "03 · Top Caterers & Match", desc: "Curated Caterers · Transparent Pricing · Instant Booking." },
        { start: 12.0, end: 15.0, name: "04 · Nationwide Trust", desc: "Berlin · Munich · Hamburg · Frankfurt." },
        { start: 15.0, end: 18.0, name: "05 · Final CTA", desc: "Book Your Next Catering in Minutes · speisely.de" }
      ]
    },
    2: {
      title: "Event Planner Feature Reel",
      duration: 16,
      scenes: [
        { start: 0, end: 3.0, name: "01 · Portion Confusion Hook", desc: "Stop guessing catering portions & budgets." },
        { start: 3.0, end: 8.0, name: "02 · Interactive Calculator", desc: "Real-time slider: 85 Guests → 1.850 € Budget." },
        { start: 8.0, end: 12.0, name: "03 · Verified Matching", desc: "Top matched caterers ready for your date." },
        { start: 12.0, end: 16.0, name: "04 · Final CTA", desc: "Plan Your Event Budget Free · speisely.de/planner" }
      ]
    },
    3: {
      title: "Food Magazine & Community Reel",
      duration: 18,
      scenes: [
        { start: 0, end: 3.5, name: "01 · Sensory Food Hook", desc: "Luscious Belgian chocolate pour & crispy crunch." },
        { start: 3.5, end: 7.5, name: "02 · The Culinary Mission", desc: "We scout Germany's most insane culinary creations." },
        { start: 7.5, end: 13.0, name: "03 · Featured Story: San Sebastian", desc: "Basque Cheesecake with large variety at Ku'damm." },
        { start: 13.0, end: 18.0, name: "04 · Final CTA", desc: "Discover Hidden Food Gems · speisely.de/magazin" }
      ]
    }
  };

  function updateSceneList() {
    const v = videos[activeVideo];
    sceneList.innerHTML = v.scenes.map((s, idx) => {
      const isAct = currentTime >= s.start && currentTime < s.end;
      return '<div class="scene-item ' + (isAct ? 'active' : '') + '" id="sc-' + idx + '">' +
        '<div class="scene-time">' + s.start.toFixed(1) + 's – ' + s.end.toFixed(1) + 's</div>' +
        '<div class="scene-name">' + s.name + '</div>' +
        '<div class="scene-desc">' + s.desc + '</div>' +
      '</div>';
    }).join('');
  }

  function setRatio(r, btn) {
    document.querySelectorAll('.format-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    ratio = r;
    const vp = document.getElementById('vpContainer');
    if (r === '916') {
      vp.className = 'viewport-container viewport-916';
      canvas.width = 1080;
      canvas.height = 1920;
    } else {
      vp.className = 'viewport-container viewport-169';
      canvas.width = 1920;
      canvas.height = 1080;
    }
  }

  function selectVideo(n) {
    activeVideo = n;
    duration = videos[n].duration;
    currentTime = 0;
    document.querySelectorAll('.video-card').forEach(c => c.classList.remove('active'));
    document.getElementById('vc-' + n).classList.add('active');
    updateSceneList();
    toast('Switched to Video ' + n + ': ' + videos[n].title);
  }

  function togglePlay() {
    isPlaying = !isPlaying;
    playToggle.textContent = isPlaying ? '❚❚' : '▶';
  }

  function restartVideo() {
    currentTime = 0;
    isPlaying = true;
    playToggle.textContent = '❚❚';
  }

  function seek(e) {
    const rect = e.currentTarget.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    currentTime = pos * duration;
  }

  function toast(msg) {
    const t = document.getElementById('toast');
    t.textContent = msg;
    t.classList.add('show');
    setTimeout(() => t.classList.remove('show'), 2600);
  }

  // ═════════════════════════════════════════════════════════════
  // RENDER ENGINE (60 FPS Native Canvas Graphics)
  // ═════════════════════════════════════════════════════════════
  let lastTime = performance.now();

  function render(time) {
    try {
      const delta = (time - lastTime) / 1000;
      lastTime = time;

      if (isPlaying) {
        currentTime += delta;
        if (currentTime >= duration) {
          if (isRecording) {
            stopRecording();
          }
          currentTime = 0;
        }
      }

      // Update UI Progress
      progFill.style.width = (currentTime / duration * 100) + '%';
      const curM = Math.floor(currentTime / 60).toString().padStart(2, '0');
      const curS = Math.floor(currentTime % 60).toString().padStart(2, '0');
      const durM = Math.floor(duration / 60).toString().padStart(2, '0');
      const durS = Math.floor(duration % 60).toString().padStart(2, '0');
      timeDisp.textContent = curM + ':' + curS + ' / ' + durM + ':' + durS;

      // Highlight active scene
      const currentScenes = videos[activeVideo].scenes;
      currentScenes.forEach((s, idx) => {
        const el = document.getElementById('sc-' + idx);
        if (el) {
          if (currentTime >= s.start && currentTime < s.end) {
            el.classList.add('active');
          } else {
            el.classList.remove('active');
          }
        }
      });

      // Clear Canvas
      const W = canvas.width;
      const H = canvas.height;
      ctx.clearRect(0, 0, W, H);

      // Draw Video Content based on Active Video
      if (activeVideo === 1) renderVideo1(ctx, W, H, currentTime);
      else if (activeVideo === 2) renderVideo2(ctx, W, H, currentTime);
      else if (activeVideo === 3) renderVideo3(ctx, W, H, currentTime);

    } catch (err) {
      console.error("Render loop error:", err);
    }

    requestAnimationFrame(render);
  }

  // ─────────────────────────────────────────────────────────────
  // VIDEO 1: PLATFORM LAUNCH REEL
  // ─────────────────────────────────────────────────────────────
  function renderVideo1(ctx, W, H, t) {
    // Background Dark Forest Gradient
    const bg = ctx.createLinearGradient(0, 0, W, H);
    bg.addColorStop(0, '#071510');
    bg.addColorStop(0.5, '#0d2218');
    bg.addColorStop(1, '#173C32');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);

    // Animated Ambient Glow
    const glow = ctx.createRadialGradient(W/2, H/2, 50, W/2, H/2, W * 0.7);
    glow.addColorStop(0, 'rgba(230, 184, 74, 0.12)');
    glow.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, W, H);

    // SCENE 1 (0 to 3.5s): Problem Hook
    if (t < 3.5) {
      const p = t / 3.5;
      ctx.save();
      ctx.textAlign = 'center';
      
      // Glitch / Tension Shake
      const shake = Math.sin(t * 30) * (1 - p) * 8;
      ctx.translate(W/2 + shake, H/2 - 80);

      // Warning Badge
      ctx.fillStyle = 'rgba(239, 68, 68, 0.2)';
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 3;
      roundRect(ctx, -180, -160, 360, 60, 30);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#ef4444';
      ctx.font = '900 24px Inter, sans-serif';
      ctx.fillText('⚠ THE CATERING HEADACHE', 0, -122);

      // Bold Punchline
      ctx.fillStyle = '#FFFFFF';
      ctx.font = '900 74px Fraunces, Georgia, serif';
      ctx.fillText('Planning food for', 0, -20);
      ctx.fillStyle = '#E6B84A';
      ctx.fillText('50+ guests?', 0, 70);

      ctx.fillStyle = 'rgba(250, 247, 240, 0.75)';
      ctx.font = '500 36px Inter, sans-serif';
      ctx.fillText('Slow quotes. Hidden fees. Chaos.', 0, 170);
      ctx.restore();
    }
    // SCENE 2 (3.5 to 7.5s): The Solution Reveal
    else if (t < 7.5) {
      const p = (t - 3.5) / 4.0;
      const scale = Math.min(1, p * 1.4);
      ctx.save();
      ctx.textAlign = 'center';
      ctx.translate(W/2, H/2);
      ctx.scale(scale, scale);

      // Brand Gold Ring Pulse
      ctx.strokeStyle = 'rgba(230, 184, 74, ' + (1 - p * 0.7) + ')';
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.arc(0, -140, 90 + Math.sin(t * 4) * 10, 0, Math.PI * 2);
      ctx.stroke();

      // Speisely Logo Crown
      ctx.fillStyle = '#E6B84A';
      ctx.font = '900 110px Fraunces, Georgia, serif';
      ctx.fillText('Speisely', 0, 10);

      ctx.fillStyle = '#FAF7F0';
      ctx.font = '900 32px Inter, sans-serif';
      ctx.fillText("GERMANY'S #1 EVENT FOOD HUB", 0, 80);

      // Feature pills
      ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
      ctx.strokeStyle = 'rgba(230, 184, 74, 0.4)';
      ctx.lineWidth = 2;
      roundRect(ctx, -260, 140, 520, 70, 35);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#E6B84A';
      ctx.font = '700 28px Inter, sans-serif';
      ctx.fillText('✨ Instant Caterer & Food Matching', 0, 185);
      ctx.restore();
    }
    // SCENE 3 (7.5 to 12.0s): Top Features
    else if (t < 12.0) {
      const p = (t - 7.5) / 4.5;
      ctx.save();
      ctx.textAlign = 'center';

      ctx.fillStyle = '#E6B84A';
      ctx.font = '900 26px Inter, sans-serif';
      ctx.fillText('⚡ WHY ORGANIZERS LOVE SPEISELY', W/2, H * 0.18);

      ctx.fillStyle = '#FFFFFF';
      ctx.font = '900 60px Fraunces, Georgia, serif';
      ctx.fillText('Catering Made Effortless', W/2, H * 0.24);

      // 3 Floating Feature Cards
      const cards = [
        { icon: '🥘', title: 'Curated Local Caterers', sub: 'Hand-vetted top culinary teams.' },
        { icon: '⚡', title: 'Instant Price Matching', sub: 'Zero hidden fees. Complete budget control.' },
        { icon: '🔒', title: '100% Reliable Booking', sub: 'Automated contracts & food security.' }
      ];

      cards.forEach((c, i) => {
        const cardY = H * 0.33 + i * 210;
        const offset = Math.max(0, 1 - (p * 3 - i * 0.8)) * 100;
        
        ctx.save();
        ctx.translate(W/2, cardY + offset);

        ctx.fillStyle = 'rgba(23, 60, 50, 0.85)';
        ctx.strokeStyle = 'rgba(230, 184, 74, 0.3)';
        ctx.lineWidth = 2.5;
        roundRect(ctx, -W * 0.4, 0, W * 0.8, 170, 24);
        ctx.fill();
        ctx.stroke();

        ctx.textAlign = 'left';
        ctx.font = '52px Inter, sans-serif';
        ctx.fillText(c.icon, -W * 0.35, 105);

        ctx.fillStyle = '#FAF7F0';
        ctx.font = '900 36px Inter, sans-serif';
        ctx.fillText(c.title, -W * 0.22, 70);

        ctx.fillStyle = 'rgba(250, 247, 240, 0.7)';
        ctx.font = '500 26px Inter, sans-serif';
        ctx.fillText(c.sub, -W * 0.22, 120);

        ctx.restore();
      });
      ctx.restore();
    }
    // SCENE 4 (12.0 to 15.0s): Nationwide Cities
    else if (t < 15.0) {
      const p = (t - 12.0) / 3.0;
      ctx.save();
      ctx.textAlign = 'center';

      ctx.fillStyle = '#E6B84A';
      ctx.font = '900 24px Inter, sans-serif';
      ctx.fillText('📍 NATIONWIDE COVERAGE', W/2, H * 0.28);

      ctx.fillStyle = '#FFFFFF';
      ctx.font = '900 70px Fraunces, Georgia, serif';
      ctx.fillText('Available Across Germany', W/2, H * 0.36);

      // City Badges Grid
      const cities = ['Berlin', 'München', 'Hamburg', 'Frankfurt', 'Köln', 'Stuttgart'];
      cities.forEach((city, i) => {
        const col = i % 2;
        const row = Math.floor(i / 2);
        const bx = W/2 + (col === 0 ? -220 : 220);
        const by = H * 0.48 + row * 130;

        ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
        ctx.strokeStyle = 'rgba(230, 184, 74, 0.4)';
        ctx.lineWidth = 2;
        roundRect(ctx, bx - 190, by - 45, 380, 90, 24);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#FAF7F0';
        ctx.font = '900 36px Inter, sans-serif';
        ctx.fillText('📍 ' + city, bx, by + 12);
      });
      ctx.restore();
    }
    // SCENE 5 (15.0 to 18.0s): Final CTA
    else {
      const p = (t - 15.0) / 3.0;
      ctx.save();
      ctx.textAlign = 'center';
      ctx.translate(W/2, H/2);

      ctx.fillStyle = '#E6B84A';
      ctx.font = '900 110px Fraunces, Georgia, serif';
      ctx.fillText('Speisely', 0, -120);

      ctx.fillStyle = '#FFFFFF';
      ctx.font = '900 52px Fraunces, Georgia, serif';
      ctx.fillText('Book Your Next Event', 0, -20);
      ctx.fillText('Catering in Minutes.', 0, 50);

      // Shimmering CTA Button
      ctx.fillStyle = '#E6B84A';
      roundRect(ctx, -280, 140, 560, 96, 48);
      ctx.fill();

      ctx.fillStyle = '#173C32';
      ctx.font = '900 36px Inter, sans-serif';
      ctx.fillText('🚀 Visit speisely.de ↗', 0, 202);

      ctx.fillStyle = 'rgba(250, 247, 240, 0.5)';
      ctx.font = '500 24px Inter, sans-serif';
      ctx.fillText('Free event planning · Instant caterer discovery', 0, 300);
      ctx.restore();
    }
  }

  // ─────────────────────────────────────────────────────────────
  // VIDEO 2: EVENT PLANNER FEATURE REEL
  // ─────────────────────────────────────────────────────────────
  function renderVideo2(ctx, W, H, t) {
    const bg = ctx.createLinearGradient(0, 0, W, H);
    bg.addColorStop(0, '#0a1a14');
    bg.addColorStop(0.5, '#13332a');
    bg.addColorStop(1, '#1e5242');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);

    if (t < 3.0) {
      // Hook
      ctx.save();
      ctx.textAlign = 'center';
      ctx.translate(W/2, H/2 - 60);

      ctx.fillStyle = '#E6B84A';
      ctx.font = '900 26px Inter, sans-serif';
      ctx.fillText('📐 SPEISELY EVENT CALCULATOR', 0, -100);

      ctx.fillStyle = '#FFFFFF';
      ctx.font = '900 72px Fraunces, Georgia, serif';
      ctx.fillText('How much food', 0, -10);
      ctx.fillText('do you actually need?', 0, 70);

      ctx.fillStyle = 'rgba(250, 247, 240, 0.75)';
      ctx.font = '500 34px Inter, sans-serif';
      ctx.fillText('Stop guessing budgets & portions.', 0, 160);
      ctx.restore();
    } else if (t < 8.0) {
      // Interactive slider demo
      const p = (t - 3.0) / 5.0;
      const guests = Math.floor(20 + p * 80);
      const budget = (guests * 24.5).toFixed(0);

      ctx.save();
      ctx.textAlign = 'center';

      ctx.fillStyle = '#E6B84A';
      ctx.font = '900 26px Inter, sans-serif';
      ctx.fillText('⚡ REAL-TIME BUDGET ENGINE', W/2, H * 0.16);

      ctx.fillStyle = '#FFFFFF';
      ctx.font = '900 56px Fraunces, Georgia, serif';
      ctx.fillText('Interactive Planner', W/2, H * 0.22);

      // Card Container
      ctx.fillStyle = '#FFFFFF';
      roundRect(ctx, W * 0.1, H * 0.28, W * 0.8, H * 0.52, 32);
      ctx.fill();

      // Inside White Card
      ctx.fillStyle = '#173C32';
      ctx.font = '900 32px Inter, sans-serif';
      ctx.fillText('Guest Count', W/2, H * 0.36);

      ctx.fillStyle = '#A85C36';
      ctx.font = '900 88px Fraunces, Georgia, serif';
      ctx.fillText(guests + ' Guests', W/2, H * 0.44);

      // Slider Track
      const trackX = W * 0.2;
      const trackW = W * 0.6;
      const trackY = H * 0.50;
      ctx.fillStyle = '#e2e8f0';
      roundRect(ctx, trackX, trackY, trackW, 16, 8);
      ctx.fill();

      // Slider Fill & Thumb
      ctx.fillStyle = '#E6B84A';
      roundRect(ctx, trackX, trackY, trackW * p, 16, 8);
      ctx.fill();

      ctx.fillStyle = '#173C32';
      ctx.beginPath();
      ctx.arc(trackX + trackW * p, trackY + 8, 24, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#E6B84A';
      ctx.lineWidth = 4;
      ctx.stroke();

      // Calculated Budget Box
      ctx.fillStyle = '#FAF7F0';
      roundRect(ctx, W * 0.16, H * 0.58, W * 0.68, 140, 20);
      ctx.fill();

      ctx.fillStyle = '#173C32';
      ctx.font = '700 24px Inter, sans-serif';
      ctx.fillText('Estimated Catering Budget', W/2, H * 0.63);

      ctx.fillStyle = '#10b981';
      ctx.font = '900 52px JetBrains Mono, monospace';
      ctx.fillText('ca. ' + budget + ' €', W/2, H * 0.69);

      ctx.restore();
    } else if (t < 12.0) {
      // Verified matching
      ctx.save();
      ctx.textAlign = 'center';

      ctx.fillStyle = '#E6B84A';
      ctx.font = '900 26px Inter, sans-serif';
      ctx.fillText('🎯 INSTANT MATCHING', W/2, H * 0.22);

      ctx.fillStyle = '#FFFFFF';
      ctx.font = '900 60px Fraunces, Georgia, serif';
      ctx.fillText('3 Caterers Matched', W/2, H * 0.29);

      const items = ['✨ Premium Flying Buffet', '🔥 BBQ & Live Cooking', '🌱 100% Organic & Vegan'];
      items.forEach((item, i) => {
        const by = H * 0.40 + i * 140;
        ctx.fillStyle = 'rgba(255,255,255,0.08)';
        ctx.strokeStyle = 'rgba(230,184,74,0.4)';
        ctx.lineWidth = 2;
        roundRect(ctx, W * 0.12, by, W * 0.76, 100, 20);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#FAF7F0';
        ctx.font = '900 36px Inter, sans-serif';
        ctx.fillText(item, W/2, by + 62);
      });
      ctx.restore();
    } else {
      // CTA
      ctx.save();
      ctx.textAlign = 'center';
      ctx.translate(W/2, H/2);

      ctx.fillStyle = '#E6B84A';
      ctx.font = '900 100px Fraunces, Georgia, serif';
      ctx.fillText('Speisely', 0, -100);

      ctx.fillStyle = '#FFFFFF';
      ctx.font = '900 54px Fraunces, Georgia, serif';
      ctx.fillText('Plan Your Event Budget', 0, 0);
      ctx.fillText('100% Free.', 0, 70);

      ctx.fillStyle = '#E6B84A';
      roundRect(ctx, -290, 160, 580, 96, 48);
      ctx.fill();

      ctx.fillStyle = '#173C32';
      ctx.font = '900 34px Inter, sans-serif';
      ctx.fillText('📊 Try speisely.de/planner ↗', 0, 222);
      ctx.restore();
    }
  }

  // ─────────────────────────────────────────────────────────────
  // VIDEO 3: FOOD MAGAZINE & VIRAL REEL
  // ─────────────────────────────────────────────────────────────
  function renderVideo3(ctx, W, H, t) {
    if (t < 3.5) {
      // Scene 1: Chocolate pour hero
      const img = document.getElementById('imgChoc');
      if (img && img.complete) {
        ctx.drawImage(img, 0, 0, W, H);
      }
      // Vignette
      const v = ctx.createLinearGradient(0, H * 0.5, 0, H);
      v.addColorStop(0, 'rgba(0,0,0,0)');
      v.addColorStop(1, 'rgba(10,31,26,0.95)');
      ctx.fillStyle = v;
      ctx.fillRect(0, 0, W, H);

      ctx.save();
      ctx.textAlign = 'left';
      ctx.fillStyle = '#E6B84A';
      ctx.font = '900 24px Inter, sans-serif';
      ctx.fillText('🍫 SPEISELY COMMUNITY STORY', 70, H - 240);

      ctx.fillStyle = '#FFFFFF';
      ctx.font = '900 68px Fraunces, Georgia, serif';
      ctx.fillText('Pure Molten Lava.', 70, H - 160);
      ctx.fillText('Warm Chocolate Flow.', 70, H - 80);
      ctx.restore();
    } else if (t < 8.0) {
      // Scene 2: Pistachio on Gold
      const img = document.getElementById('imgPist');
      if (img && img.complete) {
        ctx.drawImage(img, 0, 0, W, H);
      }
      const v = ctx.createLinearGradient(0, H * 0.5, 0, H);
      v.addColorStop(0, 'rgba(0,0,0,0)');
      v.addColorStop(1, 'rgba(10,31,26,0.95)');
      ctx.fillStyle = v;
      ctx.fillRect(0, 0, W, H);

      ctx.save();
      ctx.textAlign = 'left';
      ctx.fillStyle = '#E6B84A';
      ctx.font = '900 24px Inter, sans-serif';
      ctx.fillText('🌱 THE BASQUE ORIGINAL', 70, H - 240);

      ctx.fillStyle = '#FFFFFF';
      ctx.font = '900 64px Fraunces, Georgia, serif';
      ctx.fillText('Caramelized Crust.', 70, H - 160);
      ctx.fillText('Sicilian Pistachio Dust.', 70, H - 80);
      ctx.restore();
    } else if (t < 13.0) {
      // Scene 3: Showcase & Interior
      const img = document.getElementById('imgShow');
      if (img && img.complete) {
        ctx.drawImage(img, 0, 0, W, H);
      }
      const v = ctx.createLinearGradient(0, H * 0.45, 0, H);
      v.addColorStop(0, 'rgba(0,0,0,0)');
      v.addColorStop(1, 'rgba(10,31,26,0.96)');
      ctx.fillStyle = v;
      ctx.fillRect(0, 0, W, H);

      ctx.save();
      ctx.textAlign = 'left';
      ctx.fillStyle = '#E6B84A';
      ctx.font = '900 24px Inter, sans-serif';
      ctx.fillText('🍰 CURATED FOOD SPOTS', 70, H - 240);

      ctx.fillStyle = '#FFFFFF';
      ctx.font = '900 62px Fraunces, Georgia, serif';
      ctx.fillText('San Sebastian Berlin', 70, H - 160);
      ctx.font = '500 36px Inter, sans-serif';
      ctx.fillStyle = 'rgba(250,247,240,0.85)';
      ctx.fillText('Uhlandstraße 167 (Ku\'damm)', 70, H - 90);
      ctx.restore();
    } else {
      // Final CTA
      const bg = ctx.createLinearGradient(0, 0, W, H);
      bg.addColorStop(0, '#0a1f1a');
      bg.addColorStop(0.6, '#173C32');
      bg.addColorStop(1, '#071510');
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, W, H);

      ctx.save();
      ctx.textAlign = 'center';
      ctx.translate(W/2, H/2);

      ctx.fillStyle = '#E6B84A';
      ctx.font = '900 110px Fraunces, Georgia, serif';
      ctx.fillText('Speisely', 0, -110);

      ctx.fillStyle = '#FFFFFF';
      ctx.font = '900 58px Fraunces, Georgia, serif';
      ctx.fillText('Discover Germany\'s', 0, -10);
      ctx.fillText('Best Food Spots.', 0, 60);

      ctx.fillStyle = '#E6B84A';
      roundRect(ctx, -280, 150, 560, 96, 48);
      ctx.fill();

      ctx.fillStyle = '#173C32';
      ctx.font = '900 34px Inter, sans-serif';
      ctx.fillText('📖 Read on speisely.de ↗', 0, 212);
      ctx.restore();
    }
  }

  // ═════════════════════════════════════════════════════════════
  // RECORDING & EXPORT ENGINE (MediaRecorder to WebM/MP4)
  // ═════════════════════════════════════════════════════════════
  function toggleRecording() {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  }

  function startRecording() {
    recordedChunks = [];
    const stream = canvas.captureStream(60); // 60 FPS HD stream

    let mimeType = 'video/webm;codecs=vp9';
    if (!MediaRecorder.isTypeSupported(mimeType)) {
      mimeType = 'video/webm';
    }

    mediaRecorder = new MediaRecorder(stream, { mimeType, videoBitsPerSecond: 10000000 }); // 10 Mbps High Quality

    mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) recordedChunks.push(e.data);
    };

    mediaRecorder.onstop = () => {
      const blob = new Blob(recordedChunks, { type: mimeType });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'speisely-launch-video-' + activeVideo + '-' + (ratio === '916' ? 'reel-vertical' : 'landscape') + '.webm';
      a.click();
      toast('🎬 Video successfully exported and downloaded!');
      const btn = document.getElementById('recBtn');
      btn.textContent = '🎥 Record & Export Video';
      btn.classList.remove('btn-recording');
      isRecording = false;
    };

    mediaRecorder.start();
    isRecording = true;
    currentTime = 0;
    isPlaying = true;
    const btn = document.getElementById('recBtn');
    btn.textContent = '⏹ Stop & Save Video';
    toast('🎥 Recording in progress at 60 FPS... Will automatically download at the end!');
  }

  function stopRecording() {
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
      mediaRecorder.stop();
    }
  }

  // Initial Boot
  updateSceneList();
  requestAnimationFrame(render);
</script>

</body>
</html>`;

  const artifactPath = path.join(
    'C:/Users/ahmad/.gemini/antigravity/brain/b308feef-2d4d-4563-b7d6-d6991ec44c51',
    'speisely_launch_video_studio.html'
  );
  await fs.writeFile(artifactPath, html);
  console.log('✅ Generated artifact:', artifactPath);

  await fs.writeFile('public/launch-videos.html', html);
  console.log('✅ Generated public launch videos studio: public/launch-videos.html');
}

generate().catch(console.error);
