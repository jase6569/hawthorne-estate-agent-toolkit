import { ArrowRight, BarChart3, FileText, Gauge, QrCode, Sparkles, Users, StickyNote, Building2 } from "lucide-react";
import { StatCard } from "@/components/dashboard/stat-card";
import { ToolCard } from "@/components/dashboard/tool-card";
import { RecentActivity } from "@/components/dashboard/recent-activity";
import { SectionHeading } from "@/components/dashboard/section-heading";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { getDashboardOverview } from "@/lib/dashboard";
import { formatDate } from "@/lib/format";

const toolCards = [
  { title: "Property Health Score", icon: Gauge, description: "Grade the launch readiness of each property.", href: "/dashboard/health-score" },
  { title: "Viewing Feedback", icon: Users, description: "Capture, search, and filter viewer responses.", href: "/dashboard/feedback" },
  { title: "Commission Calculator", icon: BarChart3, description: "Run several fee scenarios in seconds.", href: "/dashboard/commission" },
  { title: "QR Generator", icon: QrCode, description: "Generate QR codes for your marketing pack.", href: "/dashboard/qr" },
  { title: "Marketing Checklist", icon: StickyNote, description: "Keep launches on track with printable checklists.", href: "/dashboard/checklist" },
  { title: "Vendor Report", icon: FileText, description: "Create polished PDF updates for vendors.", href: "/dashboard/vendor-report" },
];

export default async function DashboardPage() {
  const user = await (await import("@/lib/auth")).getCurrentUser();

  if (!user) {
    return null;
  }

  const data = await getDashboardOverview(user.id);

  return (
    <div className="space-y-6">
      <section className="grid gap-4 lg:grid-cols-4">
        <StatCard label="Properties" value={data.properties} detail="Tracked across your account" icon={Building2} />
        <StatCard label="Feedback entries" value={data.feedbackCount} detail="Captured viewing reactions" icon={Users} />
        <StatCard label="Average rating" value={data.averageRating ? data.averageRating.toFixed(1) : "0.0"} detail="Mean viewer score" icon={Sparkles} accent />
        <StatCard label="Reports and QR codes" value={data.reportsCount + data.qrCount} detail="Generated marketing assets" icon={ArrowRight} />
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <Card className="border-border/70 bg-card/90 shadow-premium">
          <CardHeader>
            <CardTitle className="font-bricolage text-2xl">Latest Property Health Score</CardTitle>
            <CardDescription>The latest score created in your account appears here instantly.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            {data.latestHealthScore ? (
              <>
                <div className="flex items-end justify-between gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">{data.latestHealthScore.propertyName ?? "Unknown property"}</p>
                    <p className="font-bricolage text-5xl font-semibold tracking-tight">{data.latestHealthScore.score}</p>
                  </div>
                  <Badge variant="gold">out of 100</Badge>
                </div>
                <Progress value={data.latestHealthScore.score} />
                <div className="grid gap-3 md:grid-cols-2">
                  {(data.latestHealthScore.suggestions as string[]).slice(0, 4).map((suggestion) => (
                    <div key={suggestion} className="rounded-2xl border border-border/60 bg-background/70 p-4 text-sm text-muted-foreground">
                      {suggestion}
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <p className="text-sm text-muted-foreground">No health scores yet. Create the first one from the tool page.</p>
            )}
          </CardContent>
        </Card>

        <RecentActivity items={data.recentActivity} />
      </section>

      <section className="space-y-4">
        <SectionHeading title="Tool Suite" description="Everything is modular so future tools can be added without redesigning the dashboard." />
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {toolCards.map((tool) => (
            <ToolCard key={tool.title} {...tool} />
          ))}
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.05fr_0.95fr]">
        <Card className="border-border/70 bg-card/90 shadow-soft">
          <CardHeader>
            <CardTitle className="text-lg">Recent Viewing Feedback</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {data.recentFeedback.map((feedback) => (
              <div key={feedback.id} className="rounded-2xl border border-border/60 bg-background/70 p-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="font-medium">{feedback.viewerName}</p>
                    <p className="text-sm text-muted-foreground">{feedback.propertyName}</p>
                  </div>
                  <Badge>{feedback.rating}/5</Badge>
                </div>
                <p className="mt-3 text-sm text-muted-foreground">{feedback.comments}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-border/70 bg-card/90 shadow-soft">
          <CardHeader>
            <CardTitle className="text-lg">Checklist Progress</CardTitle>
            <CardDescription>The latest marketing checklist captures launch readiness.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            {data.latestChecklist ? (
              <>
                <div className="flex items-end justify-between">
                  <div>
                    <p className="font-medium">{data.latestChecklist.title}</p>
                    <p className="text-sm text-muted-foreground">{data.latestChecklist.propertyName ?? "No property linked"}</p>
                  </div>
                  <Badge variant="secondary">{data.latestChecklist.progress}%</Badge>
                </div>
                <Progress value={data.latestChecklist.progress} />
                <div className="rounded-2xl border border-border/60 bg-background/70 p-4 text-sm text-muted-foreground">
                  Created {formatDate(data.latestChecklist.createdAt)}
                </div>
              </>
            ) : (
              <p className="text-sm text-muted-foreground">No checklist has been saved yet.</p>
            )}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}