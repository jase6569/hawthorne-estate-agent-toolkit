import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { authSchema } from "@/lib/validators";
import { createSessionToken, hashPassword, setSessionCookie } from "@/lib/auth";

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = authSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ message: parsed.error.issues[0]?.message ?? "Invalid request" }, { status: 400 });
  }

  const existing = await prisma.user.findUnique({ where: { email: parsed.data.email } });

  if (existing) {
    return NextResponse.json({ message: "An account with that email already exists." }, { status: 409 });
  }

  const user = await prisma.user.create({
    data: {
      name: parsed.data.name ?? "Estate Agent",
      email: parsed.data.email,
      passwordHash: await hashPassword(parsed.data.password),
    },
  });

  const token = await createSessionToken(user);
  await setSessionCookie(token);

  await prisma.activity.create({
    data: {
      userId: user.id,
      type: "LOGIN",
      title: "Account created",
      description: "New Hawthorne workspace created.",
    },
  });

  return NextResponse.json({ message: "Account created successfully." });
}