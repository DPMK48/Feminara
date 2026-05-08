import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getUserId } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const userId = getUserId(req);
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const [user, journalCount, postCount] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true, email: true, createdAt: true },
    }),
    prisma.journalEntry.count({ where: { userId } }),
    prisma.post.count({ where: { userId } }),
  ]);

  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

  // Calculate streak: consecutive days with a journal entry up to today
  const entries = await prisma.journalEntry.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    select: { createdAt: true },
  });

  const streak = calcStreak(entries.map((e) => e.createdAt));

  return NextResponse.json({ user, stats: { journalCount, postCount, streak } });
}

export async function PUT(req: NextRequest) {
  const userId = getUserId(req);
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { name } = await req.json();
  if (!name?.trim()) {
    return NextResponse.json({ error: 'Name is required' }, { status: 400 });
  }

  const user = await prisma.user.update({
    where: { id: userId },
    data: { name: name.trim() },
    select: { id: true, name: true, email: true },
  });

  return NextResponse.json({ user });
}

function calcStreak(dates: Date[]): number {
  if (dates.length === 0) return 0;
  const days = new Set(dates.map((d) => d.toISOString().split('T')[0]));
  const sorted = Array.from(days).sort().reverse();

  const today = new Date().toISOString().split('T')[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

  if (sorted[0] !== today && sorted[0] !== yesterday) return 0;

  let streak = 1;
  for (let i = 1; i < sorted.length; i++) {
    const prev = new Date(sorted[i - 1]);
    const curr = new Date(sorted[i]);
    const diff = (prev.getTime() - curr.getTime()) / 86400000;
    if (diff === 1) streak++;
    else break;
  }
  return streak;
}
