export const startOfToday = () => { const d = new Date(); d.setHours(0, 0, 0, 0); return d };
export const addDays = (d: Date, n: number) => { const x = new Date(d); x.setDate(x.getDate() + n); return x };
export const parseDay = (v: string | null) => { if (!v) return null; const d = new Date(v + "T00:00"); return isNaN(d.getTime()) ? null : d };
export const atTime = (d: Date, hhmm: string) => { const [h, m] = hhmm.split(":").map(Number); const x = new Date(d); x.setHours(h, m, 0, 0); return x };

export const fmtDate = (d: Date) => d.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" });
export const fmtTime = (hhmm: string) => { const [h, m] = hhmm.split(":").map(Number); return new Date(2000, 0, 1, h, m).toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" }) };

export type PhaseKey = "before" | "during" | "checkout" | "after";
export interface Phase { key: PhaseKey; label: string; night: number }

export function stayPhase(checkIn: Date, checkOut: Date, nights: number, now = new Date()): Phase {
  const day = new Date(now); day.setHours(0, 0, 0, 0);
  if (day < checkIn) return { key: "before", label: "Upcoming", night: -1 };
  if (day >= checkOut) return day.getTime() === checkOut.getTime()
    ? { key: "checkout", label: "Checkout day", night: nights }
    : { key: "after", label: "Stay complete", night: nights };
  const n = Math.round((day.getTime() - checkIn.getTime()) / 864e5);
  return { key: "during", label: `Night ${n + 1} of ${nights}`, night: n };
}

export function countdown(checkInAt: Date, checkOutAt: Date, now = new Date()): [string, string] {
  const span = (ms: number) => {
    const m = Math.max(0, Math.round(ms / 6e4)), d = Math.floor(m / 1440), h = Math.floor((m % 1440) / 60);
    return d ? `${d}d ${h}h` : `${h}h ${m % 60}m`;
  };
  if (now < checkInAt) return ["Check-in in", span(checkInAt.getTime() - now.getTime())];
  if (now < checkOutAt) return ["Checkout in", span(checkOutAt.getTime() - now.getTime())];
  return ["Checked out", ""];
}
