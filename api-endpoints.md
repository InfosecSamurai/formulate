# Formulate API Endpoints

## Overview

This document outlines the API endpoints for the Formulate application. The API will be implemented using Next.js API routes, providing a RESTful interface for the frontend to interact with the backend.

## Authentication Endpoints

### POST /api/auth/register
- **Description**: Register a new user
- **Request Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "securepassword",
    "fullName": "John Doe"
  }
  ```
- **Response**: 
  ```json
  {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "fullName": "John Doe",
      "isPremium": false,
      "createdAt": "timestamp"
    },
    "token": "jwt-token"
  }
  ```

### POST /api/auth/login
- **Description**: Log in an existing user
- **Request Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "securepassword"
  }
  ```
- **Response**: 
  ```json
  {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "fullName": "John Doe",
      "isPremium": false,
      "createdAt": "timestamp"
    },
    "token": "jwt-token"
  }
  ```

### POST /api/auth/magic-link
- **Description**: Send a magic link for passwordless authentication
- **Request Body**:
  ```json
  {
    "email": "user@example.com"
  }
  ```
- **Response**: 
  ```json
  {
    "message": "Magic link sent to your email"
  }
  ```

### GET /api/auth/verify
- **Description**: Verify a magic link token
- **Query Parameters**: `token=xyz123`
- **Response**: 
  ```json
  {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "fullName": "John Doe",
      "isPremium": false,
      "createdAt": "timestamp"
    },
    "token": "jwt-token"
  }
  ```

### POST /api/auth/logout
- **Description**: Log out a user
- **Headers**: `Authorization: Bearer jwt-token`
- **Response**: 
  ```json
  {
    "message": "Logged out successfully"
  }
  ```

### GET /api/auth/me
- **Description**: Get the current user's profile
- **Headers**: `Authorization: Bearer jwt-token`
- **Response**: 
  ```json
  {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "fullName": "John Doe",
      "isPremium": false,
      "createdAt": "timestamp"
    }
  }
  ```

## Letter Endpoints

### POST /api/letters
- **Description**: Create a new letter
- **Headers**: `Authorization: Bearer jwt-token`
- **Request Body**:
  ```json
  {
    "letterType": "Credit Dispute",
    "senderName": "John Doe",
    "recipientName": "Credit Bureau",
    "date": "2025-05-27",
    "situationDetails": "I am disputing a charge on my credit report...",
    "includeAddress": true
  }
  ```
- **Response**: 
  ```json
  {
    "letter": {
      "id": "uuid",
      "letterType": "Credit Dispute",
      "senderName": "John Doe",
      "recipientName": "Credit Bureau",
      "date": "2025-05-27",
      "situationDetails": "I am disputing a charge on my credit report...",
      "includeAddress": true,
      "content": "Dear Credit Bureau, I am writing to formally dispute...",
      "createdAt": "timestamp",
      "pdfPath": "/letters/uuid.pdf"
    }
  }
  ```

### GET /api/letters
- **Description**: Get all letters for the current user
- **Headers**: `Authorization: Bearer jwt-token`
- **Query Parameters**: `page=1&limit=10`
- **Response**: 
  ```json
  {
    "letters": [
      {
        "id": "uuid",
        "letterType": "Credit Dispute",
        "senderName": "John Doe",
        "recipientName": "Credit Bureau",
        "date": "2025-05-27",
        "createdAt": "timestamp"
      }
    ],
    "pagination": {
      "total": 25,
      "page": 1,
      "limit": 10,
      "pages": 3
    }
  }
  ```

### GET /api/letters/:id
- **Description**: Get a specific letter by ID
- **Headers**: `Authorization: Bearer jwt-token`
- **Response**: 
  ```json
  {
    "letter": {
      "id": "uuid",
      "letterType": "Credit Dispute",
      "senderName": "John Doe",
      "recipientName": "Credit Bureau",
      "date": "2025-05-27",
      "situationDetails": "I am disputing a charge on my credit report...",
      "includeAddress": true,
      "content": "Dear Credit Bureau, I am writing to formally dispute...",
      "createdAt": "timestamp",
      "pdfPath": "/letters/uuid.pdf"
    }
  }
  ```

### PUT /api/letters/:id
- **Description**: Update a specific letter
- **Headers**: `Authorization: Bearer jwt-token`
- **Request Body**:
  ```json
  {
    "letterType": "Credit Dispute",
    "senderName": "John Doe",
    "recipientName": "Updated Credit Bureau",
    "date": "2025-05-27",
    "situationDetails": "Updated details about my dispute...",
    "includeAddress": true
  }
  ```
- **Response**: 
  ```json
  {
    "letter": {
      "id": "uuid",
      "letterType": "Credit Dispute",
      "senderName": "John Doe",
      "recipientName": "Updated Credit Bureau",
      "date": "2025-05-27",
      "situationDetails": "Updated details about my dispute...",
      "includeAddress": true,
      "content": "Dear Updated Credit Bureau, I am writing to formally dispute...",
      "createdAt": "timestamp",
      "updatedAt": "timestamp",
      "pdfPath": "/letters/uuid.pdf"
    }
  }
  ```

### DELETE /api/letters/:id
- **Description**: Delete a specific letter
- **Headers**: `Authorization: Bearer jwt-token`
- **Response**: 
  ```json
  {
    "message": "Letter deleted successfully"
  }
  ```

### GET /api/letters/:id/pdf
- **Description**: Generate and download a PDF for a specific letter
- **Headers**: `Authorization: Bearer jwt-token`
- **Response**: PDF file download

## Template Endpoints

### GET /api/templates
- **Description**: Get all letter templates
- **Headers**: `Authorization: Bearer jwt-token`
- **Response**: 
  ```json
  {
    "templates": [
      {
        "id": "uuid",
        "name": "Credit Dispute",
        "isPremium": false,
        "category": "Financial"
      },
      {
        "id": "uuid",
        "name": "Legal Notice",
        "isPremium": true,
        "category": "Legal"
      }
    ]
  }
  ```

### GET /api/templates/:id
- **Description**: Get a specific template by ID
- **Headers**: `Authorization: Bearer jwt-token`
- **Response**: 
  ```json
  {
    "template": {
      "id": "uuid",
      "name": "Credit Dispute",
      "templateText": "Dear {recipientName}, I am writing to formally dispute...",
      "isPremium": false,
      "category": "Financial"
    }
  }
  ```

## Subscription Endpoints

### POST /api/subscriptions/create-checkout
- **Description**: Create a Stripe checkout session for premium subscription
- **Headers**: `Authorization: Bearer jwt-token`
- **Request Body**:
  ```json
  {
    "planType": "monthly"
  }
  ```
- **Response**: 
  ```json
  {
    "checkoutUrl": "https://checkout.stripe.com/..."
  }
  ```

### GET /api/subscriptions/current
- **Description**: Get the current user's subscription details
- **Headers**: `Authorization: Bearer jwt-token`
- **Response**: 
  ```json
  {
    "subscription": {
      "id": "uuid",
      "planType": "monthly",
      "status": "active",
      "currentPeriodEnd": "timestamp"
    }
  }
  ```

### POST /api/subscriptions/webhook
- **Description**: Webhook endpoint for Stripe events
- **Request Body**: Stripe webhook event
- **Response**: 200 OK

## Error Handling

All endpoints will return appropriate HTTP status codes:
- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Internal Server Error

Error responses will follow this format:
```json
{
  "error": {
    "message": "Descriptive error message",
    "code": "ERROR_CODE"
  }
}
```

## Authentication

All protected endpoints require a valid JWT token in the Authorization header:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

The token will be issued upon successful login or registration and should be included in all subsequent requests to protected endpoints.
