import ServerActionDemo from "@/components/demo/server-action-demo";

export default function ServerActionsPage() {
  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <h1 className="text-3xl font-bold">⚡ Server Action Error Handling</h1>
        <p className="text-muted-foreground text-lg">
          Test server actions with comprehensive error handling, validation, and
          structured responses. See how authentication actions handle different
          scenarios safely and securely.
        </p>
      </div>

      {/* Server Actions Overview */}
      <div className="p-6 border rounded-lg space-y-4">
        <h2 className="text-xl font-semibold">🔧 Server Actions Overview</h2>
        <p className="text-muted-foreground">
          Server Actions are a powerful Next.js feature that allows you to run
          server-side code directly from your components. Our implementation
          includes comprehensive error handling, validation, and security
          measures.
        </p>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-3">
            <h3 className="font-medium">Key Features</h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Type-safe server actions</li>
              <li>• Input validation with Zod</li>
              <li>• Structured error responses</li>
              <li>• Authentication integration</li>
              <li>• CSRF protection</li>
              <li>• Rate limiting</li>
            </ul>
          </div>
          <div className="space-y-3">
            <h3 className="font-medium">Error Handling</h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Validation error formatting</li>
              <li>• Authentication error handling</li>
              <li>• Database error management</li>
              <li>• Network error recovery</li>
              <li>• User-friendly error messages</li>
              <li>• Development error details</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Security Features */}
      <div className="p-6 border rounded-lg space-y-4">
        <h2 className="text-xl font-semibold">🛡️ Security Features</h2>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="p-4 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
            <h3 className="font-medium text-green-800 dark:text-green-200 mb-2">
              Input Validation
            </h3>
            <ul className="text-sm text-green-700 dark:text-green-300 space-y-1">
              <li>• Zod schema validation</li>
              <li>• Type coercion</li>
              <li>• Custom validators</li>
              <li>• Sanitization</li>
            </ul>
          </div>
          <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <h3 className="font-medium text-blue-800 dark:text-blue-200 mb-2">
              Authentication
            </h3>
            <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
              <li>• Session validation</li>
              <li>• Role-based access</li>
              <li>• Token verification</li>
              <li>• Unauthorized handling</li>
            </ul>
          </div>
          <div className="p-4 bg-purple-50 dark:bg-purple-950/20 rounded-lg border border-purple-200 dark:border-purple-800">
            <h3 className="font-medium text-purple-800 dark:text-purple-200 mb-2">
              Protection
            </h3>
            <ul className="text-sm text-purple-700 dark:text-purple-300 space-y-1">
              <li>• CSRF protection</li>
              <li>• Rate limiting</li>
              <li>• Request validation</li>
              <li>• Error masking</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Response Structure */}
      <div className="p-6 border rounded-lg space-y-4">
        <h2 className="text-xl font-semibold">📋 Response Structure</h2>
        <p className="text-muted-foreground mb-4">
          All server actions return a consistent response structure for
          predictable error handling and success scenarios.
        </p>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <h3 className="font-medium mb-2 text-green-600">
              Success Response
            </h3>
            <div className="p-3 bg-muted rounded-lg">
              <code className="text-xs">
                {`{
  "success": true,
  "data": {
    "id": "123",
    "message": "Action completed successfully"
  }
}`}
              </code>
            </div>
          </div>
          <div>
            <h3 className="font-medium mb-2 text-red-600">Error Response</h3>
            <div className="p-3 bg-muted rounded-lg">
              <code className="text-xs">
                {`{
  "success": false,
  "error": {
    "message": "Validation failed",
    "code": "VALIDATION_ERROR",
    "details": ["Email is required"]
  }
}`}
              </code>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Demo */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">🚀 Try Server Actions</h2>
        <p className="text-muted-foreground">
          Test different server action scenarios including validation errors,
          authentication flows, and success cases. See how errors are handled
          and displayed to users.
        </p>
        <ServerActionDemo />
      </div>

      {/* Implementation Examples */}
      <div className="p-6 border rounded-lg space-y-4">
        <h2 className="text-xl font-semibold">💻 Implementation Examples</h2>
        <div className="space-y-4">
          <div>
            <h3 className="font-medium mb-2">Basic Server Action</h3>
            <div className="p-3 bg-muted rounded-lg">
              <code className="text-xs whitespace-pre-wrap">
                {`'use server'

import { z } from 'zod'
import { auth } from '@/lib/auth'

const schema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
})

export async function createUser(formData: FormData) {
  try {
    // Validate session
    const session = await auth()
    if (!session) {
      return { success: false, error: { message: 'Unauthorized' } }
    }

    // Validate input
    const result = schema.safeParse({
      name: formData.get('name'),
      email: formData.get('email'),
    })

    if (!result.success) {
      return {
        success: false,
        error: {
          message: 'Validation failed',
          details: result.error.errors.map(e => e.message)
        }
      }
    }

    // Process the action
    const user = await db.user.create({
      data: result.data
    })

    return { success: true, data: user }
  } catch (error) {
    return {
      success: false,
      error: { message: 'Internal server error' }
    }
  }
}`}
              </code>
            </div>
          </div>
        </div>
      </div>

      {/* Best Practices */}
      <div className="p-6 border rounded-lg space-y-4 bg-yellow-50 dark:bg-yellow-950/20">
        <h2 className="text-xl font-semibold">⭐ Best Practices</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <h3 className="font-medium">Security</h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Always validate user input</li>
              <li>• Check authentication/authorization</li>
              <li>• Sanitize data before database operations</li>
              <li>• Use HTTPS in production</li>
              <li>• Implement rate limiting</li>
            </ul>
          </div>
          <div className="space-y-2">
            <h3 className="font-medium">Error Handling</h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Return consistent response structures</li>
              <li>• Provide meaningful error messages</li>
              <li>• Log errors for debugging</li>
              <li>• Handle edge cases gracefully</li>
              <li>• Test error scenarios</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
