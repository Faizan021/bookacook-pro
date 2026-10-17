"""
NADIR GÜLLÜ MÜNCHEN — HIGH-PERFORMANCE LUXURY KINETIC REEL v2.1
Creative Direction: Luxury Kinetic Reveal (Eyecatching & High-Engagement)
Improvements:
- ZERO side-striping: full 1080px width brilliant food imagery with subtle top/bottom text-protection vignettes
- Instant punchy typography: titles appear within 0.15s of each cut (no awkward delays)
- 6 rich cinematic scenes with animated counters, gold badges, red alert, and conversion CTA
- Perfectly timed preview captures at scene zeniths
Format: 1080 × 1920 @ 30fps, 18.0 seconds
"""

import os, math, shutil, subprocess
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
RED_PILL  = (190,  30,  30, 240) # warning red
SAGE_PILL = (235, 244, 236, 250) # frosted sage

# ─── FONT PATHS ──────────────────────────────────────────────────────────────
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
def ease_out(t):     return 1 - (1 - t)**3
def ease_in_out(t):  return 0.5 - 0.5 * math.cos(math.pi * t)
def elastic_out(t):
    c4 = (2 * math.pi) / 3
    if t <= 0: return 0
    if t >= 1: return 1
    return math.pow(2, -10*t) * math.sin((t*10 - 0.75) * c4) + 1

# ─── PURE TOP/BOTTOM VIGNETTE (ZERO SIDE STRIPING) ───────────────────────────
def make_vignette_overlay(top_alpha=215, bottom_alpha=235, top_h=460, bot_h=440):
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

VIGNETTE_STD  = make_vignette_overlay(top_h=460, bot_h=440)
VIGNETTE_DEEP = make_vignette_overlay(top_h=560, bot_h=540)

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
    arr = arr * 0.93 + t * 0.07
    return Image.fromarray(np.clip(arr, 0, 255).astype(np.uint8)).convert("RGB")

# ─── TEXT & GRAPHICS HELPERS ────────────────────────────────────────────────
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

def draw_logo_badge(canvas, logo, x=40, y=40, size=72):
    if logo:
        l = logo.resize((size,size), Image.Resampling.BILINEAR)
        canvas.paste(l, (x, y), l)

def draw_slide_counter(draw, current, total, font):
    text = f"{current}/{total}"
    bb = draw.textbbox((0,0), text, font=font)
    x = W - (bb[2]-bb[0]) - 40
    draw.text((x+1, 41), text, font=font, fill=(0,0,0,160))
    draw.text((x, 40), text, font=font, fill=(255,255,255,210))

def draw_bottom_cta(draw, text, font, y=None):
    if y is None: y = H - 85
    x = centered_x(draw, text, font)
    draw.text((x+1,y+1), text, font=font, fill=(0,0,0,220))
    draw.text((x, y), text, font=font, fill=GOLD)

def draw_horizontal_rule(draw, y, alpha=140, width=260):
    cx = W//2
    draw.line([(cx-width, y),(cx+width, y)], fill=(*GOLD, alpha), width=2)

# ─── MAIN GENERATOR ──────────────────────────────────────────────────────────
def main():
    workspace = r"c:\recoverd usb\Speisely Marketplace1"
    brain     = r"C:\Users\ahmad\.gemini\antigravity\brain\b308feef-2d4d-4563-b7d6-d6991ec44c51\.user_uploaded"
    out_dir   = os.path.join(workspace, "public", "magazin", "nadir-gullu")
    os.makedirs(out_dir, exist_ok=True)

    raw_path   = os.path.join(out_dir, "speisely_nadir_gullu_premium_reel_raw.mp4")
    final_path = os.path.join(out_dir, "speisely_nadir_gullu_premium_reel.mp4")
    clean_path = os.path.join(out_dir, "speisely_nadir_gullu_premium_reel_clean.mp4")
    audio_path = os.path.join(workspace, "scratch", "turkish_elegance.mp3")

    print("Loading and pre-grading source assets...", flush=True)
    img_macro_raw    = Image.open(os.path.join(brain, "media_1792168766930_30865460.jpg")).convert("RGB")
    img_dondurma_raw = Image.open(os.path.join(out_dir, "nadir-gullu-havuc-dilimi-dondurma.jpg")).convert("RGB")
    img_espresso_raw = Image.open(os.path.join(out_dir, "nadir-gullu-espresso-baklava-duo.jpg")).convert("RGB")
    img_store_raw    = Image.open(os.path.join(out_dir, "nadir-gullu-viktualienmarkt-store.jpg")).convert("RGB")
    img_hero_raw     = Image.open(os.path.join(brain, "media_1792166019589_7f20d37e.jpg")).convert("RGB")
    img_tea_raw      = Image.open(os.path.join(brain, "media_1792166030960_c9d4808e.jpg")).convert("RGB")
    img_macro2_raw   = Image.open(os.path.join(out_dir, "nadir-gullu-havuc-dilimi-macro.jpg")).convert("RGB")

    # One-time high-end color grading
    img_hero     = color_grade_image(img_hero_raw,     tint=(5,  20, 12), exposure=0.92, saturation=1.18)
    img_macro    = color_grade_image(img_macro_raw,    tint=(10, 25, 15), exposure=0.92, saturation=1.18)
    img_dondurma = color_grade_image(img_dondurma_raw, tint=(20, 10,  5), exposure=0.92, saturation=1.18)
    img_tea      = color_grade_image(img_tea_raw,      tint=(8,  30, 20), exposure=0.95, saturation=1.15)
    img_macro2   = color_grade_image(img_macro2_raw,   tint=(20, 12,  0), exposure=1.02, saturation=1.18)
    img_store    = color_grade_image(img_store_raw,    tint=(0,  15,  8), exposure=0.92, saturation=1.18)
    img_espresso = color_grade_image(img_espresso_raw, tint=(15, 10,  0), exposure=0.92, saturation=1.18)

    logo_path = os.path.join(workspace, "scratch", "speisely_circular_badge_perfect.png")
    logo = Image.open(logo_path).convert("RGBA") if os.path.exists(logo_path) else None

    # Typography
    f_huge   = gf(F_GEORGIA_B, 92)
    f_title  = gf(F_GEORGIA_B, 64)
    f_title2 = gf(F_GEORGIA_B, 50)
    f_sub    = gf(F_GEORGIA_I, 34)
    f_sub2   = gf(F_GEORGIA_I, 26)
    f_badge  = gf(F_ARIAL_B,   22)
    f_num    = gf(F_BAHN,      110)
    f_num2   = gf(F_BAHN,      68)
    f_small  = gf(F_ARIAL_B,   20)
    f_cta    = gf(F_ARIAL_B,   24)
    f_counter= gf(F_ARIAL_B,   20)

    scenes = [
        (0.0,  2.8,  img_hero,     "S1_HOOK"),
        (2.8,  5.8,  img_macro,    "S2_FORTY"),
        (5.8,  8.5,  img_dondurma, "S3_RULE"),
        (8.5,  11.5, img_tea,      "S4_TASTE"),
        (11.5, 14.5, img_store,    "S5_ORIGIN"),
        (14.5, 18.0, img_espresso, "S6_OUTRO"),
    ]

    fourcc = cv2.VideoWriter_fourcc(*"mp4v")
    out = cv2.VideoWriter(raw_path, fourcc, FPS, (W, H))

    # Preview captures timed at scene zeniths when all typography is active
    preview_times = [1.5, 4.5, 7.2, 10.0, 13.0, 16.5]
    previews = {}

    print(f"Rendering {TOTAL_FRAMES} frames @ {FPS}fps (High-Performance Engine v2.1)...", flush=True)

    for fi in range(TOTAL_FRAMES):
        t = fi / FPS
        scene_idx = 0
        for i, (t0, t1, _, _) in enumerate(scenes):
            if t0 <= t < t1:
                scene_idx = i
                break
        t0, t1, bg_img, scene_id = scenes[scene_idx]
        scene_t = (t - t0) / (t1 - t0)   # 0.0 -> 1.0 within scene

        # ─── BUILD BASE FRAME ─────────────────────────────────────────
        if scene_id == "S4_TASTE":
            # Diagonal split: top tea aerial, bottom macro
            base_a = fullbleed(bg_img, zoom=1.10 + 0.03*scene_t)
            base_b = fullbleed(img_macro2, zoom=1.06 + 0.04*scene_t)
            mask = Image.new("L", (W, H), 0)
            md = ImageDraw.Draw(mask)
            split_y = int(H * 0.48 + H * 0.02 * math.sin(scene_t * math.pi * 2))
            md.polygon([(0,0),(W,0),(W,split_y-80),(0,split_y+80)], fill=255)
            base = Image.composite(base_a, base_b, mask)
            bd = ImageDraw.Draw(base)
            bd.line([(0, split_y+80),(W, split_y-80)], fill=(*GOLD,220), width=3)
            base = Image.alpha_composite(base, VIGNETTE_STD)
        else:
            zoom_base = 1.05 + 0.07 * scene_t
            pan_y_base = 0
            if scene_id == "S1_HOOK":
                zoom_base = 1.16 - 0.06 * ease_out(scene_t)
                pan_y_base = -40 * scene_t
            elif scene_id == "S2_FORTY":
                zoom_base = 1.08
                pan_y_base = 20 * ease_in_out(scene_t)

            base = fullbleed(bg_img, zoom=zoom_base, pan_y=pan_y_base)
            vign = VIGNETTE_DEEP if scene_id in ["S3_RULE", "S6_OUTRO"] else VIGNETTE_STD
            base = Image.alpha_composite(base, vign)

        canvas = base.copy()
        draw = ImageDraw.Draw(canvas)

        # Speisely logo badge & slide counter on slides 2 to 6
        if logo and scene_id != "S1_HOOK":
            draw_logo_badge(canvas, logo)
            draw_slide_counter(draw, scene_idx + 1, len(scenes), f_counter)

        # ═══════════════════════════════════════════════════════════════
        # S1: HOOK — Instant, punchy ISTANBUL IN MÜNCHEN
        # ═══════════════════════════════════════════════════════════════
        if scene_id == "S1_HOOK":
            # Subtle flash at first 0.1s
            if scene_t < 0.10:
                flash_a = int(220 * (1 - scene_t/0.10))
                fl = Image.new("RGBA", (W,H), (255,255,255,flash_a))
                canvas = Image.alpha_composite(canvas, fl)
                draw = ImageDraw.Draw(canvas)

            # Logo top-left
            if logo:
                draw_logo_badge(canvas, logo)

            # Centered Sage Pill: immediate reveal
            p_prog = min(1.0, scene_t / 0.15)
            animated_pill(draw, "SPEISELY COMMUNITY SPOTLIGHT", f_badge, W//2, 95, p_prog)

            # Main Headline: appears at 0.12s
            h_prog = min(1.0, max(0.0, (scene_t - 0.12) / 0.25))
            slide_up = int(35 * (1 - ease_out(h_prog)))
            al = int(255 * ease_out(h_prog))
            y1 = 160 + slide_up
            y2 = y1 + 96

            stamp(draw, "ISTANBUL", f_huge, centered_x(draw,"ISTANBUL",f_huge), y1, fill=(*CREAM[:3],al))
            stamp(draw, "IN MÜNCHEN", f_huge, centered_x(draw,"IN MÜNCHEN",f_huge), y2, fill=(*CREAM[:3],al))

            # Gold subtitle line
            s_prog = min(1.0, max(0.0, (scene_t - 0.25) / 0.25))
            sub_al = int(255 * ease_out(s_prog))
            draw_horizontal_rule(draw, y2+110, alpha=int(140*s_prog))
            sub_txt = "Das Original aus Karaköy · Est. 1843"
            draw.text((centered_x(draw, sub_txt, f_sub2), y2+120), sub_txt, font=f_sub2, fill=(*GOLD[:3],sub_al))

            # Bottom Location Pill & CTA
            b_prog = min(1.0, max(0.0, (scene_t - 0.30) / 0.25))
            loc_txt = "Nadir Güllü · Viktualienmarkt (Abt. VI Stand 1b/2b)"
            bb = draw.textbbox((0,0), loc_txt, font=f_small)
            lw = bb[2]-bb[0]; lh = bb[3]-bb[1]
            lx = (W-lw)//2; ly = H - 210
            pill_al = int(220 * ease_out(b_prog))
            draw.rounded_rectangle([lx-20,ly-10,lx+lw+20,ly+lh+10], radius=14,
                                   fill=(12,22,16,pill_al), outline=(255,255,255,int(70*b_prog)), width=1)
            draw.text((lx,ly), loc_txt, font=f_small, fill=(*CREAM[:3],int(255*ease_out(b_prog))))
            draw_bottom_cta(draw, "Swipe für das Meisterwerk >>", f_cta, y=H-125)

        # ═══════════════════════════════════════════════════════════════
        # S2: THE NUMBER — Animated counter (0 -> 40), 3 fact cards
        # ═══════════════════════════════════════════════════════════════
        elif scene_id == "S2_FORTY":
            p_prog = min(1.0, scene_t / 0.15)
            animated_pill(draw, "HANDWERKS-AUDIT", f_badge, W//2, 95, p_prog)

            # Counter starts immediately at 0.05s
            num_prog = min(1.0, max(0.0, (scene_t - 0.05) / 0.6))
            current_num = int(40 * ease_out(num_prog))
            num_text = str(current_num)
            bb = draw.textbbox((0,0), num_text, font=f_num)
            nx = (W-(bb[2]-bb[0]))//2; ny = 145
            stamp(draw, num_text, f_num, nx, ny, fill=GOLD)

            # SCHICHTEN headline
            s2_prog = min(1.0, max(0.0, (scene_t - 0.20) / 0.25))
            al_s2 = int(255 * ease_out(s2_prog))
            draw_horizontal_rule(draw, 315, alpha=int(140*s2_prog))
            x_sch = centered_x(draw, "SCHICHTEN", f_title2)
            stamp(draw, "SCHICHTEN", f_title2, x_sch, 326, fill=(*CREAM[:3],al_s2))
            x_ph = centered_x(draw, "Kırk Kat Teig hauchdünn gerollt", f_sub2)
            draw.text((x_ph, 390), "Kırk Kat Teig hauchdünn gerollt", font=f_sub2, fill=(*GOLD[:3],al_s2))

            # 3 Fact Cards
            facts = [
                ("0.5mm", "Dicke/Schicht"),
                ("99.8%", "Urfa Sade Yağ"),
                ("1843",  "Tradition"),
            ]
            card_w = 280; card_h = 105; card_y = 470
            for i, (num_f, label_f) in enumerate(facts):
                fact_prog = min(1.0, max(0.0, (scene_t - (0.22 + i*0.08)) / 0.18))
                if fact_prog <= 0: continue
                cx_f = 75 + i * 320
                al_f = int(255 * ease_out(fact_prog))
                draw.rounded_rectangle([cx_f, card_y, cx_f+card_w, card_y+card_h],
                                       radius=16,
                                       fill=(6,20,12,int(230*ease_out(fact_prog))),
                                       outline=(*GOLD[:3],int(180*ease_out(fact_prog))), width=2)
                fnum_bb = draw.textbbox((0,0), num_f, font=f_num2)
                fnx = cx_f + (card_w - (fnum_bb[2]-fnum_bb[0]))//2
                stamp(draw, num_f, f_num2, fnx, card_y+8, fill=(*GOLD[:3],al_f))
                lab_bb = draw.textbbox((0,0), label_f, font=gf(F_ARIAL_B,17))
                lnx = cx_f + (card_w - (lab_bb[2]-lab_bb[0]))//2
                draw.text((lnx, card_y+68), label_f, font=gf(F_ARIAL_B,17), fill=(*CREAM[:3],al_f))

            draw_bottom_cta(draw, "Niemals mit Besteck essen >>", f_cta)

        # ═══════════════════════════════════════════════════════════════
        # S3: THE RULE — Red alert, 180° inversion technique
        # ═══════════════════════════════════════════════════════════════
        elif scene_id == "S3_RULE":
            rp_prog = min(1.0, scene_t / 0.15)
            rp_txt = "! DIE GOLDENE GASTRONOMIE-REGEL !"
            bb = draw.textbbox((0,0), rp_txt, font=f_badge)
            bw = bb[2]-bb[0]; bh = bb[3]-bb[1]
            bx=(W-bw)//2; by=78
            draw.rounded_rectangle([bx-22,by-10,bx+bw+22,by+bh+10], radius=20,
                                   fill=(*[190,30,30],int(240*rp_prog)),
                                   outline=(255,255,255,int(180*rp_prog)), width=2)
            draw.text((bx,by), rp_txt, font=f_badge, fill=(255,255,255,int(255*rp_prog)))

            # Punchy headline appears immediately
            rp2 = min(1.0, max(0.0, (scene_t - 0.10) / 0.25))
            al = int(255 * ease_out(rp2))
            y1 = 145; y2 = y1+90
            stamp(draw, "NIEMALS MIT", f_title, centered_x(draw,"NIEMALS MIT",f_title), y1, fill=(*CREAM[:3],al))
            stamp(draw, "DEM BESTECK!", f_title, centered_x(draw,"DEM BESTECK!",f_title), y2, fill=(*GOLD[:3],al))

            # Master tip card
            card_prog = min(1.0, max(0.0, (scene_t - 0.25) / 0.30))
            card_al = int(240 * ease_out(card_prog))
            cx2 = 60; cw2 = W-120; cy2 = 365; ch2 = 210
            draw.rounded_rectangle([cx2,cy2,cx2+cw2,cy2+ch2], radius=22,
                                   fill=(4,16,10,card_al),
                                   outline=(*GOLD[:3],int(200*ease_out(card_prog))), width=2)
            draw.text((cx2+30, cy2+20), "DAS NADIR USTA RITUAL", font=f_small, fill=(*GOLD[:3],int(255*ease_out(card_prog))))
            lines = [
                ('» Drehe das Dreieck: 180° Kopfstand «', f_sub, CREAM),
                ('Die sirupgetränkte Unterseite muss zuerst', gf(F_ARIAL_B,22), CREAM),
                ('an den Gaumen — für maximale Schmelz-Explosion.', gf(F_ARIAL_B,22), GOLD),
            ]
            for li, (lt, lf, lc) in enumerate(lines):
                draw.text((cx2+30, cy2+60+li*40), lt, font=lf, fill=(*lc[:3],int(255*ease_out(card_prog))))

            draw_bottom_cta(draw, "So entfaltet sich der Schmelz >>", f_cta)

        # ═══════════════════════════════════════════════════════════════
        # S4: TASTE — Diagonal split, Boz Fıstık vs Çeşit-Tablett
        # ═══════════════════════════════════════════════════════════════
        elif scene_id == "S4_TASTE":
            lp = min(1.0, scene_t / 0.15)
            lbl1 = "BOZ FISTIK PISTAZIEN"
            draw.text((centered_x(draw,lbl1,f_badge), 85), lbl1, font=f_badge, fill=(*GOLD[:3],int(255*lp)))
            lbl2 = "ÇEŞIT TABLETT"
            draw.text((centered_x(draw,lbl2,f_badge), 1010), lbl2, font=f_badge, fill=(*CREAM[:3],int(255*lp)))

            # Centered duel card
            tp = min(1.0, max(0.0, (scene_t - 0.15) / 0.25))
            al = int(255 * ease_out(tp))
            draw.rounded_rectangle([70, 860, W-70, 1045], radius=20,
                                   fill=(4,16,10,int(230*ease_out(tp))),
                                   outline=(*GOLD[:3],int(180*ease_out(tp))), width=2)
            main_t = "DAS GESCHMACKS-DUELL"
            stamp(draw, main_t, f_title2, centered_x(draw,main_t,f_title2), 875, fill=(*CREAM[:3],al))
            sub1 = "Gaziantep Frühjahrsernte (Smaragdgrün)"
            draw.text((centered_x(draw,sub1,gf(F_ARIAL_B,20)), 950), sub1, font=gf(F_ARIAL_B,20), fill=(*GOLD[:3],al))
            sub2 = "Vier Meisterkreationen im Geschmacks-Vergleich"
            draw.text((centered_x(draw,sub2,gf(F_ARIAL_B,20)), 986), sub2, font=gf(F_ARIAL_B,20), fill=(*CREAM[:3],al))

            draw_bottom_cta(draw, "Welche Sorte wählst du? >>", f_cta)

        # ═══════════════════════════════════════════════════════════════
        # S5: ORIGIN — Storefront, Viktualienmarkt München
        # ═══════════════════════════════════════════════════════════════
        elif scene_id == "S5_ORIGIN":
            cp = min(1.0, scene_t / 0.15)
            animated_pill(draw, "SPEISELY VISITS  //  MÜNCHEN", f_badge, W//2, 92, cp)

            hp = min(1.0, max(0.0, (scene_t - 0.12) / 0.25))
            al = int(255 * ease_out(hp))
            h1 = "NADIR GÜLLÜ"
            h2 = "MÜNCHEN"
            stamp(draw, h1, f_title, centered_x(draw,h1,f_title), 150, fill=(*CREAM[:3],al))
            stamp(draw, h2, f_title2, centered_x(draw,h2,f_title2), 226, fill=(*GOLD[:3],al))
            draw_horizontal_rule(draw, 298, alpha=int(140*hp))

            since = "Est. 1843 · Original Karaköy Güllüoğlu"
            draw.text((centered_x(draw,since,f_sub2), 312), since, font=f_sub2, fill=(*GOLD[:3],al))

            # Location facts card
            lcp = min(1.0, max(0.0, (scene_t - 0.25) / 0.30))
            lc_al = int(240 * ease_out(lcp))
            draw.rounded_rectangle([60, H-385, W-60, H-135], radius=22,
                                   fill=(5,20,12,lc_al),
                                   outline=(*GOLD[:3],int(200*ease_out(lcp))), width=2)
            tags = [
                ("STAND",  "Viktualienmarkt Abt. VI (Stand 1b/2b)"),
                ("FRISCH", "Täglich direkt aus Istanbul geliefert"),
                ("KULTUR", "100% Halal · Meisterhandwerk seit 1843"),
            ]
            for ii, (tag, info) in enumerate(tags):
                iy = H - 362 + ii * 66
                tw, th = 92, 32
                draw.rounded_rectangle([85, iy, 85+tw, iy+th], radius=8,
                                       fill=(*GOLD[:3], int(180*ease_out(lcp))))
                tbb = draw.textbbox((0,0), tag, font=gf(F_ARIAL_B, 14))
                tx = 85 + (tw - (tbb[2]-tbb[0])) // 2
                ty = iy + (th - (tbb[3]-tbb[1])) // 2
                draw.text((tx, ty), tag, font=gf(F_ARIAL_B, 14), fill=(*FOREST[:3], lc_al))
                draw.text((195, iy+4), info, font=gf(F_ARIAL_B, 21), fill=(*CREAM[:3], lc_al))

            draw_bottom_cta(draw, "Speichere für deinen Besuch >>", f_cta)

        # ═══════════════════════════════════════════════════════════════
        # S6: OUTRO — Baklava & Espresso, Save Button CTA
        # ═══════════════════════════════════════════════════════════════
        elif scene_id == "S6_OUTRO":
            op = min(1.0, scene_t / 0.15)
            animated_pill(draw, "MODERNE SYNERGIE", f_badge, W//2, 92, op)

            tp2 = min(1.0, max(0.0, (scene_t - 0.10) / 0.25))
            al = int(255 * ease_out(tp2))
            o1 = "BAKLAVA"
            o2 = "& ESPRESSO"
            stamp(draw, o1, f_title, centered_x(draw,o1,f_title), 150, fill=(*CREAM[:3],al))
            stamp(draw, o2, f_title2, centered_x(draw,o2,f_title2), 224, fill=(*GOLD[:3],al))

            desc = "180 Jahre Bosporus trifft Münchner Kaffeekultur."
            draw.text((centered_x(draw,desc,f_sub2), 305), desc, font=f_sub2, fill=(*CREAM[:3],al))

            # Big Save CTA button
            cta_prog = min(1.0, max(0.0, (scene_t - 0.22) / 0.30))
            cta_al = int(255 * ease_out(cta_prog))
            btn_txt = "SPEICHERE DIESEN POST »"
            bb = draw.textbbox((0,0), btn_txt, font=gf(F_ARIAL_B,27))
            bw = bb[2]-bb[0]; bh = bb[3]-bb[1]
            bx=(W-bw-80)//2; by=H-350
            draw.rounded_rectangle([bx,by,bx+bw+80,by+bh+26], radius=18,
                                   fill=(*GOLD[:3],cta_al),
                                   outline=(255,255,255,int(180*cta_prog)), width=2)
            draw.text((bx+40,by+13), btn_txt, font=gf(F_ARIAL_B,27), fill=(*FOREST[:3],cta_al))

            link_txt = "Vollständiges Dossier auf speisely.de"
            draw.text((centered_x(draw,link_txt,f_small),H-268), link_txt, font=f_small, fill=(*GOLD[:3],cta_al))

            follow_txt = "Folge @speisely für die besten Genuss-Orte"
            draw.text((centered_x(draw,follow_txt,gf(F_ARIAL,20)),H-232), follow_txt, font=gf(F_ARIAL,20), fill=(*CREAM[:3],cta_al))

        # Scene flash at start of cuts
        if scene_t < 0.08 and scene_idx > 0:
            fl_a = int(180 * (1 - scene_t/0.08))
            fl = Image.new("RGBA",(W,H),(255,255,255,fl_a))
            canvas = Image.alpha_composite(canvas, fl)

        # Preview capture at scene zeniths
        for pt in preview_times:
            if abs(t - pt) < (1.0/FPS)*0.6 and pt not in previews:
                previews[pt] = canvas.copy()

        # Write frame
        rgb = canvas.convert("RGB")
        bgr = cv2.cvtColor(np.array(rgb), cv2.COLOR_RGB2BGR)
        out.write(bgr)

        if fi % 75 == 0 or fi == TOTAL_FRAMES - 1:
            print(f"  Frame {fi+1}/{TOTAL_FRAMES} ({fi*100//TOTAL_FRAMES}%) - t={t:.1f}s [{scene_id}]", flush=True)

    out.release()
    print("Raw video generated successfully!", flush=True)

    # Save previews
    brain_dir = r"C:\Users\ahmad\.gemini\antigravity\brain\b308feef-2d4d-4563-b7d6-d6991ec44c51"
    for i, (pt, img) in enumerate(sorted(previews.items())):
        p = os.path.join(brain_dir, f"premium_reel_preview_{i+1:02d}.jpg")
        img.convert("RGB").save(p, "JPEG", quality=95)
        print(f"Saved preview: {p}", flush=True)

    # Encode with FFmpeg
    ffmpeg = imageio_ffmpeg.get_ffmpeg_exe()

    # 1. Mastercut with Turkish audio
    cmd_audio = [
        ffmpeg, "-y",
        "-i", raw_path,
        "-ss", "0", "-t", str(DURATION),
        "-i", audio_path,
        "-map", "0:v:0", "-map", "1:a:0",
        "-c:v", "libx264", "-pix_fmt", "yuv420p",
        "-profile:v", "main", "-level", "4.0",
        "-preset", "fast", "-crf", "18",
        "-c:a", "aac", "-b:a", "256k",
        "-af", f"afade=t=in:st=0:d=0.5,afade=t=out:st={DURATION-1.5:.1f}:d=1.5,volume=1.5",
        "-movflags", "+faststart",
        final_path,
    ]
    print("Encoding mastercut with Turkish audio...", flush=True)
    subprocess.run(cmd_audio, check=True)

    # 2. Clean video without audio (for native Instagram trending audio)
    cmd_clean = [
        ffmpeg, "-y", "-i", raw_path,
        "-c:v", "libx264", "-pix_fmt", "yuv420p",
        "-profile:v", "main", "-level", "4.0",
        "-preset", "fast", "-crf", "18",
        "-movflags", "+faststart",
        clean_path,
    ]
    print("Encoding clean reel (for IG native audio)...", flush=True)
    subprocess.run(cmd_clean, check=True)

    # Copy to user folders
    home = os.path.expanduser("~")
    for fname, src in [("speisely_nadir_gullu_premium_reel.mp4", final_path),
                       ("speisely_nadir_gullu_premium_reel_clean.mp4", clean_path)]:
        shutil.copyfile(src, os.path.join(home, "Downloads", fname))
        for d in ["OneDrive/Desktop", "Desktop"]:
            dd = os.path.join(home, d)
            if os.path.exists(dd):
                shutil.copyfile(src, os.path.join(dd, fname))
                break

    sz = os.path.getsize(final_path) / 1024 / 1024
    print(f"\nALL EXPORTS COMPLETE! Size: {sz:.2f} MB", flush=True)

if __name__ == "__main__":
    main()
