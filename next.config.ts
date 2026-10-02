import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  trailingSlash: false,
  // The vote page applies scripts/migrate-vote.sql when this week's ballot is missing.
  outputFileTracingIncludes: {
    "/vote": ["./scripts/migrate-vote.sql"],
    "/api/vote": ["./scripts/migrate-vote.sql"],
  },
};

export default nextConfig;
