import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { settingsSchema } from "@/lib/validators";
import { getCurrentUser } from "@/lib/auth";

export async function PATCH(request: Request) {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const parsed = settingsSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ message: parsed.error.issues[0]?.message ?? "Invalid request" }, { status: 400 });
  }

  const result = await prisma.user.update({
    where: { id: user.id },
    data: {
      name: parsed.data.name,
      notificationsEnabled: parsed.data.notificationsEnabled,
    },
  });

  await prisma.activity.create({
    data: {
      userId: user.id,
      type: "SETTINGS",
      title: "Settings updated",
      description: "Profile preferences changed.",
    },
  });

  return NextResponse.json({ message: "Settings updated.", result });
}