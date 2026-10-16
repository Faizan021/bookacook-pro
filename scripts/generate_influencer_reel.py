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
FONT_SEGOE = "C:/Windows/Fonts/segoeui.ttf"

def get_font(path, size):
    try:
        return ImageFont.truetype(path, size)
    except Exception:
        return ImageFont.load_default()

def ease_in_out(t):
    return 0.5 - 0.5 * math.cos(math.pi * t)

def create_blur_fill_frame(img, target_w=WIDTH, target_h=HEIGHT, zoom_factor=1.04):
    """
    Creates a high-end influencer blurred backdrop so horizontal images
    never have black bars, with the crisp subject floating in center.
    """
    iw, ih = img.size
    scale_bg = max(target_w / iw, target_h / ih) * 1.15
    bg_w, bg_h = int(iw * scale_bg), int(ih * scale_bg)
    bg = img.resize((bg_w, bg_h), Image.Resampling.BILINEAR)
    
    bg_left = (bg_w - target_w) // 2
    bg_top = (bg_h - target_h) // 2
    bg = bg.crop((bg_left, bg_top, bg_left + target_w, bg_top + target_h))
    
    # Gaussian blur & ambient darkening
    bg = bg.filter(ImageFilter.GaussianBlur(radius=36))
    dark_overlay = Image.new("RGBA", (target_w, target_h), (8, 18, 12, 140))
    bg = Image.alpha_composite(bg.convert("RGBA"), dark_overlay)
    
    # Foreground: Crisp centered subject
    fg_scale = (target_w * 0.94) / iw
    fg_w = int(iw * fg_scale * zoom_factor)
    fg_h = int(ih * fg_scale * zoom_factor)
    fg = img.resize((fg_w, fg_h), Image.Resampling.LANCZOS).convert("RGBA")
    
    # Soft rounded mask
    mask = Image.new("L", (fg_w, fg_h), 0)
    ImageDraw.Draw(mask).rounded_rectangle([0, 0, fg_w, fg_h], radius=24, fill=255)
    
    # Soft drop shadow
    shadow = Image.new("RGBA", (target_w, target_h), (0, 0, 0, 0))
    fg_x = (target_w - fg_w) // 2
    fg_y = (target_h - fg_h) // 2
    ImageDraw.Draw(shadow).rounded_rectangle([fg_x - 6, fg_y - 6, fg_x + fg_w + 6, fg_y + fg_h + 6], radius=28, fill=(0, 0, 0, 160))
    shadow = shadow.filter(ImageFilter.GaussianBlur(radius=20))
    
    bg = Image.alpha_composite(bg, shadow)
    bg.paste(fg, (fg_x, fg_y), mask)
    
    # Subtle champagne gold border
    draw = ImageDraw.Draw(bg)
    draw.rounded_rectangle([fg_x, fg_y, fg_x + fg_w, fg_y + fg_h], radius=24, outline=(230, 184, 74, 180), width=2)
    
    return bg

def create_floating_magazine_frame(page_img, t, target_w=WIDTH, target_h=HEIGHT):
    """
    Renders the magazine page in true, proportional aspect ratio with ZERO stretching,
    ZERO blur, and a subtle kinetic slow-zoom floating over an ambient blurred backdrop.
    """
    pw, ph = page_img.size
    
    # Smooth kinetic zoom: 0.90 to 0.93 width scale (never blurry, 100% retina sharp)
    ease = ease_in_out(t)
    base_scale = (target_w * 0.89) / pw
    current_scale = base_scale * (1.0 + 0.04 * ease)
    
    new_w = int(pw * current_scale)
    new_h = int(ph * current_scale)
    scaled_page = page_img.resize((new_w, new_h), Image.Resampling.LANCZOS)
    
    # Background: Ambient blurred version
    bg_scale = max(target_w / pw, target_h / ph) * 1.15
    bg_w, bg_h = int(pw * bg_scale), int(ph * bg_scale)
    bg_full = page_img.resize((bg_w, bg_h), Image.Resampling.BILINEAR)
    bg_left = (bg_w - target_w) // 2
    bg_top = (bg_h - target_h) // 2
    bg_crop = bg_full.crop((bg_left, bg_top, bg_left + target_w, bg_top + target_h))
    bg_blur = bg_crop.filter(ImageFilter.GaussianBlur(radius=42))
    dark_overlay = Image.new("RGBA", (target_w, target_h), (6, 20, 14, 195))
    comp = Image.alpha_composite(bg_blur.convert("RGBA"), dark_overlay)
    
    # Floating shadow
    px = (target_w - new_w) // 2
    py = (target_h - new_h) // 2
    shadow = Image.new("RGBA", (target_w, target_h), (0, 0, 0, 0))
    s_draw = ImageDraw.Draw(shadow)
    s_draw.rounded_rectangle([px - 8, py - 8, px + new_w + 8, py + new_h + 8], radius=24, fill=(0, 0, 0, 200))
    shadow = shadow.filter(ImageFilter.GaussianBlur(radius=26))
    comp = Image.alpha_composite(comp, shadow)
    
    # Rounded mask for magazine page
    mask = Image.new("L", (new_w, new_h), 0)
    ImageDraw.Draw(mask).rounded_rectangle([0, 0, new_w, new_h], radius=20, fill=255)
    comp.paste(scaled_page, (px, py), mask)
    
    # Subtle champagne gold border
    draw = ImageDraw.Draw(comp)
    draw.rounded_rectangle([px, py, px + new_w, py + new_h], radius=20, outline=(230, 184, 74, 200), width=2)
    
    # Top badge completely above page (outside safe zone, in dark blur)
    font_badge = get_font(FONT_SEGOE_BOLD, 22)
    draw_pill(draw, "NEU IM SPEISELY JOURNAL", font_badge, target_w // 2, 170,
              bg_color=(8, 28, 18, 235), border_color=(230, 184, 74, 210), text_color=(246, 244, 235))
    
    # Bottom pill completely below page (outside safe zone, in dark blur)
    font_foot = get_font(FONT_SEGOE_BOLD, 24)
    draw_pill(draw, "Lies den ganzen Testbericht auf speisely.de >>", font_foot, target_w // 2, 1755,
              bg_color=(8, 24, 15, 235), border_color=(230, 184, 74, 230), text_color=(230, 184, 74))
              
    return comp

def create_full_bleed_frame(img, t, start_crop, end_crop, target_w=WIDTH, target_h=HEIGHT):
    """
    100% Edge-to-Edge full bleed crop for food photos with smooth slow pan/zoom.
    Ensures crop box matches target 9:16 aspect ratio exactly so there is NEVER stretching!
    """
    iw, ih = img.size
    ease = ease_in_out(t)
    
    # Target aspect ratio is 9:16 = target_w / target_h
    target_aspect = target_w / target_h
    
    # Interpolate crop center and size
    cx = start_crop[0] + (end_crop[0] - start_crop[0]) * ease
    cy = start_crop[1] + (end_crop[1] - start_crop[1]) * ease
    cw = start_crop[2] + (end_crop[2] - start_crop[2]) * ease
    
    # Height is strictly locked to aspect ratio:
    pixel_w = cw * iw
    pixel_h = pixel_w / target_aspect
    
    left = max(0, int(cx * iw))
    top = max(0, int(cy * ih))
    right = min(iw, int(left + pixel_w))
    bottom = min(ih, int(top + pixel_h))
    
    cropped = img.crop((left, top, right, bottom))
    frame = cropped.resize((target_w, target_h), Image.Resampling.LANCZOS).convert("RGBA")
    
    # Subtle top/bottom vignette
    vignette = Image.new("RGBA", (target_w, target_h), (0, 0, 0, 0))
    vdraw = ImageDraw.Draw(vignette)
    for y in range(260):
        alpha = int(120 * ((1.0 - (y / 260.0)) ** 1.4))
        vdraw.line([(0, y), (target_w, y)], fill=(6, 16, 10, alpha))
    for y in range(target_h - 260, target_h):
        alpha = int(120 * ((((y - (target_h - 260)) / 260.0)) ** 1.4))
        vdraw.line([(0, y), (target_w, y)], fill=(6, 16, 10, alpha))
    return Image.alpha_composite(frame, vignette)

def draw_pill(draw, text, font, center_x, center_y, 
              bg_color=(10, 24, 16, 225), 
              border_color=(230, 184, 74, 200), 
              text_color=(246, 244, 235), 
              px=24, py=10, radius=18):
    bbox = font.getbbox(text)
    tw = bbox[2] - bbox[0]
    th = bbox[3] - bbox[1]
    x0 = center_x - tw // 2 - px
    y0 = center_y - th // 2 - py
    x1 = center_x + tw // 2 + px
    y1 = center_y + th // 2 + py
    draw.rounded_rectangle([x0, y0, x1, y1], radius=radius, fill=bg_color, outline=border_color, width=2)
    draw.text((center_x - tw // 2, center_y - th // 2 - 2), text, font=font, fill=text_color)

def draw_headline(draw, text, font, center_x, center_y, fill_color=(255, 255, 255)):
    bbox = font.getbbox(text)
    tw = bbox[2] - bbox[0]
    x = center_x - tw // 2
    y = center_y
    for sx, sy in [(-1, 2), (1, 2), (0, 2)]:
        draw.text((x + sx, y + sy), text, font=font, fill=(0, 0, 0, 180))
    draw.text((x, y), text, font=font, fill=fill_color)

def render_influencer_scene(scene_data, t, frame_idx, total_frames):
    img = scene_data.get("img")
    mode = scene_data["mode"]
    
    # 1. Base Visual
    if mode == "blur_fill":
        zoom = 1.0 + 0.05 * ease_in_out(t)
        frame = create_blur_fill_frame(img, zoom_factor=zoom)
    elif mode == "floating_magazine":
        frame = create_floating_magazine_frame(img, t)
    elif mode == "full_bleed":
        frame = create_full_bleed_frame(img, t, scene_data["start_crop"], scene_data["end_crop"])
    elif mode == "brand_outro":
        frame = Image.new("RGBA", (WIDTH, HEIGHT), (8, 42, 25, 255))
        draw_b = ImageDraw.Draw(frame)
        # Double gold border
        draw_b.rectangle([45, 45, WIDTH - 45, HEIGHT - 45], outline=(230, 184, 74, 180), width=2)
        draw_b.rectangle([55, 55, WIDTH - 55, HEIGHT - 55], outline=(230, 184, 74, 80), width=1)
        
        # Logo with subtle zoom
        logo = scene_data["logo"]
        lw, lh = logo.size
        scale = 1.0 + 0.04 * ease_in_out(t)
        tw = int(320 * scale)
        th = int((320 * (lh / lw)) * scale)
        scaled_logo = logo.resize((tw, th), Image.Resampling.LANCZOS)
        lx = (WIDTH - tw) // 2
        ly = 650
        if scaled_logo.mode == 'RGBA':
            frame.paste(scaled_logo, (lx, ly), scaled_logo)
        else:
            frame.paste(scaled_logo, (lx, ly))
            
    draw = ImageDraw.Draw(frame)
    
    # 2. Top Badge
    if "top_badge" in scene_data:
        font_badge = get_font(FONT_SEGOE_BOLD, 22)
        draw_pill(draw, scene_data["top_badge"], font_badge, WIDTH // 2, scene_data.get("top_badge_y", 280),
                  bg_color=(10, 26, 17, 230), border_color=(230, 184, 74, 210), text_color=(246, 244, 235))
        
    # 3. Main Headline
    if "headline" in scene_data:
        font_title = get_font(FONT_GEORGIA_BOLD, 52)
        draw_headline(draw, scene_data["headline"], font_title, WIDTH // 2, scene_data.get("headline_y", 355),
                      fill_color=scene_data.get("headline_color", (255, 255, 255)))
        
    # 4. Subtitle Pill
    if "subtitle" in scene_data:
        font_sub = get_font(FONT_SEGOE_BOLD, 24)
        draw_pill(draw, scene_data["subtitle"], font_sub, WIDTH // 2, scene_data.get("subtitle_y", 445),
                  bg_color=(12, 20, 15, 220), border_color=(255, 255, 255, 80), text_color=(235, 240, 235),
                  px=22, py=9, radius=16)
        
    # 5. Footer Pill
    if "footer_pill" in scene_data:
        font_foot = get_font(FONT_SEGOE_BOLD, 26)
        draw_pill(draw, scene_data["footer_pill"], font_foot, WIDTH // 2, scene_data.get("footer_pill_y", 1600),
                  bg_color=(8, 24, 15, 235), border_color=(230, 184, 74, 230), text_color=(230, 184, 74),
                  px=26, py=12, radius=18)
        
    # Extra bottom CTA if specified
    if "footer_cta" in scene_data:
        font_cta = get_font(FONT_SEGOE_BOLD, 24)
        draw_pill(draw, scene_data["footer_cta"], font_cta, WIDTH // 2, scene_data.get("footer_cta_y", 1360),
                  bg_color=(12, 34, 22, 240), border_color=(255, 255, 255, 120), text_color=(246, 244, 235),
                  px=24, py=10, radius=16)
        
    return frame.convert("RGB")

def main():
    print("Generating High-End Instagram Influencer Edition Reel (Senior Editor Master Version)...")
    output_dir = r"C:\recoverd usb\Speisely Marketplace1\public\magazin\mandy"
    os.makedirs(output_dir, exist_ok=True)
    output_mp4 = os.path.join(output_dir, "speisely_mandy_influencer_reel.mp4")
    
    # Load clean images
    brain_dir = r"C:\Users\ahmad\.gemini\antigravity\brain\b308feef-2d4d-4563-b7d6-d6991ec44c51"
    img_dom = Image.open(os.path.join(brain_dir, "clean_berliner_dom.jpg"))
    img_page12 = Image.open(r"C:\recoverd usb\Speisely Marketplace1\public\instagram\post_5_page_12_mandy_story.png")
    img_shoulder = Image.open(os.path.join(brain_dir, ".user_uploaded", "media_1791876129157_867dd75c.png"))
    img_shanks = Image.open(os.path.join(brain_dir, ".user_uploaded", "media_1791876129227_e79ec145.png"))
    logo = Image.open(r"C:\recoverd usb\Speisely Marketplace1\public\speisely_official_logo.png")
    
    # 5 Scenes:
    # Scene 1: Festival of Lights Hook (Clean Hook in dark sky, blur-fill, no black bars)
    # Scene 2: Floating Magazine Page (High-Res 1040x1480, ZERO blur, true proportions, gold border)
    # Scene 3: Slow-roasted Lamb Shoulder macro (Food is HERO! Single clean bottom pill)
    # Scene 4: Feast Platter for two macro (Food is HERO! Single clean bottom pill)
    # Scene 5: Outro Brand Card (Clean Speisely luxury outro with centered CTA)
    scenes = [
        # Scene 1: Festival of Lights Hook
        {
            "mode": "blur_fill",
            "img": img_dom,
            "frames": 60,
            "top_badge": "BERLIN FESTIVAL OF LIGHTS 2026",
            "top_badge_y": 280,
            "headline": "Wohin danach essen gehen?",
            "headline_y": 350,
            "subtitle": "Der Geheimtipp abseits von Berlin-Mitte",
            "subtitle_y": 440,
            "footer_pill": "Ab nach Neukölln zum echten Steinofen-Mandi >>",
            "footer_pill_y": 1460
        },
        # Scene 2: High-Definition Floating Magazine Page (Senior Video Editor Perfection)
        {
            "mode": "floating_magazine",
            "img": img_page12,
            "frames": 55
        },
        # Scene 3: Lamb Shoulder Macro (Food is 100% HERO!)
        {
            "mode": "full_bleed",
            "img": img_shoulder,
            "frames": 60,
            "start_crop": (0.06, 0.10, 0.60),
            "end_crop": (0.10, 0.04, 0.54),
            "footer_pill": "4–6 Std. im Lehmofen · Butterweich geschmort",
            "footer_pill_y": 1640
        },
        # Scene 4: Platter for Two Macro (Food is 100% HERO!)
        {
            "mode": "full_bleed",
            "img": img_shanks,
            "frames": 55,
            "start_crop": (0.06, 0.06, 0.58),
            "end_crop": (0.12, 0.12, 0.52),
            "footer_pill": "Große Festplatte für zwei · Restaurant Mandy",
            "footer_pill_y": 1640
        },
        # Scene 5: Outro Brand Card
        {
            "mode": "brand_outro",
            "logo": logo,
            "frames": 55,
            "top_badge": "SPEISELY VISITS · BERLIN",
            "top_badge_y": 360,
            "headline": "Speisely Journal · Ausgabe 01",
            "headline_y": 440,
            "subtitle": "Ehrliche Gastronomie & Festkultur",
            "subtitle_y": 525,
            "footer_pill": "Artikel online lesen · speisely.de",
            "footer_pill_y": 1280,
            "footer_cta": "Link in Bio >>",
            "footer_cta_y": 1360
        }
    ]
    
    fourcc = cv2.VideoWriter_fourcc(*'mp4v')
    out = cv2.VideoWriter(output_mp4, fourcc, FPS, (WIDTH, HEIGHT))
    
    frame_count = 0
    preview_frames = []
    
    for s_idx, scene in enumerate(scenes):
        s_frames = scene["frames"]
        mid_frame = None
        for f in range(s_frames):
            t = f / max(1, s_frames - 1)
            frame_pil = render_influencer_scene(scene, t, f, s_frames)
            
            # Save middle frame for visual inspection
            if f == s_frames // 2:
                mid_frame = frame_pil.copy()
            
            # 6-frame smooth cross-dissolve
            if f >= s_frames - 6 and s_idx < len(scenes) - 1:
                next_scene = scenes[s_idx + 1]
                next_pil = render_influencer_scene(next_scene, 0.0, 0, next_scene["frames"])
                blend_alpha = (f - (s_frames - 6)) / 6.0
                frame_pil = Image.blend(frame_pil, next_pil, blend_alpha)
                
            frame_np = np.array(frame_pil)
            out.write(cv2.cvtColor(frame_np, cv2.COLOR_RGB2BGR))
            frame_count += 1
            
        if mid_frame:
            preview_frames.append((s_idx + 1, mid_frame))
            
    out.release()
    print(f"Initial render complete! Exported {frame_count} frames to {output_mp4}")
    
    # Re-encode with modern H.264 (AVC1), YUV420p, faststart, and AAC audio for 100% browser & Instagram compatibility
    import subprocess, imageio_ffmpeg, shutil
    ffmpeg_exe = imageio_ffmpeg.get_ffmpeg_exe()
    final_h264 = output_mp4.replace(".mp4", "_h264.mp4")
    
    cmd = [
        ffmpeg_exe, '-y',
        '-i', output_mp4,
        '-f', 'lavfi', '-i', 'anullsrc=channel_layout=stereo:sample_rate=44100',
        '-c:v', 'libx264',
        '-pix_fmt', 'yuv420p',
        '-profile:v', 'main',
        '-level', '4.0',
        '-preset', 'fast',
        '-crf', '20',
        '-c:a', 'aac',
        '-b:a', '128k',
        '-shortest',
        '-movflags', '+faststart',
        final_h264
    ]
    res = subprocess.run(cmd, capture_output=True, text=True)
    if res.returncode == 0:
        shutil.move(final_h264, output_mp4)
        print(f"H.264 browser-compatible encode complete! Final size: {os.path.getsize(output_mp4) / (1024*1024):.2f} MB")
        
        # Copy to Downloads and Desktop
        user_home = os.path.expanduser('~')
        target_dl = os.path.join(user_home, 'Downloads', 'speisely_mandy_influencer_reel.mp4')
        shutil.copyfile(output_mp4, target_dl)
        print(f"Copied to Downloads: {target_dl}")
        
        for d_name in ['OneDrive/Desktop', 'Desktop']:
            dt_dir = os.path.join(user_home, d_name)
            if os.path.exists(dt_dir):
                target_dt = os.path.join(dt_dir, 'speisely_mandy_influencer_reel.mp4')
                shutil.copyfile(output_mp4, target_dt)
                print(f"Copied to Desktop: {target_dt}")
                break
    else:
        print(f"FFmpeg error: {res.stderr}")
    
    # Save preview stills to inspect
    for s_num, pimg in preview_frames:
        still_path = os.path.join(brain_dir, f"influencer_v3_shot{s_num}.jpg")
        pimg.save(still_path, "JPEG", quality=95)
        print(f"Saved still: {still_path}")

if __name__ == "__main__":
    main()
