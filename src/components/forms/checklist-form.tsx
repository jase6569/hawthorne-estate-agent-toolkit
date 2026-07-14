"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { checklistTemplate } from "@/lib/checklist";

export function ChecklistForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [propertyName, setPropertyName] = useState("14 Cedar Avenue");
  const [title, setTitle] = useState("Launch checklist");
  const [items, setItems] = useState(() => checklistTemplate.map((label) => ({ label, done: false })));

  const progress = useMemo(() => {
    const completed = items.filter((item) => item.done).length;
    return items.length ? Math.round((completed / items.length) * 100) : 0;
  }, [items]);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    startTransition(async () => {
      try {
        const response = await fetch("/api/checklist", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ propertyName, title, items }),
        });

        const payload = (await response.json().catch(() => ({}))) as { message?: string };

        if (!response.ok) {
          toast.error(payload.message ?? "Could not save checklist");
          return;
        }

        toast.success(payload.message ?? "Checklist saved");
        router.refresh();
      } catch {
        toast.error("Unable to reach the server. Please try again.");
      }
    });
  }

  return (
    <Card className="border-border/70 bg-card/90 shadow-premium">
      <CardHeader>
        <CardTitle className="font-bricolage text-2xl">Marketing Checklist</CardTitle>
        <CardDescription>Track launch readiness and print a polished checklist for the team.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={submit} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="propertyName">Property</Label>
              <Input id="propertyName" value={propertyName} onChange={(event) => setPropertyName(event.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="title">Checklist title</Label>
              <Input id="title" value={title} onChange={(event) => setTitle(event.target.value)} required />
            </div>
          </div>

          <div className="grid gap-3 rounded-2xl border border-border/70 bg-background/70 p-4 sm:grid-cols-2">
            {items.map((item, index) => (
              <label key={item.label} className="flex items-center gap-3 rounded-xl border border-border/60 bg-background px-4 py-3 text-sm">
                <Checkbox checked={item.done} onCheckedChange={(checked) => setItems((current) => current.map((entry, entryIndex) => (entryIndex === index ? { ...entry, done: checked === true } : entry)))} />
                {item.label}
              </label>
            ))}
          </div>

          <div className="rounded-2xl border border-border/70 bg-background/70 p-4 text-sm">
            Progress: <span className="font-semibold">{progress}%</span>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button type="submit" disabled={isPending}>
              {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save checklist"}
            </Button>
            <Button type="button" variant="outline" onClick={() => window.print()}>
              <Printer className="h-4 w-4" /> Printable checklist
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}