import assert from "node:assert/strict";
import { test } from "node:test";
import {
  CANDLE,
  candleView,
  createCandle,
  glassVolume,
  lightCandle,
  moles,
  stepCandle,
  watchCandle,
  type CandleState,
} from "./candle-physics";
import {
  bridgeFlowM3PerS,
  createWalking,
  cupVolume,
  jurinHeight,
  pathLength,
  stepWalking,
  totalDye,
  totalWater,
  WALK,
  walkingView,
} from "./walking-water-physics";

function oxygenAtoms(state: CandleState): number {
  return (
    2 * state.nO2 +
    2 * state.nCO2 +
    state.nH2O +
    state.nCond +
    2 * state.ventedO2 +
    2 * state.ventedCO2 +
    state.ventedH2O
  );
}

function runCandle(): { state: CandleState; maxT: number; hAtOut: number } {
  const state = createCandle();
  lightCandle(state);
  stepCandle(state, 1);
  watchCandle(state);
  let maxT = state.T;
  let hAtOut = 0;
  let sawOut = false;
  for (let i = 0; i < 2400; i++) {
    stepCandle(state, 0.05);
    if (state.T > maxT) maxT = state.T;
    if (!state.flameOn && !sawOut) {
      sawOut = true;
      hAtOut = state.h;
    }
    if (sawOut && state.t > (state.tOut ?? 0) + 40 && state.T < CANDLE.T_ROOM + 1.5) break;
  }
  assert.equal(sawOut, true, "flame never went out");
  return { state, maxT, hAtOut };
}

test("candle: flame dies with oxygen left, then cooling lifts the water", () => {
  const { state, maxT, hAtOut } = runCandle();
  const view = candleView(state);
  const n = moles(state);
  const xO2 = state.nO2 / n;

  assert.ok(state.tOut !== null && state.tOut > 5 && state.tOut < 45, `tOut ${state.tOut}`);
  assert.ok(xO2 > 0.14 && xO2 < 0.17, `oxygen fraction ${xO2}`);
  assert.ok(maxT < 520, `gas got unrealistically hot: ${maxT}`);
  assert.ok(maxT > CANDLE.T_ROOM + 25, `gas never really warmed: ${maxT}`);
  assert.ok(hAtOut < 0.005, `water rose during the burn (${hAtOut} m), before cooling`);
  assert.ok(view.waterInsideCm > 1.2 && view.waterInsideCm < 5.5, `rise ${view.waterInsideCm} cm`);
  assert.ok(view.climbCm > 1 && view.climbCm < 5.5, `climb ${view.climbCm} cm`);
  assert.ok(view.waterOutsideMm > 0.3, "tin ran dry and the seal broke");
  assert.ok(
    view.pressureDeficitPct > 0.05 && view.pressureDeficitPct < 0.8,
    `pressure deficit ${view.pressureDeficitPct}`,
  );
  assert.ok(view.moleculesLeftPct < 92 && view.moleculesLeftPct > 65, `molecules left ${view.moleculesLeftPct}`);
  assert.ok(view.ventedPct > 8, `not enough hot air left: ${view.ventedPct}%`);
  // Chemistry is the small part: O₂ actually burned is a few percent of the air,
  // and far less than the air that vented while hot.
  assert.ok(
    view.burnedO2PctOfAir > 2 && view.burnedO2PctOfAir < 12,
    `burned oxygen ${view.burnedO2PctOfAir}`,
  );
  assert.ok(view.ventedPct > view.burnedO2PctOfAir, "venting should dwarf the oxygen that burned");
  assert.match(view.headline, /cooled|cooling|climbed/i);
});

test("candle: atoms of the trapped air are accounted for, and the glass is a kitchen glass", () => {
  const fresh = createCandle();
  const o0 = oxygenAtoms(fresh);
  const n2 = fresh.nN2;
  const ar = fresh.nAr;
  const { state } = runCandle();
  assert.ok(Math.abs(oxygenAtoms(state) - o0) / o0 < 1e-6, "oxygen atoms not conserved");
  assert.ok(Math.abs(state.nN2 + state.ventedN2 - n2) / n2 < 1e-6);
  assert.ok(Math.abs(state.nAr + state.ventedAr - ar) / ar < 1e-6);
  const mL = glassVolume() * 1e6;
  assert.ok(mL > 400 && mL < 650, `glass volume ${mL} mL`);
  assert.equal(fresh.phase, "ready");
  assert.equal(moles(fresh) > 0, true);
});

test("walking water: Jurin height clears a cup, and dye only moves with water", () => {
  const jurinCm = jurinHeight() * 100;
  assert.ok(jurinCm > 45 && jurinCm < 80, `Jurin ${jurinCm} cm`);
  assert.ok(jurinHeight() > WALK.CUP_H, "pores cannot lift water over the rim");
  const startMlPerMin = bridgeFlowM3PerS(WALK.H_FULL, 0) * 1e6 * 60;
  assert.ok(startMlPerMin > 2 && startMlPerMin < 8, `start flow ${startMlPerMin} mL/min`);

  const state = createWalking(3);
  const dye0 = totalDye(state);
  const water0 = totalWater(state);
  assert.equal(state.cups[1].h, 0);
  assert.equal(state.cups[1].dye[0] + state.cups[1].dye[2], 0);

  // Well before the front can cross ~20 cm.
  stepWalking(state, 90);
  assert.equal(state.bridges[0].connected || state.bridges[1].connected, false);
  assert.ok(state.cups[1].h < 1e-6, "empty cup gained water before the towel connected");
  assert.ok(state.cups[1].dye[0] + state.cups[1].dye[2] < 1e-12);

  let connectedAt = 0;
  for (let t = 90; t < 20 * 60; t += 1) {
    stepWalking(state, 1);
    if (state.bridges[0].connected && state.bridges[1].connected) {
      connectedAt = state.t;
      break;
    }
  }
  assert.ok(connectedAt > 2 * 60 && connectedAt < 15 * 60, `connected at ${connectedAt}s`);
  assert.ok(state.cups[1].h < 0.004, "middle cup filled before flow had time to move water");

  stepWalking(state, 90 * 60);
  const view = walkingView(state);
  const dye1 = totalDye(state);
  for (let k = 0; k < 3; k++) {
    assert.ok(Math.abs(dye1[k] - dye0[k]) / Math.max(dye0[k], 1e-12) < 1e-6, `dye ${k}`);
  }
  assert.ok(Math.abs(totalWater(state) - water0) / water0 < 1e-6);

  const mid = view.cups[1];
  const left = view.cups[0];
  const right = view.cups[2];
  assert.ok(mid.hCm > 2, `middle height ${mid.hCm}`);
  assert.ok(left.hCm < 6.2 && right.hCm < 6.2, "sources did not drop");
  assert.ok(Math.abs(left.hCm - right.hCm) < 0.4, "setup should stay symmetric");
  assert.ok(mid.conc[0] > 0.25 && mid.conc[2] > 0.25, `middle mix ${mid.conc}`);
  assert.ok(mid.conc[1] < 0.05, "yellow appeared with no yellow cup");
  // Sources stay nearly pure: color did not bleed backward without flow.
  assert.ok(left.conc[2] < 0.08, `left picked up blue ${left.conc}`);
  assert.ok(right.conc[0] < 0.08, `right picked up red ${right.conc}`);
  assert.ok(mid.mL > 40, "middle cup should hold a real pour, not a tint");
  assert.match(view.headline, /even|mix|wet|lower/i);
});

test("walking water: five cups mix neighbors, not the far color", () => {
  const state = createWalking(5);
  // Red | empty | yellow | empty | blue
  stepWalking(state, 40 * 60);
  const view = walkingView(state);
  const orange = view.cups[1].conc;
  const green = view.cups[3].conc;
  assert.ok(orange[0] > 0.15 && orange[1] > 0.15, `orange cup ${orange}`);
  assert.ok(orange[2] < orange[0] * 0.5 && orange[2] < orange[1] * 0.5, `blue leaked into orange ${orange}`);
  assert.ok(green[1] > 0.15 && green[2] > 0.15, `green cup ${green}`);
  assert.ok(green[0] < green[1] * 0.5 && green[0] < green[2] * 0.5, `red leaked into green ${green}`);
  assert.ok(view.cups[1].hCm > 1 && view.cups[3].hCm > 1);
  // Path length at the start is a real towel drape, not zero.
  assert.ok(pathLength(WALK.H_FULL, 0) > 0.15 && pathLength(WALK.H_FULL, 0) < 0.35);
  assert.ok(cupVolume(WALK.H_FULL) * 1e6 > 180 && cupVolume(WALK.H_FULL) * 1e6 < 320);
});
