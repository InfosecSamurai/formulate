// Template API route for getting a specific template
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
    
    // Get template
    const template = await prisma.letterTemplate.findUnique({
      where: { id }
    });
    
    if (!template) {
      return errorResponse(
        'Template not found',
        404,
        'TEMPLATE_NOT_FOUND'
      );
    }
    
    // Check if template is premium and user is not premium
    if (template.isPremium) {
      const user = await prisma.user.findUnique({
        where: { id: decoded.userId }
      });
      
      if (!user?.isPremium) {
        return errorResponse(
          'Premium subscription required for this template',
          403,
          'PREMIUM_REQUIRED'
        );
      }
    }
    
    // Return template data
    return successResponse({ template });
  } catch (error) {
    console.error('Get template error:', error);
    return errorResponse(
      'An error occurred while fetching the template',
      500,
      'INTERNAL_ERROR'
    );
  }
}
