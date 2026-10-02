"use client";

import { useEffect, useRef, useState } from "react";
import {
  bridgeFlowM3PerS,
  createWalking,
  cupVolume,
  stepWalking,
  WALK,
  WALK_TIME_SCALE,
  walkingView,
  type CupCount,
  type WalkingState,
  type WalkingView,
} from "@/lib/review/walking-water-physics";

const COUNTS: CupCount[] = [3, 5, 7];
const VB_W = 760;
const VB_H = 360;
const BASE_Y = 250;
const CUP_PX = 210;

type BridgeDraw = WalkingView["bridges"][number];

function cupFillName(conc: [number, number, number]): string {
  const [r, y, b] = conc;
  const sum = r + y + b;
  if (sum < 0.05) return "clear";
  if (r > 0.7 && y < 0.15 && b < 0.15) return "red";
  if (y > 0.7 && r < 0.15 && b < 0.15) return "yellow";
  if (b > 0.7 && r < 0.15 && y < 0.15) return "blue";
  if (r > 0.2 && y > 0.2 && b < 0.15) return "orange";
  if (y > 0.2 && b > 0.2 && r < 0.15) return "green";
  if (r > 0.2 && b > 0.2 && y < 0.15) return "purple";
  return "mixed";
}

function quad(p0: { x: number; y: number }, p1: { x: number; y: number }, p2: { x: number; y: number }, t: number) {
  const u = 1 - t;
  return {
    x: u * u * p0.x + 2 * u * t * p1.x + t * t * p2.x,
    y: u * u * p0.y + 2 * u * t * p1.y + t * t * p2.y,
  };
}

function Arch({
  x1,
  x2,
  rimY,
  bridge,
}: {
  x1: number;
  x2: number;
  rimY: number;
  bridge: BridgeDraw;
}) {
  const c = { x: (x1 + x2) / 2, y: rimY - 34 };
  const a = { x: x1, y: rimY };
  const b = { x: x2, y: rimY };
  const leftWet = bridge.connected ? 1 : Math.min(1, Math.max(0, (bridge.fromA - bridge.upA) / bridge.across));
  const rightWet = bridge.connected ? 1 : Math.min(1, Math.max(0, (bridge.fromB - bridge.upB) / bridge.across));
  const parts: { d: string; color: string }[] = [];
  const n = 18;
  for (let i = 0; i < n; i++) {
    const t0 = i / n;
    const t1 = (i + 1) / n;
    const p = quad(a, c, b, t0);
    const q = quad(a, c, b, t1);
    const mid = (t0 + t1) / 2;
    let color = "#E4D3B4";
    if (bridge.connected) color = mid < 0.5 ? bridge.colorA : bridge.colorB;
    else if (mid <= leftWet + 0.02) color = bridge.colorA;
    else if (mid >= 1 - rightWet - 0.02) color = bridge.colorB;
    parts.push({ d: `M ${p.x} ${p.y} L ${q.x} ${q.y}`, color });
  }
  return (
    <g>
      {parts.map((part, i) => (
        <path key={i} d={part.d} stroke={part.color} strokeWidth={8} strokeLinecap="round" fill="none" />
      ))}
    </g>
  );
}

export function WalkingWaterReviewSim() {
  const simRef = useRef<WalkingState>(createWalking(5));
  const loopRef = useRef(0);
  const runningRef = useRef(false);
  const [count, setCount] = useState<CupCount>(5);
  const [live, setLive] = useState(false);
  const [view, setView] = useState<WalkingView>(() => walkingView(createWalking(5)));

  useEffect(() => {
    return () => {
      runningRef.current = false;
      cancelAnimationFrame(loopRef.current);
    };
  }, []);

  function stop() {
    runningRef.current = false;
    cancelAnimationFrame(loopRef.current);
  }

  function ensureLoop() {
    if (runningRef.current) return;
    runningRef.current = true;
    let last = performance.now();
    const tick = (now: number) => {
      if (!runningRef.current) return;
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      stepWalking(simRef.current, dt * WALK_TIME_SCALE);
      const next = walkingView(simRef.current);
      setView(next);
      const heights = simRef.current.cups.map((c) => c.h);
      const spread = Math.max(...heights) - Math.min(...heights);
      const done =
        simRef.current.bridges.every((b) => b.connected) && spread < 0.004 && simRef.current.t > 60;
      if (done) {
        runningRef.current = false;
        return;
      }
      loopRef.current = requestAnimationFrame(tick);
    };
    loopRef.current = requestAnimationFrame(tick);
  }

  function onStart() {
    if (live || simRef.current.t > 0) return;
    setLive(true);
    ensureLoop();
  }

  function onReset() {
    stop();
    setLive(false);
    simRef.current = createWalking(count);
    setView(walkingView(simRef.current));
  }

  function pick(n: CupCount) {
    if (live || simRef.current.t > 0) return;
    setCount(n);
    simRef.current = createWalking(n);
    setView(walkingView(simRef.current));
  }

  const n = view.cups.length;
  const pad = 18;
  const gap = n > 5 ? 8 : 16;
  const cupW = (VB_W - pad * 2 - gap * (n - 1)) / n;
  const pxPerM = CUP_PX / WALK.CUP_H;
  const started = live || view.seconds > 0;
  const mlPerMin = bridgeFlowM3PerS(WALK.H_FULL, 0) * 1e6 * 60;

  return (
    <div className="grid gap-4 p-3 sm:p-4 lg:grid-cols-[minmax(0,1.2fr)_minmax(16rem,0.8fr)]">
      <div className="rounded-[22px] border border-sage-200 bg-[#FBF6EC] p-2">
        <p className="min-h-[2.6rem] px-2 pt-1 font-display text-lg font-semibold leading-snug text-sage-800">
          {view.headline}
        </p>
        <svg viewBox={`0 0 ${VB_W} ${VB_H}`} className="block h-auto w-full" role="img" aria-label={view.headline}>
          {view.cups.map((cup, i) => {
            const x = pad + i * (cupW + gap);
            const hPx = (cup.hCm / 100) * pxPerM;
            const rimY = BASE_Y - CUP_PX;
            const waterY = BASE_Y - hPx;
            const bridgeL = view.bridges[i - 1];
            const bridgeR = view.bridges[i];
            const wetUp = bridgeR ? Math.min(1, bridgeR.fromA / bridgeR.upA) : 0;
            const wetDown = bridgeL ? Math.min(1, bridgeL.fromB / bridgeL.upB) : 0;
            return (
              <g key={i}>
                <rect x={x} y={rimY} width={cupW} height={CUP_PX} fill="none" stroke="#2B2A33" strokeWidth={2.5} />
                {hPx > 0.4 && (
                  <rect x={x + 2} y={waterY} width={cupW - 4} height={hPx} fill={cup.color} />
                )}
                {bridgeR && (
                  <TowelStrip x={x + cupW / 2 - 3} rimY={rimY} waterY={Math.min(BASE_Y - 4, waterY)} wet={wetUp} color={bridgeR.colorA} />
                )}
                {bridgeL && (
                  <TowelStrip x={x + cupW / 2 + 1} rimY={rimY} waterY={Math.min(BASE_Y - 4, waterY)} wet={wetDown} color={bridgeL.colorB} />
                )}
                <text
                  x={x + cupW / 2}
                  y={BASE_Y + 18}
                  textAnchor="middle"
                  fill="#1f2a24"
                  fontSize={n > 5 ? 11 : 13}
                  fontFamily="system-ui, sans-serif"
                  fontWeight={700}
                >
                  {cup.hCm.toFixed(1)} cm
                </text>
                <text
                  x={x + cupW / 2}
                  y={BASE_Y + 34}
                  textAnchor="middle"
                  fill="#5c6b62"
                  fontSize={n > 5 ? 10 : 12}
                  fontFamily="system-ui, sans-serif"
                >
                  {cupFillName(cup.conc)}
                </text>
              </g>
            );
          })}
          {view.bridges.map((bridge, i) => {
            const x1 = pad + i * (cupW + gap) + cupW;
            const x2 = pad + (i + 1) * (cupW + gap);
            const rimY = BASE_Y - CUP_PX;
            return <Arch key={i} x1={x1} x2={x2} rimY={rimY} bridge={bridge} />;
          })}
          <line x1={18} y1={BASE_Y + 48} x2={18 + 0.05 * pxPerM} y2={BASE_Y + 48} stroke="#2B2A33" strokeWidth={2} />
          <text x={18} y={BASE_Y + 64} fill="#5c6b62" fontSize={13} fontFamily="system-ui, sans-serif">
            5 cm
          </text>
        </svg>
        <p className="px-2 pb-1 text-sm leading-snug text-ink-muted">
          Cups {(WALK.CUP_R * 200).toFixed(1)} cm across and {WALK.CUP_H * 100} cm tall, filled to {WALK.H_FULL * 100} cm (about{" "}
          {Math.round(cupVolume(WALK.H_FULL) * 1e6)} mL). Heights are to that scale. One second here is one minute in
          the model. A full-to-empty bridge starts near {mlPerMin.toFixed(1)} mL per minute.
        </p>
      </div>

      <div className="flex flex-col gap-3">
        <div>
          <p className="text-sm font-semibold text-ink">Cups</p>
          <div className="mt-1 flex flex-wrap gap-2">
            {COUNTS.map((nCups) => (
              <button
                key={nCups}
                type="button"
                className={`min-h-12 rounded-full px-4 text-base font-semibold ${
                  count === nCups
                    ? "bg-sage-600 text-white"
                    : "border-2 border-sage-600 bg-white text-sage-800"
                } disabled:cursor-default disabled:opacity-60`}
                onClick={() => pick(nCups)}
                disabled={started}
                aria-pressed={count === nCups}
              >
                {nCups}
              </button>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            className="min-h-12 rounded-full bg-sage-600 px-4 text-base font-semibold text-white hover:bg-sage-700 disabled:cursor-default disabled:opacity-60"
            onClick={onStart}
            disabled={started}
          >
            Start
          </button>
          <button
            type="button"
            className="min-h-12 rounded-full border-2 border-sage-600 bg-white px-4 text-base font-semibold text-sage-800"
            onClick={onReset}
          >
            Reset
          </button>
        </div>
        <section className="rounded-2xl border border-sage-200 bg-white p-3" aria-live="polite">
          <p className="font-display text-xl font-semibold leading-snug text-ink">{view.detail}</p>
          <p className="mt-2 text-sm text-ink-muted">Model time {view.minutes.toFixed(1)} min</p>
          <ul className="mt-2 space-y-1 text-sm text-ink">
            {view.cups.map((cup, i) => (
              <li key={i}>
                Cup {i + 1}: {cup.hCm.toFixed(1)} cm, {cup.mL.toFixed(0)} mL, {cupFillName(cup.conc)}
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}

function TowelStrip({
  x,
  rimY,
  waterY,
  wet,
  color,
}: {
  x: number;
  rimY: number;
  waterY: number;
  wet: number;
  color: string;
}) {
  const span = Math.max(0, waterY - rimY);
  const wetH = span * Math.min(1, Math.max(0, wet));
  return (
    <g>
      <rect x={x} y={rimY} width={6} height={span} fill="#E4D3B4" />
      {wetH > 0.5 && <rect x={x} y={waterY - wetH} width={6} height={wetH} fill={color} />}
    </g>
  );
}
