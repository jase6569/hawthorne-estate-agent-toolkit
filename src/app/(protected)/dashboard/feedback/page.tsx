import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ViewingFeedbackForm } from "@/components/forms/viewing-feedback-form";
import { getCurrentUser } from "@/lib/auth";
import { getFeedbackData } from "@/lib/dashboard";

export default async function FeedbackPage({ searchParams }: { searchParams: Promise<{ q?: string; rating?: string }> }) {
  const user = await getCurrentUser();

  if (!user) {
    return null;
  }

  const params = await searchParams;
  const feedback = await getFeedbackData(user.id, params.q ?? "", params.rating ? Number(params.rating) : undefined);
  const average = feedback.length ? feedback.reduce((sum, item) => sum + item.rating, 0) / feedback.length : 0;

  return (
    <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
      <ViewingFeedbackForm />
      <div className="space-y-6">
        <Card className="border-border/70 bg-card/90 shadow-soft">
          <CardHeader>
            <CardTitle className="text-lg">Average Rating</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-bricolage text-5xl font-semibold">{average ? average.toFixed(1) : "0.0"}</p>
          </CardContent>
        </Card>

        <Card className="border-border/70 bg-card/90 shadow-soft">
          <CardHeader>
            <CardTitle className="text-lg">Feedback history</CardTitle>
            <form className="grid gap-3 sm:grid-cols-[1fr_160px_auto]" action="/dashboard/feedback" method="get">
              <Input name="q" placeholder="Search" defaultValue={params.q ?? ""} />
              <Input name="rating" placeholder="Filter rating" defaultValue={params.rating ?? ""} />
              <Button type="submit" variant="outline">Search</Button>
            </form>
          </CardHeader>
          <CardContent className="space-y-4">
            {feedback.map((item) => (
              <div key={item.id} className="rounded-2xl border border-border/60 bg-background/70 p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-medium">{item.propertyName}</p>
                    <p className="text-sm text-muted-foreground">{item.viewerName}</p>
                  </div>
                  <Badge>{item.rating}/5</Badge>
                </div>
                <p className="mt-3 text-sm text-muted-foreground">{item.comments}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}