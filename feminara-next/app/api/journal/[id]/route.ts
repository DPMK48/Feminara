import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getUserId } from '@/lib/auth';

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const userId = getUserId(req);
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const entry = await prisma.journalEntry.findUnique({ where: { id: params.id } });
  if (!entry || entry.userId !== userId) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const { content, mood } = await req.json();
  const updated = await prisma.journalEntry.update({
    where: { id: params.id },
    data: {
      ...(content?.trim() ? { content: content.trim() } : {}),
      ...(mood !== undefined ? { mood } : {}),
    },
  });

  return NextResponse.json({ entry: updated });
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const userId = getUserId(req);
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const entry = await prisma.journalEntry.findUnique({ where: { id: params.id } });
  if (!entry || entry.userId !== userId) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  await prisma.journalEntry.delete({ where: { id: params.id } });
  return NextResponse.json({ success: true });
}
