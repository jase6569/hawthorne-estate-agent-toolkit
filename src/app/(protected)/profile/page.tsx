import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";

export default async function ProfilePage() {
  const user = await getCurrentUser();

  if (!user) {
    return null;
  }

  const [feedbackCount, scoreCount, reportCount] = await Promise.all([
    prisma.viewingFeedback.count({ where: { userId: user.id } }),
    prisma.propertyHealthScore.count({ where: { userId: user.id } }),
    prisma.vendorReport.count({ where: { userId: user.id } }),
  ]);

  return (
    <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
      <Card className="border-border/70 bg-card/90 shadow-premium">
        <CardHeader>
          <CardTitle className="font-bricolage text-2xl">Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <p><span className="font-medium">Name:</span> {user.name}</p>
          <p><span className="font-medium">Email:</span> {user.email}</p>
          <p><span className="font-medium">Role:</span> {user.role}</p>
          <Badge variant={user.notificationsEnabled ? "gold" : "secondary"}>{user.notificationsEnabled ? "Notifications enabled" : "Notifications disabled"}</Badge>
        </CardContent>
      </Card>

      <Card className="border-border/70 bg-card/90 shadow-soft">
        <CardHeader>
          <CardTitle className="text-lg">Account activity</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-3">
          <Stat label="Feedback" value={feedbackCount} />
          <Stat label="Health scores" value={scoreCount} />
          <Stat label="Reports" value={reportCount} />
        </CardContent>
      </Card>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-border/60 bg-background/70 p-4">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="mt-2 font-bricolage text-3xl font-semibold">{value}</p>
    </div>
  );
}