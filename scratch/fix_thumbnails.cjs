const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../public/speisely-magazin-edition.html');
let content = fs.readFileSync(filePath, 'utf8');

const oldDrawer = `    <div class="flex items-center gap-3 px-2">
      <!-- 1 -->
      <div onclick="flipbook.flip(0); toggleThumbnails();" class="thumb-item flex-shrink-0 w-16 h-20 bg-[#0C1510] border border-gold/60 rounded cursor-pointer hover:border-gold hover:scale-105 transition flex flex-col justify-between p-1.5 text-white">
        <span class="text-[7.5px] font-bold text-gold font-mono">01</span>
        <span class="text-[7px] text-gray-300 font-serif text-center">Cover</span>
        <span class="text-[6px] text-gold/60 text-right font-mono">Titel</span>
      </div>

      <!-- 2-3 -->
      <div onclick="flipbook.flip(1); toggleThumbnails();" class="thumb-item flex-shrink-0 w-28 h-20 bg-[#0B121A] border border-white/20 rounded cursor-pointer hover:border-gold hover:scale-105 transition flex flex-col justify-between p-1.5 text-white">
        <span class="text-[7.5px] font-bold font-mono text-cyan-300">02-03</span>
        <span class="text-[7px] text-gray-300 font-serif text-center">Speisely Pro & Editorial</span>
        <span class="text-[6px] text-gray-400 text-right font-mono">Intro</span>
      </div>

      <!-- 4-5 -->
      <div onclick="flipbook.flip(3); toggleThumbnails();" class="thumb-item flex-shrink-0 w-28 h-20 bg-[#FAF8F5] border border-forest/20 rounded cursor-pointer hover:border-gold hover:scale-105 transition flex flex-col justify-between p-1.5 text-forest">
        <span class="text-[7.5px] font-bold font-mono text-forest">04-05</span>
        <span class="text-[7px] text-forest font-serif text-center">Wiesn-Hendl &amp; Festkultur</span>
        <span class="text-[6px] text-forest-muted text-right font-mono">Festmahl</span>
      </div>

      <!-- 6-7 -->
      <div onclick="flipbook.flip(5); toggleThumbnails();" class="thumb-item flex-shrink-0 w-28 h-20 bg-[#FAF8F5] border border-forest/20 rounded cursor-pointer hover:border-gold hover:scale-105 transition flex flex-col justify-between p-1.5 text-forest">
        <span class="text-[7.5px] font-bold font-mono text-forest">06-07</span>
        <span class="text-[7px] text-forest font-serif text-center">Speisely Digital &amp; Thronburger</span>
        <span class="text-[6px] text-forest-muted text-right font-mono">Spotlight</span>
      </div>

      <!-- 8-9 -->
      <div onclick="flipbook.flip(7); toggleThumbnails();" class="thumb-item flex-shrink-0 w-28 h-20 bg-[#FAF8F5] border border-forest/20 rounded cursor-pointer hover:border-gold hover:scale-105 transition flex flex-col justify-between p-1.5 text-forest">
        <span class="text-[7.5px] font-bold font-mono text-forest">08-09</span>
        <span class="text-[7px] text-forest font-serif text-center">Alzaeem &amp; Restaurant Mandy</span>
        <span class="text-[6px] text-forest-muted text-right font-mono">Neukölln</span>
      </div>

      <!-- 10 -->
      <div onclick="flipbook.flip(9); toggleThumbnails();" class="thumb-item flex-shrink-0 w-16 h-20 bg-[#FAF8F5] border border-forest/20 rounded cursor-pointer hover:border-gold hover:scale-105 transition flex flex-col justify-between p-1.5 text-forest">
        <span class="text-[7.5px] font-bold font-mono text-forest">10</span>
        <span class="text-[7px] text-forest font-serif text-center">Vergleich</span>
        <span class="text-[6px] text-forest-muted text-right font-mono">Back</span>
      </div>
    </div>`;

const newDrawer = `    <div class="flex items-center gap-3 px-2">
      <!-- 1 -->
      <div onclick="flipbook.flip(0); toggleThumbnails();" class="thumb-item flex-shrink-0 w-16 h-20 bg-[#0C1510] border border-gold/60 rounded cursor-pointer hover:border-gold hover:scale-105 transition flex flex-col justify-between p-1.5 text-white">
        <span class="text-[7.5px] font-bold text-gold font-mono">01</span>
        <span class="text-[7px] text-gray-300 font-serif text-center">Cover</span>
        <span class="text-[6px] text-gold/60 text-right font-mono">Titel</span>
      </div>

      <!-- 2-3 -->
      <div onclick="flipbook.flip(1); toggleThumbnails();" class="thumb-item flex-shrink-0 w-28 h-20 bg-[#0B121A] border border-white/20 rounded cursor-pointer hover:border-gold hover:scale-105 transition flex flex-col justify-between p-1.5 text-white">
        <span class="text-[7.5px] font-bold font-mono text-cyan-300">02-03</span>
        <span class="text-[7px] text-gray-300 font-serif text-center">Speisely Pro &amp; Editorial</span>
        <span class="text-[6px] text-gray-400 text-right font-mono">Intro</span>
      </div>

      <!-- 4-5 -->
      <div onclick="flipbook.flip(3); toggleThumbnails();" class="thumb-item flex-shrink-0 w-28 h-20 bg-[#FAF8F5] border border-forest/20 rounded cursor-pointer hover:border-gold hover:scale-105 transition flex flex-col justify-between p-1.5 text-forest">
        <span class="text-[7.5px] font-bold font-mono text-forest">04-05</span>
        <span class="text-[7px] text-forest font-serif text-center">Wiesn-Hendl &amp; Festkultur</span>
        <span class="text-[6px] text-forest-muted text-right font-mono">Festmahl</span>
      </div>

      <!-- 6-7 -->
      <div onclick="flipbook.flip(5); toggleThumbnails();" class="thumb-item flex-shrink-0 w-28 h-20 bg-[#0B0F14] border border-white/20 rounded cursor-pointer hover:border-gold hover:scale-105 transition flex flex-col justify-between p-1.5 text-white">
        <span class="text-[7.5px] font-bold font-mono text-cyan-300">06-07</span>
        <span class="text-[7px] text-gray-300 font-serif text-center">Digital &amp; Community</span>
        <span class="text-[6px] text-gray-400 text-right font-mono">Gateway</span>
      </div>

      <!-- 8-9 Thronburger -->
      <div onclick="flipbook.flip(7); toggleThumbnails();" class="thumb-item flex-shrink-0 w-28 h-20 bg-[#FAF8F5] border border-forest/20 rounded cursor-pointer hover:border-gold hover:scale-105 transition flex flex-col justify-between p-1.5 text-forest">
        <span class="text-[7.5px] font-bold font-mono text-forest">08-09</span>
        <span class="text-[7px] text-forest font-serif text-center">&#x1F354; Thronburger</span>
        <span class="text-[6px] text-forest-muted text-right font-mono">Friedrichshain</span>
      </div>

      <!-- 10-11 Alzaeem -->
      <div onclick="flipbook.flip(9); toggleThumbnails();" class="thumb-item flex-shrink-0 w-28 h-20 bg-[#FAF8F5] border border-forest/20 rounded cursor-pointer hover:border-gold hover:scale-105 transition flex flex-col justify-between p-1.5 text-forest">
        <span class="text-[7.5px] font-bold font-mono text-forest">10-11</span>
        <span class="text-[7px] text-forest font-serif text-center">&#x1F525; Alzaeem</span>
        <span class="text-[6px] text-forest-muted text-right font-mono">Sonnenallee</span>
      </div>

      <!-- 12-13 Mandy -->
      <div onclick="flipbook.flip(11); toggleThumbnails();" class="thumb-item flex-shrink-0 w-28 h-20 bg-[#FAF8F5] border border-forest/20 rounded cursor-pointer hover:border-gold hover:scale-105 transition flex flex-col justify-between p-1.5 text-forest">
        <span class="text-[7.5px] font-bold font-mono text-forest">12-13</span>
        <span class="text-[7px] text-forest font-serif text-center">&#x1F356; Restaurant Mandy</span>
        <span class="text-[6px] text-forest-muted text-right font-mono">Neukolln</span>
      </div>

      <!-- 14 Back Cover -->
      <div onclick="flipbook.flip(13); toggleThumbnails();" class="thumb-item flex-shrink-0 w-16 h-20 bg-[#FAF8F5] border border-forest/20 rounded cursor-pointer hover:border-gold hover:scale-105 transition flex flex-col justify-between p-1.5 text-forest">
        <span class="text-[7.5px] font-bold font-mono text-forest">14</span>
        <span class="text-[7px] text-forest font-serif text-center">Vergleich</span>
        <span class="text-[6px] text-forest-muted text-right font-mono">Back</span>
      </div>
    </div>`;

if (!content.includes(oldDrawer)) {
  // Try to find it with different line endings
  console.error('Old drawer NOT found! Searching for partial match...');
  const idx = content.indexOf('Alzaeem &amp; Restaurant Mandy');
  console.log('Partial match index:', idx);
  // Show surrounding context
  if (idx > -1) {
    console.log('Context:', content.substring(idx - 200, idx + 300));
  }
  process.exit(1);
}

content = content.replace(oldDrawer, newDrawer);
fs.writeFileSync(filePath, content, 'utf8');
console.log('SUCCESS: Thumbnail drawer updated to 14 pages.');
