import { useRef } from 'react'
import { config, HERO_OVERLAY_POS } from '../config'
import { longDate, orderedCouple, time12 } from '../lib/format'
import { useFitText } from '../lib/useFitText'

/** Invitation text printed inside the cream panel of the hero poster. Auto-shrinks to fit. */
export default function HeroOverlay({ reversed }) {
  const { weddingDate, muhurtham, muhurthamEnd, weddingVenue } = config
  const [first, second] = orderedCouple(reversed)
  const ref = useRef(null)
  useFitText(ref, [reversed])

  return (
    <div className="poster-overlay hero-overlay" style={HERO_OVERLAY_POS} ref={ref}>
      <p className="p-eyebrow">Together with their families,</p>
      <p className="p-eyebrow small">Request the honour of your presence</p>
      <div className="p-divider" />
      <h3 className="p-name">{first.name}</h3>
      <p className="p-lineage">{first.lineage}</p>
      <p className="p-amp">&amp;</p>
      <h3 className="p-name">{second.name}</h3>
      <p className="p-lineage">{second.lineage}</p>
      <p className="p-meta p-gap">at their wedding celebration</p>
      <p className="p-meta">
        <b>
          Muhurtham{' '}
          <span className="nowrap">
            {time12(muhurtham)}
            {muhurthamEnd ? ` – ${time12(muhurthamEnd)}` : ''}
          </span>
        </b>
      </p>
      <p className="p-meta">{longDate(weddingDate)}</p>
      <p className="p-meta">Venue: {weddingVenue}</p>
    </div>
  )
}
