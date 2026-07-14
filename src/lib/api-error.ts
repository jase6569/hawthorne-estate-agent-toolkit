import { NextResponse } from "next/server";

export function handleApiError(error: unknown) {
  console.error(error);
  return NextResponse.json({ message: "Something went wrong. Please try again." }, { status: 500 });
}
