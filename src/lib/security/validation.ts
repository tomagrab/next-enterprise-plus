import { z } from "zod";
import { NextRequest } from "next/server";

// Common validation patterns
export const commonSchemas = {
  email: z.string().email("Invalid email address").max(254),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(128, "Password must not exceed 128 characters")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Password must contain at least one lowercase letter, one uppercase letter, and one number"
    ),
  name: z
    .string()
    .min(1, "Name is required")
    .max(100, "Name must not exceed 100 characters")
    .regex(
      /^[a-zA-Z\s'-]+$/,
      "Name can only contain letters, spaces, hyphens, and apostrophes"
    ),
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(30, "Username must not exceed 30 characters")
    .regex(
      /^[a-zA-Z0-9_-]+$/,
      "Username can only contain letters, numbers, underscores, and hyphens"
    ),
  url: z.string().url("Invalid URL format").max(2048),
  phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number format"),
  uuid: z.string().uuid("Invalid UUID format"),
  slug: z
    .string()
    .min(1, "Slug is required")
    .max(100, "Slug must not exceed 100 characters")
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Slug must be lowercase letters, numbers, and hyphens only"
    ),
  text: (minLength = 1, maxLength = 1000) =>
    z
      .string()
      .min(minLength, `Text must be at least ${minLength} characters`)
      .max(maxLength, `Text must not exceed ${maxLength} characters`),
  positiveInt: z.number().int().positive("Must be a positive integer"),
  nonNegativeInt: z.number().int().min(0, "Must be non-negative"),
};

// Authentication schemas
export const authSchemas = {
  signIn: z.object({
    email: commonSchemas.email,
    password: z.string().min(1, "Password is required"),
    remember: z.boolean().optional(),
  }),

  signUp: z
    .object({
      name: commonSchemas.name,
      email: commonSchemas.email,
      password: commonSchemas.password,
      confirmPassword: z.string(),
      terms: z
        .boolean()
        .refine((val) => val === true, "You must accept the terms of service"),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: "Passwords do not match",
      path: ["confirmPassword"],
    }),

  resetPassword: z.object({
    email: commonSchemas.email,
  }),

  changePassword: z
    .object({
      currentPassword: z.string().min(1, "Current password is required"),
      newPassword: commonSchemas.password,
      confirmPassword: z.string(),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
      message: "Passwords do not match",
      path: ["confirmPassword"],
    }),

  updateProfile: z.object({
    name: commonSchemas.name.optional(),
    email: commonSchemas.email.optional(),
    phone: commonSchemas.phone.optional(),
    bio: commonSchemas.text(0, 500).optional(),
  }),
};

// API request schemas
export const apiSchemas = {
  pagination: z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(10),
    sort: z.string().optional(),
    order: z.enum(["asc", "desc"]).default("desc"),
  }),

  search: z.object({
    q: z.string().min(1, "Search query is required").max(100),
    filters: z.record(z.string()).optional(),
  }),

  bulkOperation: z.object({
    ids: z
      .array(commonSchemas.uuid)
      .min(1, "At least one ID is required")
      .max(100, "Maximum 100 items allowed"),
    action: z.enum(["delete", "update", "archive"]),
  }),
};

// File upload schemas
export const fileSchemas = {
  image: z.object({
    file: z
      .instanceof(File)
      .refine(
        (file) => file.size <= 5 * 1024 * 1024,
        "File size must be less than 5MB"
      )
      .refine(
        (file) =>
          ["image/jpeg", "image/png", "image/webp", "image/gif"].includes(
            file.type
          ),
        "File must be a valid image (JPEG, PNG, WebP, or GIF)"
      ),
    alt: z
      .string()
      .max(200, "Alt text must not exceed 200 characters")
      .optional(),
  }),

  document: z.object({
    file: z
      .instanceof(File)
      .refine(
        (file) => file.size <= 10 * 1024 * 1024,
        "File size must be less than 10MB"
      )
      .refine(
        (file) =>
          [
            "application/pdf",
            "application/msword",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          ].includes(file.type),
        "File must be a valid document (PDF, DOC, or DOCX)"
      ),
    title: z.string().min(1, "Title is required").max(100),
    description: commonSchemas.text(0, 500).optional(),
  }),
};

// Content schemas
export const contentSchemas = {
  post: z.object({
    title: z.string().min(1, "Title is required").max(200),
    content: z.string().min(1, "Content is required").max(10000),
    excerpt: z.string().max(500).optional(),
    slug: commonSchemas.slug,
    tags: z
      .array(z.string().max(50))
      .max(10, "Maximum 10 tags allowed")
      .optional(),
    published: z.boolean().default(false),
    publishedAt: z.date().optional(),
  }),

  comment: z.object({
    content: z.string().min(1, "Comment cannot be empty").max(1000),
    postId: commonSchemas.uuid,
    parentId: commonSchemas.uuid.optional(),
  }),
};

// Validation result types
export type ValidationResult<T> =
  | {
      success: true;
      data: T;
    }
  | {
      success: false;
      error: {
        message: string;
        code: string;
        issues: Array<{
          path: string[];
          message: string;
        }>;
      };
    };

// Generic validation function
export function validateData<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): ValidationResult<T> {
  try {
    const result = schema.parse(data);
    return { success: true, data: result };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: {
          message: "Validation failed",
          code: "VALIDATION_ERROR",
          issues: error.errors.map((issue) => ({
            path: issue.path.map(String),
            message: issue.message,
          })),
        },
      };
    }

    return {
      success: false,
      error: {
        message: "Unknown validation error",
        code: "VALIDATION_ERROR",
        issues: [],
      },
    };
  }
}

// Request body validation middleware
export function validateRequestBody<T>(schema: z.ZodSchema<T>) {
  return async (request: NextRequest): Promise<ValidationResult<T>> => {
    try {
      const body = await request.json();
      return validateData(schema, body);
    } catch {
      return {
        success: false,
        error: {
          message: "Invalid JSON in request body",
          code: "INVALID_JSON",
          issues: [],
        },
      };
    }
  };
}

// Query parameters validation
export function validateSearchParams<T>(
  schema: z.ZodSchema<T>,
  searchParams: URLSearchParams
): ValidationResult<T> {
  const params: Record<string, string | string[]> = {};

  for (const [key, value] of searchParams.entries()) {
    if (params[key]) {
      // Handle multiple values for same key
      if (Array.isArray(params[key])) {
        (params[key] as string[]).push(value);
      } else {
        params[key] = [params[key] as string, value];
      }
    } else {
      params[key] = value;
    }
  }

  return validateData(schema, params);
}

// Form data validation
export function validateFormData<T>(
  schema: z.ZodSchema<T>,
  formData: FormData
): ValidationResult<T> {
  const data: Record<string, unknown> = {};

  for (const [key, value] of formData.entries()) {
    if (data[key]) {
      // Handle multiple values for same key
      if (Array.isArray(data[key])) {
        (data[key] as unknown[]).push(value);
      } else {
        data[key] = [data[key], value];
      }
    } else {
      data[key] = value;
    }
  }

  return validateData(schema, data);
}

// Sanitization helpers
export const sanitizers = {
  // Remove HTML tags and encode special characters
  text: (input: string): string => {
    return input
      .replace(/<[^>]*>/g, "") // Remove HTML tags
      .replace(/[<>&"']/g, (char) => {
        const entities: Record<string, string> = {
          "<": "&lt;",
          ">": "&gt;",
          "&": "&amp;",
          '"': "&quot;",
          "'": "&#x27;",
        };
        return entities[char] || char;
      })
      .trim();
  },

  // Sanitize for SQL-like queries (basic protection)
  sql: (input: string): string => {
    return input.replace(/['";\\]/g, "");
  },

  // Sanitize file names
  filename: (input: string): string => {
    return input
      .replace(/[^a-zA-Z0-9.-]/g, "_")
      .replace(/_{2,}/g, "_")
      .replace(/^_+|_+$/g, "");
  },
};

// Export schemas grouped by category
export const schemas = {
  common: commonSchemas,
  auth: authSchemas,
  api: apiSchemas,
  file: fileSchemas,
  content: contentSchemas,
};
