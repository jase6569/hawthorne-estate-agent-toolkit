import { prisma } from "@/lib/db";

export async function getDashboardOverview(userId: string) {
  const [properties, feedbackCount, qrCount, reportsCount, latestHealthScore, recentFeedback, recentActivity, latestChecklist, latestCommission] =
    await Promise.all([
      prisma.property.count({ where: { userId } }),
      prisma.viewingFeedback.count({ where: { userId } }),
      prisma.qrCode.count({ where: { userId } }),
      prisma.vendorReport.count({ where: { userId } }),
      prisma.propertyHealthScore.findFirst({ where: { userId }, orderBy: { createdAt: "desc" } }),
      prisma.viewingFeedback.findMany({ where: { userId }, orderBy: { createdAt: "desc" }, take: 5 }),
      prisma.activity.findMany({ where: { userId }, orderBy: { createdAt: "desc" }, take: 6 }),
      prisma.marketingChecklist.findFirst({ where: { userId }, orderBy: { createdAt: "desc" } }),
      prisma.commissionCalculation.findFirst({ where: { userId }, orderBy: { createdAt: "desc" } }),
    ]);

  const averageRating = feedbackCount
    ? (
        await prisma.viewingFeedback.aggregate({
          where: { userId },
          _avg: { rating: true },
        })
      )._avg.rating ?? 0
    : 0;

  return {
    properties,
    feedbackCount,
    qrCount,
    reportsCount,
    averageRating,
    latestHealthScore,
    recentFeedback,
    recentActivity,
    latestChecklist,
    latestCommission,
  };
}

export async function getFeedbackData(userId: string, query = "", minRating?: number) {
  return prisma.viewingFeedback.findMany({
    where: {
      userId,
      ...(query
        ? {
            OR: [
              { propertyName: { contains: query } },
              { viewerName: { contains: query } },
              { comments: { contains: query } },
            ],
          }
        : {}),
      ...(minRating ? { rating: { gte: minRating } } : {}),
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function getCommissionHistory(userId: string) {
  return prisma.commissionCalculation.findMany({ where: { userId }, orderBy: { createdAt: "desc" } });
}

export async function getQrHistory(userId: string) {
  return prisma.qrCode.findMany({ where: { userId }, orderBy: { createdAt: "desc" } });
}

export async function getChecklistHistory(userId: string) {
  return prisma.marketingChecklist.findMany({ where: { userId }, orderBy: { createdAt: "desc" } });
}

export async function getVendorReports(userId: string) {
  return prisma.vendorReport.findMany({ where: { userId }, orderBy: { createdAt: "desc" } });
}

export async function searchWorkspace(userId: string, query: string) {
  const [properties, feedback, reports, qrCodes, checklists] = await Promise.all([
    prisma.property.findMany({
      where: {
        userId,
        OR: [
          { title: { contains: query } },
          { address: { contains: query } },
          { notes: { contains: query } },
        ],
      },
      take: 10,
    }),
    prisma.viewingFeedback.findMany({
      where: {
        userId,
        OR: [
          { propertyName: { contains: query } },
          { viewerName: { contains: query } },
          { comments: { contains: query } },
        ],
      },
      take: 10,
    }),
    prisma.vendorReport.findMany({
      where: {
        userId,
        OR: [{ propertyName: { contains: query } }, { notes: { contains: query } }],
      },
      take: 10,
    }),
    prisma.qrCode.findMany({
      where: { userId, propertyUrl: { contains: query } },
      take: 10,
    }),
    prisma.marketingChecklist.findMany({
      where: {
        userId,
        OR: [{ propertyName: { contains: query } }, { title: { contains: query } }],
      },
      take: 10,
    }),
  ]);

  return { properties, feedback, reports, qrCodes, checklists };
}