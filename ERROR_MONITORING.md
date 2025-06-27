# Error Monitoring Integration Guide

This template includes comprehensive error handling infrastructure. Here's how to integrate with popular monitoring services:

## 🔧 Setup Instructions

### 1. Sentry Integration (Recommended)

```bash
npm install @sentry/nextjs
```

Create `sentry.client.config.ts`:

```typescript
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0,
  debug: false,
});
```

Create `sentry.server.config.ts`:

```typescript
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0,
  debug: false,
});
```

Update your `.env.local`:

```bash
NEXT_PUBLIC_SENTRY_DSN=your-sentry-dsn-here
```

### 2. LogRocket Integration

```bash
npm install logrocket
```

Update `src/components/providers/providers.tsx`:

```typescript
import LogRocket from "logrocket";

if (typeof window !== "undefined" && process.env.NODE_ENV === "production") {
  LogRocket.init("your-app-id");
}
```

### 3. Custom Error Logging Endpoint

Create `src/app/api/logs/client-error/route.ts`:

```typescript
import { NextRequest } from "next/server";
import { withErrorHandler } from "@/lib/errors/api-errors";

async function logClientError(request: NextRequest) {
  const errorData = await request.json();

  // Log to your preferred service (database, file, external service)
  console.error("Client Error:", errorData);

  // Example: Save to database
  // await db.errorLogs.create({ data: errorData });

  return new Response("OK", { status: 200 });
}

export const POST = withErrorHandler(logClientError);
```

## 🎯 Integration Points

### Error Boundary

- Automatically catches React component errors
- Located in: `src/components/error/error-boundary.tsx`
- Integrated in layout: `src/app/layout.tsx`

### API Error Handler

- Catches and formats API route errors
- Located in: `src/lib/errors/api-errors.ts`
- Usage: Wrap API handlers with `withErrorHandler`

### Client Error Utilities

- Safe fetch wrapper with error handling
- Error toast notifications
- Located in: `src/lib/errors/client-errors.ts`

### Global Error Pages

- 404: `src/app/not-found.tsx`
- 500: `src/app/error.tsx`

## 📊 Monitoring Best Practices

1. **Environment Variables**: Add monitoring service keys to `.env.local`
2. **Error Context**: Include user ID, page URL, and relevant context
3. **Privacy**: Avoid logging sensitive information
4. **Rate Limiting**: Prevent error spam in monitoring services
5. **Alerting**: Set up alerts for critical errors

## 🔍 Error Types Handled

- **API Errors**: Authentication, validation, server errors
- **Network Errors**: Connection issues, timeouts
- **React Errors**: Component crashes, rendering errors
- **Navigation Errors**: 404, route not found
- **Form Errors**: Validation, submission errors

## 📋 Testing Error Handling

Test the error handling by visiting these URLs:

- `/api/example/user?id=404` - Triggers 404 error
- `/api/example/user?id=403` - Triggers forbidden error
- `/api/example/user?id=500` - Triggers server error
- `/nonexistent-page` - Triggers 404 page

Use the error testing component in development to simulate different error scenarios.

### Automated Error Testing

The template includes comprehensive error handling tests:

```bash
# Run error handling tests
npm test -- --testPathPatterns="error"

# All error scenarios are covered in the test suite
```

Error boundaries, API error handlers, and client error utilities are all tested with Jest and React Testing Library.
