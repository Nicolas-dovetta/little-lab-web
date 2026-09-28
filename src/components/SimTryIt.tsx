"use client";

import { useEffect, useRef, useState } from "react";
import { SIM_HEIGHT_MESSAGE, sanitizeSimHeight, type SimEmbed } from "@/lib/sims";

/**
 * "Try it" box: title, one sentence and a button. The sim iframe only loads
 * when the button is tapped. The sim posts its height (see scripts/sync-sims.mjs)
 * and the iframe grows to fit, so there is no scroll box inside the page.
 */
export function SimTryIt({ sim }: { sim: SimEmbed }) {
  const [loaded, setLoaded] = useState(false);
  const [height, setHeight] = useState(sim.fallbackHeight);
  const frameRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (!loaded) return;
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
  }, [loaded]);

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
        {!loaded && (
          <button
            type="button"
            onClick={() => setLoaded(true)}
            className="mt-4 inline-flex rounded-full bg-sage-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-sage-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sage-700"
          >
            {sim.buttonLabel}
          </button>
        )}
      </div>
      {loaded && (
        <div className="border-t border-sage-200 bg-cream">
          <iframe
            ref={frameRef}
            src={sim.src}
            title={sim.iframeTitle}
            sandbox="allow-scripts"
            referrerPolicy="no-referrer"
            className="block w-full border-0"
            style={{ height }}
          />
        </div>
      )}
    </section>
  );
}
