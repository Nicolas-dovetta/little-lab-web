/**
 * Walking-water rainbow: colored water crossing paper-towel bridges.
 *
 * A towel is a bundle of narrow cellulose gaps. Water climbs them by capillary
 * suction (Lucas–Washburn) up to Jurin's height. Once a bridge is wet from
 * cup to cup, flow between the free surfaces is Darcy flow driven by the
 * water-level difference. Dye is dissolved, so it only moves with a volume
 * of water. Nothing stains a dry towel.
 */

export const WALK = {
  RHO: 997,
  G: 9.80665,
  ETA: 1.0e-3,
  SIGMA: 0.072,
  COS_THETA: 0.97,
  /** Effective pore radius of a kitchen paper towel, m. */
  PORE_R: 25e-6,
  /** Path tortuosity. Slows Washburn relative to a straight capillary. */
  TAU: 8,
  WIDTH: 0.03,
  THICK: 6e-4,
  POROSITY: 0.75,
  /**
   * Effective permeability of a loose wet paper-towel strip, m².
   * A straight bundle of these pores would be near 6×10⁻¹¹; a creased towel
   * passes less. 1.6×10⁻⁹ is the value that moves about 4 mL/min through one
   * bridge at the start (6.5 cm head, ~20 cm path) — a few minutes to see
   * color, the better part of an hour to even the cups.
   */
  KAPPA: 1.6e-9,
  /** Towel running from rim to rim, m. The climb down into each cup is added from the waterline. */
  ACROSS: 0.08,
  CUP_R: 0.034,
  CUP_H: 0.095,
  H_FULL: 0.065,
} as const;

export type CupCount = 3 | 5 | 7;

export type Dye = [number, number, number];

export type Cup = {
  /** Water height, m. */
  h: number;
  /** Dye mass in each channel. Concentration is mass / volume. Pure color starts at 1. */
  dye: Dye;
};

export type Bridge = {
  /** Wetted length grown from each end, m, along the current path. */
  fromA: number;
  fromB: number;
  connected: boolean;
  /** Dye mass sitting in the pore water that first wetted each side. */
  dyeA: Dye;
  dyeB: Dye;
  volA: number;
  volB: number;
};

export type WalkingState = {
  /** Model seconds (not wall-clock). */
  t: number;
  cups: Cup[];
  bridges: Bridge[];
};

export type WalkingView = {
  seconds: number;
  minutes: number;
  cups: { hCm: number; mL: number; conc: Dye; color: string }[];
  bridges: {
    wetFractionA: number;
    wetFractionB: number;
    connected: boolean;
    fromA: number;
    fromB: number;
    length: number;
    upA: number;
    upB: number;
    across: number;
    colorA: string;
    colorB: string;
  }[];
  headline: string;
  detail: string;
};

const ZERO: Dye = [0, 0, 0];
const DYE_RGB: Dye[] = [
  [196, 48, 52],
  [230, 176, 42],
  [36, 92, 176],
];
const WATER_RGB: Dye = [207, 231, 244];

/** Even cups. Three cups is red opposite blue. Five and seven walk the rainbow. */
function fillsFor(count: CupCount): Dye[] {
  if (count === 3) return [[1, 0, 0], [0, 0, 1]];
  if (count === 5) return [[1, 0, 0], [0, 1, 0], [0, 0, 1]];
  return [[1, 0, 0], [0, 1, 0], [0, 0, 1], [1, 0, 0]];
}

export function cupArea(): number {
  return Math.PI * WALK.CUP_R * WALK.CUP_R;
}

export function poreArea(): number {
  return WALK.WIDTH * WALK.THICK * WALK.POROSITY;
}

/** Jurin height for these pores, m. */
export function jurinHeight(): number {
  return (2 * WALK.SIGMA * WALK.COS_THETA) / (WALK.RHO * WALK.G * WALK.PORE_R);
}

/** Lucas–Washburn constant k in x² = 2 k t, m²/s. */
export function washburnK(): number {
  return (WALK.SIGMA * WALK.PORE_R * WALK.COS_THETA) / (4 * WALK.ETA * WALK.TAU);
}

export function pathLength(hA: number, hB: number): number {
  const upA = Math.max(0.012, WALK.CUP_H - hA);
  const upB = Math.max(0.012, WALK.CUP_H - hB);
  return upA + WALK.ACROSS + upB;
}

export function cupVolume(h: number): number {
  return cupArea() * Math.max(0, h);
}

function emptyBridge(): Bridge {
  return {
    fromA: 0,
    fromB: 0,
    connected: false,
    dyeA: [0, 0, 0],
    dyeB: [0, 0, 0],
    volA: 0,
    volB: 0,
  };
}

export function createWalking(count: CupCount): WalkingState {
  const cups: Cup[] = [];
  const fills = fillsFor(count);
  let filled = 0;
  for (let i = 0; i < count; i++) {
    const on = i % 2 === 0;
    const h = on ? WALK.H_FULL : 0;
    const conc = on ? fills[filled++] : ZERO;
    const v = cupVolume(h);
    cups.push({
      h,
      dye: [conc[0] * v, conc[1] * v, conc[2] * v],
    });
  }
  return {
    t: 0,
    cups,
    bridges: Array.from({ length: count - 1 }, emptyBridge),
  };
}

function concOf(cup: Cup): Dye {
  const v = cupVolume(cup.h);
  if (v < 1e-9) return [0, 0, 0];
  return [cup.dye[0] / v, cup.dye[1] / v, cup.dye[2] / v];
}

/** Move `dV` of water (and its dye) from cup `src` into cup `dst`. */
function transfer(src: Cup, dst: Cup, dV: number): number {
  const available = cupVolume(src.h);
  const moved = Math.max(0, Math.min(dV, available));
  if (moved <= 0) return 0;
  const frac = moved / available;
  for (let k = 0; k < 3; k++) {
    const dm = src.dye[k] * frac;
    src.dye[k] -= dm;
    dst.dye[k] += dm;
  }
  src.h = (available - moved) / cupArea();
  dst.h = (cupVolume(dst.h) + moved) / cupArea();
  return moved;
}

/** Pull `dV` out of a cup into towel storage (dye mass + pore volume). */
function soak(cup: Cup, dV: number, dyeStore: Dye): number {
  const available = cupVolume(cup.h);
  const moved = Math.max(0, Math.min(dV, available));
  if (moved <= 0) return 0;
  const frac = moved / available;
  for (let k = 0; k < 3; k++) {
    const dm = cup.dye[k] * frac;
    cup.dye[k] -= dm;
    dyeStore[k] += dm;
  }
  cup.h = (available - moved) / cupArea();
  return moved;
}

function grow(
  cup: Cup,
  bridge: Bridge,
  side: "A" | "B",
  other: number,
  length: number,
  dt: number,
): void {
  if (bridge.connected) return;
  if (cup.h < 0.002) return;
  const mine = side === "A" ? bridge.fromA : bridge.fromB;
  const room = length - other - mine;
  if (room <= 1e-4) {
    bridge.connected = true;
    return;
  }
  // Stall if the crest is above Jurin's height. A kitchen rim is not.
  const climb = Math.max(0, WALK.CUP_H - cup.h);
  if (climb > jurinHeight()) return;
  const x = Math.max(mine, WALK.PORE_R);
  let dx = (washburnK() / x) * dt;
  if (dx > room) dx = room;
  const dV = poreArea() * dx;
  const store = side === "A" ? bridge.dyeA : bridge.dyeB;
  const moved = soak(cup, dV, store);
  const actualDx = poreArea() > 0 ? moved / poreArea() : 0;
  if (side === "A") {
    bridge.fromA += actualDx;
    bridge.volA += moved;
  } else {
    bridge.fromB += actualDx;
    bridge.volB += moved;
  }
  if (bridge.fromA + bridge.fromB >= length - 1e-4) bridge.connected = true;
}

/** Volume flow from cup A toward cup B, m³/s. Positive means A is higher. */
export function bridgeFlowM3PerS(hA: number, hB: number): number {
  const L = Math.max(0.05, pathLength(hA, hB));
  const dh = hA - hB;
  return ((WALK.KAPPA * poreArea()) / (WALK.ETA * L)) * WALK.RHO * WALK.G * dh;
}

function flowConnected(a: Cup, b: Cup, bridge: Bridge, dt: number): void {
  if (!bridge.connected) return;
  const dV = bridgeFlowM3PerS(a.h, b.h) * dt;
  if (dV > 0) transfer(a, b, dV);
  else if (dV < 0) transfer(b, a, -dV);
}

function stepOnce(state: WalkingState, dt: number): void {
  state.t += dt;
  for (let i = 0; i < state.bridges.length; i++) {
    const bridge = state.bridges[i];
    const a = state.cups[i];
    const b = state.cups[i + 1];
    const L = pathLength(a.h, b.h);
    if (!bridge.connected) {
      // Seed a wet end wherever the towel is already dunked, once.
      if (bridge.fromA === 0 && a.h > 0.01) {
        const seed = Math.min(0.004, L * 0.2);
        const moved = soak(a, poreArea() * seed, bridge.dyeA);
        bridge.fromA = poreArea() > 0 ? moved / poreArea() : 0;
        bridge.volA += moved;
      }
      if (bridge.fromB === 0 && b.h > 0.01) {
        const seed = Math.min(0.004, L * 0.2);
        const moved = soak(b, poreArea() * seed, bridge.dyeB);
        bridge.fromB = poreArea() > 0 ? moved / poreArea() : 0;
        bridge.volB += moved;
      }
      grow(a, bridge, "A", bridge.fromB, L, dt);
      grow(b, bridge, "B", bridge.fromA, L, dt);
    } else {
      flowConnected(a, b, bridge, dt);
    }
  }
}

export function stepWalking(state: WalkingState, dt: number): void {
  if (!(dt > 0)) return;
  const sub = 0.25;
  const n = Math.ceil(dt / sub);
  const h = dt / n;
  for (let i = 0; i < n; i++) stepOnce(state, h);
}

export function totalDye(state: WalkingState): Dye {
  const sum: Dye = [0, 0, 0];
  for (const cup of state.cups) {
    sum[0] += cup.dye[0];
    sum[1] += cup.dye[1];
    sum[2] += cup.dye[2];
  }
  for (const bridge of state.bridges) {
    for (const store of [bridge.dyeA, bridge.dyeB]) {
      sum[0] += store[0];
      sum[1] += store[1];
      sum[2] += store[2];
    }
  }
  return sum;
}

export function totalWater(state: WalkingState): number {
  let v = 0;
  for (const cup of state.cups) v += cupVolume(cup.h);
  for (const bridge of state.bridges) v += bridge.volA + bridge.volB;
  return v;
}

const DYE_NAMES_RGB = DYE_RGB;

export function waterColor(conc: Dye): string {
  const sum = conc[0] + conc[1] + conc[2];
  if (sum < 1e-4) return `rgb(${WATER_RGB.join(",")})`;
  const dye = [0, 1, 2].map((i) =>
    (conc[0] * DYE_NAMES_RGB[0][i] + conc[1] * DYE_NAMES_RGB[1][i] + conc[2] * DYE_NAMES_RGB[2][i]) / sum,
  );
  const a = 0.84 * Math.min(1, sum);
  const rgb = WATER_RGB.map((w, i) => Math.round(w * (1 - a) + dye[i] * a));
  return `rgb(${rgb.join(",")})`;
}

function towelColor(dye: Dye, vol: number): string {
  if (vol < 1e-9) return "rgb(232, 224, 206)";
  return waterColor([dye[0] / vol, dye[1] / vol, dye[2] / vol]);
}

export function walkingView(state: WalkingState): WalkingView {
  const anyConnected = state.bridges.some((b) => b.connected);
  const allConnected = state.bridges.every((b) => b.connected);
  const heights = state.cups.map((c) => c.h);
  const spread = Math.max(...heights) - Math.min(...heights);
  const even = allConnected && spread < 0.004 && state.t > 60;

  let headline = "Towels are dry. Filled cups sit at 6.5 cm.";
  let detail =
    "Press Start. Water has to climb the gaps in the towel before any color can show up in an empty cup.";
  if (!even && !anyConnected && state.t > 0) {
    headline = "Water is climbing the towel. The empty cups are still dry.";
    detail =
      "The wet front moves because the gaps pull water up. Dye is in that water, so the dry side of the towel stays pale.";
  } else if (!even && anyConnected) {
    headline = "A towel is wet all the way across. Water is moving toward the lower cup.";
    detail =
      "Once both ends are connected, the higher water surface pushes flow through the wet towel. Color arrives only with that water, and the two streams mix in the cup.";
  } else if (even) {
    headline = "Levels have mostly evened out.";
    detail =
      "Each empty cup holds a mix of the neighbors that flowed in. The towels are stained with the water that first soaked them. No color moved ahead of the wet front.";
  }

  return {
    seconds: state.t,
    minutes: state.t / 60,
    cups: state.cups.map((cup) => {
      const conc = concOf(cup);
      return {
        hCm: cup.h * 100,
        mL: cupVolume(cup.h) * 1e6,
        conc,
        color: waterColor(conc),
      };
    }),
    bridges: state.bridges.map((bridge, i) => {
      const hA = state.cups[i].h;
      const hB = state.cups[i + 1].h;
      const upA = Math.max(0.012, WALK.CUP_H - hA);
      const upB = Math.max(0.012, WALK.CUP_H - hB);
      const L = upA + WALK.ACROSS + upB;
      return {
        wetFractionA: Math.min(1, bridge.fromA / L),
        wetFractionB: Math.min(1, bridge.fromB / L),
        connected: bridge.connected,
        fromA: bridge.fromA,
        fromB: bridge.fromB,
        length: L,
        upA,
        upB,
        across: WALK.ACROSS,
        colorA: towelColor(bridge.dyeA, bridge.volA),
        colorB: towelColor(bridge.dyeB, bridge.volB),
      };
    }),
    headline,
    detail,
  };
}

/** Wall-clock seconds → model seconds. One real second is one model minute. */
export const WALK_TIME_SCALE = 60;
