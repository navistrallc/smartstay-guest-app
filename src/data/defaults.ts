import type { GuideSection, Host, Property } from "./types";

export const HOST: Host = {
  name: "SmartStay",
  full: "SmartStay Vacation Rentals",
  email: "info@smartstayhospitality.com",
  responseTime: "usually replies within an hour",
};

/* Used when a cabin doesn't supply its own list. These are EXAMPLES to replace. */
export const DEFAULT_CHECKOUT_TASKS = [
  "Load and start the dishwasher",
  "Leave used towels in the bathtub",
  "Take trash to the bear-proof bin and latch the lid",
  "Turn off the hot tub jets and close the cover",
  "Set the thermostat to 68°F",
  "Lock the front door by pressing the keypad logo",
];

export function defaultGuide(p: Property): GuideSection[] {
  return [
    { title: "Wi-Fi & TV", icon: "wifi", tags: ["wifi", "internet", "tv", "netflix", "streaming", "roku"], items: [
      `Network ${p.wifi.network}, password ${p.wifi.password}. The router is in the living room if it needs a restart.`,
      "The TVs are smart TVs. Sign in with your own streaming accounts.",
      "Please sign out of your accounts before you leave."] },
    { title: "Hot tub", icon: "tub", tags: ["hot tub", "jacuzzi", "spa", "jets"], items: [
      "It's kept at about 102°F. The control panel is on the side under the cover.",
      "Shower before you get in and keep glass off the deck.",
      "Close and latch the cover when you're done so it stays warm and clean."] },
    { title: "Heat & fireplace", icon: "flame", tags: ["heat", "thermostat", "cold", "fireplace", "fire", "ac", "air"], items: [
      "The thermostat is in the main hallway. Please keep it between 66°F and 74°F.",
      "If your cabin has a gas fireplace, it turns on with the wall switch or remote beside it.",
      "No wood fires or candles indoors."] },
    { title: "Kitchen", icon: "cup", tags: ["kitchen", "coffee", "cook", "dishwasher", "grill", "oven"], items: [
      "The kitchen is fully stocked with cookware, dishes and a coffee maker.",
      "Dishwasher pods are under the sink.",
      "If there's a grill, turn the propane off when you finish."] },
    { title: "Trash & bears", icon: "bin", tags: ["trash", "garbage", "recycling", "bins", "bears", "bear"], items: [
      "This is black bear country. Use the bear-proof bin and latch it every time.",
      "Never leave food, coolers or trash bags on the porch or in the car."] },
    { title: "House rules", icon: "rules", tags: ["rules", "pets", "smoking", "party", "quiet", "guests"], items: [
      "Quiet hours are 10 PM to 8 AM.",
      "No smoking indoors or on the decks.",
      "No parties, and no more overnight guests than the booking allows.",
      "No pets unless approved with your booking."] },
    { title: "Emergencies", icon: "alert", wide: true, tags: ["emergency", "fire", "hospital", "doctor", "water", "power", "outage", "help"], items: [
      `Call 911 for any emergency and give the cabin name, ${p.name}, and your booking address.`,
      "Nearest ER: LeConte Medical Center, 742 Middle Creek Rd, Sevierville.",
      `For anything urgent at the cabin, message ${HOST.name} here or email ${HOST.email}.`] },
  ];
}
