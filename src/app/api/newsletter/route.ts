import { NextResponse } from "next/server";
import { getDb } from "@/db";
import { newsletterSubscribers } from "@/db/schema";
import { isValidEmail, normalizeEmail } from "@/lib/email";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = typeof body.email === "string" ? normalizeEmail(body.email) : "";
    const source = typeof body.source === "string" && body.source.trim() ? body.source.trim() : "website";

    if (!isValidEmail(email)) {
      return NextResponse.json({ error: "Please enter a valid email." }, { status: 400 });
    }

    const db = getDb();
    await db
      .insert(newsletterSubscribers)
      .values({ email, source })
      .onConflictDoNothing({ target: newsletterSubscribers.email });

    return NextResponse.json({ ok: true, message: "Thanks — you are subscribed." });
  } catch (err) {
    console.error("newsletter signup failed:", err instanceof Error ? err.message : "error");
    return NextResponse.json({ error: "Could not save signup. Try again later." }, { status: 500 });
  }
}
