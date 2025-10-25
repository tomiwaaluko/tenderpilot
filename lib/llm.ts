// Lightweight wrapper for invoking the Gemini API. This function
// centralizes request construction and mock behaviour to enable
// development in environments where the API key may not be set or
// network access is restricted.

export async function callGeminiJSON(
  prompt: string,
  input: string,
  mock?: any
): Promise<any> {
  /**
   * Lightweight wrapper around the Gemini JSON-mode API.
   *
   * Behaviour:
   *  - If TP_USE_MOCKS is set to "true" (the default) or no API key is
   *    provided, the optional `mock` value will be returned. This allows
   *    development without external network calls.
   *  - Otherwise the prompt and input are sent to the Gemini 2.5 Pro model
   *    using JSON mode. The response's first candidate text is parsed as
   *    JSON. If parsing fails, the raw text is returned under `_raw`.
   */
  const useMocks = (process.env.TP_USE_MOCKS ?? 'true').toLowerCase() === 'true';
  const apiKey = process.env.GEMINI_API_KEY;

  // When mocks are enabled or no key is set, return the provided mock value if any.
  if (useMocks || !apiKey) {
    if (mock) return mock;
    // Provide a safe fallback so callers don't crash on undefined
    return { note: 'mock enabled and no mock provided', data: {} };
  }

  // Construct the request to the Gemini JSON-mode endpoint
  const res = await fetch(
    'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro:generateContent?key=' +
      apiKey,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          { role: 'user', parts: [{ text: `${prompt}\n\nINPUT:\n${input}` }] },
        ],
        generationConfig: { responseMimeType: 'application/json' },
      }),
    }
  );
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Gemini error: ${res.status} ${body}`);
  }

  // Parse the JSON-mode response
  const data = await res.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? '{}';
  try {
    return JSON.parse(text);
  } catch {
    return { _raw: text };
  }
}
