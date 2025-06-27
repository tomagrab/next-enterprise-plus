import { Session } from "next-auth";

// User fixtures
export const testUsers = {
  regularUser: {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    image: "https://example.com/john.jpg",
  },
  adminUser: {
    id: "2",
    name: "Admin User",
    email: "admin@example.com",
    image: "https://example.com/admin.jpg",
    role: "admin",
  },
  newUser: {
    name: "Jane Smith",
    email: "jane@example.com",
    age: 28,
  },
};

// Session fixtures
export const testSessions: Record<string, Session> = {
  authenticated: {
    user: testUsers.regularUser,
    expires: new Date(Date.now() + 2 * 86400).toISOString(),
  },
  adminAuthenticated: {
    user: testUsers.adminUser,
    expires: new Date(Date.now() + 2 * 86400).toISOString(),
  },
  expired: {
    user: testUsers.regularUser,
    expires: new Date(Date.now() - 86400).toISOString(),
  },
};

// API response fixtures
export const apiResponses = {
  usersList: {
    users: [testUsers.regularUser, testUsers.adminUser],
    pagination: {
      page: 1,
      limit: 10,
      total: 2,
      pages: 1,
    },
  },
  createdUser: {
    user: {
      id: "3",
      ...testUsers.newUser,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  },
  validationError: {
    message: "Validation failed",
    details: [
      { field: "email", message: "Invalid email format" },
      { field: "name", message: "Name must be at least 2 characters" },
    ],
  },
  rateLimitError: {
    message: "Too many requests",
    retryAfter: 900,
  },
};

// Form data fixtures
export const formData = {
  validUser: {
    name: "Test User",
    email: "test@example.com",
    age: 25,
  },
  invalidUser: {
    name: "A", // Too short
    email: "invalid-email", // Invalid format
    age: 200, // Too old
  },
  minimalUser: {
    name: "Minimal User",
    email: "minimal@example.com",
  },
};

// Error fixtures
export const errors = {
  networkError: new Error("Network request failed"),
  authError: new Error("Authentication required"),
  validationError: new Error("Invalid input data"),
  serverError: new Error("Internal server error"),
};

// Mock environment variables for tests
export const testEnvVars = {
  NEXTAUTH_URL: "http://localhost:3000",
  NEXTAUTH_SECRET: "test-secret-key-for-jwt-signing",
  NODE_ENV: "test",
};

// Security test data
export const securityData = {
  validCSRFToken: "valid-csrf-token-123",
  invalidCSRFToken: "invalid-csrf-token",
  maliciousInput: {
    xss: '<script>alert("xss")</script>',
    sqlInjection: "'; DROP TABLE users; --",
    pathTraversal: "../../../etc/passwd",
  },
  rateLimitRequests: Array.from({ length: 15 }, (_, i) => ({
    id: i + 1,
    timestamp: Date.now() + i * 100,
  })),
};
