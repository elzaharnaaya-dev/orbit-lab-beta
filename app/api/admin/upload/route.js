import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';

function authorized(request) {
  const expected = process.env.ADMIN_SECRET;
  const provided = request.headers.get('x-orbit-admin-secret');
  return Boolean(expected && provided && provided === expected);
}

export async function POST(request) {
  if (!authorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const filename = searchParams.get('filename');
  if (!filename) return NextResponse.json({ error: 'filename is required' }, { status: 400 });

  const blob = await put(`products/${filename}`, request.body, {
    access: 'private',
    allowOverwrite: true,
  });

  return NextResponse.json({ pathname: blob.pathname, url: blob.url });
}
