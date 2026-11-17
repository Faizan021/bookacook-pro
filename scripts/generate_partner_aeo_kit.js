import fs from 'fs';
import path from 'path';

// =============================================================================
// SPEISELY — Partner AEO Kit Generator
// =============================================================================
// Generates a tailored AEO bundle for any partner's individual website:
// - llms.txt for AI search crawlers (ChatGPT, Perplexity, Gemini)
// - schema.html (JSON-LD structured data for Google Knowledge Graph)
// - widget.html (Verified Speisely Partner embed badge)
// =============================================================================

function parseArgs() {
  const args = process.argv.slice(2);
  const options = {
    name: 'Partyservice Küpper',
    city: 'Mönchengladbach',
    slug: 'partyservice-kuepper',
    website: 'https://partyservicekuepper.de',
    radius: '60',
    fingerfood: '14,50 €',
    buffet: '18,50 €',
    gala: '34,00 €',
    minOrder: '250,00 €',
    phone: '+49 2161 000000',
    email: 'info@partyservicekuepper.de',
    halal: 'Halal-zertifizierte Fleischoptionen auf Vorbestellung verfügbar',
  };

  for (let i = 0; i < args.length; i += 2) {
    const key = args[i].replace(/^--/, '');
    const val = args[i + 1];
    if (key && val) {
      options[key] = val;
    }
  }

  return options;
}

const config = parseArgs();
const outputDir = path.join(process.cwd(), 'dist', 'partner-kits', config.slug);

fs.mkdirSync(outputDir, { recursive: true });

const templateDir = path.join(process.cwd(), 'templates', 'partner-aeo-kit');

function processTemplate(templateName, replacements) {
  const templatePath = path.join(templateDir, templateName);
  let content = fs.readFileSync(templatePath, 'utf8');

  for (const [key, val] of Object.entries(replacements)) {
    content = content.replaceAll(`{{${key}}}`, val);
  }

  return content;
}

const replacements = {
  BUSINESS_NAME: config.name,
  CATEGORY: 'Catering & Event-Partyservice',
  CITY: config.city,
  STATE: 'NRW',
  RADIUS_KM: config.radius,
  SLUG: config.slug,
  WEBSITE_URL: config.website,
  CUISINE_DESCRIPTION: 'Frisches BBQ, handgemachtes Fingerfood, rustikale und moderne Buffets sowie exklusive Event-Menüs für Hochzeiten, Geburtstage und Firmenfeiern.',
  PRICE_FINGERFOOD: config.fingerfood,
  PRICE_BUFFET: config.buffet,
  PRICE_GALA: config.gala,
  MIN_ORDER: config.minOrder,
  HALAL_STATUS: config.halal,
  PHONE: config.phone,
  EMAIL: config.email,
  LOGO_OR_HERO_URL: `${config.website}/logo.png`,
  PRICE_RANGE: '€€',
  CUISINE_LIST: 'BBQ, Fingerfood, Deutsches Buffet, Event-Catering',
  STREET_ADDRESS: 'Hauptstraße 1',
  POSTAL_CODE: '41061',
  INSTAGRAM_URL: 'https://instagram.com/speisely',
};

// 1. Write llms.txt
const llmsContent = processTemplate('llms.txt.template', replacements);
fs.writeFileSync(path.join(outputDir, 'llms.txt'), llmsContent, 'utf8');

// 2. Write schema.html
const schemaContent = processTemplate('schema.html.template', replacements);
fs.writeFileSync(path.join(outputDir, 'schema.html'), schemaContent, 'utf8');

// 3. Write widget-embed.html
const widgetContent = processTemplate('widget-embed.html.template', replacements);
fs.writeFileSync(path.join(outputDir, 'widget-embed.html'), widgetContent, 'utf8');

// 4. Write README.txt
const readme = `Speisely AEO Partner Kit für: ${config.name}
==================================================

1. llms.txt:
   Lade diese Datei direkt in das Hauptverzeichnis (Root) deiner Website hoch:
   -> https://${config.website.replace(/^https?:\/\//, '')}/llms.txt
   Dadurch können ChatGPT Search, Perplexity und Apple Intelligence dein Angebot sofort lesen.

2. schema.html:
   Kopiere den Inhalt dieser Datei in den <head>-Bereich deiner Startseite (HTML / WordPress Header / Webflow Head Code).
   Dadurch erkennt Google dein Catering als verifizierte regionale Entität.

3. widget-embed.html:
   Füge dieses Badge in den Footer oder die Kontaktseite deiner Website ein.
   Es verifiziert deine Partnerschaft und ermöglicht direkte, provisionsfreie Anfragen.
`;
fs.writeFileSync(path.join(outputDir, 'README.txt'), readme, 'utf8');

console.log(`✨ AEO Partner Kit successfully generated for "${config.name}" in:`);
console.log(`   ${path.relative(process.cwd(), outputDir)}/`);
