import { NextRequest } from "next/server";

// Mock NextResponse to avoid headers issues in Jest
jest.mock("next/server", () => ({
  NextRequest: jest.fn(),
  NextResponse: {
    json: jest.fn((data, init) => ({
      json: () => Promise.resolve(data),
      status: init?.status || 200,
      ok: init?.status ? init.status < 400 : true,
    })),
  },
}));

// Mock the security modules before importing the route
jest.mock("@/lib/security/validation", () => ({
  validateRequestBody: jest.fn(() => jest.fn()),
  validateSearchParams: jest.fn(),
  schemas: {
    common: {
      name: {},
      email: {},
      password: {},
    },
    api: {
      pagination: {},
    },
  },
}));

jest.mock("@/lib/security/rate-limit", () => ({
  rateLimit: jest.fn(() => jest.fn()),
  rateLimitConfigs: {
    api: { windowMs: 15 * 60 * 1000, max: 100 },
  },
}));

// Import the route handlers after mocks are set up
import { GET, POST } from "@/app/api/secure/users/route";
import {
  validateRequestBody,
  validateSearchParams,
} from "@/lib/security/validation";

// Get the mocked functions
const mockValidateRequestBody = validateRequestBody as jest.MockedFunction<
  typeof validateRequestBody
>;
const mockValidateSearchParams = validateSearchParams as jest.MockedFunction<
  typeof validateSearchParams
>;

// Helper to create mock request that matches NextRequest interface
const createMockRequest = (url: string, options: RequestInit = {}) => {
  return {
    url,
    method: options.method || "GET",
    headers: new Headers(options.headers),
    json: async () => JSON.parse((options.body as string) || "{}"),
    text: async () => (options.body as string) || "",
    nextUrl: {
      searchParams: new URLSearchParams(),
      pathname: new URL(url).pathname,
    },
    cookies: {
      get: () => undefined,
      getAll: () => [],
      has: () => false,
      set: () => {},
      delete: () => {},
    },
  } as unknown as NextRequest;
};

describe("/api/secure/users", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // Mock search params validation to always succeed
    mockValidateSearchParams.mockReturnValue({
      success: true,
      data: {
        page: 1,
        limit: 10,
        sort: undefined,
        order: "desc",
      },
    });
  });

  describe("GET /api/secure/users", () => {
    it("returns users list", async () => {
      const request = createMockRequest(
        "http://localhost:3000/api/secure/users"
      );
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toHaveProperty("data");
      expect(Array.isArray(data.data)).toBe(true);
      expect(data).toHaveProperty("pagination");
    });

    it("includes pagination metadata", async () => {
      const request = createMockRequest(
        "http://localhost:3000/api/secure/users"
      );
      const response = await GET(request);
      const data = await response.json();

      expect(data).toHaveProperty("pagination");
      expect(data.pagination).toHaveProperty("page");
      expect(data.pagination).toHaveProperty("limit");
      expect(data.pagination).toHaveProperty("total");
    });
  });

  describe("POST /api/secure/users", () => {
    it("creates a user with valid data", async () => {
      // Mock validation to return success
      const mockValidator = jest.fn().mockResolvedValue({
        success: true,
        data: {
          name: "John Doe",
          email: "john@example.com",
          password: "SecurePass123!",
        },
      });
      mockValidateRequestBody.mockReturnValue(mockValidator);

      const request = createMockRequest(
        "http://localhost:3000/api/secure/users",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: "John Doe",
            email: "john@example.com",
            password: "SecurePass123!",
          }),
        }
      );

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data).toHaveProperty("data");
      expect(data.data.name).toBe("John Doe");
      expect(data.data.email).toBe("john@example.com");
    });

    it("returns 400 for invalid data", async () => {
      // Mock validation to return error
      const mockValidator = jest.fn().mockResolvedValue({
        success: false,
        error: {
          message: "Validation failed",
          code: "VALIDATION_ERROR",
          issues: [{ path: ["name"], message: "Name is required" }],
        },
      });
      mockValidateRequestBody.mockReturnValue(mockValidator);

      const request = createMockRequest(
        "http://localhost:3000/api/secure/users",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: "invalid-email",
          }),
        }
      );

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data).toHaveProperty("error");
      expect(data.error.message).toBe("Invalid request data");
    });

    it("handles JSON parsing errors", async () => {
      // Mock validation to return JSON error
      const mockValidator = jest.fn().mockResolvedValue({
        success: false,
        error: {
          message: "Invalid JSON in request body",
          code: "INVALID_JSON",
          issues: [],
        },
      });
      mockValidateRequestBody.mockReturnValue(mockValidator);

      const request = createMockRequest(
        "http://localhost:3000/api/secure/users",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: "invalid json",
        }
      );

      // Override json method to throw an error
      request.json = jest.fn().mockRejectedValue(new Error("Invalid JSON"));

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data).toHaveProperty("error");
      expect(data.error.message).toBe("Invalid request data");
    });
  });
});
