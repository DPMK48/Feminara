import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getUserId } from '@/lib/auth';

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const userId = getUserId(req);
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const postId = params.id;
  const existing = await prisma.postLike.findUnique({
    where: { postId_userId: { postId, userId } },
  });

  if (existing) {
    await prisma.postLike.delete({ where: { id: existing.id } });
    const count = await prisma.postLike.count({ where: { postId } });
    return NextResponse.json({ liked: false, likeCount: count });
  } else {
    await prisma.postLike.create({ data: { postId, userId } });
    const count = await prisma.postLike.count({ where: { postId } });
    return NextResponse.json({ liked: true, likeCount: count });
  }
}
