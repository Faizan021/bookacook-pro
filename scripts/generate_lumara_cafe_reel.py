"""
LUMARA CAFÉ BERLIN — 10/10 VIRAL CREATOR MASTERCLASS REEL
Creative Direction: High-Impact Food Hook, Vertical Tilt-Up Pan & Scan, Correct Typography & Luxury Brand Seal Outro
Format: 1080 x 1920 @ 30fps (9:16 Vertical Instagram Reel), 17.0 seconds (510 frames)
Audio: Silent (ready for native Instagram trending sound overlay)
UI Architecture: Strictly adheres to Instagram 9:16 App Interface Safe Zones (Rule 16)
  - Top 0 - 260px: Pure visual buffer for Instagram status bar, profile avatar, handle & audio marquee
  - Bottom 1520 - 1920px: Pure visual buffer for Instagram caption, like/share icons & audio sticker
  - Safe Content Canvas: Y = 280px to Y = 1450px
"""

import os, math, subprocess
import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageFilter
import cv2
import imageio_ffmpeg

W, H = 1080, 1920
FPS = 30
DURATION = 17.0
TOTAL_FRAMES = int(DURATION * FPS)

# Design Tokens
FOREST    = (8,   56,  34)       # #083822  Speisely Deep Forest
GOLD      = (230, 184,  74)      # #E6B84A  Speisely Gold
CREAM     = (246, 244, 235)      # #F6F4EB  Ivory Cream
OBSIDIAN  = (6,   14,   9,  245) # near-black with alpha
RED_PILL  = (190,  30,  30, 240) # accent red
SAGE_PILL = (235, 244, 236, 250) # frosted sage

# Font Paths
F_GEORGIA_B = "C:/Windows/Fonts/georgiab.ttf"
F_GEORGIA_I = "C:/Windows/Fonts/georgiai.ttf"
F_ARIAL_B   = "C:/Windows/Fonts/arialbd.ttf"
F_ARIAL     = "C:/Windows/Fonts/arial.ttf"

def gf(path, size):
    try: return ImageFont.truetype(path, size)
    except: return ImageFont.load_default()

# Easing Functions
def ease_out(t):     return 1 - (1 - t)**3
def ease_in_out(t):  return 0.5 - 0.5 * math.cos(math.pi * t)
def elastic_out(t):
    c4 = (2 * math.pi) / 3
    if t <= 0: return 0
    if t >= 1: return 1
    return math.pow(2, -10*t) * math.sin((t*10 - 0.75) * c4) + 1

# Safe Zone Vignette Overlays
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
VIGNETTE_DEEP = make_vignette_overlay(top_h=660, bot_h=700)

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

def draw_logo_badge(canvas, logo, x=65, y=275, size=62):
    if logo:
        l = logo.resize((size,size), Image.Resampling.BILINEAR)
        canvas.paste(l, (x, y), l)

def draw_bottom_pill_cta(draw, text, font, cy=1430, bg=(15, 25, 20, 200), fg=GOLD, border=(230, 184, 74, 180)):
    bb = draw.textbbox((0,0), text, font=font)
    tw = bb[2]-bb[0]; th = bb[3]-bb[1]
    pw = tw + 40; ph = th + 16
    px = (W - pw) // 2; py = cy - ph // 2
    draw.rounded_rectangle([px, py, px + pw, py + ph], radius=ph//2, fill=bg, outline=border, width=1)
    tx = (W - tw) // 2; ty = py + 7
    draw.text((tx, ty), text, font=font, fill=fg)

def main():
    workspace = r"c:\recoverd usb\Speisely Marketplace1"
    out_dir   = os.path.join(workspace, "public", "magazin", "lumara-cafe-berlin")
    os.makedirs(out_dir, exist_ok=True)

    raw_path       = os.path.join(out_dir, "lumara_cafe_speisely_reel_raw.mp4")
    final_path     = os.path.join(out_dir, "lumara_cafe_speisely_reel.mp4")
    clean_path     = os.path.join(out_dir, "lumara_cafe_speisely_reel_clean.mp4")
    raw_clean_path = os.path.join(out_dir, "lumara_cafe_speisely_reel_clean_raw.mp4")

    print("[INFO] Loading high-resolution Lumara Cafe assets...", flush=True)

    img_toast_raw    = Image.open(os.path.join(out_dir, "lumara_table_spread.webp")).convert("RGB")
    img_interior_raw = Image.open(os.path.join(out_dir, "lumara_interior_space.webp")).convert("RGB")
    img_benedict_raw = Image.open(os.path.join(out_dir, "lumara_benedict_avotoast.webp")).convert("RGB")
    img_hummus_raw   = Image.open(os.path.join(out_dir, "lumara_hummus_plate.webp")).convert("RGB")
    img_coffee_raw   = Image.open(os.path.join(out_dir, "lumara_latte_art.webp")).convert("RGB")

    # High-end color grading (Mediterranean Warmth & Vibrancy)
    img_toast    = color_grade_image(img_toast_raw,    tint=(25, 15, 10), exposure=0.96, saturation=1.18)
    img_interior = color_grade_image(img_interior_raw, tint=(25, 18,  8), exposure=0.96, saturation=1.12)
    img_benedict = color_grade_image(img_benedict_raw, tint=(22, 16,  6), exposure=0.95, saturation=1.15)
    img_hummus   = color_grade_image(img_hummus_raw,   tint=(18, 14,  6), exposure=0.95, saturation=1.14)
    img_coffee   = color_grade_image(img_coffee_raw,   tint=(15, 12,  8), exposure=0.95, saturation=1.12)

    # Blurred background for Scene 6 Gastro Dossier to guarantee 100% legibility
    img_interior_blur = img_interior.filter(ImageFilter.GaussianBlur(radius=18))

    logo_path = os.path.join(workspace, "scratch", "speisely_circular_badge_perfect.png")
    logo = Image.open(logo_path).convert("RGBA") if os.path.exists(logo_path) else None

    # Typography tuned for Instagram 9:16 Safe Zones & Editorial Prestige
    f_huge    = gf(F_GEORGIA_B, 76)
    f_title   = gf(F_GEORGIA_B, 56)
    f_sub     = gf(F_GEORGIA_I, 30)
    f_sub2    = gf(F_GEORGIA_I, 26)
    f_badge   = gf(F_ARIAL_B,   22)
    f_fact_t  = gf(F_ARIAL_B,   25)
    f_fact_v  = gf(F_ARIAL,     22)
    f_cta     = gf(F_ARIAL_B,   26)
    f_outro_h = gf(F_GEORGIA_B, 64)
    f_outro_s = gf(F_GEORGIA_I, 28)

    fourcc = cv2.VideoWriter_fourcc(*"mp4v")
    out_video = cv2.VideoWriter(raw_path, fourcc, FPS, (W, H))
    out_clean = cv2.VideoWriter(raw_clean_path, fourcc, FPS, (W, H))

    preview_times = [1.1, 3.3, 5.6, 8.0, 10.3, 13.2, 16.0]
    previews = {}

    print(f"[INFO] Rendering {TOTAL_FRAMES} frames @ {FPS}fps (7-Scene Creator Masterclass)...", flush=True)

    for frame_idx in range(TOTAL_FRAMES):
        cur_time = frame_idx / FPS

        # ── SCENE 1: THE FOOD HOOK (0.0s - 2.2s = 66 frames) ─────────────────
        # Thumb-stopping mouth-watering Tiramisu French Toast tower & berries!
        if cur_time < 2.2:
            st = cur_time / 2.2
            zoom = 1.05 + 0.12 * ease_out(st)
            pan_y = 40.0 - 60.0 * ease_in_out(st)
            canvas = fullbleed(img_toast, zoom=zoom, pan_y=pan_y)
            clean_canvas = canvas.copy()

            canvas.alpha_composite(VIGNETTE_STD)
            draw = ImageDraw.Draw(canvas)
            draw_logo_badge(canvas, logo)

            animated_pill(draw, "BERLIN-CHARLOTTENBURG · SAVIGNYPLATZ", f_badge, W//2, 292, st * 2.5)
            y_title = 355
            stamp(draw, "Lumara Café", f_huge, centered_x(draw, "Lumara Café", f_huge), y_title, fill=CREAM)
            stamp(draw, "Berlins neuer mediterraner Brunch-Hotspot", f_sub, centered_x(draw, "Berlins neuer mediterraner Brunch-Hotspot", f_sub), y_title + 85, fill=GOLD)

            animated_pill(draw, "Samtiger Hummus, Brioche-Türme & Specialty Coffee", f_sub2, W//2, 1350, st * 2.0,
                          bg=OBSIDIAN, border=(*GOLD, 180), fg=CREAM)
            draw_bottom_pill_cta(draw, "Bleib dran für alle Highlights »", f_cta, cy=1430)

        # ── SCENE 2: THE SANCTUARY & ATMOSPHERE (2.2s - 4.4s = 66 frames) ────
        # Smooth upward tilt revealing the lit terracotta arches & olive tree
        elif cur_time < 4.4:
            st = (cur_time - 2.2) / 2.2
            zoom = 1.02 + 0.07 * ease_out(st)
            pan_y = 60.0 - 90.0 * ease_in_out(st)
            canvas = fullbleed(img_interior, zoom=zoom, pan_y=pan_y)
            clean_canvas = canvas.copy()

            canvas.alpha_composite(VIGNETTE_STD)
            draw = ImageDraw.Draw(canvas)
            draw_logo_badge(canvas, logo)

            animated_pill(draw, "DAS REFUGIUM · KNESEBECKSTRASSE 29", f_badge, W//2, 292, st * 2.5)
            y_title = 355
            stamp(draw, "Mediterrane Oase", f_title, centered_x(draw, "Mediterrane Oase", f_title), y_title, fill=CREAM)
            stamp(draw, "Warme Terrakotta-Bögen & lichtdurchfluteter Raum", f_sub, centered_x(draw, "Warme Terrakotta-Bögen & lichtdurchfluteter Raum", f_sub), y_title + 75, fill=GOLD)

            animated_pill(draw, "Entspanntes Savignyplatz-Flair fernab der Hektik", f_sub2, W//2, 1350, st * 2.0,
                          bg=OBSIDIAN, border=(*GOLD, 180), fg=CREAM)
            draw_bottom_pill_cta(draw, "Ein Kurzurlaub am Morgen »", f_cta, cy=1430)

        # ── SCENE 3: THE SAVORY CRAFT (4.4s - 6.8s = 72 frames) ──────────────
        # CINEMATIC TILT-UP: Starts at Avocado Sourdough, smoothly tilts up to the poached egg!
        elif cur_time < 6.8:
            st = (cur_time - 4.4) / 2.4
            zoom = 1.04 + 0.06 * ease_out(st)
            # Tilt from bottom toast (pan_y = 120px) up to top poached egg (pan_y = -80px)
            pan_y = 120.0 - 200.0 * ease_in_out(st)
            canvas = fullbleed(img_benedict, zoom=zoom, pan_y=pan_y)
            clean_canvas = canvas.copy()

            canvas.alpha_composite(VIGNETTE_STD)
            draw = ImageDraw.Draw(canvas)
            draw_logo_badge(canvas, logo)

            animated_pill(draw, "DER GOLDENE SCHNITT · BIO-FREILANDEIER", f_badge, W//2, 292, st * 2.5)
            y_title = 355
            stamp(draw, "Eggs Benedict & Sauerteig", f_title, centered_x(draw, "Eggs Benedict & Sauerteig", f_title), y_title, fill=CREAM)
            stamp(draw, "Pochierte Freilandeier · Samtige Hollandaise", f_sub, centered_x(draw, "Pochierte Freilandeier · Samtige Hollandaise", f_sub), y_title + 75, fill=GOLD)

            animated_pill(draw, "Geröstetes Sauerteigbrot mit cremiger Avocado", f_sub2, W//2, 1350, st * 2.0,
                          bg=OBSIDIAN, border=(*GOLD, 180), fg=CREAM)
            draw_bottom_pill_cta(draw, "Perfekt fließender Dotter-Moment »", f_cta, cy=1430)

        # ── SCENE 4: THE LEVANTINE SOUL (6.8s - 9.2s = 72 frames) ────────────
        # Swirling texture drift over artisanal hummus, pomegranate & sumac
        elif cur_time < 9.2:
            st = (cur_time - 6.8) / 2.4
            zoom = 1.04 + 0.08 * ease_out(st)
            pan_x = -30.0 + 60.0 * ease_in_out(st)
            pan_y = -15.0 + 30.0 * ease_in_out(st)
            canvas = fullbleed(img_hummus, zoom=zoom, pan_x=pan_x, pan_y=pan_y)
            clean_canvas = canvas.copy()

            canvas.alpha_composite(VIGNETTE_STD)
            draw = ImageDraw.Draw(canvas)
            draw_logo_badge(canvas, logo)

            animated_pill(draw, "DIE LEVANTINISCHE SEELE · MEZZE-KUNST", f_badge, W//2, 292, st * 2.5,
                          bg=RED_PILL, border=(255,120,120,240), fg=(255,255,255))
            y_title = 355
            stamp(draw, "Samtiger Kichererbsen-Hummus", f_title, centered_x(draw, "Samtiger Kichererbsen-Hummus", f_title), y_title, fill=CREAM)
            stamp(draw, "Mit Granatapfel, Sumach & ofenfrischem Lavabrot", f_sub, centered_x(draw, "Mit Granatapfel, Sumach & ofenfrischem Lavabrot", f_sub), y_title + 75, fill=GOLD)

            animated_pill(draw, "Traditionell geschlagen · Hauchfeine Sesampaste", f_sub2, W//2, 1350, st * 2.0,
                          bg=OBSIDIAN, border=(*GOLD, 180), fg=CREAM)
            draw_bottom_pill_cta(draw, "Dampfendes Fladenbrot frisch aus dem Ofen »", f_cta, cy=1430)

        # ── SCENE 5: SPECIALTY COFFEE & CEREMONIAL MATCHA (9.2s - 11.4s = 66 frames)
        # Macro silky push-in on tulip latte art on marble
        elif cur_time < 11.4:
            st = (cur_time - 9.2) / 2.2
            zoom = 1.03 + 0.08 * ease_out(st)
            pan_y = 15.0 - 30.0 * ease_in_out(st)
            canvas = fullbleed(img_coffee, zoom=zoom, pan_y=pan_y)
            clean_canvas = canvas.copy()

            canvas.alpha_composite(VIGNETTE_STD)
            draw = ImageDraw.Draw(canvas)
            draw_logo_badge(canvas, logo)

            animated_pill(draw, "SPECIALTY COFFEE & MATCHA-KULTUR", f_badge, W//2, 292, st * 2.5)
            y_title = 355
            stamp(draw, "Handwerk in der Tasse", f_title, centered_x(draw, "Handwerk in der Tasse", f_title), y_title, fill=CREAM)
            stamp(draw, "Cremiger Flat White · Seidiger Iced Matcha", f_sub, centered_x(draw, "Cremiger Flat White · Seidiger Iced Matcha", f_sub), y_title + 75, fill=GOLD)

            animated_pill(draw, "Präzise Röstungen & samtige Barista-Milch", f_sub2, W//2, 1350, st * 2.0,
                          bg=OBSIDIAN, border=(*GOLD, 180), fg=CREAM)
            draw_bottom_pill_cta(draw, "Der vollendete Begleiter zum Brunch »", f_cta, cy=1430)

        # ── SCENE 6: SPEISELY GASTRO-DOSSIER (11.4s - 15.0s = 108 frames -> 3.6s) ──
        # Generous reading time with blurred atmospheric interior backdrop!
        elif cur_time < 15.0:
            st = (cur_time - 11.4) / 3.6
            zoom = 1.01 + 0.04 * ease_out(st)
            canvas = fullbleed(img_interior_blur, zoom=zoom)
            clean_canvas = canvas.copy()

            canvas.alpha_composite(VIGNETTE_DEEP)
            draw = ImageDraw.Draw(canvas)
            draw_logo_badge(canvas, logo)

            animated_pill(draw, "SPEISELY GASTRO-DOSSIER", f_badge, W//2, 288, st * 2.5)
            y_title = 345
            stamp(draw, "Lumara Café Berlin", f_title, centered_x(draw, "Lumara Café Berlin", f_title), y_title, fill=CREAM)
            stamp(draw, "Knesebeckstraße 29 · 10623 Berlin", f_sub, centered_x(draw, "Knesebeckstraße 29 · 10623 Berlin", f_sub), y_title + 65, fill=GOLD)

            # Central 4-Point Verified Facts Card: Y = 485px to Y = 945px
            box_w, box_h = 880, 460
            bx = (W - box_w) // 2
            by = 485
            draw.rounded_rectangle([bx, by, bx + box_w, by + box_h], radius=28,
                                   fill=(8, 48, 28, 240), outline=(*GOLD, 210), width=2)

            facts = [
                ("STANDORT", "Knesebeckstraße 29, 10623 Berlin-Charlottenburg"),
                ("ZEITEN", "Montag bis Sonntag: 09:00 – 17:00 Uhr"),
                ("KÜCHE", "Mediterran · Levantinisch · Halal-freundlich"),
                ("HIGHLIGHTS", "Samtiger Hummus, Lavabrot & Tiramisu Brioche"),
            ]
            for i, (k, v) in enumerate(facts):
                fy = by + 36 + i * 102
                draw.text((bx + 45, fy), k, font=f_fact_t, fill=GOLD)
                draw.text((bx + 45, fy + 38), v, font=f_fact_v, fill=CREAM)
                if i < 3:
                    draw.line([(bx + 45, fy + 82), (bx + box_w - 45, fy + 82)], fill=(*GOLD, 60), width=1)

            # Primary CTA placed in the safe zone: Y = 1365px
            cta_text = "Lies den vollständigen Report auf speisely.de"
            animated_pill(draw, cta_text, f_cta, W//2, 1365, st * 2.2,
                          bg=(230, 184, 74, 250), border=(255, 255, 255, 220), fg=(8, 48, 28))
            draw_bottom_pill_cta(draw, "Speichere dieses Reel für deinen nächsten Besuch! »", f_sub2, cy=1435)

        # ── SCENE 7: THE LUXURY SPEISELY BRAND SEAL OUTRO (15.0s - 17.0s = 60 frames = 2.0s) ──
        # Pure Speisely Deep Forest Green & Gold Seal Authority Sting
        else:
            st = (cur_time - 15.0) / 2.0
            canvas = Image.new("RGBA", (W, H), (FOREST[0], FOREST[1], FOREST[2], 255))
            clean_canvas = canvas.copy()
            draw = ImageDraw.Draw(canvas)

            # Subtle radial vignette
            vignette = Image.new("RGBA", (W, H), (0, 0, 0, 0))
            vd = ImageDraw.Draw(vignette)
            for r in range(400, 950, 15):
                alpha = int(120 * ((r - 400) / 550))
                vd.rectangle([0, 0, W, H], outline=(0, 0, 0, alpha), width=15)
            canvas.alpha_composite(vignette)

            # Center Speisely Circular Emblem (160x160 with breathing pulse)
            seal_size = int(160 + 10 * math.sin(st * math.pi))
            if logo:
                l = logo.resize((seal_size, seal_size), Image.Resampling.BILINEAR)
                canvas.paste(l, ((W - seal_size) // 2, 620), l)

            # Iconic Brand Typography
            stamp(draw, "S P E I S E L Y", f_outro_h, centered_x(draw, "S P E I S E L Y", f_outro_h), 820, fill=CREAM)
            stamp(draw, "Verifizierte Gastro-Kultur · Berlin", f_outro_s, centered_x(draw, "Verifizierte Gastro-Kultur · Berlin", f_outro_s), 915, fill=GOLD)

            # Instagram Follow & Bookmark Trigger Pill (Safe Zone Y = 1380px)
            animated_pill(draw, "Folge @speisely für die besten Food-Spots in Berlin", f_cta, W//2, 1380, st * 2.5,
                          bg=OBSIDIAN, border=(*GOLD, 220), fg=CREAM)

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

    print("[INFO] Video frames rendered! Running high-quality H.264 encode (silent video, no audio)...", flush=True)
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
    print("[SUCCESS] 10/10 CREATOR MASTERCLASS REEL COMPLETE!")
    print(f"Branded Reel: {final_path} ({os.path.getsize(final_path)/(1024*1024):.1f} MB)")
    print(f"Clean Reel:   {clean_path} ({os.path.getsize(clean_path)/(1024*1024):.1f} MB)")
    print("Previews:")
    for idx, p in previews.items():
        print(f"  Scene {idx+1}: {p}")
    print("========================================================")

if __name__ == "__main__":
    main()
