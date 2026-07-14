"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type AuthFormProps = {
  mode: "login" | "register";
};

export function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submitLabel = mode === "login" ? "Sign in" : "Create account";

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    startTransition(async () => {
      try {
        const response = await fetch(mode === "login" ? "/api/auth/login" : "/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: mode === "register" ? name : undefined,
            email,
            password,
          }),
        });

        const payload = (await response.json().catch(() => ({}))) as { message?: string };

        if (!response.ok) {
          toast.error(payload.message ?? "Unable to continue");
          return;
        }

        toast.success(payload.message ?? (mode === "login" ? "Welcome back" : "Account created"));
        router.push("/dashboard");
        router.refresh();
      } catch {
        toast.error("Unable to reach the server. Please try again.");
      }
    });
  }

  return (
    <Card className="border-border/70 bg-card/90 shadow-premium">
      <CardHeader className="space-y-2">
        <div className="inline-flex w-fit rounded-full border border-gold/30 bg-gold/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-gold">
          Hawthorne Systems
        </div>
        <CardTitle className="font-bricolage text-3xl">{mode === "login" ? "Sign in" : "Create your account"}</CardTitle>
        <CardDescription>
          {mode === "login"
            ? "Access your private estate agent toolkit and review activity history."
            : "Start using the free Hawthorne lead magnet tools in a private workspace."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "register" && (
            <div className="space-y-2">
              <Label htmlFor="name">Full name</Label>
              <Input id="name" value={name} onChange={(event) => setName(event.target.value)} placeholder="Alex Morgan" required />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="agent@agency.co.uk" required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Minimum 8 characters"
              required
            />
          </div>

          <Button type="submit" className="w-full" size="lg" disabled={isPending}>
            {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : submitLabel}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}