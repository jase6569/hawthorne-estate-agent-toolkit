export function calculateCommission(propertyPrice: number, commissionPercent: number, vatEnabled: boolean) {
  const commission = propertyPrice * (commissionPercent / 100);
  const vat = vatEnabled ? commission * 0.2 : 0;
  const total = commission + vat;
  const net = commission;

  return { commission, vat, total, net };
}