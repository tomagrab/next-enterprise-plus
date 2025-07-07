import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers/providers";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/ui/app-sidebar";
import { MobileNav } from "@/components/ui/mobile-nav";
import { DesktopHeader, MobileHeader } from "@/components/ui/header";
import { cookies } from "next/headers";
import { ErrorBoundary } from "@/components/error/error-boundary";
import Footer from "@/components/ui/footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Next Enterprise Plus",
  description:
    "A modern Next.js template project designed for enterprise applications, featuring a responsive layout, authentication, and professional UI components.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true";

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          <ErrorBoundary>
            {/* Desktop Layout */}
            <div className="hidden md:flex h-screen">
              <SidebarProvider defaultOpen={defaultOpen}>
                <AppSidebar />
                <SidebarInset className="flex flex-col">
                  <DesktopHeader />
                  <main className="flex-1 overflow-y-auto">{children}</main>
                  <Footer />
                </SidebarInset>
              </SidebarProvider>
            </div>

            {/* Mobile Layout */}
            <div className="md:hidden flex flex-col h-screen">
              <MobileHeader />
              <main className="flex-1 overflow-y-auto">{children}</main>
              <MobileNav />
            </div>
          </ErrorBoundary>
        </Providers>
      </body>
    </html>
  );
}
