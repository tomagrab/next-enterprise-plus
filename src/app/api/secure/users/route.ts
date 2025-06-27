import { NextRequest, NextResponse } from "next/server";
import { withErrorHandler } from "@/lib/errors/api-errors";
import {
  validateRequestBody,
  schemas,
  validateSearchParams,
} from "@/lib/security/validation";
import { rateLimit, rateLimitConfigs } from "@/lib/security/rate-limit";
import { z } from "zod";

// Create a specific rate limiter for this endpoint
const secureApiRateLimit = rateLimit({
  ...rateLimitConfigs.api,
  maxRequests: 10, // More restrictive
  windowMs: 60 * 1000, // 1 minute window
});

// Define simplified schemas for this API
const createUserSchema = z.object({
  name: schemas.common.name,
  email: schemas.common.email,
  password: schemas.common.password,
});

type User = {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  emailVerified?: boolean;
  updatedAt?: string;
};

async function handleGET(request: NextRequest) {
  // Apply rate limiting
  const rateLimitResult = secureApiRateLimit(request);
  if (rateLimitResult) {
    return rateLimitResult;
  }

  // Validate query parameters
  const { searchParams } = request.nextUrl;
  const validationResult = validateSearchParams(
    schemas.api.pagination,
    searchParams
  );

  if (!validationResult.success) {
    return NextResponse.json(
      {
        error: {
          message: "Invalid query parameters",
          code: "VALIDATION_ERROR",
          statusCode: 400,
          details: validationResult.error.issues,
        },
      },
      { status: 400 }
    );
  }

  const { page = 1, limit = 10, sort, order = "desc" } = validationResult.data;

  // Simulate fetching paginated users
  const users: User[] = Array.from({ length: limit }, (_, i) => ({
    id: `user-${(page - 1) * limit + i + 1}`,
    name: `User ${(page - 1) * limit + i + 1}`,
    email: `user${(page - 1) * limit + i + 1}@example.com`,
    createdAt: new Date(
      Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000
    ).toISOString(),
  }));

  // Sort users if requested
  if (sort === "name") {
    users.sort((a, b) => {
      const comparison = a.name.localeCompare(b.name);
      return order === "desc" ? -comparison : comparison;
    });
  } else if (sort === "createdAt") {
    users.sort((a, b) => {
      const comparison =
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      return order === "desc" ? -comparison : comparison;
    });
  }

  return NextResponse.json({
    data: users,
    pagination: {
      page,
      limit,
      total: 1000, // Simulated total
      totalPages: Math.ceil(1000 / limit),
    },
    meta: {
      sort,
      order,
      requestId: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
    },
  });
}

async function handlePOST(request: NextRequest) {
  // Apply rate limiting
  const rateLimitResult = secureApiRateLimit(request);
  if (rateLimitResult) {
    return rateLimitResult;
  }

  // Validate request body
  const validation = await validateRequestBody(createUserSchema)(request);

  if (!validation.success) {
    return NextResponse.json(
      {
        error: {
          message: "Invalid request data",
          code: "VALIDATION_ERROR",
          statusCode: 400,
          details: validation.error.issues,
        },
      },
      { status: 400 }
    );
  }

  const userData = validation.data as z.infer<typeof createUserSchema>;
  const { name, email } = userData;
  // Note: In production, password would be hashed before storage

  // In a real application, you would:
  // 1. Hash the password
  // 2. Check if email already exists
  // 3. Save to database
  // 4. Send verification email

  // Simulate user creation
  const newUser: User = {
    id: `user-${Date.now()}`,
    name,
    email,
    createdAt: new Date().toISOString(),
    emailVerified: false,
  };

  // Simulate some processing time
  await new Promise((resolve) => setTimeout(resolve, 100));

  return NextResponse.json(
    {
      data: newUser,
      message: "User created successfully",
      meta: {
        requestId: crypto.randomUUID(),
        timestamp: new Date().toISOString(),
      },
    },
    { status: 201 }
  );
}

async function handlePUT(request: NextRequest) {
  // Apply rate limiting
  const rateLimitResult = secureApiRateLimit(request);
  if (rateLimitResult) {
    return rateLimitResult;
  }

  // Validate request body for updates
  const updateSchema = z.object({
    id: schemas.common.uuid,
    name: schemas.common.name.optional(),
    email: schemas.common.email.optional(),
    phone: schemas.common.phone.optional(),
    bio: schemas.common.text(0, 500).optional(),
  });

  const validation = await validateRequestBody(updateSchema)(request);

  if (!validation.success) {
    return NextResponse.json(
      {
        error: {
          message: "Invalid update data",
          code: "VALIDATION_ERROR",
          statusCode: 400,
          details: validation.error.issues,
        },
      },
      { status: 400 }
    );
  }

  const updateData = validation.data as z.infer<typeof updateSchema>;
  const { id, ...fields } = updateData;

  // Simulate user update
  const updatedUser: Partial<User> = {
    id,
    ...fields,
    updatedAt: new Date().toISOString(),
  };

  return NextResponse.json({
    data: updatedUser,
    message: "User updated successfully",
    meta: {
      requestId: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
    },
  });
}

async function handleDELETE(request: NextRequest) {
  // Apply rate limiting with more restrictive limits for delete operations
  const deleteRateLimit = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    maxRequests: 5, // Only 5 deletes per hour
    message: "Too many delete requests, please try again later",
  });

  const rateLimitResult = deleteRateLimit(request);
  if (rateLimitResult) {
    return rateLimitResult;
  }

  // Get user ID from query parameters
  const { searchParams } = request.nextUrl;
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json(
      {
        error: {
          message: "User ID is required",
          code: "MISSING_PARAMETER",
          statusCode: 400,
        },
      },
      { status: 400 }
    );
  }

  // Validate ID format
  const idValidation = await import("@/lib/security/validation").then((mod) =>
    mod.validateData(schemas.common.uuid, id)
  );

  if (!idValidation.success) {
    return NextResponse.json(
      {
        error: {
          message: "Invalid user ID format",
          code: "VALIDATION_ERROR",
          statusCode: 400,
          details: idValidation.error.issues,
        },
      },
      { status: 400 }
    );
  }

  // Simulate user deletion
  return NextResponse.json({
    message: `User ${id} deleted successfully`,
    meta: {
      requestId: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
    },
  });
}

// Export handlers with error handling
export const GET = withErrorHandler(handleGET);
export const POST = withErrorHandler(handlePOST);
export const PUT = withErrorHandler(handlePUT);
export const DELETE = withErrorHandler(handleDELETE);
