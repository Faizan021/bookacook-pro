import os
import math
import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageFilter
import cv2

WIDTH = 1080
HEIGHT = 1920
FPS = 30
TOTAL_DURATION = 15.0  # seconds
TOTAL_FRAMES = int(TOTAL_DURATION * FPS)

FONT_BAHNSCHRIFT = "C:/Windows/Fonts/bahnschrift.ttf"
FONT_GEORGIA_BOLD = "C:/Windows/Fonts/georgiab.ttf"
FONT_GEORGIA_ITALIC = "C:/Windows/Fonts/georgiai.ttf"
FONT_ARIAL_BOLD = "C:/Windows/Fonts/arialbd.ttf"
FONT_SEGOE_BOLD = "C:/Windows/Fonts/segoeuib.ttf"
FONT_SEGOE = "C:/Windows/Fonts/segoeui.ttf"

def get_font(path, size):
    try:
        return ImageFont.truetype(path, size)
    except Exception:
        return ImageFont.load_default()

def ease_in_out(t):
    return 0.5 - 0.5 * math.cos(math.pi * t)

def ease_out_cubic(t):
    return 1.0 - math.pow(1.0 - t, 3)

def draw_shadow(draw, pos, text, font, fill=(255, 255, 255, 255), shadow_fill=(0, 0, 0, 240), distance=3):
    x, y = pos
    for dx in range(-distance, distance + 1):
        for dy in range(1, distance + 2):
            if abs(dx) + abs(dy) <= distance + 1:
                draw.text((x + dx, y + dy), text, font=font, fill=shadow_fill)
    draw.text((x, y), text, font=font, fill=fill)

def draw_centered_shadow(draw, y, text, font, fill=(255, 255, 255, 255), shadow_fill=(0, 0, 0, 240), distance=3, width=WIDTH):
    bbox = draw.textbbox((0, 0), text, font=font)
    tw = bbox[2] - bbox[0]
    tx = (width - tw) // 2
    draw_shadow(draw, (tx, y), text, font, fill, shadow_fill, distance)
    return tx, y, tw

def create_cinematic_fullbleed(img, zoom=1.0, pan_x=0.0, pan_y=0.0):
    """
    Creates an edge-to-edge, immersive vertical frame with smooth cinematic crop,
    subtle edge feathering, and atmospheric gradient protection.
    """
    iw, ih = img.size
    scale = max(WIDTH / iw, HEIGHT / ih) * zoom
    nw, nh = int(iw * scale), int(ih * scale)
    scaled = img.resize((nw, nh), Image.Resampling.LANCZOS)
    
    left = int((nw - WIDTH) // 2 + pan_x)
    top = int((nh - HEIGHT) // 2 + pan_y)
    left = max(0, min(nw - WIDTH, left))
    top = max(0, min(nh - HEIGHT, top))
    
    frame = scaled.crop((left, top, left + WIDTH, top + HEIGHT)).convert("RGBA")
    
    # Parabolic cinematic vignette overlays (protects text while keeping food brilliant in center)
    vignette = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
    vdraw = ImageDraw.Draw(vignette)
    
    # Top gradient (protects headers: 0 to 480px)
    for y in range(480):
        t = y / 480.0
        alpha = int(230 * math.pow(1.0 - t, 1.4))
        vdraw.line([(0, y), (WIDTH, y)], fill=(4, 16, 10, alpha))
        
    # Bottom gradient (protects footers: 1200 to 1920px)
    for y in range(1200, HEIGHT):
        t = (y - 1200) / (HEIGHT - 1200)
        alpha = int(245 * math.pow(t, 1.3))
        vdraw.line([(0, y), (WIDTH, y)], fill=(4, 16, 10, alpha))
        
    return Image.alpha_composite(frame, vignette)

def draw_top_floating_chip(draw, text="SPEISELY VISITS // MÜNCHEN", y=120):
    f_chip = get_font(FONT_BAHNSCHRIFT, 16)
    bbox = draw.textbbox((0, 0), text, font=f_chip)
    cw = bbox[2] - bbox[0] + 40
    ch = 38
    cx = (WIDTH - cw) // 2
    draw.rounded_rectangle([cx, y, cx + cw, y + ch], radius=19, fill=(6, 26, 16, 225), outline=(230, 184, 74, 200), width=1)
    draw.text((cx + 20, y + 9), text, font=f_chip, fill=(230, 184, 74, 255))

def draw_frosted_header_card(draw, category_tag, main_title, subtitle="", y=110, h=160, w=980):
    """
    Renders an authoritative, high-contrast Frosted Obsidian Glass Header Card
    so titles are 100% PROMINENT, crisp, and never washed out by background food textures.
    """
    cx = (WIDTH - w) // 2
    draw.rounded_rectangle([cx, y, cx + w, y + h], radius=24, fill=(4, 20, 12, 235), outline=(230, 184, 74, 220), width=2)
    
    f_cat = get_font(FONT_BAHNSCHRIFT, 15)
    f_title = get_font(FONT_BAHNSCHRIFT, 42)
    f_sub = get_font(FONT_GEORGIA_ITALIC, 24)
    
    # Category tag
    draw_centered_shadow(draw, y + 18, category_tag, f_cat, (230, 184, 74, 255), distance=1)
    # Main bold title
    draw_centered_shadow(draw, y + 50, main_title, f_title, (246, 244, 235, 255), distance=3)
    # Subtitle
    if subtitle:
        draw_centered_shadow(draw, y + 106, subtitle, f_sub, (230, 184, 74, 245), distance=2)

def draw_asmr_bars(draw, x, y, t_global):
    f_asmr = get_font(FONT_BAHNSCHRIFT, 14)
    bar_count = 5
    for i in range(bar_count):
        wave = math.sin(t_global * 16.0 + i * 1.3) * 0.5 + 0.5
        h = int(10 + wave * 22)
        bx = x + i * 8
        by = y - h // 2 + 6
        draw.rounded_rectangle([bx, by, bx + 4, by + h], radius=2, fill=(230, 184, 74, 255))
    draw.text((x + 48, y), "TURKISH AUDIO // ASMR", font=f_asmr, fill=(230, 184, 74, 255))

def main():
    workspace = r"c:\recoverd usb\Speisely Marketplace1"
    output_dir = os.path.join(workspace, "public", "magazin", "nadir-gullu")
    os.makedirs(output_dir, exist_ok=True)
    
    raw_video_path = os.path.join(output_dir, "speisely_nadir_gullu_masterclass_raw.mp4")
    final_video_path = os.path.join(output_dir, "speisely_nadir_gullu_masterclass_reel.mp4")
    turkish_audio_path = os.path.join(workspace, "scratch", "turkish_elegance.mp3")
    
    # Load High-Resolution Source Photos
    print("Loading high-resolution source photos...", flush=True)
    img_macro_landscape = Image.open(r"C:\Users\ahmad\.gemini\antigravity\brain\b308feef-2d4d-4563-b7d6-d6991ec44c51\.user_uploaded\media_1792168766930_30865460.jpg").convert("RGB")
    img_showcase = Image.open(r"C:\Users\ahmad\.gemini\antigravity\brain\b308feef-2d4d-4563-b7d6-d6991ec44c51\.user_uploaded\media_1792168848518_a4c51e84.jpg").convert("RGB")
    img_borek_flag = Image.open(r"C:\Users\ahmad\.gemini\antigravity\brain\b308feef-2d4d-4563-b7d6-d6991ec44c51\.user_uploaded\media_1792168941229_201c8299.jpg").convert("RGB")
    img_dondurma = Image.open(os.path.join(output_dir, "nadir-gullu-havuc-dilimi-dondurma.jpg")).convert("RGB")
    img_espresso = Image.open(os.path.join(output_dir, "nadir-gullu-espresso-baklava-duo.jpg")).convert("RGB")
    
    fourcc = cv2.VideoWriter_fourcc(*'mp4v')
    out = cv2.VideoWriter(raw_video_path, fourcc, FPS, (WIDTH, HEIGHT))
    
    print(f"Generating Prominent Masterclass Reel with Turkish Music: {TOTAL_FRAMES} frames ({TOTAL_DURATION}s)...", flush=True)
    
    preview_frames = []
    
    for f in range(TOTAL_FRAMES):
        t_global = f / float(FPS)
        
        # ── SCENE 1: THE VIRAL DISRUPTION HOOK (0 - 75 / 2.5s) ──────────────
        if f < 75:
            local_t = f / 75.0
            zoom = 1.08 + 0.08 * ease_out_cubic(local_t)
            pan_y = 20 + 20 * ease_in_out(local_t)
            
            frame = create_cinematic_fullbleed(img_macro_landscape, zoom=zoom, pan_y=pan_y)
            draw = ImageDraw.Draw(frame)
            
            # Speisely Circular Logo at Top Left
            logo_path = r"c:\recoverd usb\Speisely Marketplace1\scratch\speisely_circular_badge_perfect.png"
            if os.path.exists(logo_path):
                logo_badge = Image.open(logo_path).convert("RGBA").resize((72, 72), Image.Resampling.LANCZOS)
                frame.paste(logo_badge, (40, 110), logo_badge)

            # Centered Frosted Sage Pill Badge
            f_badge = get_font(FONT_ARIAL_BOLD, 24)
            badge_text = "SPEISELY COMMUNITY SPOTLIGHT"
            badge_bbox = draw.textbbox((0, 0), badge_text, font=f_badge)
            badge_w = badge_bbox[2] - badge_bbox[0]
            badge_h = badge_bbox[3] - badge_bbox[1]
            badge_x = (WIDTH - badge_w) // 2
            badge_y = 125
            pad_x, pad_y = 22, 10
            draw.rounded_rectangle([badge_x - pad_x, badge_y - pad_y, badge_x + badge_w + pad_x, badge_y + badge_h + pad_y], radius=20, fill=(235, 244, 236, 245), outline=(127, 164, 107, 220), width=2)
            draw.text((badge_x, badge_y - 2), badge_text, fill=(24, 46, 34), font=f_badge)

            # Main Headline: ISTANBUL IN MÜNCHEN (Serif Bold Georgia All-Caps matching user screenshot)
            f_title_hero = get_font(FONT_GEORGIA_BOLD, 58)
            draw_centered_shadow(draw, badge_y + badge_h + pad_y + 26, "ISTANBUL IN MÜNCHEN", f_title_hero, (255, 255, 255, 255), shadow_fill=(0, 0, 0, 240), distance=3)

            # Translucent Dark Subtitle Pill at Bottom
            f_sub_pill = get_font(FONT_ARIAL_BOLD, 26)
            sub_text = "Nadir Güllü · Viktualienmarkt (Abt. VI Stand 1b/2b)"
            sub_bbox = draw.textbbox((0, 0), sub_text, font=f_sub_pill)
            sub_w = sub_bbox[2] - sub_bbox[0]
            sub_h = sub_bbox[3] - sub_bbox[1]
            sub_x = (WIDTH - sub_w) // 2
            sub_y = HEIGHT - 240
            draw.rounded_rectangle([sub_x - 20, sub_y - 10, sub_x + sub_w + 20, sub_y + sub_h + 10], radius=14, fill=(15, 25, 20, 215), outline=(255, 255, 255, 70), width=1)
            draw.text((sub_x, sub_y), sub_text, fill=(255, 255, 255), font=f_sub_pill)

            # Speisely Gold Footer CTA
            f_foot_cta = get_font(FONT_ARIAL_BOLD, 24)
            draw_centered_shadow(draw, HEIGHT - 140, "40 Schichten Meisterwerk >>", f_foot_cta, (230, 184, 74, 255), shadow_fill=(0, 0, 0, 240), distance=2)
            draw_asmr_bars(draw, 50, HEIGHT - 140, t_global)
            
        # ── SCENE 2: ANATOMY OF 40 LAYERS (KINETIC SCANNER) (75 - 170 / 3.16s)
        elif f < 170:
            local_t = (f - 75) / 95.0
            zoom = 1.15 + 0.05 * math.sin(local_t * math.pi)
            pan_y = 10 + 25 * local_t
            
            frame = create_cinematic_fullbleed(img_macro_landscape, zoom=zoom, pan_y=pan_y)
            draw = ImageDraw.Draw(frame)
            
            # 100% PROMINENT Frosted Obsidian Header Plate (Zero Contrast Loss!)
            draw_frosted_header_card(
                draw,
                category_tag="HANDWERKS-AUDIT // DIE REZEPTUR",
                main_title="DIE ANATOMIE DER 40 SCHICHTEN",
                subtitle="Warum dieses Havuç Dilimi die Schwerkraft bricht",
                y=110, h=160, w=980
            )
            
            # Laser Scanner Beam
            scan_y = int(720 + 540 * local_t)
            draw.line([(50, scan_y), (WIDTH - 50, scan_y)], fill=(230, 184, 74, 255), width=3)
            for g in range(1, 7):
                draw.line([(50, scan_y - g), (WIDTH - 50, scan_y - g)], fill=(230, 184, 74, int(140 / g)), width=1)
                draw.line([(50, scan_y + g), (WIDTH - 50, scan_y + g)], fill=(230, 184, 74, int(140 / g)), width=1)
                
            # Animated HUD Nodes (High-Contrast, Safe Coordinates, Bold Typography)
            def add_prominent_hud(draw, target_x, target_y, title, sub, align="left", progress=1.0):
                if progress <= 0.05: return
                alpha = min(1.0, progress * 1.5)
                node_r = 8
                draw.ellipse([target_x - node_r, target_y - node_r, target_x + node_r, target_y + node_r], fill=(230, 184, 74, int(255*alpha)), outline=(255, 255, 255, int(240*alpha)), width=2)
                
                box_w = 440
                box_h = 92
                
                # Carefully bound coordinates inside screen margins (40 to WIDTH - 40)
                if align == "left":
                    bx = min(WIDTH - box_w - 40, target_x + 35)
                    draw.line([(target_x, target_y), (bx, target_y)], fill=(230, 184, 74, int(220*alpha)), width=2)
                else:
                    bx = max(40, target_x - 35 - box_w)
                    draw.line([(target_x, target_y), (bx + box_w, target_y)], fill=(230, 184, 74, int(220*alpha)), width=2)
                    
                by = target_y - box_h // 2
                
                # High-contrast solid frosted obsidian plate
                draw.rounded_rectangle([bx, by, bx + box_w, by + box_h], radius=18, fill=(4, 18, 12, int(245*alpha)), outline=(230, 184, 74, int(230*alpha)), width=2)
                
                f_ht = get_font(FONT_BAHNSCHRIFT, 24)
                f_hs = get_font(FONT_SEGOE_BOLD, 18)
                
                draw.text((bx + 20, by + 16), title, font=f_ht, fill=(246, 244, 235, int(255*alpha)))
                draw.text((bx + 20, by + 50), sub, font=f_hs, fill=(255, 208, 96, int(245*alpha)))
                
            p1 = max(0.0, min(1.0, (local_t - 0.10) * 4.0))
            add_prominent_hud(draw, 500, 780, "40x Kırk Kat Teig", "Hauchdünn wie Pergamentpapier", align="right", progress=p1)
            
            p2 = max(0.0, min(1.0, (local_t - 0.38) * 4.0))
            add_prominent_hud(draw, 580, 990, "Boz Fıstık Pistazien", "Gaziantep-Frühjahrsernte (Smaragdgrün)", align="left", progress=p2)
            
            p3 = max(0.0, min(1.0, (local_t - 0.65) * 4.0))
            add_prominent_hud(draw, 510, 1200, "Urfa Sade Yağ", "Reine geklärte Schafbutter", align="right", progress=p3)
            
            draw_asmr_bars(draw, 100, HEIGHT - 140, t_global)
            
        # ── SCENE 3: THE FLIP RITUAL (KOPFSTAND) (170 - 255 / 2.83s) ────────
        elif f < 255:
            local_t = (f - 170) / 85.0
            zoom = 1.05 + 0.05 * ease_in_out(local_t)
            pan_y = -30 + 20 * local_t
            
            frame = create_cinematic_fullbleed(img_dondurma, zoom=zoom, pan_y=pan_y)
            draw = ImageDraw.Draw(frame)
            
            # High-Impact Red Warning Header Card (100% PROMINENT)
            w_card_w = 980
            w_card_h = 150
            w_cx = (WIDTH - w_card_w) // 2
            w_cy = 110
            draw.rounded_rectangle([w_cx, w_cy, w_cx + w_card_w, w_cy + w_card_h], radius=24, fill=(6, 22, 14, 235), outline=(255, 255, 255, 200), width=2)
            
            # Red warning pill
            pill_w = 480
            pill_h = 36
            px = (WIDTH - pill_w) // 2
            py = w_cy + 16
            draw.rounded_rectangle([px, py, px + pill_w, py + pill_h], radius=18, fill=(195, 30, 20, 245), outline=(255, 255, 255, 220), width=1)
            draw_centered_shadow(draw, py + 7, "! DIE GOLDENE GASTRONOMIE-REGEL !", get_font(FONT_BAHNSCHRIFT, 16), (255, 255, 255, 255), distance=1)
            
            draw_centered_shadow(draw, w_cy + 68, "NIEMALS MIT DEM BESTECK ESSEN!", get_font(FONT_BAHNSCHRIFT, 44), (246, 244, 235, 255), distance=3)
            
            # Lower Connoisseur Dock (1380 - 1600)
            dock_w = 960
            dock_h = 220
            dx = (WIDTH - dock_w) // 2
            dy = 1380
            draw.rounded_rectangle([dx, dy, dx + dock_w, dy + dock_h], radius=26, fill=(6, 26, 16, 240), outline=(230, 184, 74, 220), width=2)
            
            f_r_tag = get_font(FONT_BAHNSCHRIFT, 15)
            f_rule = get_font(FONT_GEORGIA_BOLD, 36)
            f_rule_sub = get_font(FONT_SEGOE_BOLD, 21)
            
            draw.text((dx + 35, dy + 22), "DAS MEISTER-RITUAL NACH NADIR USTA // GAUMENREGEL", font=f_r_tag, fill=(230, 184, 74, 255))
            draw.text((dx + 35, dy + 56), "» Dreh das Dreieck um: 180° Kopfstand «", font=f_rule, fill=(246, 244, 235, 255))
            draw.text((dx + 35, dy + 112), "Die sirupgetränkte Unterseite muss zuerst an deinen Gaumen.", font=f_rule_sub, fill=(225, 235, 228, 245))
            draw.text((dx + 35, dy + 148), "So explodiert der Butter-Schmelz, bevor das Knuspern beginnt.", font=f_rule_sub, fill=(255, 208, 96, 245))
            
            draw_asmr_bars(draw, dx + dock_w - 230, dy + 22, t_global)
            
        # ── SCENE 4: VIKTUALIENMARKT BOUTIQUE SHOWCASE (255 - 340 / 2.83s) ──
        elif f < 340:
            local_t = (f - 255) / 85.0
            zoom = 1.08 + 0.06 * local_t
            pan_x = -60 + 120 * ease_in_out(local_t)
            
            frame = create_cinematic_fullbleed(img_showcase, zoom=zoom, pan_x=pan_x, pan_y=0)
            draw = ImageDraw.Draw(frame)
            
            draw_frosted_header_card(
                draw,
                category_tag="MÜNCHEN VIKTUALIENMARKT // ABT. VI",
                main_title="180 JAHRE MEISTERTRADITION",
                subtitle="Täglich frisch aus den Backstuben von Karaköy Güllüoğlu",
                y=110, h=160, w=980
            )
            
            # Lower Third Dock
            dock_w = 960
            dock_h = 160
            dx = (WIDTH - dock_w) // 2
            dy = 1420
            draw.rounded_rectangle([dx, dy, dx + dock_w, dy + dock_h], radius=24, fill=(6, 22, 14, 235), outline=(230, 184, 74, 200), width=2)
            
            f_loc_tag = get_font(FONT_BAHNSCHRIFT, 15)
            f_loc_title = get_font(FONT_GEORGIA_BOLD, 32)
            f_loc_desc = get_font(FONT_SEGOE_BOLD, 19)
            
            draw.text((dx + 35, dy + 22), "STAND 1B / 2B  •  FREILUFT-BOUTIQUE", font=f_loc_tag, fill=(230, 184, 74, 255))
            draw.text((dx + 35, dy + 56), "Goldene Bleche voll warmer Baklava-Sorten", font=f_loc_title, fill=(246, 244, 235, 255))
            draw.text((dx + 35, dy + 104), "Klassische Rauten, Pistazienrollen (Dolama) & Walnuss", font=f_loc_desc, fill=(225, 235, 228, 245))
            
            draw_asmr_bars(draw, dx + dock_w - 230, dy + 24, t_global)
            
        # ── SCENE 5: THE SAVORY BALANCE (SU BÖREĞİ & ÇAY) (340 - 410 / 2.33s) ─
        elif f < 410:
            local_t = (f - 340) / 70.0
            zoom = 1.05 + 0.05 * ease_in_out(local_t)
            pan_y = -20 + 20 * local_t
            
            frame = create_cinematic_fullbleed(img_borek_flag, zoom=zoom, pan_y=pan_y)
            draw = ImageDraw.Draw(frame)
            
            draw_frosted_header_card(
                draw,
                category_tag="DER HERZHAFTE GEGENPOL // SU BÖREĞİ",
                main_title="DAS PERFEKTE PAIRING",
                subtitle="Gekochte Teigbänder, Schafskäse & frischer Çay",
                y=110, h=160, w=980
            )
            
            # Lower Third Dock
            dock_w = 960
            dock_h = 160
            dx = (WIDTH - dock_w) // 2
            dy = 1420
            draw.rounded_rectangle([dx, dy, dx + dock_w, dy + dock_h], radius=24, fill=(6, 22, 14, 235), outline=(230, 184, 74, 200), width=2)
            
            f_b_tag = get_font(FONT_BAHNSCHRIFT, 15)
            f_b_title = get_font(FONT_GEORGIA_BOLD, 32)
            f_b_desc = get_font(FONT_SEGOE_BOLD, 19)
            
            draw.text((dx + 35, dy + 22), "TRADITIONELLES WASSERGEBÄCK // SU BÖREĞİ", font=f_b_tag, fill=(230, 184, 74, 255))
            draw.text((dx + 35, dy + 56), "Der Ausgleich zur edlen Süße", font=f_b_title, fill=(246, 244, 235, 255))
            draw.text((dx + 35, dy + 104), "Serviert mit echtem türkischem Schwarztee im Tulpenglas", font=f_b_desc, fill=(225, 235, 228, 245))
            
            draw_asmr_bars(draw, dx + dock_w - 230, dy + 24, t_global)
            
        # ── SCENE 6: LUXURY OUTRO & SAVE CTA (410 - 450 / 1.33s) ────────────
        else:
            local_t = (f - 410) / 40.0
            zoom = 1.05 + 0.04 * local_t
            
            frame = create_cinematic_fullbleed(img_espresso, zoom=zoom, pan_y=-30)
            draw = ImageDraw.Draw(frame)
            
            # Central Luxury Prestige Card
            card_w = 960
            card_h = 520
            cx = (WIDTH - card_w) // 2
            cy = (HEIGHT - card_h) // 2 - 20
            
            draw.rounded_rectangle([cx, cy, cx + card_w, cy + card_h], radius=32, fill=(6, 24, 16, 245), outline=(230, 184, 74, 240), width=2)
            
            f_o1 = get_font(FONT_BAHNSCHRIFT, 17)
            f_o2 = get_font(FONT_GEORGIA_BOLD, 48)
            f_o3 = get_font(FONT_SEGOE_BOLD, 24)
            f_o4 = get_font(FONT_BAHNSCHRIFT, 26)
            f_o5 = get_font(FONT_SEGOE_BOLD, 20)
            
            draw_centered_shadow(draw, cy + 45, "SPEISELY VISITS  //  MÜNCHEN", f_o1, (230, 184, 74, 255), distance=1)
            draw_centered_shadow(draw, cy + 85, "Nadir Güllü München", f_o2, (246, 244, 235, 255), distance=3)
            draw_centered_shadow(draw, cy + 155, "Viktualienmarkt • Abteilung VI (Stand 1b/2b)", f_o3, (246, 244, 235, 220), distance=2)
            
            # 3 Tag Chips
            f_chip = get_font(FONT_BAHNSCHRIFT, 15)
            chips = ["180 JAHRE TRADITION", "100% HALAL", "TÄGLICH FRISCH"]
            total_chips_w = 200 * 3 + 20 * 2
            chip_x = (WIDTH - total_chips_w) // 2
            chip_y = cy + 215
            for i, c_txt in enumerate(chips):
                bx = chip_x + i * 220
                draw.rounded_rectangle([bx, chip_y, bx + 200, chip_y + 38], radius=19, fill=(10, 42, 28, 235), outline=(230, 184, 74, 200), width=1)
                bbox = draw.textbbox((0, 0), c_txt, font=f_chip)
                tw = bbox[2] - bbox[0]
                draw.text((bx + (200 - tw) // 2, chip_y + 10), c_txt, font=f_chip, fill=(230, 184, 74, 255))
                
            # Gold CTA Button
            btn_y = cy + 295
            btn_h = 78
            draw.rounded_rectangle([cx + 60, btn_y, cx + card_w - 60, btn_y + btn_h], radius=24, fill=(230, 184, 74, 255))
            draw_centered_shadow(draw, btn_y + 24, "SPEICHERE DIESEN POST FÜR DEINEN BESUCH »", f_o4, (8, 32, 18, 255), shadow_fill=(255, 255, 255, 120), distance=1)
            
            draw_centered_shadow(draw, cy + 420, "Vollständiges Verkostungs-Dossier auf speisely.de", f_o5, (230, 184, 74, 240), distance=1)
            
        # Subtle Golden Flash Transitions between Scenes
        cut_frames = [75, 170, 255, 340, 410]
        for cf in cut_frames:
            dist = abs(f - cf)
            if dist <= 3:
                flash_alpha = int(120 * (1.0 - dist / 4.0))
                flash_overlay = Image.new("RGBA", (WIDTH, HEIGHT), (240, 210, 140, flash_alpha))
                frame = Image.alpha_composite(frame, flash_overlay)
                
        # Capture Preview Stills
        if f in [35, 125, 210, 295, 375, 435]:
            preview_frames.append((f, frame.copy()))
            
        # Write to OpenCV Video
        frame_rgb = frame.convert("RGB")
        frame_bgr = cv2.cvtColor(np.array(frame_rgb), cv2.COLOR_RGB2BGR)
        out.write(frame_bgr)
        
        if (f + 1) % 50 == 0 or f == TOTAL_FRAMES - 1:
            print(f"Generated frame {f+1}/{TOTAL_FRAMES}...", flush=True)
            
    out.release()
    print(f"Raw video generated: {raw_video_path}", flush=True)
    
    # Save preview stills
    brain_dir = r"C:\Users\ahmad\.gemini\antigravity\brain\b308feef-2d4d-4563-b7d6-d6991ec44c51"
    for idx, (f_num, pimg) in enumerate(preview_frames):
        p_path = os.path.join(brain_dir, f"nadir_reel_preview_shot{idx+1}.jpg")
        pimg.convert("RGB").save(p_path, "JPEG", quality=95)
        print(f"Saved preview still: {p_path}", flush=True)
        
    # Re-encode with modern H.264 (AVC1), add Turkish Instrumental Music with fade, and output final video
    import subprocess, imageio_ffmpeg, shutil
    ffmpeg_exe = imageio_ffmpeg.get_ffmpeg_exe()
    
    cmd = [
        ffmpeg_exe, '-y',
        '-i', raw_video_path,
        '-ss', '0', '-t', str(TOTAL_DURATION),
        '-i', turkish_audio_path,
        '-map', '0:v:0',
        '-map', '1:a:0',
        '-c:v', 'libx264',
        '-pix_fmt', 'yuv420p',
        '-profile:v', 'main',
        '-level', '4.0',
        '-preset', 'fast',
        '-crf', '18',
        '-c:a', 'aac',
        '-b:a', '256k',
        '-af', 'afade=t=in:st=0:d=0.5,afade=t=out:st=13.5:d=1.5,volume=1.5',
        '-movflags', '+faststart',
        final_video_path
    ]
    
    print("Encoding with H.264 and authentic Turkish instrumental soundtrack...", flush=True)
    res = subprocess.run(cmd, capture_output=True, text=True)
    if res.returncode == 0:
        print(f"Final Masterclass Reel created successfully! Size: {os.path.getsize(final_video_path) / (1024*1024):.2f} MB", flush=True)
        
        user_home = os.path.expanduser('~')
        target_dl = os.path.join(user_home, 'Downloads', 'speisely_nadir_gullu_masterclass_reel.mp4')
        shutil.copyfile(final_video_path, target_dl)
        print(f"Copied to Downloads: {target_dl}", flush=True)
        
        for d_name in ['OneDrive/Desktop', 'Desktop']:
            dt_dir = os.path.join(user_home, d_name)
            if os.path.exists(dt_dir):
                target_dt = os.path.join(dt_dir, 'speisely_nadir_gullu_masterclass_reel.mp4')
                shutil.copyfile(final_video_path, target_dt)
                print(f"Copied to Desktop: {target_dt}", flush=True)
                break
    else:
        print(f"FFmpeg error: {res.stderr}", flush=True)

if __name__ == "__main__":
    main()
