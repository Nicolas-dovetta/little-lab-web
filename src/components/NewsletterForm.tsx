"use client";

import { FormEvent, useState } from "react";
import { track } from "@vercel/analytics";

export function NewsletterForm({ source = "newsletter" }: { source?: string }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "error">("idle");
  const [message, setMessage] = useState("");

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setMessage("");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source }),
      });
      const data = await res.json();
      if (!res.ok) {
        setStatus("error");
        setMessage(data.error || "Something went wrong.");
        return;
      }
      setStatus("ok");
      setMessage(data.message || "You are on the list.");
      setEmail("");
      track("newsletter_signup", { source });
    } catch {
      setStatus("error");
      setMessage("Network error — try again in a moment.");
    }
  }

  return (
    <form onSubmit={onSubmit} className="flex w-full max-w-md flex-col gap-3 sm:flex-row">
      <label className="sr-only" htmlFor={`email-${source}`}>
        Email
      </label>
      <input
        id={`email-${source}`}
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@example.com"
        className="flex-1 rounded-full border border-sage-200 bg-white px-4 py-2.5 text-sm text-ink outline-none ring-sage-400 placeholder:text-ink-muted/70 focus:ring-2"
      />
      <button
        type="submit"
        disabled={status === "loading"}
        className="rounded-full bg-sage-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-sage-700 disabled:opacity-60"
      >
        {status === "loading" ? "Joining…" : "Subscribe"}
      </button>
      {message && (
        <p className={`text-sm sm:basis-full ${status === "ok" ? "text-sage-700" : "text-red-700"}`}>
          {message}
        </p>
      )}
    </form>
  );
}
