import { longDate, time12, timeRange } from '../lib/format'
import Reveal from './Reveal'

const NUMBER_WORDS = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven']

function daysLabel(schedule) {
  const days = new Set(schedule.map((e) => e.date)).size
  return days <= 1 ? 'The auspicious day' : (NUMBER_WORDS[days] || days) + ' days of celebration'
}

/** Timeline of events. Events with a reveal game get a "Tap to view" thumbnail. */
export default function Schedule({ schedule, reveal, onOpenReveal }) {
  return (
    <section className="sched">
      <Reveal as="div" className="sec-head">
        <p className="eyebrow">{daysLabel(schedule)}</p>
        <h2>{schedule.length > 1 ? 'The Festivities' : 'The Celebration'}</h2>
      </Reveal>

      <div className="timeline">
        {schedule.map((ev) => (
          <Reveal as="div" className="ev" key={ev.key}>
            <div className="body">
              <div className="when">{longDate(ev.date)}</div>
              <h3>{ev.name}</h3>
              <div className="sub">{ev.sub}</div>
              <div className="meta">
                {ev.timeLabel ? (
                  <>
                    <b>
                      {ev.timeLabel} {timeRange(ev.start, ev.end)}
                    </b>
                    {' · '}
                    {ev.venue}
                  </>
                ) : (
                  <>
                    <b>{time12(ev.start)}</b> onwards · {ev.venue}
                  </>
                )}
                {ev.dress ? <br /> : null}
                {ev.dress ? 'Dress code: ' + ev.dress : null}
              </div>
              {ev.note ? <div className="note">“{ev.note}”</div> : null}
              {ev.mapUrl && (
                <a
                  className="directions"
                  href={ev.mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Get directions to ${ev.venue} in Google Maps`}
                >
                  Get directions
                </a>
              )}
            </div>

            {reveal[ev.key] && (
              <button
                className="thumb"
                type="button"
                aria-label={`Open the ${ev.name} card`}
                onClick={() => onOpenReveal(ev)}
              >
                <span className="frame">
                  <img loading="lazy" alt={ev.cap} src={ev.img} />
                  <span className="badge">
                    Tap to view <b aria-hidden="true">›</b>
                  </span>
                </span>
              </button>
            )}
          </Reveal>
        ))}
      </div>
    </section>
  )
}
