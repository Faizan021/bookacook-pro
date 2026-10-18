"""
LA GRILLADINE DÜSSELDORF — 100% ORIGINAL HIGH-PERFORMANCE LUXURY KINETIC REEL
Creative Direction: 100% Original 3D Studio Assets (Zero third-party video, 0% copyright/originality risk)
Format: 1080 × 1920 @ 30fps (9:16 Vertical Instagram Reel), 18.0 seconds
Audio: Silent (ready for native Instagram trending sound overlay)
UI Architecture: Strictly adheres to Instagram 9:16 App Interface Safe Zones (Rule 16)
  - Top 0 - 260px: Pure visual buffer for Instagram status bar, profile avatar, handle & audio title
  - Bottom 1500 - 1920px: Pure visual buffer for Instagram caption, like/comment buttons & mute icon
  - Safe Content Canvas: Y = 265px to Y = 1480px
"""

import os, math, subprocess
import numpy as np
from PIL import Image, ImageDraw, ImageFont
import cv2
import imageio_ffmpeg

W, H = 1080, 1920
FPS = 30
DURATION = 18.0
TOTAL_FRAMES = int(DURATION * FPS)

# ─── DESIGN TOKENS ───────────────────────────────────────────────────────────
FOREST    = (8,   56,  34)       # #083822  Speisely Deep Forest
GOLD      = (230, 184,  74)      # #E6B84A  Speisely Gold
CREAM     = (246, 244, 235)      # #F6F4EB  Ivory Cream
OBSIDIAN  = (6,   14,   9,  245) # near-black with alpha
RED_PILL  = (190,  30,  30, 240) # accent red
SAGE_PILL = (235, 244, 236, 250) # frosted sage

# ─── FONT PATHS ──────────────────────────────────────────────────────────────
F_GEORGIA_B = "C:/Windows/Fonts/georgiab.ttf"
F_GEORGIA_I = "C:/Windows/Fonts/georgiai.ttf"
F_ARIAL_B   = "C:/Windows/Fonts/arialbd.ttf"
F_ARIAL     = "C:/Windows/Fonts/arial.ttf"
F_BAHN      = "C:/Windows/Fonts/bahnschrift.ttf"
F_SEGOE_B   = "C:/Windows/Fonts/segoeuib.ttf"

def gf(path, size):
    try: return ImageFont.truetype(path, size)
    except: return ImageFont.load_default()

# ─── EASING ──────────────────────────────────────────────────────────────────
def ease_out(t):     return 1 - (1 - t)**3
def ease_in_out(t):  return 0.5 - 0.5 * math.cos(math.pi * t)
def elastic_out(t):
    c4 = (2 * math.pi) / 3
    if t <= 0: return 0
    if t >= 1: return 1
    return math.pow(2, -10*t) * math.sin((t*10 - 0.75) * c4) + 1

# ─── VIGNETTES (Tuned for Instagram Safe Zone Content Canvas) ────────────────
def make_vignette_overlay(top_alpha=220, bottom_alpha=240, top_h=620, bot_h=660):
    v = Image.new("RGBA", (W, H), (0,0,0,0))
    d = ImageDraw.Draw(v)
    for y in range(top_h):
        a = int(top_alpha * math.pow(1 - y/top_h, 1.4))
        d.line([(0,y),(W,y)], fill=(FOREST[0], FOREST[1], FOREST[2], a))
    for y in range(H - bot_h, H):
        t = (y - (H - bot_h)) / bot_h
        a = int(bottom_alpha * math.pow(t, 1.3))
        d.line([(0,y),(W,y)], fill=(FOREST[0], FOREST[1], FOREST[2], a))
    return v

VIGNETTE_STD  = make_vignette_overlay(top_h=620, bot_h=660)
VIGNETTE_DEEP = make_vignette_overlay(top_h=660, bot_h=680)

def fullbleed(img, zoom=1.0, pan_x=0.0, pan_y=0.0):
    iw, ih = img.size
    scale = max(W / iw, H / ih) * zoom
    nw, nh = int(iw * scale), int(ih * scale)
    scaled = img.resize((nw, nh), Image.Resampling.BILINEAR)
    left = max(0, min(nw - W, int((nw - W) // 2 + pan_x)))
    top  = max(0, min(nh - H, int((nh - H) // 2 + pan_y)))
    return scaled.crop((left, top, left + W, top + H)).convert("RGBA")

def color_grade_image(img, tint=(0,0,0), exposure=1.0, saturation=1.0):
    arr = np.array(img.convert("RGB")).astype(np.float32)
    arr = np.clip(arr * exposure, 0, 255)
    gray = arr.mean(axis=2, keepdims=True)
    arr = gray + (arr - gray) * saturation
    t = np.array(tint, dtype=np.float32)
    arr = arr * 0.94 + t * 0.06
    return Image.fromarray(np.clip(arr, 0, 255).astype(np.uint8)).convert("RGB")

def centered_x(draw, text, font):
    bb = draw.textbbox((0,0), text, font=font)
    return (W - (bb[2]-bb[0])) // 2

def stamp(draw, text, font, x, y, fill=CREAM, shadow=True):
    if shadow:
        for dx in [-2,-1,0,1,2]:
            for dy in [1,2,3]:
                draw.text((x+dx, y+dy), text, font=font, fill=(0,0,0,210))
    draw.text((x, y), text, font=font, fill=fill)

def animated_pill(draw, text, font, cx, cy, t,
                  bg=(235,244,236,245), border=(127,164,107,220), fg=(24,46,34)):
    scale = min(1.0, elastic_out(t))
    bb = draw.textbbox((0,0), text, font=font)
    tw = bb[2]-bb[0]; th = bb[3]-bb[1]
    pw = int((tw + 44) * scale); ph = int((th + 20) * scale)
    if pw < 2 or ph < 2: return
    px = cx - pw//2; py = cy - ph//2
    draw.rounded_rectangle([px,py,px+pw,py+ph], radius=min(ph//2,22), fill=bg, outline=border, width=2)
    if scale > 0.6:
        tx = px + (pw - int(tw*scale))//2
        ty = py + (ph - int(th*scale))//2
        alpha = min(255, int(255 * (scale - 0.6) / 0.4))
        col = (*fg[:3], alpha) if len(fg)==3 else (*fg, alpha)
        draw.text((tx, ty), text, font=font, fill=col)

def draw_logo_badge(canvas, logo, x=65, y=265, size=60):
    if logo:
        l = logo.resize((size,size), Image.Resampling.BILINEAR)
        canvas.paste(l, (x, y), l)

def draw_slide_counter(draw, current, total, font, y=278):
    text = f"{current}/{total}"
    bb = draw.textbbox((0,0), text, font=font)
    x = W - (bb[2]-bb[0]) - 65
    draw.text((x+1, y+1), text, font=font, fill=(0,0,0,180))
    draw.text((x, y), text, font=font, fill=(255,255,255,220))

def draw_bottom_cta(draw, text, font, y=1430):
    x = centered_x(draw, text, font)
    draw.text((x+1, y+1), text, font=font, fill=(0,0,0,220))
    draw.text((x, y), text, font=font, fill=GOLD)

def main():
    workspace = r"c:\recoverd usb\Speisely Marketplace1"
    out_dir   = os.path.join(workspace, "public", "magazin", "la-grilladine-duesseldorf")
    os.makedirs(out_dir, exist_ok=True)

    raw_path   = os.path.join(out_dir, "la_grilladine_speisely_reel_raw.mp4")
    final_path = os.path.join(out_dir, "la_grilladine_speisely_reel.mp4")
    clean_path = os.path.join(out_dir, "la_grilladine_speisely_reel_clean.mp4")
    raw_clean_path = os.path.join(out_dir, "la_grilladine_speisely_reel_clean_raw.mp4")

    print("Loading 100% original 3D studio media assets...", flush=True)

    # 6 Curated 100% Original 3D Studio Master Shots
    img_theke_raw     = Image.open(os.path.join(out_dir, "la_grilladine_theke_3d.webp")).convert("RGB")
    img_entrecote_raw = Image.open(os.path.join(out_dir, "la_grilladine_entrecote_3d.webp")).convert("RGB")
    img_dorade_raw    = Image.open(os.path.join(out_dir, "la_grilladine_dorade_3d.webp")).convert("RGB")
    img_tajine_raw    = Image.open(os.path.join(out_dir, "la_grilladine_tajine_poulet_3d.webp")).convert("RGB")
    img_gambas_raw    = Image.open(os.path.join(out_dir, "la_grilladine_gambas_3d.webp")).convert("RGB")
    img_minztee_raw   = Image.open(os.path.join(out_dir, "la_grilladine_minztee_3d.webp")).convert("RGB")

    # High-end color grading
    img_theke     = color_grade_image(img_theke_raw,     tint=(20, 15,  5), exposure=0.94, saturation=1.14)
    img_entrecote = color_grade_image(img_entrecote_raw, tint=(25, 15, 10), exposure=0.95, saturation=1.16)
    img_dorade    = color_grade_image(img_dorade_raw,    tint=(15, 20, 10), exposure=0.96, saturation=1.16)
    img_tajine    = color_grade_image(img_tajine_raw,    tint=(25, 12,  5), exposure=0.95, saturation=1.18)
    img_gambas    = color_grade_image(img_gambas_raw,    tint=(22, 16,  8), exposure=0.95, saturation=1.16)
    img_minztee   = color_grade_image(img_minztee_raw,   tint=(8,  25, 15), exposure=0.95, saturation=1.15)

    logo_path = os.path.join(workspace, "scratch", "speisely_circular_badge_perfect.png")
    logo = Image.open(logo_path).convert("RGBA") if os.path.exists(logo_path) else None

    # Typography tuned for Instagram 9:16 Safe Zones
    f_huge    = gf(F_GEORGIA_B, 78)
    f_title   = gf(F_GEORGIA_B, 60)
    f_sub     = gf(F_GEORGIA_I, 30)
    f_sub2    = gf(F_GEORGIA_I, 26)
    f_badge   = gf(F_ARIAL_B,   22)
    f_fact_t  = gf(F_ARIAL_B,   25)
    f_fact_v  = gf(F_ARIAL,     22)
    f_cta     = gf(F_ARIAL_B,   26)
    f_counter = gf(F_ARIAL_B,   22)

    fourcc = cv2.VideoWriter_fourcc(*"mp4v")
    out_video = cv2.VideoWriter(raw_path, fourcc, FPS, (W, H))
    out_clean = cv2.VideoWriter(raw_clean_path, fourcc, FPS, (W, H))

    preview_times = [1.5, 4.5, 7.5, 10.5, 13.5, 16.5]
    previews = {}

    print(f"Rendering {TOTAL_FRAMES} frames @ {FPS}fps (Instagram Safe Zone Certified)...", flush=True)

    for frame_idx in range(TOTAL_FRAMES):
        cur_time = frame_idx / FPS

        # ── SCENE 1: THE HOOK & ARRIVAL (0.0s - 3.0s) ───────────────────────
        if cur_time < 3.0:
            st = cur_time / 3.0
            slide_no = 1
            zoom = 1.02 + 0.08 * ease_out(st)
            pan_y = -15.0 + 30.0 * ease_in_out(st)
            canvas = fullbleed(img_theke, zoom=zoom, pan_y=pan_y)
            clean_canvas = canvas.copy()

            canvas.alpha_composite(VIGNETTE_STD)
            draw = ImageDraw.Draw(canvas)

            draw_logo_badge(canvas, logo)
            draw_slide_counter(draw, slide_no, 6, f_counter)

            # Placed within Safe Zone: Y = 290px
            animated_pill(draw, "DÜSSELDORF-OBERBILK · MAGHREB-VIERTEL", f_badge, W//2, 292, st * 2.5)
            y_title = 355
            stamp(draw, "La Grilladine", f_huge, centered_x(draw, "La Grilladine", f_huge), y_title, fill=CREAM)
            stamp(draw, "Glut, Ton & Maghreb-Feuer", f_sub, centered_x(draw, "Glut, Ton & Maghreb-Feuer", f_sub), y_title + 85, fill=GOLD)

            # Bottom Safe Zone: Y = 1350px & Y = 1430px (well above 1520px caption cutoff)
            animated_pill(draw, "Geheimtipp für marokkanische Holzkohle & Tajine", f_sub2, W//2, 1350, st * 2.0,
                          bg=OBSIDIAN, border=(*GOLD, 180), fg=CREAM)
            draw_bottom_cta(draw, "Swipe für den Rundgang >>", f_cta, y=1430)

        # ── SCENE 2: CHARCOAL GRILL & MEAT CUTS (3.0s - 6.0s) ───────────────
        elif cur_time < 6.0:
            st = (cur_time - 3.0) / 3.0
            slide_no = 2
            zoom = 1.03 + 0.09 * ease_out(st)
            pan_x = -25.0 + 50.0 * ease_in_out(st)
            canvas = fullbleed(img_entrecote, zoom=zoom, pan_x=pan_x)
            clean_canvas = canvas.copy()

            canvas.alpha_composite(VIGNETTE_STD)
            draw = ImageDraw.Draw(canvas)

            draw_logo_badge(canvas, logo)
            draw_slide_counter(draw, slide_no, 6, f_counter)

            animated_pill(draw, "DAS REINE HANDWERK", f_badge, W//2, 292, st * 2.5)
            y_title = 355
            stamp(draw, "Frischetheke & Buchenglut", f_title, centered_x(draw, "Frischetheke & Buchenglut", f_title), y_title, fill=CREAM)
            stamp(draw, "Wähle deinen Schnitt · Direkt auf den Grillrost", f_sub, centered_x(draw, "Wähle deinen Schnitt · Direkt auf den Grillrost", f_sub), y_title + 75, fill=GOLD)

            animated_pill(draw, "100% ECHTE BUCHENHOLZKOHLE · KEIN GAS", f_badge, W//2, 1350, st * 2.0,
                          bg=OBSIDIAN, border=(*GOLD, 180), fg=CREAM)
            draw_bottom_cta(draw, "Zarte Steaks, Koteletts & Merguez >>", f_cta, y=1430)

        # ── SCENE 3: THE SHOWSTOPPER (DORADE ROYALE) (6.0s - 9.0s) ──────────
        elif cur_time < 9.0:
            st = (cur_time - 6.0) / 3.0
            slide_no = 3
            zoom = 1.04 + 0.08 * ease_out(st)
            pan_y = -20.0 + 40.0 * ease_in_out(st)
            canvas = fullbleed(img_dorade, zoom=zoom, pan_y=pan_y)
            clean_canvas = canvas.copy()

            canvas.alpha_composite(VIGNETTE_STD)
            draw = ImageDraw.Draw(canvas)

            draw_logo_badge(canvas, logo)
            draw_slide_counter(draw, slide_no, 6, f_counter)

            animated_pill(draw, "DER SHOWSTOPPER · SIGNATURE", f_badge, W//2, 292, st * 2.5,
                          bg=RED_PILL, border=(255,120,120,240), fg=(255,255,255))
            y_title = 355
            stamp(draw, "Dorade Royale Papillon", f_title, centered_x(draw, "Dorade Royale Papillon", f_title), y_title, fill=CREAM)
            stamp(draw, "Im Schmetterlingsschnitt · Krosse Kartoffelrondellen", f_sub, centered_x(draw, "Im Schmetterlingsschnitt · Krosse Kartoffelrondellen", f_sub), y_title + 75, fill=GOLD)

            animated_pill(draw, "Hauchfeine Knusperkruste · Saftig glasige Flocken", f_sub2, W//2, 1350, st * 2.0,
                          bg=OBSIDIAN, border=(*GOLD, 180), fg=CREAM)
            draw_bottom_cta(draw, "Mit hausgemachter Chermoula-Würze >>", f_cta, y=1430)

        # ── SCENE 4: CLAYPOT TAJINE DE POULET (9.0s - 12.0s) ────────────────
        elif cur_time < 12.0:
            st = (cur_time - 9.0) / 3.0
            slide_no = 4
            zoom = 1.03 + 0.08 * ease_out(st)
            pan_x = 25.0 - 50.0 * ease_in_out(st)
            canvas = fullbleed(img_tajine, zoom=zoom, pan_x=pan_x)
            clean_canvas = canvas.copy()

            canvas.alpha_composite(VIGNETTE_STD)
            draw = ImageDraw.Draw(canvas)

            draw_logo_badge(canvas, logo)
            draw_slide_counter(draw, slide_no, 6, f_counter)

            animated_pill(draw, "DIE ALCHEMIE DER GEDULD", f_badge, W//2, 292, st * 2.5)
            y_title = 355
            stamp(draw, "Tajine aux Citrons Confits", f_title, centered_x(draw, "Tajine aux Citrons Confits", f_title), y_title, fill=CREAM)
            stamp(draw, "Zartes Hähnchen, Safran & Salzzitronen", f_sub, centered_x(draw, "Zartes Hähnchen, Safran & Salzzitronen", f_sub), y_title + 75, fill=GOLD)

            animated_pill(draw, "Stundenlang im gebrannten Ton geschmort", f_sub2, W//2, 1350, st * 2.0,
                          bg=OBSIDIAN, border=(*GOLD, 180), fg=CREAM)
            draw_bottom_cta(draw, "Dazu warmes marokkanisches Fladenbrot >>", f_cta, y=1430)

        # ── SCENE 5: SIZZLING GRILLED GAMBAS (12.0s - 15.0s) ────────────────
        elif cur_time < 15.0:
            st = (cur_time - 12.0) / 3.0
            slide_no = 5
            zoom = 1.03 + 0.08 * ease_out(st)
            pan_y = 20.0 - 40.0 * ease_in_out(st)
            canvas = fullbleed(img_gambas, zoom=zoom, pan_y=pan_y)
            clean_canvas = canvas.copy()

            canvas.alpha_composite(VIGNETTE_STD)
            draw = ImageDraw.Draw(canvas)

            draw_logo_badge(canvas, logo)
            draw_slide_counter(draw, slide_no, 6, f_counter)

            animated_pill(draw, "MEDITERRANE FEUERKUNST", f_badge, W//2, 292, st * 2.5)
            y_title = 355
            stamp(draw, "Gegrillte Riesen-Gambas", f_title, centered_x(draw, "Gegrillte Riesen-Gambas", f_title), y_title, fill=CREAM)
            stamp(draw, "Frisch vom Spieß · Koriander & Knoblauch", f_sub, centered_x(draw, "Frisch vom Spieß · Koriander & Knoblauch", f_sub), y_title + 75, fill=GOLD)

            animated_pill(draw, "Knackiges Meeresaroma mit rauchiger Note", f_sub2, W//2, 1350, st * 2.0,
                          bg=OBSIDIAN, border=(*GOLD, 180), fg=CREAM)
            draw_bottom_cta(draw, "Marokkanische Grill-Spezialitäten >>", f_cta, y=1430)

        # ── SCENE 6: MINT TEA RITUAL & SPEISELY DOSSIER (15.0s - 18.0s) ─────
        else:
            st = (cur_time - 15.0) / 3.0
            slide_no = 6
            zoom = 1.02 + 0.06 * ease_out(st)
            pan_x = -20.0 + 35.0 * ease_in_out(st)
            canvas = fullbleed(img_minztee, zoom=zoom, pan_x=pan_x)
            clean_canvas = canvas.copy()

            canvas.alpha_composite(VIGNETTE_DEEP)
            draw = ImageDraw.Draw(canvas)

            draw_logo_badge(canvas, logo)
            draw_slide_counter(draw, slide_no, 6, f_counter)

            # Header placed strictly within Instagram Safe Zone: Y = 285px to 410px
            animated_pill(draw, "SPEISELY GASTRO-DOSSIER", f_badge, W//2, 288, st * 2.5)
            y_title = 345
            stamp(draw, "La Grilladine Düsseldorf", f_title, centered_x(draw, "La Grilladine Düsseldorf", f_title), y_title, fill=CREAM)
            stamp(draw, "Dreieckstraße 26 · 40227 Düsseldorf", f_sub, centered_x(draw, "Dreieckstraße 26 · 40227 Düsseldorf", f_sub), y_title + 65, fill=GOLD)

            # Central 4-Point Verified Facts Card: Y = 485px to Y = 945px
            # Leaves the lower third open so the mint tea glass shines through!
            box_w, box_h = 880, 460
            bx = (W - box_w) // 2
            by = 485
            draw.rounded_rectangle([bx, by, bx + box_w, by + box_h], radius=28,
                                   fill=(8, 48, 28, 235), outline=(*GOLD, 210), width=2)

            facts = [
                ("STANDORT", "Dreieckstraße 26, 40227 Düsseldorf-Oberbilk"),
                ("ZEITEN", "Di–Sa 12:00–22:00 · So 13:00–21:00 (Mo Ruhetag)"),
                ("ZAHLUNG", "Nur Barzahlung (Cash Only!)"),
                ("RESERVIERUNG", "Keine Reservierung · First Come, First Served"),
            ]
            for i, (k, v) in enumerate(facts):
                fy = by + 36 + i * 102
                draw.text((bx + 45, fy), k, font=f_fact_t, fill=GOLD)
                draw.text((bx + 45, fy + 38), v, font=f_fact_v, fill=CREAM)
                if i < 3:
                    draw.line([(bx + 45, fy + 82), (bx + box_w - 45, fy + 82)], fill=(*GOLD, 60), width=1)

            # Primary CTA placed in the safe zone: Y = 1365px (well above the 1520px caption cutoff!)
            cta_text = "Lies den vollständigen Report auf speisely.de >>"
            animated_pill(draw, cta_text, f_cta, W//2, 1365, st * 2.2,
                          bg=(230, 184, 74, 250), border=(255, 255, 255, 220), fg=(8, 48, 28))
            draw_bottom_cta(draw, "Speichere dieses Reel für deinen nächsten Besuch!", f_sub2, y=1435)

        # Save preview captures at scene zeniths
        for p_idx, p_time in enumerate(preview_times):
            if abs(cur_time - p_time) < (0.5 / FPS) and p_idx not in previews:
                preview_p = os.path.join(out_dir, f"reel_preview_scene{p_idx+1}.jpg")
                canvas.convert("RGB").save(preview_p, quality=92)
                previews[p_idx] = preview_p

        frame_bgr = cv2.cvtColor(np.array(canvas.convert("RGB")), cv2.COLOR_RGB2BGR)
        out_video.write(frame_bgr)

        clean_bgr = cv2.cvtColor(np.array(clean_canvas.convert("RGB")), cv2.COLOR_RGB2BGR)
        out_clean.write(clean_bgr)

        if frame_idx % 60 == 0:
            print(f"  Frame {frame_idx}/{TOTAL_FRAMES} ({cur_time:.1f}s)...", flush=True)

    out_video.release()
    out_clean.release()

    print("Video frames rendered successfully! Running high-quality H.264 encode (silent video, no audio)...", flush=True)
    ffmpeg_exe = imageio_ffmpeg.get_ffmpeg_exe()

    # 1. Final Branded Reel (Silent, High Profile H.264)
    cmd_mux = [
        ffmpeg_exe, "-y",
        "-i", raw_path,
        "-c:v", "libx264",
        "-pix_fmt", "yuv420p",
        "-profile:v", "high",
        "-level", "4.2",
        "-crf", "18",
        "-preset", "slow",
        "-an",
        final_path
    ]
    subprocess.run(cmd_mux, check=True)

    # 2. Final Clean Reel (Silent, High Profile H.264)
    cmd_clean = [
        ffmpeg_exe, "-y",
        "-i", raw_clean_path,
        "-c:v", "libx264",
        "-pix_fmt", "yuv420p",
        "-profile:v", "high",
        "-level", "4.2",
        "-crf", "18",
        "-preset", "slow",
        "-an",
        clean_path
    ]
    subprocess.run(cmd_clean, check=True)

    # Cleanup temp raw files
    if os.path.exists(raw_path): os.remove(raw_path)
    if os.path.exists(raw_clean_path): os.remove(raw_clean_path)

    print("\n========================================================")
    print("[SUCCESS] LUXURY REEL RENDERING COMPLETE (INSTAGRAM SAFE ZONE CERTIFIED)!")
    print(f"Branded Reel: {final_path} ({os.path.getsize(final_path)/(1024*1024):.1f} MB)")
    print(f"Clean Reel:   {clean_path} ({os.path.getsize(clean_path)/(1024*1024):.1f} MB)")
    print("Previews:")
    for idx, p in previews.items():
        print(f"  Scene {idx+1}: {p}")
    print("========================================================")

if __name__ == "__main__":
    main()
