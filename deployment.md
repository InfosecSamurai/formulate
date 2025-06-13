# Formulate Deployment Configuration

## Vercel Deployment

This project is configured for easy deployment on Vercel. Follow these steps to deploy:

1. Create a Vercel account if you don't have one already
2. Install the Vercel CLI: `npm i -g vercel`
3. Run `vercel login` and follow the prompts
4. From the project root, run `vercel` to deploy to a preview environment
5. Run `vercel --prod` to deploy to production

## Environment Variables

Make sure to set the following environment variables in your Vercel project settings:

- `DATABASE_URL`: Your PostgreSQL connection string
- `JWT_SECRET`: A secure random string for JWT token signing
- `EMAIL_SERVER`: SMTP server details for sending magic links
- `EMAIL_FROM`: Email address to send from
- `STRIPE_SECRET_KEY`: Your Stripe secret key
- `STRIPE_WEBHOOK_SECRET`: Your Stripe webhook secret
- `STRIPE_MONTHLY_PRICE_ID`: ID of your monthly subscription price in Stripe
- `STRIPE_YEARLY_PRICE_ID`: ID of your yearly subscription price in Stripe
- `NEXT_PUBLIC_APP_URL`: The public URL of your deployed application

## Database Setup

This project uses Prisma with PostgreSQL. To set up the database:

1. Create a PostgreSQL database
2. Set the `DATABASE_URL` environment variable
3. Run migrations: `npx prisma migrate deploy`
4. Seed the database: `npx prisma db seed`

## Render Deployment (Alternative)

To deploy on Render:

1. Create a new Web Service in Render
2. Connect your GitHub repository
3. Set the build command: `npm install && npx prisma generate && npm run build`
4. Set the start command: `npm start`
5. Add all required environment variables
6. Create a PostgreSQL database in Render and link it to your service

## Supabase Setup (Alternative to self-hosted PostgreSQL)

If using Supabase:

1. Create a Supabase project
2. Get your connection string from the Supabase dashboard
3. Set it as your `DATABASE_URL` environment variable
4. Run migrations: `npx prisma migrate deploy`

## Continuous Integration

This project includes a GitHub Actions workflow for CI/CD. To use it:

1. Add your environment variables as GitHub secrets
2. Push to the main branch to trigger automatic deployment
