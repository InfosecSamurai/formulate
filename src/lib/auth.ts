// Authentication utilities
import { sign, verify } from 'jsonwebtoken';
import { hash, compare } from 'bcryptjs';
import { randomBytes } from 'crypto';

// JWT token generation
export function generateToken(payload: any, expiresIn = '7d') {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET is not defined in environment variables');
  }
  return sign(payload, secret, { expiresIn });
}

// JWT token verification
export function verifyToken(token: string) {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET is not defined in environment variables');
  }
  try {
    return verify(token, secret);
  } catch (error) {
    return null;
  }
}

// Extract token from Authorization header
export function extractTokenFromHeader(authHeader: string | null) {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  return authHeader.split(' ')[1];
}

// Password hashing
export async function hashPassword(password: string) {
  return hash(password, 12);
}

// Password verification
export async function verifyPassword(password: string, hashedPassword: string) {
  return compare(password, hashedPassword);
}

// Generate random token for magic links
export function generateRandomToken() {
  return randomBytes(32).toString('hex');
}

// Authentication middleware for API routes
export async function authenticateUser(req: Request) {
  const authHeader = req.headers.get('Authorization');
  const token = extractTokenFromHeader(authHeader);
  
  if (!token) {
    return null;
  }
  
  const decoded = verifyToken(token);
  if (!decoded || typeof decoded !== 'object') {
    return null;
  }
  
  return decoded;
}
