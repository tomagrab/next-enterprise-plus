# Next Enterprise Plus

[![CodeRabbit Pull Request Reviews](https://img.shields.io/coderabbit/prs/github/tomagrab/next-enterprise-plus?utm_source=oss&utm_medium=github&utm_campaign=tomagrab%2Fnext-enterprise-plus&labelColor=171717&color=FF570A&label=CodeRabbit+Reviews)](https://coderabbit.ai)

A modern Next.js template project designed for enterprise applications, featuring a responsive layout, authentication, and professional UI components.

## Features

- 🚀 **Next.js 15** with App Router and TypeScript
- 🎨 **Tailwind CSS** with shadcn/ui components
- 📱 **Responsive Design** - Desktop sidebar, mobile bottom navigation
- 🔐 **NextAuth.js** integration ready for multiple providers
- 🧪 **Testing Infrastructure** - Jest, React Testing Library, Playwright E2E with 100% test pass rate
- 🛡️ **Security & Compliance** - CSP, rate limiting, CSRF protection, input validation
- 🌙 **Dark/Light Mode** with next-themes
- 📏 **Standardized Overflow** - Only main content scrolls
- 🗂️ **Dynamic Breadcrumbs** - Context-aware navigation
- ⚡ **TypeScript** - Full type safety
- 🎯 **Modern UI/UX** - Professional dashboard patterns

## Project Structure

```plaintext
src/
├── __tests__/              # Test utilities and fixtures
│   ├── test-utils.tsx     # Custom render functions with providers
│   └── fixtures.ts        # Test data and mock objects
├── app/                    # App Router pages and API routes
│   ├── api/
│   │   ├── auth/          # NextAuth.js API routes
│   │   ├── example/       # Example API routes with error handling
│   │   └── secure/        # Secure API routes with validation
│   ├── auth/signin/       # Custom sign-in page
│   ├── auth-setup/        # Authentication setup guide
│   ├── error-testing/     # Error testing demo page
│   ├── getting-started/   # Getting started guide
│   ├── overflow-demo/    # Overflow behavior demo
│   ├── security-testing/ # Security testing demo
│   ├── server-actions/   # Server actions demo
│   ├── error.tsx         # Global error page
│   ├── layout.tsx        # Root layout
│   ├── not-found.tsx     # 404 page
│   └── page.tsx          # Homepage
├── components/
│   ├── auth/             # Authentication components
│   │   └── user-menu.tsx # User authentication menu
│   ├── demo/             # Demo and testing components
│   │   ├── error-testing-demo.tsx
│   │   ├── overflow-demo.tsx
│   │   ├── security-demo.tsx
│   │   ├── server-action-demo.tsx
│   │   └── __tests__/    # Component tests
│   ├── error/            # Error boundary components
│   │   ├── error-boundary.tsx
│   │   └── __tests__/    # Error component tests
│   ├── providers/        # Context providers
│   │   ├── providers.tsx # Main providers wrapper
│   │   └── theme/        # Theme provider components
│   └── ui/               # shadcn/ui components
│       ├── app-sidebar.tsx
│       ├── button.tsx
│       ├── card.tsx
│       ├── dialog.tsx
│       ├── dynamic-title.tsx
│       ├── footer.tsx
│       ├── header.tsx
│       ├── mobile-nav.tsx
│       ├── sidebar.tsx
│       └── ... (40+ UI components)
├── hooks/                # Custom React hooks
│   └── use-mobile.ts     # Mobile detection hook
├── lib/
│   ├── auth/             # Authentication utilities
│   │   └── auth.ts       # NextAuth.js configuration
│   ├── errors/           # Error handling utilities
│   │   ├── api-errors.ts # API error handling
│   │   └── client-errors.ts # Client error utilities
│   ├── security/         # Security middleware and validation
│   │   ├── validation.ts # Zod schema validation
│   │   ├── rate-limit.ts # Rate limiting
│   │   ├── csrf.ts       # CSRF protection
│   │   └── headers.ts    # Security headers
│   ├── server/actions/   # Server actions
│   │   └── auth/         # Authentication server actions
│   ├── utilities/        # General utilities
│   │   └── auth/         # Auth utility functions
│   └── utils.ts          # General utility functions
└── types/
    └── auth/
        └── next-auth.d.ts # NextAuth TypeScript definitions

e2e/                       # End-to-end tests
├── auth.spec.ts          # Authentication E2E tests
├── home.spec.ts          # Homepage E2E tests
├── navigation.spec.ts    # Navigation E2E tests
└── security.spec.ts      # Security features E2E tests

Configuration Files:
├── middleware.ts         # Security and session middleware
├── jest.config.js        # Jest testing configuration
├── jest.setup.ts         # Jest setup and global mocks
├── playwright.config.ts  # Playwright E2E test configuration
├── components.json       # shadcn/ui configuration
├── next.config.ts        # Next.js configuration
├── tsconfig.json         # TypeScript configuration
└── package.json          # Dependencies and scripts
```

## Quick Start

1. **Clone and Install**

   ```bash
   git clone https://github.com/tomagrab/next-template
   cd next-template
   npm install
   ```

2. **Environment Setup**

   ```bash
   cp .env.example .env.local
   npx auth secret
   ```

3. **Run Development Server**

   ```bash
   npm run dev
   ```

4. **Open** [http://localhost:3000](http://localhost:3000)

## Testing

The template includes a comprehensive testing suite with **100% test pass rate**:

```bash
# Run all tests
npm test

# Results: ✅ 4 test suites passed, 22 tests passed
```

- **Unit Tests**: Component and utility function testing
- **Integration Tests**: API route testing with proper Next.js mocking
- **E2E Tests**: Cross-browser testing with Playwright
- **Security Tests**: Validation, rate limiting, and security feature testing

For detailed testing information, see [TESTING.md](./TESTING.md).

## Authentication Setup

This template comes with NextAuth.js v4 (stable) pre-configured and ready for your authentication providers.

### 1. Choose Your Authentication Provider

The template supports multiple providers. Uncomment your preferred option in `src/lib/auth/auth.ts`:

#### GitHub Provider

```typescript
// In src/lib/auth/auth.ts, uncomment:
import GitHubProvider from "next-auth/providers/github";

providers: [
  GitHubProvider({
    clientId: process.env.AUTH_GITHUB_ID!,
    clientSecret: process.env.AUTH_GITHUB_SECRET!,
  }),
];
```

#### Google Provider

```typescript
// In src/lib/auth/auth.ts, uncomment:
import GoogleProvider from "next-auth/providers/google";

providers: [
  GoogleProvider({
    clientId: process.env.AUTH_GOOGLE_ID!,
    clientSecret: process.env.AUTH_GOOGLE_SECRET!,
  }),
];
```

#### Microsoft Entra ID (Recommended for Enterprise)

```typescript
// In src/lib/auth/auth.ts, uncomment:
import AzureADProvider from "next-auth/providers/entra-id";

providers: [
  AzureADProvider({
    clientId: process.env.AUTH_AZURE_AD_CLIENT_ID!,
    clientSecret: process.env.AUTH_AZURE_AD_CLIENT_SECRET!,
    tenantId: process.env.AUTH_AZURE_AD_TENANT_ID!,
  }),
];
```

### 2. Configure OAuth Application

#### GitHub

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Create new OAuth App
3. Set callback URL: `http://localhost:3000/api/auth/callback/github`
4. Note down: Client ID and Client Secret

#### Google

1. Go to [Google Cloud Console](https://console.developers.google.com/)
2. Create OAuth 2.0 Client ID
3. Set redirect URI: `http://localhost:3000/api/auth/callback/google`
4. Note down: Client ID and Client Secret

#### Microsoft Entra ID

1. Go to [Microsoft Entra Admin Center](https://entra.microsoft.com/)
2. Navigate to Identity > Applications > App Registrations
3. Create a new registration
4. Set redirect URI: `http://localhost:3000/api/auth/callback/microsoft-entra-id`
5. Create a client secret in "Certificates & secrets"
6. Note down: Client ID, Client Secret, and configure the issuer URL based on your tenant type

### 3. Update Environment Variables

Add your provider credentials to `.env.local`:

```bash
# Required
NEXTAUTH_SECRET=your-generated-secret
NEXTAUTH_URL=http://localhost:3000

# For GitHub
AUTH_GITHUB_ID=your-github-client-id
AUTH_GITHUB_SECRET=your-github-client-secret

# For Google
AUTH_GOOGLE_ID=your-google-client-id
AUTH_GOOGLE_SECRET=your-google-client-secret

# For Microsoft Entra ID
AUTH_MICROSOFT_ENTRA_ID_ID=your-client-id
AUTH_MICROSOFT_ENTRA_ID_SECRET=your-client-secret
AUTH_MICROSOFT_ENTRA_ID_ISSUER=https://login.microsoftonline.com/your-tenant-id/v2.0

# Issuer URL options for different tenant types:
# Single tenant: https://login.microsoftonline.com/{tenant-id}/v2.0
# Multi-tenant (orgs): https://login.microsoftonline.com/organizations/v2.0
# Multi-tenant + personal: https://login.microsoftonline.com/common/v2.0
# Personal only: https://login.microsoftonline.com/consumers/v2.0
```

> **Note**: Microsoft renamed Azure AD to Microsoft Entra ID. This template uses the latest provider configuration and environment variable names.

### 4. Enable Authentication

Remove the `disabled` prop from the sign-in buttons in `src/app/auth/signin/page.tsx`:

```typescript
// Change from:
<Button type="submit" variant="outline" className="w-full" disabled>

// To:
<Button type="submit" variant="outline" className="w-full">
```

## Key Authentication Features

- **Type Safety**: Full TypeScript support with proper type definitions
- **Server Actions**: Modern Next.js 15+ server actions for auth operations
- **Custom UI**: Styled sign-in page with shadcn/ui components
- **Session Management**: Automatic session handling across the app
- **Middleware**: Optional route protection (currently allows all routes)

### Using Session Data

```typescript
// In server components
import { getSession } from "@/lib/auth-utils";

const session = await getSession();
if (session?.user) {
  // User is authenticated
}

// In client components
import { useSession } from "next-auth/react";

const { data: session, status } = useSession();
```

### Customizing Route Protection

Edit `middleware.ts` to protect specific routes:

```typescript
export default withAuth({
  callbacks: {
    authorized: ({ token, req }) => {
      // Protect admin routes
      if (req.nextUrl.pathname.startsWith("/admin")) {
        return token?.role === "admin";
      }

      // Require auth for dashboard
      if (req.nextUrl.pathname.startsWith("/dashboard")) {
        return !!token;
      }

      // Allow all other routes
      return true;
    },
  },
});
```

## Error Handling & Monitoring

This template includes a comprehensive error handling system designed for production use.

### Client-Side Error Handling

- **Error Boundary**: Global error boundary wraps the entire application (`src/components/error/error-boundary.tsx`)
- **Custom Error Pages**:
  - `src/app/not-found.tsx` - Custom 404 page
  - `src/app/error.tsx` - Custom 500 error page
- **Error Utilities**: Client-side error handling in `src/lib/errors/client-errors.ts`

### API Error Handling

- **Structured Errors**: Custom `ApiError` class with status codes and error codes
- **Error Handler**: Wrapper function `withErrorHandler()` for API routes
- **Consistent Responses**: Standardized error response format
- **Example Usage**:

```typescript
import { withErrorHandler, errors } from "@/lib/errors/api-errors";

const handler = withErrorHandler(async (request: Request) => {
  // Your API logic here
  if (!isValid) {
    throw errors.badRequest("Invalid input data");
  }
  return Response.json({ success: true });
});

export { handler as GET, handler as POST };
```

### Server Action Error Handling

Server actions include robust error handling with validation and logging:

```typescript
import {
  signIn,
  signInWithResult,
} from "@/lib/server/actions/auth/auth-actions";

// Standard server action (redirects on success)
await signIn("google");

// Result-returning version (for UI handling)
const result = await signInWithResult("google");
if (result.success && result.data) {
  // Handle success - redirect manually
  window.location.href = result.data.redirectUrl;
} else if (result.error) {
  // Handle error in UI
  toast.error(result.error.message);
}
```

**Key Features**:

- Input validation with meaningful error messages
- Provider allowlist validation
- Proper redirect handling (distinguishes expected redirects from errors)
- Structured response types with TypeScript support
- Comprehensive logging for monitoring

### Error Testing

The template includes interactive demos for testing error handling:

- **Error Testing Demo**: Test different error scenarios in development
- **Server Action Demo**: Test authentication server actions with error handling

### Monitoring Integration

See `ERROR_MONITORING.md` for detailed instructions on integrating monitoring services like Sentry, LogRocket, or Datadog.

## Security & Compliance

The template includes a comprehensive security layer with production-ready middleware and validation systems.

### Security Features

- **Content Security Policy (CSP)**: Configurable CSP headers with environment-specific settings
- **Rate Limiting**: In-memory rate limiting with different limits for endpoint types
- **CSRF Protection**: Double submit cookie pattern with automatic token management
- **Input Validation**: Zod schema validation for API endpoints
- **Security Headers**: HSTS, frame options, content type protection, and more

### Security Middleware

All security features are applied via `middleware.ts`:

```typescript
// Automatic application of:
// - Security headers based on environment
// - Rate limiting per endpoint type
// - CSRF protection for sensitive routes
// - Session-based authentication
```

### Input Validation with Zod

Example secure API route with validation:

```typescript
import { z } from "zod";
import { validateInput } from "@/lib/security/validation";

const CreateUserSchema = z.object({
  name: z.string().min(2).max(50),
  email: z.string().email(),
  age: z.number().min(13).max(120).optional(),
});

export async function POST(request: Request) {
  const validation = await validateInput(request, CreateUserSchema);
  if (!validation.success) {
    return Response.json(validation.error, { status: 400 });
  }

  const { name, email, age } = validation.data;
  // Your API logic here...
}
```

### Rate Limiting Configuration

Different rate limits for different endpoint types:

```typescript
// From src/lib/security/rate-limit.ts
const rateLimitConfigs = {
  auth: { windowMs: 15 * 60 * 1000, max: 5 }, // 5 requests per 15 minutes
  api: { windowMs: 15 * 60 * 1000, max: 100 }, // 100 requests per 15 minutes
  default: { windowMs: 15 * 60 * 1000, max: 1000 }, // 1000 requests per 15 minutes
};
```

### Security Headers

Environment-specific CSP and security headers:

- **Development**: Allows unsafe-eval and localhost connections for hot reload
- **Production**: Strict CSP with only necessary sources allowed
- **HSTS**: HTTP Strict Transport Security for production
- **Frame Protection**: Prevents clickjacking attacks
- **Content Type Protection**: Prevents MIME sniffing

### CSRF Protection

Automatic CSRF token generation and validation:

```typescript
// Tokens are automatically:
// - Generated for GET requests
// - Validated for POST/PUT/DELETE requests
// - Stored in secure cookies
// - Verified via headers
```

### Security Testing

The template includes interactive security testing:

- **Validation Testing**: Test Zod schema validation with invalid data
- **Rate Limiting**: Trigger rate limits with rapid requests
- **Security Headers**: Inspect applied security headers
- **CSRF Protection**: Automatic token handling demonstration

### Production Security Recommendations

1. **Redis for Rate Limiting**: Replace in-memory rate limiting with Redis for distributed systems
2. **Environment Variables**: Secure management of secrets and API keys
3. **Monitoring**: Integrate security monitoring and alerting
4. **Regular Updates**: Keep dependencies updated for security patches
5. **SSL/TLS**: Always use HTTPS in production environments

### Security Files Structure

```plaintext
src/lib/security/
├── headers.ts         # CSP and security headers configuration
├── rate-limit.ts      # Rate limiting middleware and utilities
├── validation.ts      # Zod schema validation helpers
└── csrf.ts           # CSRF protection implementation
```

## Testing Infrastructure

The template includes a comprehensive testing setup with unit testing, integration testing, and end-to-end testing capabilities.

### Testing Stack

- **Jest** - JavaScript testing framework with Next.js integration
- **React Testing Library** - Testing utilities for React components
- **Playwright** - Cross-browser end-to-end testing
- **TypeScript** - Full type safety in tests

### Running Tests

```bash
# Unit & Integration Tests
npm run test              # Run all unit tests
npm run test:watch        # Run tests in watch mode
npm run test:coverage     # Generate coverage report

# End-to-End Tests
npm run test:e2e          # Run E2E tests
npm run test:e2e:ui       # Run E2E tests with UI
npm run test:e2e:headed   # Run E2E tests in headed mode

# All Tests
npm run test:all          # Run unit + E2E tests
```

### Test Structure

```plaintext
src/
├── __tests__/
│   ├── test-utils.tsx    # Custom render functions with providers
│   └── fixtures.ts       # Test data and mock objects
├── components/
│   └── **/__tests__/     # Component unit tests
└── app/api/
    └── **/__tests__/     # API route tests
e2e/
├── home.spec.ts         # Homepage E2E tests
├── navigation.spec.ts   # Navigation E2E tests
├── auth.spec.ts        # Authentication E2E tests
└── security.spec.ts    # Security features E2E tests
```

### Key Testing Features

- **Custom Test Utilities**: Pre-configured render functions with all providers (theme, auth, toast)
- **Mock Management**: Automatic mocking of Next.js router, NextAuth, and browser APIs
- **Security Testing**: Comprehensive tests for validation, rate limiting, CSRF protection, and security headers
- **Cross-Browser E2E**: Tests run on Chromium, Firefox, WebKit, and mobile browsers
- **Coverage Requirements**: Enforced minimum coverage thresholds (70% across all metrics)
- **CI/CD Ready**: Configured for continuous integration environments

### Example Test

```typescript
import { render, screen, renderWithAuth } from "@/__tests__/test-utils";
import { Button } from "@/components/ui/button";
import userEvent from "@testing-library/user-event";

describe("Button Component", () => {
  it("handles click events", async () => {
    const user = userEvent.setup();
    const handleClick = jest.fn();

    render(<Button onClick={handleClick}>Click me</Button>);

    await user.click(screen.getByRole("button"));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

For detailed testing documentation, see `TESTING.md`.

## Customization

### Navigation

Edit `src/components/ui/app-sidebar.tsx` to modify:

- Navigation items
- App branding
- Sidebar behavior

### Pages

- Add new pages in `src/app/`
- Update navigation arrays in sidebar component
- All pages automatically get proper layout and breadcrumbs

### Styling

- Modify `src/app/globals.css` for global styles
- Use Tailwind classes throughout components
- shadcn/ui components are in `src/components/ui/`

### Authentication

- Extend user types in `types/next-auth.d.ts`
- Customize sign-in page in `src/app/auth/signin/page.tsx`
- Add protected routes using middleware patterns
- Server-side session utilities in `src/lib/auth-utils.ts`

## Development Commands

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

## Production Deployment

1. **Set environment variables** in your hosting platform:

   - `NEXTAUTH_SECRET` - Your generated secret
   - `NEXTAUTH_URL` - Your production domain
   - Provider-specific credentials (GitHub, Google, Entra ID)

2. **Update OAuth redirect URIs** to production URLs:

   - GitHub: `https://yourdomain.com/api/auth/callback/github`
   - Google: `https://yourdomain.com/api/auth/callback/google`
   - Entra ID: `https://yourdomain.com/api/auth/callback/entra-id`

3. **Deploy** using your preferred platform (Vercel, Netlify, etc.)

4. **Test authentication flow** thoroughly in production environment

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [NextAuth.js Documentation](https://next-auth.js.org)
- [Tailwind CSS](https://tailwindcss.com)
- [shadcn/ui](https://ui.shadcn.com)

## License

This project is licensed under the MIT License. See the [LICENSE](./LICENSE.txt) file for details.
