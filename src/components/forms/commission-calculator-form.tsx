"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

export function CommissionCalculatorForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [propertyPrice, setPropertyPrice] = useState(475000);
  const [commissionPercent, setCommissionPercent] = useState(1.25);
  const [vatEnabled, setVatEnabled] = useState(true);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    startTransition(async () => {
      try {
        const response = await fetch("/api/commission", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ propertyPrice, commissionPercent, vatEnabled }),
        });

        const payload = (await response.json().catch(() => ({}))) as { message?: string };

        if (!response.ok) {
          toast.error(payload.message ?? "Could not save calculation");
          return;
        }

        toast.success(payload.message ?? "Calculation saved");
        router.refresh();
      } catch {
        toast.error("Unable to reach the server. Please try again.");
      }
    });
  }

  return (
    <Card className="border-border/70 bg-card/90 shadow-premium">
      <CardHeader>
        <CardTitle className="font-bricolage text-2xl">Commission Calculator</CardTitle>
        <CardDescription>Calculate commission, VAT, total, and net in one place.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={submit} className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="propertyPrice">Property Price</Label>
            <Input id="propertyPrice" type="number" min={0} step="1" value={propertyPrice} onChange={(event) => setPropertyPrice(Number(event.target.value))} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="commissionPercent">Commission %</Label>
            <Input id="commissionPercent" type="number" min={0} step="0.01" value={commissionPercent} onChange={(event) => setCommissionPercent(Number(event.target.value))} />
          </div>
          <label className="flex items-center gap-3 rounded-2xl border border-border/70 bg-background/70 p-4 md:col-span-2">
            <Checkbox checked={vatEnabled} onCheckedChange={(checked) => setVatEnabled(checked === true)} />
            <span className="text-sm font-medium">VAT Yes/No</span>
          </label>
          <Button type="submit" className="md:col-span-2" disabled={isPending}>
            {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Plus className="h-4 w-4" /> Save calculation</>}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}