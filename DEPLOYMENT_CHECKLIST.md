# Production Deployment Checklist

## Critical Security Requirements

### 1. Environment Variables Setup
- [ ] Copy `.env.example` to `.env.production.local`
- [ ] Update all variables with production values:
  - `NEXT_PUBLIC_STRAPI_URL` - Must be HTTPS URL to Strapi Cloud
  - `STRAPI_API_TOKEN` - Use a production API token from Strapi
  - `RESEND_API_KEY` - Use production Resend API key
  - `RESEND_FROM_EMAIL` - Use your domain email (e.g., noreply@yourdomain.com)
  - `NEXT_PUBLIC_APP_URL` - Your production domain (e.g., https://yourdomain.com)

### 2. Sensitive Data Management
- [ ] Remove all hardcoded API keys from repository
- [ ] Add `.env.local` and `.env.*.local` to `.gitignore` (already configured)
- [ ] Never commit actual API keys or tokens
- [ ] Use Vercel's Environment Variables dashboard for production secrets
- [ ] Strapi Cloud: Manage tokens in Settings > API Tokens

### 3. API Security
- [ ] Enable HTTPS for all external APIs
- [ ] Configure Strapi Cloud to accept requests only from your Vercel domain
- [ ] Set up CORS properly in Strapi:
  ```
  middleware: {
    cors: {
      origin: ['https://yourdomain.com'],
      credentials: true,
    }
  }
  ```
- [ ] Use read-only API tokens where possible
- [ ] Rotate API tokens periodically

### 4. Build & Deployment
- [ ] Test build locally: `npm run build`
- [ ] Verify no TypeScript errors exist
- [ ] Test all critical user flows in production build
- [ ] Ensure all environment variables are set on Vercel
- [ ] Deploy to Vercel staging first, then production

### 5. Frontend Security
- [ ] Enable NextAuth or similar for session management
- [ ] Implement rate limiting on forms (registration, login, contact)
- [ ] Add CAPTCHA to public forms (optional but recommended)
- [ ] Verify security headers are present (X-Frame-Options, X-Content-Type-Options, etc.)

### 6. Payment Processing
- [ ] **DO NOT deploy with incomplete payment integration**
- [ ] Stripe keys must be properly configured before enabling payments
- [ ] Use Stripe webhook signing for production
- [ ] Implement PCI compliance measures if handling card data

### 7. Email Configuration
- [ ] Test email delivery from Resend
- [ ] Verify sender domain is authenticated
- [ ] Set up email templates properly with dynamic content
- [ ] Configure reply-to address

### 8. Monitoring & Logging
- [ ] Set up error tracking (Sentry, LogRocket, etc.)
- [ ] Configure logs in Vercel dashboard
- [ ] Monitor Strapi API performance
- [ ] Set up alerts for critical errors

### 9. Database & Data
- [ ] Ensure Strapi PostgreSQL database is backed up
- [ ] Enable automatic backups on Strapi Cloud
- [ ] Test restore procedure

### 10. Performance
- [ ] Image optimization working properly
- [ ] Verify cache headers are set correctly
- [ ] Test Core Web Vitals (use Vercel Analytics)
- [ ] Implement CDN for static assets if needed

## Pre-Deployment Verification

```bash
# 1. Ensure no console.log/debug statements in production code
npm run lint

# 2. Build and verify no errors
npm run build

# 3. Check for exposed secrets
npx detect-secrets scan --baseline .secrets.baseline

# 4. Verify environment variables
echo "NEXT_PUBLIC_STRAPI_URL=$NEXT_PUBLIC_STRAPI_URL"
# Should output your production Strapi URL, not localhost
```

## Vercel Deployment Steps

1. Connect repository to Vercel
2. Configure environment variables in Project Settings > Environment Variables
3. Set different values for Preview vs Production
4. Deploy and monitor logs
5. Test critical paths on production

## Post-Deployment

- [ ] Verify all API endpoints respond correctly
- [ ] Test user registration and authentication
- [ ] Test order creation and email notifications
- [ ] Monitor error logs for issues
- [ ] Check Strapi Cloud logs for API errors
- [ ] Test on multiple devices and browsers

## Rollback Plan

If issues occur in production:
1. Revert to last stable version on Vercel
2. Check Strapi API logs
3. Verify environment variables are correct
4. Review recent code changes
5. Test locally with production environment variables (safe copies)

## Security Maintenance

- Review and update dependencies monthly: `npm audit`
- Rotate API tokens every 90 days
- Monitor for security advisories
- Implement security headers review quarterly
- Test authentication flows for vulnerabilities
