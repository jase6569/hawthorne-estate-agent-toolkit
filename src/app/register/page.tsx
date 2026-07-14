import Link from "next/link";
import { AuthForm } from "@/components/forms/auth-form";
import { Button } from "@/components/ui/button";

export default function RegisterPage() {
  return (
    <main className="grid min-h-screen place-items-center px-4 py-10">
      <div className="grid w-full max-w-6xl gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <section className="rounded-[2rem] border border-border/70 bg-card/80 p-8 shadow-premium">
          <p className="font-bricolage text-3xl font-semibold">Create a private agent workspace.</p>
          <p className="mt-4 max-w-lg text-muted-foreground">
            New accounts get a personal dashboard with all tools, saved history, and branded outputs &mdash; completely free, forever. No trial, no
            credit card, no catch.
          </p>
          <div className="mt-8 space-y-3 rounded-3xl border border-border/60 bg-background/70 p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-gold">Built for trust</p>
            <p className="text-sm text-muted-foreground">Minimal premium design</p>
            <p className="text-sm text-muted-foreground">Agent-level data isolation</p>
            <p className="text-sm text-muted-foreground">Free forever, no card required</p>
          </div>
          <Button asChild variant="outline" className="mt-8">
            <Link href="/">Back to home</Link>
          </Button>
        </section>
        <AuthForm mode="register" />
      </div>
    </main>
  );
}