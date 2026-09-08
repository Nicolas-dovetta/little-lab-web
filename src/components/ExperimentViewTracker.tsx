"use client";

import { useEffect } from "react";
import { track } from "@vercel/analytics";

/** Fires a privacy-friendly custom event when an experiment detail page is viewed. */
export function ExperimentViewTracker({ slug }: { slug: string }) {
  useEffect(() => {
    track("experiment_view", { slug });
  }, [slug]);

  return null;
}
