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
FONT_ARIAL = "C:/Windows/Fonts/arial.ttf"
FONT_SEGOE_BOLD = "C:/Windows/Fonts/segoeuib.ttf"

def get_font(path, size):
    try:
        return ImageFont.truetype(path, size)
    except Exception:
        return ImageFont.load_default()

def create_gradient_overlay(width, height, top_alpha=0.60, bottom_alpha=0.75):
    """Creates a smooth luxury dark vignette top and bottom."""
    img = Image.new("RGBA", (width, height), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    # Top gradient
    for y in range(480):
        alpha = int(255 * top_alpha * (1 - (y / 480) ** 1.2))
        draw.line([(0, y), (width, y)], fill=(6, 16, 11, alpha))
    # Bottom gradient
    for y in range(height - 520, height):
        progress = (y - (height - 520)) / 520
        alpha = int(255 * bottom_alpha * (progress ** 1.2))
        draw.line([(0, y), (width, y)], fill=(6, 16, 11, alpha))
    return img

def render_pill(draw, text, font, center_x, center_y, bg_color=(12, 28, 19, 230), border_color=(230, 184, 74, 210), text_color=(246, 244, 235), px=28, py=13, radius=20):
    bbox = font.getbbox(text)
    tw = bbox[2] - bbox[0]
    th = bbox[3] - bbox[1]
    x0 = center_x - tw // 2 - px
    y0 = center_y - th // 2 - py
    x1 = center_x + tw // 2 + px
    y1 = center_y + th // 2 + py
    draw.rounded_rectangle([x0, y0, x1, y1], radius=radius, fill=bg_color, outline=border_color, width=2)
    draw.text((center_x - tw // 2, center_y - th // 2 - 2), text, font=font, fill=text_color)

def render_headline_card(draw, lines, font_title, subtitle, font_sub, center_x, center_y, bg_color=(8, 22, 15, 230), border_color=(230, 184, 74, 180)):
    """Renders a luxury frosted dark card container for 100% legibility."""
    line_bboxes = [font_title.getbbox(l) for l in lines]
    max_lw = max((b[2] - b[0]) for b in line_bboxes)
    sub_bbox = font_sub.getbbox(subtitle) if subtitle else (0, 0, 0, 0)
    sub_w = sub_bbox[2] - sub_bbox[0]
    
    card_w = max(max_lw, sub_w) + 80
    card_h = len(lines) * 66 + (55 if subtitle else 0) + 40
    
    x0 = center_x - card_w // 2
    y0 = center_y - card_h // 2
    x1 = center_x + card_w // 2
    y1 = center_y + card_h // 2
    
    # Rounded card with gold rim
    draw.rounded_rectangle([x0, y0, x1, y1], radius=28, fill=bg_color, outline=border_color, width=2)
    
    # Title lines
    curr_y = y0 + 26
    for i, line in enumerate(lines):
        bbox = line_bboxes[i]
        lw = bbox[2] - bbox[0]
        lx = center_x - lw // 2
        draw.text((lx + 2, curr_y + 2), line, font=font_title, fill=(0, 0, 0, 200))
        draw.text((lx, curr_y), line, font=font_title, fill=(255, 255, 255))
        curr_y += 66
        
    # Subtitle pill / text
    if subtitle:
        curr_y += 8
        lx = center_x - sub_w // 2
        draw.text((lx, curr_y), subtitle, font=font_sub, fill=(230, 184, 74))

def crop_and_pan(pil_img, t, start_box, end_box):
    img_w, img_h = pil_img.size
    ease_t = 0.5 - 0.5 * math.cos(math.pi * t)
    
    cur_x = start_box[0] + (end_box[0] - start_box[0]) * ease_t
    cur_y = start_box[1] + (end_box[1] - start_box[1]) * ease_t
    cur_w = start_box[2] + (end_box[2] - start_box[2]) * ease_t
    cur_h = start_box[3] + (end_box[3] - start_box[3]) * ease_t
    
    left = max(0, int(cur_x * img_w))
    top = max(0, int(cur_y * img_h))
    right = min(img_w, int((cur_x + cur_w) * img_w))
    bottom = min(img_h, int((cur_y + cur_h) * img_h))
    
    cropped = pil_img.crop((left, top, right, bottom))
    return cropped.resize((WIDTH, HEIGHT), Image.Resampling.LANCZOS)

def build_scene_frame(bg_image, scene_config, t, frame_idx, total_scene_frames):
    frame = crop_and_pan(bg_image, t, scene_config["start_box"], scene_config["end_box"]).convert("RGBA")
    
    # Luxury gradient overlay
    gradient = create_gradient_overlay(WIDTH, HEIGHT, top_alpha=0.55, bottom_alpha=0.75)
    frame = Image.alpha_composite(frame, gradient)
    
    draw = ImageDraw.Draw(frame)
    
    # Brand Top Mark (Y=280)
    font_brand = get_font(FONT_ARIAL_BOLD, 22)
    render_pill(draw, scene_config["top_pill"], font_brand, WIDTH // 2, 280, 
                bg_color=(10, 26, 17, 235), border_color=(230, 184, 74, 210), text_color=(246, 244, 235))
    
    # Central Luxury Frosted Card (Y=560)
    font_title = get_font(FONT_GEORGIA_BOLD, 50)
    font_sub = get_font(FONT_ARIAL_BOLD, 26)
    render_headline_card(draw, scene_config["lines"], font_title, scene_config.get("subtitle", ""), font_sub,
                         WIDTH // 2, 560, bg_color=(8, 22, 15, 235), border_color=(230, 184, 74, 180))
    
    # Footer Highlight Badge (Y=1440)
    if "footer_badge" in scene_config:
        font_foot = get_font(FONT_SEGOE_BOLD, 25)
        foot_color = scene_config.get("footer_color", (230, 184, 74))
        render_pill(draw, scene_config["footer_badge"], font_foot, WIDTH // 2, 1440,
                    bg_color=(6, 18, 12, 235), border_color=foot_color, text_color=foot_color)
        
    return frame.convert("RGB")

def main():
    print("Starting Mandy Berlin Reel Render (Polished Edition)...")
    output_dir = r"C:\recoverd usb\Speisely Marketplace1\public\magazin\mandy"
    os.makedirs(output_dir, exist_ok=True)
    output_mp4 = os.path.join(output_dir, "mandy_berlin_reel_1080x1920.mp4")
    
    img_spread = Image.open(r"C:\Users\ahmad\.gemini\antigravity\brain\b308feef-2d4d-4563-b7d6-d6991ec44c51\.user_uploaded\media_1791876120254_82e4b932.jpg")
    img_shoulder = Image.open(r"C:\Users\ahmad\.gemini\antigravity\brain\b308feef-2d4d-4563-b7d6-d6991ec44c51\.user_uploaded\media_1791876129157_867dd75c.png")
    img_shanks = Image.open(r"C:\Users\ahmad\.gemini\antigravity\brain\b308feef-2d4d-4563-b7d6-d6991ec44c51\.user_uploaded\media_1791876129227_e79ec145.png")
    # For outro: use the high-contrast lamb cuts on seasoned saffron rice
    img_outro = Image.open(r"C:\Users\ahmad\.gemini\antigravity\brain\b308feef-2d4d-4563-b7d6-d6991ec44c51\.user_uploaded\media_1791876146724_f0d64cec.png")
    
    scenes = [
        {
            "img": img_spread,
            "frames": 75,
            "start_box": (0.04, 0.04, 0.92, 0.92),
            "end_box": (0.16, 0.16, 0.68, 0.68), # Smooth zoom into festive spread
            "top_pill": "SPEISELY VISITS · BERLIN-NEUKÖLLN",
            "lines": ["Vergiss normales", "Fleisch mit Reis."],
            "subtitle": "Das Geheimnis von jemenitischem Mandi",
            "footer_badge": "4–6 Stunden im versiegelten Lehmofen"
        },
        {
            "img": img_shoulder,
            "frames": 75,
            "start_box": (0.08, 0.12, 0.84, 0.84),
            "end_box": (0.10, 0.02, 0.78, 0.78), # Slow pan across golden roasted shoulder
            "top_pill": "TRADITIONELLE SCHONGARMETHODE",
            "lines": ["Butterweich gegart.", "Der Knochen fällt ab."],
            "subtitle": "Kein Messer nötig · Fleisch schmilzt im Mund",
            "footer_badge": "Mandy Restaurant · Wildenbruchstr. 4"
        },
        {
            "img": img_shanks,
            "frames": 75,
            "start_box": (0.06, 0.08, 0.86, 0.86),
            "end_box": (0.15, 0.15, 0.70, 0.70), # Smooth zoom on spiced basmati & sahawiq
            "top_pill": "100% WÜRZKRAFT & RAUCHAROMA",
            "lines": ["Jedes Reiskorn vollgesogen", "mit purem Bratensaft."],
            "subtitle": "Kardamom · Nelken · Scharfe Sahawiq-Salsa",
            "footer_badge": "Traditionelle Hadhramaut-Küche"
        },
        {
            "img": img_outro,
            "frames": 75,
            "start_box": (0.05, 0.05, 0.90, 0.90),
            "end_box": (0.10, 0.10, 0.80, 0.80), # Outro presentation
            "top_pill": "VERIFIZIERTE SPEISELY EMPFEHLUNG",
            "lines": ["Mandy Restaurant", "Berlin-Neukölln"],
            "subtitle": "Festtafel für 2 Personen + Chai · ca. 45 €",
            "footer_badge": "Lies den kompletten Test auf speisely.de",
            "footer_color": (230, 184, 74)
        }
    ]
    
    fourcc = cv2.VideoWriter_fourcc(*'mp4v')
    out = cv2.VideoWriter(output_mp4, fourcc, FPS, (WIDTH, HEIGHT))
    
    frame_counter = 0
    for s_idx, scene in enumerate(scenes):
        s_frames = scene["frames"]
        for f in range(s_frames):
            t = f / max(1, s_frames - 1)
            frame_pil = build_scene_frame(scene["img"], scene, t, f, s_frames)
            
            # Cross-dissolve transition in last 8 frames
            if f >= s_frames - 8 and s_idx < len(scenes) - 1:
                next_scene = scenes[s_idx + 1]
                next_pil = build_scene_frame(next_scene["img"], next_scene, 0.0, 0, next_scene["frames"])
                blend_alpha = (f - (s_frames - 8)) / 8.0
                frame_pil = Image.blend(frame_pil, next_pil, blend_alpha)
                
            frame_np = np.array(frame_pil)
            frame_bgr = cv2.cvtColor(frame_np, cv2.COLOR_RGB2BGR)
            out.write(frame_bgr)
            frame_counter += 1
            
    out.release()
    print(f"Render complete! Rendered {frame_counter} frames to {output_mp4}")
    print(f"File size: {os.path.getsize(output_mp4) / (1024*1024):.2f} MB")

if __name__ == "__main__":
    main()
