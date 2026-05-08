import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getUserId } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const userId = getUserId(req);
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const entries = await prisma.journalEntry.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json({ entries });
}

export async function POST(req: NextRequest) {
  const userId = getUserId(req);
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { content, mood } = await req.json();
  if (!content?.trim()) {
    return NextResponse.json({ error: 'Content is required' }, { status: 400 });
  }

  const entry = await prisma.journalEntry.create({
    data: { userId, content: content.trim(), mood: mood ?? null },
  });

  return NextResponse.json({ entry }, { status: 201 });
}
