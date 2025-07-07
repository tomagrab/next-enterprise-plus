import { NextRequest } from "next/server";
import { withErrorHandler, errors } from "@/lib/errors/api-errors";
import { getSession } from "@/lib/utilities/auth/auth-utils";
import { z } from "zod";

// Example API route demonstrating error handling patterns
const getUserSchema = z.object({
  id: z.string().min(1, "User ID is required"),
});

async function getUser(request: NextRequest) {
  // Authentication check
  const session = await getSession();
  if (!session?.user) {
    throw errors.unauthorized();
  }

  // Parse and validate URL parameters
  const url = new URL(request.url);
  const id = url.searchParams.get("id");
  
  const validatedData = getUserSchema.parse({ id });

  // Simulate database operation that might fail
  if (validatedData.id === "404") {
    throw errors.notFound("User");
  }

  if (validatedData.id === "403") {
    throw errors.forbidden("You cannot access this user's data");
  }

  if (validatedData.id === "500") {
    throw errors.internal("Database connection failed");
  }

  // Simulate successful response
  return Response.json({
    user: {
      id: validatedData.id,
      name: "John Doe",
      email: "john@example.com",
    },
  });
}

// Export with error handling wrapper
export const GET = withErrorHandler(getUser);
