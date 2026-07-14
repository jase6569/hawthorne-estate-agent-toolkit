import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ToolCardProps = {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
  className?: string;
};

export function ToolCard({ title, description, icon: Icon, href, className }: ToolCardProps) {
  return (
    <Card className={cn("border-border/70 bg-card/90 shadow-soft", className)}>
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gold/15 text-gold">
            <Icon className="h-5 w-5" />
          </div>
          <Button asChild variant="ghost" size="sm" className="shrink-0">
            <Link href={href as never} prefetch={false}>
              Open
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
        <div className="mt-5">
          <p className="font-medium">{title}</p>
          <p className="mt-2 text-sm text-muted-foreground">{description}</p>
        </div>
      </CardContent>
    </Card>
  );
}