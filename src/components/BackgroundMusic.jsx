import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'

const FADE_MS = 2500

/**
 * Looping background music with a floating mute/unmute button.
 * Browsers block audio until the visitor interacts, so playback starts on the first tap anywhere
 * (or when ref.play() is called from a click handler). Pauses while the tab is hidden.
 */
const BackgroundMusic = forwardRef(function BackgroundMusic({ src, volume = 0.5, showButton = true }, ref) {
  const audioRef = useRef(null)
  const [playing, setPlaying] = useState(false)
  const muted = useRef(false) // visitor turned it off
  const fadeRaf = useRef(0)

  function fadeTo(target, onDone) {
    const a = audioRef.current
    cancelAnimationFrame(fadeRaf.current)
    const from = a.volume
    const t0 = performance.now()
    const step = (now) => {
      const k = Math.min(1, (now - t0) / FADE_MS)
      a.volume = from + (target - from) * k
      if (k < 1) fadeRaf.current = requestAnimationFrame(step)
      else onDone?.()
    }
    fadeRaf.current = requestAnimationFrame(step)
  }

  function play() {
    const a = audioRef.current
    if (!a || muted.current || !a.paused) return
    a.volume = 0
    a.play()
      .then(() => {
        setPlaying(true)
        fadeTo(volume)
      })
      .catch(() => {
        /* still blocked — the next tap will retry */
      })
  }

  function pause() {
    const a = audioRef.current
    if (!a || a.paused) return
    setPlaying(false)
    fadeTo(0, () => a.pause())
  }

  useImperativeHandle(ref, () => ({ play }))

  // Start on an interaction anywhere on the page. play() is a no-op once playing or if muted,
  // so keeping the listener lets a blocked first attempt retry on the next tap.
  useEffect(() => {
    const onTap = () => play()
    document.addEventListener('pointerdown', onTap)
    document.addEventListener('keydown', onTap)
    return () => {
      document.removeEventListener('pointerdown', onTap)
      document.removeEventListener('keydown', onTap)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Pause in background tabs, resume when back.
  useEffect(() => {
    const onVis = () => {
      const a = audioRef.current
      if (!a) return
      if (document.hidden) a.pause()
      else if (playing && !muted.current) a.play().catch(() => {})
    }
    document.addEventListener('visibilitychange', onVis)
    return () => document.removeEventListener('visibilitychange', onVis)
  }, [playing])

  useEffect(() => () => cancelAnimationFrame(fadeRaf.current), [])

  function toggle(e) {
    e.stopPropagation()
    if (playing) {
      muted.current = true
      pause()
    } else {
      muted.current = false
      play()
    }
  }

  return (
    <>
      <audio ref={audioRef} src={src} loop preload="auto" />
      {showButton && (
        <button
          type="button"
          className={'music-btn' + (playing ? ' on' : '')}
          onClick={toggle}
          onPointerDown={(e) => e.stopPropagation()}
          aria-label={playing ? 'Mute music' : 'Play music'}
          aria-pressed={playing}
        >
          {playing ? (
            <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
              <path fill="currentColor" d="M3 9v6h4l5 5V4L7 9H3Zm13.5 3A4.5 4.5 0 0 0 14 8v8a4.5 4.5 0 0 0 2.5-4ZM14 3.2v2.1a7 7 0 0 1 0 13.4v2.1a9 9 0 0 0 0-17.6Z" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
              <path fill="currentColor" d="M3 9v6h4l5 5V4L7 9H3Zm13.6 3 2.7-2.7-1.4-1.4-2.7 2.7-2.7-2.7-1.4 1.4 2.7 2.7-2.7 2.7 1.4 1.4 2.7-2.7 2.7 2.7 1.4-1.4L16.6 12Z" />
            </svg>
          )}
        </button>
      )}
    </>
  )
})

export default BackgroundMusic
