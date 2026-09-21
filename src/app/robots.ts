import type { MetadataRoute } from "next";
import { SITE_ORIGIN } from "@/lib/site";

const allowAll = { allow: "/", disallow: ["/api/"] as string[] };

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", ...allowAll },
      // OpenAI — search/citation (keep allowed)
      { userAgent: "OAI-SearchBot", ...allowAll },
      { userAgent: "ChatGPT-User", ...allowAll },
      // OpenAI training (allow if you want content in future models; Disallow if not)
      { userAgent: "GPTBot", ...allowAll },
      // Anthropic
      { userAgent: "Claude-SearchBot", ...allowAll },
      { userAgent: "Claude-User", ...allowAll },
      { userAgent: "ClaudeBot", ...allowAll },
      // Perplexity
      { userAgent: "PerplexityBot", ...allowAll },
      { userAgent: "Perplexity-User", ...allowAll },
      // Google generative products (separate from Googlebot / Search)
      { userAgent: "Google-Extended", ...allowAll },
    ],
    sitemap: `${SITE_ORIGIN}/sitemap.xml`,
    host: SITE_ORIGIN,
  };
}
