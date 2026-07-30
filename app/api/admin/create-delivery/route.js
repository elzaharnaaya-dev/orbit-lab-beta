import { NextResponse } from 'next/server';
import { createDownloadToken } from '../../../../lib/token';

function authorized(request) {
  const expected = process.env.ADMIN_SECRET;
  const provided = request.headers.get('x-orbit-admin-secret');
  return Boolean(expected && provided && provided === expected);
}

export async function POST(request) {
  if (!authorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const { email, tier = 'founding-tester', paymentId = 'manual', testerNumber } = body;
  if (!email) return NextResponse.json({ error: 'Email is required' }, { status: 400 });

  const token = await createDownloadToken({ email, tier, paymentId, testerNumber });
  const origin = process.env.NEXT_PUBLIC_SITE_URL || new URL(request.url).origin;
  const downloadUrl = `${origin}/download?token=${encodeURIComponent(token)}`;

  return NextResponse.json({ email, tier, paymentId, testerNumber, downloadUrl });
}
