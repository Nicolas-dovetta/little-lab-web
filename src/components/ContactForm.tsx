"use client";

import { FormEvent, useState } from "react";

export function ContactForm({ source = "about" }: { source?: string }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "error">("idle");
  const [feedback, setFeedback] = useState("");

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setFeedback("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name || undefined,
          email,
          message,
          source,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setStatus("error");
        setFeedback(data.error || "Something went wrong.");
        return;
      }
      setStatus("ok");
      setFeedback(data.message || "Thanks — your question was sent.");
      setName("");
      setEmail("");
      setMessage("");
    } catch {
      setStatus("error");
      setFeedback("Network error — try again in a moment.");
    }
  }

  return (
    <form onSubmit={onSubmit} className="flex w-full max-w-lg flex-col gap-3">
      <label className="text-sm font-medium text-ink" htmlFor="contact-name">
        Name <span className="font-normal text-ink-muted">(optional)</span>
      </label>
      <input
        id="contact-name"
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Alex"
        maxLength={200}
        className="rounded-2xl border border-sage-200 bg-white px-4 py-2.5 text-sm outline-none ring-sage-400 focus:ring-2"
      />
      <label className="text-sm font-medium text-ink" htmlFor="contact-email">
        Email
      </label>
      <input
        id="contact-email"
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@example.com"
        className="rounded-2xl border border-sage-200 bg-white px-4 py-2.5 text-sm outline-none ring-sage-400 focus:ring-2"
      />
      <label className="text-sm font-medium text-ink" htmlFor="contact-message">
        Message
      </label>
      <textarea
        id="contact-message"
        required
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Ask anything about the experiments, ages, mess, kits…"
        maxLength={2000}
        rows={5}
        className="rounded-2xl border border-sage-200 bg-white px-4 py-2.5 text-sm outline-none ring-sage-400 focus:ring-2"
      />
      <button
        type="submit"
        disabled={status === "loading"}
        className="mt-1 rounded-full bg-sage-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-sage-700 disabled:opacity-60"
      >
        {status === "loading" ? "Sending…" : "Send question"}
      </button>
      {feedback && (
        <p className={`text-sm ${status === "ok" ? "text-sage-700" : "text-red-700"}`}>{feedback}</p>
      )}
    </form>
  );
}
