import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { signToken } from '@/lib/auth';
import { normalizePhone } from '@/lib/phone';

export async function POST(req: NextRequest) {
  const { phone, code } = await req.json();

  if (!phone?.trim() || !code?.trim()) {
    return NextResponse.json({ error: 'Phone and code are required' }, { status: 400 });
  }

  const normalizedPhone = normalizePhone(phone);
  const verification = await prisma.phoneVerification.findUnique({
    where: { phone: normalizedPhone },
  });

  if (!verification) {
    return NextResponse.json({ error: 'Verification code not found' }, { status: 404 });
  }

  if (verification.expiresAt.getTime() < Date.now()) {
    await prisma.phoneVerification.delete({ where: { phone: normalizedPhone } });
    return NextResponse.json({ error: 'Verification code expired' }, { status: 410 });
  }

  if (verification.code !== String(code).trim()) {
    return NextResponse.json({ error: 'Invalid verification code' }, { status: 401 });
  }

  const existing = await prisma.user.findUnique({ where: { phone: normalizedPhone } });
  if (existing) {
    await prisma.phoneVerification.delete({ where: { phone: normalizedPhone } });
    const token = signToken({ userId: existing.id });
    return NextResponse.json({
      token,
      user: { id: existing.id, name: existing.name, phone: existing.phone },
    });
  }

  const user = await prisma.user.create({
    data: {
      name: verification.name.trim(),
      phone: normalizedPhone,
      lastLoginAt: new Date(),
    },
  });

  await prisma.phoneVerification.delete({ where: { phone: normalizedPhone } });

  const token = signToken({ userId: user.id });
  return NextResponse.json({
    token,
    user: { id: user.id, name: user.name, phone: user.phone },
  });
}
