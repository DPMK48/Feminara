import { NextResponse } from 'next/server';

type FreeBook = {
  title: string;
  author: string;
  readUrl: string;
  downloadUrl?: string;
  source: string;
};

type PaidBook = {
  title: string;
  author: string;
  infoUrl: string;
  source: string;
};

type Article = {
  title: string;
  source: string;
  readUrl: string;
  minutes: string;
};

type BookCacheEntry = {
  dateKey: string;
  freeBooks: FreeBook[];
  paidBooks: PaidBook[];
};

const bookCache = new Map<string, BookCacheEntry>();

const getGeminiPaidBooks = async (mental: string, relationship: string, focus: string) => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return [] as PaidBook[];

  const prompt = [
    'Suggest 4 paid or widely sold books relevant to the user context.',
    'Return JSON only in this shape: {"books":[{"title":"...","author":"...","infoUrl":"...","source":"..."}]}',
    'Use reputable sources for infoUrl such as publisher or bookstore pages.',
    'Do not include religious content.',
    `Mental state: ${mental || 'unspecified'}.`,
    `Relationship status: ${relationship || 'unspecified'}.`,
    `Focus area: ${focus || 'unspecified'}.`,
  ].join(' ');

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 6500);

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ role: 'user', parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.6,
            maxOutputTokens: 320,
          },
        }),
        signal: controller.signal,
      }
    );

    if (!response.ok) return [];
    const data = await response.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
    if (!text) return [];

    const parsed = JSON.parse(text);
    if (!parsed || !Array.isArray(parsed.books)) return [];

    return parsed.books
      .filter((item: any) =>
        typeof item?.title === 'string' &&
        typeof item?.author === 'string' &&
        typeof item?.infoUrl === 'string' &&
        typeof item?.source === 'string'
      )
      .map((item: any) => ({
        title: item.title.trim(),
        author: item.author.trim(),
        infoUrl: item.infoUrl.trim(),
        source: item.source.trim(),
      }))
      .slice(0, 4);
  } catch {
    return [];
  } finally {
    clearTimeout(timeoutId);
  }
};

const focusKeywords: Record<string, string[]> = {
  finance: ['finance', 'budgeting', 'money', 'wealth'],
  identity: ['women', 'identity', 'feminism', 'empowerment'],
  relationships: ['relationships', 'communication', 'marriage', 'dating'],
  career: ['career', 'leadership', 'workplace', 'negotiation'],
  mindfulness: ['mindfulness', 'stress', 'anxiety', 'calm'],
};

const mentalKeywords: Record<string, string[]> = {
  low: ['self-care', 'rest', 'gentle'],
  stressed: ['stress', 'burnout', 'overwhelmed'],
  anxious: ['anxiety', 'grounding', 'calm'],
  motivated: ['goals', 'growth', 'confidence'],
  calm: ['mindfulness', 'gratitude', 'balance'],
};

const relationshipKeywords: Record<string, string[]> = {
  single: ['single', 'dating', 'self-worth'],
  married: ['marriage', 'partnership', 'communication'],
  complicated: ['boundaries', 'conflict', 'healing'],
  other: ['relationships', 'support', 'connection'],
};

const buildQuery = (mental: string, relationship: string, focus: string) => {
  const keywords = new Set<string>();

  (focusKeywords[focus] ?? []).forEach((item) => keywords.add(item));
  (mentalKeywords[mental] ?? []).forEach((item) => keywords.add(item));
  (relationshipKeywords[relationship] ?? []).forEach((item) => keywords.add(item));

  if (keywords.size === 0) {
    ['women', 'wellbeing', 'mental health'].forEach((item) => keywords.add(item));
  }

  return Array.from(keywords).join(' ');
};

const getGeminiKeywords = async (mental: string, relationship: string, focus: string) => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return [];

  const prompt = [
    'You are helping tailor reading suggestions for a wellness app.',
    'Return 8 to 12 concise keywords for searching books and articles.',
    'Focus on topics that match the user context.',
    'Return JSON only in this shape: {"keywords": ["..."]}.',
    `Mental state: ${mental || 'unspecified'}.`,
    `Relationship status: ${relationship || 'unspecified'}.`,
    `Focus area: ${focus || 'unspecified'}.`,
  ].join(' ');

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 6500);

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ role: 'user', parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.4,
            maxOutputTokens: 160,
          },
        }),
        signal: controller.signal,
      }
    );

    if (!response.ok) return [];
    const data = await response.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
    if (!text) return [];

    const parsed = JSON.parse(text);
    if (!parsed || !Array.isArray(parsed.keywords)) return [];
    return parsed.keywords.filter((item: unknown) => typeof item === 'string').slice(0, 12);
  } catch {
    return [];
  } finally {
    clearTimeout(timeoutId);
  }
};

const fetchWithTimeout = async (url: string, timeoutMs = 8000) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, { signal: controller.signal });
    return response;
  } finally {
    clearTimeout(timeoutId);
  }
};

const toFreeBooks = (data: any): FreeBook[] => {
  if (!data || !Array.isArray(data.results)) return [];
  return data.results
    .map((book: any) => {
      const formats = book.formats ?? {};
      const readUrl = formats['text/html'] || formats['text/plain'] || '';
      const downloadUrl = formats['application/epub+zip'] || formats['application/pdf'] || '';
      if (!readUrl && !downloadUrl) return null;

      return {
        title: book.title ?? 'Untitled',
        author: book.authors?.[0]?.name ?? 'Unknown author',
        readUrl: readUrl || downloadUrl,
        downloadUrl: downloadUrl || undefined,
        source: 'Project Gutenberg',
      };
    })
    .filter(Boolean)
    .slice(0, 6);
};

const toArticles = (data: any): Article[] => {
  if (!data || !Array.isArray(data.articles)) return [];
  return data.articles
    .map((article: any) => ({
      title: article.title || 'Untitled',
      source: article.domain || article.sourcecountry || 'GDELT',
      readUrl: article.url,
      minutes: '6 min read',
    }))
    .filter((item: Article) => Boolean(item.readUrl))
    .slice(0, 6);
};

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const mental = searchParams.get('mental') ?? '';
    const relationship = searchParams.get('relationship') ?? '';
    const focus = searchParams.get('focus') ?? '';
    const dateKey = new Date().toISOString().slice(0, 10);
    const cacheKey = `${dateKey}|${mental}|${relationship}|${focus}`;

    const cached = bookCache.get(cacheKey);
    const useCache = cached?.dateKey === dateKey;

    const baseQuery = buildQuery(mental, relationship, focus);
    const aiKeywords = await getGeminiKeywords(mental, relationship, focus);
    const aiQuery = aiKeywords.length ? `${baseQuery} ${aiKeywords.join(' ')}` : baseQuery;

    const bookUrl = `https://gutendex.com/books?search=${encodeURIComponent(aiQuery)}&languages=en`;
    const articleUrl = `https://api.gdeltproject.org/api/v2/doc/doc?query=${encodeURIComponent(
      aiQuery
    )}&mode=artlist&maxrecords=6&format=json&sort=HybridRel`;

    let booksData: any = null;
    let articlesData: any = null;

    if (!useCache) {
      try {
        const booksResponse = await fetchWithTimeout(bookUrl);
        if (booksResponse.ok) {
          try {
            booksData = await booksResponse.json();
          } catch {
            booksData = null;
          }
        }
      } catch {
        booksData = null;
      }
    }

    try {
      const articlesResponse = await fetchWithTimeout(articleUrl);
      if (articlesResponse.ok) {
        try {
          articlesData = await articlesResponse.json();
        } catch {
          articlesData = null;
        }
      }
    } catch {
      articlesData = null;
    }

    const freeBooks = useCache ? cached?.freeBooks ?? [] : toFreeBooks(booksData);
    const paidBooks = useCache ? cached?.paidBooks ?? [] : await getGeminiPaidBooks(mental, relationship, focus);
    const articles = toArticles(articlesData);

    if (!useCache) {
      bookCache.set(cacheKey, { dateKey, freeBooks, paidBooks });
    }

    return NextResponse.json({ freeBooks, paidBooks, articles });
  } catch {
    return NextResponse.json({ freeBooks: [], paidBooks: [], articles: [] });
  }
}
