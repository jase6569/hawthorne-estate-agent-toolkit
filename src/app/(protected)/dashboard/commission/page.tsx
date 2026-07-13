import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CommissionCalculatorForm } from "@/components/forms/commission-calculator-form";
import { getCurrentUser } from "@/lib/auth";
import { getCommissionHistory } from "@/lib/dashboard";
import { currency, decimalCurrency, percentage } from "@/lib/format";

export default async function CommissionPage() {
  const user = await getCurrentUser();

  if (!user) {
    return null;
  }

  const history = await getCommissionHistory(user.id);

  return (
    <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
      <CommissionCalculatorForm />
      <Card className="border-border/70 bg-card/90 shadow-soft">
        <CardHeader>
          <CardTitle className="text-lg">Calculation history</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {history.map((entry) => (
            <div key={entry.id} className="rounded-2xl border border-border/60 bg-background/70 p-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-medium">{currency(entry.propertyPrice)}</p>
                  <p className="text-sm text-muted-foreground">{percentage(entry.commissionPercent)} commission</p>
                </div>
                <Badge variant={entry.vatEnabled ? "gold" : "secondary"}>{entry.vatEnabled ? "VAT" : "No VAT"}</Badge>
              </div>
              <div className="mt-3 grid gap-2 text-sm text-muted-foreground sm:grid-cols-2">
                <p>Commission: {decimalCurrency(entry.commission)}</p>
                <p>VAT: {decimalCurrency(entry.vat)}</p>
                <p>Total: {decimalCurrency(entry.total)}</p>
                <p>Net: {decimalCurrency(entry.net)}</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}