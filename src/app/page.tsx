import Link from "next/link";
import { ArrowRight, BarChart3, CheckCircle2, QrCode, Sparkles, FileText, Gauge, MessageSquareText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getCurrentUser } from "@/lib/auth";

const tools = [
  { title: "Property Health Score", icon: Gauge, description: "Instant listing readiness scoring with actionable suggestions." },
  { title: "Viewing Feedback", icon: MessageSquareText, description: "Collect, search, and filter viewer feedback in one place." },
  { title: "Commission Calculator", icon: BarChart3, description: "Run multiple commission scenarios with VAT and net figures." },
  { title: "QR Generator", icon: QrCode, description: "Create branded property QR codes and keep a download history." },
  { title: "Marketing Checklist", icon: CheckCircle2, description: "Track launch readiness and print a polished checklist." },
  { title: "Vendor Report", icon: FileText, description: "Generate a professional PDF report for vendor updates." },
];

export default async function HomePage() {
  const user = await getCurrentUser();

  return (
    <main className="relative overflow-hidden">
      <div className="absolute inset-0 bg-brand-radial opacity-70" />
      <section className="relative mx-auto flex min-h-screen max-w-7xl flex-col px-4 py-6 sm:px-6 lg:px-8">
        <header className="mb-12 flex flex-col gap-3 rounded-3xl border border-border/70 bg-background/70 px-4 py-3 shadow-soft backdrop-blur-xl sm:flex-row sm:items-center sm:justify-between sm:rounded-full">
          <div>
            <p className="font-bricolage text-lg font-semibold sm:text-xl">Hawthorne Estate Agent Toolkit</p>
            <p className="text-xs uppercase tracking-[0.32em] text-muted-foreground">Hawthorne Systems</p>
          </div>
          <div className="flex items-center gap-2">
            {user ? (
              <Button asChild>
                <Link href="/dashboard">
                  Open dashboard
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            ) : (
              <>
                <Button asChild variant="outline" className="flex-1 sm:flex-none">
                  <Link href="/login">Sign in</Link>
                </Button>
                <Button asChild className="flex-1 sm:flex-none">
                  <Link href="/register">Create account</Link>
                </Button>
              </>
            )}
          </div>
        </header>

        <div className="grid flex-1 items-center gap-12 py-6 lg:grid-cols-[1.1fr_0.9fr] lg:py-12">
          <div className="max-w-3xl">
            <Badge variant="gold" className="mb-6 w-fit">Free lead magnet for estate agents</Badge>
            <h1 className="font-bricolage text-5xl font-semibold tracking-tight sm:text-6xl lg:text-7xl">
              Premium tools that help estate agents win trust faster.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
              Hawthorne Systems gives agents immediate value through scoring, feedback, reporting, and marketing tools designed to improve listing
              performance without pushing a hard sell.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg" className="shadow-premium">
                <Link href={user ? "/dashboard" : "/register"}>
                  {user ? "Open dashboard" : "Start free"}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/dashboard/search">Explore tools</Link>
              </Button>
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              {[
                ["Instant", "Score listings in seconds"],
                ["Branded", "Hawthorne look and feel"],
                ["Responsive", "Works on desktop and mobile"],
              ].map(([title, description]) => (
                <div key={title} className="rounded-2xl border border-border/70 bg-card/80 p-4 shadow-soft">
                  <p className="text-sm font-semibold">{title}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{description}</p>
                </div>
              ))}
            </div>
          </div>

          <Card className="border-border/70 bg-card/90 shadow-premium">
            <CardHeader>
              <div className="flex items-center gap-2 text-sm font-semibold text-gold">
                <Sparkles className="h-4 w-4" />
                Why agents keep using it
              </div>
              <CardTitle className="font-bricolage text-2xl">A practical toolkit, not a demo shell</CardTitle>
              <CardDescription>Everything is stored per agent account so the tools become part of the daily workflow.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3">
              {tools.map((tool) => {
                const Icon = tool.icon;

                return (
                  <div key={tool.title} className="flex items-start gap-4 rounded-2xl border border-border/60 bg-background/70 p-4">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gold/15 text-gold">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-medium">{tool.title}</p>
                      <p className="text-sm text-muted-foreground">{tool.description}</p>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  );
}