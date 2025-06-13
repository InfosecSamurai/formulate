// Subscription API route for creating a checkout session
import { NextRequest } from 'next/server';
import { subscriptionSchema } from '@/lib/validation';
import { successResponse, errorResponse } from '@/lib/api-response';
import prisma from '@/lib/prisma';
import { authenticateUser } from '@/lib/auth';
import { env } from '@/config/env';
import Stripe from 'stripe';

// Initialize Stripe
const stripe = new Stripe(env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16',
});

export async function POST(req: NextRequest) {
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
    
    // Validate request body
    const body = await req.json();
    const validation = subscriptionSchema.safeParse(body);
    
    if (!validation.success) {
      return errorResponse(
        'Validation error',
        422,
        'VALIDATION_ERROR',
        validation.error.errors.map(err => ({
          path: err.path.join('.'),
          message: err.message
        }))
      );
    }
    
    const { planType } = validation.data;
    
    // Get user
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      include: { subscription: true }
    });
    
    if (!user) {
      return errorResponse(
        'User not found',
        404,
        'USER_NOT_FOUND'
      );
    }
    
    // Check if user already has an active subscription
    if (user.subscription?.status === 'active' && user.isPremium) {
      return errorResponse(
        'User already has an active subscription',
        400,
        'SUBSCRIPTION_EXISTS'
      );
    }
    
    // Get price ID based on plan type
    const priceId = planType === 'monthly' 
      ? env.STRIPE_MONTHLY_PRICE_ID 
      : env.STRIPE_YEARLY_PRICE_ID;
    
    if (!priceId) {
      return errorResponse(
        'Price ID not configured',
        500,
        'PRICE_ID_MISSING'
      );
    }
    
    // Create or get Stripe customer
    let stripeCustomerId = user.subscription?.stripeCustomerId;
    
    if (!stripeCustomerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        name: user.fullName || undefined,
        metadata: {
          userId: user.id
        }
      });
      
      stripeCustomerId = customer.id;
    }
    
    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer: stripeCustomerId,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${env.NEXT_PUBLIC_APP_URL}/subscription/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${env.NEXT_PUBLIC_APP_URL}/subscription/cancel`,
      metadata: {
        userId: user.id,
        planType
      }
    });
    
    // Return checkout URL
    return successResponse({
      checkoutUrl: session.url
    });
  } catch (error) {
    console.error('Create checkout error:', error);
    return errorResponse(
      'An error occurred while creating checkout session',
      500,
      'INTERNAL_ERROR'
    );
  }
}
