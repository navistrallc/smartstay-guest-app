import { useEffect, useRef, useState } from "react";
import { useToast } from "./Toast";

/* The header on every tab: a live Blue Ridge sky that follows the real time of day,
   or the cabin's first photo when one loads. */

type SkyKey = "dawn" | "day" | "dusk" | "night";
const SKIES: Record<SkyKey, { g: string; orb: string; glow: string; stars: number; label: string }> = {
  dawn: { g: "linear-gradient(180deg,#27304f 0%,#6d5f86 55%,#e0a07c 100%)", orb: "#ffe0b0", glow: "rgba(255,200,140,.6)", stars: 0.25, label: "Dawn" },
  day: { g: "linear-gradient(180deg,#1c4767 0%,#3c78a2 55%,#8db6cf 100%)", orb: "#fff6dc", glow: "rgba(255,240,200,.7)", stars: 0, label: "Daytime" },
  dusk: { g: "linear-gradient(180deg,#181b38 0%,#553c63 50%,#d27d4c 100%)", orb: "#ffc27a", glow: "rgba(255,170,100,.7)", stars: 0.45, label: "Dusk" },
  night: { g: "linear-gradient(180deg,#0a1720 0%,#152a37 60%,#22404f 100%)", orb: "#f1e6c8", glow: "rgba(241,230,200,.35)", stars: 1, label: "Night" },
};
const ORDER: SkyKey[] = ["dawn", "day", "dusk", "night"];

function skyAt(now: Date, override: SkyKey | null) {
  const h = now.getHours() + now.getMinutes() / 60;
  const key: SkyKey = override ?? (h >= 5.5 && h < 8 ? "dawn" : h >= 8 && h < 17.5 ? "day" : h >= 17.5 && h < 20 ? "dusk" : "night");
  const p = override ? { dawn: 0.1, day: 0.45, dusk: 0.88, night: 0.6 }[key]
    : key === "night" ? ((h + 4) % 24) / 9.5 : Math.min(1, Math.max(0, (h - 5.5) / 14.5));
  return { key, ...SKIES[key], x: 74 + 18 * p, y: 76 - 22 * Math.sin(Math.PI * p) };
}

/* Seeded so the star field doesn't jump between renders. */
const STARS = (() => {
  let s = 7; const r = () => (s = (s * 9301 + 49297) % 233280) / 233280;
  return Array.from({ length: 46 }, () => ({ left: r() * 100, top: r() * 100, delay: r() * 3.6, scale: 0.5 + r() }));
})();

/** "Welcome in, *Maya*" → words that animate in one by one; *starred* words are emphasized. */
function Headline({ text }: { text: string }) {
  const parts = text.split(/(\*[^*]+\*|\s+|\n)/).filter(Boolean);
  let i = 0;
  return (
    <h1>
      {parts.map((w, k) => {
        if (w === "\n") return <br key={k} />;
        if (/^\s+$/.test(w)) return " ";
        const em = w.startsWith("*");
        const word = <span key={k} className="w" style={{ animationDelay: `${(++i) * 0.07}s` }}>{em ? w.slice(1, -1) : w}</span>;
        return em ? <em key={k}>{word}</em> : word;
      })}
    </h1>
  );
}

export function Hero({ eyebrow, title, sub, pill, photo }: { eyebrow: string; title: string; sub?: string; pill: string; photo?: string }) {
  const [override, setOverride] = useState<SkyKey | null>(null);
  const [now, setNow] = useState(() => new Date());
  const ref = useRef<HTMLElement>(null);
  const toast = useToast();

  useEffect(() => { const t = setInterval(() => setNow(new Date()), 30000); return () => clearInterval(t) }, []);
  useEffect(() => {
    const onScroll = () => ref.current?.style.setProperty("--sc", String(Math.min(window.scrollY, 400)));
    addEventListener("scroll", onScroll, { passive: true });
    return () => removeEventListener("scroll", onScroll);
  }, []);

  const sky = skyAt(now, override);
  const cycle = () => { const next = ORDER[(ORDER.indexOf(sky.key) + 1) % 4]; setOverride(next); toast(SKIES[next].label + " preview") };

  return (
    <header ref={ref} className={"hero" + (photo ? " photo" : "")} style={{ background: photo ? "#0b1820" : sky.g }}>
      {photo && <div className="photo-bg" style={{ backgroundImage: `url("${photo}")` }} />}
      <div className="stars" style={{ opacity: sky.stars }}>
        {STARS.map((s, k) => <i key={k} style={{ left: `${s.left}%`, top: `${s.top}%`, animationDelay: `${s.delay}s`, transform: `scale(${s.scale})` }} />)}
      </div>
      <button className="orb" type="button" onClick={cycle} aria-label={`${sky.label} sky. Tap to preview another time of day`}
        style={{ left: `${sky.x}%`, top: `${sky.y}%`, background: sky.orb, boxShadow: `0 0 0 8px ${sky.glow.replace(/[\d.]+\)$/, ".12)")}, 0 0 60px 18px ${sky.glow}` }} />
      <Ridges />
      <div className="fog" /><div className="fog b" /><div className="paper-edge" />
      <div className="inner gutter">
        <div className="topline"><span className="wordmark">SmartStay<i>.ai</i></span><span className="pill">{pill}</span></div>
        <div><div className="eyebrow">{eyebrow}</div><Headline text={title} /></div>
        {sub && <p className="sub">{sub}</p>}
      </div>
    </header>
  );
}

function Ridges() {
  return (
    <svg className="ridges" viewBox="0 0 400 160" preserveAspectRatio="none" aria-hidden="true">
      <path className="l1" fill="var(--ridge-1)" opacity=".85" d="M0 70 C40 52 70 60 100 48 C135 34 160 58 200 46 C240 34 270 50 300 42 C340 32 370 50 400 44 V160 H0Z" />
      <path className="l2" fill="var(--ridge-2)" opacity=".92" d="M0 92 C30 80 60 86 95 74 C130 62 165 84 210 72 C250 62 280 78 320 68 C355 60 380 72 400 68 V160 H0Z" />
      <path className="l3" fill="var(--ridge-3)" d="M0 112 C45 100 80 106 120 96 C160 86 190 104 235 96 C275 89 310 102 350 94 C372 90 388 94 400 92 V160 H0Z" />
      <g transform="translate(284 96)">
        <circle cx="13" cy="15" r="14" fill="#f2b55a" opacity=".14" />
        <path fill="var(--ridge-4)" d="M0 14 L13 3 L26 14 V26 H0Z" />
        <rect x="18" y="1" width="3" height="7" fill="var(--ridge-4)" />
        <rect className="win" x="9" y="14" width="7" height="6" fill="#f6bf62" />
      </g>
      <path fill="var(--ridge-4)" d="M0 130 C50 120 95 126 140 118 C190 110 230 126 280 118 C330 111 365 122 400 116 V160 H0Z" />
    </svg>
  );
}
