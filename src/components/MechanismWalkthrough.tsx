import Image from "next/image";
import type { KnowThis, KnowThisDiagram, KnowThisPanel } from "@/db/schema";
import { mechanismBlocks } from "@/lib/mechanism";

const FRAME = "block h-auto w-full rounded-2xl border border-sage-200/80 bg-white";

/**
 * Mechanism body. With `panels`, each sketch panel renders full width of the
 * text column directly above its own walk-through paragraphs (see
 * `mechanismBlocks`). Without `panels`, the legacy `diagram` + text layout.
 */
export function MechanismWalkthrough({
  knowThis,
  className = "text-sm text-ink-muted",
}: {
  knowThis: KnowThis;
  className?: string;
}) {
  if (knowThis.panels && knowThis.panels.length > 0) {
    const blocks = mechanismBlocks(knowThis.mechanism, knowThis.panels);
    return (
      <div className={`mt-2 space-y-4 ${className}`}>
        {blocks.map((block, index) => (
          <div
            key={`${block.panelNumber ?? "intro"}-${index}`}
            className={block.panel && index > 0 ? "space-y-3 pt-4" : "space-y-3"}
          >
            {block.panel && <SketchPanel panel={block.panel} />}
            {block.paragraphs.map((p, i) => (
              <p key={i} className="whitespace-pre-line">
                {p}
              </p>
            ))}
          </div>
        ))}
      </div>
    );
  }

  return (
    <>
      {knowThis.diagram?.imageUrl && <MechanismDiagram diagram={knowThis.diagram} />}
      <p className={`mt-1 whitespace-pre-line ${className}`}>{knowThis.mechanism}</p>
    </>
  );
}

/**
 * Pre-made WebP with PNG fallback, served as-is (no re-encode, so the thin
 * sketch labels stay crisp). width/height reserve space: no layout shift.
 */
function SketchPanel({ panel }: { panel: KnowThisPanel }) {
  return (
    <figure>
      <picture>
        {panel.webpUrl && <source srcSet={panel.webpUrl} type="image/webp" />}
        <img
          src={panel.imageUrl}
          alt={panel.alt}
          width={panel.width}
          height={panel.height}
          loading="lazy"
          decoding="async"
          className={FRAME}
        />
      </picture>
    </figure>
  );
}

function MechanismDiagram({ diagram }: { diagram: KnowThisDiagram }) {
  const small = diagram.smallScreen ?? [];
  return (
    <figure className="mt-2 mb-3">
      <Image
        src={diagram.imageUrl}
        alt={diagram.alt}
        width={diagram.width}
        height={diagram.height}
        className={small.length > 0 ? `hidden sm:block ${FRAME}` : FRAME}
        sizes="(max-width: 1024px) 100vw, 40rem"
      />
      {small.length > 0 && (
        <div className="space-y-3 sm:hidden">
          {small.map((img) => (
            <Image
              key={img.imageUrl}
              src={img.imageUrl}
              alt={img.alt}
              width={img.width}
              height={img.height}
              className={FRAME}
              sizes="100vw"
            />
          ))}
        </div>
      )}
    </figure>
  );
}
