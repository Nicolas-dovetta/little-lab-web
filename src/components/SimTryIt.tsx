"use client";

import { useEffect, useRef, useState } from "react";
import { SIM_HEIGHT_MESSAGE, sanitizeSimHeight, type SimEmbed } from "@/lib/sims";

/**
 * "Try it" box: title, one sentence and an inline sim. The sim posts its
 * height (see scripts/sync-sims.mjs)
 * and the iframe grows to fit, so there is no scroll box inside the page.
 */
export function SimTryIt({ sim }: { sim: SimEmbed }) {
  const [height, setHeight] = useState(sim.fallbackHeight);
  const frameRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    function onMessage(event: MessageEvent) {
      if (!frameRef.current || event.source !== frameRef.current.contentWindow) return;
      const data = event.data as { type?: unknown; height?: unknown } | null;
      if (!data || data.type !== SIM_HEIGHT_MESSAGE) return;
      const h = sanitizeSimHeight(data.height);
      if (h !== null) setHeight(h);
    }
    window.addEventListener("message", onMessage);
    frameRef.current?.focus({ preventScroll: true });
    return () => window.removeEventListener("message", onMessage);
  }, []);

  return (
    <section
      aria-labelledby="try-it-heading"
      className="overflow-hidden rounded-3xl border border-sage-200/80 bg-sage-50/80 shadow-sm"
    >
      <div className="p-5 sm:p-6">
        <h2 id="try-it-heading" className="font-display text-2xl font-semibold text-ink">
          {sim.title}
        </h2>
        <p className="mt-2 text-sm text-ink-muted">{sim.blurb}</p>
      </div>
      <div className="border-t border-sage-200 bg-cream">
        <iframe
          ref={frameRef}
          src={sim.src}
          title={sim.iframeTitle}
          loading="lazy"
          sandbox="allow-scripts"
          referrerPolicy="no-referrer"
          className="block w-full border-0"
          style={{ height }}
        />
      </div>
    </section>
  );
}
