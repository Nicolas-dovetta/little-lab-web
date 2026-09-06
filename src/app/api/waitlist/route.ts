import { NextResponse } from "next/server";
import { getDb } from "@/db";
import { kitWaitlist } from "@/db/schema";
import { isValidEmail, normalizeEmail } from "@/lib/email";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = typeof body.email === "string" ? normalizeEmail(body.email) : "";
    const name = typeof body.name === "string" && body.name.trim() ? body.name.trim() : null;

    if (!isValidEmail(email)) {
      return NextResponse.json({ error: "Please enter a valid email." }, { status: 400 });
    }

    const db = getDb();
    await db
      .insert(kitWaitlist)
      .values({ email, name })
      .onConflictDoNothing({ target: kitWaitlist.email });

    return NextResponse.json({ ok: true, message: "You are on the kit waitlist." });
  } catch (err) {
    console.error("waitlist signup failed:", err instanceof Error ? err.message : "error");
    return NextResponse.json({ error: "Could not save signup. Try again later." }, { status: 500 });
  }
}
