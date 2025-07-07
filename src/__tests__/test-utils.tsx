import React from "react";
import { render, RenderOptions } from "@testing-library/react";
import { SessionProvider } from "next-auth/react";
import { Session } from "next-auth";
import { ThemeProvider } from "@/components/providers/theme/theme-provider";
import { Toaster } from "@/components/ui/sonner";

// Mock session data
export const mockSession: Session = {
  user: {
    id: "1",
    name: "Test User",
    email: "test@example.com",
    image: "https://example.com/avatar.jpg",
  },
  expires: new Date(Date.now() + 2 * 86400).toISOString(),
};

// Test wrapper with all providers
const AllTheProviders = ({
  children,
  session = null,
}: {
  children: React.ReactNode;
  session?: Session | null;
}) => {
  return (
    <SessionProvider session={session}>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        {children}
        <Toaster />
      </ThemeProvider>
    </SessionProvider>
  );
};

// Custom render function with providers
const customRender = (
  ui: React.ReactElement,
  options?: RenderOptions & { session?: Session | null }
) => {
  const { session, ...renderOptions } = options || {};

  return render(ui, {
    wrapper: ({ children }) => (
      <AllTheProviders session={session}>{children}</AllTheProviders>
    ),
    ...renderOptions,
  });
};

// Custom render with authenticated session
export const renderWithAuth = (
  ui: React.ReactElement,
  options?: RenderOptions
) => {
  return customRender(ui, { ...options, session: mockSession });
};

// Custom render without authentication
export const renderWithoutAuth = (
  ui: React.ReactElement,
  options?: RenderOptions
) => {
  return customRender(ui, { ...options, session: null });
};

// Re-export everything from testing-library
export * from "@testing-library/react";
export { customRender as render };

// Common test utilities
export const createMockRouter = (pathname = "/") => ({
  push: jest.fn(),
  replace: jest.fn(),
  back: jest.fn(),
  forward: jest.fn(),
  refresh: jest.fn(),
  prefetch: jest.fn(),
  pathname,
});

export const createMockSearchParams = (params: Record<string, string> = {}) => {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    searchParams.set(key, value);
  });
  return searchParams;
};

// Mock fetch response helper
export const createMockFetchResponse = (data: unknown, status = 200) => {
  return Promise.resolve({
    ok: status >= 200 && status < 300,
    status,
    json: () => Promise.resolve(data),
    text: () => Promise.resolve(JSON.stringify(data)),
    headers: new Headers(),
  }) as Promise<Response>;
};

// Async helper for testing loading states
export const waitForLoadingToFinish = () => {
  return new Promise((resolve) => setTimeout(resolve, 0));
};

// Helper to suppress console errors during tests
export const suppressConsoleError = (fn: () => void | Promise<void>) => {
  const originalError = console.error;
  console.error = jest.fn();

  try {
    return fn();
  } finally {
    console.error = originalError;
  }
};
