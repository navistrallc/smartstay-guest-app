import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { autoReply } from "../lib/assistant";
import type { StayView } from "../lib/stay";
import { readStore, useStored, writeStore } from "../lib/storage";

interface Msg { from: "me" | "host"; text: string; guide?: string | false; at: number }
const QUICK = ["Wi-Fi password?", "Can we check in early?", "How does the hot tub work?", "Where do bins go?"];

export function MessagesTab({ v, draft, onReplyWhileAway }: { v: StayView; draft: string; onReplyWhileAway: () => void }) {
  const key = "chat:" + v.property.id;
  const [log, setLog] = useStored<Msg[]>(key, [
    { from: "host", at: Date.now(), text: `Hi ${v.guest}, welcome to ${v.property.name}! This is the ${v.host.name} team. Your door code and Wi-Fi are on the Stay tab. If anything isn't right when you arrive, tell us here and we'll sort it out.` },
  ]);
  const [input, setInput] = useState(draft);
  const [typing, setTyping] = useState(false);
  const [freshFrom, setFreshFrom] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const mounted = useRef(true);

  useEffect(() => { mounted.current = true; return () => { mounted.current = false } }, []);
  useEffect(() => { if (draft) inputRef.current?.focus() }, [draft]);
  useEffect(() => { window.scrollTo(0, document.body.scrollHeight) }, [log.length, typing]);

  const send = (text: string) => {
    text = text.trim(); if (!text) return;
    setFreshFrom(log.length);
    setLog(l => [...l, { from: "me", text, at: Date.now() }]);
    setInput(""); setTyping(true);
    setTimeout(() => {
      const r = autoReply(text, v), reply: Msg = { from: "host", text: r.text, guide: r.guide, at: Date.now() };
      if (mounted.current) { setLog(l => [...l, reply]); setTyping(false) }
      else { writeStore(key, [...readStore<Msg[]>(key, []), reply]); onReplyWhileAway() }
    }, 1200);
  };

  return (
    <>
      <div className="card host-card">
        <span className="avatar">{v.host.name[0]}</span>
        <div><h2 style={{ fontSize: 22 }}>{v.host.name}</h2><p className="muted" style={{ fontSize: 13 }}>Host · {v.host.responseTime}</p></div>
      </div>
      <div className="chat" id="chat" aria-live="polite">
        <span className="day">Today</span>
        {log.map((m, i) => (
          <div key={m.at + "-" + i} className={`msg ${m.from === "me" ? "me" : "host"}${freshFrom >= 0 && i >= freshFrom ? " new" : ""}`}>
            {m.guide && <span className="src">From the house guide{typeof m.guide === "string" ? " · " + m.guide : ""}</span>}
            <span>{m.text}</span>
          </div>
        ))}
        {typing && <div className="typing" aria-label={`${v.host.name} is typing`}><i /><i /><i /></div>}
      </div>
      {createPortal(<div className="composer gutter">
        <div className="inner">
          <div className="chips">{QUICK.map(q => <button key={q} className="chip" type="button" onClick={() => send(q)}>{q}</button>)}</div>
          <form autoComplete="off" onSubmit={e => { e.preventDefault(); send(input) }}>
            <input id="chatInput" ref={inputRef} value={input} onChange={e => setInput(e.target.value)} placeholder="Write to your host…" aria-label="Message your host" />
            <button className="send" type="submit" aria-label="Send">
              <svg viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
            </button>
          </form>
        </div>
      </div>, document.body)}
    </>
  );
}
