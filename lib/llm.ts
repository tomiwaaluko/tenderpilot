// Lightweight wrapper for invoking the Gemini API. This function
// centralizes request construction and mock behaviour to enable
// development in environments where the API key may not be set or
// network access is restricted.

export async function callGeminiJSON(
  prompt: string,
  input: string,
  mock?: any
): Promise<any> {
  // If a mock object is provided (and we're not in production), return it
  // immediately. This allows local development without making network
  // requests to the Gemini API.
  if (process.env.NODE_ENV !== 'production' && mock) {
    return mock;
  }
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY environment variable is not set');
  }
  const url =
    'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro:generateContent?key=' +
    apiKey;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: prompt + '\n\nINPUT:\n' + input,
            },
          ],
        },
      ],
      generationConfig: { responseMimeType: 'application/json' },
    }),
  });
  if (!res.ok) {
    throw new Error(`Gemini API responded with status ${res.status}`);
  }
  return res.json();
}
