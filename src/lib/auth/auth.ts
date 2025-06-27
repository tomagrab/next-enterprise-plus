// NextAuth.js configuration for stable version (v4)
import type { NextAuthOptions } from "next-auth";
// Uncomment the providers you want to use:
// import GitHubProvider from "next-auth/providers/github"
// import GoogleProvider from "next-auth/providers/google"
// import CredentialsProvider from "next-auth/providers/credentials"
// import MicrosoftEntraID from "next-auth/providers/microsoft-entra-id"

export const authOptions: NextAuthOptions = {
  providers: [
    // Add your authentication providers here
    // Example providers (uncomment and configure as needed):
    // GitHub
    // GitHubProvider({
    //   clientId: process.env.AUTH_GITHUB_ID!,
    //   clientSecret: process.env.AUTH_GITHUB_SECRET!,
    // }),
    // Google
    // GoogleProvider({
    //   clientId: process.env.AUTH_GOOGLE_ID!,
    //   clientSecret: process.env.AUTH_GOOGLE_SECRET!,
    // }),
    // Microsoft Entra ID (formerly Azure AD)
    // Callback URL: [origin]/api/auth/callback/microsoft-entra-id
    // Environment variables needed:
    // - AUTH_MICROSOFT_ENTRA_ID_ID (Application/Client ID)
    // - AUTH_MICROSOFT_ENTRA_ID_SECRET (Client Secret Value)
    // - AUTH_MICROSOFT_ENTRA_ID_ISSUER (Issuer URL based on tenant type)
    // MicrosoftEntraID({
    //   clientId: process.env.AUTH_MICROSOFT_ENTRA_ID_ID!,
    //   clientSecret: process.env.AUTH_MICROSOFT_ENTRA_ID_SECRET!,
    //   issuer: process.env.AUTH_MICROSOFT_ENTRA_ID_ISSUER!,
    // }),
    // Credentials (for custom login)
    // CredentialsProvider({
    //   name: "credentials",
    //   credentials: {
    //     email: { label: "Email", type: "email" },
    //     password: { label: "Password", type: "password" }
    //   },
    //   async authorize(credentials) {
    //     // Add your authentication logic here
    //     // Example: validate credentials against your database
    //     // const user = await validateUser(credentials?.email, credentials?.password)
    //     // if (user) {
    //     //   return { id: user.id, email: user.email, name: user.name }
    //     // }
    //     return null
    //   },
    // }),
  ],
  pages: {
    signIn: "/auth/signin",
    // signOut: '/auth/signout',
    // error: '/auth/error',
  },
  callbacks: {
    async jwt({ token, user }) {
      try {
        if (user) {
          token.id = user.id;
        }
        return token;
      } catch (error) {
        console.error("JWT callback error:", error);
        // Return token without modifications on error
        return token;
      }
    },
    async session({ session, token }) {
      try {
        if (token?.id && session.user) {
          session.user.id = token.id;
        }
        return session;
      } catch (error) {
        console.error("Session callback error:", error);
        // Return session without modifications on error
        return session;
      }
    },
  },
  session: {
    strategy: "jwt",
  },
};

// Note: For NextAuth v4, this configuration is used by:
// - src/app/api/auth/[...nextauth]/route.ts (API routes)
// - src/lib/auth-utils.ts (server-side session utility)
// - Components that need session data import from auth-utils.ts

// Microsoft Entra ID Migration Notice:
// Microsoft has renamed Azure AD to Microsoft Entra ID. This template uses
// the correct provider name (MicrosoftEntraID) and environment variable names.
// If migrating from Azure AD configuration, update your environment variables:
// - AUTH_AZURE_AD_CLIENT_ID → AUTH_MICROSOFT_ENTRA_ID_ID
// - AUTH_AZURE_AD_CLIENT_SECRET → AUTH_MICROSOFT_ENTRA_ID_SECRET
// - AUTH_AZURE_AD_TENANT_ID → Use issuer URL instead (AUTH_MICROSOFT_ENTRA_ID_ISSUER)
