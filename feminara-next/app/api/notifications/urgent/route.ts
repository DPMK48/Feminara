import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { sendSms } from '@/lib/sms';

export async function POST(req: NextRequest) {
  const adminToken = process.env.URGENT_NOTICE_TOKEN;
  const headerToken = req.headers.get('x-urgent-token');
  if (adminToken && headerToken !== adminToken) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { title, detail } = await req.json();
  if (!title?.trim() || !detail?.trim()) {
    return NextResponse.json({ error: 'Title and detail required' }, { status: 400 });
  }

  const users = await prisma.user.findMany({ select: { phone: true } });
  const message = `Urgent notice: ${title}. ${detail}`;

  const results = await Promise.all(
    users.map((user) => sendSms({ to: user.phone, body: message }))
  );

  const failures = results.filter((result) => !result.ok).length;
  const sent = results.length - failures;

  return NextResponse.json({ ok: failures === 0, sent, failed: failures });
}
