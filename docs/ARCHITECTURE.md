# Architecture Documentation

## System Overview

JobsFinder is a full-stack job board application built with Next.js 16 using the App Router architecture. The application follows modern best practices for scalability, security, and maintainability.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────┐
│                     Client Browser                      │
└────────────────────┬──────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────┐
│              Next.js Application (Edge/Node)            │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │   Pages      │  │  API Routes  │  │  Middleware  │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
└────────────────────┬──────────────────────────────────┘
                      │
        ┌─────────────┼─────────────┐
        ▼             ▼             ▼
┌─────────────┐ ┌──────────┐ ┌──────────┐
│  PostgreSQL  │ │  Stripe  │ │  Resend │
│   Database   │ │  Payment │ │  Email   │
└─────────────┘ └──────────┘ └──────────┘
        │
        ▼
┌─────────────┐
│   Inngest   │
│ Background  │
│    Jobs     │
└─────────────┘
```

## Technology Stack

### Frontend
- **Next.js 16**: React framework with App Router
- **React 19**: UI library
- **TypeScript**: Type safety
- **Tailwind CSS**: Styling
- **Radix UI / Shadcn**: Component library
- **React Hook Form**: Form management
- **Zod**: Schema validation

### Backend
- **Next.js API Routes**: Server-side API endpoints
- **Server Actions**: Form submissions and mutations
- **Prisma**: ORM for database access
- **PostgreSQL**: Primary database

### External Services
- **Stripe**: Payment processing
- **Resend**: Email delivery
- **Inngest**: Background job processing
- **UploadThing**: File uploads
- **Arcjet**: Security and rate limiting
- **NextAuth.js**: Authentication

## Application Structure

### Directory Layout

```
app/
├── (mainlayout)/          # Main application routes
│   ├── page.tsx           # Homepage
│   ├── job/[jobId]/       # Job detail pages
│   ├── company/[id]/      # Company profiles
│   ├── my-jobs/           # Job management
│   └── favorites/         # Saved jobs
├── admin/                 # Admin routes
│   └── jobs/              # Job moderation
├── account/               # User account pages
│   ├── company/           # Company profile
│   ├── jobseeker/         # Job seeker profile
│   └── billing/           # Billing portal
├── api/                   # API routes
│   ├── auth/              # NextAuth handlers
│   ├── webhook/           # Webhook handlers
│   ├── jobs/              # Job-related APIs
│   └── billing/           # Billing APIs
└── utils/                 # Server utilities
    ├── db.ts              # Database client
    ├── auth.ts            # Auth configuration
    ├── email.ts           # Email sending
    └── inngest/           # Background jobs

components/
├── forms/                 # Form components
├── general/               # Reusable components
├── ui/                    # UI primitives
└── admin/                 # Admin components

lib/
├── env.ts                 # Environment validation
├── logger.ts              # Structured logging
└── errors.ts              # Error handling
```

## Data Flow

### Job Posting Flow

1. User creates job post → Server Action (`createJob`)
2. Job saved as `DRAFT` → Database
3. Stripe Checkout Session created
4. User completes payment → Stripe Webhook
5. Job status updated to `ACTIVE` → Database
6. Email notification sent → Resend
7. Expiration scheduled → Inngest

### Job Application Flow

1. User views job → View tracked → Analytics
2. User applies → Server Action (`applyToJob`)
3. Application saved → Database
4. Email notification → Employer (via Inngest)

### Authentication Flow

1. User clicks "Sign In" → NextAuth.js
2. OAuth provider (GitHub/Google) → Callback
3. User created/updated → Database
4. Session created → Cookie-based
5. Protected routes check session → Middleware

## Database Schema

### Key Relationships

```
User (1) ──< (1) Company
User (1) ──< (1) JobSeeker
Company (1) ──< (N) JobPost
JobPost (1) ──< (N) Application
JobPost (1) ──< (N) JobView
User (1) ──< (N) SavedJobPost
```

### Indexes

Critical indexes for performance:
- `JobPost.status` - Filter active jobs
- `JobPost.companyId` - User's job listings
- `Application.jobId` - Job applications
- `JobView.jobId` - Analytics queries
- `SavedJobPost.userId` - User favorites

## Security Architecture

### Layers

1. **Middleware**: Security headers, request logging
2. **Arcjet**: Rate limiting, bot detection
3. **Server Actions**: Input validation (Zod)
4. **API Routes**: Authentication checks
5. **Database**: Parameterized queries (Prisma)

### Authentication

- **Session-based**: NextAuth.js with database sessions
- **OAuth Providers**: GitHub, Google
- **Admin Access**: Email-based whitelist

### Authorization

- **Role-based**: User type (COMPANY, JOB_SEEKER)
- **Resource-based**: Users can only access their own resources
- **Admin**: Separate admin routes with email check

## Error Handling

### Error Hierarchy

```
AppError (base)
├── ValidationError (400)
├── AuthenticationError (401)
├── AuthorizationError (403)
├── NotFoundError (404)
├── ConflictError (409)
├── RateLimitError (429)
└── ExternalServiceError (502)
```

### Error Flow

1. Error thrown → Custom error class
2. Caught by error handler → `handleApiError`
3. Logged → Structured logger
4. User-friendly message → Client
5. Error tracking → (Future: Sentry integration)

## Background Jobs (Inngest)

### Job Expiration

- **Trigger**: `job/created` event
- **Process**: Sleep for listing duration
- **Action**: Update status to `EXPIRED`, send email

### Email Notifications

- **Welcome Email**: On job seeker creation
- **Job Listings**: Periodic emails to job seekers
- **Expiration Warnings**: Before job expires

## Performance Optimizations

### Database

- Indexes on frequently queried fields
- Pagination limits on all list queries
- Select only needed fields
- Connection pooling (Prisma)

### Frontend

- Server Components by default
- Client Components only when needed
- Image optimization (Next.js Image)
- Code splitting (automatic)

### Caching

- Next.js automatic caching
- Static page generation where possible
- API route caching (future)

## Deployment Architecture

### Production Setup

```
┌─────────────┐
│   Vercel    │  (or your hosting)
│   Edge      │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  Next.js    │
│  App        │
└──────┬──────┘
       │
   ┌───┴───┐
   ▼       ▼
┌─────┐ ┌──────┐
│ DB  │ │ APIs │
└─────┘ └──────┘
```

### Environment Separation

- **Development**: Local PostgreSQL, test Stripe keys
- **Staging**: Separate database, test mode Stripe
- **Production**: Production database, live Stripe

## Monitoring & Observability

### Logging

- Structured JSON logs in production
- Human-readable logs in development
- Log levels: debug, info, warn, error

### Metrics (Future)

- Application performance monitoring
- Error tracking (Sentry)
- Database query monitoring
- User analytics

## Scalability Considerations

### Horizontal Scaling

- Stateless application (session in database)
- Database connection pooling
- CDN for static assets

### Database Scaling

- Read replicas for analytics queries
- Connection pooling limits
- Query optimization

### Background Jobs

- Inngest handles job queue
- Retry logic built-in
- Event-driven architecture

## Security Best Practices

1. **Input Validation**: All inputs validated with Zod
2. **SQL Injection**: Prisma ORM prevents SQL injection
3. **XSS Protection**: React escaping + CSP headers
4. **CSRF Protection**: NextAuth.js built-in
5. **Rate Limiting**: Arcjet integration
6. **Secrets Management**: Environment variables only
7. **Error Messages**: No sensitive data in errors

## Future Enhancements

- [ ] Real-time notifications (WebSockets)
- [ ] Advanced search (Elasticsearch)
- [ ] Recommendation engine
- [ ] Mobile app (React Native)
- [ ] Multi-language support
- [ ] Advanced analytics dashboard

---

**Last Updated**: 2026-01-24
