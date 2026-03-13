"use client";

import { useEffect, useRef, useState } from "react";

const GOAL = 100_000;

const MILESTONES = [
  { pct: 0,    label: "€0" },
  { pct: 0.25, label: "€25K" },
  { pct: 0.5,  label: "€50K" },
  { pct: 0.75, label: "€75K" },
  { pct: 1,    label: "€100K" },
];

const MSGS: [number, string][] = [
  [0,    "350 dogs will lose their home unless we raise €100,000."],
  [0.05, "They have nowhere else to go. Will you help today?"],
  [0.15, "More needed than ever. Share this with one person right now."],
  [0.25, "€25,000 reached — the first land payment is within reach."],
  [0.4,  "Do it for the 50 disabled dogs who cannot fend for themselves."],
  [0.5,  "Halfway. 175 dogs already have a safer future because of you."],
  [0.65, "Can you feel the momentum? Don't stop now."],
  [0.75, "Three quarters there. One final push needed."],
  [0.9,  "Almost at €100K. You could be the one who gets us there."],
  [0.97, "The finish line is right here. Help us cross it."],
];

const CONFETTI_COLORS = ["#7B1010","#A32D2D","#F09595","#85B7EB","#97C459","#EF9F27"];

export default function DonationLoop({
  raisedEur,
  goalEur,
}: {
  raisedEur: number;
  goalEur: number;
}) {
  const [animPct, setAnimPct] = useState(0);
  const [msg, setMsg] = useState(MSGS[0][1]);
  const [msgVisible, setMsgVisible] = useState(true);
  const [litMs, setLitMs] = useState(0);
  const [loopN, setLoopN] = useState(1);
  const [playing, setPlaying] = useState(true);
  const [speed, setSpeed] = useState(1);

  const pctRef = useRef(0);
  const playingRef = useRef(true);
  const speedRef = useRef(1);
  const lastTsRef = useRef<number | null>(null);
  const prevMsgRef = useRef(-1);
  const prevLitRef = useRef(-1);
  const rafRef = useRef<number | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => { speedRef.current = speed; }, [speed]);
  useEffect(() => { playingRef.current = playing; }, [playing]);

  function getMsgIdx(p: number) {
    let idx = 0;
    for (let i = MSGS.length - 1; i >= 0; i--) {
      if (p >= MSGS[i][0]) { idx = i; break; }
    }
    return idx;
  }

  function getLit(p: number) {
    let idx = 0;
    for (let i = MILESTONES.length - 1; i >= 0; i--) {
      if (p >= MILESTONES[i].pct - 0.001) { idx = i; break; }
    }
    return idx;
  }

  function updateMsg(text: string) {
    setMsgVisible(false);
    setTimeout(() => { setMsg(text); setMsgVisible(true); }, 320);
  }

  function spawnConfetti() {
    const cv = canvasRef.current;
    const root = rootRef.current;
    if (!cv || !root) return;
    cv.width = root.offsetWidth;
    cv.height = root.offsetHeight;
    const ctx = cv.getContext("2d");
    if (!ctx) return;
    const parts: {
      x: number; y: number; vx: number; vy: number; col: string;
      w: number; h: number; rot: number; rv: number;
      g: number; life: number; decay: number;
    }[] = [];
    for (let i = 0; i < 100; i++) {
      const a = Math.random() * Math.PI * 2;
      const v = 2 + Math.random() * 6;
      parts.push({
        x: cv.width / 2 + (Math.random() - 0.5) * 100,
        y: cv.height * 0.25,
        vx: Math.cos(a) * v * (Math.random() > 0.5 ? 1 : 0.3),
        vy: -Math.abs(Math.sin(a) * v) - 0.5,
        col: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
        w: 3 + Math.random() * 6,
        h: 2 + Math.random() * 3,
        rot: Math.random() * 6.28,
        rv: (Math.random() - 0.5) * 0.2,
        g: 0.18 + Math.random() * 0.12,
        life: 1,
        decay: 0.009 + Math.random() * 0.006,
      });
    }
    function draw() {
      ctx!.clearRect(0, 0, cv!.width, cv!.height);
      let alive = false;
      parts.forEach((p) => {
        p.x += p.vx; p.y += p.vy; p.vy += p.g; p.vx *= 0.99;
        p.rot += p.rv; p.life -= p.decay;
        if (p.life <= 0) return;
        alive = true;
        ctx!.save();
        ctx!.globalAlpha = Math.max(0, p.life);
        ctx!.translate(p.x, p.y);
        ctx!.rotate(p.rot);
        ctx!.fillStyle = p.col;
        ctx!.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        ctx!.restore();
      });
      if (alive) requestAnimationFrame(draw);
      else ctx!.clearRect(0, 0, cv!.width, cv!.height);
    }
    draw();
  }

  function loop(ts: number) {
    if (!playingRef.current) return;
    if (lastTsRef.current == null) lastTsRef.current = ts;
    const dt = Math.min((ts - lastTsRef.current) / 1000, 0.1);
    lastTsRef.current = ts;
    pctRef.current += (speedRef.current * dt) / 30;

    if (pctRef.current >= 1) {
      pctRef.current = 1;
      setAnimPct(1);
      setLitMs(MILESTONES.length - 1);
      playingRef.current = false;
      spawnConfetti();
      updateMsg("We did it. The land is saved. 350 dogs have a home.");
      setTimeout(() => {
        pctRef.current = 0;
        prevMsgRef.current = -1;
        prevLitRef.current = -1;
        setLoopN((n) => n + 1);
        lastTsRef.current = null;
        playingRef.current = true;
        rafRef.current = requestAnimationFrame(loop);
      }, 3800);
      return;
    }

    const p = pctRef.current;
    setAnimPct(p);

    const mi = getMsgIdx(p);
    if (mi !== prevMsgRef.current) {
      prevMsgRef.current = mi;
      updateMsg(MSGS[mi][1]);
    }

    const lit = getLit(p);
    if (lit !== prevLitRef.current) {
      prevLitRef.current = lit;
      setLitMs(lit);
    }

    rafRef.current = requestAnimationFrame(loop);
  }

  useEffect(() => {
    rafRef.current = requestAnimationFrame(loop);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, []);

  function togglePlay() {
    const next = !playingRef.current;
    playingRef.current = next;
    setPlaying(next);
    if (next) {
      lastTsRef.current = null;
      rafRef.current = requestAnimationFrame(loop);
    } else if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
    }
  }

  const raisedPct = ((raisedEur / goalEur) * 100).toFixed(1);

  return (
    <section className="bg-white dark:bg-stone-900 py-12 px-6">
      <div ref={rootRef} className="relative max-w-lg mx-auto">
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none rounded-xl z-10" />

        {/* Eyebrow */}
        <p className="text-center text-xs font-medium tracking-widest uppercase mb-5" style={{ color: "#A32D2D" }}>
          Emergency appeal
        </p>

        {/* Big number */}
        <div className="text-center mb-8">
          <p className="text-xs tracking-widest uppercase text-stone-400 mb-1">Actually raised</p>
          <p className="text-5xl font-medium tracking-tight" style={{ color: "#7B1010" }}>
            €{raisedEur.toLocaleString("en-GB")}
          </p>
          <p className="text-sm text-stone-400 mt-1">of €{goalEur.toLocaleString("en-GB")} needed</p>
        </div>

        {/* Animated label */}
        <p className="text-center text-xs text-stone-400 mb-1">
          €{Math.round(animPct * goalEur).toLocaleString("en-GB")} &nbsp;·&nbsp; animated progress
        </p>

        {/* Track */}
        <div className="relative h-1.5 rounded-full bg-stone-100 dark:bg-stone-800 mb-1 overflow-visible">
          <div
            className="h-full rounded-full relative"
            style={{ width: `${animPct * 100}%`, backgroundColor: "#7B1010", transition: "width 0.15s linear" }}
          >
            <div
              className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full border-2 border-white"
              style={{ backgroundColor: "#7B1010", transform: "translate(50%, -50%)" }}
            />
          </div>
        </div>

        {/* Milestones */}
        <div className="flex justify-between mb-8">
          {MILESTONES.map((m, i) => (
            <div key={i} className="flex flex-col items-center gap-1">
              <div
                className="w-1.5 h-1.5 rounded-full"
                style={{ backgroundColor: i <= litMs ? "#7B1010" : "#e5e7eb" }}
              />
              <span
                className="text-[10px]"
                style={{ color: i <= litMs ? "#7B1010" : "#9ca3af" }}
              >
                {m.label}
              </span>
            </div>
          ))}
        </div>

        {/* Rotating message */}
        <p
          className="text-center text-sm text-stone-500 dark:text-stone-400 leading-relaxed mb-8 max-w-sm mx-auto transition-opacity duration-500"
          style={{ opacity: msgVisible ? 1 : 0 }}
        >
          {msg}
        </p>

        {/* CTA */}
        <div className="text-center mb-8">
          <a
            href="https://gofund.me/6df90b013"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-8 py-4 rounded-full text-white text-base font-medium transition-all hover:opacity-90 hover:scale-[1.02] active:scale-[0.98]"
            style={{ backgroundColor: "#7B1010" }}
          >
            <span className="w-2 h-2 rounded-full bg-white animate-pulse shrink-0" />
            Donate now — save their home
          </a>
          <p className="text-xs text-stone-400 mt-3">Secure. Takes 30 seconds. Every euro counts.</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 divide-x divide-stone-100 dark:divide-stone-800 border border-stone-100 dark:border-stone-800 rounded-xl overflow-hidden mb-6">
          {[
            { n: "350", l: "dogs at risk" },
            { n: "50",  l: "disabled dogs" },
            { n: `${raisedPct}%`, l: "of goal reached" },
          ].map((s, i) => (
            <div key={i} className="py-4 text-center">
              <div className="text-xl font-medium text-stone-800 dark:text-stone-100">{s.n}</div>
              <div className="text-[10px] text-stone-400 mt-0.5 leading-tight">{s.l}</div>
            </div>
          ))}
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={togglePlay}
            className="text-xs px-3 py-1.5 rounded-full border border-stone-200 dark:border-stone-700 text-stone-500 hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors"
          >
            {playing ? "Pause" : "Play"}
          </button>
          <select
            className="text-xs px-3 py-1.5 rounded-full border border-stone-200 dark:border-stone-700 text-stone-500 bg-transparent"
            onChange={(e) => setSpeed(parseFloat(e.target.value))}
          >
            <option value="0.5">Slow</option>
            <option value="1">Normal</option>
            <option value="3">Fast</option>
          </select>
          <span className="text-xs text-stone-300 dark:text-stone-600">Loop {loopN}</span>
        </div>
      </div>
    </section>
  );
}
