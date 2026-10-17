/** One guest's stay: the cabin plus their reservation. This is the JSON shape the stay endpoint returns. */
export interface Stay {
  property: Property;
  reservation: Reservation;
}

export interface Property {
  id: string;
  name: string;
  /** Town and state, e.g. "Sevierville, Tennessee". */
  area: string;
  /** Street address. Leave empty to show only the area. */
  address: string;
  /** e.g. "1 king bedroom + king loft · 2 baths · sleeps 4" */
  specs: string;
  lat: number;
  lon: number;
  photos: Photo[];
  /** 24-hour "HH:MM". */
  checkInTime: string;
  checkOutTime: string;
  wifi: { network: string; password: string };
  parking: string;
  codeNote: string;
  /** Optional per-cabin overrides. Defaults come from data/defaults.ts. */
  checkoutTasks?: string[];
  guide?: GuideSection[];
}

export interface Reservation {
  guestName: string;
  /** "YYYY-MM-DD". Null in the sample so the demo follows today's date. */
  checkIn: string | null;
  checkOut: string | null;
  guests: number;
  doorCode: string;
}

export interface Photo {
  src: string;
  caption?: string;
}

export type GuideIcon = "wifi" | "tub" | "flame" | "cup" | "bin" | "rules" | "alert";

export interface GuideSection {
  title: string;
  icon: GuideIcon;
  tags: string[];
  items: string[];
  wide?: boolean;
}

export interface Place {
  name: string;
  cat: string;
  lat: number;
  lon: number;
  pick: boolean;
  note: string;
  about: string;
  tips: string[];
  time: string;
  cost: string;
  url?: string;
}

export interface Host {
  name: string;
  full: string;
  email: string;
  responseTime: string;
}
