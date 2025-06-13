// Letter API route for getting all letters for a user
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
    
    // Get pagination parameters
    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;
    
    // Get letters
    const letters = await prisma.letter.findMany({
      where: { userId: decoded.userId },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
      select: {
        id: true,
        letterType: true,
        senderName: true,
        recipientName: true,
        date: true,
        createdAt: true
      }
    });
    
    // Get total count
    const total = await prisma.letter.count({
      where: { userId: decoded.userId }
    });
    
    // Return letters with pagination
    return successResponse({
      letters,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get letters error:', error);
    return errorResponse(
      'An error occurred while fetching letters',
      500,
      'INTERNAL_ERROR'
    );
  }
}
