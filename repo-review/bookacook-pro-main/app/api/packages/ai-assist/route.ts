import { NextRequest, NextResponse } from "next/server";

type AiAssistType = "title" | "description" | "tags";

type RequestBody = {
  type: AiAssistType;
  context: {
    title?: string;
    category?: string;
    cuisine_type?: string;
    event_types?: string[];
    description?: string;
    tags?: string[];
  };
};

// ─── Demo suggestions (used when OPENAI_API_KEY is not set) ───────────────────

function getDemoSuggestion(type: AiAssistType, ctx: RequestBody["context"]): string {
  const cat = ctx.category ?? "Catering";
  const cuisine = ctx.cuisine_type ?? "";
  const events = ctx.event_types ?? [];

  if (type === "title") {
    const eventLabel = events[0] === "wedding" ? "Hochzeits-" : events[0] === "corporate" ? "Business-" : events[0] === "birthday" ? "Geburtstags-" : "";
    const cuisineLabel = cuisine ? ` – ${cuisine}` : "";
    return `${eventLabel}${cat}-Paket${cuisineLabel} mit persönlichem Service`;
  }

  if (type === "description") {
    return (
      `Erleben Sie erstklassiges ${cat}-Catering${cuisine ? ` mit ${cuisine}-Küche` : ""}, ` +
      `das Ihre Gäste begeistert. Unser professionelles Team kümmert sich um jeden Detail, ` +
      `von der Aufstellung bis zum letzten Gang. Wir verwenden frische, hochwertige Zutaten ` +
      `und passen unser Angebot flexibel an Ihre Wünsche an. Kontaktieren Sie uns für ein ` +
      `individuelles Angebot – wir freuen uns auf Ihre Veranstaltung!`
    );
  }

  // tags
  const base = ["catering", "events", cat.toLowerCase().replace(/\s+/g, "-")];
  if (cuisine) base.push(cuisine.toLowerCase());
  if (events.includes("wedding")) base.push("hochzeit", "wedding-catering");
  if (events.includes("corporate")) base.push("firmenevent", "business-catering");
  if (events.includes("birthday")) base.push("geburtstag", "partyservice");
  base.push("buchbar", "professionell", "qualität");
  return [...new Set(base)].slice(0, 8).join(", ");
}

// ─── Route handler ────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  let body: RequestBody;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { type, context } = body;
  if (!type || !["title", "description", "tags"].includes(type)) {
    return NextResponse.json({ error: "Invalid type" }, { status: 400 });
  }

  const apiKey = process.env.OPENAI_API_KEY;

  // ── No API key → return demo suggestion ──────────────────────────────────
  if (!apiKey) {
    return NextResponse.json({
      suggestion: getDemoSuggestion(type, context ?? {}),
      demo: true,
    });
  }

  // ── With API key → call OpenAI ────────────────────────────────────────────
  try {
    const prompts: Record<AiAssistType, string> = {
      title: `Du bist Texter für ein Catering-Buchungsportal. Generiere einen ansprechenden, konkreten Pakettitel (max. 70 Zeichen) auf Deutsch. Kategorie: ${context.category ?? "–"}. Küche: ${context.cuisine_type ?? "–"}. Veranstaltungstypen: ${(context.event_types ?? []).join(", ") || "–"}. Aktueller Titel: "${context.title ?? ""}". Antworte nur mit dem Titel, ohne Anführungszeichen.`,
      description: `Du bist Texter für ein Catering-Buchungsportal. Verbessere oder schreibe eine vollständige, überzeugende Paketbeschreibung auf Deutsch (150–250 Wörter). Kategorie: ${context.category ?? "–"}. Küche: ${context.cuisine_type ?? "–"}. Bisherige Beschreibung: "${context.description ?? ""}". Antworte nur mit dem Text.`,
      tags: `Schlage 6–10 relevante SEO-Keywords für ein Catering-Paket auf Deutsch vor. Kategorie: ${context.category ?? "–"}. Küche: ${context.cuisine_type ?? "–"}. Veranstaltungen: ${(context.event_types ?? []).join(", ") || "–"}. Antworte nur mit den Keywords, kommagetrennt.`,
    };

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompts[type] }],
        max_tokens: type === "description" ? 400 : 100,
        temperature: 0.7,
      }),
    });

    if (!response.ok) throw new Error(`OpenAI error: ${response.status}`);

    const json = await response.json();
    const suggestion = json.choices?.[0]?.message?.content?.trim() ?? null;
    return NextResponse.json({ suggestion, demo: false });
  } catch {
    // Fall back to demo suggestion if OpenAI call fails
    return NextResponse.json({
      suggestion: getDemoSuggestion(type, context ?? {}),
      demo: true,
    });
  }
}
