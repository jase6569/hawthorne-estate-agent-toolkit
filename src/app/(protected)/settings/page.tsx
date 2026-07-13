"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function SettingsPage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [name, setName] = useState("");
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  useEffect(() => {
    void (async () => {
      const response = await fetch("/api/me");
      if (!response.ok) {
        return;
      }
      const payload = (await response.json()) as { name: string; notificationsEnabled: boolean };
      setName(payload.name);
      setNotificationsEnabled(payload.notificationsEnabled);
    })();
  }, []);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    startTransition(async () => {
      const response = await fetch("/api/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, notificationsEnabled }),
      });

      const payload = (await response.json()) as { message?: string };

      if (!response.ok) {
        toast.error(payload.message ?? "Unable to save settings");
        return;
      }

      toast.success(payload.message ?? "Settings saved");
      router.refresh();
    });
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
      <Card className="border-border/70 bg-card/90 shadow-premium">
        <CardHeader>
          <CardTitle className="font-bricolage text-2xl">Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={submit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Display name</Label>
              <Input id="name" value={name} onChange={(event) => setName(event.target.value)} required />
            </div>
            <label className="flex items-center gap-3 rounded-2xl border border-border/70 bg-background/70 p-4">
              <input type="checkbox" checked={notificationsEnabled} onChange={(event) => setNotificationsEnabled(event.target.checked)} />
              <span className="text-sm font-medium">Notifications enabled</span>
            </label>
            <Button type="submit" disabled={isPending}>
              {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save settings"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="border-border/70 bg-card/90 shadow-soft">
        <CardHeader>
          <CardTitle className="text-lg">What this controls</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <p>Profile name updates the top bar and future report branding.</p>
          <p>Notifications can be used later for email and in-app alerts.</p>
          <p>The app is structured so more user preferences can be added without rewriting the dashboard layout.</p>
        </CardContent>
      </Card>
    </div>
  );
}