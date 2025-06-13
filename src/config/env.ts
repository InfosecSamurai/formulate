// Environment variables configuration
export const env = {
  // Database
  DATABASE_URL: process.env.DATABASE_URL || 'postgresql://postgres:password@localhost:5432/formulate',
  
  // Authentication
  JWT_SECRET: process.env.JWT_SECRET || 'your-secret-key-for-development-only',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  
  // Email (for magic links)
  EMAIL_SERVER: process.env.EMAIL_SERVER || '',
  EMAIL_FROM: process.env.EMAIL_FROM || 'noreply@formulate.app',
  
  // Stripe (for premium subscriptions)
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY || '',
  STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET || '',
  STRIPE_MONTHLY_PRICE_ID: process.env.STRIPE_MONTHLY_PRICE_ID || '',
  STRIPE_YEARLY_PRICE_ID: process.env.STRIPE_YEARLY_PRICE_ID || '',
  
  // Application
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  NODE_ENV: process.env.NODE_ENV || 'development',
  
  // Validate required environment variables in production
  validateEnv: () => {
    if (process.env.NODE_ENV === 'production') {
      const requiredEnvVars = [
        'DATABASE_URL',
        'JWT_SECRET',
        'STRIPE_SECRET_KEY',
        'STRIPE_WEBHOOK_SECRET',
        'NEXT_PUBLIC_APP_URL'
      ];
      
      for (const envVar of requiredEnvVars) {
        if (!process.env[envVar]) {
          throw new Error(`Environment variable ${envVar} is required in production`);
        }
      }
    }
  }
};
