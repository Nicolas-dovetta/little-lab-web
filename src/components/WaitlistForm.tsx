"use client";

import { FormEvent, useState } from "react";
import { track } from "@vercel/analytics";

export function WaitlistForm() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "error">("idle");
  const [message, setMessage] = useState("");

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setMessage("");
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name: name || undefined }),
      });
      const data = await res.json();
      if (!res.ok) {
        setStatus("error");
        setMessage(data.error || "Something went wrong.");
        return;
      }
      setStatus("ok");
      setMessage(data.message || "You are on the waitlist.");
      setEmail("");
      setName("");
      track("kits_waitlist_signup");
    } catch {
      setStatus("error");
      setMessage("Network error — try again in a moment.");
    }
  }

  return (
    <form onSubmit={onSubmit} className="flex w-full max-w-md flex-col gap-3">
      <label className="text-sm font-medium text-ink" htmlFor="waitlist-name">
        Name <span className="font-normal text-ink-muted">(optional)</span>
      </label>
      <input
        id="waitlist-name"
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Alex"
        className="rounded-2xl border border-sage-200 bg-white px-4 py-2.5 text-sm outline-none ring-sage-400 focus:ring-2"
      />
      <label className="text-sm font-medium text-ink" htmlFor="waitlist-email">
        Email
      </label>
      <input
        id="waitlist-email"
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@example.com"
        className="rounded-2xl border border-sage-200 bg-white px-4 py-2.5 text-sm outline-none ring-sage-400 focus:ring-2"
      />
      <button
        type="submit"
        disabled={status === "loading"}
        className="mt-1 rounded-full bg-sage-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-sage-700 disabled:opacity-60"
      >
        {status === "loading" ? "Joining…" : "Join the kit waitlist"}
      </button>
      {message && (
        <p className={`text-sm ${status === "ok" ? "text-sage-700" : "text-red-700"}`}>{message}</p>
      )}
    </form>
  );
}
