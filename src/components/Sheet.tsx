import { useEffect, type ReactNode } from "react";
import { createPortal } from "react-dom";

/** Bottom sheet that slides up over the page. Closes on the backdrop or Escape.
 *  Rendered into <body> so it sits above the tab bar, outside the page's stacking context. */
export function Sheet({ label, onClose, className = "", children }: { label: string; onClose: () => void; className?: string; children: ReactNode }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    addEventListener("keydown", onKey);
    return () => removeEventListener("keydown", onKey);
  }, [onClose]);
  return createPortal(
    <>
      <div className="scrim" onClick={onClose} />
      <div className={"sheet gutter " + className} role="dialog" aria-modal="true" aria-label={label}>{children}</div>
    </>,
    document.body,
  );
}
