// Letter API route for PDF download
import { NextRequest } from 'next/server';
import { successResponse, errorResponse } from '@/lib/api-response';
import prisma from '@/lib/prisma';
import { authenticateUser } from '@/lib/auth';
import path from 'path';
import fs from 'fs/promises';

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
    
    // Check if PDF exists
    if (!letter.pdfPath) {
      return errorResponse(
        'PDF not found for this letter',
        404,
        'PDF_NOT_FOUND'
      );
    }
    
    // Get PDF file path
    const pdfPath = path.join(process.cwd(), 'public', letter.pdfPath);
    
    try {
      // Check if file exists
      await fs.access(pdfPath);
      
      // Read file
      const pdfBuffer = await fs.readFile(pdfPath);
      
      // Return PDF file
      return new Response(pdfBuffer, {
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': `attachment; filename="${letter.letterType.replace(/\s+/g, '_')}_${letter.id}.pdf"`,
        },
      });
    } catch (error) {
      return errorResponse(
        'PDF file not found',
        404,
        'PDF_FILE_NOT_FOUND'
      );
    }
  } catch (error) {
    console.error('PDF download error:', error);
    return errorResponse(
      'An error occurred while downloading the PDF',
      500,
      'INTERNAL_ERROR'
    );
  }
}
