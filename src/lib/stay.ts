import { SAMPLE_STAY } from "../data/sample";
import { DEFAULT_CHECKOUT_TASKS, HOST, defaultGuide } from "../data/defaults";
import { PLACES } from "../data/places";
import type { GuideSection, Host, Photo, Place, Property, Stay } from "../data/types";
import { distBearing } from "./geo";
import { addDays, parseDay, startOfToday } from "./time";

/** Where stays come from. Set VITE_STAY_URL (e.g. https://api.smartstay.ai/guest-stay/) and the
 *  token from the guest's link (#<token>) is appended. The endpoint returns a `Stay` as JSON. */
const STAY_URL: string | undefined = import.meta.env.VITE_STAY_URL;

export interface PlaceWithDistance extends Place {
  dist: number;
  bearing: number;
}

/** Everything the screens need, derived once from a Stay. */
export interface StayView {
  property: Property;
  host: Host;
  guest: string;
  guests: number;
  doorCode: string;
  checkIn: Date;
  checkOut: Date;
  nights: number;
  address: string;
  mapsQuery: string;
  checkoutTasks: string[];
  guide: GuideSection[];
  places: PlaceWithDistance[];
  photos: Photo[];
}

export async function loadStay(token: string): Promise<Stay> {
  if (!STAY_URL || !token) return SAMPLE_STAY;
  try {
    const res = await fetch(STAY_URL + encodeURIComponent(token));
    if (res.ok) return (await res.json()) as Stay;
  } catch {
    /* fall through to the sample */
  }
  return SAMPLE_STAY;
}

export function toView(stay: Stay): StayView {
  const p = stay.property, r = stay.reservation;
  const today = startOfToday();
  const checkIn = parseDay(r.checkIn) ?? today;
  const checkOut = parseDay(r.checkOut) ?? addDays(today, 3);
  const places = PLACES.map(pl => ({ ...pl, ...distBearing(p, pl) })).sort((a, b) => a.dist - b.dist);
  return {
    property: p,
    host: HOST,
    guest: r.guestName,
    guests: r.guests,
    doorCode: r.doorCode,
    checkIn,
    checkOut,
    nights: Math.max(1, Math.round((checkOut.getTime() - checkIn.getTime()) / 864e5)),
    address: p.address || p.area,
    mapsQuery: p.address || `${p.name} ${p.area}`,
    checkoutTasks: p.checkoutTasks ?? DEFAULT_CHECKOUT_TASKS,
    guide: p.guide ?? defaultGuide(p),
    places,
    photos: p.photos ?? [],
  };
}
