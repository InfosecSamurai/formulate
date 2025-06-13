// Authentication API route for verifying magic links
import { NextRequest } from 'next/server';
import { successResponse, errorResponse } from '@/lib/api-response';
import prisma from '@/lib/prisma';
import { generateToken } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    // Get token from query parameters
    const url = new URL(req.url);
    const token = url.searchParams.get('token');
    
    if (!token) {
      return errorResponse(
        'Token is required',
        400,
        'MISSING_TOKEN'
      );
    }
    
    // Find magic link
    const magicLink = await prisma.magicLink.findUnique({
      where: { token }
    });
    
    if (!magicLink) {
      return errorResponse(
        'Invalid or expired token',
        400,
        'INVALID_TOKEN'
      );
    }
    
    if (magicLink.used) {
      return errorResponse(
        'Token has already been used',
        400,
        'TOKEN_USED'
      );
    }
    
    if (magicLink.expiresAt < new Date()) {
      return errorResponse(
        'Token has expired',
        400,
        'TOKEN_EXPIRED'
      );
    }
    
    // Mark token as used
    await prisma.magicLink.update({
      where: { id: magicLink.id },
      data: { used: true }
    });
    
    // Find or create user
    let user = await prisma.user.findUnique({
      where: { email: magicLink.email }
    });
    
    if (!user) {
      // Create new user if they don't exist
      user = await prisma.user.create({
        data: {
          email: magicLink.email,
          fullName: magicLink.email.split('@')[0], // Default name from email
        }
      });
    }
    
    // Generate JWT token
    const jwtToken = generateToken({ userId: user.id });
    
    // Create user session
    await prisma.userSession.create({
      data: {
        userId: user.id,
        token: jwtToken,
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
      token: jwtToken
    });
  } catch (error) {
    console.error('Magic link verification error:', error);
    return errorResponse(
      'An error occurred during verification',
      500,
      'INTERNAL_ERROR'
    );
  }
}
