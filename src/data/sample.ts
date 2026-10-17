import type { Stay } from "./types";

const WP = "https://www.smartstayvacationrentals.com/wp-content/uploads/2026/";

/* Shown until the stay endpoint is connected. Property details are from the real Moonshine Cabin listing;
   guest, dates, door code, Wi-Fi and notes are EXAMPLES. */
export const SAMPLE_STAY: Stay = {
  property: {
    id: "moonshine",
    name: "The Moonshine Cabin",
    area: "Sevierville, Tennessee",
    address: "",
    specs: "1 king bedroom + king loft · 2 baths · sleeps 4",
    lat: 35.812,
    lon: -83.552,
    photos: [
      { src: WP + "10/Moonshine-exterior-optimized-1-1024x683.webp", caption: "The cabin" },
      { src: WP + "09/The-Moonshine-Cabin-living-room-1024x683.jpg", caption: "Living room" },
      { src: WP + "09/The-Moonshine-Cabin-porch-1024x683.jpg", caption: "Wraparound porch" },
    ],
    checkInTime: "16:00",
    checkOutTime: "10:00",
    wifi: { network: "Moonshine-Guest", password: "smokies-2026" },
    parking: "Park in the paved spots beside the cabin. Mountain roads are steep, so set the parking brake.",
    codeNote: "Keypad on the front door. Press the lock logo, then the code.",
  },
  reservation: { guestName: "Maya", checkIn: null, checkOut: null, guests: 4, doorCode: "4827" },
};
