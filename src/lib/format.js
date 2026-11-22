import { config } from '../config'

export const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

/** Local Date from 'YYYY-MM-DD' + 'HH:MM'. */
export function toDate(date, time = '18:00') {
  const [y, m, d] = date.split('-')
  const [h, min] = time.split(':')
  return new Date(+y, m - 1, +d, +h, +min, 0)
}

/** Absolute Date for a wall-clock time in IST (UTC+5:30), regardless of the viewer's timezone. */
export function toISTDate(date, time = '18:00') {
  const [y, m, d] = date.split('-')
  const [h, min] = time.split(':')
  return new Date(Date.UTC(+y, m - 1, +d, +h, +min, 0) - 330 * 60000)
}

/** 'Sunday, 15 November 2026' */
export function longDate(date) {
  const t = toDate(date)
  return `${DAYS[t.getDay()]}, ${t.getDate()} ${MONTHS[t.getMonth()]} ${t.getFullYear()}`
}

/** '09:58' -> '9:58 AM', '18:00' -> '6 PM' */
export function time12(time) {
  const [hs, m] = time.split(':')
  let h = +hs
  const ampm = h >= 12 ? 'PM' : 'AM'
  h = h % 12 || 12
  return h + (m === '00' ? '' : ':' + m) + ' ' + ampm
}

/** '18:16','20:27' -> '6:16 PM – 8:27 PM'; end optional. */
export function timeRange(start, end) {
  return end ? `${time12(start)} – ${time12(end)}` : time12(start)
}

const strip = (s) => s.replace(/\s+/g, '')

export function hashtag(reversed) {
  const { coupleA, coupleB } = config
  return reversed
    ? `#${strip(coupleB.name)}Weds${strip(coupleA.name)}`
    : `#${strip(coupleA.name)}Weds${strip(coupleB.name)}`
}

/** [first, second] couple members, ordered by the URL. */
export function orderedCouple(reversed) {
  return reversed ? [config.coupleB, config.coupleA] : [config.coupleA, config.coupleB]
}
