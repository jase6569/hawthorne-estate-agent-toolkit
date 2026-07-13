import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { healthScoreSchema } from "@/lib/validators";
import { getCurrentUser } from "@/lib/auth";
import { calculatePropertyHealthScore } from "@/lib/score";

export async function POST(request: Request) {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = healthScoreSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ message: parsed.error.issues[0]?.message ?? "Invalid request" }, { status: 400 });
  }

  const { score, suggestions } = calculatePropertyHealthScore({
    photos: parsed.data.photos,
    floorplan: parsed.data.floorplan,
    videoTour: parsed.data.videoTour,
    epc: parsed.data.epc,
    staging: parsed.data.staging,
    gardenPhotos: parsed.data.gardenPhotos,
    kitchenPhotos: parsed.data.kitchenPhotos,
    bathroomPhotos: parsed.data.bathroomPhotos,
    descriptionComplete: parsed.data.descriptionComplete,
    socialPosted: parsed.data.socialPosted,
  });

  const result = await prisma.propertyHealthScore.create({
    data: {
      userId: user.id,
      propertyName: parsed.data.propertyName,
      propertyId: parsed.data.propertyId,
      score,
      inputs: {
        photos: parsed.data.photos,
        floorplan: parsed.data.floorplan,
        videoTour: parsed.data.videoTour,
        epc: parsed.data.epc,
        staging: parsed.data.staging,
        gardenPhotos: parsed.data.gardenPhotos,
        kitchenPhotos: parsed.data.kitchenPhotos,
        bathroomPhotos: parsed.data.bathroomPhotos,
        descriptionComplete: parsed.data.descriptionComplete,
        socialPosted: parsed.data.socialPosted,
      },
      suggestions,
    },
  });

  await prisma.activity.create({
    data: {
      userId: user.id,
      type: "HEALTH_SCORE",
      title: "Property Health Score generated",
      description: `${parsed.data.propertyName} scored ${result.score}/100.`,
    },
  });

  return NextResponse.json({ message: "Property Health Score generated.", result });
}