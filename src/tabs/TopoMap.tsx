import type { PlaceWithDistance } from "../lib/stay";

/* Stylized topographic map: the cabin in the middle, each spot placed by real compass bearing.
   Distance uses a square-root scale so nearby and far spots both fit. */
const W = 340, H = 250, CX = 170, CY = 125;

const CONTOURS = (() => {
  const peaks: [number, number, number, number][] = [[250, 60, 1.3, 1], [80, 190, 1, 2.4], [300, 210, 0.8, 4.1], [60, 50, 0.7, 5.3]];
  let d = "";
  for (const [px, py, sc, seed] of peaks) for (let k = 1; k <= 6; k++) {
    const pts: string[] = [];
    for (let a = 0; a <= 64; a++) {
      const t = (a / 64) * Math.PI * 2;
      const r = k * 13 * sc * (1 + 0.16 * Math.sin(3 * t + seed + k * 0.3) + 0.09 * Math.sin(5 * t + seed * 2));
      pts.push(`${(px + r * Math.cos(t)).toFixed(1)} ${(py + r * Math.sin(t) * 0.8).toFixed(1)}`);
    }
    d += "M" + pts.join("L") + "Z";
  }
  return d;
})();

export function TopoMap({ all, shown, selected, cabin, onPick }: {
  all: PlaceWithDistance[]; shown: PlaceWithDistance[]; selected: number | null; cabin: string; onPick: (i: number) => void;
}) {
  const maxD = Math.max(...all.map(p => p.dist));
  const k = 104 / Math.sqrt(maxD);
  const proj = (dist: number, bearing: number) => { const r = k * Math.sqrt(dist), a = (bearing * Math.PI) / 180; return [CX + r * Math.sin(a), CY - r * Math.cos(a)] };
  const rings = maxD > 15 ? [2, 8, 20] : [1, 4, 9];

  return (
    <div className="card map">
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Map of places around the cabin">
        <rect width={W} height={H} fill="var(--map-land)" />
        <path className="contour" d={CONTOURS} />
        {rings.map(m => (
          <g key={m}>
            <circle className="ringl" cx={CX} cy={CY} r={k * Math.sqrt(m)} />
            <text className="ringt" x={CX + 4} y={CY - k * Math.sqrt(m) - 3}>{m} mi</text>
          </g>
        ))}
        <text className="ringt" x={W - 18} y={18} textAnchor="middle">N</text>
        <path d={`M${W - 18} 22 v14`} stroke="var(--muted)" strokeWidth="1" />
        <circle className="pulse" cx={CX} cy={CY} r="10" />
        <path className="home" d={`M${CX - 8} ${CY + 1} L${CX} ${CY - 7} L${CX + 8} ${CY + 1} V${CY + 8} H${CX - 8}Z`} />
        {shown.map(p => {
          const i = all.indexOf(p), [x, y] = proj(p.dist, p.bearing);
          return (
            <g key={p.name} className={"pin" + (p.pick ? " pick" : "") + (selected === i ? " sel" : "")} data-place={i}
              transform={`translate(${x.toFixed(1)} ${y.toFixed(1)})`} role="button" tabIndex={0} aria-label={p.name}
              onClick={() => onPick(i)} onKeyDown={e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onPick(i) } }}>
              <circle className="halo" r="16" /><circle className="dot" r="10" /><text>{i + 1}</text>
            </g>
          );
        })}
      </svg>
      <div className="cap"><span>⌂ {cabin}</span><span>Rings compress with distance</span></div>
    </div>
  );
}
