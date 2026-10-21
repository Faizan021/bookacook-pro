"""
SEYDIOĞLU BAKLAVA BURGER — HIGH-PERFORMANCE LUXURY SPEISELY REEL v2.0
Compliant with Speisely Rule 12 & Rule 16 (Safe Zones & Visual Rubric)
100% Clean User Assets — Zero Third-Party Watermarks / Zero Play Buttons

Format: 1080 × 1920 @ 30fps, 16.8 seconds (504 frames)
Safe Zones:
- Top: Y 0 to 260px blank (Badges start at Y=285)
- Bottom: Y 1450 to 1920px blank of critical text/cards
- Right margin: text kept within X <= 940px
- Zero slide counters, zero horizontal swipe text, zero missing emoji boxes
"""

import os, math, shutil, subprocess
import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageFilter
import cv2
import imageio_ffmpeg

W, H = 1080, 1920
FPS = 30
DURATION = 16.8
TOTAL_FRAMES = int(DURATION * FPS)

# ─── DESIGN TOKENS ───────────────────────────────────────────────────────────
FOREST    = (8,   56,  34)       # #083822  Speisely Deep Forest
GOLD      = (230, 184,  74)      # #E6B84A  Speisely Gold
CREAM     = (246, 244, 235)      # #F6F4EB  Ivory Cream
OBSIDIAN  = (8,   18,  12, 235)  # #08120C  Frosted Obsidian Glass
SAGE_BG   = (235, 244, 236, 245) # Frosted sage pill bg
SAGE_LINE = (127, 164, 107, 220) # Frosted sage pill border
SAGE_TEXT = (24,  46,  34)       # Dark sage text

# ─── FONTS ───────────────────────────────────────────────────────────────────
F_GEORGIA_B = "C:/Windows/Fonts/georgiab.ttf"
F_GEORGIA_I = "C:/Windows/Fonts/georgiai.ttf"
F_GEORGIA   = "C:/Windows/Fonts/georgia.ttf"
F_ARIAL_B   = "C:/Windows/Fonts/arialbd.ttf"
F_ARIAL     = "C:/Windows/Fonts/arial.ttf"
F_BAHN      = "C:/Windows/Fonts/bahnschrift.ttf"
F_SEGOE_B   = "C:/Windows/Fonts/segoeuib.ttf"

def gf(path, size):
    try: return ImageFont.truetype(path, size)
    except: return ImageFont.load_default()

# ─── EASING ──────────────────────────────────────────────────────────────────
def ease_out(t):
    return 1 - (1 - t)**3

def ease_in_out(t):
    return 0.5 - 0.5 * math.cos(math.pi * t)

def elastic_out(t):
    c4 = (2 * math.pi) / 3
    if t <= 0: return 0
    if t >= 1: return 1
    return math.pow(2, -10*t) * math.sin((t*10 - 0.75) * c4) + 1

# ─── PRECOMPUTED VIGNETTES ───────────────────────────────────────────────────
def make_vignette(top_alpha=230, bottom_alpha=240, top_h=580, bot_h=560):
    v = Image.new("RGBA", (W, H), (0,0,0,0))
    d = ImageDraw.Draw(v)
    for y in range(top_h):
        a = int(top_alpha * math.pow(1 - y/top_h, 1.35))
        d.line([(0,y),(W,y)], fill=(FOREST[0], FOREST[1], FOREST[2], a))
    for y in range(H - bot_h, H):
        t = (y - (H - bot_h)) / bot_h
        a = int(bottom_alpha * math.pow(t, 1.30))
        d.line([(0,y),(W,y)], fill=(FOREST[0], FOREST[1], FOREST[2], a))
    return v

VIGNETTE_STD  = make_vignette(top_h=580, bot_h=560)
VIGNETTE_DEEP = make_vignette(top_alpha=245, bottom_alpha=255, top_h=640, bot_h=620)

def fullbleed(img, zoom=1.0, pan_x=0.0, pan_y=0.0):
    iw, ih = img.size
    scale = max(W / iw, H / ih) * zoom
    nw, nh = int(iw * scale), int(ih * scale)
    scaled = img.resize((nw, nh), Image.Resampling.BILINEAR)
    left = max(0, min(nw - W, int((nw - W) // 2 + pan_x)))
    top  = max(0, min(nh - H, int((nh - H) // 2 + pan_y)))
    return scaled.crop((left, top, left + W, top + H)).convert("RGBA")

def color_grade_image(img, tint=(8, 24, 15), exposure=0.96, saturation=1.16):
    arr = np.array(img.convert("RGB")).astype(np.float32)
    arr = np.clip(arr * exposure, 0, 255)
    gray = arr.mean(axis=2, keepdims=True)
    arr = gray + (arr - gray) * saturation
    t = np.array(tint, dtype=np.float32)
    arr = arr * 0.94 + t * 0.06
    return Image.fromarray(np.clip(arr, 0, 255).astype(np.uint8)).convert("RGB")

# ─── DRAWING HELPERS ─────────────────────────────────────────────────────────
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
                  bg=SAGE_BG, border=SAGE_LINE, fg=SAGE_TEXT):
    scale = min(1.0, elastic_out(t))
    bb = draw.textbbox((0,0), text, font=font)
    tw = bb[2]-bb[0]; th = bb[3]-bb[1]
    pw = int((tw + 48) * scale); ph = int((th + 20) * scale)
    if pw < 4 or ph < 4: return
    px = cx - pw//2; py = cy - ph//2
    draw.rounded_rectangle([px, py, px+pw, py+ph], radius=min(ph//2, 22), fill=bg, outline=border, width=2)
    if scale > 0.4:
        tx = px + (pw - int(tw*scale))//2
        ty = py + (ph - int(th*scale))//2
        alpha = min(255, int(255 * (scale - 0.4) / 0.6))
        col = (*fg[:3], alpha) if len(fg)==3 else (*fg, alpha)
        draw.text((tx, ty), text, font=font, fill=col)

def draw_bottom_highlight_pill(draw, text, font, y=1345):
    bb = draw.textbbox((0,0), text, font=font)
    tw = bb[2]-bb[0]; th = bb[3]-bb[1]
    px = (W - tw)//2 - 24; py = y - 10
    draw.rounded_rectangle([px, py, px+tw+48, py+th+20], radius=16,
                           fill=OBSIDIAN, outline=(255,255,255,80), width=1)
    draw.text(((W-tw)//2, y), text, font=font, fill=CREAM)

def draw_bottom_video_cta(draw, text, font, y=1420, fill=GOLD):
    x = centered_x(draw, text, font)
    draw.text((x+1, y+1), text, font=font, fill=(0,0,0,220))
    draw.text((x, y), text, font=font, fill=fill)

def draw_horizontal_gold_rule(draw, y, width=240, alpha=160):
    cx = W//2
    draw.line([(cx-width, y),(cx+width, y)], fill=(*GOLD, alpha), width=2)

# ─── MAIN GENERATOR ──────────────────────────────────────────────────────────
def main():
    workspace = r"c:\recoverd usb\Speisely Marketplace1"
    out_dir   = os.path.join(workspace, "public", "magazin", "seydioglu")
    scratch   = os.path.join(workspace, "scratch")
    os.makedirs(out_dir, exist_ok=True)
    os.makedirs(scratch, exist_ok=True)

    raw_path   = os.path.join(out_dir, "speisely_seydioglu_baklava_burger_reel_raw.mp4")
    final_path = os.path.join(out_dir, "speisely_seydioglu_baklava_burger_reel.mp4")
    clean_path = os.path.join(out_dir, "speisely_seydioglu_baklava_burger_reel_clean.mp4")
    audio_path = os.path.join(scratch, "turkish_elegance.mp3")

    print("Loading 100% clean source assets (zero watermark / zero play button)...", flush=True)
    layers_raw = Image.open(os.path.join(out_dir, "seydioglu_burger_layers.jpg"))
    pour_raw   = Image.open(os.path.join(out_dir, "seydioglu_pistachio_pour.jpg"))

    # Color grading
    img_layers = color_grade_image(layers_raw, tint=(10, 22, 14), exposure=0.96, saturation=1.20)
    img_pour   = color_grade_image(pour_raw,   tint=(5,  26, 16), exposure=0.98, saturation=1.25)

    logo_path = os.path.join(scratch, "speisely_circular_badge_perfect.png")
    logo = Image.open(logo_path).convert("RGBA") if os.path.exists(logo_path) else None

    # Typography
    f_huge    = gf(F_GEORGIA_B, 78)
    f_title   = gf(F_GEORGIA_B, 64)
    f_quote   = gf(F_GEORGIA_I, 32)
    f_sub     = gf(F_GEORGIA_I, 32)
    f_sub2    = gf(F_GEORGIA_I, 26)
    f_badge   = gf(F_ARIAL_B,   22)
    f_card_t  = gf(F_ARIAL_B,   24)
    f_card_b  = gf(F_ARIAL,     22)
    f_small   = gf(F_ARIAL_B,   20)
    f_cta     = gf(F_ARIAL_B,   24)
    f_brand   = gf(F_GEORGIA_B, 68)

    # 6 Scenes — All using 100% clean images (img_layers and img_pour)
    scenes = [
        (0.0,  2.8,  img_layers, "S1_HOOK"),
        (2.8,  5.8,  img_layers, "S2_ANATOMY"),
        (5.8,  9.0,  img_pour,   "S3_POUR"),
        (9.0,  12.0, img_pour,   "S4_VERDICT"),
        (12.0, 15.0, img_pour,   "S5_STANDORTE"),
        (15.0, 16.8, None,       "S6_OUTRO"),
    ]

    fourcc = cv2.VideoWriter_fourcc(*"mp4v")
    out = cv2.VideoWriter(raw_path, fourcc, FPS, (W, H))

    preview_times = [1.6, 4.4, 7.5, 10.5, 13.5, 16.0]
    preview_captures = {}

    print(f"Rendering {TOTAL_FRAMES} frames @ {FPS}fps (Speisely Masterclass Engine v2.0)...", flush=True)

    for fi in range(TOTAL_FRAMES):
        t = fi / FPS
        scene_idx = 0
        for i, (t0, t1, _, _) in enumerate(scenes):
            if t0 <= t < t1:
                scene_idx = i
                break
        t0, t1, bg_img, scene_id = scenes[scene_idx]
        scene_t = (t - t0) / (t1 - t0)

        # ─── BASE CANVAS ─────────────────────────────────────────────────────
        if scene_id == "S6_OUTRO":
            canvas = Image.new("RGBA", (W, H), (*FOREST, 255))
            draw = ImageDraw.Draw(canvas)
        elif scene_id == "S4_VERDICT":
            # Split composition: top pour, bottom burger layers (both 100% clean!)
            base_top = fullbleed(img_pour, zoom=1.10 + 0.03*scene_t, pan_y=-20)
            base_bot = fullbleed(img_layers, zoom=1.06 + 0.03*scene_t, pan_y=30)
            mask = Image.new("L", (W, H), 0)
            md = ImageDraw.Draw(mask)
            split_y = int(H * 0.44)
            md.polygon([(0,0),(W,0),(W,split_y-60),(0,split_y+60)], fill=255)
            base = Image.composite(base_top, base_bot, mask)
            bd = ImageDraw.Draw(base)
            bd.line([(0, split_y+60),(W, split_y-60)], fill=(*GOLD, 210), width=3)
            base = Image.alpha_composite(base, VIGNETTE_DEEP)
            canvas = base.copy()
            draw = ImageDraw.Draw(canvas)
        elif scene_id == "S5_STANDORTE":
            # Luxurious dark atmospheric background
            base = fullbleed(img_pour, zoom=1.12, pan_y=-10)
            base = Image.alpha_composite(base, VIGNETTE_DEEP)
            canvas = base.copy()
            draw = ImageDraw.Draw(canvas)
        else:
            zoom_base = 1.05 + 0.06 * scene_t
            pan_y_base = 0
            if scene_id == "S1_HOOK":
                zoom_base = 1.14 - 0.06 * ease_out(scene_t)
                pan_y_base = 15 * scene_t
            elif scene_id == "S2_ANATOMY":
                # Position burger nicely in center-upper area
                zoom_base = 1.08
                pan_y_base = -60
            elif scene_id == "S3_POUR":
                zoom_base = 1.12 - 0.04 * ease_out(scene_t)
                pan_y_base = -15 * ease_in_out(scene_t)

            base = fullbleed(bg_img, zoom=zoom_base, pan_y=pan_y_base)
            vign = VIGNETTE_DEEP if scene_id in ["S2_ANATOMY"] else VIGNETTE_STD
            base = Image.alpha_composite(base, vign)
            canvas = base.copy()
            draw = ImageDraw.Draw(canvas)

        # ─── SCENE GRAPHICS & TYPOGRAPHY ─────────────────────────────────────
        
        # ═════════════════════════════════════════════════════════════════════
        # SCENE 1: THE SENSATIONAL HOOK (0.0s – 2.8s)
        # ═════════════════════════════════════════════════════════════════════
        if scene_id == "S1_HOOK":
            if scene_t < 0.08:
                flash_a = int(210 * (1 - scene_t/0.08))
                canvas = Image.alpha_composite(canvas, Image.new("RGBA", (W,H), (255,255,255,flash_a)))
                draw = ImageDraw.Draw(canvas)

            # Top Badge (Y = 285px)
            p_prog = min(1.0, scene_t / 0.16)
            animated_pill(draw, "SPEISELY FOOD SPOTLIGHT // HESSEN", f_badge, W//2, 285, p_prog)

            # Headline (Y = 350, 435px)
            h_prog = min(1.0, max(0.0, (scene_t - 0.10) / 0.22))
            slide_up = int(30 * (1 - ease_out(h_prog)))
            al = int(255 * ease_out(h_prog))
            stamp(draw, "DER BAKLAVA", f_huge, centered_x(draw, "DER BAKLAVA", f_huge), 350 + slide_up, fill=(*CREAM[:3], al))
            stamp(draw, "BURGER", f_huge, centered_x(draw, "BURGER", f_huge), 435 + slide_up, fill=(*CREAM[:3], al))

            # Frosted Subtitle Container (Y = 530px)
            s_prog = min(1.0, max(0.0, (scene_t - 0.20) / 0.22))
            if s_prog > 0:
                sub_txt = "Süßes Fast-Food oder echte Meisterkunst?"
                bb = draw.textbbox((0,0), sub_txt, font=f_sub2)
                sw = bb[2]-bb[0]; sh = bb[3]-bb[1]
                sx = (W - sw)//2 - 20; sy = 530
                draw.rounded_rectangle([sx, sy, sx+sw+40, sy+sh+16], radius=14,
                                       fill=OBSIDIAN, outline=(*GOLD, int(180*s_prog)), width=1)
                draw.text(((W-sw)//2, sy + 8), sub_txt, font=f_sub2, fill=(*GOLD[:3], int(255*s_prog)))

            # Bottom Location & Video CTA (Y = 1345, 1420px)
            draw_bottom_highlight_pill(draw, "Seydioğlu Baklava · Frankfurt, Darmstadt & Rhein-Main", f_small, y=1345)
            draw_bottom_video_cta(draw, "Bleib dran für alle 3 Schichten »", f_cta, y=1420)

        # ═════════════════════════════════════════════════════════════════════
        # SCENE 2: ANATOMIE EINER FUSION (2.8s – 5.8s)
        # Burger is prominently displayed in center. 3 HUD Cards sit below at Y = 1040, 1140, 1240.
        # ═════════════════════════════════════════════════════════════════════
        elif scene_id == "S2_ANATOMY":
            # Top Badge (Y = 285px)
            p_prog = min(1.0, scene_t / 0.16)
            animated_pill(draw, "ANATOMIE EINER FUSION", f_badge, W//2, 285, p_prog)

            # Headline (Y = 350px)
            h_prog = min(1.0, max(0.0, (scene_t - 0.08) / 0.22))
            al = int(255 * ease_out(h_prog))
            stamp(draw, "3 SCHICHTEN PERFEKTION", f_title, centered_x(draw, "3 SCHICHTEN PERFEKTION", f_title), 350, fill=(*CREAM[:3], al))

            # 3 Stacked HUD Data Cards below the burger (Y = 1040, 1140, 1240)
            cards = [
                (0.08, "[ 01 · BUN ] 40 Schichten knuspriger Karamell-Teig", 1030),
                (0.24, "[ 02 · PATTY ] Echtes Maraş-Eis (Zäh & eiskalt)", 1130),
                (0.40, "[ 03 · CRUNCH ] Handverlesene Antep-Pistazien", 1230),
            ]
            for c_t, c_text, cy in cards:
                if scene_t >= c_t:
                    prog = min(1.0, (scene_t - c_t) / 0.18)
                    card_w = int(900 * ease_out(prog))
                    card_h = 72
                    cx = (W - card_w) // 2
                    if card_w > 40:
                        draw.rounded_rectangle([cx, cy, cx+card_w, cy+card_h], radius=14,
                                               fill=OBSIDIAN, outline=(*GOLD, int(190*ease_out(prog))), width=2)
                        # Text renders with opacity as card expands
                        txt_al = int(255 * ease_out(prog))
                        draw.text((cx + 28, cy + 22), c_text, font=f_card_t, fill=(*CREAM[:3], txt_al))

            # Video CTA (Y = 1420px)
            draw_bottom_video_cta(draw, "Jetzt kommt die heiße Pistazien-Lava »", f_cta, y=1420)

        # ═════════════════════════════════════════════════════════════════════
        # SCENE 3: DER SHOWSTOPPER / PISTAZIEN-LAVA (5.8s – 9.0s)
        # ═════════════════════════════════════════════════════════════════════
        elif scene_id == "S3_POUR":
            p_prog = min(1.0, scene_t / 0.16)
            animated_pill(draw, "DER SHOWSTOPPER // POUR-MOMENT", f_badge, W//2, 285, p_prog,
                          bg=(245, 235, 205, 245), border=(*GOLD, 230), fg=(30, 22, 10))

            h_prog = min(1.0, max(0.0, (scene_t - 0.08) / 0.22))
            al = int(255 * ease_out(h_prog))
            stamp(draw, "PISTAZIEN-LAVA", f_huge, centered_x(draw, "PISTAZIEN-LAVA", f_huge), 350, fill=(*CREAM[:3], al))
            stamp(draw, "GLASUR", f_huge, centered_x(draw, "GLASUR", f_huge), 435, fill=(*CREAM[:3], al))

            # Contrast Badge (Y = 535px)
            c_prog = min(1.0, max(0.0, (scene_t - 0.24) / 0.22))
            if c_prog > 0:
                cw = 620; ch = 52
                cx = (W - cw)//2; cy = 535
                draw.rounded_rectangle([cx, cy, cx+cw, cy+ch], radius=26,
                                       fill=OBSIDIAN, outline=(*GOLD, int(200*c_prog)), width=2)
                ctxt = "EISKALT (-12°C) trifft WARM (+45°C)"
                draw.text((centered_x(draw, ctxt, f_small), cy + 15), ctxt, font=f_small, fill=(*GOLD[:3], int(255*c_prog)))

            # Bottom Pill & Video CTA
            draw_bottom_highlight_pill(draw, "Samtig, intensiv nussig & perfekt ausbalanciert", f_small, y=1345)
            draw_bottom_video_cta(draw, "Heiß & Eiskalt gleichzeitig erleben »", f_cta, y=1420)

        # ═════════════════════════════════════════════════════════════════════
        # SCENE 4: DAS GASTRONOMIE-URTEIL (9.0s – 12.0s)
        # ═════════════════════════════════════════════════════════════════════
        elif scene_id == "S4_VERDICT":
            p_prog = min(1.0, scene_t / 0.16)
            animated_pill(draw, "SPEISELY REDAKTIONS-URTEIL", f_badge, W//2, 285, p_prog)

            h_prog = min(1.0, max(0.0, (scene_t - 0.08) / 0.22))
            al = int(255 * ease_out(h_prog))
            stamp(draw, "DAS URTEIL: 9.8 / 10", f_title, centered_x(draw, "DAS URTEIL: 9.8 / 10", f_title), 350, fill=(*CREAM[:3], al))

            # Central Frosted Dossier Card (Y = 460 to 920px)
            prog = min(1.0, max(0.0, (scene_t - 0.16) / 0.25))
            card_w = int(900 * ease_out(prog)); card_h = 440
            cx = (W - card_w) // 2; cy = 460
            if card_w > 40:
                draw.rounded_rectangle([cx, cy, cx+card_w, cy+card_h], radius=20,
                                       fill=OBSIDIAN, outline=(*GOLD, int(210*ease_out(prog))), width=2)
                if prog > 0.4:
                    txt_al = int(255 * (prog - 0.4) / 0.6)
                    quote_lines = [
                        "» Mehr als nur ein viraler Food-Trend:",
                        "Die herbe Tiefe der Gaziantep-Pistazie,",
                        "das zart schmelzende Maraş-Dondurma",
                        "und 40 hauchdünne Teigblätter ergeben",
                        "ein echtes kulinarisches Meisterstück. «"
                    ]
                    qy = cy + 45
                    for ql in quote_lines:
                        draw.text((cx + 50, qy), ql, font=f_quote, fill=(*CREAM[:3], txt_al))
                        qy += 58

                    draw_horizontal_gold_rule(draw, cy + 360, width=200, alpha=int(140*txt_al/255))
                    sig = "— Speisely Redaktions-Test · Verifiziert 2026"
                    draw.text((centered_x(draw, sig, f_small), cy + 380), sig, font=f_small, fill=(*GOLD[:3], txt_al))

            # Bottom Pill & Video CTA
            draw_bottom_highlight_pill(draw, "Getestet & verifiziert im Rhein-Main-Gebiet", f_small, y=1345)
            draw_bottom_video_cta(draw, "Hier kannst du ihn probieren »", f_cta, y=1420)

        # ═════════════════════════════════════════════════════════════════════
        # SCENE 5: 7 STANDORTE & INFOS (12.0s – 15.0s)
        # ═════════════════════════════════════════════════════════════════════
        elif scene_id == "S5_STANDORTE":
            p_prog = min(1.0, scene_t / 0.16)
            animated_pill(draw, "SPEISELY VERIFIED // 7 STANDORTE", f_badge, W//2, 285, p_prog)

            h_prog = min(1.0, max(0.0, (scene_t - 0.08) / 0.22))
            al = int(255 * ease_out(h_prog))
            stamp(draw, "SEYDIOĞLU", f_huge, centered_x(draw, "SEYDIOĞLU", f_huge), 350, fill=(*CREAM[:3], al))
            stamp(draw, "BAKLAVA", f_huge, centered_x(draw, "BAKLAVA", f_huge), 435, fill=(*CREAM[:3], al))

            # Central Location Dossier (Y = 530 to 980px)
            prog = min(1.0, max(0.0, (scene_t - 0.16) / 0.25))
            card_w = int(900 * ease_out(prog)); card_h = 440
            cx = (W - card_w) // 2; cy = 530
            if card_w > 40:
                draw.rounded_rectangle([cx, cy, cx+card_w, cy+card_h], radius=20,
                                       fill=OBSIDIAN, outline=(*GOLD, int(210*ease_out(prog))), width=2)
                if prog > 0.4:
                    txt_al = int(255 * (prog - 0.4) / 0.6)
                    rows = [
                        ("[ STÄDTE ]", "Frankfurt · Darmstadt · Wiesbaden · Mannheim"),
                        ("[ WEITERE ]", "Offenbach · Hanau · Worms"),
                        ("[ QUALITÄT ]", "Täglich frisch aus der Meister-Backstube"),
                        ("[ EMPFEHLUNG ]", "Immer mit heißem türkischen Çay servieren"),
                    ]
                    ry = cy + 40
                    for tag, val in rows:
                        draw.text((cx + 45, ry), tag, font=f_card_t, fill=(*GOLD[:3], txt_al))
                        draw.text((cx + 45, ry + 36), val, font=f_card_b, fill=(*CREAM[:3], txt_al))
                        ry += 95

            # Bottom Save Post Pill (Y = 1345, 1420px)
            draw_bottom_highlight_pill(draw, "SPEICHERE DIESEN POST FÜR DEINEN BESUCH »", f_cta, y=1345)
            draw_bottom_video_cta(draw, "Markiere jemanden, der diesen Burger probieren muss!", f_small, y=1420, fill=CREAM)

        # ═════════════════════════════════════════════════════════════════════
        # SCENE 6: MANDATORY SPEISELY BRAND SEAL OUTRO (15.0s – 16.8s)
        # ═════════════════════════════════════════════════════════════════════
        elif scene_id == "S6_OUTRO":
            pulse = 1.0 + 0.04 * math.sin(scene_t * math.pi * 2)
            logo_sz = int(160 * pulse)
            if logo:
                l = logo.resize((logo_sz, logo_sz), Image.Resampling.BILINEAR)
                canvas.paste(l, ((W - logo_sz)//2, 600 - (logo_sz-160)//2), l)

            brand_txt = "S P E I S E L Y"
            stamp(draw, brand_txt, f_brand, centered_x(draw, brand_txt, f_brand), 810, fill=CREAM)

            sub = "Verifizierte Gastro-Kultur · Hessen"
            draw.text((centered_x(draw, sub, f_sub), 895), sub, font=f_sub, fill=GOLD)

            draw_horizontal_gold_rule(draw, 960, width=220, alpha=180)

            cta1 = "Folge @speisely für echten Genuss"
            draw.text((centered_x(draw, cta1, f_cta), 1350), cta1, font=f_cta, fill=CREAM)

            web = "www.speisely.de"
            draw.text((centered_x(draw, web, f_small), 1415), web, font=f_small, fill=GOLD)

        # ─── PREVIEW CAPTURES AT ZENITHS ─────────────────────────────────────
        for p_idx, pt in enumerate(preview_times):
            if abs(t - pt) < (0.5 / FPS) and p_idx not in preview_captures:
                preview_captures[p_idx] = canvas.convert("RGB")
                p_path = os.path.join(scratch, f"seydioglu_preview_{p_idx+1:02d}.jpg")
                canvas.convert("RGB").save(p_path, quality=95)
                canvas.convert("RGB").save(os.path.join(out_dir, f"seydioglu_preview_{p_idx+1:02d}.jpg"), quality=95)
                print(f"Captured preview {p_idx+1}/6 at t={t:.2f}s -> {p_path}", flush=True)

        frame_bgr = cv2.cvtColor(np.array(canvas.convert("RGB")), cv2.COLOR_RGB2BGR)
        out.write(frame_bgr)

    out.release()
    print("Video frame generation completed successfully!", flush=True)

    # ─── FFMPEG MUXING ───────────────────────────────────────────────────────
    print("Muxing final video with audio via ffmpeg...", flush=True)
    ffmpeg_exe = imageio_ffmpeg.get_ffmpeg_exe()

    # Clean version
    cmd_clean = [
        ffmpeg_exe, "-y",
        "-i", raw_path,
        "-c:v", "libx264",
        "-pix_fmt", "yuv420p",
        "-preset", "fast",
        "-crf", "19",
        clean_path
    ]
    subprocess.run(cmd_clean, check=True)
    print(f"Clean reel saved: {clean_path}", flush=True)

    # Audio version (with turkish_elegance.mp3)
    if os.path.exists(audio_path):
        cmd_audio = [
            ffmpeg_exe, "-y",
            "-i", raw_path,
            "-i", audio_path,
            "-c:v", "libx264",
            "-pix_fmt", "yuv420p",
            "-preset", "fast",
            "-crf", "19",
            "-c:a", "aac",
            "-b:a", "192k",
            "-shortest",
            final_path
        ]
        subprocess.run(cmd_audio, check=True)
        print(f"Master reel with music saved: {final_path}", flush=True)
    else:
        shutil.copy2(clean_path, final_path)

    # ─── COPY TO DESKTOP AND DOWNLOADS ───────────────────────────────────────
    desktop = os.path.expanduser(r"~\OneDrive\Desktop")
    if not os.path.exists(desktop):
        desktop = os.path.expanduser(r"~\Desktop")
    downloads = os.path.expanduser(r"~\Downloads")

    for dest in [desktop, downloads]:
        if os.path.exists(dest):
            try:
                shutil.copy2(final_path, os.path.join(dest, "speisely_seydioglu_baklava_burger_reel.mp4"))
                shutil.copy2(clean_path, os.path.join(dest, "speisely_seydioglu_baklava_burger_reel_clean.mp4"))
                print(f"Exported to {dest} successfully!", flush=True)
            except Exception as e:
                print(f"Could not copy to {dest}: {e}")

if __name__ == "__main__":
    main()
