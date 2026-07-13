"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function ViewingFeedbackForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [form, setForm] = useState({
    propertyName: "",
    viewerName: "",
    rating: 4,
    liked: "",
    disliked: "",
    priceOpinion: "",
    wouldRecommend: true,
    interested: true,
    comments: "",
  });

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    startTransition(async () => {
      const response = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const payload = (await response.json()) as { message?: string };

      if (!response.ok) {
        toast.error(payload.message ?? "Could not save feedback");
        return;
      }

      toast.success(payload.message ?? "Feedback saved");
      setForm({
        propertyName: "",
        viewerName: "",
        rating: 4,
        liked: "",
        disliked: "",
        priceOpinion: "",
        wouldRecommend: true,
        interested: true,
        comments: "",
      });
      router.refresh();
    });
  }

  return (
    <Card className="border-border/70 bg-card/90 shadow-premium">
      <CardHeader>
        <CardTitle className="font-bricolage text-2xl">Viewing Feedback</CardTitle>
        <CardDescription>Collect feedback from viewers and keep a searchable history.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={submit} className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="propertyName">Property</Label>
            <Input id="propertyName" value={form.propertyName} onChange={(event) => setForm((current) => ({ ...current, propertyName: event.target.value }))} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="viewerName">Viewer Name</Label>
            <Input id="viewerName" value={form.viewerName} onChange={(event) => setForm((current) => ({ ...current, viewerName: event.target.value }))} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="rating">Rating</Label>
            <Input id="rating" type="number" min={1} max={5} value={form.rating} onChange={(event) => setForm((current) => ({ ...current, rating: Number(event.target.value) }))} />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="liked">Liked</Label>
            <Textarea id="liked" value={form.liked} onChange={(event) => setForm((current) => ({ ...current, liked: event.target.value }))} required />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="disliked">Disliked</Label>
            <Textarea id="disliked" value={form.disliked} onChange={(event) => setForm((current) => ({ ...current, disliked: event.target.value }))} required />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="priceOpinion">Price Opinion</Label>
            <Input id="priceOpinion" value={form.priceOpinion} onChange={(event) => setForm((current) => ({ ...current, priceOpinion: event.target.value }))} required />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="comments">Comments</Label>
            <Textarea id="comments" value={form.comments} onChange={(event) => setForm((current) => ({ ...current, comments: event.target.value }))} required />
          </div>
          <div className="flex items-center gap-3 rounded-2xl border border-border/70 bg-background/70 p-4 md:col-span-2">
            <input id="wouldRecommend" type="checkbox" checked={form.wouldRecommend} onChange={(event) => setForm((current) => ({ ...current, wouldRecommend: event.target.checked }))} />
            <Label htmlFor="wouldRecommend">Would Recommend</Label>
          </div>
          <div className="flex items-center gap-3 rounded-2xl border border-border/70 bg-background/70 p-4 md:col-span-2">
            <input id="interested" type="checkbox" checked={form.interested} onChange={(event) => setForm((current) => ({ ...current, interested: event.target.checked }))} />
            <Label htmlFor="interested">Interested?</Label>
          </div>
          <Button type="submit" className="md:col-span-2" disabled={isPending}>
            {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save feedback"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}