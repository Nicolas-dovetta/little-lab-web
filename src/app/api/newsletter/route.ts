import { NextResponse } from "next/server";
import { getDb } from "@/db";
import { newsletterSubscribers } from "@/db/schema";
import { isValidEmail, normalizeEmail, sendResendEmail } from "@/lib/email";

async function sendWelcomeEmail(email: string) {
  await sendResendEmail({
    to: email,
    subject: "You're on the Weekend Experiments list",
    text: [
      "Thanks for signing up for Weekend Experiments.",
      "",
      "You'll get an email when we publish new experiments — kitchen-table science for curious kids (and the adults who mess around with them).",
      "",
      "No spam. Just new experiments when they go live.",
      "",
      "— Nico",
      "https://www.weekend-experiments.app",
    ].join("\n"),
  });
}

async function notifyOwner(email: string, source: string) {
  const to = process.env.CONTACT_TO_EMAIL || "nicolas.dovetta@gmail.com";
  await sendResendEmail({
    to,
    subject: `New newsletter signup: ${email}`,
    text: [`Email: ${email}`, `Source: ${source}`, "", "Weekend Experiments mailing list"].join("\n"),
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = typeof body.email === "string" ? normalizeEmail(body.email) : "";
    const source =
      typeof body.source === "string" && body.source.trim() ? body.source.trim() : "website";

    if (!isValidEmail(email)) {
      return NextResponse.json({ error: "Please enter a valid email." }, { status: 400 });
    }

    const db = getDb();
    const inserted = await db
      .insert(newsletterSubscribers)
      .values({ email, source })
      .onConflictDoNothing({ target: newsletterSubscribers.email })
      .returning({ email: newsletterSubscribers.email });

    const isNew = inserted.length > 0;

    if (isNew) {
      try {
        await sendWelcomeEmail(email);
      } catch (err) {
        console.error(
          "newsletter welcome email error (signup still saved):",
          err instanceof Error ? err.message : "error",
        );
      }
      try {
        await notifyOwner(email, source);
      } catch (err) {
        console.error(
          "newsletter owner notify error (signup still saved):",
          err instanceof Error ? err.message : "error",
        );
      }
    }

    return NextResponse.json({
      ok: true,
      message: isNew
        ? "Thanks — check your email. We'll ping you when new experiments publish."
        : "You're already on the list — thanks!",
    });
  } catch (err) {
    console.error("newsletter signup failed:", err instanceof Error ? err.message : "error");
    return NextResponse.json({ error: "Could not save signup. Try again later." }, { status: 500 });
  }
}
