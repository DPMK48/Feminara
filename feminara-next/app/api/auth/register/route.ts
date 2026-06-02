import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { normalizePhone } from '@/lib/phone';
import { sendSms } from '@/lib/sms';

export async function POST(req: NextRequest) {
  const { name, phone } = await req.json();

  if (!name?.trim() || !phone?.trim()) {
    return NextResponse.json({ error: 'Name and phone are required' }, { status: 400 });
  }

  const normalizedPhone = normalizePhone(phone);
  const existing = await prisma.user.findUnique({ where: { phone: normalizedPhone } });
  if (existing) {
    return NextResponse.json({ error: 'Phone number already registered' }, { status: 409 });
  }

  const code = String(Math.floor(100000 + Math.random() * 900000));
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
  await prisma.phoneVerification.upsert({
    where: { phone: normalizedPhone },
    update: { name: name.trim(), code, expiresAt },
    create: { name: name.trim(), phone: normalizedPhone, code, expiresAt },
  });

  const smsResult = await sendSms({
    to: normalizedPhone,
    body: `Your Feminara signup code is ${code}. It expires in 10 minutes.`,
  });

  if (!smsResult.ok) {
    if (smsResult.error === 'Twilio not configured') {
      return NextResponse.json({ ok: true, simulatedCode: code });
    }
    return NextResponse.json({ error: smsResult.error ?? 'Failed to send SMS' }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
