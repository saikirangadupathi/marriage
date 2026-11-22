import { EVENT_OVERLAY_POS } from '../config'
import { longDate, time12 } from '../lib/format'

/** Event details printed over the event's poster inside the lightbox. */
export default function EventPoster({ ev }) {
  const pos = EVENT_OVERLAY_POS[ev.key]
  if (!pos) return null
  return (
    <div className="poster-overlay" style={pos}>
      <p className="p-eyebrow">Join us to celebrate our,</p>
      <h3 className="p-title">{ev.name}</h3>
      <p className="p-subtitle">{ev.sub}</p>
      <div className="p-divider" />
      <p className="p-meta">
        <b>{time12(ev.start)}</b> onwards
      </p>
      <p className="p-meta">{longDate(ev.date)}</p>
      <p className="p-meta">Venue: {ev.venue}</p>
      {ev.dress && <p className="p-meta">Dress code: {ev.dress}</p>}
    </div>
  )
}
