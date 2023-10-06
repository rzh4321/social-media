import { NextResponse } from 'next/server'
import { headers } from 'next/headers';
import url from 'url';


export async function middleware(request) {
    const headersList = headers()
    const referer = headersList.get('referer');
    if (referer === null) {
      return NextResponse.json('no');
    }
    const parsedUrl = url.parse(referer);
    const baseUrl = `${parsedUrl.protocol}//${parsedUrl.host}`;
    if (baseUrl === 'http://localhost:3000' || baseUrl === 'https://retiform.vercel.app') {
      return NextResponse.next();
    }
    return NextResponse.json('no');
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: '/api/:path*',
}