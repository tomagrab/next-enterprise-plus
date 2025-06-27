import { signIn } from "@/lib/server/actions/auth/auth-actions";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Github, Mail, Key, Building } from "lucide-react";
import Link from "next/link";

export default function SignIn() {
  return (
    <div className="flex-1 flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Sign In</CardTitle>
          <CardDescription>
            Choose your authentication provider to sign in to the application
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* GitHub Provider Example */}
          <form
            action={async () => {
              "use server";
              await signIn("github");
            }}
          >
            <Button type="submit" variant="outline" className="w-full" disabled>
              <Github className="w-4 h-4 mr-2" />
              Continue with GitHub
              <span className="ml-auto text-xs text-muted-foreground">
                (Configure)
              </span>
            </Button>
          </form>

          {/* Google Provider Example */}
          <form
            action={async () => {
              "use server";
              await signIn("google");
            }}
          >
            <Button type="submit" variant="outline" className="w-full" disabled>
              <Mail className="w-4 h-4 mr-2" />
              Continue with Google
              <span className="ml-auto text-xs text-muted-foreground">
                (Configure)
              </span>
            </Button>
          </form>

          {/* Microsoft Entra ID Provider Example */}
          <form
            action={async () => {
              "use server";
              await signIn("microsoft-entra-id");
            }}
          >
            <Button type="submit" variant="outline" className="w-full" disabled>
              <Building className="w-4 h-4 mr-2" />
              Continue with Microsoft
              <span className="ml-auto text-xs text-muted-foreground">
                (Configure)
              </span>
            </Button>
          </form>

          {/* Credentials Provider Example */}
          <form
            action={async () => {
              "use server";
              await signIn("credentials");
            }}
          >
            <Button type="submit" variant="outline" className="w-full" disabled>
              <Key className="w-4 h-4 mr-2" />
              Continue with Email
              <span className="ml-auto text-xs text-muted-foreground">
                (Configure)
              </span>
            </Button>
          </form>

          <div className="mt-6 p-4 bg-muted rounded-lg">
            <h3 className="font-medium text-sm mb-2">🔧 Setup Required</h3>
            <p className="text-xs text-muted-foreground mb-3">
              Authentication providers are ready to configure. Follow these
              steps:
            </p>
            <ol className="text-xs text-muted-foreground space-y-1">
              <li>
                1. Uncomment desired providers in <code>auth.ts</code>
              </li>
              <li>
                2. Add environment variables to <code>.env.local</code>
              </li>
              <li>3. Configure OAuth apps with your providers</li>
              <li>
                4. Remove the <code>disabled</code> prop from buttons above
              </li>
            </ol>
          </div>

          <div className="text-center">
            <Link
              href="/"
              className="text-sm text-muted-foreground hover:text-foreground underline-offset-4 hover:underline"
            >
              ← Back to Home
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
