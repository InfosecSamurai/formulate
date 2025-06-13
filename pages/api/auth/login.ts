// Authentication API route for user login
import { NextRequest } from 'next/server';
import { loginSchema } from '@/lib/validation';
import { verifyPassword } from '@/lib/auth';
import { successResponse, errorResponse } from '@/lib/api-response';
import prisma from '@/lib/prisma';
import { generateToken } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    // Validate request body
    const body = await req.json();
    const validation = loginSchema.safeParse(body);
    
    if (!validation.success) {
      return errorResponse(
        'Validation error',
        422,
        'VALIDATION_ERROR',
        validation.error.errors.map(err => ({
          path: err.path.join('.'),
          message: err.message
        }))
      );
    }
    
    const { email, password } = validation.data;
    
    // Find user
    const user = await prisma.user.findUnique({
      where: { email }
    });
    
    if (!user || !user.passwordHash) {
      return errorResponse(
        'Invalid email or password',
        401,
        'INVALID_CREDENTIALS'
      );
    }
    
    // Verify password
    const isPasswordValid = await verifyPassword(password, user.passwordHash);
    
    if (!isPasswordValid) {
      return errorResponse(
        'Invalid email or password',
        401,
        'INVALID_CREDENTIALS'
      );
    }
    
    // Generate JWT token
    const token = generateToken({ userId: user.id });
    
    // Create user session
    await prisma.userSession.create({
      data: {
        userId: user.id,
        token,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
        ipAddress: req.headers.get('x-forwarded-for') || req.ip,
        userAgent: req.headers.get('user-agent'),
      }
    });
    
    // Update last login time
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() }
    });
    
    // Return user data and token
    return successResponse({
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        isPremium: user.isPremium,
        createdAt: user.createdAt
      },
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    return errorResponse(
      'An error occurred during login',
      500,
      'INTERNAL_ERROR'
    );
  }
}
