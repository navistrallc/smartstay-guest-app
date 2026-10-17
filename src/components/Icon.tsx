/* Line icons, drawn on a 24px grid. */
const PATHS = {
  stay: '<path d="M4 11.5 12 5l8 6.5V20H4z"/><path d="M10 20v-5h4v5"/>',
  house: '<path d="M6 4h10a2 2 0 0 1 2 2v14H8a2 2 0 0 1-2-2z"/><path d="M6 18a2 2 0 0 1 2-2h10"/>',
  explore: '<circle cx="12" cy="12" r="8.5"/><path d="M15 9l-1.8 4.2L9 15l1.8-4.2z"/>',
  messages: '<path d="M5 6h14v10H10l-5 3.5z"/>',
  wifi: '<path d="M4 9.5a12 12 0 0 1 16 0M7 13a7.5 7.5 0 0 1 10 0M10 16.4a3 3 0 0 1 4 0"/><circle cx="12" cy="19" r=".6"/>',
  tub: '<path d="M4 12h16v2a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5z"/><path d="M7 12V6a2 2 0 0 1 4 0M14 6c0 1 1 1 1 2s-1 1-1 2"/>',
  flame: '<path d="M12 21c3.5 0 6-2.4 6-5.6 0-3.8-3.4-5.4-4-9.4-2.3 1.4-3.6 3.6-3.4 6.2-1-.6-1.6-1.7-1.6-2.8C7.5 11 6 13 6 15.4 6 18.6 8.5 21 12 21z"/>',
  cup: '<path d="M5 9h11v5a5 5 0 0 1-5 5h-1a5 5 0 0 1-5-5z"/><path d="M16 10h1.5a2.5 2.5 0 0 1 0 5H16M9 3.5c0 1 1 1 1 2.2M12.5 3.5c0 1 1 1 1 2.2"/>',
  bin: '<path d="M5 7h14M9 7V4.5h6V7M7 7l1 13h8l1-13"/>',
  rules: '<path d="M7 4h10v16H7z"/><path d="M10 9h4M10 13h4M10 17h2"/>',
  alert: '<path d="M12 4 3 20h18z"/><path d="M12 10v4M12 17v.2"/>',
  copy: '<rect x="8" y="8" width="11" height="11" rx="2"/><path d="M5 15V6a1 1 0 0 1 1-1h9"/>',
  pin: '<path d="M12 21s6-5.6 6-11a6 6 0 0 0-12 0c0 5.4 6 11 6 11z"/><circle cx="12" cy="10" r="2"/>',
  search: '<circle cx="11" cy="11" r="6.5"/><path d="m16 16 4 4"/>',
  chev: '<path d="M9 6l6 6-6 6"/>',
  chat: '<path d="M5 6h14v10H10l-5 3.5z"/><path d="M9 11h6"/>'
};

export type IconName = keyof typeof PATHS;

export function Icon({ name, className }: { name: IconName; className?: string }) {
  return <svg viewBox="0 0 24 24" aria-hidden="true" className={className} dangerouslySetInnerHTML={{ __html: PATHS[name] }} />;
}
