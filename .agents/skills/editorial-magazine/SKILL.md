---
name: editorial-magazine
description: Authoritative Luxury Editorial Magazine standards for Speisely, including 4:3 retina passe-partout framing, unobstructed food showcase, anti-AI voice guidelines, and truth-in-editorial integrity.
---

# Speisely Luxury Editorial Magazine Standard

Follow these rules whenever writing, auditing, or designing articles, Community Stories, or Speisely Visits.

---

## 1. Mandatory Magazine Image Standard (Policy for All Articles)

1. **Zero Blurry / Wide Room Snapshots:**
   - Never use wide-angle, low-light, or soft ambient room photos.
   - Only use crisp, close-up, mouth-watering food photos, signature dishes, or sharp architectural logo details.

2. **Unified Aspect Ratio & Dimensions:**
   - ALL images in an article must share identical aspect ratios (strictly standard 4:3 ratio, e.g. 800×600 px or 1200×900 px).
   - Zero dimension mismatches allowed across an article.

3. **Luxury Passe-Partout Framing (No Giant Desktop Stretching):**
   - Never stretch small phone photos to full-width containers across desktop screens.
   - Every image MUST be enclosed in a compact, high-density retina frame (`max-w-xl mx-auto` or 2-column `max-w-2xl mx-auto grid`) with a double-layer gallery border:
     `relative overflow-hidden rounded-3xl border-2 border-forest/15 bg-white p-3 shadow-xl transition-all duration-300 hover:border-[#E6B84A] hover:shadow-2xl`

4. **Strictly Zero In-Image Floating Badges (100% Unobstructed Food Showcase):**
   - **STRICTLY PROHIBITED:** Never place floating badge pills, tag chips, or text overlays directly over food photographs (`absolute top-...` or `absolute bottom-...` covering the image canvas). Food dishes (pastries, glazes, meats, garnishes) must remain 100% visible, crisp, and completely unobstructed.
   - **Standard Placement:**
     - For cards in grids or lists: Place badges cleanly in the card text body directly above or below the title (`<div className="inline-flex items-center gap-1.5 ...">`).
     - For standalone editorial figures: Place badges and credits in the figure caption bar beneath the photo container.
   - Always append cache-busting query strings (`?v=1`) to image paths so client browsers never display stale or unsharpened assets.

---

## 2. Anti-AI Writing Framework & "Speisely Pro" Voice Standard

1. **Anti-AI Writing Rules:**
   - Ban generic AI clichés: Avoid words like *tapestry, testament, delve, elevate, symphony of flavors, nestled, culinary journey, vibrant*.
   - Replace with precise, sensory food journalism: Mention specific cooking methods (beechwood charcoal grill, 40 dough layers, 18-hour cold fermentation), verified addresses, and authentic guest context.
   - Tone: Prestigious, authoritative, deeply knowledgeable, yet inviting and warm.

---

## 3. Truth-in-Editorial, Anti-Numerical & Visual Integrity Standard

1. **Zero Fabricated Numbers:**
   - Never invent statistical percentages (e.g. *98.7% satisfaction rate*) unless backed by real verified data.
   - For real metrics (like PageSpeed 99+ or +120% inquiries), cite the exact benchmark context.
2. **Transparent Disclosures:**
   - Always specify the disclosure type on community and on-site visits (`selbst-bezahlt`, `eingeladen`, or `gesponsert / verifizierter Partner`).
