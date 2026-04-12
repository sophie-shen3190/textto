import { NextRequest, NextResponse } from 'next/server';

// Only allow proxying TextIn image CDN URLs — prevents SSRF abuse
const ALLOWED_ORIGINS = ['https://web-api.textin.com/'];

function isAllowed(url: string): boolean {
  return ALLOWED_ORIGINS.some((origin) => url.startsWith(origin));
}

export async function GET(req: NextRequest) {
  // Support both ?t=<base64url> (new, opaque) and ?url=<encoded> (legacy, backward-compat)
  const t   = req.nextUrl.searchParams.get('t');
  const raw = req.nextUrl.searchParams.get('url');

  let target: string;

  if (t) {
    try {
      target = Buffer.from(t, 'base64url').toString('utf8');
    } catch {
      return new NextResponse('Invalid token', { status: 400 });
    }
  } else if (raw) {
    target = raw;
  } else {
    return new NextResponse('Missing url or token parameter', { status: 400 });
  }

  if (!isAllowed(target)) {
    return new NextResponse('Forbidden', { status: 403 });
  }

  try {
    const response = await fetch(target);

    if (!response.ok) {
      return new NextResponse(`Failed to fetch file: ${response.statusText}`, {
        status: response.status,
      });
    }

    const contentType = response.headers.get('content-type') || 'application/octet-stream';

    return new NextResponse(response.body, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=86400, immutable',
      },
    });
  } catch (error) {
    console.error('Proxy error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
