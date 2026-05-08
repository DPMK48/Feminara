import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/db';
import { signToken } from '@/lib/auth';

export async function POST(req: NextRequest) {
  const { name, email, password } = await req.json();

  if (!name?.trim() || !email?.trim() || !password) {
    return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
  }

  const existing = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
  if (existing) {
    return NextResponse.json({ error: 'Email already registered' }, { status: 409 });
  }

  const hashed = await bcrypt.hash(password, 12);
  const user = await prisma.user.create({
    data: { name: name.trim(), email: email.toLowerCase(), password: hashed },
  });

  const token = signToken({ userId: user.id });
  return NextResponse.json({
    token,
    user: { id: user.id, name: user.name, email: user.email },
  });
}
