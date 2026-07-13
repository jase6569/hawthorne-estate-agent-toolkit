import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { VendorReportForm } from "@/components/forms/vendor-report-form";
import { getCurrentUser } from "@/lib/auth";
import { getVendorReports } from "@/lib/dashboard";

export default async function VendorReportPage() {
  const user = await getCurrentUser();

  if (!user) {
    return null;
  }

  const reports = await getVendorReports(user.id);

  return (
    <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
      <VendorReportForm />
      <Card className="border-border/70 bg-card/90 shadow-soft">
        <CardHeader>
          <CardTitle className="text-lg">Saved reports</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {reports.map((report) => (
            <div key={report.id} className="rounded-2xl border border-border/60 bg-background/70 p-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-medium">{report.propertyName}</p>
                  <p className="text-sm text-muted-foreground">{report.notes}</p>
                </div>
                <Badge variant="gold">PDF ready</Badge>
              </div>
              <Button asChild variant="outline" size="sm" className="mt-4">
                <Link href={`/api/vendor-report/${report.id}/pdf` as never}>Download PDF</Link>
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}