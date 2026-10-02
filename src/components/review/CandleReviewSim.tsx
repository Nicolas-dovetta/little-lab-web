"use client";

import { useEffect, useRef, useState } from "react";
import {
  CANDLE,
  candleView,
  createCandle,
  glassVolume,
  lightCandle,
  stepCandle,
  watchCandle,
  type CandleState,
  type CandleView,
} from "@/lib/review/candle-physics";

const S = 2000;
const VB_W = 640;
const VB_H = 430;
const FLOOR = 392;
const TIN_W = CANDLE.TIN_R * 2 * S;
const TIN_X = 28;
const GLASS_W = CANDLE.GLASS_R * 2 * S;
const GLASS_H = CANDLE.GLASS_H * S;
const SEAT_X = TIN_X + (TIN_W - GLASS_W) / 2;
const ASIDE_X = 478;

type Bubble = { id: number; x: number; born: number; side: -1 | 1; age: number };

function gasFill(tempC: number, seated: boolean): string {
  if (!seated) return "rgba(251,246,236,0.92)";
  const warmth = Math.min(1, Math.max(0, (tempC - 20) / 75));
  return `rgba(243, 176, 96, ${0.1 + warmth * 0.38})`;
}

export function CandleReviewSim() {
  const simRef = useRef<CandleState>(createCandle());
  const bubblesRef = useRef<Bubble[]>([]);
  const loopRef = useRef(0);
  const runningRef = useRef(false);
  const bubbleId = useRef(1);
  const [view, setView] = useState<CandleView>(() => candleView(createCandle()));
  const [bubbles, setBubbles] = useState<Bubble[]>([]);

  useEffect(() => {
    return () => {
      runningRef.current = false;
      cancelAnimationFrame(loopRef.current);
    };
  }, []);

  function publish(extra?: Bubble[]) {
    const now = simRef.current.t;
    const kept = [...bubblesRef.current, ...(extra ?? [])].filter((b) => now - b.born < 1.3);
    bubblesRef.current = kept;
    setBubbles(kept.map((b) => ({ ...b, age: now - b.born })));
    setView(candleView(simRef.current));
  }

  function ensureLoop() {
    if (runningRef.current) return;
    runningRef.current = true;
    let last = performance.now();
    const tick = (now: number) => {
      if (!runningRef.current) return;
      const dt = Math.min(0.1, (now - last) / 1000);
      last = now;
      stepCandle(simRef.current, dt);
      const sim = simRef.current;
      const spawned: Bubble[] = [];
      const mL = ((sim.ventMolStep * CANDLE.R * sim.T) / CANDLE.P_ATM) * 1e6;
      const count = Math.min(3, Math.round(mL / 4));
      for (let i = 0; i < count; i++) {
        spawned.push({
          id: bubbleId.current++,
          x: 6 + (i % 3) * 5,
          born: sim.t,
          side: i % 2 === 0 ? -1 : 1,
          age: 0,
        });
      }
      publish(spawned);
      const cooled =
        sim.phase === "sealed" &&
        !sim.flameOn &&
        sim.tOut !== null &&
        sim.t > sim.tOut + 16 &&
        sim.h > 0.012;
      if (cooled) {
        runningRef.current = false;
        return;
      }
      loopRef.current = requestAnimationFrame(tick);
    };
    loopRef.current = requestAnimationFrame(tick);
  }

  function onLight() {
    lightCandle(simRef.current);
    publish();
  }

  function onWatch() {
    watchCandle(simRef.current);
    publish();
    ensureLoop();
  }

  function onReset() {
    runningRef.current = false;
    cancelAnimationFrame(loopRef.current);
    simRef.current = createCandle();
    bubblesRef.current = [];
    setBubbles([]);
    setView(candleView(simRef.current));
  }

  const progress = view.lowerProgress;
  const seated = view.phase === "sealed" || progress >= 1;
  const gx = ASIDE_X + (SEAT_X - ASIDE_X) * progress;
  const mouthY = FLOOR - (1 - progress) * 120;
  const gy = mouthY - GLASS_H;
  const dPx = Math.max(0, view.waterOutsideMm / 1000) * S;
  const hPx = Math.max(0, view.waterInsideCm / 100) * S;
  const tinCenter = TIN_X + TIN_W / 2;
  const candleW = 0.038 * S;
  const candleH = 0.017 * S;
  const richness = view.flameOn ? Math.max(0.28, (view.oxygenPct / 100 - 0.155) / (0.21 - 0.155)) : 0;
  const flameH = 0.028 * S * richness;
  const pText =
    view.pressureDeficitPct >= 0
      ? `${view.pressureDeficitPct.toFixed(2)}% below the room`
      : `${(-view.pressureDeficitPct).toFixed(2)}% above the room`;

  return (
    <div className="grid gap-4 p-3 sm:p-4 lg:grid-cols-[minmax(0,1.15fr)_minmax(17rem,0.85fr)]">
      <div className="rounded-[22px] border border-sage-200 bg-[#FBF6EC] p-2">
        <p className="min-h-[2.6rem] px-2 pt-1 font-display text-lg font-semibold leading-snug text-sage-800">
          {view.headline}
        </p>
        <svg viewBox={`0 0 ${VB_W} ${VB_H}`} className="block h-auto w-full" role="img" aria-label={view.headline}>
          <rect x={TIN_X} y={FLOOR} width={TIN_W} height={18} rx={6} fill="#E7D7B8" stroke="#2B2A33" strokeWidth={2} />
          <rect x={TIN_X + 3} y={FLOOR - dPx} width={TIN_W - 6} height={dPx} fill="#CFE7F4" />
          <rect
            x={gx + 4}
            y={gy + 3}
            width={GLASS_W - 8}
            height={mouthY - gy - 3}
            fill={gasFill(view.tempC, progress > 0.85)}
          />
          {seated && hPx > 0.5 && (
            <rect x={gx + 5} y={mouthY - hPx} width={GLASS_W - 10} height={hPx} fill="#7EB6D6" />
          )}
          <path
            d={`M ${gx} ${mouthY} L ${gx} ${gy} L ${gx + GLASS_W} ${gy} L ${gx + GLASS_W} ${mouthY}`}
            fill="none"
            stroke="#2B2A33"
            strokeWidth={3}
          />
          <rect
            x={tinCenter - candleW / 2}
            y={FLOOR - candleH}
            width={candleW}
            height={candleH}
            rx={4}
            fill="#F4F0E6"
            stroke="#2B2A33"
            strokeWidth={2}
          />
          <rect x={tinCenter - 2} y={FLOOR - candleH - 8} width={4} height={10} fill="#2B2A33" />
          {view.flameOn && (
            <path
              d={`M ${tinCenter} ${FLOOR - candleH - 8 - flameH} C ${tinCenter + 14} ${FLOOR - candleH - flameH * 0.45}, ${tinCenter + 10} ${FLOOR - candleH - 4}, ${tinCenter} ${FLOOR - candleH - 6} C ${tinCenter - 10} ${FLOOR - candleH - 4}, ${tinCenter - 14} ${FLOOR - candleH - flameH * 0.45}, ${tinCenter} ${FLOOR - candleH - 8 - flameH} Z`}
              fill="#E0562B"
            />
          )}
          {bubbles.map((b) => {
            const by = mouthY - b.age * 78;
            const bx = gx + (b.side < 0 ? -8 - b.x : GLASS_W + 4 + b.x);
            return <circle key={b.id} cx={bx} cy={by} r={5} fill="#CFE7F4" stroke="#E0562B" strokeWidth={1.5} />;
          })}
          {view.condensateMg > 0.4 &&
            Array.from({ length: Math.min(12, Math.round(view.condensateMg / 0.35)) }, (_, i) => (
              <circle
                key={i}
                cx={gx + 10 + (i % 4) * ((GLASS_W - 24) / 3)}
                cy={gy + 28 + Math.floor(i / 4) * 22}
                r={3.2}
                fill="#8FBBD6"
              />
            ))}
          <line x1={36} y1={FLOOR + 28} x2={36 + 0.05 * S} y2={FLOOR + 28} stroke="#2B2A33" strokeWidth={2} />
          <text x={36} y={FLOOR + 42} fill="#5c6b62" fontSize={13} fontFamily="system-ui, sans-serif">
            5 cm
          </text>
        </svg>
        <p className="px-2 pb-1 text-sm leading-snug text-ink-muted">
          Drawn to scale: glass {(CANDLE.GLASS_R * 200).toFixed(1)} cm across, {CANDLE.GLASS_H * 100} cm tall (
          {Math.round(glassVolume() * 1e6)} mL), tin {CANDLE.TIN_R * 200} cm across, {CANDLE.V_WATER * 1e6} mL of
          water. Tealight {CANDLE.WATT} W. Clock is real seconds. Bubbles mark gas leaving under the rim.
        </p>
      </div>

      <div className="flex flex-col gap-3">
        <div className="grid grid-cols-3 gap-2">
          <button
            type="button"
            className="min-h-12 flex-1 rounded-full bg-sage-600 px-4 text-base font-semibold text-white hover:bg-sage-700 disabled:cursor-default disabled:opacity-60"
            onClick={onLight}
            disabled={view.phase !== "ready"}
          >
            Light
          </button>
          <button
            type="button"
            className="min-h-12 flex-1 rounded-full border-2 border-sage-600 bg-white px-4 text-base font-semibold text-sage-800 disabled:cursor-default disabled:opacity-60"
            onClick={onWatch}
            disabled={view.phase !== "lit"}
          >
            Watch
          </button>
          <button
            type="button"
            className="min-h-12 flex-1 rounded-full border-2 border-sage-600 bg-white px-4 text-base font-semibold text-sage-800"
            onClick={onReset}
          >
            Reset
          </button>
        </div>

        <section className="rounded-2xl border border-sage-200 bg-white p-3" aria-live="polite">
          <p className="font-display text-xl font-semibold leading-snug text-ink">{view.detail}</p>
          <dl className="mt-3 grid grid-cols-2 gap-x-3 gap-y-2 text-sm">
            <div>
              <dt className="text-ink-muted">Time</dt>
              <dd className="font-semibold text-ink">{view.seconds.toFixed(0)} s</dd>
            </div>
            <div>
              <dt className="text-ink-muted">Oxygen in the glass</dt>
              <dd className="font-semibold text-ink">{view.oxygenPct.toFixed(1)}%</dd>
            </div>
            <div>
              <dt className="text-ink-muted">Gas temperature</dt>
              <dd className="font-semibold text-ink">{view.tempC.toFixed(0)}°C</dd>
            </div>
            <div>
              <dt className="text-ink-muted">Molecules left</dt>
              <dd className="font-semibold text-ink">{view.moleculesLeftPct.toFixed(0)}% of a roomful</dd>
            </div>
            <div>
              <dt className="text-ink-muted">Hot air that left</dt>
              <dd className="font-semibold text-ink">{view.ventedPct.toFixed(0)}%</dd>
            </div>
            <div>
              <dt className="text-ink-muted">Water inside</dt>
              <dd className="font-semibold text-ink">{view.waterInsideCm.toFixed(1)} cm</dd>
            </div>
            <div className="col-span-2">
              <dt className="text-ink-muted">Pressure inside</dt>
              <dd className="font-semibold text-ink">{pText}</dd>
            </div>
          </dl>
          <p className="mt-3 text-sm text-ink-muted">
            Open flame in the real version — adult lights it and holds the glass. This page is only the model.
          </p>
        </section>
      </div>
    </div>
  );
}
