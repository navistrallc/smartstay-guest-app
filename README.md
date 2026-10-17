# SmartStay Guest App (React)

A phone-first web app a guest opens during their stay at one SmartStay cabin: live sky header, slide-to-reveal door code, arrival note, house guide, local map with detail pages, and host messaging.

Built with React 18, TypeScript and Vite. No UI framework; styles are plain CSS in `src/styles.css`.

## Run it
```
npm install
npm run dev            # local dev server
npm run build          # static site in dist/ for any web host
npm run build:single   # everything inlined into one dist/index.html
```

## Where things live
- `src/data/types.ts`: the `Stay` shape (one cabin + one reservation). This is the contract with your data.
- `src/data/sample.ts`: the stay shown until real data is connected (real Moonshine Cabin listing, example guest details).
- `src/data/defaults.ts`: host contact, default checkout steps and house-guide notes (EXAMPLES to replace).
- `src/data/places.ts`: local Smokies spots with write-ups and tips.
- `src/lib/stay.ts`: loads the stay and derives what the screens need.
- `src/lib/assistant.ts`: the demo auto-reply. A real AI model or your inbox plugs in here.
- `src/tabs/`: the four screens. `src/components/`: header, tab bar, door-code card, sheets.

## Connecting your data
Each guest gets a link ending in `#<stay token>`. Build `VITE_STAY_URL=https://your-api/guest-stay/ npm run build`, and the app fetches `VITE_STAY_URL + token`, expecting JSON shaped like `Stay`. That endpoint (a small server function) reads the reservation from your property system, such as Guesty, and keeps your API keys off the phone. Without it, the app shows the sample stay.

## Devices
Checked on 10 phone and tablet sizes (iPhone SE to iPad Pro, Android phones and tablets, landscape) in Chromium. Uses features supported from iOS 15 and current Android browsers; test on real Safari before launch.
