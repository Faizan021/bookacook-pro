import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { classifyWithSystem1 } from "@/lib/decision/system1";
import { fallbackCaterers } from "@/data/caterers";

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

// Dynamic RAG Knowledge Base built from live verified Speisely caterers
const REAL_CATERER_CATALOG: RecommendedPartnerCard[] = fallbackCaterers.map((c) => ({
  id: c.id,
  name: c.name,
  slug: c.slug || c.id,
  city: c.area || "Berlin & Deutschland",
  category: "catering" as const,
  headline: c.tagline?.de || c.about?.de?.slice(0, 90) || "Verifizierter Speisely Premium-Caterer",
  pricePerPersonEstimate: c.perPerson > 0 ? `ab ${c.perPerson},00 € p.P.` : "ab 14,50 € p.P.",
  specialtyTags: c.tags || ["Catering", "Event-Buffet"],
  imageUrl: c.img || "/catering-clean.webp",
  rating: c.rating || 4.9,
  reviewCount: c.reviewCount || 24,
}));

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

    // 2. Dynamic RAG: Retrieve and rank real verified partners from catalog
    let matchedPartners = REAL_CATERER_CATALOG;
    if (updatedBrief.city) {
      const cityLower = updatedBrief.city.toLowerCase();
      const directCity = REAL_CATERER_CATALOG.filter(
        (p) =>
          p.city.toLowerCase().includes(cityLower) || p.headline.toLowerCase().includes(cityLower),
      );
      if (directCity.length > 0) {
        matchedPartners = directCity;
      }
    }

    // Filter or prioritize dietary & cuisine matches
    if (updatedBrief.dietaryRequirements && updatedBrief.dietaryRequirements.length > 0) {
      const reqs = updatedBrief.dietaryRequirements.map((r) => r.toLowerCase());
      const dietaryMatches = matchedPartners.filter(
        (p) =>
          p.specialtyTags.some((tag) => reqs.some((req) => tag.toLowerCase().includes(req))) ||
          p.headline.toLowerCase().includes("halal") ||
          p.headline.toLowerCase().includes("vegan"),
      );
      if (dietaryMatches.length > 0) {
        matchedPartners = dietaryMatches;
      }
    }

    // 3. Check for Gemini Key or OpenAI Key
    const geminiKey =
      process.env.GEMINI_API_KEY || process.env.Gemini_API || process.env.GEMINI_KEY;
    const openaiKey =
      process.env.OPENAI_API_KEY || process.env.OpenAI_key || process.env.OPENAI_KEY;

    if (geminiKey) {
      try {
        const systemPrompt = `You are "Speisely AI Concierge", the official intelligent catering and event consultant on speisely.de (Germany's premier 0% commission gastronomy & catering marketplace).

CORE MISSION:
You advise event organizers, office managers, and private hosts with culinary authority, precise portion calculations, and instant tailored quotes.

EVENT CONTEXT:
- City / Delivery Hub: ${updatedBrief.city || "Not specified yet"}
- Guest Count: ${updatedBrief.guests ? `${updatedBrief.guests} people` : "Not specified yet"}
- Occasion: ${updatedBrief.occasion || "Event"}
- Dietary Requirements / Allergens: ${updatedBrief.dietaryRequirements?.length ? updatedBrief.dietaryRequirements.join(", ") : "Standard / Mixed"}
- Benchmark Budget: ${updatedBrief.budgetPerPerson ? `ca. ${updatedBrief.budgetPerPerson} € per person` : "Flexible"}
${updatedBrief.estimatedTotalBudget ? `- Estimated Total Budget: ca. ${updatedBrief.estimatedTotalBudget} €` : ""}

VERIFIED CATERERS IN THE SPEISELY CATALOG:
${matchedPartners
  .slice(0, 4)
  .map(
    (p) =>
      `• ${p.name} (${p.city}): ${p.headline} [${p.pricePerPersonEstimate}] | Tags: ${p.specialtyTags.join(", ")}`,
  )
  .join("\n")}

STRICT MARKETPLACE GUARDRAILS (MANDATORY):
1. BILINGUAL ADAPTATION: Detect the user's language automatically. If the user writes in English, reply in natural, polished English. If the user writes in German, reply in professional, warm German.
2. COMMISSION PROTECTION (ZERO LEAKAGE): NEVER provide off-platform contact numbers, personal phone numbers, or external websites. All bookings and deposits must flow through Speisely to guarantee Escrow Buyer Protection and free reschedule terms.
3. PRICING & PORTION TRANSPARENCY: Provide realistic benchmarks based on real caterer data (e.g. Biryani & BBQ feasts ~14.50 € – 19.50 € p.P., Buffets ~22.00 € – 28.00 € p.P., Fingerfood ~16.00 € – 24.00 € p.P.). If custom dishes are requested (e.g. adding gravy or kebabs), give clear per-person calculations.
4. FOOD SAFETY & HYGIENE: Acknowledge dietary requirements (Halal, Vegan, Gluten-Free) with explicit assurances of certified preparation and temperature-controlled delivery.
5. CLEAR NEXT ACTION: End with an actionable next step: whether they want to customize portion sizes, add drinks/service, or directly reserve their date with a deposit via Speisely.`;

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
                content: `You are Speisely AI Concierge on speisely.de (0% commission catering marketplace).
Current Brief: City: ${updatedBrief.city || "TBD"}, Guests: ${updatedBrief.guests || "TBD"}, Budget: ${updatedBrief.budgetPerPerson || 25}€ p.p., Dietary: ${updatedBrief.dietaryRequirements?.join(", ") || "Standard"}.
Matched Caterers:
${matchedPartners
  .slice(0, 3)
  .map((p) => `• ${p.name} (${p.city}): ${p.headline} [${p.pricePerPersonEstimate}]`)
  .join("\n")}
Guardrails: Never provide direct telephone numbers or off-platform contacts. Advise professionally in the customer's language (German or English). Calculate per-person totals accurately.`,
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
              quickReplies: generateSmartQuickReplies(updatedBrief, lastUserMessage),
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
      quickReplies: generateSmartQuickReplies(updatedBrief, lastUserMessage),
      recommendedPartners: matchedPartners,
      eventBrief: updatedBrief,
      engineUsed: "speisely-expert-engine" as const,
    };
  });

function generateSmartQuickReplies(brief: ExtractedEventBrief, lastUserMessage = ""): string[] {
  const isEn = /^(hi|hello|salam|hey|can|if|we|how|what|need|want|please)/i.test(lastUserMessage);
  const suggestions: string[] = [];

  if (isEn) {
    if (!brief.guests) {
      suggestions.push("Around 35 guests");
      suggestions.push("Around 50 guests");
      suggestions.push("100+ attendees");
    } else if (!brief.dietaryRequirements || brief.dietaryRequirements.length === 0) {
      suggestions.push("🌱 Vegan & Vegetarian");
      suggestions.push("🥩 100% Halal certified");
      suggestions.push("🌾 Gluten-free options");
    } else {
      suggestions.push("📋 Request formal quote");
      suggestions.push("Compare packages in detail");
      suggestions.push("Reserve date with deposit");
    }
  } else {
    if (!brief.guests) {
      suggestions.push("Ca. 25-35 Personen");
      suggestions.push("Ca. 50 Personen");
      suggestions.push("Über 100 Gäste");
    } else if (!brief.dietaryRequirements || brief.dietaryRequirements.length === 0) {
      suggestions.push("🌱 Mit veganen Optionen");
      suggestions.push("🥩 100% Halal gewünscht");
      suggestions.push("🌾 Glutenfreie Gäste dabei");
    } else if (!brief.needCutleryOrStaff) {
      suggestions.push("🍴 Brauchen Geschirr & Besteck");
      suggestions.push("🥂 Inkl. Getränkepauschale");
      suggestions.push("Nur Speisenlieferung");
    } else {
      suggestions.push("📋 Verbindliches Angebot anfordern");
      suggestions.push("Menüs im Detail vergleichen");
      suggestions.push("Termin verbindlich reservieren");
    }
  }

  return suggestions.slice(0, 3);
}

function generateExpertAdvisorReply(
  userQuery: string,
  brief: ExtractedEventBrief,
  partners: RecommendedPartnerCard[],
): string {
  const isEn = /^(hi|hello|salam|hey|can|if|we|how|what|need|want|please)/i.test(userQuery);
  const guests = brief.guests;
  const city = brief.city || (isEn ? "your area" : "Ihrer Region");
  const budget = brief.budgetPerPerson || 25;
  const total = guests ? (guests * budget).toLocaleString(isEn ? "en-US" : "de-DE") : null;

  if (isEn) {
    let intro = `Welcome to **Speisely**! I am your Event Concierge and I will help you coordinate the perfect catering for your event.`;
    if (guests) {
      intro = `Excellent! For **${guests} guests** in **${city}**, we benchmark at **${budget}.00 € per person** with an estimated total budget of approx. **${total} €** (plus delivery).`;
    }

    const rec = `
For your occasion, we recommend selecting one of our top verified caterers specializing in high-capacity buffet and street food delivery:

${partners
  .slice(0, 3)
  .map(
    (p) =>
      `• **[${p.name}](/catering/${p.slug})** (${p.city})\n  _${p.headline}_\n  ✦ Starting at: **${p.pricePerPersonEstimate}** · Rating: ★ ${p.rating.toFixed(1)} (${p.reviewCount} reviews)`,
  )
  .join("\n\n")}

**Next Steps & Booking Protection:**
All orders through Speisely include 100% Escrow Buyer Protection and verified kitchen delivery. Would you like us to customize the menu portions or prepare a formal booking proposal?`;

    return `${intro}\n\n${rec}`;
  }

  let intro = `Herzlich willkommen bei **Speisely**! Ich helfe Ihnen, das perfekte Catering für Ihr Event zusammenzustellen.`;
  if (guests) {
    intro = `Perfekt! Für **${guests} Personen** in **${city}** kalkulieren wir bei einem Richtwert von **${budget} € pro Person** mit einem Gesamtbudget von ca. **${total} €** netto (zzgl. Lieferung).`;
  }

  const recommendation = `
Für Ihren Anlass empfehle ich ein **kalt-warmes Buffet oder thematisches Spezialitäten-Catering**, das allen Gästen (inkl. ${brief.dietaryRequirements?.join(", ") || "Vegetarisch / Halal / Vegan"}) gerecht wird:

${partners
  .slice(0, 3)
  .map(
    (p) =>
      `• **[${p.name}](/catering/${p.slug})** (${p.city})\n  _${p.headline}_\n  ✦ Richtpreis: **${p.pricePerPersonEstimate}** · Bewertung: ★ ${p.rating.toFixed(1)} (${p.reviewCount} Reviews)`,
  )
  .join("\n\n")}

**Speisely Käuferschutz & Buchung:**
Alle Bestellungen über Speisely sind zu 100 % abgesichert. Möchten Sie ein verbindliches Angebot anfordern oder individuelle Anpassungen (z.B. Gravy, Live-Station oder Besteck) vornehmen?`;

  return `${intro}\n\n${recommendation}`;
}
