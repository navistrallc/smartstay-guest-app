import { useEffect, useState } from "react";
import { Icon } from "../components/Icon";
import { KeyCard } from "../components/KeyCard";
import { useToast } from "../components/Toast";
import { mapsUrl } from "../lib/geo";
import type { StayView } from "../lib/stay";
import { copyText } from "../lib/storage";
import { atTime, countdown, fmtDate, fmtTime, type Phase } from "../lib/time";

export function StayTab({ v, phase, onMessage }: { v: StayView; phase: Phase; onMessage: (draft: string) => void }) {
  const p = v.property;
  const toast = useToast();
  const [now, setNow] = useState(() => new Date());
  useEffect(() => { const t = setInterval(() => setNow(new Date()), 30000); return () => clearInterval(t) }, []);
  const [cdLabel, cdValue] = countdown(atTime(v.checkIn, p.checkInTime), atTime(v.checkOut, p.checkOutTime), now);
  const copy = async (text: string, label: string) => toast((await copyText(text)) ? `${label} copied` : "Press and hold the text to copy it");

  return (
    <>
      <div className="card summary">
        <div className="times">
          <div className="t"><span className="label">Check-in</span><span className="big">{fmtTime(p.checkInTime)}</span><span className="date">{fmtDate(v.checkIn)}</span></div>
          <span className="arrow" />
          <div className="t"><span className="label">Checkout</span><span className="big">{fmtTime(p.checkOutTime)}</span><span className="date">{fmtDate(v.checkOut)}</span></div>
        </div>
        <div>
          <div className="nights" style={{ gridTemplateColumns: `repeat(${v.nights},1fr)` }}>
            {Array.from({ length: v.nights }, (_, i) => <i key={i} className={i < phase.night ? "past" : i === phase.night ? "now" : ""} />)}
          </div>
          <div className="legend"><span>{v.nights} nights · {v.guests} guests</span><span id="cd">{cdLabel} <b>{cdValue}</b></span></div>
        </div>
      </div>

      <KeyCard code={v.doorCode} note={p.codeNote} open={phase.key === "during" || phase.key === "checkout"} unlockDate={fmtDate(v.checkIn)} />

      <div className="card arrival">
        <span className="ic"><Icon name="alert" /></span>
        <div>
          <h2 style={{ fontSize: 21 }}>Anything not right on arrival?</h2>
          <p className="muted" style={{ fontSize: 14, marginTop: 4 }}>If something is missing, broken or not as expected when you arrive, please contact {v.host.name} right away so it can be fixed.</p>
          <div className="acts">
            <button className="btn solid" onClick={() => onMessage("On arrival I noticed: ")}><Icon name="chat" />Message {v.host.name}</button>
            <button className="btn" onClick={() => copy(v.host.email, "Email address")}><Icon name="copy" />{v.host.email}</button>
          </div>
        </div>
      </div>

      {v.photos.length > 0 && (
        <div className="stack">
          <div className="section-label">The cabin</div>
          <div className="gallery">
            {v.photos.map(ph => (
              <figure key={ph.src}><img src={ph.src} alt={ph.caption || p.name} loading="lazy" />{ph.caption && <figcaption>{ph.caption}</figcaption>}</figure>
            ))}
          </div>
        </div>
      )}

      <div className="stack">
        <div className="section-label">Arriving</div>
        <div className="card stack">
          <div>
            <div className="addr">{v.address}</div>
            {!p.address && <p className="muted" style={{ fontSize: 13, marginTop: 4 }}>Street address comes from your booking data.</p>}
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <a className="btn solid" href={mapsUrl(v.mapsQuery)} target="_blank" rel="noopener"><Icon name="pin" />Directions</a>
            <button className="btn" onClick={() => copy(v.address, "Address")}><Icon name="copy" />Copy</button>
          </div>
        </div>
        <div className="card kv">
          <div className="line"><div><span className="label">Wi-Fi</span><span className="val mono">{p.wifi.network}</span></div></div>
          <div className="line">
            <div><span className="label">Password</span><span className="val mono">{p.wifi.password}</span></div>
            <button className="btn" onClick={() => copy(p.wifi.password, "Wi-Fi password")}><Icon name="copy" />Copy</button>
          </div>
          <div className="line"><div><span className="label">Parking</span><span className="muted">{p.parking}</span></div></div>
        </div>
      </div>

      <div className="stack">
        <div className="section-label">Before you go</div>
        <div className="card">
          <div className="checkout-head"><h2 style={{ fontSize: 24 }}>Checkout by {fmtTime(p.checkOutTime)}</h2><span className="label">{fmtDate(v.checkOut)}</span></div>
          <ol className="steps">{v.checkoutTasks.map(t => <li key={t}>{t}</li>)}</ol>
        </div>
      </div>
      <p className="foot">
        Example stay for {v.guest}. Door code, Wi-Fi and house notes are examples. Dates follow today so you can see the live view.
        {v.photos.length === 0 && <><br />Tap the sun or moon to preview the sky at other times of day.</>}
      </p>
    </>
  );
}
