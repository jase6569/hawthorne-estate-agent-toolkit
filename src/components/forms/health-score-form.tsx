"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

type Props = {
  defaultPropertyName?: string;
};

type FlagKey =
  | "floorplan"
  | "videoTour"
  | "epc"
  | "staging"
  | "gardenPhotos"
  | "kitchenPhotos"
  | "bathroomPhotos"
  | "descriptionComplete"
  | "socialPosted";

const checklistItems: Array<{ key: FlagKey; label: string; tip: string }> = [
  { key: "floorplan", label: "Floorplan", tip: "To-scale, with room dimensions and a compass orientation marked." },
  { key: "videoTour", label: "Video Tour", tip: "Start at the front door and walk room to room in one continuous take." },
  { key: "epc", label: "EPC", tip: "Attach the current Energy Performance Certificate before the listing goes live." },
  { key: "staging", label: "Staging", tip: "Declutter surfaces, open curtains for natural light, add fresh flowers or neutral throws." },
  { key: "gardenPhotos", label: "Garden Photos", tip: "Shoot from the back corner looking toward the house to show the full plot, plus a close-up of the patio or seating area." },
  { key: "kitchenPhotos", label: "Kitchen Photos", tip: "Shoot from the doorway to capture the full run of units, then a second angle showing any island or dining space." },
  { key: "bathroomPhotos", label: "Bathroom Photos", tip: "Shoot from the doorway to show the full room, plus a close-up of standout fittings like a rainfall shower or freestanding bath." },
  { key: "descriptionComplete", label: "Description Complete", tip: "Include room measurements, lifestyle context, and nearby transport or schools." },
  { key: "socialPosted", label: "Social Posted", tip: "Share on Instagram/Facebook with the best exterior or kitchen shot as the cover image." },
];

export function HealthScoreForm({ defaultPropertyName = "" }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [propertyName, setPropertyName] = useState(defaultPropertyName);
  const [photos, setPhotos] = useState(12);
  const [flags, setFlags] = useState({
    floorplan: true,
    videoTour: false,
    epc: true,
    staging: false,
    gardenPhotos: true,
    kitchenPhotos: true,
    bathroomPhotos: true,
    descriptionComplete: true,
    socialPosted: false,
  });

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    startTransition(async () => {
      try {
        const response = await fetch("/api/health-score", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ propertyName, photos, ...flags }),
        });

        const payload = (await response.json().catch(() => ({}))) as { message?: string };

        if (!response.ok) {
          toast.error(payload.message ?? "Could not calculate score");
          return;
        }

        toast.success(payload.message ?? "Score generated");
        router.refresh();
      } catch {
        toast.error("Unable to reach the server. Please try again.");
      }
    });
  }

  function updateFlag(key: keyof typeof flags, value: boolean) {
    setFlags((current) => ({ ...current, [key]: value }));
  }

  return (
    <Card className="border-border/70 bg-card/90 shadow-premium">
      <CardHeader>
        <CardTitle className="font-bricolage text-2xl">Property Health Score</CardTitle>
        <CardDescription>Score listings out of 100 and surface practical improvements immediately.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={submit} className="grid gap-4 lg:grid-cols-2">
          <div className="space-y-2 lg:col-span-2">
            <Label htmlFor="propertyName">Property name</Label>
            <Input id="propertyName" value={propertyName} onChange={(event) => setPropertyName(event.target.value)} placeholder="14 Cedar Avenue" required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="photos">Number of photos</Label>
            <Input id="photos" type="number" min={0} max={100} value={photos} onChange={(event) => setPhotos(Number(event.target.value))} />
          </div>

          <div className="grid gap-3 rounded-2xl border border-border/70 bg-background/70 p-4 lg:col-span-2 sm:grid-cols-2">
            {checklistItems.map((item) => (
              <label key={item.key} className="flex items-start gap-3 rounded-xl border border-border/60 bg-background px-4 py-3 text-sm">
                <Checkbox
                  className="mt-0.5"
                  checked={flags[item.key]}
                  onCheckedChange={(checked) => updateFlag(item.key, checked === true)}
                />
                <span>
                  <span className="font-medium">{item.label}</span>
                  <span className="mt-0.5 block text-xs leading-snug text-muted-foreground">{item.tip}</span>
                </span>
              </label>
            ))}
          </div>

          <Button type="submit" className="lg:col-span-2" disabled={isPending}>
            {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Calculate score"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}