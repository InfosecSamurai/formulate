// Authentication API route for getting current user
import { NextRequest } from 'next/server';
import { successResponse, errorResponse } from '@/lib/api-response';
import prisma from '@/lib/prisma';
import { authenticateUser } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    // Authenticate user
    const decoded = await authenticateUser(req);
    
    if (!decoded || !decoded.userId) {
      return errorResponse(
        'Unauthorized',
        401,
        'UNAUTHORIZED'
      );
    }
    
    // Get user data
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId }
    });
    
    if (!user) {
      return errorResponse(
        'User not found',
        404,
        'USER_NOT_FOUND'
      );
    }
    
    // Return user data
    return successResponse({
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        isPremium: user.isPremium,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    console.error('Get user error:', error);
    return errorResponse(
      'An error occurred while fetching user data',
      500,
      'INTERNAL_ERROR'
    );
  }
}
