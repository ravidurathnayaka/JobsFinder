# Production Deployment Checklist

Use this checklist before deploying to production.

## Pre-Deployment

### Environment Setup
- [ ] All environment variables set in production environment
- [ ] `AUTH_SECRET` is at least 32 characters and secure
- [ ] `DATABASE_URL` points to production database
- [ ] Stripe production keys configured
- [ ] Resend production API key configured
- [ ] `NEXT_PUBLIC_URL` set to production domain
- [ ] `ADMIN_EMAILS` configured with admin email addresses

### Database
- [ ] Database migrations run: `pnpm prisma migrate deploy`
- [ ] Database indexes created (verify with `pnpm prisma studio`)
- [ ] Database backups configured
- [ ] Connection pooling limits set (if applicable)

### Code Quality
- [ ] All tests pass: `pnpm test`
- [ ] Type checking passes: `pnpm type-check`
- [ ] Linting passes: `pnpm lint`
- [ ] Build succeeds: `pnpm build`
- [ ] No console.log statements in code
- [ ] All environment variables use validated `env` utility

### Security
- [ ] Security headers verified (check with securityheaders.com)
- [ ] HTTPS enforced
- [ ] Admin routes protected
- [ ] Rate limiting configured
- [ ] Input validation on all endpoints
- [ ] No sensitive data in error messages

## Deployment

### Build & Deploy
- [ ] Build completed successfully
- [ ] Docker image built (if using Docker)
- [ ] Application deployed to hosting platform
- [ ] Environment variables configured in hosting platform
- [ ] Database connection verified

### Post-Deployment Verification
- [ ] Application loads at production URL
- [ ] Homepage displays correctly
- [ ] User can sign in
- [ ] Company can post job
- [ ] Payment flow works
- [ ] Job application works
- [ ] Admin panel accessible
- [ ] Email notifications sent
- [ ] Sitemap accessible: `/sitemap.xml`
- [ ] Robots.txt accessible: `/robots.txt`

### Functionality Tests
- [ ] Job posting flow works end-to-end
- [ ] Payment activates job correctly
- [ ] Job applications are received
- [ ] Admin moderation works
- [ ] User profile updates work
- [ ] Analytics tracking works
- [ ] Billing portal accessible

### Performance
- [ ] Page load times < 2s
- [ ] API response times < 200ms
- [ ] Database queries optimized
- [ ] Images loading correctly
- [ ] No memory leaks

## Monitoring Setup

### Error Tracking
- [ ] Error tracking service configured (Sentry recommended)
- [ ] Error alerts configured
- [ ] Error notifications set up

### Logging
- [ ] Log aggregation service configured
- [ ] Log retention policy set
- [ ] Log search/indexing working

### Uptime Monitoring
- [ ] Uptime monitoring service configured
- [ ] Alerts for downtime configured
- [ ] Health check endpoint verified (if implemented)

### Performance Monitoring
- [ ] Performance monitoring configured
- [ ] Slow query alerts set up
- [ ] Response time tracking enabled

## Documentation

### Internal
- [ ] README updated with production URLs
- [ ] API documentation updated
- [ ] Deployment process documented
- [ ] Troubleshooting guide available

### External
- [ ] User documentation (if applicable)
- [ ] API documentation for developers
- [ ] Support contact information

## Security Audit

- [ ] Security headers verified
- [ ] HTTPS certificate valid
- [ ] No exposed secrets in code
- [ ] Database credentials secure
- [ ] API keys rotated (if needed)
- [ ] Access logs reviewed

## Backup & Recovery

- [ ] Database backups automated
- [ ] Backup retention policy set
- [ ] Recovery procedure tested
- [ ] Rollback plan documented

## Final Checks

- [ ] All critical user flows tested
- [ ] No console errors in browser
- [ ] No server errors in logs
- [ ] Performance metrics acceptable
- [ ] Security scan passed (optional)
- [ ] Load testing completed (optional)

## Sign-Off

- [ ] Development team approval
- [ ] QA approval
- [ ] Security team approval (if applicable)
- [ ] Product owner approval

---

**Checklist Completed By**: _______________
**Date**: _______________
**Production URL**: _______________

---

**Note**: This checklist should be reviewed and updated for each deployment.
