// Letter API route for getting a specific letter
import { NextRequest } from 'next/server';
import { successResponse, errorResponse } from '@/lib/api-response';
import prisma from '@/lib/prisma';
import { authenticateUser } from '@/lib/auth';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
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
    
    const { id } = params;
    
    // Get letter
    const letter = await prisma.letter.findUnique({
      where: { id }
    });
    
    if (!letter) {
      return errorResponse(
        'Letter not found',
        404,
        'LETTER_NOT_FOUND'
      );
    }
    
    // Check if user owns the letter
    if (letter.userId !== decoded.userId) {
      return errorResponse(
        'Forbidden',
        403,
        'FORBIDDEN'
      );
    }
    
    // Return letter data
    return successResponse({ letter });
  } catch (error) {
    console.error('Get letter error:', error);
    return errorResponse(
      'An error occurred while fetching the letter',
      500,
      'INTERNAL_ERROR'
    );
  }
}
