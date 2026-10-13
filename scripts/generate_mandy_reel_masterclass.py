import os
import math
import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageFilter
import cv2

WIDTH = 1080
HEIGHT = 1920
FPS = 30

FONT_GEORGIA_BOLD = "C:/Windows/Fonts/georgiab.ttf"
FONT_ARIAL_BOLD = "C:/Windows/Fonts/arialbd.ttf"
FONT_SEGOE_BOLD = "C:/Windows/Fonts/segoeuib.ttf"
FONT_CALIBRI_BOLD = "C:/Windows/Fonts/calibrib.ttf"

def get_font(path, size):
    try:
        return ImageFont.truetype(path, size)
    except Exception:
        return ImageFont.load_default()

def create_cinematic_vignette(width, height):
    """
    Creates an editorial dual-zone vignette:
    - Top 38% has a smooth gradient to ensure headline readability while keeping food visible.
    - Bottom 32% has a smooth gradient to ensure footer readability.
    - The middle 30% is completely clear and pristine so the food is the hero.
    """
    img = Image.new("RGBA", (width, height), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    # Top gradient (height 650px)
    for y in range(650):
        # Soft curve
        p = y / 650.0
        alpha = int(220 * ((1.0 - p) ** 1.4))
        draw.line([(0, y), (width, y)], fill=(5, 14, 9, alpha))
        
    # Bottom gradient (height 600px)
    for y in range(height - 600, height):
        p = (y - (height - 600)) / 600.0
        alpha = int(230 * (p ** 1.3))
        draw.line([(0, y), (width, y)], fill=(5, 14, 9, alpha))
        
    return img

def draw_frosted_badge(draw, text, font, center_x, center_y, 
                       bg_color=(8, 30, 18, 225), 
                       border_color=(230, 184, 74, 210), 
                       text_color=(246, 244, 235), 
                       px=26, py=12, radius=18, border_w=2):
    bbox = font.getbbox(text)
    tw = bbox[2] - bbox[0]
    th = bbox[3] - bbox[1]
    x0 = center_x - tw // 2 - px
    y0 = center_y - th // 2 - py
    x1 = center_x + tw // 2 + px
    y1 = center_y + th // 2 + py
    draw.rounded_rectangle([x0, y0, x1, y1], radius=radius, fill=bg_color, outline=border_color, width=border_w)
    draw.text((center_x - tw // 2, center_y - th // 2 - 2), text, font=font, fill=text_color)

def draw_luxury_headline(draw, lines, font_title, center_x, top_y, 
                         highlight_idx=None, highlight_color=(243, 202, 101),
                         text_color=(251, 249, 241), shadow_color=(0, 0, 0, 240)):
    """
    Renders editorial headline with dual-layer drop-shadow (hard shadow + soft atmospheric depth).
    """
    line_h = 72
    for i, line in enumerate(lines):
        bbox = font_title.getbbox(line)
        lw = bbox[2] - bbox[0]
        lx = center_x - lw // 2
        ly = top_y + i * line_h
        
        # Soft diffuse shadow
        for sx, sy in [(-2, 2), (2, 2), (0, 3), (3, 3), (4, 4)]:
            draw.text((lx + sx, ly + sy), line, font=font_title, fill=(0, 0, 0, 140))
        # Deep hard shadow
        draw.text((lx + 3, ly + 3), line, font=font_title, fill=shadow_color)
        
        col = highlight_color if (highlight_idx == i) else text_color
        draw.text((lx, ly), line, font=font_title, fill=col)

def interpolate_box(start_box, end_box, t):
    """Smooth ease-out interpolation for camera pan & zoom."""
    # Ease-out cubic: starts with momentum, gently floats to finish
    ease = 1.0 - math.pow(1.0 - t, 3)
    
    cur_x = start_box[0] + (end_box[0] - start_box[0]) * ease
    cur_y = start_box[1] + (end_box[1] - start_box[1]) * ease
    cur_w = start_box[2] + (end_box[2] - start_box[2]) * ease
    cur_h = start_box[3] + (end_box[3] - start_box[3]) * ease
    return cur_x, cur_y, cur_w, cur_h

def render_scene_frame(img, scene, t, frame_idx, total_frames):
    img_w, img_h = img.size
    
    # 1. Camera Animation (Speed ramp -> cinematic settle)
    cur_x, cur_y, cur_w, cur_h = interpolate_box(scene["start_box"], scene["end_box"], t)
    
    left = max(0, int(cur_x * img_w))
    top = max(0, int(cur_y * img_h))
    right = min(img_w, int((cur_x + cur_w) * img_w))
    bottom = min(img_h, int((cur_y + cur_h) * img_h))
    
    cropped = img.crop((left, top, right, bottom))
    frame = cropped.resize((WIDTH, HEIGHT), Image.Resampling.LANCZOS).convert("RGBA")
    
    # 2. Cinematic Editorial Dual-Zone Vignette (Protects text, keeps center food 100% open & glowing)
    vignette = create_cinematic_vignette(WIDTH, HEIGHT)
    frame = Image.alpha_composite(frame, vignette)
    
    draw = ImageDraw.Draw(frame)
    
    # Kinetic Text Alpha (Fast fade-in in first 10 frames = 0.33s)
    text_alpha = min(1.0, frame_idx / 10.0) if frame_idx < 10 else 1.0
    
    # 3. Top Category Pill (Safe Zone Y=280)
    font_badge = get_font(FONT_ARIAL_BOLD, 22)
    draw_frosted_badge(draw, scene["category_badge"], font_badge, WIDTH // 2, 280,
                       bg_color=(8, 32, 20, int(230 * text_alpha)),
                       border_color=(230, 184, 74, int(210 * text_alpha)),
                       text_color=(246, 244, 235))
    
    # 4. Editorial Headline (Upper Third Y=355 to 495 - NEVER blocks the center meat!)
    font_title = get_font(FONT_GEORGIA_BOLD, 52)
    draw_luxury_headline(draw, scene["headline_lines"], font_title, WIDTH // 2, 355,
                         highlight_idx=scene.get("highlight_idx", None),
                         highlight_color=(243, 202, 101),
                         text_color=(255, 255, 255))
    
    # 5. Middle/Lower Subtitle Pill (Anchored just above the food Y=525)
    if "subtitle" in scene:
        font_sub = get_font(FONT_ARIAL_BOLD, 25)
        draw_frosted_badge(draw, scene["subtitle"], font_sub, WIDTH // 2, 530,
                           bg_color=(12, 24, 18, int(220 * text_alpha)),
                           border_color=(255, 255, 255, int(60 * text_alpha)),
                           text_color=(235, 240, 235),
                           px=24, py=10, radius=16, border_w=1)
        
    # 6. Lower Sensory Pill (Y=1430 - inside lower safe zone, clearly above IG caption)
    if "footer_label" in scene:
        font_foot = get_font(FONT_SEGOE_BOLD, 26)
        foot_col = scene.get("footer_color", (243, 202, 101))
        draw_frosted_badge(draw, scene["footer_label"], font_foot, WIDTH // 2, 1430,
                           bg_color=(6, 18, 12, int(235 * text_alpha)),
                           border_color=foot_col,
                           text_color=foot_col,
                           px=26, py=12, radius=18, border_w=2)
        
    return frame.convert("RGB")

def main():
    print("Rendering Masterclass Edition Reel (1080x1920, 5 Shots, Kinetic Editorial)...")
    output_dir = r"C:\recoverd usb\Speisely Marketplace1\public\magazin\mandy"
    os.makedirs(output_dir, exist_ok=True)
    output_mp4 = os.path.join(output_dir, "mandy_berlin_reel_masterclass.mp4")
    
    # Load all 5 distinct high-res food & restaurant assets
    img_feast = Image.open(r"C:\Users\ahmad\.gemini\antigravity\brain\b308feef-2d4d-4563-b7d6-d6991ec44c51\.user_uploaded\media_1791876120254_82e4b932.jpg")
    img_shoulder = Image.open(r"C:\Users\ahmad\.gemini\antigravity\brain\b308feef-2d4d-4563-b7d6-d6991ec44c51\.user_uploaded\media_1791876129157_867dd75c.png")
    img_shanks = Image.open(r"C:\Users\ahmad\.gemini\antigravity\brain\b308feef-2d4d-4563-b7d6-d6991ec44c51\.user_uploaded\media_1791876129227_e79ec145.png")
    img_salsa = Image.open(r"C:\Users\ahmad\.gemini\antigravity\brain\b308feef-2d4d-4563-b7d6-d6991ec44c51\.user_uploaded\media_1791876141619_67f2b74b.webp")
    img_outro = Image.open(r"C:\Users\ahmad\.gemini\antigravity\brain\b308feef-2d4d-4563-b7d6-d6991ec44c51\.user_uploaded\media_1791876146724_f0d64cec.png")
    
    # 5 Shots x 60 frames = 300 frames total (10.0 seconds)
    # Perfect high-retention rapid pacing (2.0s per shot)
    scenes = [
        # Shot 1: The Hook (Overhead Festive Spread)
        {
            "img": img_feast,
            "frames": 60,
            "start_box": (0.02, 0.02, 0.96, 0.96),
            "end_box": (0.12, 0.12, 0.76, 0.76), # Fast push-in to the spread
            "category_badge": "SPEISELY VISITS · BERLIN-NEUKÖLLN",
            "headline_lines": ["Vergiss normales", "Fleisch mit Reis."],
            "highlight_idx": 0,
            "subtitle": "Das Geheimnis von echtem jemenitischem Mandi",
            "footer_label": "4–6 Stunden im versiegelten Lehmofen"
        },
        # Shot 2: The Oven Craft (Golden Roasted Shoulder)
        {
            "img": img_shoulder,
            "frames": 60,
            "start_box": (0.05, 0.12, 0.86, 0.86),
            "end_box": (0.08, 0.02, 0.80, 0.80), # Diagonal drift highlighting crispy crust
            "category_badge": "TRADITIONELLES SCHONGAR-HANDWERK",
            "headline_lines": ["Kein Kochen.", "Kein Braten."],
            "highlight_idx": 1,
            "subtitle": "Schmort langsam bei konstanter Hitze",
            "footer_label": "Der Knochen fällt ohne Messer ab"
        },
        # Shot 3: The Tenderness (Braised Lamb Shanks on Spiced Basmati)
        {
            "img": img_shanks,
            "frames": 60,
            "start_box": (0.08, 0.08, 0.84, 0.84),
            "end_box": (0.16, 0.16, 0.68, 0.68), # Macro push into juicy braised meat
            "category_badge": "100% REINE FLEISCHQUALITÄT",
            "headline_lines": ["Butterzart.", "Schmilzt im Mund."],
            "highlight_idx": 0,
            "subtitle": "Das Fleisch hängt direkt über dem Reis",
            "footer_label": "Bratensaft tropft stundenlang nach unten"
        },
        # Shot 4: The Rice & Salsa (Smoky Rice & Fiery Sahawiq)
        {
            "img": img_salsa,
            "frames": 60,
            "start_box": (0.06, 0.06, 0.88, 0.88),
            "end_box": (0.14, 0.14, 0.72, 0.72), # Push-in towards the tomato-chili Sahawiq
            "category_badge": "RAUCHAROMA & FEUER",
            "headline_lines": ["Jedes Reiskorn", "voller Bratensaft."],
            "highlight_idx": 1,
            "subtitle": "Kardamom · Nelken · Scharfe Sahawiq-Salsa",
            "footer_label": "Dazu heißer Chai Adeni mit Gewürzen"
        },
        # Shot 5: Outro & The Verdict (Mandy Restaurant Berlin)
        {
            "img": img_outro,
            "frames": 60,
            "start_box": (0.04, 0.04, 0.92, 0.92),
            "end_box": (0.10, 0.10, 0.80, 0.80), # Majestic settle
            "category_badge": "DER SPEISELY VERIFIZIERTE TIPP",
            "headline_lines": ["Mandy Restaurant", "Happy Jemen Berlin"],
            "highlight_idx": 0,
            "subtitle": "Riesige Festplatte für 2 Personen · ca. 45 €",
            "footer_label": "Lies den kompletten Artikel auf speisely.de",
            "footer_color": (243, 202, 101)
        }
    ]
    
    fourcc = cv2.VideoWriter_fourcc(*'mp4v')
    out = cv2.VideoWriter(output_mp4, fourcc, FPS, (WIDTH, HEIGHT))
    
    total_frames = sum(s["frames"] for s in scenes)
    rendered_count = 0
    
    for s_idx, scene in enumerate(scenes):
        s_frames = scene["frames"]
        for f in range(s_frames):
            t = f / max(1, s_frames - 1)
            frame_pil = render_scene_frame(scene["img"], scene, t, f, s_frames)
            
            # Smooth 6-frame cross-dissolve into next shot
            if f >= s_frames - 6 and s_idx < len(scenes) - 1:
                next_scene = scenes[s_idx + 1]
                next_pil = render_scene_frame(next_scene["img"], next_scene, 0.0, 0, next_scene["frames"])
                blend_alpha = (f - (s_frames - 6)) / 6.0
                frame_pil = Image.blend(frame_pil, next_pil, blend_alpha)
                
            frame_np = np.array(frame_pil)
            frame_bgr = cv2.cvtColor(frame_np, cv2.COLOR_RGB2BGR)
            out.write(frame_bgr)
            rendered_count += 1
            
    out.release()
    print(f"Render complete! {rendered_count} frames exported to {output_mp4}")
    print(f"Video file size: {os.path.getsize(output_mp4) / (1024*1024):.2f} MB")

if __name__ == "__main__":
    main()
