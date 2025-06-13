// Authentication API route for magic link generation
import { NextRequest } from 'next/server';
import { magicLinkSchema } from '@/lib/validation';
import { generateRandomToken } from '@/lib/auth';
import { successResponse, errorResponse } from '@/lib/api-response';
import prisma from '@/lib/prisma';
import { env } from '@/config/env';

export async function POST(req: NextRequest) {
  try {
    // Validate request body
    const body = await req.json();
    const validation = magicLinkSchema.safeParse(body);
    
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
    
    const { email } = validation.data;
    
    // Generate token
    const token = generateRandomToken();
    const expiresAt = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes
    
    // Store magic link
    await prisma.magicLink.create({
      data: {
        email,
        token,
        expiresAt
      }
    });
    
    // In a real app, send email with magic link
    // For now, just log it (would use a proper email service in production)
    console.log(`Magic link for ${email}: ${env.NEXT_PUBLIC_APP_URL}/api/auth/verify?token=${token}`);
    
    return successResponse({
      message: 'Magic link sent to your email'
    });
  } catch (error) {
    console.error('Magic link error:', error);
    return errorResponse(
      'An error occurred while generating magic link',
      500,
      'INTERNAL_ERROR'
    );
  }
}
