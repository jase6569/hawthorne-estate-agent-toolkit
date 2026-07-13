import Link from "next/link";
import { AuthForm } from "@/components/forms/auth-form";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  return (
    <main className="grid min-h-screen place-items-center px-4 py-10">
      <div className="grid w-full max-w-6xl gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <section className="rounded-[2rem] border border-border/70 bg-card/80 p-8 shadow-premium">
          <p className="font-bricolage text-3xl font-semibold">Return to your toolkit.</p>
          <p className="mt-4 max-w-lg text-muted-foreground">
            Sign in to review property health, capture feedback, calculate commission, and prepare polished vendor reports.
          </p>
          <div className="mt-8 rounded-3xl border border-gold/20 bg-gold/10 p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-gold">Demo account</p>
            <p className="mt-2 text-sm text-muted-foreground">agent@hawthorne.systems</p>
            <p className="text-sm text-muted-foreground">Password123!</p>
          </div>
          <Button asChild variant="outline" className="mt-8">
            <Link href="/">Back to home</Link>
          </Button>
        </section>
        <AuthForm mode="login" />
      </div>
    </main>
  );
}