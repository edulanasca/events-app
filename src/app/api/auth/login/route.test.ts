//import { NextResponse } from 'next/server';

global.Request = jest.fn().mockImplementation((url: string, options: RequestInit) => ({
  url,
  ...options,
  json: jest.fn().mockResolvedValue(JSON.parse(options.body as string)),
})) as unknown as typeof Request;

global.Response = jest.fn().mockImplementation((body: object, options: ResponseInit) => ({
  body,
  ...options,
})) as unknown as typeof Response;

jest.mock('next/server', () => ({
  NextResponse: {
    json: jest.fn().mockImplementation((body: object, options?: ResponseInit) => ({
      json: () => Promise.resolve(body),
      ...options,
      cookies: {
        set: jest.fn(),
      },
      headers: {
        get: jest.fn().mockReturnValue('auth_token=token'),
      },
    })),
  },
}));

import { POST } from './route';
import { prisma } from 'eventsapp/lib/prisma';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

jest.mock('eventsapp/lib/prisma', () => ({
  prisma: {
    user: {
      findUnique: jest.fn(),
    },
  },
}));
jest.mock('bcryptjs');
jest.mock('jsonwebtoken');

describe('POST /api/auth/login', () => {
  it('should return 200 and a token for valid credentials', async () => {
    const mockUser = { id: '1', email: 'user@example.com', password: 'hashedpassword' };
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);
    (jwt.sign as jest.Mock).mockReturnValue('token');

    const request = new Request('http://localhost/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email: 'user@example.com', password: 'password123' }),
    });

    const response = await POST(request);
    const json = await response.json();

    expect(response.status).toBe(200);
    expect(json.message).toBe('Login successful');
    expect(response.headers.get('Set-Cookie')).toContain('auth_token=token');
  });

  it('should return 401 for invalid password', async () => {
    const mockUser = { id: '1', email: 'user@example.com', password: 'hashedpassword' };
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
    (bcrypt.compare as jest.Mock).mockResolvedValue(false);

    const request = new Request('http://localhost/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email: 'user@example.com', password: 'wrongpassword' }),
    });

    const response = await POST(request);
    const json = await response.json();

    expect(response.status).toBe(401);
    expect(json.error).toBe('Invalid password');
  });

  it('should return 404 for non-existent user', async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

    const request = new Request('http://localhost/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email: 'nonexistent@example.com', password: 'password123' }),
    });

    const response = await POST(request);
    const json = await response.json();

    expect(response.status).toBe(404);
    expect(json.error).toBe('User does not exist');
  });
});