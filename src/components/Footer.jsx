import { orderedCouple } from '../lib/format'

export default function Footer({ reversed }) {
  const [first, second] = orderedCouple(reversed)
  return (
    <footer className="foot">
      <div className="om">ॐ</div>
      <p className="bless">
        With the blessings of our elders
        <br />
        and the warmth of your presence.
      </p>
      <div className="sig">
        {first.name} &amp; {second.name}
      </div>
      <p className="made">Made with love</p>
    </footer>
  )
}
