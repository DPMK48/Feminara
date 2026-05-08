import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getUserId } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const userId = getUserId(req);
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, name: true, email: true, createdAt: true },
  });

  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });
  return NextResponse.json({ user });
}
