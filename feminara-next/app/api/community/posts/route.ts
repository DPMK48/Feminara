import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getUserId } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const userId = getUserId(req);
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const posts = await prisma.post.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      user: { select: { id: true, name: true } },
      _count: { select: { likes: true, comments: true } },
      likes: { where: { userId }, select: { id: true } },
    },
  });

  const shaped = posts.map((p) => ({
    id: p.id,
    content: p.content,
    createdAt: p.createdAt,
    user: p.user,
    likeCount: p._count.likes,
    commentCount: p._count.comments,
    likedByMe: p.likes.length > 0,
  }));

  return NextResponse.json({ posts: shaped });
}

export async function POST(req: NextRequest) {
  const userId = getUserId(req);
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { content } = await req.json();
  if (!content?.trim()) {
    return NextResponse.json({ error: 'Content is required' }, { status: 400 });
  }

  const post = await prisma.post.create({
    data: { userId, content: content.trim() },
    include: { user: { select: { id: true, name: true } } },
  });

  return NextResponse.json(
    {
      post: {
        ...post,
        likeCount: 0,
        commentCount: 0,
        likedByMe: false,
      },
    },
    { status: 201 }
  );
}
