import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type StatCardProps = {
  label: string;
  value: string | number;
  detail: string;
  icon: React.ComponentType<{ className?: string }>;
  accent?: boolean;
};

export function StatCard({ label, value, detail, icon: Icon, accent }: StatCardProps) {
  return (
    <Card className={cn("border-border/70 shadow-soft", accent ? "bg-gold/10" : "bg-card/90")}>
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm text-muted-foreground">{label}</p>
            <p className="mt-2 font-bricolage text-3xl font-semibold tracking-tight">{value}</p>
            <p className="mt-2 text-sm text-muted-foreground">{detail}</p>
          </div>
          <div className={cn("flex h-12 w-12 items-center justify-center rounded-2xl", accent ? "bg-gold text-gold-foreground" : "bg-muted text-foreground")}>
            <Icon className="h-5 w-5" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}