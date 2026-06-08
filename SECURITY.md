# Security Best Practices Guide

## API Key Management

### DO ✅
- Store all secrets in environment variables
- Use `.env.example` to document required variables
- Rotate tokens periodically (every 90 days)
- Use different tokens for different environments (dev, staging, prod)
- Set read-only permissions on API tokens when possible

### DON'T ❌
- Hardcode API keys in source code
- Commit `.env.local` or `.env.*.local` files
- Share API keys via email or chat
- Use the same token across all environments
- Log or expose API responses with sensitive data in production

## Error Handling

### Production-Safe Logging
Use the `logger` utility from `lib/logger.ts`:

```typescript
import { logger } from '@/lib/logger';

// Good - logs only in development
logger.debug('Debug info', data);

// Always logs, but sanitizes production
logger.error('An error occurred', error);

// Never do this
console.log(apiResponse); // ❌ Can expose sensitive data
```

## Request Timeout

All network requests should have timeouts:

```typescript
import { fetchWithTimeout } from '@/lib/fetch-timeout';

const response = await fetchWithTimeout(url, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(data),
  timeout: 10000, // 10 seconds
});
```

## Authentication & Authorization

### JWT Tokens
- Store JWT in HTTP-only cookies (already implemented)
- Set `secure: true` in production (auto-configured)
- Always verify token on server-side actions
- Implement token refresh mechanism

### Protected Routes
- Verify user authentication on protected pages
- Check user permissions before sensitive operations
- Redirect to login if session expires

## Data Validation

### Input Validation
Always validate user input using Zod schemas:

```typescript
import { z } from 'zod';

const registerSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'Password too short'),
  phone: z.string().regex(/^\+?[0-9]{10,}$/, 'Invalid phone'),
});

const validated = registerSchema.parse(formData);
```

### Output Sanitization
- Never return full error details in production responses
- Sanitize user-generated content before displaying
- Validate API responses from Strapi before using

## Network Security

### HTTPS/TLS
- All API calls must use HTTPS in production
- Update `NEXT_PUBLIC_STRAPI_URL` to use `https://`
- Verify SSL certificates are valid

### CORS Configuration
- Configure CORS in Strapi to only allow your domain
- Set specific allowed origins, not wildcards
- Implement CSRF protection for form submissions

## Rate Limiting

### Frontend Rate Limiting
Implement client-side debouncing/throttling:

```typescript
import { debounce } from 'lodash';

const handleSearch = debounce(async (query: string) => {
  const results = await fetch(`/api/search?q=${query}`);
  // ...
}, 500);
```

### Backend Rate Limiting (Future)
Consider implementing:
- IP-based rate limiting via middleware
- User-based rate limiting for authenticated endpoints
- Exponential backoff for retry logic

## File Uploads

**Not Yet Implemented** - When adding file uploads:
- Validate file type and size
- Store files on Strapi Cloud, not in git
- Implement virus scanning if needed
- Generate unique filenames to prevent overwrites
- Validate MIME types

## Database Security

### Strapi Cloud
- Use strong database passwords
- Enable automatic backups
- Restrict database access to Strapi only
- Monitor database performance and size

### API Tokens
- Use separate tokens for different environments
- Implement token rotation policy
- Monitor token usage and access logs

## Dependency Security

### Regular Audits
```bash
# Check for vulnerabilities
npm audit

# Update dependencies safely
npm update

# Audit lock file
npm audit fix
```

### Trusted Sources
- Only install packages from npm registry
- Review package before installing (check GitHub)
- Pin exact versions for security-critical packages
- Avoid downloading from unknown sources

## Monitoring & Alerts

### Set Up Alerts For:
- Authentication failures
- API errors (especially 4xx/5xx)
- Unusual traffic patterns
- Database connection issues
- Payment failures

### Tools to Consider:
- Sentry for error tracking
- LogRocket for session replay
- Vercel Analytics for performance
- Strapi Cloud dashboard for API metrics

## Incident Response

### If API Keys Are Compromised:
1. Rotate the key immediately
2. Review access logs
3. Check for unauthorized changes
4. Update all references in code
5. Deploy updated code

### If Database Is Breached:
1. Verify scope of breach
2. Notify affected users
3. Force password resets
4. Review database logs
5. Implement additional monitoring

## Compliance & Privacy

### Before Going to Production:
- [ ] Review Privacy Policy
- [ ] Implement Cookie Consent
- [ ] Set up GDPR data export (if EU customers)
- [ ] Implement data retention policies
- [ ] Review Terms of Service

## References

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Next.js Security Best Practices](https://nextjs.org/docs/app/building-your-application/deploying/production-checklist)
- [Strapi Security Documentation](https://docs.strapi.io/user-docs/latest/settings/managing-global-settings.html#security)
- [Node.js Security Best Practices](https://nodejs.org/en/docs/guides/nodejs-security/)
