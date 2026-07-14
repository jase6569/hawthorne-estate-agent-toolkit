import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { authSchema } from "@/lib/validators";
import { createSessionToken, setSessionCookie, verifyPassword } from "@/lib/auth";
import { handleApiError } from "@/lib/api-error";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = authSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ message: parsed.error.issues[0]?.message ?? "Invalid request" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { email: parsed.data.email } });

    if (!user) {
      return NextResponse.json({ message: "No account found for that email address." }, { status: 401 });
    }

    const isValid = await verifyPassword(parsed.data.password, user.passwordHash);

    if (!isValid) {
      return NextResponse.json({ message: "The password is incorrect." }, { status: 401 });
    }

    const token = await createSessionToken(user);
    await setSessionCookie(token);

    await prisma.activity.create({
      data: {
        userId: user.id,
        type: "LOGIN",
        title: "Signed in",
        description: "Agent authenticated successfully.",
      },
    });

    return NextResponse.json({ message: "Signed in successfully." });
  } catch (error) {
    return handleApiError(error);
  }
}