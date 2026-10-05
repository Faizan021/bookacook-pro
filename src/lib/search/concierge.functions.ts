import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { classifyWithSystem1 } from "@/lib/decision/system1";

export interface ConciergeChatMessage {
  role: "user" | "assistant";
  content: string;
}

export interface RecommendedPartnerCard {
  id: string;
  name: string;
  slug: string;
  city: string;
  category: "catering" | "restaurant" | "planner";
  headline: string;
  pricePerPersonEstimate: string;
  specialtyTags: string[];
  imageUrl?: string;
  rating: number;
  reviewCount: number;
}

export interface ExtractedEventBrief {
  city?: string;
  guests?: number;
  dietaryRequirements?: string[];
  budgetPerPerson?: number;
  estimatedTotalBudget?: number;
  occasion?: string;
  serviceType?: string;
  needCutleryOrStaff?: boolean;
}

export interface ConciergeChatResponse {
  reply: string;
  quickReplies: string[];
  recommendedPartners: RecommendedPartnerCard[];
  eventBrief: ExtractedEventBrief;
  engineUsed: "gemini-2.5-flash" | "openai-gpt4o" | "speisely-expert-engine";
}

// Sample verified premium partners for zero-latency retrieval & fallback recommendations
const CURATED_SHOWCASE_PARTNERS: RecommendedPartnerCard[] = [
  {
    id: "partyservice-kuepper",
    name: "Partyservice Küpper",
    slug: "partyservice-kuepper",
    city: "Leverkusen / Köln",
    category: "catering",
    headline: "Traditionelle Handwerks-Catering buffets & Chafing-Dish Heißlieferung",
    pricePerPersonEstimate: "ab 24,50 € p.P.",
    specialtyTags: ["Kalt-Warmes Buffet", "Fleischerei-Handwerk", "Office & Privat"],
    imageUrl: "/showcase-kuepper.png",
    rating: 4.9,
    reviewCount: 48,
  },
  {
    id: "haus-spaas",
    name: "Haus Spaas",
    slug: "haus-spaas",
    city: "Rhein-Ruhr / Düsseldorf",
    category: "catering",
    headline: "Gehobene Brauhaus- & Festküche für Hochzeiten & Firmenveranstaltungen",
    pricePerPersonEstimate: "ab 32,00 € p.P.",
    specialtyTags: ["Exklusives Eventlokal", "Menüs & Flying Food", "Großveranstaltungen"],
    imageUrl: "/showcase-haus-spaas.png",
    rating: 5.0,
    reviewCount: 36,
  },
  {
    id: "alzaeem-catering",
    name: "Alzaeem Event & Catering",
    slug: "alzaeem-catering",
    city: "Berlin",
    category: "catering",
    headline: "Feinste nahöstliche Meze-Platten, Halal-Grillspezialitäten & vegane Buffets",
    pricePerPersonEstimate: "ab 28,00 € p.P.",
    specialtyTags: ["Halal 100%", "Große vegane Auswahl", "Warmhalte-Lieferung"],
    imageUrl: "/catering-clean.webp",
    rating: 4.9,
    reviewCount: 84,
  },
  {
    id: "feinkost-huber",
    name: "Feinkost Huber Catering",
    slug: "feinkost-huber",
    city: "München",
    category: "catering",
    headline: "Bayerisch-mediterranes Fingerfood & exklusive Business-Lunch Boxen",
    pricePerPersonEstimate: "ab 34,50 € p.P.",
    specialtyTags: ["Fingerfood", "Bio & Regional", "Meeting-Catering"],
    imageUrl: "/hero-cinematic.webp",
    rating: 4.8,
    reviewCount: 52,
  },
];

export const chatWithConcierge = createServerFn({ method: "POST" })
  .validator(
    (input: {
      messages: { role: "user" | "assistant"; content: string }[];
      currentBrief?: Partial<ExtractedEventBrief>;
    }) =>
      z
        .object({
          messages: z.array(
            z.object({
              role: z.enum(["user", "assistant"]),
              content: z.string().max(2000),
            }),
          ),
          currentBrief: z
            .object({
              city: z.string().optional(),
              guests: z.number().optional(),
              dietaryRequirements: z.array(z.string()).optional(),
              budgetPerPerson: z.number().optional(),
              estimatedTotalBudget: z.number().optional(),
              occasion: z.string().optional(),
              serviceType: z.string().optional(),
              needCutleryOrStaff: z.boolean().optional(),
            })
            .optional(),
        })
        .parse(input),
  )
  .handler(async ({ data }) => {
    const { messages, currentBrief = {} } = data;
    const lastUserMessage = [...messages].reverse().find((m) => m.role === "user")?.content || "";

    // 1. Extract context using Speisely System 1 Classifier (< 2ms)
    const system1 = classifyWithSystem1(lastUserMessage);

    // Merge entities into working event brief
    const guests =
      system1.parameters?.guests ||
      currentBrief.guests ||
      (lastUserMessage.match(/(\d+)\s*(personen|gäste|kollegen|leute)/i)?.[1]
        ? parseInt(lastUserMessage.match(/(\d+)\s*(personen|gäste|kollegen|leute)/i)![1], 10)
        : undefined);
    const city =
      system1.parameters?.location ||
      currentBrief.city ||
      lastUserMessage.match(
        /(berlin|münchen|muenchen|köln|koeln|hamburg|düsseldorf|duesseldorf|frankfurt|stuttgart)/i,
      )?.[1] ||
      undefined;

    // Dietary extraction
    const dietaries = new Set<string>(currentBrief.dietaryRequirements || []);
    if (/vegan/i.test(lastUserMessage)) dietaries.add("Vegan");
    if (/vegetarisch/i.test(lastUserMessage)) dietaries.add("Vegetarisch");
    if (/halal/i.test(lastUserMessage)) dietaries.add("Halal");
    if (/glutenfrei/i.test(lastUserMessage)) dietaries.add("Glutenfrei");

    // Budget extraction
    let budgetPerPerson = currentBrief.budgetPerPerson;
    const budgetMatch = lastUserMessage.match(/(\d+)\s*(€|euro|eur)\s*(pro|p\.p\.|kopf|person)?/i);
    if (budgetMatch && budgetMatch[1]) {
      budgetPerPerson = parseInt(budgetMatch[1], 10);
    } else if (!budgetPerPerson) {
      budgetPerPerson = 30; // default benchmark
    }

    const estimatedTotal = guests ? guests * budgetPerPerson : undefined;

    const updatedBrief: ExtractedEventBrief = {
      city: city ? city.charAt(0).toUpperCase() + city.slice(1).toLowerCase() : currentBrief.city,
      guests,
      dietaryRequirements: Array.from(dietaries),
      budgetPerPerson,
      estimatedTotalBudget: estimatedTotal,
      occasion:
        currentBrief.occasion ||
        (/sommerfest/i.test(lastUserMessage)
          ? "Sommerfest"
          : /hochzeit/i.test(lastUserMessage)
            ? "Hochzeit"
            : /geburtstag/i.test(lastUserMessage)
              ? "Geburtstag"
              : /firma|teamevent|office/i.test(lastUserMessage)
                ? "Firmenevent"
                : "Event"),
      serviceType:
        currentBrief.serviceType ||
        (/fingerfood/i.test(lastUserMessage)
          ? "Fingerfood & Flying Buffet"
          : /buffet/i.test(lastUserMessage)
            ? "Warm-Kaltes Buffet"
            : "Catering Buffet"),
      needCutleryOrStaff:
        /besteck|geschirr|teller|personal|servicekraft/i.test(lastUserMessage) ||
        currentBrief.needCutleryOrStaff,
    };

    // 2. Fetch or filter matching partners
    let matchedPartners = CURATED_SHOWCASE_PARTNERS;
    if (updatedBrief.city) {
      const cityLower = updatedBrief.city.toLowerCase();
      const directCity = CURATED_SHOWCASE_PARTNERS.filter((p) =>
        p.city.toLowerCase().includes(cityLower),
      );
      if (directCity.length > 0) {
        matchedPartners = directCity;
      }
    }

    // 3. Check for Gemini Key or OpenAI Key
    const geminiKey =
      process.env.GEMINI_API_KEY || process.env.Gemini_API || process.env.GEMINI_KEY;
    const openaiKey =
      process.env.OPENAI_API_KEY || process.env.OpenAI_key || process.env.OPENAI_KEY;

    if (geminiKey) {
      try {
        const systemPrompt = `Du bist "Speisely Concierge", der führende deutsche KI-Event- und Catering-Berater auf speisely.de (vergleichbar mit dem Google Gemini Berater bei OTTO).
Deine Aufgabe: Berate den Kunden empathisch, kulinarisch kompetent und präzise.
Berechne Portionen, gebe Tipps zu Warmhaltung / Diäten und stelle passende Partner vor.

Aktueller Stand der Planung:
- Stadt: ${updatedBrief.city || "Noch offen"}
- Gäste: ${updatedBrief.guests ? `${updatedBrief.guests} Personen` : "Noch offen"}
- Anlass: ${updatedBrief.occasion || "Event"}
- Ernährung / Allergien: ${updatedBrief.dietaryRequirements?.length ? updatedBrief.dietaryRequirements.join(", ") : "Standard / Gemischt"}
- Richtwert Budget: ${updatedBrief.budgetPerPerson ? `ca. ${updatedBrief.budgetPerPerson} € pro Person` : "Offen"}
${updatedBrief.estimatedTotalBudget ? `- Kalkulierte Gesamtsumme: ca. ${updatedBrief.estimatedTotalBudget} €` : ""}

Verfügbare Partner in der Speisely Datenbank:
${matchedPartners.map((p) => `• ${p.name} (${p.city}): ${p.headline} [${p.pricePerPersonEstimate}]`).join("\n")}

Regeln:
1. Antworte auf Deutsch (oder Englisch, falls der Kunde auf Englisch schreibt), warmherzig, professionell und ohne Floskeln.
2. Halte deine Antwort übersichtlich (Nutze Bullet Points und Fettung).
3. Wenn Gäste oder Budget genannt wurden, bestätige kurz die Kalkulation.
4. Schließe immer mit einer klaren, hilfreichen Frage ab (z.B. ob Geschirr/Besteck benötigt wird, oder ob das Briefing direkt an die Partner gesendet werden soll).`;

        const geminiMessages = messages.map((m) => ({
          role: m.role === "assistant" ? "model" : "user",
          parts: [{ text: m.content }],
        }));

        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiKey}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              systemInstruction: { parts: [{ text: systemPrompt }] },
              contents: geminiMessages,
              generationConfig: {
                temperature: 0.6,
                maxOutputTokens: 600,
              },
            }),
          },
        );

        if (response.ok) {
          const resJson = await response.json();
          const reply = resJson.candidates?.[0]?.content?.parts?.[0]?.text;
          if (reply) {
            return {
              reply: reply.trim(),
              quickReplies: generateSmartQuickReplies(updatedBrief),
              recommendedPartners: matchedPartners,
              eventBrief: updatedBrief,
              engineUsed: "gemini-2.5-flash" as const,
            };
          }
        }
      } catch (err) {
        console.warn("Gemini API call failed, falling back to Speisely Expert Engine:", err);
      }
    }

    if (openaiKey) {
      try {
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${openaiKey}`,
          },
          body: JSON.stringify({
            model: "gpt-4o-mini",
            temperature: 0.6,
            messages: [
              {
                role: "system",
                content: `Du bist Speisely Concierge, KI-Catering-Berater auf speisely.de. Berate professionell auf Deutsch. Gäste: ${updatedBrief.guests || "?"}, Stadt: ${updatedBrief.city || "?"}, Budget: ${updatedBrief.budgetPerPerson || 30}€ p.P.`,
              },
              ...messages,
            ],
          }),
        });

        if (response.ok) {
          const resJson = await response.json();
          const reply = resJson.choices?.[0]?.message?.content;
          if (reply) {
            return {
              reply: reply.trim(),
              quickReplies: generateSmartQuickReplies(updatedBrief),
              recommendedPartners: matchedPartners,
              eventBrief: updatedBrief,
              engineUsed: "openai-gpt4o" as const,
            };
          }
        }
      } catch (err) {
        console.warn("OpenAI API call failed, falling back to Speisely Expert Engine:", err);
      }
    }

    // 4. Deterministic Speisely Expert Advisor (Zero latency, 100% reliable)
    const reply = generateExpertAdvisorReply(lastUserMessage, updatedBrief, matchedPartners);

    return {
      reply,
      quickReplies: generateSmartQuickReplies(updatedBrief),
      recommendedPartners: matchedPartners,
      eventBrief: updatedBrief,
      engineUsed: "speisely-expert-engine" as const,
    };
  });

function generateSmartQuickReplies(brief: ExtractedEventBrief): string[] {
  const suggestions: string[] = [];

  if (!brief.guests) {
    suggestions.push("Ca. 25-35 Personen");
    suggestions.push("Ca. 50 Personen");
    suggestions.push("Über 100 Gäste");
  } else if (!brief.dietaryRequirements || brief.dietaryRequirements.length === 0) {
    suggestions.push("🌱 Mit veganen Optionen");
    suggestions.push("🥩 Halal gewünscht");
    suggestions.push("🌾 Glutenfreie Gäste dabei");
  } else if (!brief.needCutleryOrStaff) {
    suggestions.push("🍴 Brauchen Geschirr & Besteck");
    suggestions.push("🥂 Inkl. Getränkepauschale");
    suggestions.push("Nur Essen, Geschirr ist da");
  } else {
    suggestions.push("📋 Fertiges Briefing anfragen");
    suggestions.push("Menüs im Detail vergleichen");
  }

  return suggestions.slice(0, 3);
}

function generateExpertAdvisorReply(
  userQuery: string,
  brief: ExtractedEventBrief,
  partners: RecommendedPartnerCard[],
): string {
  const guests = brief.guests;
  const city = brief.city || "Ihrer Region";
  const budget = brief.budgetPerPerson || 32;
  const total = guests ? (guests * budget).toLocaleString("de-DE") : null;

  let intro = `Herzlich willkommen bei **Speisely**! Ich helfe Ihnen, das perfekte Catering für Ihr Event zusammenzustellen.`;

  if (guests) {
    intro = `Perfekt! Für **${guests} Personen** in **${city}** kalkulieren wir bei einem Richtwert von **${budget} € pro Person** mit einem Gesamtbudget von ca. **${total} €** netto.`;
  }

  const recommendation = `
Für Ihren Anlass empfehle ich ein **kalt-warmes Fingerfood- oder Flying Buffet**, da es unkompliziert ist, allen Diäten (inkl. ${brief.dietaryRequirements?.join(", ") || "Vegetarisch / Vegan"}) gerecht wird und keine aufwendige Küchentechnik vor Ort erfordert.

Hier sind passende, verifizierte Partner auf Speisely:
${partners
  .slice(0, 2)
  .map(
    (p) =>
      `• **[${p.name}](/catering/${p.slug})** (${p.city})\n  _${p.headline}_\n  ✦ Richtpreis: **${p.pricePerPersonEstimate}** · Bewertung: ★ ${p.rating.toFixed(1)}`,
  )
  .join("\n\n")}

**Nächster Schritt:**
Benötigen Sie vor Ort Leihgeschirr & Besteck, oder möchten Sie direkt eine unverbindliche Menüauswahl anfordern?`;

  return `${intro}\n\n${recommendation}`;
}
