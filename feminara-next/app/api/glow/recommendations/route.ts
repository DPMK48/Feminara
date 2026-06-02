import { NextResponse } from 'next/server';

type NutritionPick = { icon: string; name: string; benefit: string; tag: string };
type Challenge = { id: string; icon: string; title: string; goal: string };

const ALLOWED_ICONS = [
	'leaf',
	'apple',
	'sprout',
	'sun',
	'moon',
	'droplets',
	'sparkles',
	'heart',
	'zap',
	'flower',
	'pill',
	'thermometer',
	'users',
	'briefcase',
	'barChart',
];

const fallback = {
	nutritionPicks: [
		{ icon: 'leaf', name: 'Avocado', benefit: 'Healthy fats & folate', tag: 'Hormone support' },
		{ icon: 'apple', name: 'Blueberries', benefit: 'Antioxidants & vitamins', tag: 'Skin glow' },
		{ icon: 'sprout', name: 'Broccoli', benefit: 'Iron & calcium', tag: 'Bone health' },
	],
	challenges: [
		{ id: 'hydration', icon: 'droplets', title: 'Hydration Challenge', goal: '8 glasses today' },
		{ id: 'sleep', icon: 'moon', title: 'Sleep Reset', goal: 'Wind down by 10:30 pm' },
		{ id: 'movement', icon: 'zap', title: 'Movement Breaks', goal: '20 minutes of activity' },
		{ id: 'nutrition', icon: 'apple', title: 'Nourish Well', goal: 'Include 2 colorful veggies' },
		{ id: 'stress', icon: 'heart', title: 'Stress Reset', goal: '3 breathing breaks' },
		{ id: 'skincare', icon: 'sparkles', title: 'Glow Routine', goal: 'Cleanse + moisturize' },
		{ id: 'cycle', icon: 'flower', title: 'Cycle Care', goal: 'Log symptoms and energy' },
	],
	tip: '',
};

const safeIcon = (icon: string | undefined, fallbackIcon: string) =>
	icon && ALLOWED_ICONS.includes(icon) ? icon : fallbackIcon;

const extractJson = (text: string) => {
	const match = text.match(/\{[\s\S]*\}/);
	return match ? match[0] : '';
};

const fetchGeminiGlow = async (cycleDay: string, cycleDuration: string, cyclePhase: string) => {
	const apiKey = process.env.GEMINI_API_KEY;
	if (!apiKey) return null;

	const prompt = [
		'Create a short glow plan for a women\'s wellness app.',
		'Tailor to the cycle context below.',
		'Return JSON only in this shape:',
		'{"nutritionPicks":[{"icon":"leaf","name":"...","benefit":"...","tag":"..."}],',
		'"challenges":[{"id":"hydration","icon":"droplets","title":"...","goal":"..."}],',
		'"tip":"..."}',
		'Use only these icons:',
		ALLOWED_ICONS.join(', '),
		'Use 3 nutrition picks and 5-7 challenges. Nonreligious.',
		`Cycle day: ${cycleDay || 'unknown'}.`,
		`Cycle duration: ${cycleDuration || '28'}.`,
		`Cycle phase: ${cyclePhase || 'unknown'}.`,
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
						maxOutputTokens: 520,
					},
				}),
				signal: controller.signal,
			}
		);

		if (!response.ok) return null;
		const data = await response.json();
		const text = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
		if (!text) return null;

		const jsonText = extractJson(text);
		if (!jsonText) return null;
		const parsed = JSON.parse(jsonText);
		return parsed;
	} catch {
		return null;
	} finally {
		clearTimeout(timeoutId);
	}
};

const sanitizeResponse = (data: any) => {
	if (!data) return fallback;

	const nutritionPicks = Array.isArray(data.nutritionPicks)
		? data.nutritionPicks
				.filter((item: any) => item?.name && item?.benefit && item?.tag)
				.map((item: any) => ({
					icon: safeIcon(item.icon, 'leaf'),
					name: String(item.name).trim(),
					benefit: String(item.benefit).trim(),
					tag: String(item.tag).trim(),
				}))
				.slice(0, 3)
		: fallback.nutritionPicks;

	const challenges = Array.isArray(data.challenges)
		? data.challenges
				.filter((item: any) => item?.id && item?.title && item?.goal)
				.map((item: any) => ({
					id: String(item.id).trim().toLowerCase(),
					icon: safeIcon(item.icon, 'sparkles'),
					title: String(item.title).trim(),
					goal: String(item.goal).trim(),
				}))
				.slice(0, 7)
		: fallback.challenges;

	const tip = typeof data.tip === 'string' ? data.tip.trim() : '';

	return {
		nutritionPicks: nutritionPicks.length ? nutritionPicks : fallback.nutritionPicks,
		challenges: challenges.length ? challenges : fallback.challenges,
		tip,
	};
};

export async function GET(request: Request) {
	const { searchParams } = new URL(request.url);
	const cycleDay = searchParams.get('cycleDay') ?? '';
	const cycleDuration = searchParams.get('cycleDuration') ?? '';
	const cyclePhase = searchParams.get('cyclePhase') ?? '';

	const aiData = await fetchGeminiGlow(cycleDay, cycleDuration, cyclePhase);
	const payload = sanitizeResponse(aiData);

	return NextResponse.json(payload);
}
