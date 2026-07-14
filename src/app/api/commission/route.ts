import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { commissionSchema } from "@/lib/validators";
import { getCurrentUser } from "@/lib/auth";
import { calculateCommission } from "@/lib/commission";
import { handleApiError } from "@/lib/api-error";

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const parsed = commissionSchema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json({ message: parsed.error.issues[0]?.message ?? "Invalid request" }, { status: 400 });
    }

    const totals = calculateCommission(parsed.data.propertyPrice, parsed.data.commissionPercent, parsed.data.vatEnabled);

    const result = await prisma.commissionCalculation.create({
      data: {
        userId: user.id,
        propertyPrice: parsed.data.propertyPrice,
        commissionPercent: parsed.data.commissionPercent,
        vatEnabled: parsed.data.vatEnabled,
        commission: totals.commission,
        vat: totals.vat,
        total: totals.total,
        net: totals.net,
      },
    });

    await prisma.activity.create({
      data: {
        userId: user.id,
        type: "COMMISSION",
        title: "Commission calculation saved",
        description: `Calculated on a property valued at £${parsed.data.propertyPrice.toFixed(0)}.`,
      },
    });

    return NextResponse.json({ message: "Commission calculation saved.", result });
  } catch (error) {
    return handleApiError(error);
  }
}