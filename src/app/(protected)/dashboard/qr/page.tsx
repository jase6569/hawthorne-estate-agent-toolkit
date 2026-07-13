import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { QrGeneratorForm } from "@/components/forms/qr-generator-form";
import { getCurrentUser } from "@/lib/auth";
import { getQrHistory } from "@/lib/dashboard";
import { formatDate } from "@/lib/format";

export default async function QrPage() {
  const user = await getCurrentUser();

  if (!user) {
    return null;
  }

  const history = await getQrHistory(user.id);

  return (
    <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
      <QrGeneratorForm />
      <Card className="border-border/70 bg-card/90 shadow-soft">
        <CardHeader>
          <CardTitle className="text-lg">QR history</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          {history.map((entry) => (
            <div key={entry.id} className="rounded-2xl border border-border/60 bg-background/70 p-4">
              {entry.imageData ? <Image src={entry.imageData} alt="Property QR code" width={180} height={180} className="mx-auto rounded-xl" unoptimized /> : null}
              <p className="mt-3 break-all text-sm text-muted-foreground">{entry.propertyUrl}</p>
              <div className="mt-3 flex items-center justify-between gap-3">
                <Badge variant="secondary">Saved</Badge>
                <span className="text-xs text-muted-foreground">{formatDate(entry.createdAt)}</span>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}