import os
import math
import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageFilter
import cv2

WIDTH = 1080
HEIGHT = 1920
FPS = 30

FONT_GEORGIA_BOLD = "C:/Windows/Fonts/georgiab.ttf"
FONT_GEORGIA = "C:/Windows/Fonts/georgia.ttf"
FONT_ARIAL_BOLD = "C:/Windows/Fonts/arialbd.ttf"
FONT_ARIAL = "C:/Windows/Fonts/arial.ttf"

def get_font(path, size):
    try:
        return ImageFont.truetype(path, size)
    except Exception:
        return ImageFont.load_default()

def ease_out_cubic(t):
    return 1.0 - math.pow(1.0 - t, 3)

def render_brand_intro(logo_img, frame_idx, total_frames):
    """
    Scene 1: Pure Minimalist Speisely Brand Seal (Rule 12)
    Deep Forest Green (#082e1b) canvas with official logo and luxury gold trim.
    """
    canvas = Image.new("RGB", (WIDTH, HEIGHT), (8, 46, 27))
    draw = ImageDraw.Draw(canvas)
    
    t = frame_idx / max(1, total_frames - 1)
    scale = 1.0 + 0.06 * t
    
    # Scale logo smoothly
    lw, lh = logo_img.size
    target_w = int(270 * scale)
    target_h = int((270 * (lh / lw)) * scale)
    scaled_logo = logo_img.resize((target_w, target_h), Image.Resampling.LANCZOS)
    
    lx = (WIDTH - target_w) // 2
    ly = (HEIGHT // 2) - target_h - 30
    
    if scaled_logo.mode == 'RGBA':
        canvas.paste(scaled_logo, (lx, ly), scaled_logo)
    else:
        canvas.paste(scaled_logo, (lx, ly))
        
    # Official Typography below logo
    font_brand = get_font(FONT_GEORGIA_BOLD, 50)
    brand_text = "S P E I S E L Y"
    bbox = font_brand.getbbox(brand_text)
    tw = bbox[2] - bbox[0]
    draw.text(((WIDTH - tw) // 2, ly + target_h + 35), brand_text, font=font_brand, fill=(246, 244, 235))
    
    # Journal Subtitle
    font_sub = get_font(FONT_ARIAL, 22)
    sub_text = "GASTRONOMIE-JOURNAL · AUSGABE 01"
    sbox = font_sub.getbbox(sub_text)
    sw = sbox[2] - sbox[0]
    draw.text(((WIDTH - sw) // 2, ly + target_h + 105), sub_text, font=font_sub, fill=(230, 184, 74))
    
    # Double Luxury Gold Border
    draw.rectangle([45, 45, WIDTH - 45, HEIGHT - 45], outline=(230, 184, 74, 150), width=2)
    draw.rectangle([55, 55, WIDTH - 55, HEIGHT - 55], outline=(230, 184, 74, 70), width=1)
    return canvas

def render_pure_magazine_glide(page_img, crop_start, crop_end, frame_idx, total_frames):
    """
    Cinematic macro glide over the actual magazine spread.
    No artificial overlapping pills - pure, uncompromised editorial layout.
    """
    t = frame_idx / max(1, total_frames - 1)
    ease = ease_out_cubic(t)
    
    pw, ph = page_img.size
    
    cx = crop_start[0] + (crop_end[0] - crop_start[0]) * ease
    cy = crop_start[1] + (crop_end[1] - crop_start[1]) * ease
    cw = crop_start[2] + (crop_end[2] - crop_start[2]) * ease
    ch = crop_start[3] + (crop_end[3] - crop_start[3]) * ease
    
    left = max(0, int(cx * pw))
    top = max(0, int(cy * ph))
    right = min(pw, int((cx + cw) * pw))
    bottom = min(ph, int((cy + ch) * ph))
    
    cropped = page_img.crop((left, top, right, bottom))
    canvas = cropped.resize((WIDTH, HEIGHT), Image.Resampling.LANCZOS).convert("RGBA")
    
    # Very subtle, ultra-soft studio lighting vignette
    vignette = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
    vdraw = ImageDraw.Draw(vignette)
    for y in range(160):
        alpha = int(120 * (1.0 - (y / 160.0) ** 1.3))
        vdraw.line([(0, y), (WIDTH, y)], fill=(6, 16, 11, alpha))
    for y in range(HEIGHT - 160, HEIGHT):
        alpha = int(140 * (((y - (HEIGHT - 160)) / 160.0) ** 1.3))
        vdraw.line([(0, y), (WIDTH, y)], fill=(6, 16, 11, alpha))
    canvas = Image.alpha_composite(canvas, vignette)
    
    # Fine gold outer frame line
    draw = ImageDraw.Draw(canvas)
    draw.rectangle([25, 25, WIDTH - 25, HEIGHT - 25], outline=(230, 184, 74, 90), width=1)
    
    return canvas.convert("RGB")

def render_outro(frame_idx, total_frames):
    """
    Scene 5: The Speisely Verified Dossier & Call to Action
    """
    canvas = Image.new("RGB", (WIDTH, HEIGHT), (8, 42, 25))
    draw = ImageDraw.Draw(canvas)
    
    # Outer luxury gold border
    draw.rectangle([45, 45, WIDTH - 45, HEIGHT - 45], outline=(230, 184, 74, 160), width=2)
    draw.rectangle([55, 55, WIDTH - 55, HEIGHT - 55], outline=(230, 184, 74, 80), width=1)
    
    # Header
    font_h = get_font(FONT_ARIAL_BOLD, 22)
    head_txt = "SPEISELY JOURNAL · KIEZ-DOSSIER"
    hbbox = font_h.getbbox(head_txt)
    draw.text(((WIDTH - (hbbox[2] - hbbox[0])) // 2, 210), head_txt, font=font_h, fill=(230, 184, 74))
    
    # Title
    font_t = get_font(FONT_GEORGIA_BOLD, 54)
    t1 = "Restaurant Mandy"
    t2 = "Berlin-Neukölln"
    tb1 = font_t.getbbox(t1)
    tb2 = font_t.getbbox(t2)
    draw.text(((WIDTH - (tb1[2] - tb1[0])) // 2, 310), t1, font=font_t, fill=(255, 255, 255))
    draw.text(((WIDTH - (tb2[2] - tb2[0])) // 2, 380), t2, font=font_t, fill=(246, 244, 235))
    
    # Gold divider line
    draw.line([(WIDTH // 2 - 120, 470), (WIDTH // 2 + 120, 470)], fill=(230, 184, 74), width=2)
    
    # Editorial Quote
    font_q = get_font(FONT_GEORGIA, 32)
    q1 = "„Ein Festmahl, das nicht nach Hast verlangt –"
    q2 = "sondern zum Verweilen und Teilen einlädt.“"
    qb1 = font_q.getbbox(q1)
    qb2 = font_q.getbbox(q2)
    draw.text(((WIDTH - (qb1[2] - qb1[0])) // 2, 530), q1, font=font_q, fill=(235, 240, 235))
    draw.text(((WIDTH - (qb2[2] - qb2[0])) // 2, 575), q2, font=font_q, fill=(235, 240, 235))
    
    # Key Facts Card in Center
    draw.rounded_rectangle([130, 670, WIDTH - 130, 1050], radius=24, fill=(10, 26, 16), outline=(230, 184, 74, 180), width=1)
    font_fact_h = get_font(FONT_ARIAL_BOLD, 20)
    font_fact_v = get_font(FONT_GEORGIA_BOLD, 30)
    
    draw.text((170, 710), "SIGNATURE GERICHT", font=font_fact_h, fill=(230, 184, 74))
    draw.text((170, 740), "Mandi Lamm für 2 Personen", font=font_fact_v, fill=(255, 255, 255))
    
    draw.text((170, 820), "STANDORT & KIEZ", font=font_fact_h, fill=(230, 184, 74))
    draw.text((170, 850), "Wildenbruchstraße 4 · Neukölln", font=font_fact_v, fill=(255, 255, 255))
    
    draw.text((170, 930), "PREIS-TRANSPARENZ", font=font_fact_h, fill=(230, 184, 74))
    draw.text((170, 960), "Ca. 45 € inkl. Beilagen & Chai", font=font_fact_v, fill=(255, 255, 255))
    
    # Official Seal / Stamp (clean text without broken unicode stars)
    font_stamp = get_font(FONT_ARIAL_BOLD, 24)
    stamp_text = "SPEISELY VISITS · VOR-ORT GEPRÜFT"
    stb = font_stamp.getbbox(stamp_text)
    draw.text(((WIDTH - (stb[2] - stb[0])) // 2, 1140), stamp_text, font=font_stamp, fill=(230, 184, 74))
    
    # Final Call to Action Button
    draw.rounded_rectangle([150, 1260, WIDTH - 150, 1350], radius=20, fill=(230, 184, 74), outline=(255, 255, 255), width=2)
    font_cta = get_font(FONT_ARIAL_BOLD, 26)
    cta_txt = "Lies den kompletten Artikel auf speisely.de"
    ctb = font_cta.getbbox(cta_txt)
    draw.text(((WIDTH - (ctb[2] - ctb[0])) // 2, 1288), cta_txt, font=font_cta, fill=(8, 38, 24))
    
    return canvas

def main():
    print("Rendering Pure Editorial Living Journal Reel...")
    output_dir = r"C:\recoverd usb\Speisely Marketplace1\public\magazin\mandy"
    os.makedirs(output_dir, exist_ok=True)
    output_mp4 = os.path.join(output_dir, "speisely_mandy_living_journal_reel.mp4")
    
    logo = Image.open(r"C:\recoverd usb\Speisely Marketplace1\public\speisely_official_logo.png")
    page12 = Image.open(r"C:\Users\ahmad\.gemini\antigravity\brain\b308feef-2d4d-4563-b7d6-d6991ec44c51\.user_uploaded\media_1791876451303_b32653bb.png")
    page13 = Image.open(r"C:\Users\ahmad\.gemini\antigravity\brain\b308feef-2d4d-4563-b7d6-d6991ec44c51\.user_uploaded\media_1791876451263_b549131b.png")
    
    fourcc = cv2.VideoWriter_fourcc(*'mp4v')
    out = cv2.VideoWriter(output_mp4, fourcc, FPS, (WIDTH, HEIGHT))
    
    frame_count = 0
    
    # Scene 1: Brand Seal (45 frames = 1.5s)
    for f in range(45):
        frame = render_brand_intro(logo, f, 45)
        if f >= 39:
            next_f = render_pure_magazine_glide(page12, (0.01, 0.02, 0.98, 0.56), (0.02, 0.05, 0.94, 0.52), 0, 65)
            frame = Image.blend(frame, next_f, (f - 39) / 6.0)
        out.write(cv2.cvtColor(np.array(frame), cv2.COLOR_RGB2BGR))
        frame_count += 1
        
    # Scene 2: Page 12 Headline Glide (65 frames = 2.16s)
    for f in range(65):
        frame = render_pure_magazine_glide(page12, (0.01, 0.02, 0.98, 0.56), (0.02, 0.06, 0.94, 0.50), f, 65)
        if f >= 59:
            next_f = render_pure_magazine_glide(page12, (0.04, 0.35, 0.92, 0.34), (0.08, 0.36, 0.84, 0.30), 0, 65)
            frame = Image.blend(frame, next_f, (f - 59) / 6.0)
        out.write(cv2.cvtColor(np.array(frame), cv2.COLOR_RGB2BGR))
        frame_count += 1
        
    # Scene 3: Page 12 Food Photography Macro (65 frames = 2.16s)
    for f in range(65):
        frame = render_pure_magazine_glide(page12, (0.04, 0.35, 0.92, 0.34), (0.08, 0.36, 0.84, 0.30), f, 65)
        if f >= 59:
            next_f = render_pure_magazine_glide(page13, (0.01, 0.08, 0.98, 0.56), (0.02, 0.32, 0.96, 0.48), 0, 65)
            frame = Image.blend(frame, next_f, (f - 59) / 6.0)
        out.write(cv2.cvtColor(np.array(frame), cv2.COLOR_RGB2BGR))
        frame_count += 1
        
    # Scene 4: Page 13 Feinschmecker-Einblicke & Pull-Quote (65 frames = 2.16s)
    for f in range(65):
        frame = render_pure_magazine_glide(page13, (0.01, 0.08, 0.98, 0.56), (0.02, 0.32, 0.96, 0.48), f, 65)
        if f >= 59:
            next_f = render_outro(0, 60)
            frame = Image.blend(frame, next_f, (f - 59) / 6.0)
        out.write(cv2.cvtColor(np.array(frame), cv2.COLOR_RGB2BGR))
        frame_count += 1
        
    # Scene 5: Verified Gastro-Dossier Outro (60 frames = 2.0s)
    for f in range(60):
        frame = render_outro(f, 60)
        out.write(cv2.cvtColor(np.array(frame), cv2.COLOR_RGB2BGR))
        frame_count += 1
        
    out.release()
    print(f"Render complete! Exported {frame_count} frames to {output_mp4}")
    print(f"File size: {os.path.getsize(output_mp4) / (1024*1024):.2f} MB")

if __name__ == "__main__":
    main()
