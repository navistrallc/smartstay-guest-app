import { useEffect, useMemo, useState } from "react";
import { Hero } from "./components/Hero";
import { TABS, TabBar, type Tab } from "./components/TabBar";
import { useStored } from "./lib/storage";
import { toView, type StayView } from "./lib/stay";
import type { Photo, Stay } from "./data/types";
import { stayPhase } from "./lib/time";
import { StayTab } from "./tabs/StayTab";
import { GuideTab } from "./tabs/GuideTab";
import { ExploreTab } from "./tabs/ExploreTab";
import { MessagesTab } from "./tabs/MessagesTab";

/** Keep only listing photos that actually load, so a blocked or broken image never shows. */
function useLoadedPhotos(photos: Photo[]) {
  const [ok, setOk] = useState<Set<string>>(new Set());
  useEffect(() => {
    photos.forEach(ph => { const im = new Image(); im.onload = () => setOk(s => new Set(s).add(ph.src)); im.src = ph.src });
  }, [photos]);
  return photos.filter(ph => ok.has(ph.src));
}

const initialTab = (): Tab => { const h = location.hash.slice(1); return TABS.some(t => t[0] === h) ? (h as Tab) : "stay" };

export function App({ stay }: { stay: Stay }) {
  const base = useMemo(() => toView(stay), [stay]);
  const photos = useLoadedPhotos(base.property.photos);
  const v: StayView = { ...base, photos };
  const phase = stayPhase(v.checkIn, v.checkOut, v.nights);
  const [tab, setTab] = useState<Tab>(initialTab);
  const [draft, setDraft] = useState("");
  const [unread, setUnread] = useStored("unread:" + v.property.id, false);

  const go = (t: Tab) => { setTab(t); if (t === "messages") setUnread(false); window.scrollTo(0, 0) };
  const message = (text: string) => { setDraft(text); go("messages") };
  useEffect(() => { if (tab !== "messages") setDraft("") }, [tab]);

  const greeting = {
    before: "Your cabin is *waiting*",
    during: `Welcome in, *${v.guest}*`,
    checkout: `Safe travels, *${v.guest}*`,
    after: "Thanks for *staying*",
  }[phase.key];
  const hero = {
    stay: { eyebrow: v.property.name, title: greeting, sub: `${v.property.area} · ${v.property.specs}` },
    house: { eyebrow: "House guide", title: "How the cabin *works*" },
    explore: { eyebrow: "Around " + v.property.area.split(",")[0], title: "Our favorite *Smokies* spots" },
    messages: { eyebrow: "Your host", title: `Talk to *${v.host.name}*` },
  }[tab];

  return (
    <>
      <div className="app">
        <Hero key={tab} {...hero} pill={phase.label} photo={photos[0]?.src} />
        <main key={"m-" + tab} className={`gutter ${tab} enter`}>
          {tab === "stay" && <StayTab v={v} phase={phase} onMessage={message} />}
          {tab === "house" && <GuideTab guide={v.guide} hostName={v.host.name} onAsk={message} />}
          {tab === "explore" && <ExploreTab v={v} onAsk={message} />}
          {tab === "messages" && <MessagesTab v={v} draft={draft} onReplyWhileAway={() => setUnread(true)} />}
        </main>
      </div>
      <TabBar current={tab} unread={unread} onChange={go} />
    </>
  );
}
