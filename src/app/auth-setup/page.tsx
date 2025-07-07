import Link from "next/link";

export default function AuthSetupPage() {
  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <h1 className="text-3xl font-bold">🔐 Authentication Setup</h1>
        <p className="text-muted-foreground text-lg">
          NextAuth.js v4 (stable) is fully configured with proper TypeScript
          types and ready for your authentication providers. The authentication
          UI is seamlessly integrated into the sidebar, providing a clean and
          intuitive user experience across desktop and mobile.
        </p>
      </div>

      {/* Provider Support */}
      <div className="p-6 border rounded-lg space-y-4">
        <h2 className="text-xl font-semibold">Supported Providers</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div className="p-4 bg-muted rounded-lg text-center">
            <div className="text-2xl mb-2">🐙</div>
            <h3 className="font-medium">GitHub</h3>
            <p className="text-sm text-muted-foreground">OAuth integration</p>
          </div>
          <div className="p-4 bg-muted rounded-lg text-center">
            <div className="text-2xl mb-2">🌐</div>
            <h3 className="font-medium">Google</h3>
            <p className="text-sm text-muted-foreground">OAuth 2.0</p>
          </div>
          <div className="p-4 bg-muted rounded-lg text-center">
            <div className="text-2xl mb-2">🏢</div>
            <h3 className="font-medium">Microsoft Entra ID</h3>
            <p className="text-sm text-muted-foreground">Formerly Azure AD</p>
          </div>
          <div className="p-4 bg-muted rounded-lg text-center">
            <div className="text-2xl mb-2">🔑</div>
            <h3 className="font-medium">Credentials</h3>
            <p className="text-sm text-muted-foreground">Custom login</p>
          </div>
        </div>
      </div>

      {/* Quick Start Guide */}
      <div className="grid gap-6 md:grid-cols-2">
        <div className="p-6 border rounded-lg space-y-4">
          <h2 className="text-xl font-semibold">Quick Start</h2>
          <ol className="space-y-3 text-sm">
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold">
                1
              </span>
              <div>
                <div className="font-medium">Copy environment file</div>
                <code className="text-xs bg-muted px-2 py-1 rounded">
                  cp .env.example .env.local
                </code>
              </div>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold">
                2
              </span>
              <div>
                <div className="font-medium">Generate auth secret</div>
                <code className="text-xs bg-muted px-2 py-1 rounded">
                  npx auth secret
                </code>
              </div>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold">
                3
              </span>
              <div>
                <div className="font-medium">Configure OAuth providers</div>
                <p className="text-muted-foreground">
                  Add your client IDs and secrets to .env.local
                </p>
              </div>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold">
                4
              </span>
              <div>
                <div className="font-medium">Uncomment providers</div>
                <p className="text-muted-foreground">
                  Enable providers in{" "}
                  <code className="bg-muted px-1 py-0.5 rounded">auth.ts</code>
                </p>
              </div>
            </li>
          </ol>
        </div>

        <div className="p-6 border rounded-lg space-y-4">
          <h2 className="text-xl font-semibold">Features Included</h2>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              Custom sign-in page
            </li>
            <li className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              Sidebar-integrated user menu
            </li>
            <li className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              Avatar and profile display
            </li>
            <li className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              Session persistence
            </li>
            <li className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              Secure server actions
            </li>
            <li className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              TypeScript-first approach
            </li>
          </ul>
        </div>
      </div>

      {/* Microsoft Entra ID Setup */}
      <div className="p-6 border rounded-lg space-y-4">
        <h2 className="text-xl font-semibold">🏢 Microsoft Entra ID Setup</h2>
        <p className="text-muted-foreground">
          Microsoft has renamed Azure AD to Microsoft Entra ID. Our template is
          configured with the latest provider and naming conventions.
        </p>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-3">
            <h3 className="font-medium">Environment Variables</h3>
            <div className="p-3 bg-muted rounded-lg">
              <code className="text-xs">
                AZURE_AD_CLIENT_ID=your_client_id
                <br />
                AZURE_AD_CLIENT_SECRET=your_client_secret
                <br />
                AZURE_AD_TENANT_ID=your_tenant_id
              </code>
            </div>
          </div>
          <div className="space-y-3">
            <h3 className="font-medium">Setup Steps</h3>
            <ol className="text-sm text-muted-foreground space-y-1">
              <li>1. Go to Azure Portal → App registrations</li>
              <li>2. Create new registration</li>
              <li>3. Add redirect URI: /api/auth/callback/azure-ad</li>
              <li>4. Generate client secret</li>
              <li>5. Copy IDs to .env.local</li>
            </ol>
          </div>
        </div>
        <div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
          <p className="text-sm text-blue-800 dark:text-blue-200">
            <strong>Note:</strong> The template uses the correct provider name{" "}
            <code className="mx-1 px-1 bg-blue-100 dark:bg-blue-900 rounded">
              MicrosoftEntraID
            </code>{" "}
            and environment variables. Older Azure AD configurations need to be
            updated.
          </p>
        </div>
      </div>

      {/* Action */}
      <div className="text-center p-6 border rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Ready to Test?</h2>
        <p className="text-muted-foreground mb-4">
          Once you&apos;ve configured your providers, test the authentication
          flow.
        </p>
        <Link
          href="/auth/signin"
          className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
        >
          → View Sign-In Page
        </Link>
      </div>
    </div>
  );
}
