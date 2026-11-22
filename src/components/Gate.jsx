import { useEffect, useRef, useState } from 'react'
import HeroOverlay from './HeroOverlay'

const DOOR_OPEN_MS = 2900 // must match the door animation in styles.css

/**
 * Hero poster hidden behind two temple doors with a wax-seal medallion.
 * Tapping opens the doors, then shows a "Scroll" cue.
 */
export default function Gate({ heroImg, heroAlt, monogram, onOpen, onOpened, reversed }) {
  const [opening, setOpening] = useState(false)
  const [opened, setOpened] = useState(false)
  const timer = useRef(null)

  function open() {
    if (opening) return
    setOpening(true)
    onOpen?.()
    timer.current = setTimeout(() => {
      setOpened(true)
      onOpened?.()
    }, DOOR_OPEN_MS)
  }

  useEffect(() => () => clearTimeout(timer.current), [])

  function scrollToInvite() {
    document.querySelector('.invite')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className={'gate-stage' + (opening ? ' is-open' : '')} style={{ '--hero': `url(${heroImg})` }}>
      <div className="hero-card">
        <img id="baseImg" src={heroImg} alt={heroAlt} />
        <HeroOverlay reversed={reversed} />
      </div>

      {!opened && (
        <div className={'gate' + (opening ? ' open' : '')} onClick={open}>
          <div className="door l">
            <span className="knocker" />
          </div>
          <div className="door r">
            <span className="knocker" />
          </div>
          <div className="gate-light" aria-hidden="true" />
          <button
            className="seal"
            type="button"
            aria-label="Open the invitation"
            onClick={(e) => {
              e.stopPropagation()
              open()
            }}
          >
            <span className="seal-pre">The Wedding Invitation</span>
            <span className="medallion">
              <span id="monogram">{monogram}</span>
            </span>
            <span className="lbl">Tap to open</span>
          </button>
        </div>
      )}

      <button
        type="button"
        className={'scroll-cue' + (opened ? ' show' : '')}
        onClick={scrollToInvite}
        tabIndex={opened ? 0 : -1}
      >
        <span>Scroll</span>
        <i aria-hidden="true" />
      </button>
    </div>
  )
}
