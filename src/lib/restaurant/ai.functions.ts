import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireRole } from "@/lib/auth/role-middleware";

export const generateGastronomyCopy = createServerFn({ method: "POST" })
  .middleware([requireRole("restaurant_owner")])
  .validator((input: {
    type: "menu_item" | "seo";
    name: string;
    category?: string | null;
    additionalContext?: string | null;
  }) =>
    z
      .object({
        type: z.enum(["menu_item", "seo"]),
        name: z.string().min(2).max(100),
        category: z.string().max(100).optional().nullable(),
        additionalContext: z.string().max(300).optional().nullable(),
      })
      .parse(input),
  )
  .handler(async ({ data }) => {
    const openaiKey = process.env.OPENAI_API_KEY || process.env.OpenAI_key || process.env.OPENAI_KEY;
    const geminiKey = process.env.GEMINI_API_KEY || process.env.Gemini_API || process.env.GEMINI_KEY;

    if (!openaiKey && !geminiKey) {
      throw new Error(
        "Kein API-Schlüssel gefunden. Bitte konfiguriere OpenAI_key oder Gemini_API in den Umgebungsvariablen.",
      );
    }

    let prompt = "";
    let systemPrompt = "";

    if (data.type === "menu_item") {
      systemPrompt =
        "You are a professional gastronomy menu writer and translator. Return a JSON object with keys 'desc_de' (German description, max 80 characters) and 'desc_en' (English translation, max 80 characters). Write extremely short, mouth-watering, punchy, and eye-catching descriptions. Do not write full introductory sentences. Do not include any JSON markdown wrapping. Return ONLY the raw valid JSON.";
      prompt = `Write a short, appetizing, and eye-catching description (max 80 characters) for the menu item: "${data.name}"${data.category ? ` in category "${data.category}"` : ""}.${data.additionalContext ? ` Style/ingredients: ${data.additionalContext}.` : ""}`;
    } else {
      systemPrompt =
        "You are a professional local SEO specialist for restaurants. Return a JSON object with keys 'seo_title' (max 60 characters), 'seo_description' (max 145 characters), and 'seo_keywords' (array of strings, max 8 keywords). Do not include any JSON markdown wrapping. Return ONLY the raw valid JSON.";
      prompt = `Generate SEO metadata for the restaurant: "${data.name}".${data.category ? ` Cuisine type: ${data.category}.` : ""}${data.additionalContext ? ` Location: ${data.additionalContext}.` : ""}`;
    }

    let resultText = "";

    if (openaiKey) {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${openaiKey}`,
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          response_format: { type: "json_object" },
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: prompt },
          ],
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`OpenAI API failed: ${errorText}`);
      }

      const responseData = await response.json();
      resultText = responseData.choices?.[0]?.message?.content || "";
    } else if (geminiKey) {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiKey}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [
              {
                role: "user",
                parts: [{ text: `${systemPrompt}\n\nUser request:\n${prompt}` }],
              },
            ],
            generationConfig: {
              responseMimeType: "application/json",
            },
          }),
        },
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Gemini API failed: ${errorText}`);
      }

      const responseData = await response.json();
      resultText = responseData.candidates?.[0]?.content?.parts?.[0]?.text || "";
    }

    try {
      const parsed = JSON.parse(resultText.trim());
      return parsed;
    } catch (e) {
      console.error("Failed to parse AI response:", resultText, e);
      throw new Error("Die KI hat keine gültige JSON-Struktur zurückgegeben.");
    }
  });
