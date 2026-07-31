import { get } from '@vercel/blob';
import { NextResponse } from 'next/server';
import { verifyDownloadToken } from '../../../lib/token';

export const runtime = 'nodejs';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');
    const pathname = searchParams.get('pathname');

    if (!token || !pathname) {
      return NextResponse.json({ error: 'Missing token or pathname' }, { status: 400 });
    }

    const payload = await verifyDownloadToken(token);
    if (!payload?.email || !payload?.tier) {
      return NextResponse.json({ error: 'Invalid delivery token' }, { status: 401 });
    }

    if (!pathname.startsWith('products/')) {
      return NextResponse.json({ error: 'Invalid file path' }, { status: 403 });
    }

    const result = await get(pathname, { access: 'private' });
    if (!result || result.statusCode !== 200) {
      return new NextResponse('File not found', { status: 404 });
    }

    const filename = pathname.split('/').pop() || 'orbit-download';

    return new NextResponse(result.stream, {
      headers: {
        'Content-Type': result.blob.contentType || 'application/octet-stream',
        'Content-Disposition': `attachment; filename="${filename.replaceAll('"', '')}"`,
        'Cache-Control': 'private, no-store',
        'X-Content-Type-Options': 'nosniff',
      },
    });
  } catch {
    return NextResponse.json({ error: 'This download link is invalid or expired.' }, { status: 401 });
  }
}
