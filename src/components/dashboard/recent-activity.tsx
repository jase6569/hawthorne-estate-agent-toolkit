import { formatDate } from "@/lib/format";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type ActivityItem = {
  id: string;
  type: string;
  title: string;
  description: string;
  createdAt: Date;
};

type RecentActivityProps = {
  items: ActivityItem[];
};

export function RecentActivity({ items }: RecentActivityProps) {
  return (
    <Card className="border-border/70 bg-card/90 shadow-soft">
      <CardHeader>
        <CardTitle className="text-lg">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {items.map((item) => (
          <div key={item.id} className="rounded-2xl border border-border/60 bg-background/70 p-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-medium">{item.title}</p>
                <p className="mt-1 text-sm text-muted-foreground">{item.description}</p>
              </div>
              <Badge variant="secondary">{item.type.replaceAll("_", " ")}</Badge>
            </div>
            <p className="mt-3 text-xs uppercase tracking-[0.2em] text-muted-foreground">{formatDate(item.createdAt)}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}