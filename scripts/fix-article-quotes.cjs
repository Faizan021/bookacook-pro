const fs = require('fs');
let c = fs.readFileSync('src/routes/magazin.community.chicken-krush-prag.tsx', 'utf8');

// The paragraphs at line 358-360 contain embedded double-quotes inside JS strings
// We need to find the lines containing the problematic text and fix them
const lines = c.split('\n');

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  
  // Fix the German text containing embedded double quotes that break JSX
  if (line.includes('Slow Fried. Pomalu') && line.includes('\u201e')) {
    // Replace the entire string content — remove the embedded quotes
    lines[i] = line
      .replace(/\u201eSlow Fried\. Pomalu sma\u017een\u00e9\u201c? und \u201eTaste Respect \([^\)]+\)\u201c?/g, 
               'Slow Fried und Taste Respect')
      .replace(/\u201eSlow Fried\. Pomalu sma\u017een\u00e9" und \u201eTaste Respect \([^\)]+\)"/g,
               'Slow Fried und Taste Respect');
    console.log('Fixed line', i+1, '(DE)');
  }
  
  // Fix the English text with unescaped double-quotes inside a double-quoted string
  if (line.includes('"Slow Fried. Pomalu') && line.includes('"Taste Respect')) {
    lines[i] = line
      .replace(/"Slow Fried\. Pomalu sma\u017een\u00e9" and "Taste Respect \([^)]+\)"/g,
               'Slow Fried and Taste Respect')
      .replace(/"Slow Fried\. Pomalu sma\u017een\u00e9" und "Taste Respect \([^)]+\)"/g,
               'Slow Fried and Taste Respect');
    console.log('Fixed line', i+1, '(EN)');
  }
}

const fixed = lines.join('\n');
fs.writeFileSync('src/routes/magazin.community.chicken-krush-prag.tsx', fixed, 'utf8');
console.log('Done. Lines:', lines.length);
