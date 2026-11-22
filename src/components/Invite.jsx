import { config } from '../config'
import { hashtag, MONTHS, orderedCouple, timeRange, toDate } from '../lib/format'
import Reveal from './Reveal'

/** "You are warmly invited" — names, When / Where cards, directions and hashtag. */
export default function Invite({ reversed }) {
  const { weddingDate, weddingVenue, muhurtham, muhurthamEnd, weddingMapUrl, weddingMapQuery } = config
  const [first, second] = orderedCouple(reversed)
  const date = toDate(weddingDate)
  const venueParts = weddingVenue.split(',')
  const mapHref =
    weddingMapUrl ||
    'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(weddingMapQuery || weddingVenue)

  return (
    <section className="invite">
      <Reveal as="p" className="pre eyebrow">
        You are warmly invited
      </Reveal>

      <Reveal className="names">
        <span className="n" id="nameA">{first.name}</span>
        <span className="person-lineage">{first.lineage}</span>
        <span className="amp">&amp;</span>
        <span className="n" id="nameB">{second.name}</span>
        <span className="person-lineage">{second.lineage}</span>
      </Reveal>

      <Reveal className="keyfacts">
        <div className="kf">
          <div className="t">When</div>
          <div className="v">
            {date.getDate()} {MONTHS[date.getMonth()]}
            <br />
            {date.getFullYear()}
          </div>
          {muhurtham && (
            <div className="muh">
              Muhurtham
              <br />
              {timeRange(muhurtham, muhurthamEnd)} IST
            </div>
          )}
        </div>

        <div className="kf">
          <div className="t">Where</div>
          <div className="v">
            {venueParts[0]}
            {venueParts[1] ? (
              <>
                <br />
                {venueParts[1].trim()}
              </>
            ) : null}
          </div>
          <a
            className="map-btn"
            href={mapHref}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Get directions to ${weddingVenue} in Google Maps`}
          >
            <svg viewBox="0 0 24 24" width="15" height="15" aria-hidden="true">
              <path
                fill="currentColor"
                d="M12 2a7 7 0 0 0-7 7c0 5.2 7 13 7 13s7-7.8 7-13a7 7 0 0 0-7-7Zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5Z"
              />
            </svg>
            Get directions
          </a>
        </div>
      </Reveal>

      <Reveal>
        <span className="tag">{hashtag(reversed)}</span>
      </Reveal>
    </section>
  )
}
