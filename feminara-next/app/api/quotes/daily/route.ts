import { NextResponse } from 'next/server';

type QuoteResponse = {
  quote: string;
  author: string;
};

const buildPrompt = () =>
  [
    'Provide one concise, uplifting, nonreligious quote from a renowned person.',
    'The quote must be suitable for a wellness app and under 220 characters.',
    'Return JSON only in this shape: {"quote":"...","author":"..."}.',
    'Do not include any religious references.',
  ].join(' ');

const fetchGeminiQuote = async (): Promise<QuoteResponse | null> => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 6500);

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ role: 'user', parts: [{ text: buildPrompt() }] }],
          generationConfig: {
            temperature: 0.6,
            maxOutputTokens: 120,
          },
        }),
        signal: controller.signal,
      }
    );

    if (!response.ok) return null;
    const data = await response.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
    if (!text) return null;

    const parsed = JSON.parse(text);
    if (!parsed || typeof parsed.quote !== 'string' || typeof parsed.author !== 'string') {
      return null;
    }

    return {
      quote: parsed.quote.trim(),
      author: parsed.author.trim(),
    };
  } catch {
    return null;
  } finally {
    clearTimeout(timeoutId);
  }
};

export async function GET() {
  const quote = await fetchGeminiQuote();

  if (!quote) {
    return NextResponse.json({
      quote: 'Your future needs your best today.',
      author: 'Unknown',
    });
  }

  return NextResponse.json(quote);
}
