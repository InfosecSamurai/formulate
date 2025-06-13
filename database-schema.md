# Formulate Database Schema

## Overview

This document outlines the database schema for the Formulate application, which will be implemented using PostgreSQL or Supabase. The schema is designed to support user authentication, letter generation and storage, premium features, and PDF generation.

## Tables

### Users

The `users` table stores user account information and authentication details.

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255),
  full_name VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_login_at TIMESTAMP WITH TIME ZONE,
  is_premium BOOLEAN DEFAULT FALSE,
  premium_until TIMESTAMP WITH TIME ZONE
);
```

### Letters

The `letters` table stores all generated letters with their content and metadata.

```sql
CREATE TABLE letters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  letter_type VARCHAR(100) NOT NULL,
  sender_name VARCHAR(255) NOT NULL,
  recipient_name VARCHAR(255) NOT NULL,
  date DATE NOT NULL,
  situation_details TEXT NOT NULL,
  include_address BOOLEAN DEFAULT FALSE,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  pdf_path VARCHAR(255)
);

CREATE INDEX letters_user_id_idx ON letters(user_id);
```

### LetterTemplates

The `letter_templates` table stores both standard and premium letter templates.

```sql
CREATE TABLE letter_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL UNIQUE,
  template_text TEXT NOT NULL,
  is_premium BOOLEAN DEFAULT FALSE,
  category VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Subscriptions

The `subscriptions` table tracks premium subscription details and payment information.

```sql
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  stripe_customer_id VARCHAR(255),
  stripe_subscription_id VARCHAR(255),
  plan_type VARCHAR(50) NOT NULL,
  status VARCHAR(50) NOT NULL,
  current_period_start TIMESTAMP WITH TIME ZONE,
  current_period_end TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX subscriptions_user_id_idx ON subscriptions(user_id);
```

### UserSessions

The `user_sessions` table manages authentication sessions for users.

```sql
CREATE TABLE user_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token VARCHAR(255) NOT NULL UNIQUE,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ip_address VARCHAR(45),
  user_agent TEXT
);

CREATE INDEX user_sessions_user_id_idx ON user_sessions(user_id);
CREATE INDEX user_sessions_token_idx ON user_sessions(token);
```

### MagicLinks

The `magic_links` table stores temporary magic links for passwordless authentication.

```sql
CREATE TABLE magic_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) NOT NULL,
  token VARCHAR(255) NOT NULL UNIQUE,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  used BOOLEAN DEFAULT FALSE
);

CREATE INDEX magic_links_token_idx ON magic_links(token);
CREATE INDEX magic_links_email_idx ON magic_links(email);
```

## Relationships

- A user can have many letters (one-to-many)
- A user can have one active subscription (one-to-one)
- A user can have many sessions (one-to-many)
- Letter templates are independent entities (no direct relationship)
- Magic links are associated with an email but not necessarily an existing user

## Notes

1. The schema uses UUIDs for primary keys to enhance security and facilitate distributed systems.
2. Timestamps include time zones to handle users from different regions.
3. Appropriate indexes are created for frequently queried columns.
4. Foreign key constraints ensure referential integrity.
5. The `pdf_path` column in the `letters` table will store the path to generated PDF files.
