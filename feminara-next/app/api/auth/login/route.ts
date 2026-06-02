import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { signToken } from '@/lib/auth';
import { normalizePhone } from '@/lib/phone';

export async function POST(req: NextRequest) {
  const { phone } = await req.json();

  if (!phone?.trim()) {
    return NextResponse.json({ error: 'Phone number required' }, { status: 400 });
  }

  const normalizedPhone = normalizePhone(phone);
  const user = await prisma.user.findUnique({ where: { phone: normalizedPhone } });
  if (!user) {
    return NextResponse.json({ error: 'Phone number not registered' }, { status: 404 });
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { lastLoginAt: new Date() },
  });

  const token = signToken({ userId: user.id });
  return NextResponse.json({
    token,
    user: { id: user.id, name: user.name, phone: user.phone },
  });
}
