const fs = require('fs');
const content = fs.readFileSync('src/routes/magazin.community.chicken-krush-prag.tsx', 'utf8');

// Find markers
const startMarker = '{/* Article Body */}';
const startIdx = content.indexOf(startMarker);

// Find the last closing p tag before the Editorial Disclosure box
const endMarker = '{/* Editorial Disclosure Box */}';
const endIdx = content.indexOf(endMarker);

const before = content.substring(0, startIdx);
const after = content.substring(endIdx);

const newArticleBody = `{/* Article Body */}
        <article className="mx-auto max-w-4xl px-4 sm:px-6 pb-20">
          <div className="prose prose-lg max-w-none text-forest/85 space-y-8 leading-relaxed font-normal">
            {/* Photo 1 — Exterior facade */}
            <figure className="my-8">
              <div className="overflow-hidden rounded-3xl border border-forest/10 bg-black/5 shadow-md">
                <img
                  src="/magazin/chicken-krush-prag/ck-new-01.webp"
                  alt={
                    isDe
                      ? "Fassade von Chicken Krush in Prag mit leuchtendem goldenem Schriftzug über dem Eingang"
                      : "Exterior of Chicken Krush Prague with glowing golden sign above the entrance"
                  }
                  className="w-full h-auto object-cover max-h-[720px]"
                  fetchPriority="high"
                  decoding="async"
                />
              </div>
              <figcaption className="mt-3 text-xs sm:text-sm text-forest/70 flex items-center justify-between px-2 font-medium">
                <span>
                  {isDe
                    ? "Der goldene Schriftzug an der Fassade: Chicken Krush in der Přičná-Straße, Prag-Nové Město."
                    : "The golden sign on the facade: Chicken Krush on Přičná Street, Prague-Nové Město."}
                </span>
                <span className="text-[11px] text-forest/50">📸 Speisely Community</span>
              </figcaption>
            </figure>

            <p>
              {isDe
                ? "Unser Community-Mitglied hatte keinen großen Plan für den Abend — nur Hunger und eine Notiz auf dem Handy: Příčná-Straße, Nové Město. Der goldene Schriftzug über dem Eingang leuchtete warm in die Abendgasse. Dahinter: ein stimmungsvoller Raum, volle Holzbretter und der unverwechselbare Geruch von frisch frittiertem Hähnchen."
                : "There was no big plan for that evening — just hunger and a note on the phone: Příčná Street, Nové Město. The golden sign above the entrance glowed warmly into the evening alley. Inside: an atmospheric dining room, loaded wooden boards, and the unmistakable scent of freshly fried chicken."}
            </p>

            <p>
              {isDe
                ? "An jedem Tisch wartet ein eigener Touchscreen — auf Tschechisch, Englisch oder Koreanisch. Man bestellt ganz unkompliziert selbst, lehnt sich zurück und genießt die Atmosphäre. Das Essen kommt schnell und heiß auf dem Brett."
                : "Every table has its own touchscreen — in Czech, English, or Korean. You order at your own pace, lean back, and soak in the atmosphere. The food arrives fast and piping hot on the wooden board."}
            </p>

            {/* Photo 2 — Iconic circular neon logo on brick wall */}
            <figure className="my-8">
              <div className="overflow-hidden rounded-3xl border border-forest/10 bg-black/5 shadow-md max-w-md mx-auto">
                <img
                  src="/magazin/chicken-krush-prag/ck-new-03.webp"
                  alt={
                    isDe
                      ? "Beleuchtetes THE CHICKEN KRUSH Neonschild auf rustikaler Ziegelwand in Prag"
                      : "Illuminated THE CHICKEN KRUSH neon sign on exposed brick wall in Prague"
                  }
                  className="w-full h-auto object-cover"
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <figcaption className="mt-3 text-xs sm:text-sm text-forest/70 flex items-center justify-between px-2 font-medium">
                <span>
                  {isDe
                    ? "Das ikonische beleuchtete Markenzeichen von Chicken Krush auf der Backsteinwand im Innenraum."
                    : "The iconic illuminated Chicken Krush emblem on the exposed brick wall inside."}
                </span>
                <span className="text-[11px] text-forest/50">📸 Speisely Community</span>
              </figcaption>
            </figure>

            <h2 className="font-display text-2xl sm:text-3xl font-bold text-forest pt-4">
              {isDe ? "Der erste Crunch am Tisch" : "The First Crunch at the Table"}
            </h2>

            <p>
              {isDe
                ? "Auf jedem servierten Holzbrett steckt eine kleine Flagge: „Slow Fried. Pomalu smažené" und „Taste Respect (치킨크러시)". Die Kruste ist hauchdünn, extrem kross und bricht beim ersten Hineinbeißen mit einem deutlichen Knacken. Innen dampft das Fleisch saftig und zart — genau die Balance, die gutes Korean Fried Chicken ausmacht."
                : "Every wooden board arrives with a small flag: "Slow Fried. Pomalu smažené" and "Taste Respect (치킨크러시)". The batter is paper-thin, shatteringly crisp and cracks with a clean snap at the first bite. Inside, the chicken steams tender and juicy — the perfect balance that defines great Korean Fried Chicken."}
            </p>

            {/* Photo 3 — Classic fried Born in Seoul chicken */}
            <figure className="my-8">
              <div className="overflow-hidden rounded-3xl border border-forest/10 bg-black/5 shadow-md">
                <img
                  src="/magazin/chicken-krush-prag/ck-new-05.webp"
                  alt={
                    isDe
                      ? "Klassisches knuspriges Korean Fried Chicken mit Born in Seoul Flagge, Pommes, Coleslaw und Dips auf Holzbrett"
                      : "Classic crispy Korean fried chicken with Born in Seoul flag, fries, coleslaw and dipping sauces on wooden board"
                  }
                  className="w-full h-auto object-cover max-h-[640px]"
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <figcaption className="mt-3 text-xs sm:text-sm text-forest/70 flex items-center justify-between px-2 font-medium">
                <span>
                  {isDe
                    ? "Born in Seoul: Goldgelb frittiertes Korean Fried Chicken auf dem Holzbrett mit Pommes, Coleslaw und Dips."
                    : "Born in Seoul: Golden Korean Fried Chicken on the board with fries, fresh coleslaw and dipping sauces."}
                </span>
                <span className="text-[11px] text-forest/50">📸 Speisely Community</span>
              </figcaption>
            </figure>

            <h2 className="font-display text-2xl sm:text-3xl font-bold text-forest pt-4">
              {isDe ? "Süße Schärfe und samtiger Kontrast" : "Sweet Heat and Snowy Contrast"}
            </h2>

            <p>
              {isDe
                ? "Beim Teilen am Tisch greift man automatisch von einem Brett zum nächsten: Das tiefrot glänzende Yangnyeom Chicken ist dick eingekocht mit Gochujang, Honig und Knoblauch, bestreut mit gerösteten Mandelsplittern — klebrig, scharf und süß zugleich. Eine Kombination, die jeden Bissen zu einem Erlebnis macht. Die Dipsaucen und der frische Krautsalat sorgen für die perfekte Balance."
                : "Sharing across the table means constantly switching flavours: deeply glazed Yangnyeom chicken simmered with gochujang, garlic, and honey, topped with toasted almond slivers for a sticky sweet-heat kick. A combination that makes every bite an experience. The dipping sauces and fresh coleslaw provide the perfect balance."}
            </p>

            {/* Photo 4 — Yangnyeom Chicken with Taste Respect flag */}
            <figure className="my-8">
              <div className="overflow-hidden rounded-3xl border border-forest/10 bg-black/5 shadow-md">
                <img
                  src="/magazin/chicken-krush-prag/ck-new-02.webp"
                  alt={
                    isDe
                      ? "Yangnyeom Chicken mit Taste Respect Flagge, Pommes und Dips auf Chicken Krush Serviertablett"
                      : "Yangnyeom chicken with Taste Respect flag, fries and dipping sauces on Chicken Krush serving tray"
                  }
                  className="w-full h-auto object-cover max-h-[640px]"
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <figcaption className="mt-3 text-xs sm:text-sm text-forest/70 flex items-center justify-between px-2 font-medium">
                <span>
                  {isDe
                    ? "Kräftig rot glasiertes Yangnyeom Chicken mit dem Signature Taste Respect Fähnchen, Pommes und Dips."
                    : "Deeply glazed Yangnyeom chicken with the signature Taste Respect banner, fries and dipping sauces."}
                </span>
                <span className="text-[11px] text-forest/50">📸 Speisely Community</span>
              </figcaption>
            </figure>

            <h2 className="font-display text-2xl sm:text-3xl font-bold text-forest pt-4">
              {isDe ? "Das große Sharing-Brett in der Mitte" : "The Big Sharing Board in the Middle"}
            </h2>

            <p>
              {isDe
                ? "Das Highlight auf dem Tisch war das große Sharing-Brett mit gleich mehreren Sorten: weißglasierten Boneless Bites, klassischem fried Chicken, goldgelben Pommes, frischem Coleslaw und einer Reihe von Dipsaucen. Zusammen entsteht genau diese ungezwungene Chimaek-Stimmung, die man aus den Straßen von Seoul kennt — jetzt mitten in Prag-Nové Město."
                : "The standout of the table was the large sharing board with multiple varieties: white-glazed boneless bites, classic fried chicken, golden fries, fresh coleslaw, and a row of dipping sauces. Together, it perfectly captures that relaxed Chimaek atmosphere from the streets of Seoul — right in the heart of Prague's Nové Město."}
            </p>

            {/* Photo 5 — Full feast sharing board */}
            <figure className="my-8">
              <div className="overflow-hidden rounded-3xl border border-forest/10 bg-black/5 shadow-md">
                <img
                  src="/magazin/chicken-krush-prag/ck-new-04.webp"
                  alt={
                    isDe
                      ? "Grosses Sharing-Brett bei Chicken Krush Prag mit weißglasierten Boneless Bites, Yangnyeom Chicken, Pommes, Coleslaw, Burger und Dips"
                      : "Large sharing board at Chicken Krush Prague with white-glazed boneless bites, Yangnyeom chicken, fries, coleslaw, burger and dipping sauces"
                  }
                  className="w-full h-auto object-cover max-h-[680px]"
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <figcaption className="mt-3 text-xs sm:text-sm text-forest/70 flex items-center justify-between px-2 font-medium">
                <span>
                  {isDe
                    ? "Das große Sharing-Brett: Boneless Bites mit weißer Glasur, Yangnyeom Chicken, Pommes, Burger, Coleslaw und Dips."
                    : "The big sharing board: white-glazed boneless bites, Yangnyeom chicken, fries, burger, coleslaw and dips."}
                </span>
                <span className="text-[11px] text-forest/50">📸 Speisely Community</span>
              </figcaption>
            </figure>

            <p className="font-medium text-forest text-lg pt-2">
              {isDe
                ? "Ein lebendiger, unkomplizierter Abend in Prag: Reinkommen, per Touchscreen bestellen, gemeinsam Holzbretter teilen und authentisches Korean Fried Chicken in Bestform genießen — mitten in der Prager Neustadt."
                : "A vibrant, effortless evening in Prague: walk in, order via touchscreen, share the wooden platters together, and enjoy authentic Korean Fried Chicken at its very best — right in the heart of Nové Město."}
            </p>

            `;

const result = before + newArticleBody + after;
fs.writeFileSync('src/routes/magazin.community.chicken-krush-prag.tsx', result, 'utf8');
console.log('Article updated successfully. Total lines:', result.split('\n').length);
