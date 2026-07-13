import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ChecklistForm } from "@/components/forms/checklist-form";
import { getCurrentUser } from "@/lib/auth";
import { getChecklistHistory } from "@/lib/dashboard";

export default async function ChecklistPage() {
  const user = await getCurrentUser();

  if (!user) {
    return null;
  }

  const history = await getChecklistHistory(user.id);

  return (
    <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
      <ChecklistForm />
      <Card className="border-border/70 bg-card/90 shadow-soft">
        <CardHeader>
          <CardTitle className="text-lg">Checklist history</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {history.map((entry) => (
            <div key={entry.id} className="rounded-2xl border border-border/60 bg-background/70 p-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-medium">{entry.title}</p>
                  <p className="text-sm text-muted-foreground">{entry.propertyName ?? "No property linked"}</p>
                </div>
                <Badge>{entry.progress}%</Badge>
              </div>
              <Progress value={entry.progress} className="mt-4" />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}