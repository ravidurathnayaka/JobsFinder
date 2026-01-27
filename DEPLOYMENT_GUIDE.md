# Deployment Guide

## Pre-Deployment Checklist

### 1. Environment Setup

```bash
# 1. Set all environment variables in your hosting platform
# See .env.example for all required variables

# 2. Generate AUTH_SECRET
openssl rand -base64 32

# 3. Verify DATABASE_URL is correct
# Format: postgresql://user:password@host:port/database
```

### 2. Database Setup

```bash
# Run migrations
pnpm prisma migrate deploy

# OR push schema (development)
pnpm prisma db push

# Verify indexes
pnpm prisma studio  # Check indexes in Prisma Studio
```

### 3. Build Verification

```bash
# Install dependencies
pnpm install

# Generate Prisma Client
pnpm prisma generate

# Build application
pnpm build

# Verify build succeeded
# Check .next folder exists
```

### 4. Test Verification

```bash
# Run all tests
pnpm test

# Run E2E tests
pnpm test:e2e

# Type check
pnpm type-check

# Lint
pnpm lint
```

## Deployment Options

### Option 1: Vercel (Recommended)

1. **Connect Repository**
   - Go to Vercel dashboard
   - Import your GitHub repository
   - Select the project

2. **Configure Environment Variables**
   - Add all variables from `.env.example`
   - Set `NODE_ENV=production`
   - Set production URLs

3. **Configure Build Settings**
   - Framework Preset: Next.js
   - Build Command: `pnpm build`
   - Output Directory: `.next`

4. **Deploy**
   - Click "Deploy"
   - Wait for build to complete
   - Verify deployment

5. **Post-Deployment**
   - Test all critical flows
   - Verify environment variables
   - Check logs for errors
   - Test Stripe webhook endpoint

### Option 2: Docker

1. **Build Image**
   ```bash
   docker build -t jobsfinder:latest .
   ```

2. **Run Container**
   ```bash
   docker run -d \
     --name jobsfinder \
     -p 3000:3000 \
     --env-file .env.production \
     jobsfinder:latest
   ```

3. **With Docker Compose**
   ```bash
   # Update docker-compose.yml with production env vars
   docker-compose -f docker-compose.prod.yml up -d
   ```

### Option 3: Self-Hosted (VPS/Cloud)

1. **Server Setup**
   ```bash
   # Install Node.js 20+
   # Install pnpm
   # Install PostgreSQL
   ```

2. **Clone and Build**
   ```bash
   git clone <repo>
   cd jobsfinder
   pnpm install
   pnpm prisma generate
   pnpm build
   ```

3. **Run with PM2**
   ```bash
   pm2 start pnpm --name "jobsfinder" -- start
   pm2 save
   pm2 startup
   ```

4. **Setup Nginx Reverse Proxy**
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;

       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

## Post-Deployment Verification

### 1. Health Checks

```bash
# Check application is running
curl https://your-domain.com

# Check API health
curl https://your-domain.com/api/health  # (if implemented)

# Check sitemap
curl https://your-domain.com/sitemap.xml
```

### 2. Functionality Tests

- [ ] Homepage loads
- [ ] Job listings display
- [ ] User can sign in
- [ ] Company can post job
- [ ] Payment flow works
- [ ] Job application works
- [ ] Admin panel accessible
- [ ] Email notifications sent

### 3. Security Verification

- [ ] Security headers present (check with securityheaders.com)
- [ ] HTTPS enforced
- [ ] Environment variables not exposed
- [ ] Admin routes protected
- [ ] Rate limiting working

### 4. Performance Checks

- [ ] Page load times < 2s
- [ ] API response times < 200ms
- [ ] Database queries optimized
- [ ] Images loading correctly

## Monitoring Setup

### Recommended Tools

1. **Error Tracking**: Sentry
   ```bash
   pnpm add @sentry/nextjs
   ```

2. **Log Aggregation**: Logtail, Datadog, or similar

3. **Uptime Monitoring**: UptimeRobot, Pingdom

4. **Performance**: Vercel Analytics, or custom solution

## Rollback Plan

If deployment fails:

1. **Vercel**: Use "Redeploy" to previous version
2. **Docker**: Tag previous image and redeploy
3. **Self-Hosted**: Git checkout previous commit, rebuild

## Troubleshooting

### Build Fails

```bash
# Clear cache
rm -rf .next node_modules
pnpm install
pnpm build
```

### Database Connection Issues

- Verify DATABASE_URL is correct
- Check database is accessible
- Verify firewall rules
- Check connection limits

### Environment Variable Errors

- Verify all required vars are set
- Check for typos
- Ensure AUTH_SECRET is 32+ chars
- Verify URLs are correct

## Production Best Practices

1. **Always use HTTPS** in production
2. **Set up database backups** (daily recommended)
3. **Monitor error logs** daily
4. **Set up alerts** for critical errors
5. **Regular security updates** for dependencies
6. **Performance monitoring** and optimization
7. **Regular testing** of critical flows

---

**Last Updated**: 2026-01-24
