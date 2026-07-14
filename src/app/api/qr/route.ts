import { NextResponse } from "next/server";
import QRCode from "qrcode";
import { prisma } from "@/lib/db";
import { qrSchema } from "@/lib/validators";
import { getCurrentUser } from "@/lib/auth";
import { handleApiError } from "@/lib/api-error";

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const parsed = qrSchema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json({ message: parsed.error.issues[0]?.message ?? "Invalid request" }, { status: 400 });
    }

    const imageData = await QRCode.toDataURL(parsed.data.propertyUrl, { margin: 1, width: 400, color: { dark: "#0b0b0b", light: "#ffffff" } });

    const result = await prisma.qrCode.create({
      data: {
        userId: user.id,
        propertyUrl: parsed.data.propertyUrl,
        imageData,
      },
    });

    await prisma.activity.create({
      data: {
        userId: user.id,
        type: "QR_CODE",
        title: "QR code generated",
        description: parsed.data.propertyUrl,
      },
    });

    return NextResponse.json({ message: "QR code generated.", result });
  } catch (error) {
    return handleApiError(error);
  }
}