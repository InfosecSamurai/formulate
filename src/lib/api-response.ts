// API response utility
import { NextResponse } from 'next/server';

type ApiResponse<T> = {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    code?: string;
    errors?: Array<{ path: string; message: string }>;
  };
};

export function successResponse<T>(data: T, status = 200): NextResponse<ApiResponse<T>> {
  return NextResponse.json(
    {
      success: true,
      data,
    },
    { status }
  );
}

export function errorResponse(
  message: string,
  status = 400,
  code?: string,
  errors?: Array<{ path: string; message: string }>
): NextResponse<ApiResponse<never>> {
  return NextResponse.json(
    {
      success: false,
      error: {
        message,
        ...(code && { code }),
        ...(errors && { errors }),
      },
    },
    { status }
  );
}

export const ApiErrors = {
  BAD_REQUEST: { status: 400, code: 'BAD_REQUEST', message: 'Bad request' },
  UNAUTHORIZED: { status: 401, code: 'UNAUTHORIZED', message: 'Unauthorized' },
  FORBIDDEN: { status: 403, code: 'FORBIDDEN', message: 'Forbidden' },
  NOT_FOUND: { status: 404, code: 'NOT_FOUND', message: 'Resource not found' },
  VALIDATION_ERROR: { status: 422, code: 'VALIDATION_ERROR', message: 'Validation error' },
  INTERNAL_ERROR: { status: 500, code: 'INTERNAL_ERROR', message: 'Internal server error' },
};
