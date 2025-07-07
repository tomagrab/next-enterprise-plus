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
- 🌙 **Dark/Light Mode & Color Themes** - Dual theme system with next-themes + custom color themes
- � **Feature Flag System** - Type-safe feature flags with local and third-party provider support
- �📏 **Standardized Overflow** - Only main content scrolls
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
│   ├── color-theme/      # Color theme showcase and demo
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
│   │   ├── color-theme-demo.tsx
│   │   ├── error-testing-demo.tsx
│   │   ├── feature-flag-demo.tsx
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
│   │       ├── color-theme-provider.tsx
│   │       └── __tests__/
│   └── ui/               # shadcn/ui components
│       ├── app-sidebar.tsx
│       ├── button.tsx
│       ├── card.tsx
│       ├── color-theme-toggle.tsx
│       ├── dialog.tsx
│       ├── dynamic-title.tsx
│       ├── footer.tsx
│       ├── header.tsx
│       ├── mobile-nav.tsx
│       ├── sidebar.tsx
│       ├── theme-controls.tsx
│       └── ... (40+ UI components)
├── hooks/                # Custom React hooks
│   └── use-mobile.ts     # Mobile detection hook
├── lib/
│   ├── auth/             # Authentication utilities
│   │   └── auth.ts       # NextAuth.js configuration
│   ├── errors/           # Error handling utilities
│   │   ├── api-errors.ts # API error handling
│   │   └── client-errors.ts # Client error utilities
│   ├── feature-flags/    # Feature flag system
│   │   ├── types.ts      # Feature flag types and interfaces
│   │   ├── manager.ts    # Feature flag manager
│   │   ├── context.tsx   # React context and hooks
│   │   ├── providers/    # Feature flag providers
│   │   │   └── local.ts  # Local/static provider
│   │   └── index.ts      # Public API exports
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
├── color-theme.spec.ts   # Color theme system E2E tests
├── home.spec.ts          # Homepage E2E tests
├── navigation.spec.ts    # Navigation E2E tests
├── performance.spec.ts   # Performance testing
├── security.spec.ts      # Security features E2E tests
└── visual-regression.spec.ts # Visual regression testing

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

5. **Review Architecture** - See [API Integration](#api-integration) for recommended backend architecture patterns

## Testing

The template includes a comprehensive testing suite with **100% test pass rate**:

```bash
# Run all tests
npm test

# Results: ✅ 9 test suites passed, 51 tests passed
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

## Color Theme System

The template includes a comprehensive color theme system that works independently from the light/dark mode toggle, allowing users to customize the application's color palette while maintaining their preferred brightness setting.

### Color Theme Features

- **6 Built-in Color Themes**: Blue (default), Green, Orange, Red, Purple, and Yellow
- **Independent Control**: Color themes work separately from light/dark mode
- **Persistent Storage**: Theme preferences saved to localStorage
- **CSS Variable Integration**: Themes use CSS custom properties for seamless switching
- **TypeScript Support**: Fully typed theme system with proper IntelliSense

### Available Themes

| Theme  | Primary Color            | Use Case              |
| ------ | ------------------------ | --------------------- |
| Blue   | `hsl(221.2 83.2% 53.3%)` | Default, professional |
| Green  | `hsl(142.1 76.2% 36.3%)` | Success, growth       |
| Orange | `hsl(24.6 95% 53.1%)`    | Energy, creativity    |
| Red    | `hsl(346.8 77.2% 49.8%)` | Alerts, importance    |
| Purple | `hsl(262.1 83.3% 57.8%)` | Innovation, premium   |
| Yellow | `hsl(47.9 95.8% 53.1%)`  | Optimism, attention   |

### Usage

#### Color Theme Toggle Component

```typescript
import { ColorThemeToggle } from "@/components/ui/color-theme-toggle";

// Renders a palette button with dropdown menu
<ColorThemeToggle />;
```

#### Color Theme Provider

```typescript
import { useColorTheme } from "@/components/providers/theme/color-theme-provider";

const { theme, setTheme } = useColorTheme();

// Current theme: "blue" | "green" | "orange" | "red" | "purple" | "yellow"
console.log(theme);

// Change theme
setTheme("green");
```

#### Theme Controls (Combined Component)

```typescript
import { ThemeControls } from "@/components/ui/theme-controls";

// Renders both color theme toggle and light/dark mode toggle
<ThemeControls />;
```

### Integration with next-themes

The color theme system is designed to work seamlessly with next-themes:

- **Light/Dark Mode**: Controlled by next-themes (`useTheme`)
- **Color Themes**: Controlled by custom provider (`useColorTheme`)
- **CSS Classes**: Applied simultaneously (e.g., `dark theme-green`)

### Custom Theme Development

#### Adding New Themes

1. **Update the theme type** in `src/components/providers/theme/color-theme-provider.tsx`:

```typescript
export type ColorTheme =
  | "blue"
  | "green"
  | "orange"
  | "red"
  | "purple"
  | "yellow"
  | "custom";
```

1. **Add CSS variables** in `src/app/globals.css`:

```css
.theme-custom {
  --primary: 180 100% 50%; /* Your custom hsl values */
  --primary-foreground: 0 0% 100%;
  /* ... other color variables */
}
```

1. **Update theme options** in components:

```typescript
const themes = [
  { name: "blue", label: "Blue" },
  { name: "custom", label: "Custom" },
  // ... other themes
];
```

#### CSS Integration

Each theme applies CSS custom properties to the document root:

```css
/* Applied automatically when theme changes */
.theme-blue {
  --primary: 221.2 83.2% 53.3%;
  --primary-foreground: 210 40% 98%;
  /* ... */
}

.theme-green {
  --primary: 142.1 76.2% 36.3%;
  --primary-foreground: 355.7 100% 97.3%;
  /* ... */
}
```

### Demo Page

Visit `/color-theme` to see an interactive demonstration of the color theme system with:

- **Theme Selector**: Try all available color themes
- **Component Showcase**: See how themes affect different UI components
- **Form Elements**: Interactive form with theme-aware styling
- **Technical Information**: View current theme state and CSS variables

### Color Theme Testing

The color theme system includes comprehensive tests:

```bash
# Run color theme tests
npm test -- --testPathPatterns="color-theme"

# Tests cover:
# - Theme provider functionality
# - Theme toggle component
# - Theme persistence
# - CSS class application
```

## Feature Flag System

The template includes a robust, type-safe feature flag system designed for gradual feature rollout, A/B testing, and environment-specific feature control.

### Feature Flag Features

- **Type Safety**: Fully typed feature flags with TypeScript support
- **Multiple Providers**: Local/static flags and extensible for third-party providers
- **React Integration**: Context and hooks for easy component usage
- **Server & Client Support**: Works in both server and client components
- **Environment Configuration**: Configure flags via environment variables
- **User Targeting**: Support for user groups and rollout percentages
- **Debug Panel**: Development-time debug interface

### Quick Usage

#### Basic Flag Usage

```typescript
// In any React component
import { useFeatureFlag } from "@/lib/feature-flags";

function MyComponent() {
  const isNewFeatureEnabled = useFeatureFlag("newFeature");

  return (
    <div>
      {isNewFeatureEnabled ? <NewFeatureComponent /> : <LegacyComponent />}
    </div>
  );
}
```

#### Multiple Flags

```typescript
import { useFeatureFlags } from "@/lib/feature-flags";

function Dashboard() {
  const flags = useFeatureFlags([
    "advancedAnalytics",
    "betaFeatures",
    "experimentalUI",
  ]);

  return (
    <div>
      {flags.advancedAnalytics && <AnalyticsPanel />}
      {flags.betaFeatures && <BetaFeaturesSection />}
      {flags.experimentalUI ? <NewUI /> : <LegacyUI />}
    </div>
  );
}
```

### Configuration

#### Environment Variables

Configure feature flags using environment variables in `.env.local`:

```bash
# Feature flag provider configuration
NEXT_PUBLIC_FF_PROVIDER=local  # 'local' or third-party provider name

# Refresh interval in milliseconds (default: 900000 = 15 minutes)
FEATURE_FLAGS_REFRESH_INTERVAL_MS=900000

# Local provider flags (prefix with NEXT_PUBLIC_FF_)
NEXT_PUBLIC_FF_NEW_DASHBOARD=true
NEXT_PUBLIC_FF_BETA_FEATURES=false
NEXT_PUBLIC_FF_EXPERIMENTAL_UI=true

# Advanced targeting (JSON format)
NEXT_PUBLIC_FF_PREMIUM_FEATURES='{"enabled":true,"rolloutPercentage":50,"environments":["production"],"userGroups":["premium","beta"]}'
```

#### Provider Setup

The system uses a provider-based architecture for flexibility:

```typescript
// Feature flag manager automatically detects provider
import { FeatureFlagManager } from "@/lib/feature-flags";

// Initialize with environment-based configuration
const manager = new FeatureFlagManager({
  provider: "local", // Auto-detected from NEXT_PUBLIC_FF_PROVIDER
  environment: process.env.NODE_ENV,
});
```

### Advanced Configuration

#### Refresh Interval

Control how often feature flags are refreshed from the provider:

```bash
# Set refresh interval (in milliseconds)
FEATURE_FLAGS_REFRESH_INTERVAL_MS=900000  # 15 minutes (default)
FEATURE_FLAGS_REFRESH_INTERVAL_MS=300000  # 5 minutes (more frequent)
FEATURE_FLAGS_REFRESH_INTERVAL_MS=1800000 # 30 minutes (less frequent)
```

**Recommendations:**

- **Development**: 5-10 minutes for faster iteration
- **Production**: 15-30 minutes to balance freshness with performance
- **High-traffic**: 30+ minutes to reduce provider API calls

You can also override the refresh interval programmatically:

```tsx
<FeatureFlagProvider
  provider={featureFlagProvider}
  refreshIntervalMs={300000} // 5 minutes
>
  {children}
</FeatureFlagProvider>
```

#### User Targeting

```typescript
// Example: Premium features for specific user groups
const premiumFeaturesConfig = {
  enabled: true,
  rolloutPercentage: 75,
  userGroups: ["premium", "beta"],
  environments: ["production", "staging"],
};
```

#### Rollout Percentages

```typescript
// Gradual rollout to 25% of users
const newFeatureConfig = {
  enabled: true,
  rolloutPercentage: 25,
};
```

### Adding New Feature Flags

1. **Define the flag** in your environment variables:

   ```bash
   NEXT_PUBLIC_FF_MY_NEW_FEATURE=true
   ```

2. **Use in components**:

   ```typescript
   const isMyNewFeatureEnabled = useFeatureFlag("myNewFeature");
   ```

3. **Optional: Add TypeScript types** for better IntelliSense:

   ```typescript
   // In src/lib/feature-flags/types.ts
   export interface FeatureFlags {
     myNewFeature: boolean;
     // ... other flags
   }
   ```

### Development Tools

#### Debug Panel

The system includes a debug panel for development (automatically shown in development mode):

- View all active flags and their values
- Toggle flags in real-time
- See flag configuration and targeting rules
- Test different user scenarios

#### Testing Feature Flags

```typescript
// In tests, mock feature flags
import { render } from "@/__tests__/test-utils";

test("renders new feature when flag is enabled", () => {
  // Mock the feature flag
  const mockFlags = { newFeature: true };

  render(<MyComponent />, {
    featureFlags: mockFlags,
  });

  expect(screen.getByText("New Feature")).toBeInTheDocument();
});
```

### Third-Party Integration

The system is designed to easily integrate with providers like LaunchDarkly, ConfigCat, or Flagsmith:

```typescript
// Example: LaunchDarkly provider (extend the base provider)
import { FeatureFlagProvider } from "@/lib/feature-flags/types";

class LaunchDarklyProvider implements FeatureFlagProvider {
  async getFlag(flagName: string): Promise<boolean> {
    // LaunchDarkly SDK integration
    return ldClient.variation(flagName, false);
  }

  async getAllFlags(): Promise<Record<string, boolean>> {
    return ldClient.allFlags();
  }
}
```

### Feature Flag Demo

Visit `/feature-flags` to see an interactive demonstration of the feature flag system with:

- **Flag Controls**: Toggle flags and see immediate effects
- **Component Examples**: See how flags affect different UI components
- **Configuration Examples**: View advanced targeting and rollout scenarios
- **Debug Information**: Inspect current flag state and provider details

### Feature Flag Testing

The feature flag system includes comprehensive tests:

```bash
# Run feature flag tests
npm test -- --testPathPatterns="feature-flags"

# Tests cover:
# - Local provider functionality
# - Flag evaluation logic
# - React context and hooks
# - Environment variable parsing
# - User targeting and rollouts
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

## API Integration

### Architecture Philosophy

This template follows a **strict separation of concerns** architecture where the Next.js application serves exclusively as the presentation layer. The core principle is that **the Next.js app should never have direct database access**.

**Next.js Responsibilities:**

- Fetching data via API calls
- Displaying data to users
- Handling user interactions
- Client-side state management
- UI/UX presentation logic

**API Layer Responsibilities:**

- Database operations (CRUD)
- Business logic implementation
- Data validation and sanitization
- Authentication and authorization
- Rate limiting and security

#### Why No Direct Database Access?

**❌ We intentionally avoid ORMs like Prisma or Drizzle in the Next.js app** for the following reasons:

1. **Security**: Database credentials and connection strings are isolated from the frontend layer
2. **Separation of Concerns**: Business logic stays in the backend, presentation logic in the frontend
3. **Scalability**: API layer can be scaled independently and serve multiple clients (web, mobile, etc.)
4. **Technology Flexibility**: Database technology can be changed without affecting the Next.js app
5. **Testing**: Each layer can be unit tested independently with proper mocking
6. **Team Collaboration**: Frontend and backend teams can work independently with clear API contracts

#### Recommended API Technologies

**Enterprise-Grade Options:**

- **ASP.NET Core Web API** - Microsoft's robust, enterprise-ready API framework
- **Spring Boot** - Java-based enterprise framework with comprehensive features
- **Django REST Framework** - Python framework with built-in admin and ORM
- **Ruby on Rails API** - Convention-over-configuration with rapid development

**Modern Alternatives:**

- **Node.js + Express/Fastify** - JavaScript ecosystem consistency
- **Go + Gin/Echo** - High performance and simple deployment
- **Rust + Axum/Actix** - Memory safety and extreme performance
- **Python + FastAPI** - Modern async framework with automatic OpenAPI docs

#### Implementation Example

```typescript
// ✅ Recommended: API calls from Next.js
// src/lib/api/users.ts
export async function getUsers() {
  const response = await fetch(`${process.env.API_BASE_URL}/api/users`, {
    headers: {
      Authorization: `Bearer ${await getAccessToken()}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch users");
  }

  return response.json();
}

export async function createUser(userData: CreateUserRequest) {
  const response = await fetch(`${process.env.API_BASE_URL}/api/users`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${await getAccessToken()}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });

  if (!response.ok) {
    throw new Error("Failed to create user");
  }

  return response.json();
}
```

```typescript
// ❌ Avoided: Direct database access in Next.js
// We DON'T do this in the Next.js app:
// import { prisma } from '@/lib/prisma';
// const users = await prisma.user.findMany();
```

**Command Line Example (curl):**

```bash
# Fetch users from your API layer
curl -H "Authorization: Bearer YOUR_TOKEN" \
     -H "Content-Type: application/json" \
     https://api.yourcompany.com/api/users

# Create a new user
curl -X POST \
     -H "Authorization: Bearer YOUR_TOKEN" \
     -H "Content-Type: application/json" \
     -d '{"name":"John Doe","email":"john@example.com"}' \
     https://api.yourcompany.com/api/users
```

#### API Layer Example (ASP.NET Core)

```csharp
// Example API Controller (separate ASP.NET Core project)
[ApiController]
[Route("api/[controller]")]
public class UsersController : ControllerBase
{
    private readonly IUserService _userService;

    public UsersController(IUserService userService)
    {
        _userService = userService;
    }

    [HttpGet]
    [Authorize]
    public async Task<ActionResult<IEnumerable<UserDto>>> GetUsers()
    {
        var users = await _userService.GetUsersAsync();
        return Ok(users);
    }

    [HttpPost]
    [Authorize]
    public async Task<ActionResult<UserDto>> CreateUser(CreateUserRequest request)
    {
        var user = await _userService.CreateUserAsync(request);
        return CreatedAtAction(nameof(GetUser), new { id = user.Id }, user);
    }
}
```

#### Environment Configuration

```bash
# .env.local - Next.js environment variables
API_BASE_URL=https://api.yourcompany.com
API_TIMEOUT=30000
```

#### Benefits of This Architecture

- **🔒 Enhanced Security**: No database credentials in frontend code
- **🚀 Better Performance**: API layer can implement caching, connection pooling
- **📱 Multi-Platform Support**: Same API serves web, mobile, desktop applications
- **🧪 Improved Testing**: Clear boundaries make unit testing and integration testing easier
- **👥 Team Scalability**: Frontend and backend teams can work independently
- **🔄 Technology Evolution**: Replace database or API technology without frontend changes
- **📊 Monitoring & Analytics**: Centralized API layer enables better logging and monitoring

This architectural approach ensures your Next.js application remains focused on its core responsibility: delivering an exceptional user experience while maintaining clean separation from data persistence concerns.

## Testing Infrastructure

The template includes a comprehensive testing setup with unit testing, integration testing, and end-to-end testing capabilities.

### Testing Stack

- **Jest** - JavaScript testing framework with Next.js integration
- **React Testing Library** - Testing utilities for React components
- **Playwright** - Cross-browser end-to-end testing with performance & visual regression
- **TypeScript** - Full type safety in tests
- **Comprehensive Coverage** - Unit, integration, E2E, performance, and visual testing

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

# Specific Test Categories
npm run test -- --testPathPatterns="color-theme"  # Color theme tests
npm run test:e2e -- performance.spec.ts           # Performance tests

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
├── auth.spec.ts         # Authentication E2E tests
├── color-theme.spec.ts  # Color theme system E2E tests
├── home.spec.ts         # Homepage E2E tests
├── navigation.spec.ts   # Navigation E2E tests
├── performance.spec.ts  # Performance & Core Web Vitals testing
├── security.spec.ts     # Security features E2E tests
└── visual-regression.spec.ts # UI screenshot comparisons
```

### Key Testing Features

- **Custom Test Utilities**: Pre-configured render functions with all providers (theme, auth, toast)
- **Mock Management**: Automatic mocking of Next.js router, NextAuth, and browser APIs
- **Security Testing**: Comprehensive tests for validation, rate limiting, CSRF protection, and security headers
- **Performance Testing**: Core Web Vitals, bundle analysis, theme switching performance, and resource loading optimization
- **Color Theme Testing**: Full coverage of the dual theme system (light/dark + color themes)
- **Cross-Browser E2E**: Tests run across Chromium, Firefox, WebKit, and mobile browsers

### Performance Testing

The template includes comprehensive performance testing with Playwright:

```typescript
// Core Web Vitals measurement
test("measures Core Web Vitals and page load timing", async ({ page }) => {
  const performanceData = await page.evaluate(() => {
    const navigationEntry = performance.getEntriesByType("navigation")[0];
    const paintEntries = performance.getEntriesByType("paint");
    return {
      firstPaint: paintEntries.find((entry) => entry.name === "first-paint")
        ?.startTime,
      firstContentfulPaint: paintEntries.find(
        (entry) => entry.name === "first-contentful-paint"
      )?.startTime,
      domInteractive:
        navigationEntry?.domInteractive - navigationEntry?.fetchStart,
    };
  });

  expect(performanceData.firstPaint).toBeLessThan(1800); // < 1.8s (good)
  expect(performanceData.firstContentfulPaint).toBeLessThan(1800); // < 1.8s (good)
});

// Theme switching performance
test("measures theme switching response time", async ({ page }) => {
  const themes = ["red", "green", "violet", "orange"];
  for (const theme of themes) {
    const startTime = performance.now();
    await page.click(`[data-component="theme-${theme}"]`);
    await page.waitForFunction(
      (themeName) =>
        document.documentElement.classList.contains(`theme-${themeName}`),
      theme
    );
    const switchTime = performance.now() - startTime;
    expect(switchTime).toBeLessThan(150); // Theme switching should be fast
  }
});
```

**Performance Metrics Measured:**

- **Core Web Vitals**: First Paint, First Contentful Paint, DOM timing
- **Bundle Analysis**: JS/CSS sizes, resource counts, loading efficiency
- **Theme Performance**: Color theme switching response times
- **Memory Usage**: Heap size tracking during intensive operations
- **Scroll Performance**: Frame-accurate scrolling with dynamic content
- **Resource Loading**: Cross-page efficiency and optimization
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
