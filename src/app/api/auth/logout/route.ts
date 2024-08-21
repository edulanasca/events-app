import { NextResponse } from 'next/server';

export async function POST() {
    const nextResponse = NextResponse.json({}, { status: 200 });
    nextResponse.cookies.set('auth_token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 0,
    });

    return nextResponse;
}