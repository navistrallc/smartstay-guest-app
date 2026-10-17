import { Icon } from "./Icon";

export type Tab = "stay" | "house" | "explore" | "messages";
export const TABS: [Tab, string][] = [["stay", "Stay"], ["house", "Guide"], ["explore", "Explore"], ["messages", "Host"]];

export function TabBar({ current, unread, onChange }: { current: Tab; unread: boolean; onChange: (t: Tab) => void }) {
  const idx = TABS.findIndex(t => t[0] === current);
  return (
    <nav className="tabs gutter" aria-label="Sections">
      <div className="inner">
        <div className="bar" role="tablist">
          <span className="slider" style={{ transform: `translateX(${idx * 100}%)` }} />
          {TABS.map(([key, label]) => (
            <button key={key} role="tab" id={"tab-" + key} aria-selected={key === current} onClick={() => key !== current && onChange(key)}>
              <Icon name={key} />{label}
              {key === "messages" && unread && current !== "messages" && <span className="dot" aria-label="New message" />}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}
