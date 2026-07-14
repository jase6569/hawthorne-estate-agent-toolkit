"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ArrowLeftRight,
  Calculator,
  Gauge,
  LayoutDashboard,
  Menu,
  QrCode,
  Search,
  Settings2,
  Sparkles,
  StickyNote,
  Users,
  FileText,
  Building2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ThemeToggle } from "@/components/theme-toggle";
import { cn } from "@/lib/utils";

const navigation = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/health-score", label: "Property Health", icon: Gauge },
  { href: "/dashboard/feedback", label: "Viewing Feedback", icon: Users },
  { href: "/dashboard/commission", label: "Commission", icon: Calculator },
  { href: "/dashboard/qr", label: "QR Generator", icon: QrCode },
  { href: "/dashboard/checklist", label: "Checklist", icon: StickyNote },
  { href: "/dashboard/vendor-report", label: "Vendor Report", icon: FileText },
  { href: "/dashboard/search", label: "Global Search", icon: Search },
  { href: "/profile", label: "Profile", icon: Building2 },
  { href: "/settings", label: "Settings", icon: Settings2 },
];

type AppShellProps = {
  userName: string;
  userEmail: string;
  children: React.ReactNode;
};

export function AppShell({ userName, userEmail, children }: AppShellProps) {
  const pathname = usePathname();
  const [navOpen, setNavOpen] = useState(false);

  useEffect(() => {
    setNavOpen(false);
  }, [pathname]);

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(201,162,39,0.08),transparent_30%),linear-gradient(to_bottom_right,rgba(255,255,255,0.02),transparent)]">
      <div className="mx-auto flex min-h-screen w-full max-w-[1600px] gap-6 px-4 py-4 lg:px-6">
        <aside className="hidden w-72 shrink-0 lg:flex lg:flex-col">
          <div className="glass-panel sticky top-4 flex h-[calc(100vh-2rem)] flex-col rounded-[1.75rem] border border-border/70 p-5 shadow-soft">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gold text-sm font-black text-gold-foreground shadow-soft">
                H
              </div>
              <div>
                <p className="font-bricolage text-lg font-semibold tracking-tight">Hawthorne</p>
                <p className="text-xs uppercase tracking-[0.15em] text-muted-foreground">Estate Agent Toolkit</p>
              </div>
            </div>

            <nav className="flex flex-1 flex-col gap-1 overflow-y-auto pr-1 scrollbar-thin">
              {navigation.map((item) => {
                const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
                const Icon = item.icon;

                return (
                  <Link
                    key={item.href}
                    href={item.href as never}
                    className={cn(
                      "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-all",
                      active
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            <div className="mt-4 rounded-2xl border border-gold/30 bg-gold/10 p-4">
              <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-gold">
                <Sparkles className="h-4 w-4" />
                Hawthorne Systems
              </div>
              <p className="text-sm text-muted-foreground">
                Free tools that improve listings, reduce friction, and build trust with vendors.
              </p>
              <div className="mt-4 flex items-center justify-between">
                <Badge variant="gold">Premium free lead magnet</Badge>
              </div>
            </div>
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col gap-4">
          <header className="glass-panel sticky top-4 z-30 rounded-[1.75rem] border border-border/70 px-4 py-3 shadow-soft backdrop-blur-xl lg:px-6">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Sheet open={navOpen} onOpenChange={setNavOpen}>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="icon" className="lg:hidden">
                      <Menu className="h-5 w-5" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-[320px] border-r border-border/70 bg-background">
                    <div className="mb-6 flex items-center gap-3 pr-6">
                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gold text-sm font-black text-gold-foreground">
                        H
                      </div>
                      <div>
                        <p className="font-bricolage text-lg font-semibold tracking-tight">Hawthorne</p>
                        <p className="text-xs uppercase tracking-[0.15em] text-muted-foreground">Estate Agent Toolkit</p>
                      </div>
                    </div>
                    <nav className="flex flex-col gap-1">
                      {navigation.map((item) => {
                        const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
                        const Icon = item.icon;

                        return (
                          <Link
                            key={item.href}
                            href={item.href as never}
                            className={cn(
                              "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-all",
                              active
                                ? "bg-primary text-primary-foreground shadow-sm"
                                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                            )}
                          >
                            <Icon className="h-4 w-4" />
                            {item.label}
                          </Link>
                        );
                      })}
                      <Link
                        href="/api/auth/logout"
                        className="mt-2 flex items-center gap-3 rounded-2xl border border-border/70 px-4 py-3 text-sm font-medium text-muted-foreground transition-all hover:bg-accent hover:text-accent-foreground"
                      >
                        <ArrowLeftRight className="h-4 w-4" />
                        Logout
                      </Link>
                    </nav>
                  </SheetContent>
                </Sheet>

                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Welcome back</p>
                  <h1 className="font-bricolage text-lg font-semibold text-foreground sm:text-2xl">{userName}</h1>
                </div>
              </div>

              <div className="flex items-center gap-2 sm:gap-3">
                <Link href="/dashboard/search" className="hidden items-center gap-2 rounded-full border border-border bg-background px-4 py-2 text-sm text-muted-foreground transition hover:border-primary/40 hover:text-foreground sm:flex">
                  <Search className="h-4 w-4" />
                  Global search
                </Link>
                <ThemeToggle />
                <Button asChild variant="outline" size="sm" className="hidden sm:inline-flex">
                  <Link href="/api/auth/logout">
                    <ArrowLeftRight className="h-4 w-4" />
                    Logout
                  </Link>
                </Button>
              </div>
            </div>
            <p className="mt-2 hidden text-sm text-muted-foreground lg:block">{userEmail}</p>
          </header>

          <main className="min-w-0 flex-1 pb-6">{children}</main>
        </div>
      </div>
    </div>
  );
}