import { useEffect, useState } from 'react'
import { toISTDate } from '../lib/format'

/** Live countdown to the muhurtham (computed in IST). */
export default function Countdown({ weddingDate, muhurtham }) {
  const target = toISTDate(weddingDate, muhurtham).getTime()
  const [left, setLeft] = useState(() => target - Date.now())

  useEffect(() => {
    const id = setInterval(() => setLeft(target - Date.now()), 1000)
    return () => clearInterval(id)
  }, [target])

  const pad = (n) => ('0' + n).slice(-2)

  return (
    <section className="count">
      <p className="eyebrow">Counting down to the muhurtham</p>
      {left < 0 ? (
        <p style={{ fontFamily: 'var(--display)', fontStyle: 'italic', fontSize: 22, color: '#fff' }}>
          The day is here — celebrate with us!
        </p>
      ) : (
        <div className="cd">
          <Unit value={Math.floor(left / 864e5)} label="Days" />
          <Unit value={pad(Math.floor((left % 864e5) / 36e5))} label="Hours" />
          <Unit value={pad(Math.floor((left % 36e5) / 6e4))} label="Mins" />
          <Unit value={pad(Math.floor((left % 6e4) / 1e3))} label="Secs" />
        </div>
      )}
    </section>
  )
}

function Unit({ value, label }) {
  return (
    <div className="u">
      <div className="num">{value}</div>
      <div className="lab">{label}</div>
    </div>
  )
}
