"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2, Plus, FileDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function VendorReportForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [propertyName, setPropertyName] = useState("14 Cedar Avenue");
  const [notes, setNotes] = useState("Vendor report prepared for weekly review.");
  const [offers, setOffers] = useState([{ amount: 470000, buyer: "Buyer A", status: "Pending" }]);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    startTransition(async () => {
      try {
        const response = await fetch("/api/vendor-report", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ propertyName, notes, offers }),
        });

        const payload = (await response.json().catch(() => ({}))) as { message?: string };

        if (!response.ok) {
          toast.error(payload.message ?? "Could not save report");
          return;
        }

        toast.success(payload.message ?? "Vendor report saved");
        router.refresh();
      } catch {
        toast.error("Unable to reach the server. Please try again.");
      }
    });
  }

  return (
    <Card className="border-border/70 bg-card/90 shadow-premium">
      <CardHeader>
        <CardTitle className="font-bricolage text-2xl">Vendor Report</CardTitle>
        <CardDescription>Create a printable PDF with branding, feedback, and marketing context.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={submit} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="propertyName">Property details</Label>
              <Input id="propertyName" value={propertyName} onChange={(event) => setPropertyName(event.target.value)} required />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea id="notes" value={notes} onChange={(event) => setNotes(event.target.value)} required />
            </div>
          </div>

          <div className="space-y-3 rounded-2xl border border-border/70 bg-background/70 p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">Offers</p>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setOffers((current) => [...current, { amount: 0, buyer: "", status: "Pending" }])}
              >
                <Plus className="h-4 w-4" /> Add offer
              </Button>
            </div>
            <div className="space-y-3">
              {offers.map((offer, index) => (
                <div key={index} className="grid gap-3 md:grid-cols-3">
                  <Input type="number" value={offer.amount} onChange={(event) => setOffers((current) => current.map((item, itemIndex) => (itemIndex === index ? { ...item, amount: Number(event.target.value) } : item)))} />
                  <Input value={offer.buyer} onChange={(event) => setOffers((current) => current.map((item, itemIndex) => (itemIndex === index ? { ...item, buyer: event.target.value } : item)))} placeholder="Buyer" />
                  <Input value={offer.status} onChange={(event) => setOffers((current) => current.map((item, itemIndex) => (itemIndex === index ? { ...item, status: event.target.value } : item)))} placeholder="Status" />
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button type="submit" disabled={isPending}>
              {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save report"}
            </Button>
            <Button type="button" variant="outline" onClick={() => window.print()}>
              <FileDown className="h-4 w-4" /> Print PDF layout
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}