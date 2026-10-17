import type { StayView } from "./stay";
import { fmtTime } from "./time";

export interface Reply { text: string; guide: string | false }

/** Demo assistant: answers common questions from the house guide and flags everything else for the host.
 *  In production this is where a real AI model or the host's inbox plugs in. */
export function autoReply(text: string, v: StayView): Reply {
  const q = text.toLowerCase(), p = v.property, host = v.host;
  if (/early|late check|late checkout|extend/.test(q))
    return { text: `I've passed this to ${host.name}, who will confirm based on the cleaning schedule. Standard times are ${fmtTime(p.checkInTime)} check-in and ${fmtTime(p.checkOutTime)} checkout.`, guide: false };
  if (/arriv|missing|broken|dirty|not working/.test(q))
    return { text: `Thanks for letting us know. ${host.name} has been alerted and will get back to you shortly. For anything urgent you can also email ${host.email}.`, guide: false };
  if (/wifi|wi-fi|internet|password/.test(q))
    return { text: `Network ${p.wifi.network}, password ${p.wifi.password}.`, guide: "Wi-Fi & TV" };
  if (/code|door|lock|key/.test(q))
    return { text: "The keypad is on the front door. Your code is on the Stay tab from check-in day.", guide: "Arriving" };
  const bins = v.guide.find(s => s.icon === "bin");
  if (/bin/.test(q) && bins) return { text: bins.items.join(" "), guide: bins.title };
  const hit = v.guide.find(s => s.tags.some(t => q.includes(t)));
  if (hit) return { text: hit.items.join(" "), guide: hit.title };
  return { text: `Thanks! ${host.name} has your message and ${host.responseTime}. For emergencies call 911.`, guide: false };
}
