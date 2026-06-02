import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getUserId } from '@/lib/auth';
import { sendSms } from '@/lib/sms';

export async function POST(req: NextRequest) {
  const userId = getUserId(req);
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { title, goal } = await req.json();
  if (!title?.trim()) {
    return NextResponse.json({ error: 'Challenge title required' }, { status: 400 });
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { phone: true, name: true },
  });

  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

  const body = goal?.trim()
    ? `You joined the ${title} challenge. Goal: ${goal}`
    : `You joined the ${title} challenge.`;

  const result = await sendSms({ to: user.phone, body });
  if (!result.ok) {
    return NextResponse.json({ error: result.error ?? 'Failed to send SMS' }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
