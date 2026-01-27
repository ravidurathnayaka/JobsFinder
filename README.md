# JobsFinder

A modern, production-ready job board application built with Next.js 16, React 19, TypeScript, Prisma, and Stripe.

## 🚀 Features

- **Job Posting & Management**: Companies can post, edit, and manage job listings
- **Job Search & Filtering**: Advanced filtering by job type, location, and salary
- **Application System**: Job seekers can apply to positions with resume and cover letter
- **Payment Integration**: Stripe-powered payment processing for job listings
- **Admin Moderation**: Admin approval workflow for job posts
- **Email Notifications**: Automated emails for job activation, approvals, and applications
- **Analytics Dashboard**: Track views, applications, and conversion rates
- **Company Profiles**: Public company profile pages with active job listings
- **User Profiles**: Separate profiles for companies and job seekers
- **SEO Optimized**: XML sitemap, robots.txt, and structured data (JSON-LD)
- **Billing Portal**: Stripe customer portal for managing payments and invoices

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router, Turbopack)
- **Language**: TypeScript
- **UI**: React 19, Tailwind CSS, Radix UI, Shadcn/UI
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js (GitHub, Google OAuth)
- **Payments**: Stripe
- **Email**: Resend
- **Background Jobs**: Inngest
- **File Upload**: UploadThing
- **Security**: Arcjet
- **Testing**: Jest, React Testing Library, Playwright

## 📋 Prerequisites

- Node.js 20+ 
- pnpm 8+ (or npm/yarn)
- PostgreSQL 16+
- Stripe account
- Resend account
- UploadThing account
- Arcjet account

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone <repository-url>
cd jobsfinder
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Set Up Environment Variables

Copy `.env.example` to `.env` and fill in all required variables:

```bash
cp .env.example .env
```

Required environment variables:

```env
# Application
NEXT_PUBLIC_URL=http://localhost:3000
NODE_ENV=development

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/jobsfinder

# Authentication
AUTH_SECRET=your-auth-secret-min-32-chars
AUTH_GITHUB_ID=your-github-client-id
AUTH_GITHUB_SECRET=your-github-client-secret
AUTH_GOOGLE_ID=your-google-client-id
AUTH_GOOGLE_SECRET=your-google-client-secret

# File Upload
UPLOADTHING_TOKEN=your-uploadthing-token
UPLOADTHING_SECRET=your-uploadthing-secret

# Security
ARCJET_KEY=your-arcjet-key

# Payments
SECRET_STRIPE_KEY=your-stripe-secret-key
STRIPE_WEBHOOK_SECRET=your-stripe-webhook-secret

# Email
RESEND_API_KEY=your-resend-api-key
RESEND_FROM_EMAIL=JobsFinder <onboarding@resend.dev>

# Admin
ADMIN_EMAILS=admin@example.com,another@example.com
```

**Important**: Generate `AUTH_SECRET` using:
```bash
openssl rand -base64 32
```

### 4. Set Up Database

```bash
# Generate Prisma Client
pnpm prisma generate

# Run migrations (or push schema)
pnpm prisma migrate dev
# OR
pnpm prisma db push
```

### 5. Run Development Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🧪 Testing

### Unit Tests

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run tests with coverage
pnpm test:coverage
```

### E2E Tests

```bash
# Run E2E tests
pnpm test:e2e

# Run E2E tests with UI
pnpm test:e2e:ui
```

### Type Checking

```bash
pnpm type-check
```

## 🐳 Docker

### Development with Docker Compose

```bash
docker-compose up
```

This will start:
- PostgreSQL database on port 5432
- Next.js application on port 3000

### Production Build

```bash
# Build Docker image
docker build -t jobsfinder .

# Run container
docker run -p 3000:3000 --env-file .env jobsfinder
```

## 📦 Building for Production

```bash
# Build the application
pnpm build

# Start production server
pnpm start
```

## 🏗️ Project Structure

```
jobsfinder/
├── app/                    # Next.js App Router
│   ├── (mainlayout)/       # Main layout routes
│   ├── admin/              # Admin routes
│   ├── account/            # User account routes
│   ├── api/                # API routes
│   └── utils/              # Server utilities
├── components/              # React components
│   ├── forms/              # Form components
│   ├── general/            # General components
│   ├── ui/                 # UI primitives (Shadcn)
│   └── admin/              # Admin components
├── lib/                    # Shared libraries
│   ├── env.ts              # Environment validation
│   ├── logger.ts           # Structured logging
│   └── errors.ts           # Error handling
├── prisma/                 # Prisma schema and migrations
├── e2e/                    # E2E tests (Playwright)
├── __tests__/              # Unit tests (Jest)
└── public/                 # Static assets
```

## 🔐 Security Features

- **Environment Variable Validation**: All env vars validated at startup
- **Structured Logging**: JSON logs in production, no sensitive data leakage
- **Security Headers**: CSP, HSTS, X-Frame-Options, etc.
- **Rate Limiting**: Arcjet integration for DDoS protection
- **Input Validation**: Zod schemas for all user inputs
- **SQL Injection Protection**: Prisma ORM with parameterized queries
- **XSS Protection**: React's built-in escaping + CSP headers

## 📊 Database Schema

Key models:
- `User` - Authentication and user data
- `Company` - Company profiles
- `JobSeeker` - Job seeker profiles
- `JobPost` - Job listings
- `Application` - Job applications
- `SavedJobPost` - Saved jobs (favorites)
- `JobView` - Analytics tracking

See `prisma/schema.prisma` for full schema.

## 🔄 Background Jobs (Inngest)

The application uses Inngest for background job processing:

- **Job Expiration**: Automatically expires jobs after listing duration
- **Email Notifications**: Sends welcome emails, job listings, expiration notices
- **Scheduled Tasks**: Periodic job listing emails to job seekers

## 📝 API Documentation

### Public Endpoints

- `GET /` - Homepage with job listings
- `GET /job/[jobId]` - View job post
- `GET /company/[companyId]` - View company profile
- `GET /sitemap.xml` - XML sitemap
- `GET /robots.txt` - Robots.txt

### Protected Endpoints

- `POST /api/jobs/[jobId]/view` - Track job view
- `POST /api/billing/portal` - Create Stripe billing portal session
- `POST /api/stripe/activate` - Activate job after payment

### Webhooks

- `POST /api/webhook/stripe` - Stripe webhook handler
- `POST /api/inngest` - Inngest webhook handler

## 🚢 Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Docker

1. Build Docker image
2. Push to container registry
3. Deploy to your hosting platform (AWS, GCP, Azure, etc.)

### Environment Variables for Production

Ensure all environment variables from `.env.example` are set in your production environment.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is private and proprietary.

## 🆘 Troubleshooting

### Database Connection Issues

- Verify `DATABASE_URL` is correct
- Ensure PostgreSQL is running
- Check database credentials

### Environment Variable Errors

- All required env vars must be set
- Check `.env` file exists
- Verify `AUTH_SECRET` is at least 32 characters

### Build Errors

- Run `pnpm prisma generate` before building
- Clear `.next` folder: `rm -rf .next`
- Reinstall dependencies: `rm -rf node_modules && pnpm install`

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Stripe Documentation](https://stripe.com/docs)
- [NextAuth.js Documentation](https://next-auth.js.org)

## 🎯 Production Readiness Checklist

- ✅ Environment variable validation
- ✅ Structured logging
- ✅ Error handling
- ✅ Security headers
- ✅ Database indexes
- ✅ Docker configuration
- ✅ CI/CD pipeline
- ✅ Error boundaries
- ✅ Pagination limits
- ⏳ Test coverage (infrastructure ready)
- ⏳ API documentation (in progress)
- ⏳ Performance monitoring

---

**Built with ❤️ using Next.js and modern web technologies**
