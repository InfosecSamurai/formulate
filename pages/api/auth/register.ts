// Authentication API route for user registration
import { NextRequest } from 'next/server';
import { registerSchema } from '@/lib/validation';
import { hashPassword } from '@/lib/auth';
import { successResponse, errorResponse, ApiErrors } from '@/lib/api-response';
import prisma from '@/lib/prisma';
import { generateToken } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    // Validate request body
    const body = await req.json();
    const validation = registerSchema.safeParse(body);
    
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
    
    const { email, password, fullName } = validation.data;
    
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });
    
    if (existingUser) {
      return errorResponse(
        'User with this email already exists',
        409,
        'USER_EXISTS'
      );
    }
    
    // Hash password
    const passwordHash = await hashPassword(password);
    
    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        fullName,
      }
    });
    
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
    }, 201);
  } catch (error) {
    console.error('Registration error:', error);
    return errorResponse(
      'An error occurred during registration',
      500,
      'INTERNAL_ERROR'
    );
  }
}
