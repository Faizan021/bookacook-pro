import os
from PIL import Image, ImageDraw, ImageFont

base_dir = r"c:\recoverd usb\Speisely Marketplace1\public\magazin\nadir-gullu"
out_clean = os.path.join(base_dir, "instagram", "clean")
out_text = os.path.join(base_dir, "instagram", "with_text")

os.makedirs(out_clean, exist_ok=True)
os.makedirs(out_text, exist_ok=True)

TARGET_W, TARGET_H = 1080, 1350

# Fonts matching King Tut / Speisely Standard exactly
font_title = ImageFont.truetype(r"C:\Windows\Fonts\georgiab.ttf", 54)
font_badge = ImageFont.truetype(r"C:\Windows\Fonts\arialbd.ttf", 24)
font_sub = ImageFont.truetype(r"C:\Windows\Fonts\arialbd.ttf", 28)
font_foot = ImageFont.truetype(r"C:\Windows\Fonts\arialbd.ttf", 26)

# Speisely Circular Logo
logo_path = r"c:\recoverd usb\Speisely Marketplace1\scratch\speisely_circular_badge_perfect.png"
logo_badge = None
if os.path.exists(logo_path):
    logo_badge = Image.open(logo_path).convert("RGBA").resize((72, 72), Image.Resampling.LANCZOS)

slides_config = [
    {
        "id": "02",
        "name": "slide_02_hero",
        "src": os.path.join(base_dir, "nadir-gullu-havuc-dilimi-landscape.jpg"),
        "badge": "SPEISELY COMMUNITY SPOTLIGHT",
        "title": "ISTANBUL IN MÜNCHEN",
        "sub": "Nadir Güllü · Viktualienmarkt (Abt. VI Stand 1b/2b)",
        "foot": "Swipe für das Meisterwerk >>",
        "crop_focus": "center"
    },
    {
        "id": "03",
        "name": "slide_03_havuc_dilimi",
        "src": os.path.join(base_dir, "nadir-gullu-havuc-dilimi-dondurma.jpg"),
        "badge": "DIE KÖNIGS-BAKLAVA",
        "title": "HAVUÇ DILIMI",
        "sub": "Goldgelb gebacken mit Maraş-Eis & feinsten Boz-Pistazien",
        "foot": "40 Schichten Perfektion >>",
        "crop_focus": "center"
    },
    {
        "id": "04",
        "name": "slide_04_layers",
        "src": os.path.join(base_dir, "nadir-gullu-havuc-dilimi-macro.jpg"),
        "badge": "HANDWERKS-KUNST",
        "title": "DIE 40 SCHICHTEN",
        "sub": "Kırk Kat Teig hauchdünn gerollt · 99.8% reines Urfa Sade Yağ",
        "foot": "Meisterhandwerk seit 1843 >>",
        "crop_focus": "center"
    },
    {
        "id": "05",
        "name": "slide_05_ritual",
        "src": os.path.join(base_dir, "nadir-gullu-havuc-dilimi-landscape.jpg"),
        "badge": "DIE GAUMEN-REGEL",
        "title": "180° KOPFSTAND",
        "sub": "Niemals Besteck · Die Unterseite muss zuerst an den Gaumen",
        "foot": "So entfaltet sich der Schmelz >>",
        "crop_focus": "center"
    },
    {
        "id": "06",
        "name": "slide_06_suborek",
        "src": os.path.join(base_dir, "nadir-gullu-tee-su-boeregi-table.jpg"),
        "badge": "HERZHAFTER GEGENPOL",
        "title": "SU BÖREĞI PAIRING",
        "sub": "Gekochte Teigbänder mit Schafskäse & heißem türkischem Çay",
        "foot": "Klassische Istanbuler Teekultur >>",
        "crop_focus": "center"
    },
    {
        "id": "07",
        "name": "slide_07_espresso",
        "src": os.path.join(base_dir, "nadir-gullu-espresso-baklava-duo.jpg"),
        "badge": "MODERNE SYNERGIE",
        "title": "BAKLAVA & ESPRESSO",
        "sub": "Almighty Coffee Röstung trifft 180 Jahre Bosporus-Tradition",
        "foot": "Die perfekte Genuss-Kombi >>",
        "crop_focus": "center"
    },
    {
        "id": "08",
        "name": "slide_08_outro",
        "src": os.path.join(base_dir, "nadir-gullu-viktualienmarkt-store.jpg"),
        "badge": "BESUCHEN & SPEICHERN",
        "title": "NADIR GÜLLÜ MÜNCHEN",
        "sub": "Viktualienmarkt Abt. VI (Stand 1b/2b) · Täglich frisch · 100% Halal",
        "foot": "Speichere diesen Post für deinen Besuch!",
        "crop_focus": "center"
    }
]

def crop_and_resize(img, target_w, target_h, focus="center"):
    orig_w, orig_h = img.size
    target_ratio = target_w / target_h
    orig_ratio = orig_w / orig_h

    if orig_ratio > target_ratio:
        new_w = int(orig_h * target_ratio)
        if focus == "bottom_right":
            left = orig_w - new_w
        elif focus == "left":
            left = 0
        else:
            left = (orig_w - new_w) // 2
        img = img.crop((left, 0, left + new_w, orig_h))
    else:
        new_h = int(orig_w / target_ratio)
        if focus == "bottom" or focus == "bottom_right":
            top = orig_h - new_h
        elif focus == "top":
            top = 0
        else:
            top = (orig_h - new_h) // 2
        img = img.crop((0, top, orig_w, top + new_h))

    return img.resize((target_w, target_h), Image.Resampling.LANCZOS)

# 1. Slide 1: Pure Minimalist Speisely Brand Seal (AGENTS.md Rule 12)
slide_01_bg = Image.new("RGB", (TARGET_W, TARGET_H), (8, 56, 34)) # #083822 Pure Speisely Forest Green
draw_01 = ImageDraw.Draw(slide_01_bg)

# Draw central gold emblem
if logo_badge:
    seal_large = logo_badge.resize((180, 180), Image.Resampling.LANCZOS)
    slide_01_bg.paste(seal_large, ((TARGET_W - 180) // 2, (TARGET_H - 180) // 2 - 40), seal_large)

font_logo_text = ImageFont.truetype(r"C:\Windows\Fonts\georgiab.ttf", 46)
bbox_l = draw_01.textbbox((0, 0), "Speisely", font=font_logo_text)
lw = bbox_l[2] - bbox_l[0]
draw_01.text(((TARGET_W - lw) // 2, (TARGET_H // 2) + 80), "Speisely", fill=(246, 244, 235), font=font_logo_text)

font_logo_sub = ImageFont.truetype(r"C:\Windows\Fonts\arial.ttf", 20)
bbox_ls = draw_01.textbbox((0, 0), "DAS KURATIERTE GENUSS-MAGAZIN", font=font_logo_sub)
lsw = bbox_ls[2] - bbox_ls[0]
draw_01.text(((TARGET_W - lsw) // 2, (TARGET_H // 2) + 145), "DAS KURATIERTE GENUSS-MAGAZIN", fill=(230, 184, 74), font=font_logo_sub)

slide_01_bg.save(os.path.join(out_clean, "slide_01_speisely_brand.jpg"), quality=95)
slide_01_bg.save(os.path.join(out_text, "slide_01_speisely_brand.jpg"), quality=95)
print("Slide 01 generated.")

# 2. Slides 2 through 8
for idx, s in enumerate(slides_config):
    slide_num_str = f"{idx + 2}/8"
    src_img = Image.open(s["src"]).convert("RGB")
    clean_img = crop_and_resize(src_img, TARGET_W, TARGET_H, s["crop_focus"])
    
    # Save clean
    clean_path = os.path.join(out_clean, f"{s['name']}.jpg")
    clean_img.save(clean_path, quality=95)
    
    # Build overlay image
    overlay_img = clean_img.copy()
    
    # Dual-zone vignette gradient protection
    gradient = Image.new("RGBA", (TARGET_W, TARGET_H), (0, 0, 0, 0))
    draw_g = ImageDraw.Draw(gradient)
    
    for y in range(320):
        alpha = int(195 * (1 - (y / 320)**0.75))
        draw_g.line([(0, y), (TARGET_W, y)], fill=(8, 24, 16, alpha))
        
    for y in range(TARGET_H - 280, TARGET_H):
        rel = (y - (TARGET_H - 280)) / 280
        alpha = int(225 * (rel**0.85))
        draw_g.line([(0, y), (TARGET_W, y)], fill=(8, 24, 16, alpha))
        
    overlay_img = Image.alpha_composite(overlay_img.convert("RGBA"), gradient).convert("RGB")
    draw = ImageDraw.Draw(overlay_img)
    
    # Top Left Brand Mark (Speisely circular badge)
    if logo_badge:
        overlay_img.paste(logo_badge, (40, 42), logo_badge)
        
    # Slide Counter at Top Right
    draw.text((TARGET_W - 95, 48), slide_num_str, fill=(255, 255, 255, 220), font=font_badge)
    
    # Centered Frosted Sage Pill Badge
    badge_text = s["badge"]
    badge_bbox = draw.textbbox((0, 0), badge_text, font=font_badge)
    badge_w = badge_bbox[2] - badge_bbox[0]
    badge_h = badge_bbox[3] - badge_bbox[1]
    
    badge_x = (TARGET_W - badge_w) // 2
    badge_y = 65
    
    pad_x, pad_y = 22, 10
    pill_box = [badge_x - pad_x, badge_y - pad_y, badge_x + badge_w + pad_x, badge_y + badge_h + pad_y]
    draw.rounded_rectangle(pill_box, radius=20, fill=(235, 244, 236, 245), outline=(127, 164, 107, 220), width=2)
    draw.text((badge_x, badge_y - 2), badge_text, fill=(24, 46, 34), font=font_badge)
    
    # Main Headline (Georgia Bold all-caps with drop shadow)
    title_text = s["title"]
    title_bbox = draw.textbbox((0, 0), title_text, font=font_title)
    title_w = title_bbox[2] - title_bbox[0]
    title_x = (TARGET_W - title_w) // 2
    title_y = badge_y + badge_h + pad_y + 24
    
    draw.text((title_x + 2, title_y + 2), title_text, fill=(0, 0, 0, 240), font=font_title)
    draw.text((title_x, title_y), title_text, fill=(255, 255, 255), font=font_title)
    
    # Translucent Dark Subtitle Pill at Bottom
    sub_text = s["sub"]
    sub_bbox = draw.textbbox((0, 0), sub_text, font=font_sub)
    sub_w = sub_bbox[2] - sub_bbox[0]
    sub_h = sub_bbox[3] - sub_bbox[1]
    
    sub_x = (TARGET_W - sub_w) // 2
    sub_y = TARGET_H - 165
    
    sub_pill = [sub_x - 18, sub_y - 8, sub_x + sub_w + 18, sub_y + sub_h + 8]
    draw.rounded_rectangle(sub_pill, radius=12, fill=(15, 25, 20, 205), outline=(255, 255, 255, 60), width=1)
    draw.text((sub_x, sub_y), sub_text, fill=(255, 255, 255), font=font_sub)
    
    # Gold CTA Footer
    foot_text = s["foot"]
    foot_bbox = draw.textbbox((0, 0), foot_text, font=font_foot)
    foot_w = foot_bbox[2] - foot_bbox[0]
    foot_x = (TARGET_W - foot_w) // 2
    foot_y = TARGET_H - 72
    
    draw.text((foot_x + 1, foot_y + 1), foot_text, fill=(0, 0, 0, 240), font=font_foot)
    draw.text((foot_x, foot_y), foot_text, fill=(230, 184, 74), font=font_foot)
    
    text_path = os.path.join(out_text, f"{s['name']}.jpg")
    overlay_img.save(text_path, quality=95)
    print(f"Generated {s['name']}.jpg", flush=True)

# Also copy all 8 with_text slides to Desktop and Downloads for easy access
user_home = os.path.expanduser("~")
dl_target = os.path.join(user_home, "Downloads", "Nadir_Gullu_Instagram_Carousel")
os.makedirs(dl_target, exist_ok=True)

import shutil
for f in os.listdir(out_text):
    if f.endswith(".jpg"):
        shutil.copyfile(os.path.join(out_text, f), os.path.join(dl_target, f))

for dt_cand in ["OneDrive/Desktop", "Desktop"]:
    dt_base = os.path.join(user_home, dt_cand)
    if os.path.exists(dt_base):
        dt_target = os.path.join(dt_base, "Nadir_Gullu_Instagram_Carousel")
        os.makedirs(dt_target, exist_ok=True)
        for f in os.listdir(out_text):
            if f.endswith(".jpg"):
                shutil.copyfile(os.path.join(out_text, f), os.path.join(dt_target, f))
        break

print("All carousel slides generated and copied to user folders successfully!")
