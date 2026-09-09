export function isValidEmail(email: string): boolean {
  const trimmed = email.trim();
  if (trimmed.length < 5 || trimmed.length > 254) return false;
  // Practical validation — good enough for signup forms
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed);
}

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export function resendKey(): string {
  return (
    process.env.RESEND_API_KEY?.trim() ||
    process.env.RESEND_API?.trim() ||
    process.env.resend_api?.trim() ||
    ""
  );
}

export function mailFrom(): string {
  return (
    process.env.CONTACT_FROM_EMAIL?.trim() ||
    process.env.MAIL_FROM?.trim() ||
    "Weekend Experiments <hello@weekend-experiments.app>"
  );
}

export async function sendResendEmail(opts: {
  to: string | string[];
  subject: string;
  text: string;
  replyTo?: string;
}): Promise<void> {
  const apiKey = resendKey();
  if (!apiKey) {
    console.error("sendResendEmail: missing RESEND_API_KEY");
    return;
  }

  const to = Array.isArray(opts.to) ? opts.to : [opts.to];
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: mailFrom(),
      to,
      subject: opts.subject,
      text: opts.text,
      ...(opts.replyTo ? { reply_to: opts.replyTo } : {}),
    }),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    console.error("resend email failed:", res.status, body.slice(0, 300));
  }
}
