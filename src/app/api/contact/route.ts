import { NextResponse } from "next/server";
import { getDb } from "@/db";
import { contactMessages } from "@/db/schema";
import { isValidEmail, normalizeEmail, sendResendEmail } from "@/lib/email";

const MAX_MESSAGE_LEN = 2000;
const MAX_NAME_LEN = 200;

async function sendContactEmail(opts: {
  name: string | null;
  email: string;
  message: string;
  source: string;
}) {
  const to = process.env.CONTACT_TO_EMAIL || "nicolas.dovetta@gmail.com";
  const subject = opts.name
    ? `Question from ${opts.name}`
    : "New question from Weekend Experiments";

  const text = [
    opts.name ? `Name: ${opts.name}` : "Name: (not provided)",
    `Email: ${opts.email}`,
    `Source: ${opts.source}`,
    "",
    opts.message,
  ].join("\n");

  await sendResendEmail({
    to,
    subject,
    text,
    replyTo: opts.email,
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = typeof body.email === "string" ? normalizeEmail(body.email) : "";
    const message =
      typeof body.message === "string" ? body.message.trim().slice(0, MAX_MESSAGE_LEN) : "";
    const name =
      typeof body.name === "string" && body.name.trim()
        ? body.name.trim().slice(0, MAX_NAME_LEN)
        : null;
    const source =
      typeof body.source === "string" && body.source.trim() ? body.source.trim() : "about";

    if (!isValidEmail(email)) {
      return NextResponse.json({ error: "Please enter a valid email." }, { status: 400 });
    }
    if (!message) {
      return NextResponse.json({ error: "Please enter a message." }, { status: 400 });
    }

    const db = getDb();
    await db.insert(contactMessages).values({ name, email, message, source });

    try {
      await sendContactEmail({ name, email, message, source });
    } catch (err) {
      console.error(
        "contact email error (message still saved):",
        err instanceof Error ? err.message : "error",
      );
    }

    return NextResponse.json({ ok: true, message: "Thanks — your question was sent." });
  } catch (err) {
    console.error("contact submit failed:", err instanceof Error ? err.message : "error");
    return NextResponse.json({ error: "Could not send your question. Try again later." }, { status: 500 });
  }
}
