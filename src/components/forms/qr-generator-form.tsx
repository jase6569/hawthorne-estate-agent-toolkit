"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Download, Loader2, QrCode } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function QrGeneratorForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [propertyUrl, setPropertyUrl] = useState("https://hawthorne.systems/listings/14-cedar-avenue");

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    startTransition(async () => {
      try {
        const response = await fetch("/api/qr", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ propertyUrl }),
        });

        const payload = (await response.json().catch(() => ({}))) as { message?: string };

        if (!response.ok) {
          toast.error(payload.message ?? "Could not generate QR code");
          return;
        }

        toast.success(payload.message ?? "QR code generated");
        router.refresh();
      } catch {
        toast.error("Unable to reach the server. Please try again.");
      }
    });
  }

  return (
    <Card className="border-border/70 bg-card/90 shadow-premium">
      <CardHeader>
        <CardTitle className="font-bricolage text-2xl">QR Code Generator</CardTitle>
        <CardDescription>Generate property QR codes and keep a history of downloads.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={submit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="propertyUrl">Property URL</Label>
            <Input id="propertyUrl" value={propertyUrl} onChange={(event) => setPropertyUrl(event.target.value)} required />
          </div>
          <div className="flex flex-wrap gap-3">
            <Button type="submit" disabled={isPending}>
              {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <><QrCode className="h-4 w-4" /> Generate QR code</>}
            </Button>
            <Button type="button" variant="outline" onClick={() => window.print()}>
              <Download className="h-4 w-4" /> Download / print
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}