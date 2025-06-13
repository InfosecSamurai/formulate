// Form validation utilities
import { z } from 'zod';

// User validation schemas
export const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const magicLinkSchema = z.object({
  email: z.string().email('Invalid email address'),
});

// Letter validation schemas
export const letterSchema = z.object({
  letterType: z.string().min(1, 'Letter type is required'),
  senderName: z.string().min(1, 'Sender name is required'),
  recipientName: z.string().min(1, 'Recipient name is required'),
  date: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: 'Invalid date format',
  }),
  situationDetails: z.string().min(10, 'Situation details must be at least 10 characters'),
  includeAddress: z.boolean().optional().default(false),
});

// Subscription validation schemas
export const subscriptionSchema = z.object({
  planType: z.enum(['monthly', 'yearly'], {
    errorMap: () => ({ message: 'Plan type must be either monthly or yearly' }),
  }),
});

// Helper function to validate request body against a schema
export async function validateRequest<T>(
  req: Request,
  schema: z.ZodType<T>
): Promise<{ success: true; data: T } | { success: false; error: z.ZodError }> {
  try {
    const body = await req.json();
    const data = schema.parse(body);
    return { success: true, data };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error };
    }
    throw error;
  }
}

// Format Zod validation errors for API responses
export function formatZodError(error: z.ZodError) {
  return {
    message: 'Validation error',
    errors: error.errors.map((err) => ({
      path: err.path.join('.'),
      message: err.message,
    })),
  };
}
