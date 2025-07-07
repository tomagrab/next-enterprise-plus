import { SecurityDemo } from "@/components/demo/security-demo";

export default function SecurityTestingPage() {
  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <h1 className="text-3xl font-bold">🛡️ Security & Compliance Testing</h1>
        <p className="text-muted-foreground text-lg">
          Test the comprehensive security layer including input validation with
          Zod, rate limiting, CSRF protection, and security headers. All
          features are production-ready and follow security best practices.
        </p>
      </div>

      {/* Security Overview */}
      <div className="p-6 border rounded-lg space-y-4">
        <h2 className="text-xl font-semibold">🔒 Security Features</h2>
        <p className="text-muted-foreground">
          Our security implementation provides multiple layers of protection
          against common web vulnerabilities and attacks.
        </p>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/30 dark:to-blue-900/30 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="text-2xl mb-2">🔍</div>
            <h3 className="font-medium text-blue-800 dark:text-blue-200 mb-2">
              Input Validation
            </h3>
            <p className="text-sm text-blue-700 dark:text-blue-300">
              Zod schema validation for all user inputs
            </p>
          </div>
          <div className="p-4 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/30 dark:to-green-900/30 rounded-lg border border-green-200 dark:border-green-800">
            <div className="text-2xl mb-2">⚡</div>
            <h3 className="font-medium text-green-800 dark:text-green-200 mb-2">
              Rate Limiting
            </h3>
            <p className="text-sm text-green-700 dark:text-green-300">
              In-memory rate limiting with configurable rules
            </p>
          </div>
          <div className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/30 dark:to-purple-900/30 rounded-lg border border-purple-200 dark:border-purple-800">
            <div className="text-2xl mb-2">🛡️</div>
            <h3 className="font-medium text-purple-800 dark:text-purple-200 mb-2">
              CSRF Protection
            </h3>
            <p className="text-sm text-purple-700 dark:text-purple-300">
              Built-in CSRF token validation
            </p>
          </div>
          <div className="p-4 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950/30 dark:to-orange-900/30 rounded-lg border border-orange-200 dark:border-orange-800">
            <div className="text-2xl mb-2">🔧</div>
            <h3 className="font-medium text-orange-800 dark:text-orange-200 mb-2">
              Security Headers
            </h3>
            <p className="text-sm text-orange-700 dark:text-orange-300">
              Comprehensive security header configuration
            </p>
          </div>
        </div>
      </div>

      {/* Compliance Standards */}
      <div className="p-6 border rounded-lg space-y-4">
        <h2 className="text-xl font-semibold">📋 Compliance Standards</h2>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="p-4 bg-muted rounded-lg">
            <h3 className="font-medium mb-2">OWASP Top 10</h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Injection prevention</li>
              <li>• Broken authentication protection</li>
              <li>• Sensitive data exposure prevention</li>
              <li>• Security misconfiguration fixes</li>
            </ul>
          </div>
          <div className="p-4 bg-muted rounded-lg">
            <h3 className="font-medium mb-2">GDPR Ready</h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Data processing transparency</li>
              <li>• User consent management</li>
              <li>• Right to erasure support</li>
              <li>• Privacy by design</li>
            </ul>
          </div>
          <div className="p-4 bg-muted rounded-lg">
            <h3 className="font-medium mb-2">SOC 2 Aligned</h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Security controls</li>
              <li>• Availability measures</li>
              <li>• Processing integrity</li>
              <li>• Confidentiality protection</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Security Headers */}
      <div className="p-6 border rounded-lg space-y-4">
        <h2 className="text-xl font-semibold">🔧 Security Headers</h2>
        <p className="text-muted-foreground mb-4">
          Comprehensive security header configuration protects against various
          attack vectors and improves overall security posture.
        </p>
        <div className="grid gap-3 md:grid-cols-2">
          <div className="p-3 bg-muted rounded-lg">
            <h4 className="font-medium text-sm mb-1">
              Content-Security-Policy
            </h4>
            <p className="text-xs text-muted-foreground">
              Prevents XSS attacks by controlling resource loading
            </p>
          </div>
          <div className="p-3 bg-muted rounded-lg">
            <h4 className="font-medium text-sm mb-1">X-Frame-Options</h4>
            <p className="text-xs text-muted-foreground">
              Prevents clickjacking attacks
            </p>
          </div>
          <div className="p-3 bg-muted rounded-lg">
            <h4 className="font-medium text-sm mb-1">X-Content-Type-Options</h4>
            <p className="text-xs text-muted-foreground">
              Prevents MIME type sniffing
            </p>
          </div>
          <div className="p-3 bg-muted rounded-lg">
            <h4 className="font-medium text-sm mb-1">
              Strict-Transport-Security
            </h4>
            <p className="text-xs text-muted-foreground">
              Enforces HTTPS connections
            </p>
          </div>
        </div>
      </div>

      {/* Interactive Security Testing */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">
          🚀 Interactive Security Testing
        </h2>
        <p className="text-muted-foreground">
          Use the interactive demo below to test various security features. Try
          different inputs, test rate limiting, and examine security headers.
        </p>
        <SecurityDemo />
      </div>

      {/* Vulnerability Prevention */}
      <div className="p-6 border rounded-lg space-y-4">
        <h2 className="text-xl font-semibold">🚨 Vulnerability Prevention</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-3">
            <h3 className="font-medium text-red-600">
              Common Threats Prevented
            </h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Cross-Site Scripting (XSS)</li>
              <li>• Cross-Site Request Forgery (CSRF)</li>
              <li>• SQL Injection</li>
              <li>• Clickjacking</li>
              <li>• MIME type confusion</li>
              <li>• Man-in-the-middle attacks</li>
            </ul>
          </div>
          <div className="space-y-3">
            <h3 className="font-medium text-green-600">
              Protection Mechanisms
            </h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Input sanitization and validation</li>
              <li>• CSRF token verification</li>
              <li>• Parameterized queries</li>
              <li>• Frame origin restrictions</li>
              <li>• Content type enforcement</li>
              <li>• HTTPS enforcement</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Security Checklist */}
      <div className="p-6 border rounded-lg space-y-4 bg-green-50 dark:bg-green-950/20">
        <h2 className="text-xl font-semibold">✅ Security Checklist</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <h3 className="font-medium">Development</h3>
            <ul className="text-sm space-y-1">
              <li className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-500 rounded-full flex-shrink-0"></div>
                Input validation implemented
              </li>
              <li className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-500 rounded-full flex-shrink-0"></div>
                CSRF protection enabled
              </li>
              <li className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-500 rounded-full flex-shrink-0"></div>
                Rate limiting configured
              </li>
              <li className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-500 rounded-full flex-shrink-0"></div>
                Security headers set
              </li>
            </ul>
          </div>
          <div className="space-y-2">
            <h3 className="font-medium">Production</h3>
            <ul className="text-sm space-y-1">
              <li className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-500 rounded-full flex-shrink-0"></div>
                HTTPS enforced
              </li>
              <li className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-500 rounded-full flex-shrink-0"></div>
                Environment variables secured
              </li>
              <li className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-500 rounded-full flex-shrink-0"></div>
                Error messages sanitized
              </li>
              <li className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-500 rounded-full flex-shrink-0"></div>
                Security monitoring enabled
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
