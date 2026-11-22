import { useEffect, useRef, useState } from 'react'
import { config, REVEALS } from './config'
import { orderedCouple } from './lib/format'
import BackgroundMusic from './components/BackgroundMusic'
import Countdown from './components/Countdown'
import Divider from './components/Divider'
import Footer from './components/Footer'
import Gate from './components/Gate'
import Invite from './components/Invite'
import Invocation from './components/Invocation'
import Lightbox from './components/Lightbox'
import Petals from './components/Petals'
import Schedule from './components/Schedule'

/**
 * Flow: Ganesha invocation → closed gate (page scroll locked) → doors open + petal burst
 *       → invitation, festivities timeline, countdown, footer.
 */
export default function App({ schedule, reversed }) {
  const petalsRef = useRef(null)
  const lightboxRef = useRef(null)
  const musicRef = useRef(null)
  const [gate, setGate] = useState('closed') // closed | opening | open
  const [invocationDone, setInvocationDone] = useState(false)

  const [first, second] = orderedCouple(reversed)
  const monogram = `${first.name.charAt(0)} & ${second.name.charAt(0)}`
  const heroAlt = `Illustrated wedding invitation of ${first.name} and ${second.name}, framed by banana leaves, marigolds and a sacred kalash`

  // Always start at the top.
  useEffect(() => {
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual'
    window.scrollTo(0, 0)
  }, [])

  // Lock page scroll until the doors have fully opened.
  useEffect(() => {
    const root = document.documentElement
    root.classList.toggle('locked', gate !== 'open')
    return () => root.classList.remove('locked')
  }, [gate])

  function openReveal(ev) {
    lightboxRef.current?.open({ ...ev, __reveal: REVEALS[ev.key] })
  }

  function onGateOpen() {
    setGate('opening')
    petalsRef.current?.burst(14)
    musicRef.current?.play()
  }

  return (
    <>
      <Petals ref={petalsRef} />

      <div className="wrap">
        <Gate
          heroImg={config.heroImg}
          heroAlt={heroAlt}
          monogram={monogram}
          onOpen={onGateOpen}
          onOpened={() => setGate('open')}
          reversed={reversed}
        />

        {gate !== 'closed' && (
          <>
            <Invite reversed={reversed} />
            <Divider />
            <Schedule schedule={schedule} reveal={REVEALS} onOpenReveal={openReveal} />
            <Countdown weddingDate={config.weddingDate} muhurtham={config.muhurtham} />
            <Footer reversed={reversed} />
          </>
        )}
      </div>

      <Lightbox ref={lightboxRef} petalsRef={petalsRef} />

      {config.backgroundMusic && (
        <BackgroundMusic
          ref={musicRef}
          src={config.backgroundMusic}
          volume={config.musicVolume}
          showButton={invocationDone}
        />
      )}

      {!invocationDone && (
        <Invocation
          src={config.invocationVideo}
          cropBottom={config.invocationCropBottom}
          onDone={() => setInvocationDone(true)}
        />
      )}
    </>
  )
}
