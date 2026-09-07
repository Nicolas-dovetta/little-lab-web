import { NextResponse } from "next/server";
import { getDb } from "@/db";
import { contactMessages } from "@/db/schema";
import { isValidEmail, normalizeEmail } from "@/lib/email";

const MAX_MESSAGE_LEN = 2000;
const MAX_NAME_LEN = 200;

async function sendContactEmail(opts: {
  name: string | null;
  email: string;
  message: string;
  source: string;
}) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return;

  const to = process.env.CONTACT_TO_EMAIL || "nicolas.dovetta@gmail.com";
  const from = process.env.CONTACT_FROM_EMAIL || "onboarding@resend.dev";
  const fromLabel = opts.name ? `${opts.name} via Weekend Experiments` : "Weekend Experiments contact";
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

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: `${fromLabel} <${from}>`,
      to: [to],
      reply_to: opts.email,
      subject,
      text,
    }),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    console.error("contact email failed:", res.status, body.slice(0, 300));
  }
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
