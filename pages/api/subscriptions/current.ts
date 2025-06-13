// Subscription API route for getting current subscription
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
    
    // Get user subscription
    const subscription = await prisma.subscription.findUnique({
      where: { userId: decoded.userId }
    });
    
    if (!subscription) {
      return successResponse({ subscription: null });
    }
    
    // Return subscription data
    return successResponse({
      subscription: {
        id: subscription.id,
        planType: subscription.planType,
        status: subscription.status,
        currentPeriodEnd: subscription.currentPeriodEnd
      }
    });
  } catch (error) {
    console.error('Get subscription error:', error);
    return errorResponse(
      'An error occurred while fetching subscription data',
      500,
      'INTERNAL_ERROR'
    );
  }
}
