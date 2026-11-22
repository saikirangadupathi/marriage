# Wedding Invitation

React + Vite. All content (names, dates, venues, events, links) is in **`src/config.js`**.

## Run

```bash
npm install
npm run dev            # http://localhost:5174/manoj/marriageinvitation
```

## Production

```bash
npm run build
npm start              # serves invitation routes on http://localhost:3000 (PORT env var supported)
```

On Render, deploy this folder as its own Node web service. If the Git repository contains the contents of `invitation` at its root, leave Render's Root Directory blank. If `invitation` is a subfolder in the repository, set Root Directory to `invitation`. In either case use build command `npm ci && npm run build` and start command `npm start`. Render supplies the port, and this app serves `/manoj/marriageinvitation` itself.

## URLs

`/<name>/<type>` or `/<type>`

| type                 | events shown                         |
| -------------------- | ------------------------------------ |
| `invitation`         | all                                  |
| `marriage`           | haldi, wedding, dinner               |
| `marriageinvitation` | wedding, dinner                      |

`<name>` is either partner's slug from config (`manoj` / `renuka`). It decides whose name is shown first.
Edit `ROUTES` in `src/config.js` to add more.

## Features

- Ganesha invocation intro video (Telugu + English), with tap to skip and a text-only fallback
- Temple-door gate with a monogram seal; the doors open with a petal burst, then a scroll cue
- Animated falling petals (canvas)
- Hero poster with the invitation text overlaid
- Names, "When / Where" cards, a Google Maps directions link, and a couple hashtag
- Festivities timeline that animates in on scroll
- Event cards in a lightbox: intro video, then a reveal game
  - Haldi: rub off the turmeric
  - Mehndi: trace the henna heart
  - Optional tap-the-dhol / ring-the-bell games with synthesised sounds (`mode: 'tap'` in `REVEALS`)
- Live countdown to the muhurtham, in IST
- Blessing footer, and a 404 page for wrong links
- Respects `prefers-reduced-motion`

## Media

- Images: `src/assets/`. Replace a file, keeping its name.
- Event videos: `public/media/`. Their paths are set in `src/config.js`.
- The opening Ganesha video is hosted on Cloudinary and configured in `src/config.js`.
