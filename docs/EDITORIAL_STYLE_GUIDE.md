# Speisely Editorial & Content Style Guide

This document is the editorial source of truth for Speisely articles,
Community Stories and social content.

## 1. Editorial identity

Speisely tells genuine stories about restaurants, food, catering,
hospitality and events.

Our voice is:

- Warm
- Human
- Sensory
- Culturally respectful
- Locally grounded
- Informative without sounding academic
- Positive without exaggeration
- Editorial rather than promotional

Avoid generic AI language and common food clichés, including:

- culinary journey
- hidden gem
- taste explosion
- something for everyone
- must-visit
- food paradise
- authentic, unless supported by a clear reason
- the best, unless supported by defensible evidence

## 2. Truth before storytelling

Never invent:

- Dishes
- Ingredients
- Prices
- Portion sizes
- Atmosphere
- Smells or sounds
- Staff behaviour
- Cultural or historical facts
- Statements about an owner’s intentions, pride or philosophy
- Ratings
- Testimonials
- Sponsorship status
- Who visited the location

Clearly distinguish between:

1. Confirmed facts
2. The contributor’s personal experience
3. Speisely’s editorial description
4. Information supplied by the business

If an important fact is missing, ask for it or omit it.

## 3. Content types

### A. Speisely Visit

Use only when a Speisely representative genuinely visited.

Disclosure examples:

- Unabhängig besucht und selbst bezahlt.
- Auf Einladung besucht.
- Speisely erhielt einen Rabatt.

### B. Community Story

Use when the experience was submitted by a community member.

Required label:

- Aus der Speisely Community

Do not imply that Speisely personally visited or reviewed the business.

### C. Partner Feature

Use when the business is a Speisely partner or supplied the information.

Clearly identify the commercial or partner relationship.

### D. Catering or Event Story

Focus on the occasion, planning, service, food and guest experience.

Do not force it into a restaurant-review format.

## 4. Flexible story structure

Use the elements that are supported by the available material:

1. **Human opening**  
   Begin with a real moment, observation or question.

2. **Context**  
   Explain why the cuisine, dish, place or occasion matters.
   Include cultural or historical context only when verified.

3. **Experience**  
   Describe what happened, what was ordered and what stood out.

4. **Sensory detail**  
   Use specific textures, aromas, sounds and visual details only when
   observed or supplied by the contributor.

5. **Practical value**  
   Include verified prices, portions, address, ordering tips or accessibility
   information when available and useful.

6. **Meaningful ending**  
   Finish with what made the experience worth sharing.

Not every story needs all six elements.

## 5. Positive editorial policy

Speisely Community is not a public review or complaints platform.

Do not publish:

- Insults
- Accusations
- Unverified negative claims
- Public complaints
- Star ratings
- Rankings
- “Worst restaurant” content
- Public comments from general users

Positive does not mean dishonest. Do not hide commercial relationships or
make unsupported recommendations.

## 6. Photos and videos

Accept only photos and videos created by the contributor.

Submitted media must show:

- No identifiable people; or
- Only the contributor

Do not publish recognizable third parties without confirmed permission.

Before publication, confirm:

- Ownership
- Publication permission
- Editing permission
- Website and social-media usage
- Preferred credit
- Sponsorship, invitation or discount status

## 7. Disclosure rules

Every published story must use the correct disclosure:

- Independently visited and self-paid
- Community submission
- Invited or discounted
- Sponsored
- Speisely partner content

Never write “independent” until the payment status has been confirmed.

## 8. Prices and practical details

Include prices only when:

- Confirmed by the bill, menu or business
- Relevant to the story
- Accompanied by the visit or verification date where appropriate

Do not invent missing prices.

Do not publish outdated prices as current facts.

## 9. German and English

German and English copy must sound natural in their respective languages.

Do not translate word for word.

Preserve:

- Facts
- Meaning
- Disclosure
- Credits
- Emotional tone

The two versions may use different sentence structures.

Only produce both languages when required for that content.

## 10. SEO, GEO, and structured data

Every published article and Community Story must satisfy the complete Local SEO & GEO standard:

### A. Local GEO Meta Tags (Mandatory for verified locations)
- `geo.region`: ISO-3166-2 state code (e.g. `DE-BE`, `DE-NW`, `DE-HE`, `DE-BY`, `DE-HH`)
- `geo.placename`: City or district name (e.g. `Berlin-Neukölln`, `Wiesbaden`, `Mönchengladbach`)
- `geo.position`: Latitude; Longitude coordinates (e.g. `50.0826;8.2367`)
- `ICBM`: Latitude, Longitude pair (e.g. `50.0826, 8.2367`)

### B. High-Intent Local Keywords
Include verified local search keywords covering:
- Restaurant / vendor brand name
- Cuisine and specialty (e.g. *Türkisches Restaurant*, *Jemenitisches Essen*, *Catering*)
- Specific dishes (e.g. *Gegrillter Fisch*, *Chicken Shawarma*, *Mandy Lamm*)
- City, district, and street/landmark (e.g. *Wiesbaden*, *Sonnenallee*, *Schwalbacher Straße*)
- Category labels: *Speisely Community*, *Speisely Visits*, *Speisely Magazin*

### C. Crawl, Indexing & Visual Rich Snippets
- `robots`: `index, follow, max-image-preview:large` (enables Google Discover & rich cards)
- Canonical URL pointing to the definitive `https://speisely.de/...` path
- Social meta: `og:title`, `og:description`, `og:image`, `og:locale` (`de_DE`), `twitter:card` (`summary_large_image`)
- `sitemap.xml`: Every article must be registered with proper priority and lastmod date

### D. Structured Data (JSON-LD)
Prepare:
- Schema type: `Article` or `BlogPosting` (or `NewsArticle` where applicable)
- `contentLocation`: Nested `Restaurant` or `Place` with `PostalAddress` and `GeoCoordinates`
- `BreadcrumbList`: Complete hierarchical breadcrumbs

Do not add:
- Fake `Review` schema
- Fake `AggregateRating` schema
- Fake `Person` author data
- Unsupported commercial claims

Use Community Story or Article positioning rather than Review positioning.

## 11. Link attribution, outbound tracking & telemetry standard

Every article or Community Story featuring a physical restaurant, vendor, or caterer must follow this tracking and attribution standard:

### A. Dual Tracked Action Buttons (Restaurant Info Card)
- **Primary CTA (High Intent):** `Speisekarte ansehen` / `Explore the menu` (or order link).
- **Secondary CTA:** `Website besuchen` / `Visit [Restaurant Name]`.

### B. UTM Parameter Standard for Outbound Links
All external vendor links must include standard UTM campaign tags:
- `utm_source=speisely`
- `utm_medium=referral`
- `utm_campaign=<article_slug>_community_visit` (or `_visit` for editorial visits)
- Links must open safely in a new tab: `target="_blank" rel="noopener"` (no `rel="sponsored"` for independent community content).

### C. First-Party Telemetry & Event Instrumentation
Attach click handlers to record outbound interest in Speisely's consent-gated telemetry:
```tsx
trackEvent("restaurant_menu_click", {
  restaurant_name: "KOKIO Berlin",
  article_slug: "kokio-berlin",
  destination: "lightspeed_menu",
});

trackEvent("restaurant_website_click", {
  restaurant_name: "KOKIO Berlin",
  article_slug: "kokio-berlin",
  destination: "official_website",
});
```

## 12. Marketplace connection

Connect the story to restaurants, catering, events or Community only when the
relationship is natural and useful.

Do not add a forced sales paragraph to every editorial article.

## 13. Final self-audit

Before publication, confirm:

- [ ] Content type is correctly identified
- [ ] Visitor or contributor is correctly attributed
- [ ] No fact or sensory detail was invented
- [ ] Cultural claims are verified with cited sources
- [ ] Prices are confirmed or omitted
- [ ] Correct disclosure is included
- [ ] Photo and video rights are confirmed
- [ ] No unauthorized identifiable person appears
- [ ] No public complaint, rating or unsupported superlative appears
- [ ] Local GEO tags configured (`geo.region`, `geo.placename`, `geo.position`, `ICBM`)
- [ ] High-intent local keywords configured
- [ ] `robots` set to `index, follow, max-image-preview:large`
- [ ] Structured JSON-LD includes valid `contentLocation` and `GeoCoordinates`
- [ ] URL registered in `src/routes/sitemap[.]xml.ts`
- [ ] Dual tracked CTAs with UTM parameters and telemetry event handlers added
- [ ] German and English sound natural where both are required
- [ ] Photo credit is included
- [ ] Metadata reflects the article accurately
- [ ] Community Grid / Hub card updated with uniform styling and new badges if applicable



## 14. Social & Visual Brand Consistency Standard (The 60-30-10 Palette & Grid Rule)

All social carousels, Instagram Reels, cover thumbnails, and editorial teasers must strictly comply with Speisely's visual identity standard:

### 14.1 The 60-30-10 Palette
- **60% Primary Canvas:** Speisely Deep Forest Green (`#083822` / `rgb(8, 56, 34)`).
- **30% Secondary Accent:** Warm Ivory Cream (`#F6F4EB`).
- **10% Luxury Highlight:** Speisely Antique Gold (`#E6B84A`).
- Zero random colors allowed on official social covers or video packaging.

### 14.2 Strict 2-Font Typography
- **Headlines:** Classic Editorial Serif (`Playfair Display` or `Georgia Bold`).
- **Badges, Pills & Body Text:** Modern Clean Sans-Serif (`Plus Jakarta Sans` or `Arial Bold` uppercase).

### 14.3 Dedicated Reel Covers
- Never allow platform algorithms to pick a random, blurry frame as a thumbnail.
- Every video reel must ship with an explicit 9:16 portrait cover image formatted to the 60-30-10 palette with the gold category badge and safe-zone margins.

### 14.4 Profile Grid 3-Way Alternation
- Rotate posts across:
  1. *Macro Sensory Food Action* (extreme close-up).
  2. *Editorial / Brand Card* (forest green graphic with gold insight).
  3. *Architectural Interior* (sunlit dining space/vibe).

### 14.5 Pre-Publish Audit Check
- [ ] 60-30-10 palette strictly enforced.
- [ ] Serif + Sans-Serif font pairing verified.
- [ ] Official Speisely logo seal present on start and end frames.
- [ ] Dedicated 9:16 cover thumbnail included.


## 15. Anti-AI Writing Framework & "Speisely Pro" Voice Standard

All editorial articles, Community Visits, and partner spotlights must strictly adhere to the "Speisely Pro" hybrid voice: combining Lindt-level sensory tactility, journalistic kitchen mechanics, and an independent diner's perspective. Generic, robotic AI text is strictly forbidden.

### 15.1 The Banned AI Cliché Firewall
Never include these hallmark phrases of generic AI generation:
- *„Nestled in the heart of...“* ➔ Use precise street addresses, walking minutes from transit, or neighborhood cross-streets.
- *„A culinary journey / A symphony of flavors / A tapestry of tastes“* ➔ Name the concrete interplay of acid, roast, salt, and heat.
- *„Hidden gem / Food paradise / Best kept secret“* ➔ State the physical room dimensions, seating capacity, or visual character.
- *„Tantalize your tastebuds / Delicious treats / Mouthwatering delights“* ➔ Describe physical mouthfeel: *samtig, knusprig aufbrechend, schmelzend, feucht-elastisch*.
- *„A testament to their passion and dedication“* ➔ Omit completely; describe their exact technical process instead.
- *„Whether you're a foodie or looking for a casual bite...“* ➔ Ban conversational marketing filler; speak directly to discerning adults.

### 15.2 The Burstiness & Sentence Cadence Rule
AI writing is uniformly flat (sentences averaging 15–20 words). Human food writing has dynamic rhythm and syncopation:
- Mix 2-to-4 word punchy statements (*„Warm. Duftend. Dann folgt der Schmelz.“*) with complex, evocative multi-clause sensory sentences.
- Never write three sentences of identical length consecutively.

### 15.3 The Micro-Sensory Physics Rule (The "Lindt" Standard)
Describe micro-textures, viscosities, and tactile physics rather than relying on abstract superlatives:
- **Temperature & Contrast:** *ofenwarm, eisgekühlt, zart schmelzend, rauchig-dunkel*.
- **Viscosity & Body:** *viskoser Dattelsirup, samtig-dichtes Tahini, emulgiertes Olivenöl*.
- **Tactile Sounds & Actions:** *das Aufbrechen einer kristallinen Kruste, das Zischen der Siebträger-Dampflanze, der Schnitt des Löffels durch die Brioche*.

### 15.4 The Honest Nuance & Imperfection Rule (Human Grounding)
Generic AI makes every restaurant sound 100% flawless. Human articles include realistic, helpful operational nuances that establish radical reader trust:
- Mention peak arrival times or wait times (*„Wer samstags nach 11:30 Uhr kommt, sollte 10 Minuten Wartezeit einplanen.“*).
- Highlight bold or acquired flavor profiles honestly (*„Das Tahini ist dunkel und nussig-bitter geröstet – puristische Gaumen schätzen genau das, Einsteiger sollten mit Bedacht probieren.“*).

### 15.5 Kitchen Mechanics & Price Transparency (The "Journalistic" Standard)
- Reveal the technical "Why": mention exact fermentation hours (e.g. *„48 Stunden Kaltgärung“*), blade speeds (e.g. *„bei 3.000 U/min mit Eiswürfeln emulgiert“*), or ingredient origins (e.g. *„Bio-Freiland-Eier aus Brandenburg“*).
- Embed real prices directly into the narrative (*„die Mezze-Platte für 39 Euro“*, *„der Tahini Latte für 4,80 Euro“*).

### 15.6 The Independent Guest Lens (Not Owner PR)
- All Community Visits are framed from the perspective of an observant, independent guest sitting at the table.
- Never write as a company spokesperson or owner mouth-piece. The guest discovers the kitchen craft through table conversation and personal sensory evaluation.

### 15.7 Organic Ecosystem Connection
Close the review by connecting the experience to Speisely's platform naturally:
- Seamless 1-Click WhatsApp table reservations (0 € per cover).
- Direct kitchen online ordering (0% commission).
- B2B corporate catering requests where applicable.


---

## 16. Mandatory Truth-in-Editorial & Anti-Numerical Standard (Zero Forced Numbers & Honest Community Scope)

Whenever writing, editing, or auditing ANY Speisely article, Community Story, or culinary review:
You MUST enforce strict truthfulness, grounded human observation, and zero artificial specifications:

1. **Zero Forced or Invented Numerical Claims:**
   - **STRICTLY PROHIBITED:** Never invent or force technical numbers, arbitrary oven temperatures (e.g. *„exakt 200°C“*), artificial layer counts (e.g. *„40 Schichten“*), fabricated time limits (e.g. *„innerhalb der ersten 4 Minuten verzehren“*), shelf-life days (e.g. *„bis zu 5 Tage haltbar“*), or artificial rating scores (e.g. *„9.8 / 10“*).
   - If a culinary metric is not explicitly stated on the restaurant's printed menu or confirmed by the kitchen, **omit the number entirely**. Let the sensory description, texture, and dining atmosphere carry the article.

2. **Zero Unverified Recipe or Ingredient Speculation:**
   - Never speculate on exotic ingredients or garnish toppings that cannot be 100% verified from the actual dish (e.g. do not invent avocado garnishes or special secret sauces unless directly confirmed by the venue). Describe dishes cleanly, accurately, and honestly.

3. **Mandatory Community Disclosure Note:**
   - Every community-submitted article must include a clear, transparent disclosure box stating:
     - The story is based on an authentic visit shared by a community member.
     - The visuals combine genuine table snapshots from the diner with high-definition presentations from the venue's official media to faithfully showcase the culinary craft.
     - All dishes were independently ordered and paid for.

4. **Zero Exaggerated Claims ("No Claiming Extra"):**
   - Never write hyperbole such as *„so dünn, dass man eine Zeitung durchlesen kann“* or claims of culinary perfection. Write as an appreciative, discerning diner who values genuine craft without exaggerated marketing fluff.
