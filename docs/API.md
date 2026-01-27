# API Documentation

## Overview

JobsFinder API provides endpoints for job posting, applications, analytics, and billing management.

## Base URL

- **Development**: `http://localhost:3000`
- **Production**: `https://your-domain.com`

## Authentication

Most endpoints require authentication via NextAuth.js session cookies. Admin endpoints require admin privileges.

## Endpoints

### Job Viewing

#### `GET /job/[jobId]`

Get a single job post.

**Parameters:**
- `jobId` (path) - UUID of the job post

**Response:**
```json
{
  "job": {
    "id": "uuid",
    "jobTitle": "Software Engineer",
    "company": { ... },
    "location": "San Francisco, CA",
    ...
  }
}
```

#### `POST /api/jobs/[jobId]/view`

Track a job view (analytics).

**Parameters:**
- `jobId` (path) - UUID of the job post

**Response:**
```json
{
  "success": true
}
```

### Job Applications

#### `POST /api/apply`

Submit a job application.

**Request Body:**
```json
{
  "jobId": "uuid",
  "name": "John Doe",
  "email": "john@example.com",
  "resume": "https://utfs.io/...",
  "coverLetter": "Optional cover letter"
}
```

**Response:**
```json
{
  "success": true,
  "applicationId": "uuid"
}
```

### Billing

#### `POST /api/billing/portal`

Create a Stripe billing portal session.

**Authentication:** Required

**Response:**
```json
{
  "url": "https://billing.stripe.com/..."
}
```

### Stripe Integration

#### `POST /api/stripe/activate`

Activate a job after successful payment.

**Query Parameters:**
- `session_id` - Stripe checkout session ID

**Response:**
```json
{
  "ok": true,
  "updatedCount": 1,
  "jobId": "uuid"
}
```

#### `POST /api/webhook/stripe`

Stripe webhook handler (called by Stripe).

**Headers:**
- `stripe-signature` - Stripe webhook signature

**Body:** Raw Stripe event payload

**Response:**
- `200` - Success
- `400` - Invalid signature or missing data

### Admin Endpoints

All admin endpoints require admin privileges (email in `ADMIN_EMAILS`).

#### `POST /api/admin/jobs/[jobId]/approve`

Approve a job post.

**Response:**
```json
{
  "success": true
}
```

#### `POST /api/admin/jobs/[jobId]/reject`

Reject a job post.

**Response:**
```json
{
  "success": true
}
```

## Error Responses

All endpoints return standard HTTP status codes:

- `200` - Success
- `400` - Bad Request (validation error)
- `401` - Unauthorized
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `429` - Too Many Requests (rate limited)
- `500` - Internal Server Error

Error response format:
```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "fields": {
      "fieldName": "Field-specific error"
    }
  }
}
```

## Rate Limiting

API endpoints are protected by Arcjet rate limiting. Limits vary by endpoint:
- Public endpoints: 100 requests/minute
- Authenticated endpoints: 1000 requests/minute
- Admin endpoints: 5000 requests/minute

## Webhooks

### Stripe Webhook Events

- `checkout.session.completed` - Job post activated after payment

### Inngest Events

- `job/created` - Job expiration scheduled
- `jobseeker/created` - Welcome email sent

## Examples

### Track Job View

```bash
curl -X POST http://localhost:3000/api/jobs/job-id/view
```

### Create Billing Portal Session

```bash
curl -X POST http://localhost:3000/api/billing/portal \
  -H "Cookie: next-auth.session-token=..."
```

---

For more details, see the source code in `app/api/`.
