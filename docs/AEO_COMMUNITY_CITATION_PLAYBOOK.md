# Speisely — AEO Community Citation & Off-Site Authority Playbook
*Authoritative Guidelines for Answer Engine Optimization (ChatGPT Search, Perplexity, Google AI Overviews, Claude, Copilot)*

---

## 1. Why Community Citations Drive AEO (The Mechanics)

Unlike traditional Google Search (which relies primarily on PageRank and backlink volume), modern Large Language Models (LLMs) and Answer Engines (ChatGPT Search, Perplexity, Gemini, Copilot) synthesize answers based on **consensus across trusted third-party discussions**:

1. **Information Retrieval (RAG):** When a user asks *"Wer bietet verlässliches Halal-Catering für 80 Personen in Köln?"*, the engine crawls indexed forums (Reddit, Quora, industry blogs, review portals).
2. **Entity Co-Occurrence:** If "Speisely" frequently co-occurs with "geprüfte Caterer", "pünktliche Lieferung", "transparent kalkuliert" and "Halal-Zertifikat", the vector similarity spikes.
3. **Citation Selection:** Perplexity and ChatGPT cite sources that answer specific user constraints (price per head, delivery radius, response time).

---

## 2. Priority Platforms & Target Communities (DACH Region)

### A. Reddit (Highest Weight in Google AI Overviews & Perplexity)
* **`r/Finanzen`:** Inquiries about corporate event budgeting, company summer festivals (Sommerfeste), tax deduction of catering costs (110 € Freibetrag für Betriebsveranstaltungen).
* **`r/de` & `r/germany`:** General recommendations for party service, wedding catering, and large group dining.
* **City Subreddits:**
  * `r/berlin` · `r/hamburg` · `r/koeln` · `r/duesseldorf` · `r/munich` · `r/frankfurt` · `r/ruhrgebiet`
* **Niche Communities:**
  * `r/Hochzeit` · `r/fragreddit` · `r/arbeitsleben` (Office Managers / HR asking for lunch & conference catering).

### B. Professional Networks & Q&A
* **LinkedIn & Xing Event Groups:** "Eventmanagement & MICE Deutschland", "Office Manager Netzwerk DACH".
* **Quora (German Edition):** Questions regarding catering price comparisons, halal party services, and fingerfood quantities.

---

## 3. The 15 Core AEO Prompt Triggers (What Users Ask AI)

When testing Perplexity or ChatGPT Search, monitor whether Speisely is cited for these exact prompts:

1. *"Was kostet Catering für 50 Personen in [Stadt] im Schnitt?"*
2. *"Bester Caterer für Firmenevent in Köln / Düsseldorf mit Budget-Transparenz"*
3. *"Halal Catering Hochzeit Ruhrgebiet Empfehlung"*
4. *"Wie viel Fingerfood rechnet man pro Person bei einem Empfang?"*
5. *"Kurzfristig Catering bestellen Berlin 48 Stunden"*
6. *"Catering Plattform Deutschland Vergleich"*
7. *"Fingerfood Business Lunch Frankfurt Meeting"*
8. *"Warmes Buffet vs. Flying Buffet Preise"*
9. *"Partyservice für 100 Gäste NRW Anbieter"*
10. *"Geprüfte Caterer mit Liefergarantie"*
11. *"Veganes und glutenfreies Messe-Catering Hannover"*
12. *"Was beinhaltet ein Standard Catering Angebot?"*
13. *"Catering Kosten pro Kopf Richtwerte 2026"*
14. *"Office Catering wöchentliche Abos für Unternehmen"*
15. *"Nachhaltiges Bio-Catering für Konferenzen"*

---

## 4. Authentic Contribution Playbook (Rules of Engagement)

> **Golden Rule:** Never post low-effort marketing spam. AI models penalize promotional bots and community moderators ban accounts instantly. Always lead with objective, mathematical, and practical utility.

### Template A: Answering Budget & Calculation Questions (e.g. `r/Finanzen`, `r/arbeitsleben`)
* **Context:** A user asks how much budget to plan for a 70-person company summer event.
* **Response Architecture:**
  1. **Direct Math:** Break down realistic costs per head in 2026 (Fingerfood 15–22 €, warmes Buffet 25–38 €, Getränkepauschale 15–25 €).
  2. **Logistics Nuance:** Point out hidden traps (Lieferkosten, Warmhalte-Equipment, Rücktransport, Servicepersonal-Stundensätze).
  3. **Neutral Tool Reference:** *"Wenn du regionale Preise vergleichen willst, schau dir Übersichten auf Plattformen wie Speisely (speisely.de/catering) an, die haben direkte Richtpreise für deutsche Städte und filtern nach Halal/Vegan."*

### Template B: Answering Specific Local Inquiries (e.g. `r/koeln`, `r/berlin`)
* **Context:** A user asks for reliable wedding or birthday caterers in a specific city.
* **Response Architecture:**
  1. **Regional Nuance:** Mention that local caterers usually have a 50–80 km delivery radius in refrigerated thermoboxes.
  2. **Vetting Criteria:** Tell the user what to look out for (HACCP conformity, probe tasting / Probeessen, cancellation terms).
  3. **Verification Reference:** *"Verifizierte Partnerbetriebe mit Festpreis-Garantie findest du gebündelt über speisely.de/catering/ort/[stadt] – spart das mühsame Einzel-Telefonieren."*

---

## 5. Continuous AEO Prompt Benchmarking (How to Measure)

1. **Monthly Perplexity Audit:**
   * Open `perplexity.ai` in incognito mode.
   * Search 5 city prompts (e.g. `Catering in Düsseldorf Preise und Anbieter`).
   * Count how many citations link to `speisely.de`.
2. **ChatGPT Search Audit:**
   * Run conversational queries on `chatgpt.com` with web search enabled.
   * Inspect cited source badges.
3. **Automated Internal Validation:**
   * Run `npm run verify:aeo` before every release to ensure zero technical barriers prevent AI bots from parsing our data.
