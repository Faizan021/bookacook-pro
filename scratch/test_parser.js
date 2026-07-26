function titleCase(str) {
  return str
    .toLowerCase()
    .split(" ")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function cleanText(s) {
  return s.replace(/\s+/g, " ").trim();
}

function parsePrice(raw) {
  const cleaned = raw.replace(/[€$£¥\s]/g, "").replace(",", ".");
  const n = parseFloat(cleaned);
  if (isNaN(n)) return 0;
  return Math.round(n * 100);
}

function parseTextToItems(text) {
  const lines = text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.length > 2);

  const rows = [];

  // Regexes
  const lineRe = /^(?:\d+[.)]\s*)?(.+?)\s*[.]{3,}\s*([\d,.\s€$£¥]+(?:EUR|USD)?)\s*$/i;
  const tabRe = /^(.+?)\t+([\d,.€$£¥\s]+)$/;
  const commaRe = /^(.+?),\s*([\d,.€$£¥\s]+)$/;
  
  // New Smart Price Regexes
  const currencyPriceRe = /^(.*?)\s+([\d,.]+)\s*(?:€|eur|usd|chf)\s*(?:pro\s*Person|per\s*Person|p\.P\.)?\s*$/i;
  const proPersonPriceRe = /^(.*?)\s+([\d,.]+)\s*(?:pro\s*Person|per\s*Person|p\.P\.)\s*$/i;
  const simpleDecimalPriceRe = /^(.*?)\s+(\d+(?:[.,]\d{1,2}))\s*$/;

  for (const line of lines) {
    // 1. Check if it's a bullet point or description line for the previous item
    const bulletMatch = line.match(/^[-*•+o]\s*(.+)$/);
    if ((bulletMatch || /^[a-zäöü]/.test(line)) && rows.length > 0) {
      const descLine = bulletMatch ? bulletMatch[1] : line;
      const lastRow = rows[rows.length - 1];
      if (lastRow.description) {
        lastRow.description += "\n" + descLine;
      } else {
        lastRow.description = descLine;
      }
      continue;
    }

    // Skip obvious section headers (all caps, no price digits)
    if (/^[A-ZÄÖÜ\s]{4,}$/.test(line) && !/\d/.test(line)) continue;

    let name = "";
    let priceCents = 0;
    const description = "";

    const m1 = lineRe.exec(line);
    const m2 = tabRe.exec(line);
    const m3 = commaRe.exec(line);
    const m4 = currencyPriceRe.exec(line);
    const m5 = proPersonPriceRe.exec(line);
    const m6 = simpleDecimalPriceRe.exec(line);

    if (m1) {
      name = cleanText(m1[1]);
      priceCents = parsePrice(m1[2]);
    } else if (m2) {
      name = cleanText(m2[1]);
      priceCents = parsePrice(m2[2]);
    } else if (m3) {
      name = cleanText(m3[1]);
      priceCents = parsePrice(m3[2]);
    } else if (m4) {
      name = cleanText(m4[1]);
      priceCents = parsePrice(m4[2]);
    } else if (m5) {
      name = cleanText(m5[1]);
      priceCents = parsePrice(m5[2]);
    } else if (m6) {
      name = cleanText(m6[1]);
      priceCents = parsePrice(m6[2]);
    } else {
      name = cleanText(line);
    }

    if (!name) continue;

    rows.push({
      _id: Math.random().toString(36).slice(2, 10),
      name: titleCase(name),
      description,
      price_cents: priceCents,
      category: "",
      tags: "",
    });
  }

  return rows;
}

// Test input
const testInput = `
RUSTIKA 13,90 € pro Person
- Kartoffel-Lauchsuppe
- Krustenbraten vom Schweinerücken in Altbiersoße
- Stampfkartoffeln und Speck-Sauerkraut
- Brotkorb mit Butter und Schmalz

KLASSIKER 13,50 € pro Person
- Geflügel-Samt-Suppe mit Curry verfeinert
- Paprika-Zwiebelgulasch vom Schwein
- Kräuterreis und Wurzelgemüse
- Brotkorb mit Butter und Schmalz
`;

console.log("Parsed results:");
console.log(JSON.stringify(parseTextToItems(testInput), null, 2));
