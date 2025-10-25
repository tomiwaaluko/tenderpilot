// src/lib/llm.ts
export async function callGeminiJSON(
  prompt: string,
  input: string,
  mock?: any
): Promise<any> {
  const useMocks =
    (process.env.TP_USE_MOCKS ?? "true").toLowerCase() === "true";
  const apiKey = process.env.GEMINI_API_KEY;

  // If we want mocks or we don't have an API key, return mock if provided.
  if (useMocks || !apiKey) {
    if (mock) return mock;
    // Safe fallback so routes don't crash if no mock supplied
    return { note: "mock enabled and no mock provided", data: {} };
  }

  // ---- Real Gemini 2.5 Pro call (JSON mode) ----
  const res = await fetch(
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro:generateContent?key=" +
      apiKey,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          { role: "user", parts: [{ text: `${prompt}\n\nINPUT:\n${input}` }] },
        ],
        generationConfig: { responseMimeType: "application/json" },
      }),
    }
  );

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Gemini error: ${res.status} ${body}`);
  }

  // The Gemini JSON-mode response returns your model JSON in the candidate's text.
  const data = await res.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? "{}";
  try {
    return JSON.parse(text);
  } catch {
    // If the model didn't return strict JSON, surface raw text for debugging.
    return { _raw: text };
  }
}
