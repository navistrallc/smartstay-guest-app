import { useRef, useState, type PointerEvent } from "react";
import { Icon } from "./Icon";
import { useToast } from "./Toast";
import { copyText } from "../lib/storage";

/** Door code card. Before check-in day the code is locked; on the day, the guest slides the handle to reveal it. */
export function KeyCard({ code, note, open, unlockDate }: { code: string; note: string; open: boolean; unlockDate: string }) {
  const [revealed, setRevealed] = useState(false);
  const [flip, setFlip] = useState(false);
  const [x, setX] = useState(0);
  const [snapping, setSnapping] = useState(false);
  const drag = useRef<{ x0: number; max: number } | null>(null);
  const slideRef = useRef<HTMLDivElement>(null);
  const toast = useToast();
  const show = open && revealed;

  const reveal = () => {
    setRevealed(true); setFlip(true);
    try { navigator.vibrate?.(20) } catch { /* not supported */ }
  };
  const down = (e: PointerEvent<HTMLButtonElement>) => {
    const s = slideRef.current!; setSnapping(false);
    drag.current = { x0: e.clientX, max: s.clientWidth - e.currentTarget.offsetWidth - 8 };
    e.currentTarget.setPointerCapture(e.pointerId);
  };
  const move = (e: PointerEvent) => { const d = drag.current; if (d) setX(Math.max(0, Math.min(d.max, e.clientX - d.x0))) };
  const up = () => {
    const d = drag.current; if (!d) return; drag.current = null;
    if (x > d.max * 0.82) { setX(d.max); setTimeout(reveal, 120) } else { setSnapping(true); setX(0) }
  };

  return (
    <div className="key">
      <div className="key-row">
        <span className="label">Door code</span>
        {show && <button className="btn ghost-night" onClick={async () => toast(await copyText(code) ? "Door code copied" : "Press and hold the code to copy it")}><Icon name="copy" />Copy</button>}
      </div>
      <div id="digits" className={"digits" + (show ? (flip ? " flip" : "") : " hidden")} aria-live="polite"
        aria-label={show ? "Door code " + code.split("").join(" ") : "Door code hidden"}>
        {code.split("").map((d, i) => <span key={i} style={{ animationDelay: `${i * 0.09}s` }}>{show ? d : "•"}</span>)}
      </div>
      {!open ? <p className="note">Your code unlocks here on {unlockDate}.</p>
        : show ? <p className="note">{note}</p>
        : (
          <div className={"slide" + (snapping ? " snap" : "")} id="slide" ref={slideRef}>
            <span className="fill" style={{ width: x + 56 }} />
            <span className="txt">Slide to reveal your code</span>
            <button className="knob" id="knob" type="button" aria-label="Reveal door code" style={{ transform: `translateX(${x}px)` }}
              onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up}
              onKeyDown={e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); reveal() } }}>
              <Icon name="chev" />
            </button>
          </div>
        )}
    </div>
  );
}
