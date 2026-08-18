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

## 11. Marketplace connection

Connect the story to restaurants, catering, events or Community only when the
relationship is natural and useful.

Do not add a forced sales paragraph to every editorial article.

## 12. Final self-audit

Before publication, confirm:

- [ ] Content type is correctly identified
- [ ] Visitor or contributor is correctly attributed
- [ ] No fact or sensory detail was invented
- [ ] Cultural claims are verified
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
- [ ] German and English sound natural where both are required
- [ ] Photo credit is included
- [ ] Metadata reflects the article accurately
- [ ] Marketplace CTA is relevant rather than forced
