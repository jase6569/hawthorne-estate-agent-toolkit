import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { vendorReportSchema } from "@/lib/validators";
import { getCurrentUser } from "@/lib/auth";
import { getDashboardOverview } from "@/lib/dashboard";
import { handleApiError } from "@/lib/api-error";

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const parsed = vendorReportSchema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json({ message: parsed.error.issues[0]?.message ?? "Invalid request" }, { status: 400 });
    }

    const [overview, latestChecklist, latestHealthScore, feedback] = await Promise.all([
      getDashboardOverview(user.id),
      prisma.marketingChecklist.findFirst({ where: { userId: user.id }, orderBy: { createdAt: "desc" } }),
      prisma.propertyHealthScore.findFirst({ where: { userId: user.id }, orderBy: { createdAt: "desc" } }),
      prisma.viewingFeedback.findMany({ where: { userId: user.id }, orderBy: { createdAt: "desc" }, take: 10 }),
    ]);

    const result = await prisma.vendorReport.create({
      data: {
        userId: user.id,
        propertyName: parsed.data.propertyName,
        propertyId: parsed.data.propertyId,
        notes: parsed.data.notes,
        offers: parsed.data.offers,
        marketingChecklist: latestChecklist?.items ?? [],
        healthScore: latestHealthScore ? { score: latestHealthScore.score, suggestions: latestHealthScore.suggestions } : {},
        feedbackSummary: {
          averageRating: overview.averageRating,
          latestFeedback: feedback.slice(0, 3).map((entry) => ({ viewerName: entry.viewerName, comments: entry.comments })),
        },
        pdfFileName: `${parsed.data.propertyName.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-vendor-report.pdf`,
      },
    });

    await prisma.activity.create({
      data: {
        userId: user.id,
        type: "REPORT",
        title: "Vendor report created",
        description: `${parsed.data.propertyName} report prepared.`,
      },
    });

    return NextResponse.json({ message: "Vendor report saved.", result });
  } catch (error) {
    return handleApiError(error);
  }
}