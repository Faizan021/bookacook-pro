import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

export const classifySearchIntent = createServerFn({ method: "POST" })
  .validator((input: { query: string }) =>
    z
      .object({
        query: z.string().min(1).max(200),
      })
      .parse(input),
  )
  .handler(async ({ data }) => {
    const openaiKey = process.env.OPENAI_API_KEY || process.env.OpenAI_key || process.env.OPENAI_KEY;
    const geminiKey = process.env.GEMINI_API_KEY || process.env.Gemini_API || process.env.GEMINI_KEY;

    if (!openaiKey && !geminiKey) {
      // Fallback in case of missing keys, default to B2C restaurant lookup
      return {
        intent: "B2C" as const,
        vertical: "restaurants" as const,
        parameters: {} as Record<string, any>,
      };
    }

    const systemPrompt =
      "You are an intelligent search intent classifier for Speisely, a platform for B2C restaurant food delivery, B2B catering, and corporate/wedding event planning. " +
      "Analyze the user search query and classify it. " +
      "Return a JSON object with keys:\n" +
      "- 'intent': 'B2C' (for simple food delivery, single meals, immediate cravings, or personal dining) or 'B2B' (for catering, office catering, group parties, corporate events, weddings, planning services).\n" +
      "- 'vertical': 'restaurants' (for B2C delivery), 'catering' (for caterers / group food), or 'events' (for full event planning services).\n" +
      "- 'parameters': a nested object with optional properties 'location' (extracted city or neighborhood), 'guests' (number of guests, as a number if found), and 'cuisine' (cuisine style or keywords, e.g. vegan, pizza, BBQ).\n\n" +
      "Do not include any JSON markdown wrapping. Return ONLY the raw valid JSON.";

    const prompt = `Classify this query: "${data.query}"`;

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
        throw new Error("OpenAI API call failed");
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
        throw new Error("Gemini API call failed");
      }

      const responseData = await response.json();
      resultText = responseData.candidates?.[0]?.content?.parts?.[0]?.text || "";
    }

    try {
      const parsed = JSON.parse(resultText.trim());
      return {
        intent: (parsed.intent || "B2C") as "B2C" | "B2B",
        vertical: (parsed.vertical || "restaurants") as "restaurants" | "catering" | "events",
        parameters: (parsed.parameters || {}) as Record<string, any>,
      };
    } catch (e) {
      console.error("Failed to parse classification response:", resultText, e);
      return {
        intent: "B2C" as const,
        vertical: "restaurants" as const,
        parameters: {} as Record<string, any>,
      };
    }
  });
