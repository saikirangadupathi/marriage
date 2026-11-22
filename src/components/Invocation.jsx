import { useEffect, useRef, useState } from 'react'

const SKIP_TO = 2.4 // seconds: skip the video's lead-in
const AFTER_END_MS = 700 // pause after the video ends
const LEAVE_MS = 1200 // fade-out duration (matches .invocation.leaving)
const TEXT_ONLY_MS = 2600 // how long the text shows if the video can't play

/**
 * Opening screen: Ganesha video with "॥ శ్రీ గణేశాయ నమః ॥".
 * Tap anywhere / Skip to continue. Falls back to text only if the video fails or autoplay is blocked.
 */
export default function Invocation({ src, cropBottom = 0, onDone }) {
  const videoRef = useRef(null)
  const [phase, setPhase] = useState('showing')
  const [showVideo, setShowVideo] = useState(true)
  const finishing = useRef(false)
  const timers = useRef([])

  function later(fn, ms) {
    timers.current.push(setTimeout(fn, ms))
  }

  function finish(delay = 0) {
    if (finishing.current) return
    finishing.current = true
    later(() => {
      setPhase('leaving')
      later(() => onDone?.(), LEAVE_MS)
    }, delay)
  }

  useEffect(() => {
    const list = timers.current
    const cleanup = () => {
      list.forEach(clearTimeout)
      list.length = 0
      finishing.current = false
    }

    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
      setShowVideo(false)
      finish(1600)
      return cleanup
    }

    // If the video hasn't started within 3s (autoplay blocked / slow), show text only.
    later(() => {
      const v = videoRef.current
      if (finishing.current || v?.ended) return
      if (!v || v.paused || v.readyState < 2) {
        setShowVideo(false)
        finish(TEXT_ONLY_MS)
      }
    }, 3000)
    return cleanup
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function onLoadedMetadata(e) {
    const v = e.currentTarget
    if (v.duration > 3.4) v.currentTime = SKIP_TO
  }

  return (
    <div
      className={'invocation' + (phase === 'leaving' ? ' leaving' : '') + (showVideo ? '' : ' text-only')}
      onClick={() => finish(0)}
      role="presentation"
    >
      {showVideo && (
        <div className="inv-frame" style={cropBottom ? { '--inv-crop': cropBottom } : undefined}>
          <video
            ref={videoRef}
            src={src}
            muted
            autoPlay
            playsInline
            preload="auto"
            onLoadedMetadata={onLoadedMetadata}
            onEnded={() => finish(AFTER_END_MS)}
            onError={() => {
              setShowVideo(false)
              finish(TEXT_ONLY_MS)
            }}
          />
        </div>
      )}
      <div className="inv-text">
        <p className="inv-te" lang="te">
          ॥ శ్రీ గణేశాయ నమః ॥
        </p>
        <p className="inv-en">Sri Ganeshaya Namah</p>
      </div>
      <button
        type="button"
        className="inv-skip"
        onClick={(e) => {
          e.stopPropagation()
          finish(0)
        }}
      >
        Skip
      </button>
    </div>
  )
}
