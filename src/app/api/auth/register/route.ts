import { NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8080';

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json();

    const response = await fetch(`${BACKEND_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });

    const {data} = await response.json();

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    const { token } = data;
    const nextResponse = NextResponse.json(data, { status: 201 });
    nextResponse.cookies.set('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'none',
      maxAge: 3600,
    });

    return nextResponse;
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json({ data: null, message: '', error: 'Registration failed' }, { status: 500 });
  }
}