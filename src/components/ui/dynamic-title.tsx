"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

const pageTitles: Record<string, string> = {
  "/": "Home",
  "/getting-started": "Getting Started",
  "/auth-setup": "Authentication Setup",
  "/overflow-demo": "Overflow Demo",
  "/error-testing": "Error Testing",
  "/server-actions": "Server Actions",
  "/security-testing": "Security Testing",
  // Legacy pages (can be removed when cleaning up)
  "/search": "Search",
  "/notifications": "Notifications",
  "/profile": "Profile",
  "/settings": "Settings",
  "/documents": "Documents",
  "/analytics": "Analytics",
  "/calendar": "Calendar",
  "/messages": "Messages",
  "/projects": "Projects",
  "/help": "Help",
};

function generateBreadcrumbs(pathname: string) {
  // Split the pathname into segments
  const segments = pathname.split("/").filter(Boolean);

  // Always start with home
  const breadcrumbs = ["/"];

  // Build the breadcrumb paths
  let currentPath = "";
  segments.forEach((segment) => {
    currentPath += `/${segment}`;
    breadcrumbs.push(currentPath);
  });

  return breadcrumbs;
}

export function DynamicTitle() {
  const pathname = usePathname();
  const breadcrumbs = generateBreadcrumbs(pathname);

  // If only home page, show simple title
  if (breadcrumbs.length === 1) {
    return <span className="font-semibold text-lg">Home</span>;
  }

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {breadcrumbs.map((path, index) => {
          const isLast = index === breadcrumbs.length - 1;
          const title = pageTitles[path] || path.split("/").pop() || "Home";

          return (
            <div key={path} className="flex items-center">
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage className="font-semibold">
                    {title}
                  </BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link href={path} className="hover:text-foreground">
                      {title}
                    </Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
              {!isLast && <BreadcrumbSeparator />}
            </div>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
