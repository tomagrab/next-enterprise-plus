"use client";

import {
  Home,
  Rocket,
  KeyRound,
  TestTube,
  MoreHorizontal,
  ScrollText,
  Zap,
  ShieldCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const navItems = [
  {
    icon: Rocket,
    href: "/getting-started",
  },
  {
    icon: KeyRound,
    href: "/auth-setup",
  },
  {
    icon: Home,
    href: "/",
    isMain: true,
  },
  {
    icon: TestTube,
    href: "/error-testing",
  },
  {
    icon: MoreHorizontal,
    href: "#",
    isMore: true,
  },
];

const morePages = [
  { name: "Overflow Demo", href: "/overflow-demo", icon: ScrollText },
  { name: "Server Actions", href: "/server-actions", icon: Zap },
  { name: "Security Testing", href: "/security-testing", icon: ShieldCheck },
];

export function MobileNav() {
  const pathname = usePathname();
  const [isMoreOpen, setIsMoreOpen] = useState(false);

  return (
    <nav className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-t border-border">
      <div className="flex items-center justify-around py-2 px-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          if (item.isMore) {
            return (
              <Sheet key="more" open={isMoreOpen} onOpenChange={setIsMoreOpen}>
                <SheetTrigger asChild>
                  <button
                    className={cn(
                      "flex flex-col items-center justify-center p-2 rounded-lg transition-all duration-200 min-w-0 flex-1 relative",
                      "text-muted-foreground hover:text-foreground hover:bg-accent"
                    )}
                  >
                    <Icon className="h-4 w-4 mb-1" />
                  </button>
                </SheetTrigger>
                <SheetContent side="bottom" className="h-auto max-h-[80vh]">
                  <SheetHeader className="text-center pb-6">
                    <div className="w-10 h-1 bg-muted rounded-full mx-auto mb-4" />
                    <SheetTitle className="text-xl font-semibold">
                      More Pages
                    </SheetTitle>
                  </SheetHeader>
                  <div className="grid gap-2 pb-6">
                    {morePages.map((page) => {
                      const PageIcon = page.icon;
                      return (
                        <Link
                          key={page.href}
                          href={page.href}
                          onClick={() => setIsMoreOpen(false)}
                          className={cn(
                            "flex items-center gap-4 p-4 rounded-xl transition-all duration-200 group",
                            pathname === page.href
                              ? "bg-primary text-primary-foreground shadow-lg scale-[0.98]"
                              : "hover:bg-accent/50 active:bg-accent active:scale-[0.98]"
                          )}
                        >
                          <div
                            className={cn(
                              "w-10 h-10 rounded-lg flex items-center justify-center transition-colors",
                              pathname === page.href
                                ? "bg-primary-foreground/20"
                                : "bg-muted group-hover:bg-muted-foreground/10"
                            )}
                          >
                            <PageIcon
                              className={cn(
                                "w-5 h-5 transition-colors",
                                pathname === page.href
                                  ? "text-primary-foreground"
                                  : "text-muted-foreground group-hover:text-foreground"
                              )}
                            />
                          </div>
                          <div className="flex-1">
                            <span className="font-medium text-base">
                              {page.name}
                            </span>
                          </div>
                          {pathname === page.href && (
                            <div className="w-2 h-2 bg-primary-foreground rounded-full" />
                          )}
                        </Link>
                      );
                    })}
                  </div>
                </SheetContent>
              </Sheet>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center p-2 rounded-lg transition-all duration-200 min-w-0 flex-1 relative",
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent",
                item.isMain && "scale-110"
              )}
            >
              {item.isMain ? (
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center shadow-lg">
                  <Icon className="h-6 w-6 text-primary-foreground" />
                </div>
              ) : (
                <Icon className="h-4 w-4 mb-1" />
              )}

              {isActive && !item.isMain && (
                <div className="absolute -top-1 w-1 h-1 bg-primary rounded-full" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
