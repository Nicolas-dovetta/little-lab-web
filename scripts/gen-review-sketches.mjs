import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const outDir = join(dirname(fileURLToPath(import.meta.url)), "..", "public", "images", "review");
mkdirSync(outDir, { recursive: true });

const ink = "#2B2A33";
const orange = "#E0562B";
const water = "#CFE7F4";
const faint = "#8FBBD6";
const cream = "#FBF6EC";
const warm = "#F6D2A8";
const paper = "#F3E6C8";
const fiber = "#C4A574";

function doc(body) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800">
  <rect width="1200" height="800" fill="${cream}"/>
  <defs>
    <marker id="ah" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse">
      <path d="M 0 1.2 L 9 5 L 0 8.8 Z" fill="${orange}"/>
    </marker>
  </defs>
  ${body}
</svg>
`;
}

function text(x, y, str, size = 28, anchor = "start", weight = "600") {
  return `<text x="${x}" y="${y}" fill="${ink}" font-family="Georgia, 'Times New Roman', serif" font-size="${size}" font-weight="${weight}" text-anchor="${anchor}">${str}</text>`;
}
function label(x, y, str, size = 26, anchor = "start") {
  return `<text x="${x}" y="${y}" fill="${ink}" font-family="ui-sans-serif, system-ui, sans-serif" font-size="${size}" text-anchor="${anchor}">${str}</text>`;
}
function dashed(x1, y1, x2, y2) {
  return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${orange}" stroke-width="4" stroke-dasharray="10 8" marker-end="url(#ah)"/>`;
}
function dotted(x1, y1, x2, y2) {
  return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${orange}" stroke-width="4" stroke-dasharray="2 8" stroke-linecap="round" marker-end="url(#ah)"/>`;
}
function solid(x1, y1, x2, y2) {
  return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${orange}" stroke-width="4" marker-end="url(#ah)"/>`;
}

function dots(cx, cy, n, spread, r, fill) {
  let s = "";
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2;
    const rad = spread * (0.35 + (i % 5) * 0.13);
    s += `<circle cx="${(cx + Math.cos(a) * rad).toFixed(1)}" cy="${(cy + Math.sin(a) * rad * 0.72).toFixed(1)}" r="${r}" fill="${fill}"/>`;
  }
  return s;
}

const candle1 = doc(`
  ${text(48, 64, "Panel 1  ·  Burning: hot gas, some escapes", 40)}
  <g>
    <rect x="70" y="560" width="430" height="36" rx="10" fill="none" stroke="${ink}" stroke-width="4"/>
    <rect x="86" y="542" width="398" height="22" fill="${water}"/>
    ${label(250, 630, "rim sealed in water", 26, "middle")}
    <rect x="230" y="470" width="70" height="78" rx="8" fill="#F7F1E4" stroke="${ink}" stroke-width="3"/>
    <rect x="260" y="448" width="8" height="26" fill="${ink}"/>
    <path d="M264 400 C286 418 282 446 264 448 C246 446 242 418 264 400 Z" fill="${orange}"/>
    <path d="M150 250 L150 548 L390 548" fill="none" stroke="${ink}" stroke-width="5"/>
    <path d="M390 250 L390 548" fill="none" stroke="${ink}" stroke-width="5"/>
    <path d="M158 258 L382 258 L382 520 L158 520 Z" fill="${warm}" opacity="0.55"/>
    ${dots(270, 390, 10, 78, 7, "#B7B1A6")}
    ${dotted(264, 390, 200, 330)}
    ${dotted(264, 400, 330, 340)}
    ${dashed(168, 530, 96, 500)}
    ${dashed(372, 530, 444, 500)}
    <circle cx="108" cy="512" r="10" fill="${water}" stroke="${orange}" stroke-width="3"/>
    <circle cx="430" cy="512" r="10" fill="${water}" stroke="${orange}" stroke-width="3"/>
    ${label(48, 470, "some escapes", 24)}
    ${label(48, 498, "under the rim", 24)}
  </g>
  <rect x="560" y="140" width="590" height="560" rx="28" fill="#fff" stroke="${ink}" stroke-width="3"/>
  ${text(855, 190, "inside the glass", 34, "middle")}
  ${dots(780, 390, 8, 90, 11, "#C8C2B6")}
  ${dots(1000, 430, 14, 70, 8, "#8E8980")}
  ${label(700, 300, "hot gas: spread out", 28)}
  ${label(900, 560, "outside air, packed closer", 26)}
  ${label(855, 640, "will go out, O₂ still left", 28, "middle")}
`);

const candle2 = doc(`
  ${text(48, 64, "Panel 2  ·  Cooling: outside air pushes water in", 36)}
  <g>
    <rect x="90" y="640" width="500" height="34" rx="10" fill="none" stroke="${ink}" stroke-width="4"/>
    <rect x="106" y="624" width="150" height="18" fill="${water}"/>
    <rect x="424" y="624" width="150" height="18" fill="${water}"/>
    <path d="M200 220 L200 640 L460 220 L460 640" fill="none" stroke="none"/>
    <path d="M200 220 L460 220 L460 640" fill="none" stroke="${ink}" stroke-width="5"/>
    <path d="M200 220 L200 640" fill="none" stroke="${ink}" stroke-width="5"/>
    <rect x="208" y="228" width="244" height="250" fill="#F4EFE4"/>
    <rect x="208" y="478" width="244" height="162" fill="${water}"/>
    <rect x="318" y="560" width="16" height="40" fill="${ink}"/>
    ${dots(330, 360, 18, 72, 7, "#8E8980")}
    <circle cx="230" cy="270" r="7" fill="${faint}"/>
    <circle cx="280" cy="300" r="6" fill="${faint}"/>
    <circle cx="400" cy="268" r="7" fill="${faint}"/>
    <circle cx="360" cy="320" r="5" fill="${faint}"/>
    ${label(214, 300, "fog", 24)}
    ${label(250, 430, "cooled gas shrinks", 24)}
    ${solid(140, 590, 140, 650)}
    ${solid(540, 590, 540, 650)}
    ${solid(270, 500, 270, 545)}
    ${solid(390, 500, 390, 545)}
    ${dashed(230, 640, 300, 520)}
    ${label(36, 570, "outside air", 24)}
    ${label(36, 598, "pushes down", 24)}
  </g>
  <rect x="660" y="180" width="490" height="460" rx="28" fill="#fff" stroke="${ink}" stroke-width="3"/>
  ${text(905, 240, "same dots, now packed", 30, "middle")}
  ${dots(800, 400, 18, 70, 8, "#8E8980")}
  ${dots(1010, 400, 18, 70, 8, "#8E8980")}
  ${label(800, 540, "inside", 26, "middle")}
  ${label(1010, 540, "outside", 26, "middle")}
  ${label(600, 740, "The glass does not pull. Arrows are exaggerated.", 28, "middle")}
`);

function moleculeGrid(x, y, kinds) {
  let s = "";
  const colors = { n: "#C8C2B6", o: "#7EB6D9", a: "#C4A0D4", c: "#8FA88A", e: "none" };
  kinds.forEach((k, i) => {
    const col = i % 10;
    const row = Math.floor(i / 10);
    const cx = x + col * 36;
    const cy = y + row * 36;
    if (k === "e") {
      s += `<circle cx="${cx}" cy="${cy}" r="12" fill="none" stroke="${ink}" stroke-width="2" stroke-dasharray="3 3"/>`;
    } else {
      s += `<circle cx="${cx}" cy="${cy}" r="12" fill="${colors[k]}" stroke="${ink}" stroke-width="2"/>`;
    }
  });
  return s;
}

const before = "n".repeat(78) + "o".repeat(21) + "a";
const after = "n".repeat(78) + "a" + "c".repeat(14) + "e".repeat(7);

const candle3 = doc(`
  ${text(48, 64, "Panel 3  ·  The chemistry is small", 40)}
  ${text(250, 130, "air before", 32, "middle")}
  ${text(860, 130, "if ALL O₂ burned", 32, "middle")}
  ${moleculeGrid(70, 170, before.split(""))}
  ${moleculeGrid(680, 170, after.split(""))}
  ${label(70, 560, "78 N₂   21 O₂   1 Ar", 26)}
  ${label(680, 560, "78 N₂   1 Ar   14 CO₂   7 fewer", 26)}
  ${text(600, 660, "2 CH₂ + 3 O₂  →  2 CO₂ + 2 H₂O (liquid)", 32, "middle")}
  ${label(600, 710, "The flame never gets this far. Most of the oxygen is still there when it goes out.", 26, "middle")}
  <g>
    <circle cx="90" cy="750" r="12" fill="#C8C2B6" stroke="${ink}" stroke-width="2"/>
    ${label(110, 756, "N₂", 22)}
    <circle cx="200" cy="750" r="12" fill="#7EB6D9" stroke="${ink}" stroke-width="2"/>
    ${label(220, 756, "O₂", 22)}
    <circle cx="310" cy="750" r="12" fill="#C4A0D4" stroke="${ink}" stroke-width="2"/>
    ${label(330, 756, "Ar", 22)}
    <circle cx="430" cy="750" r="12" fill="#8FA88A" stroke="${ink}" stroke-width="2"/>
    ${label(450, 756, "CO₂", 22)}
    <circle cx="560" cy="750" r="12" fill="none" stroke="${ink}" stroke-width="2" stroke-dasharray="3 3"/>
    ${label(580, 756, "gone from the gas", 22)}
  </g>
`);

const walk1 = doc(`
  ${text(48, 64, "Panel 1  ·  A paper towel is a bundle of tiny gaps", 38)}
  <g>
    <path d="M160 620 L160 340 L300 340 L300 620" fill="none" stroke="${ink}" stroke-width="5"/>
    <rect x="168" y="460" width="124" height="160" fill="#E25B63"/>
    <rect x="214" y="300" width="22" height="200" fill="${paper}" stroke="${fiber}" stroke-width="3"/>
    <rect x="214" y="430" width="22" height="190" fill="#E25B63"/>
    ${dashed(225, 500, 225, 390)}
    ${label(120, 680, "colored water", 26)}
    ${label(160, 300, "towel", 26)}
  </g>
  <rect x="470" y="130" width="680" height="580" rx="28" fill="#fff" stroke="${ink}" stroke-width="3"/>
  ${text(810, 185, "inside the towel", 34, "middle")}
  <path d="M560 260 C620 420 700 500 760 640" fill="none" stroke="${fiber}" stroke-width="18" stroke-linecap="round"/>
  <path d="M700 240 C760 400 820 520 900 660" fill="none" stroke="${fiber}" stroke-width="18" stroke-linecap="round"/>
  <path d="M860 250 C930 420 980 520 1040 650" fill="none" stroke="${fiber}" stroke-width="18" stroke-linecap="round"/>
  <path d="M640 520 C700 500 760 560 820 540 C880 520 930 470 990 500" fill="none" stroke="#E25B63" stroke-width="16" stroke-linecap="round"/>
  ${dashed(760, 560, 760, 430)}
  ${solid(620, 360, 690, 430)}
  ${solid(980, 360, 910, 450)}
  ${label(560, 230, "fiber pulls (adhesion)", 26)}
  ${label(860, 720, "water holds on (cohesion)", 26)}
  ${label(620, 430, "still dry up here", 26)}
`);

const walk2 = doc(`
  ${text(48, 64, "Panel 2  ·  The gaps can lift water higher than the rim", 36)}
  <g>
    <path d="M80 640 L80 360 L210 360 L210 640" fill="none" stroke="${ink}" stroke-width="5"/>
    <path d="M280 640 L280 360 L410 360 L410 640" fill="none" stroke="${ink}" stroke-width="5"/>
    <rect x="88" y="430" width="114" height="210" fill="#E25B63"/>
    <path d="M150 430 L150 300 Q 245 250 340 360" fill="none" stroke="${paper}" stroke-width="16" stroke-linecap="round"/>
    <path d="M150 430 L150 330" fill="none" stroke="#E25B63" stroke-width="16" stroke-linecap="round"/>
    ${label(145, 690, "full", 26, "middle")}
    ${label(345, 690, "still empty", 26, "middle")}
    ${label(250, 230, "wet only partway", 24, "middle")}
  </g>
  <rect x="500" y="160" width="650" height="520" rx="28" fill="#fff" stroke="${ink}" stroke-width="3"/>
  ${text(825, 215, "narrower gap, taller column", 32, "middle")}
  <rect x="620" y="280" width="70" height="320" fill="none" stroke="${ink}" stroke-width="4"/>
  <rect x="628" y="520" width="54" height="80" fill="${water}"/>
  ${label(655, 640, "wide", 26, "middle")}
  <rect x="860" y="280" width="28" height="320" fill="none" stroke="${ink}" stroke-width="4"/>
  <rect x="864" y="320" width="20" height="280" fill="${water}"/>
  ${label(874, 640, "hair-thin", 26, "middle")}
  ${label(825, 250, "a towel gap is the thin one", 26, "middle")}
`);

const walk3 = doc(`
  ${text(48, 64, "Panel 3  ·  Once the towel is wet across, the higher cup drains", 34)}
  <g>
    <path d="M120 660 L120 300 L300 300 L300 660" fill="none" stroke="${ink}" stroke-width="5"/>
    <path d="M520 660 L520 300 L700 300 L700 660" fill="none" stroke="${ink}" stroke-width="5"/>
    <rect x="128" y="380" width="164" height="280" fill="#E25B63"/>
    <rect x="528" y="500" width="164" height="160" fill="#8E5BD0"/>
    <path d="M210 380 Q 410 200 610 500" fill="none" stroke="#C45B8A" stroke-width="18" stroke-linecap="round"/>
    ${dashed(250, 360, 560, 470)}
    ${solid(180, 360, 180, 430)}
    ${solid(600, 470, 600, 530)}
    <circle cx="300" cy="340" r="8" fill="#E25B63" stroke="${ink}" stroke-width="2"/>
    <circle cx="380" cy="300" r="8" fill="#E25B63" stroke="${ink}" stroke-width="2"/>
    <circle cx="470" cy="330" r="8" fill="#3A5CB0" stroke="${ink}" stroke-width="2"/>
    <circle cx="540" cy="400" r="8" fill="#3A5CB0" stroke="${ink}" stroke-width="2"/>
    ${label(210, 720, "higher", 28, "middle")}
    ${label(610, 720, "lower, and mixing", 28, "middle")}
  </g>
  ${label(600, 250, "dye rides in the water", 28, "middle")}
  ${text(600, 780, "Flow stops when the two surfaces are about level.", 30, "middle")}
`);

const files = {
  "candle-panel-1.svg": candle1,
  "candle-panel-2.svg": candle2,
  "candle-panel-3.svg": candle3,
  "walking-water-panel-1.svg": walk1,
  "walking-water-panel-2.svg": walk2,
  "walking-water-panel-3.svg": walk3,
};

for (const [name, svg] of Object.entries(files)) {
  writeFileSync(join(outDir, name), svg);
  console.log(name, svg.length);
}
