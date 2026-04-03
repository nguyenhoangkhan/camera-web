import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json();

    // Mock credentials
    if (username === 'admin' && password === '123456') {
      const cookieStore = await cookies();
      cookieStore.set('admin_session', 'khan_authorized_2024', { 
        httpOnly: true, 
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        maxAge: 60 * 60 * 24 // 1 day
      });
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'Sai tài khoản hoặc mật khẩu' }, { status: 401 });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
