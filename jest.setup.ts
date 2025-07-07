/* eslint-disable @typescript-eslint/no-explicit-any */
// Jest DOM matchers
import "@testing-library/jest-dom";

// Set NODE_ENV to development for tests
Object.defineProperty(process.env, "NODE_ENV", {
  value: "development",
  writable: true,
});

// Mock Next.js router
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(() => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    refresh: jest.fn(),
    prefetch: jest.fn(),
  })),
  usePathname: jest.fn(() => "/"),
  useSearchParams: jest.fn(() => new URLSearchParams()),
}));

// Mock NextAuth
jest.mock("next-auth/react", () => ({
  useSession: jest.fn(() => ({
    data: null,
    status: "unauthenticated",
  })),
  signIn: jest.fn(),
  signOut: jest.fn(),
  SessionProvider: ({ children }: { children: React.ReactNode }) => children,
}));

// Mock environment variables
process.env.NEXTAUTH_URL = "http://localhost:3000";
process.env.NEXTAUTH_SECRET = "test-secret";
// NODE_ENV is set by Jest automatically to 'test'

// Mock fetch globally
global.fetch = jest.fn();

// Simple polyfills for web APIs
(global as any).Request = class {
  url: string;
  method: string;
  headers: any;
  body: any;

  constructor(input: string | URL, init: any = {}) {
    this.url = typeof input === "string" ? input : input.toString();
    this.method = init.method || "GET";
    this.headers = init.headers || {};
    this.body = init.body;
  }

  json() {
    return Promise.resolve(JSON.parse(this.body || "{}"));
  }

  text() {
    return Promise.resolve(this.body || "");
  }
};

(global as any).Response = class {
  status: number;
  statusText: string;
  headers: any;
  body: any;

  constructor(body?: any, init: any = {}) {
    this.status = init.status || 200;
    this.statusText = init.statusText || "OK";
    this.headers = init.headers || {};
    this.body = body;
  }

  json() {
    return Promise.resolve(JSON.parse(this.body || "{}"));
  }

  text() {
    return Promise.resolve(this.body || "");
  }

  static json(data: any, init: any = {}) {
    return new (global as any).Response(JSON.stringify(data), {
      ...init,
      headers: {
        "Content-Type": "application/json",
        ...init.headers,
      },
    });
  }
};

(global as any).Headers = class {
  private headers: Record<string, string> = {};

  constructor(init?: any) {
    if (init) {
      if (Array.isArray(init)) {
        init.forEach(([key, value]) => {
          this.headers[key.toLowerCase()] = value;
        });
      } else if (typeof init === "object") {
        Object.entries(init).forEach(([key, value]) => {
          this.headers[key.toLowerCase()] = value as string;
        });
      }
    }
  }

  get(name: string) {
    return this.headers[name.toLowerCase()] || null;
  }

  set(name: string, value: string) {
    this.headers[name.toLowerCase()] = value;
  }

  has(name: string) {
    return name.toLowerCase() in this.headers;
  }

  delete(name: string) {
    delete this.headers[name.toLowerCase()];
  }
};

// Mock window.matchMedia
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock IntersectionObserver
global.IntersectionObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Mock ResizeObserver
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Suppress console warnings during tests
const originalError = console.error;
beforeAll(() => {
  console.error = (...args: unknown[]) => {
    if (
      typeof args[0] === "string" &&
      (args[0].includes("Warning: ReactDOM.render is no longer supported") ||
        args[0].includes("An update to") ||
        args[0].includes("act(...)"))
    ) {
      return;
    }
    originalError.call(console, ...args);
  };
});

afterAll(() => {
  console.error = originalError;
});
