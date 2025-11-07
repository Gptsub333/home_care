// app/api/auth/login/route.js
import { NextResponse } from 'next/server';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://home-care-backend.onrender.com/api';

export async function POST(request) {
  try {
    const body = await request.json();
    
    // Call your backend
    const response = await fetch(`${BACKEND_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    // Create response with the data
    const nextResponse = NextResponse.json(data);

    // Set the token as a cookie from YOUR domain (not cross-origin)
    nextResponse.cookies.set('token', data.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax', // Can use 'lax' now since it's same-origin!
      maxAge: 7 * 24 * 60 * 60, // 7 days in seconds
      path: '/',
    });

    return nextResponse;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    );
  }
}