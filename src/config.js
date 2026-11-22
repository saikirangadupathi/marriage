// ─────────────────────────────────────────────────────────────
//  ALL INVITATION CONTENT LIVES HERE — edit this file to customise.
// ─────────────────────────────────────────────────────────────
import haldiImg from './assets/haldi.jpg'
import mehndiImg from './assets/mehndi.jpg'
import weddingImg from './assets/wedding.jpg'
import haldiBg from './assets/haldi-bg.jpg'
import mehndiBg from './assets/mehndi-bg.jpg'
import weddingBg from './assets/wedding-bg.jpg'
import bgMusic from './assets/bg-music.mp3'

const MUHURTHAM = '18:16' // 24h, IST — Sumuhurtham start
const MUHURTHAM_END = '20:27' // optional end time; '' to show only the start

const WEDDING_VENUE_NAME = 'Sri Krishna Mandira Kalyana Mandapam'
const WEDDING_MAP_QUERY = 'Sri Krishna Mandira Kalyana Mandapam, Kondayapalem Gate, Nellore'

export const config = {
  // `slug` is the name used in the URL, e.g. /manoj/marriageinvitation
  coupleA: {
    name: 'Renuka Chowdary',
    slug: 'renuka',
    lineage: 'Only D/o Sri Oruganti Balakrishna & Smt. Sridevi',
  },
  coupleB: {
    name: 'Manoj Krishna',
    slug: 'manoj',
    lineage: 'S/o Sri Balu Lakshmi Narasimhulu & Smt. Balu Hymavathi (Late)',
  },
  rsvpBy: '4 December 2026',
  weddingDate: '2026-12-04', // YYYY-MM-DD
  muhurtham: MUHURTHAM,
  muhurthamEnd: MUHURTHAM_END,
  // Text before the first comma = line 1, after it = line 2 in the "Where" box.
  weddingVenue: `${WEDDING_VENUE_NAME}, Nellore`,
  weddingMapQuery: WEDDING_MAP_QUERY,
  weddingMapUrl: '', // optional exact Google Maps link; overrides weddingMapQuery
  familyWhatsApp: '910000000000',
  familyPhone: '+910000000000',
  heroImg: weddingBg,
  invocationVideo: `${import.meta.env.BASE_URL}media/ganesha-placeholder.mp4`,
  backgroundMusic: bgMusic, // src/assets/bg-music.mp3 — set to '' to disable; starts on the visitor's first tap
  musicVolume: 0.5, // 0–1
  invocationCropBottom: 0.06, // hides a strip at the bottom of the intro video (fraction of height)
}

// Every event. Which ones appear depends on the URL (see ROUTES).
export const events = [
  // NOTE: Mehndi & Haldi are not on the printed card — dates/venues below are placeholders.
  // They only appear on the /invitation and /marriage links. Update or remove them.
  {
    key: 'mehndi', name: 'Mehndi', sub: 'Where henna meets hearts',
    date: '2026-12-02', start: '17:30', dur: 4,
    venue: "Bride's Home, Nellore", dress: 'Pastel & floral',
    note: 'The deeper the mehndi, the deeper the love.',
    img: mehndiImg, bgImg: mehndiBg, cap: 'Mehndi · Where henna meets hearts',
    video: `${import.meta.env.BASE_URL}media/mehndi-placeholder.mp4`,
    videoCrop: { top: 0.27, bottom: 0.06, aspect: 1176 / 1764 },
  },
  {
    key: 'haldi', name: 'Haldi', sub: 'Pasupu & Mangala Snanam',
    date: '2026-12-03', start: '10:00', dur: 4,
    venue: "Groom's Home, Nellore", dress: '',
    note: 'Turmeric, laughter and the very first blessings.',
    img: haldiImg, bgImg: haldiBg, cap: 'Haldi · Pasupu & Mangala Snanam',
    video: `${import.meta.env.BASE_URL}media/haldi-placeholder.mp4`,
    videoCrop: { bottom: 0.06, aspect: 1088 / 1904 },
  },
  {
    key: 'wedding', name: 'The Wedding', sub: 'Sumuhurtham · Mithuna Lagnam',
    date: '2026-12-04', start: MUHURTHAM, end: MUHURTHAM_END, timeLabel: 'Sumuhurtham', dur: 3,
    venue: `${WEDDING_VENUE_NAME}, Kondayapalem Gate, Nellore`,
    note: 'The sacred vows — with your blessings.',
    img: weddingImg, bgImg: weddingBg, cap: 'The Wedding · 4 December 2026',
    mapUrl: 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(WEDDING_MAP_QUERY),
  },
  {
    key: 'dinner', name: 'Dinner', sub: 'Celebrate with us',
    date: '2026-12-04', start: '20:00', dur: 3,
    venue: `${WEDDING_VENUE_NAME}, Kondayapalem Gate, Nellore`, dress: '',
    note: 'Your gracious presence and blessings will make this joyous occasion even more memorable.',
    mapUrl: 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(WEDDING_MAP_QUERY),
  },
]

// URL routes: /<invite-type>  or  /<name>/<invite-type>
//   null  = show every event
//   array = show only those event keys
// <name> must be one of the couple's slugs; it decides whose name comes first.
export const ROUTES = {
  invitation: null,
  marriage: ['haldi', 'wedding', 'dinner'],
  marriageinvitation: ['wedding', 'dinner'],
}

// Interactive reveal games on event cards (opened via "Tap to view"). Events without an entry get no thumbnail.
//   mode 'wipe' : rub a layer off the photo (henna: true = brown henna, else turmeric)
//   heart: true : draws a heart outline; only the heart area counts toward `thresh`
//   mode 'tap'  : tap an instrument N times, e.g.
//                 { mode: 'tap', inst: 'dhol' | 'bell', need: 6, hint: 'Tap the dhol', burst: ['#F2B705', '#E0982A'] }
export const REVEALS = {
  haldi: { mode: 'wipe', henna: false, brush: 0.085, thresh: 0.5, hint: 'Rub off the turmeric', badge: 'rub to reveal', burst: ['#F2B705', '#E0982A'] },
  mehndi: { mode: 'wipe', henna: true, heart: true, brush: 0.05, thresh: 0.6, hint: 'Trace the heart with henna', badge: 'trace the heart', burst: ['#7a3b12', '#C9302C'] },
}

// Where the text block sits over each illustrated poster (percent of the image).
// Hero box = the cream panel of wedding-bg.jpg; text auto-shrinks to stay inside `height`.
export const HERO_OVERLAY_POS = { left: '46.5%', top: '18.5%', width: '38.5%', height: '62.5%' }
export const EVENT_OVERLAY_POS = {
  haldi: { left: '34.2%', top: '17%', width: '37.5%' },
  mehndi: { left: '13.2%', top: '14%', width: '73.7%' },
}
