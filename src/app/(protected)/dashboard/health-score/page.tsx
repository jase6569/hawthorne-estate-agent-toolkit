import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { HealthScoreForm } from "@/components/forms/health-score-form";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";

export default async function HealthScorePage() {
  const user = await getCurrentUser();

  if (!user) {
    return null;
  }

  const latest = await prisma.propertyHealthScore.findFirst({ where: { userId: user.id }, orderBy: { createdAt: "desc" } });
  const history = await prisma.propertyHealthScore.findMany({ where: { userId: user.id }, orderBy: { createdAt: "desc" }, take: 6 });

  return (
    <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
      <HealthScoreForm defaultPropertyName={latest?.propertyName ?? ""} />
      <div className="space-y-6">
        <Card className="border-border/70 bg-card/90 shadow-premium">
          <CardHeader>
            <CardTitle className="font-bricolage text-2xl">Latest score</CardTitle>
            <CardDescription>Suggestions update whenever a new score is generated.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {latest ? (
              <>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{latest.propertyName ?? "Unknown property"}</p>
                    <p className="font-bricolage text-5xl font-semibold tracking-tight">{latest.score}</p>
                  </div>
                  <Badge variant="gold">/ 100</Badge>
                </div>
                <Progress value={latest.score} />
                <div className="space-y-3">
                  {(latest.suggestions as string[]).map((suggestion) => (
                    <div key={suggestion} className="rounded-2xl border border-border/60 bg-background/70 p-4 text-sm">
                      {suggestion}
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <p className="text-sm text-muted-foreground">No scores yet. Generate one to see recommendations here.</p>
            )}
          </CardContent>
        </Card>

        <Card className="border-border/70 bg-card/90 shadow-soft">
          <CardHeader>
            <CardTitle className="text-lg">Score history</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {history.map((entry) => (
              <div key={entry.id} className="rounded-2xl border border-border/60 bg-background/70 p-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="font-medium">{entry.propertyName ?? "Unknown property"}</p>
                    <p className="text-sm text-muted-foreground">{new Intl.DateTimeFormat("en-GB", { dateStyle: "medium", timeStyle: "short" }).format(entry.createdAt)}</p>
                  </div>
                  <Badge>{entry.score}/100</Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}