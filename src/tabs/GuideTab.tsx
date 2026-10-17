import { useState } from "react";
import { Icon } from "../components/Icon";
import { Sheet } from "../components/Sheet";
import type { GuideSection } from "../data/types";

function Highlight({ text, q }: { text: string; q: string }) {
  const i = q ? text.toLowerCase().indexOf(q.toLowerCase()) : -1;
  if (i < 0) return <>{text}</>;
  return <>{text.slice(0, i)}<mark>{text.slice(i, i + q.length)}</mark>{text.slice(i + q.length)}</>;
}

export function GuideTab({ guide, hostName, onAsk }: { guide: GuideSection[]; hostName: string; onAsk: (draft: string) => void }) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState<GuideSection | null>(null);
  const q = query.trim(), ql = q.toLowerCase();

  const hits = q ? guide.flatMap(s => {
    const sectionHit = s.tags.some(t => t.includes(ql)) || s.title.toLowerCase().includes(ql);
    return s.items.filter(it => sectionHit || it.toLowerCase().includes(ql)).map(it => ({ s, it }));
  }) : [];

  return (
    <>
      <label className="search">
        <Icon name="search" />
        <input id="guideSearch" type="search" placeholder="Hot tub, thermostat, trash day…" value={query} onChange={e => setQuery(e.target.value)} aria-label="Search the house guide" />
      </label>
      <div>
        {!q ? (
          <div className="tiles">
            {guide.map(s => (
              <button key={s.title} className={"tile" + (s.wide ? " wide" : "")} onClick={() => setOpen(s)}>
                <span className="ic"><Icon name={s.icon} /></span>
                <span><div className="t">{s.title}</div><div className="n">{s.items.length} notes</div></span>
              </button>
            ))}
          </div>
        ) : hits.length ? (
          <div className="card">
            {hits.map(h => <div className="hit" key={h.it}><div className="label" style={{ marginBottom: 4 }}>{h.s.title}</div><Highlight text={h.it} q={q} /></div>)}
          </div>
        ) : (
          <div className="card empty">
            <h2 style={{ fontSize: 22 }}>Nothing on “{q}” yet</h2>
            <p className="muted">{hostName} can answer it directly.</p>
            <button className="btn solid" onClick={() => onAsk(`Question about ${q}: `)}>Ask {hostName}</button>
          </div>
        )}
      </div>
      {open && (
        <Sheet label={open.title} onClose={() => setOpen(null)}>
          <span className="grab" />
          <div className="head"><span className="ic"><Icon name={open.icon} /></span><h2>{open.title}</h2></div>
          <ol className="steps">{open.items.map(it => <li key={it}>{it}</li>)}</ol>
          <button className="btn" style={{ justifySelf: "start" }} onClick={() => setOpen(null)}>Close</button>
        </Sheet>
      )}
    </>
  );
}
