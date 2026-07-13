import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { viewingFeedbackSchema } from "@/lib/validators";
import { getCurrentUser } from "@/lib/auth";

export async function POST(request: Request) {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const parsed = viewingFeedbackSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ message: parsed.error.issues[0]?.message ?? "Invalid request" }, { status: 400 });
  }

  const result = await prisma.viewingFeedback.create({
    data: {
      userId: user.id,
      propertyName: parsed.data.propertyName,
      viewerName: parsed.data.viewerName,
      rating: parsed.data.rating,
      liked: parsed.data.liked,
      disliked: parsed.data.disliked,
      priceOpinion: parsed.data.priceOpinion,
      wouldRecommend: parsed.data.wouldRecommend,
      interested: parsed.data.interested,
      comments: parsed.data.comments,
      propertyId: parsed.data.propertyId,
    },
  });

  await prisma.activity.create({
    data: {
      userId: user.id,
      type: "FEEDBACK",
      title: "Viewing feedback captured",
      description: `${parsed.data.viewerName} reviewed ${parsed.data.propertyName}.`,
    },
  });

  return NextResponse.json({ message: "Feedback saved successfully.", result });
}