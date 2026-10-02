/**
 * Candle under an inverted kitchen glass in a pie tin of water.
 *
 * The trapped air is an ideal gas. The flame (a tealight, fixed power) burns
 * wax as 2 CH₂ + 3 O₂ → 2 CO₂ + 2 H₂O, heats the gas, and any pressure above
 * the water seal vents bulk gas under the rim. The flame goes out while oxygen
 * is still about 15.5% of the trapped air. After that the gas cools, pressure
 * falls, and the room pushes water up into the glass. The waterline is the
 * model's hydrostatic balance, not a scripted rise.
 */

export const CANDLE = {
  R: 8.314462618,
  P_ATM: 101325,
  T_ROOM: 293.15,
  RHO_W: 997,
  G: 9.80665,
  /** Inner radius of a drinking glass, m. */
  GLASS_R: 0.036,
  /** Inner height, m. */
  GLASS_H: 0.125,
  /** Pie-tin inner radius, m. */
  TIN_R: 0.11,
  /** Water poured in the tin, m³ (250 mL). */
  V_WATER: 250e-6,
  /** Tealight heat release while the flame is on, W. */
  WATT: 32,
  /**
   * Heat per mole of O₂ for 2 CH₂ + 3 O₂.
   * CH₂ is 14.027 g/mol; paraffin is about 42 kJ/g, so 28.054 g of wax
   * (2 links) releases about 1.178 MJ per 3 mol O₂ → 393 kJ per mol O₂.
   */
  JOULES_PER_MOL_O2: 392_800,
  /** Molar heat capacity of diatomic gas at constant volume, J/(mol·K). */
  CV: 20.8,
  /** 180 g soda-lime tumbler × 840 J/(kg·K). */
  C_GLASS: 151.2,
  /** Gas-to-glass transfer while the rim is sealed, W/K. Mixing-limited. */
  UA_SEALED: 0.45,
  /** While the glass is still coming down, most of the heat leaves out the bottom. */
  UA_OPEN: 2.2,
  /** Glass-to-room, W/K. */
  UA_GLASS_ROOM: 0.4,
  /** Bulk oxygen fraction where the flame quits. Local air at the wick is poorer. */
  X_O2_OUT: 0.155,
  /** Seconds to lower the glass onto the water. */
  LOWER_S: 2,
  /** Effective Cd·A of the rim gap the water moves through, m². */
  GAP_CDA: 2.2e-6,
  /** Latent heat dumped into the glass when vapor fogs out, J/mol. */
  LATENT: 44_000,
} as const;

export type CandlePhase = "ready" | "lit" | "lowering" | "sealed";

export type CandleState = {
  phase: CandlePhase;
  /** Seconds since Light. */
  t: number;
  lowerT: number;
  flameOn: boolean;
  tOut: number | null;
  T: number;
  Tglass: number;
  nN2: number;
  nO2: number;
  nAr: number;
  nCO2: number;
  /** Water vapor still in the gas. */
  nH2O: number;
  /** Moles of flame-water that have fogged onto the glass. */
  nCond: number;
  /** Water height inside the glass, measured up from the tin, m. */
  h: number;
  /** Moles of room-temperature air that fit in the empty glass. The reference. */
  n0: number;
  ventedN2: number;
  ventedO2: number;
  ventedAr: number;
  ventedCO2: number;
  ventedH2O: number;
  burnedO2: number;
  /** Moles vented during the most recent stepCandle call. */
  ventMolStep: number;
};

export type CandleView = {
  phase: CandlePhase;
  seconds: number;
  flameOn: boolean;
  oxygenPct: number;
  tempC: number;
  glassTempC: number;
  moleculesLeftPct: number;
  waterInsideCm: number;
  waterOutsideMm: number;
  /** (h − outside depth), cm. Positive means the inside surface is higher. */
  climbCm: number;
  /** How far inside pressure sits below the room, as a percent of 1 atm. */
  pressureDeficitPct: number;
  ventedPct: number;
  burnedO2PctOfAir: number;
  condensateMg: number;
  /** 0 beside the tin, 1 seated on the water. */
  lowerProgress: number;
  headline: string;
  detail: string;
};

export function glassArea(): number {
  return Math.PI * CANDLE.GLASS_R * CANDLE.GLASS_R;
}

export function glassVolume(): number {
  return glassArea() * CANDLE.GLASS_H;
}

function outsideArea(): number {
  return Math.PI * (CANDLE.TIN_R * CANDLE.TIN_R - CANDLE.GLASS_R * CANDLE.GLASS_R);
}

export function moles(state: CandleState): number {
  return state.nN2 + state.nO2 + state.nAr + state.nCO2 + state.nH2O;
}

/** Outside water depth (m) when `h` meters of water sit inside the glass. */
export function outsideDepth(h: number, extraWater = 0): number {
  const inside = glassArea() * Math.max(0, h);
  const left = CANDLE.V_WATER + extraWater - inside;
  return left / outsideArea();
}

function roomParcel(): Pick<CandleState, "nN2" | "nO2" | "nAr" | "nCO2" | "nH2O" | "n0"> {
  const n0 = (CANDLE.P_ATM * glassVolume()) / (CANDLE.R * CANDLE.T_ROOM);
  return {
    n0,
    nN2: 0.78 * n0,
    nO2: 0.21 * n0,
    nAr: 0.01 * n0,
    nCO2: 0,
    nH2O: 0,
  };
}

export function createCandle(): CandleState {
  const air = roomParcel();
  return {
    phase: "ready",
    t: 0,
    lowerT: 0,
    flameOn: false,
    tOut: null,
    T: CANDLE.T_ROOM,
    Tglass: CANDLE.T_ROOM,
    ...air,
    nCond: 0,
    h: 0,
    ventedN2: 0,
    ventedO2: 0,
    ventedAr: 0,
    ventedCO2: 0,
    ventedH2O: 0,
    burnedO2: 0,
    ventMolStep: 0,
  };
}

export function lightCandle(state: CandleState): void {
  if (state.phase !== "ready") return;
  state.phase = "lit";
  state.flameOn = true;
}

export function watchCandle(state: CandleState): void {
  if (state.phase !== "lit" || !state.flameOn) return;
  state.phase = "lowering";
  state.lowerT = 0;
}

function pSat(T: number): number {
  const tc = T - 273.15;
  return 610.94 * Math.exp((17.625 * tc) / (tc + 243.04));
}

function removeFraction(state: CandleState, frac: number): void {
  if (frac <= 0) return;
  const f = Math.min(1, frac);
  const take = (n: number) => n * f;
  state.ventedN2 += take(state.nN2);
  state.ventedO2 += take(state.nO2);
  state.ventedAr += take(state.nAr);
  state.ventedCO2 += take(state.nCO2);
  state.ventedH2O += take(state.nH2O);
  state.ventMolStep +=
    take(state.nN2) + take(state.nO2) + take(state.nAr) + take(state.nCO2) + take(state.nH2O);
  const keep = 1 - f;
  state.nN2 *= keep;
  state.nO2 *= keep;
  state.nAr *= keep;
  state.nCO2 *= keep;
  state.nH2O *= keep;
}

function condense(state: CandleState, volume: number): void {
  const nMax = (pSat(state.T) * volume) / (CANDLE.R * state.T);
  if (state.nH2O <= nMax) return;
  const dn = state.nH2O - nMax;
  state.nH2O = nMax;
  state.nCond += dn;
  state.Tglass += (dn * CANDLE.LATENT) / CANDLE.C_GLASS;
}

function gasVolume(h: number): number {
  return Math.max(glassArea() * (CANDLE.GLASS_H - h), glassArea() * 0.004);
}

function maxWaterHeight(): number {
  const film = 0.0004 * outsideArea();
  return Math.max(0, (CANDLE.V_WATER - film) / glassArea());
}

function stepOnce(state: CandleState, dt: number): void {
  state.t += dt;

  if (state.phase === "lit") return;

  if (state.phase === "lowering") {
    state.lowerT += dt;
    if (state.lowerT >= CANDLE.LOWER_S) state.phase = "sealed";
  }

  const isOpen = state.phase === "lowering";

  if (state.flameOn) {
    const n = moles(state);
    const x = n > 0 ? state.nO2 / n : 0;
    if (x <= CANDLE.X_O2_OUT) {
      state.flameOn = false;
      state.tOut = state.t;
    } else {
      const rStop = (state.nO2 - CANDLE.X_O2_OUT * n) / (1 + CANDLE.X_O2_OUT / 3);
      let r = (CANDLE.WATT / CANDLE.JOULES_PER_MOL_O2) * dt;
      if (r >= rStop) {
        r = Math.max(0, rStop);
        state.flameOn = false;
        state.tOut = state.t;
      }
      state.nO2 -= r;
      state.nCO2 += r * (2 / 3);
      state.nH2O += r * (2 / 3);
      state.burnedO2 += r;
    }
  }

  const nNow = Math.max(moles(state), 1e-9);
  const ua = isOpen ? CANDLE.UA_OPEN : CANDLE.UA_SEALED;
  const qGas = (state.flameOn ? CANDLE.WATT : 0) - ua * (state.T - state.Tglass);
  state.T += (qGas * dt) / (nNow * CANDLE.CV);
  state.Tglass +=
    (ua * (state.T - state.Tglass) - CANDLE.UA_GLASS_ROOM * (state.Tglass - CANDLE.T_ROOM)) *
    (dt / CANDLE.C_GLASS);
  if (state.T < 250) state.T = 250;
  if (state.T > 900) state.T = 900;

  if (isOpen) {
    const V = glassVolume();
    condense(state, V);
    const nKeep = (CANDLE.P_ATM * V) / (CANDLE.R * state.T);
    const nCur = moles(state);
    if (nCur > nKeep) removeFraction(state, 1 - nKeep / nCur);
    state.h = 0;
    return;
  }

  // Sealed: move the water, then vent if the rim is pushed clear.
  const A = glassArea();
  let h = state.h;
  const V = gasVolume(h);
  condense(state, V);
  const n = moles(state);
  const P = (n * CANDLE.R * state.T) / V;
  const dOut = outsideDepth(h);
  const pBal = CANDLE.P_ATM + CANDLE.RHO_W * CANDLE.G * (dOut - h);
  const dP = pBal - P;
  const Q =
    Math.sign(dP) * CANDLE.GAP_CDA * Math.sqrt((2 * Math.abs(dP)) / CANDLE.RHO_W);
  h += (Q * dt) / A;
  const cap = maxWaterHeight();
  if (h < 0) h = 0;
  if (h > cap) h = cap;
  state.h = h;

  const V2 = gasVolume(state.h);
  const P2 = (moles(state) * CANDLE.R * state.T) / V2;
  const pVent = CANDLE.P_ATM + CANDLE.RHO_W * CANDLE.G * outsideDepth(0);
  if (state.h <= 1e-4 && P2 > pVent + 15) {
    const nKeep = (pVent * glassVolume()) / (CANDLE.R * state.T);
    const nCur = moles(state);
    if (nCur > nKeep) removeFraction(state, 1 - nKeep / nCur);
  }
}

/** Advance the model by `dt` seconds. Substeps keep the water from overshooting. */
export function stepCandle(state: CandleState, dt: number): void {
  if (!(dt > 0)) return;
  state.ventMolStep = 0;
  if (state.phase === "ready") return;
  const sub = 0.02;
  const n = Math.ceil(dt / sub);
  const h = dt / n;
  for (let i = 0; i < n; i++) stepOnce(state, h);
}

function ventedMoles(state: CandleState): number {
  return state.ventedN2 + state.ventedO2 + state.ventedAr + state.ventedCO2 + state.ventedH2O;
}

export function candleView(state: CandleState): CandleView {
  const n = moles(state);
  const h = state.h;
  const dOut = outsideDepth(h);
  const V = state.phase === "sealed" ? gasVolume(h) : glassVolume();
  const P = (n * CANDLE.R * state.T) / V;
  const climb = h - dOut;
  const oxygenPct = n > 0 ? (100 * state.nO2) / n : 0;
  const moleculesLeftPct = (100 * n) / state.n0;
  const ventedPct = (100 * ventedMoles(state)) / state.n0;
  // The water finishes climbing within about 15 s of the flame going out.
  // The glass itself stays a hair warm for longer; don't wait on that.
  const settled =
    !state.flameOn &&
    state.phase === "sealed" &&
    state.tOut !== null &&
    state.t > state.tOut + 14 &&
    state.h > 0.012;

  let headline = "Candle out, glass aside, a thin layer of water in the tin.";
  let detail =
    "Light the candle first. Watch lowers the glass over it. Nothing is trapped until the rim meets the water.";
  if (state.phase === "lit") {
    headline = "Flame is on in open air. Nothing is trapped yet.";
    detail = "The tealight is burning in the room. Press Watch to lower the glass.";
  } else if (state.phase === "lowering") {
    headline = "Glass coming down. Hot air can still spill out the bottom.";
    detail =
      "Until the rim sits in the water, extra hot gas leaves and does not come back. That missing air is what makes a lasting rise possible.";
  } else if (state.flameOn && state.phase === "sealed") {
    headline = "Sealed. The flame is heating the trapped air, and extra hot air bubbles out.";
    detail = `Oxygen is ${oxygenPct.toFixed(1)}% of the gas in the glass. The flame quits near 15.5%, with oxygen still left. Bubbles under the rim are hot gas leaving.`;
  } else if (settled) {
    headline = "Settled. The water climbed because hot air left and the rest cooled.";
    detail = `About ${(100 - moleculesLeftPct).toFixed(0)}% of a room-temperature glass of air left while it was hot. Cooling the rest dropped the pressure by about ${Math.max(0, climb * 100).toFixed(1)} cm of water — a few tenths of a percent of the air in the room, not a used-up fifth of oxygen.`;
  } else if (!state.flameOn && state.phase === "sealed") {
    headline = "Flame's out. The trapped air is cooling, and the room is pushing water in.";
    detail =
      "Heating stopped. The gas shrinks as it cools toward the room. Higher pressure outside pushes the tin water up under the rim. The glass does not pull.";
  }

  const lowerProgress =
    state.phase === "sealed" ? 1 : state.phase === "lowering" ? Math.min(1, state.lowerT / CANDLE.LOWER_S) : 0;

  return {
    phase: state.phase,
    seconds: state.t,
    flameOn: state.flameOn,
    oxygenPct,
    tempC: state.T - 273.15,
    glassTempC: state.Tglass - 273.15,
    moleculesLeftPct,
    waterInsideCm: h * 100,
    waterOutsideMm: dOut * 1000,
    climbCm: climb * 100,
    pressureDeficitPct: (100 * (CANDLE.P_ATM - P)) / CANDLE.P_ATM,
    ventedPct,
    burnedO2PctOfAir: (100 * state.burnedO2) / state.n0,
    condensateMg: state.nCond * 18.015 * 1000,
    lowerProgress,
    headline,
    detail,
  };
}
