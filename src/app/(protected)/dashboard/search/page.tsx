import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { getCurrentUser } from "@/lib/auth";
import { searchWorkspace } from "@/lib/dashboard";

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const user = await getCurrentUser();

  if (!user) {
    return null;
  }

  const params = await searchParams;
  const query = params.q ?? "";
  const results = query ? await searchWorkspace(user.id, query) : null;

  return (
    <div className="space-y-6">
      <Card className="border-border/70 bg-card/90 shadow-premium">
        <CardHeader>
          <CardTitle className="font-bricolage text-2xl">Global Search</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="flex gap-3" action="/dashboard/search" method="get">
            <Input name="q" placeholder="Search properties, feedback, reports, QR codes, and checklists" defaultValue={query} />
            <Button type="submit">Search</Button>
          </form>
        </CardContent>
      </Card>

      {results ? (
        <div className="grid gap-6 xl:grid-cols-2">
          <ResultGroup title="Properties" items={results.properties.map((item) => ({ key: item.id, label: item.title, detail: item.address ?? item.status, href: "/dashboard" }))} />
          <ResultGroup title="Feedback" items={results.feedback.map((item) => ({ key: item.id, label: item.viewerName, detail: item.propertyName, href: "/dashboard/feedback" }))} />
          <ResultGroup title="Vendor Reports" items={results.reports.map((item) => ({ key: item.id, label: item.propertyName, detail: item.notes, href: `/api/vendor-report/${item.id}/pdf` }))} />
          <ResultGroup title="QR Codes" items={results.qrCodes.map((item) => ({ key: item.id, label: item.propertyUrl, detail: "Saved QR code", href: "/dashboard/qr" }))} />
          <ResultGroup title="Checklists" items={results.checklists.map((item) => ({ key: item.id, label: item.title, detail: item.propertyName ?? "Checklist", href: "/dashboard/checklist" }))} />
        </div>
      ) : (
        <Card className="border-border/70 bg-card/90 shadow-soft">
          <CardContent className="p-6 text-sm text-muted-foreground">Enter a search term to inspect the workspace.</CardContent>
        </Card>
      )}
    </div>
  );
}

function ResultGroup({ title, items }: { title: string; items: Array<{ key: string; label: string; detail: string; href: string }> }) {
  return (
    <Card className="border-border/70 bg-card/90 shadow-soft">
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {items.length ? (
          items.map((item) => (
            <Link key={item.key} href={item.href as never} className="block rounded-2xl border border-border/60 bg-background/70 p-4 transition hover:border-primary/40">
              <p className="font-medium">{item.label}</p>
              <p className="mt-1 text-sm text-muted-foreground">{item.detail}</p>
            </Link>
          ))
        ) : (
          <p className="text-sm text-muted-foreground">No matches found.</p>
        )}
      </CardContent>
    </Card>
  );
}