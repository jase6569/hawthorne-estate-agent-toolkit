import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { checklistSchema } from "@/lib/validators";
import { getCurrentUser } from "@/lib/auth";
import { calculateChecklistProgress } from "@/lib/checklist";

export async function POST(request: Request) {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const parsed = checklistSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ message: parsed.error.issues[0]?.message ?? "Invalid request" }, { status: 400 });
  }

  const progress = calculateChecklistProgress(parsed.data.items);
  const result = await prisma.marketingChecklist.create({
    data: {
      userId: user.id,
      propertyName: parsed.data.propertyName,
      propertyId: parsed.data.propertyId,
      title: parsed.data.title,
      items: parsed.data.items,
      progress,
    },
  });

  await prisma.activity.create({
    data: {
      userId: user.id,
      type: "CHECKLIST",
      title: "Marketing checklist saved",
      description: `${parsed.data.propertyName} reached ${progress}% completion.`,
    },
  });

  return NextResponse.json({ message: "Checklist saved.", result });
}