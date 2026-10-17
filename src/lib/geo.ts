type LatLon = { lat: number; lon: number };

/** Straight-line distance in miles and compass bearing (0 = north) from a to b. */
export function distBearing(a: LatLon, b: LatLon) {
  const R = 3958.8, toR = (x: number) => (x * Math.PI) / 180;
  const f1 = toR(a.lat), f2 = toR(b.lat), dl = toR(b.lon - a.lon);
  const d = 2 * R * Math.asin(Math.sqrt(Math.sin((f2 - f1) / 2) ** 2 + Math.cos(f1) * Math.cos(f2) * Math.sin(dl / 2) ** 2));
  const y = Math.sin(dl) * Math.cos(f2), x = Math.cos(f1) * Math.sin(f2) - Math.sin(f1) * Math.cos(f2) * Math.cos(dl);
  return { dist: Math.max(0.3, d), bearing: ((Math.atan2(y, x) * 180) / Math.PI + 360) % 360 };
}

/** Rough mountain-road drive time in minutes, rounded to 5. */
export const driveMinutes = (miles: number) => Math.max(5, Math.round(((miles * 1.35) / 32) * 12) * 5);

export const mapsUrl = (q: string) => "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(q);
