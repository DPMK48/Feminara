import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getUserId } from '@/lib/auth';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const userId = getUserId(req);
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const comments = await prisma.postComment.findMany({
    where: { postId: params.id },
    orderBy: { createdAt: 'asc' },
    include: { user: { select: { id: true, name: true } } },
  });

  return NextResponse.json({ comments });
}

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const userId = getUserId(req);
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { content } = await req.json();
  if (!content?.trim()) {
    return NextResponse.json({ error: 'Content is required' }, { status: 400 });
  }

  const comment = await prisma.postComment.create({
    data: { postId: params.id, userId, content: content.trim() },
    include: { user: { select: { id: true, name: true } } },
  });

  return NextResponse.json({ comment }, { status: 201 });
}
