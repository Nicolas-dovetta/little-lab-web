import { NewsletterForm } from "@/components/NewsletterForm";

export const metadata = {
  title: "Newsletter",
  description: "Get Little Lab winners by email.",
};

export default function NewsletterPage() {
  return (
    <div className="mx-auto max-w-xl px-4 py-12 sm:px-6">
      <h1 className="font-display text-3xl font-semibold text-ink">Newsletter</h1>
      <p className="mt-3 text-ink-muted">
        Occasional emails when we publish a tested favorite or open kit preorders. No weekly noise.
      </p>
      <div className="mt-8 rounded-3xl border border-sage-200/80 bg-white p-6 shadow-sm">
        <NewsletterForm source="newsletter" />
      </div>
    </div>
  );
}
