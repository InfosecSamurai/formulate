// Template API route for getting all templates
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
    
    // Get templates
    const templates = await prisma.letterTemplate.findMany({
      select: {
        id: true,
        name: true,
        isPremium: true,
        category: true
      }
    });
    
    // Return templates
    return successResponse({ templates });
  } catch (error) {
    console.error('Get templates error:', error);
    return errorResponse(
      'An error occurred while fetching templates',
      500,
      'INTERNAL_ERROR'
    );
  }
}
