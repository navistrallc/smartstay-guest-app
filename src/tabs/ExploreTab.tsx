import { useState } from "react";
import { Icon } from "../components/Icon";
import { Sheet } from "../components/Sheet";
import { driveMinutes, mapsUrl } from "../lib/geo";
import type { StayView } from "../lib/stay";
import { TopoMap } from "./TopoMap";

export function ExploreTab({ v, onAsk }: { v: StayView; onAsk: (draft: string) => void }) {
  const [cat, setCat] = useState("All");
  const [selected, setSelected] = useState<number | null>(null);
  const [open, setOpen] = useState<number | null>(null);
  const cats = ["All", "Host picks", ...new Set(v.places.map(p => p.cat))];
  const shown = v.places.filter(p => cat === "All" || (cat === "Host picks" ? p.pick : p.cat === cat));

  const pickOnMap = (i: number) => { setSelected(i); requestAnimationFrame(() => document.getElementById("place-" + i)?.scrollIntoView({ behavior: "smooth", block: "center" })) };
  const openPlace = (i: number) => { setSelected(i); setOpen(i) };
  const p = open !== null ? v.places[open] : null;

  return (
    <>
      <div className="chips" role="group" aria-label="Filter places">
        {cats.map(c => <button key={c} className="chip" aria-pressed={c === cat} onClick={() => { setCat(c); setSelected(null) }}>{c}</button>)}
      </div>
      <TopoMap all={v.places} shown={shown} selected={selected} cabin={v.property.name} onPick={pickOnMap} />
      <div className="stack">
        {shown.map(pl => {
          const i = v.places.indexOf(pl);
          return (
            <div key={pl.name} className={"card place" + (selected === i ? " sel" : "")} id={"place-" + i} onClick={() => openPlace(i)}>
              <span className={"num" + (pl.pick ? " pick" : "")}>{i + 1}</span>
              <div className="body">
                <div className="top"><span className="name">{pl.name}</span><span className="dist">≈{pl.dist.toFixed(1)} mi</span></div>
                <p className="muted">{pl.note}</p>
                <div className="meta">
                  <span className="tag">{pl.cat}</span>
                  {pl.pick && <span className="tag pick">★ Host pick</span>}
                  <button className="more" data-open-place={i}>Learn more →</button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {p && open !== null && (
        <Sheet label={p.name} className="place-sheet" onClose={() => setOpen(null)}>
          <div className={"place-band" + (p.pick ? " pick" : "")}>
            <span className="grab" /><span className="big">{open + 1}</span>
            <span className="label">{p.cat}</span><h2>{p.name}</h2>
            {p.pick && <span className="pk">★ {v.host.name} pick</span>}
          </div>
          <div className="stats">
            <div><span className="label">Distance</span><b>≈{p.dist.toFixed(1)} mi</b></div>
            <div><span className="label">Drive</span><b>~{driveMinutes(p.dist)} min</b></div>
            <div><span className="label">Plan for</span><b>{p.time || "—"}</b></div>
            <div><span className="label">Cost</span><b>{p.cost || "—"}</b></div>
          </div>
          <p>{p.about || p.note}</p>
          {p.tips.length > 0 && (
            <div className="stack">
              <div className="section-label">Insider tips</div>
              <ul className="tips">{p.tips.map(t => <li key={t}>{t}</li>)}</ul>
            </div>
          )}
          <div className="acts-row">
            <a className="btn solid" href={mapsUrl(p.name + " Tennessee")} target="_blank" rel="noopener"><Icon name="pin" />Directions</a>
            {p.url && <a className="btn" href={p.url} target="_blank" rel="noopener">Website ↗</a>}
            <button className="btn" data-ask-place={open} onClick={() => { setOpen(null); onAsk(`Any tips for ${p.name}? `) }}><Icon name="chat" />Ask {v.host.name}</button>
          </div>
          <p className="foot" style={{ textAlign: "left" }}>Distance and drive time are estimates from the cabin. Check hours before you go.</p>
        </Sheet>
      )}
    </>
  );
}
