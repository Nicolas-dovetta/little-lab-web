import type { KnowThisPanel } from "@/db/schema";

/**
 * `<!-- panel:N -->` on its own line inside `knowThis.mechanism` places
 * `knowThis.panels[N - 1]` directly above the paragraphs that follow it.
 * Same marker the little-lab physics-rewrite.md files use, so an approved
 * rewrite pastes in unchanged.
 */
export const PANEL_MARKER = /<!--\s*panel:(\d+)\s*-->/g;

export type MechanismBlock = {
  /** 1-based panel number from the marker, or null for text before the first marker. */
  panelNumber: number | null;
  panel: KnowThisPanel | null;
  paragraphs: string[];
};

function toParagraphs(text: string): string[] {
  return text
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);
}

/**
 * Split a mechanism into ordered blocks: optional intro text, then one block
 * per marker with its panel image and the paragraphs up to the next marker.
 * Panels no marker points at are shown first (old "sketch on top" behaviour),
 * and a marker without a matching panel keeps its text.
 */
export function mechanismBlocks(
  mechanism: string | null | undefined,
  panels?: KnowThisPanel[] | null,
): MechanismBlock[] {
  const text = mechanism ?? "";
  const list = panels ?? [];
  const blocks: MechanismBlock[] = [];
  const used = new Set<number>();
  const markers = [...text.matchAll(PANEL_MARKER)];

  const intro = toParagraphs(markers.length ? text.slice(0, markers[0].index) : text);
  markers.forEach((m, i) => {
    const n = Number(m[1]);
    const start = (m.index ?? 0) + m[0].length;
    const end = i + 1 < markers.length ? markers[i + 1].index : text.length;
    const panel = list[n - 1] ?? null;
    if (panel) used.add(n - 1);
    blocks.push({ panelNumber: n, panel, paragraphs: toParagraphs(text.slice(start, end)) });
  });

  const unplaced: MechanismBlock[] = list
    .map((panel, i) => ({ panel, i }))
    .filter(({ i }) => !used.has(i))
    .map(({ panel, i }) => ({ panelNumber: i + 1, panel, paragraphs: [] }));

  const head: MechanismBlock[] = intro.length
    ? [{ panelNumber: null, panel: null, paragraphs: intro }]
    : [];
  return [...unplaced, ...head, ...blocks].filter(
    (b) => b.panel !== null || b.paragraphs.length > 0,
  );
}

/** Mechanism text with panel markers removed (for plain-text uses). */
export function stripPanelMarkers(text: string | null | undefined): string {
  return (text ?? "")
    .replace(PANEL_MARKER, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}
