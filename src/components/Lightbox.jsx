import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'
import dholImg from '../assets/dhol.png'
import { BELL_SVG } from '../lib/bellSvg'
import { playBell, playDhol } from '../lib/sounds'
import EventPoster from './EventPoster'

// Heart outline (32 × 29.6 units) for the mehndi "trace the heart" reveal.
const HEART_PATH =
  'M23.6,0c-3.4,0-6.3,2.7-7.6,5.6C14.7,2.7,11.8,0,8.4,0C3.8,0,0,3.8,0,8.4c0,9.4,9.5,11.9,16,21.2c6.1-9.3,16-12.1,16-21.2C32,3.8,28.2,0,23.6,0z'

/** CSS vars that crop the top/bottom of an event video. */
function cropStyle(crop) {
  if (!crop) return undefined
  const top = crop.top || 0
  const bottom = crop.bottom || 0
  return {
    '--crop-aspect': crop.aspect / (1 - top - bottom),
    '--crop-shift': (-top / crop.aspect) * 100 + '%',
  }
}

/**
 * Full-screen event card. Opened via ref.open(event) where event.__reveal is the REVEALS entry.
 * Sequence: optional intro video → reveal game (wipe canvas or tap instrument) → poster + petal burst.
 */
const Lightbox = forwardRef(function Lightbox({ petalsRef }, ref) {
  const [isOpen, setIsOpen] = useState(false)
  const [ev, setEv] = useState(null)
  const [imgSrc, setImgSrc] = useState('')
  const [caption, setCaption] = useState('')
  const [hint, setHint] = useState('')
  const [canvasOn, setCanvasOn] = useState(false)
  const [tap, setTap] = useState(null) // { inst, need } while a tap game is active
  const [tapCount, setTapCount] = useState(0)
  const [film, setFilm] = useState(null) // null | 'playing' | 'fading'

  const filmTimer = useRef(null)
  const rootRef = useRef(null)
  const imgRef = useRef(null)
  const canvasRef = useRef(null)
  const ctxRef = useRef(null)
  const tapWrapRef = useRef(null)
  const instRef = useRef(null)
  const session = useRef({ done: true }) // { ev, cfg, done, finished }
  const wipeArmed = useRef(false)
  const wipeCfg = useRef(null)
  const drawing = useRef(false)
  const heartPath = useRef(null)
  const heartPixels = useRef(0)
  const tapCfg = useRef(null)
  const taps = useRef(0)
  const startRevealRef = useRef(null)

  const burst = (n, colors) => petalsRef.current?.burst(n, colors)

  // ── open / close ───────────────────────────────────────────
  function open(event) {
    const cfg = event.__reveal || null
    session.current = { ev: event, cfg, done: !cfg }
    wipeArmed.current = false
    setCanvasOn(false)
    setTap(null)
    setTapCount(0)
    setHint(cfg?.hint || '')
    clearTimeout(filmTimer.current)

    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    if (event.video && !reduced) {
      setFilm('playing')
      // If the video hasn't started in 3s, drop it.
      filmTimer.current = setTimeout(() => {
        const v = rootRef.current?.querySelector('.lb-film')
        if (!v || v.paused || v.readyState < 2) endFilm()
      }, 3000)
    } else {
      setFilm(null)
    }

    setCaption(event.cap || '')
    setEv(event)
    setIsOpen(true)

    // Start the reveal once the image has a size (onLoad) — or after 60ms if already cached.
    let started = false
    const start = () => {
      if (started || !cfg) return
      started = true
      startReveal(cfg)
    }
    startRevealRef.current = start
    setImgSrc(event.bgImg || event.img)
    setTimeout(start, 60)
  }

  function close() {
    setIsOpen(false)
    wipeArmed.current = false
    session.current = { done: true }
    setImgSrc('')
    setEv(null)
    setCanvasOn(false)
    setTap(null)
    clearTimeout(filmTimer.current)
    setFilm(null)
  }

  function endFilm() {
    clearTimeout(filmTimer.current)
    setFilm((f) => f && 'fading')
    filmTimer.current = setTimeout(() => setFilm(null), 900)
  }

  function startReveal(cfg) {
    if (cfg.mode === 'tap') startTap(cfg)
    else startWipe(cfg)
  }

  // ── wipe (turmeric / henna) ────────────────────────────────
  function startWipe(cfg) {
    const img = imgRef.current
    const canvas = canvasRef.current
    const w = img.clientWidth
    const h = img.clientHeight
    if (!w) {
      setTimeout(() => startWipe(cfg), 40)
      return
    }
    canvas.width = w
    canvas.height = h
    setCanvasOn(true)

    const ctx = canvas.getContext('2d')
    ctxRef.current = ctx
    ctx.globalCompositeOperation = 'source-over'
    heartPath.current = null
    heartPixels.current = 0

    if (cfg.heart) {
      // Parchment cover with a dashed henna heart to trace.
      const g = ctx.createLinearGradient(0, 0, 0, h)
      g.addColorStop(0, '#efe4c8')
      g.addColorStop(1, '#e3d2ab')
      ctx.fillStyle = g
      ctx.fillRect(0, 0, w, h)

      const base = new Path2D(HEART_PATH)
      const scale = Math.min((w * 0.6) / 32, (h * 0.6) / 29.6)
      const ox = (w - 32 * scale) / 2
      const oy = (h - 29.6 * scale) / 2
      const heart = new Path2D()
      heart.addPath(base, new DOMMatrix([scale, 0, 0, scale, ox, oy]))
      heartPath.current = heart

      ctx.save()
      ctx.fillStyle = 'rgba(120,60,30,.16)'
      ctx.fill(heart)
      ctx.strokeStyle = '#7a3b12'
      ctx.lineWidth = Math.max(2, w * 0.006)
      ctx.setLineDash([9, 7])
      ctx.stroke(heart)
      ctx.restore()

      // Count sampled pixels inside the heart, so progress = erased-inside-heart / heart area.
      try {
        const off = document.createElement('canvas')
        off.width = w
        off.height = h
        const octx = off.getContext('2d')
        octx.fillStyle = '#000'
        octx.fill(heart)
        const data = octx.getImageData(0, 0, w, h).data
        let n = 0
        for (let i = 3; i < data.length; i += 32) if (data[i] > 0) n++
        heartPixels.current = n
      } catch {
        heartPixels.current = 0
      }
      ctx.save()
      ctx.clip(heart) // erasing only affects the heart
    } else {
      // Solid turmeric (or henna) paste with grainy speckles.
      const g = ctx.createLinearGradient(0, 0, w, h)
      if (cfg.henna) {
        g.addColorStop(0, '#6b4a22')
        g.addColorStop(0.5, '#553617')
        g.addColorStop(1, '#42280f')
      } else {
        g.addColorStop(0, '#e7b53f')
        g.addColorStop(0.5, '#d99b22')
        g.addColorStop(1, '#c98415')
      }
      ctx.fillStyle = g
      ctx.fillRect(0, 0, w, h)
      for (let i = 0; i < (w * h) / 500; i++) {
        ctx.fillStyle = `rgba(${120 + ((Math.random() * 80) | 0)},${80 + ((Math.random() * 50) | 0)},20,${Math.random() * 0.3})`
        ctx.fillRect(Math.random() * w, Math.random() * h, 2, 2)
      }
    }
    wipeCfg.current = cfg
    wipeArmed.current = true
  }

  function canvasPoint(e) {
    const c = canvasRef.current
    const r = c.getBoundingClientRect()
    return { x: (e.clientX - r.left) * (c.width / r.width), y: (e.clientY - r.top) * (c.height / r.height) }
  }

  function erase(e) {
    if (!wipeArmed.current || !drawing.current || session.current.done) return
    const ctx = ctxRef.current
    const c = canvasRef.current
    const p = canvasPoint(e)
    ctx.globalCompositeOperation = 'destination-out'
    ctx.beginPath()
    ctx.arc(p.x, p.y, Math.max(12, c.width * (wipeCfg.current.brush || 0.07)), 0, 7)
    ctx.fill()
    e.preventDefault()
  }

  function checkProgress() {
    if (session.current.done || !wipeArmed.current) return
    const c = canvasRef.current
    const data = ctxRef.current.getImageData(0, 0, c.width, c.height).data
    let cleared = 0
    let total = 0
    for (let i = 3; i < data.length; i += 32) {
      total++
      if (data[i] === 0) cleared++
    }
    const cfg = wipeCfg.current
    const ratio = cfg.heart && heartPixels.current ? cleared / heartPixels.current : cleared / total
    if (ratio > (cfg.thresh || 0.5)) finish()
  }

  // ── tap (dhol / bell) ──────────────────────────────────────
  function startTap(cfg) {
    tapCfg.current = cfg
    taps.current = 0
    setTapCount(0)
    setTap({ inst: cfg.inst, need: cfg.need })
  }

  function onInstrumentTap() {
    if (session.current.done) return
    const cfg = tapCfg.current
    const el = instRef.current
    const cls = cfg.inst === 'dhol' ? 'hit' : 'ring'
    el.classList.remove(cls)
    void el.offsetWidth // restart the CSS animation
    el.classList.add(cls)
    if (cfg.inst === 'dhol') playDhol()
    else playBell()
    taps.current++
    setTapCount(taps.current)
    burst(2, cfg.burst)
    if (taps.current >= cfg.need) setTimeout(finish, 280)
  }

  // ── completion ─────────────────────────────────────────────
  function finish() {
    const s = session.current
    if ((s.done && !wipeArmed.current && taps.current === 0) || s.finished) return
    s.finished = true
    s.done = true

    const c = canvasRef.current
    const t = tapWrapRef.current
    if (c) {
      c.style.transition = 'opacity .6s ease'
      c.style.opacity = '0'
    }
    if (t) {
      t.style.transition = 'opacity .6s ease'
      t.style.opacity = '0'
    }
    setTimeout(() => {
      setCanvasOn(false)
      setTap(null)
      if (c) {
        c.style.opacity = ''
        c.style.transition = ''
      }
      if (t) {
        t.style.opacity = ''
        t.style.transition = ''
      }
    }, 640)
    setHint('')
    wipeArmed.current = false
    burst(12)
  }

  useImperativeHandle(ref, () => ({ open }))

  // Pointer handling for the wipe canvas (native listeners so preventDefault works on touch).
  useEffect(() => {
    const c = canvasRef.current
    if (!c) return
    const down = (e) => {
      if (!wipeArmed.current) return
      drawing.current = true
      try {
        c.setPointerCapture(e.pointerId)
      } catch {
        /* ignore */
      }
      erase(e)
    }
    const move = (e) => erase(e)
    const up = () => {
      if (!drawing.current) return
      drawing.current = false
      checkProgress()
    }
    c.addEventListener('pointerdown', down)
    c.addEventListener('pointermove', move)
    c.addEventListener('pointerup', up)
    c.addEventListener('pointercancel', up)
    return () => {
      c.removeEventListener('pointerdown', down)
      c.removeEventListener('pointermove', move)
      c.removeEventListener('pointerup', up)
      c.removeEventListener('pointercancel', up)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Escape closes.
  useEffect(() => {
    if (!isOpen) return
    const onKey = (e) => {
      if (e.key === 'Escape') close()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen])

  const isDhol = tap?.inst === 'dhol'

  return (
    <div
      className={'lightbox' + (isOpen ? ' open' : '')}
      aria-hidden={!isOpen}
      ref={rootRef}
      onClick={(e) => {
        if (e.target === e.currentTarget) close()
      }}
    >
      <button className="lb-close" type="button" aria-label="Close" onClick={close}>
        ×
      </button>

      <div className="lb-stage">
        {imgSrc && <img ref={imgRef} src={imgSrc} alt={caption} onLoad={() => startRevealRef.current?.()} />}
        {ev && <EventPoster ev={ev} />}

        <canvas id="lbCanvas" ref={canvasRef} className={canvasOn ? 'on' : ''} />

        <div className={'lb-tap' + (tap ? ' on ' + tap.inst : '')} ref={tapWrapRef}>
          {tap && (
            <>
              <button
                ref={instRef}
                className={'lb-inst' + (isDhol ? ' photo' : '')}
                type="button"
                aria-label={isDhol ? 'Tap the dhol' : 'Ring the bell'}
                onClick={onInstrumentTap}
              >
                {isDhol ? (
                  <img className="dholimg" src={dholImg} alt="" draggable="false" />
                ) : (
                  <span dangerouslySetInnerHTML={{ __html: BELL_SVG }} />
                )}
              </button>
              <div className="lb-itxt">{isDhol ? 'Tap the dhol' : 'Ring the bell'}</div>
              <div className="lb-dots">
                {Array.from({ length: tap.need }).map((_, i) => (
                  <i key={i} className={i < tapCount ? 'on' : ''} />
                ))}
              </div>
            </>
          )}
        </div>

        {film && ev?.video && (
          <div className={'lb-film-wrap' + (film === 'fading' ? ' fading' : '')}>
            <div className="lb-film-crop" style={cropStyle(ev.videoCrop)}>
              <video
                className="lb-film"
                src={ev.video}
                muted
                autoPlay
                playsInline
                preload="auto"
                onEnded={() => {
                  clearTimeout(filmTimer.current)
                  filmTimer.current = setTimeout(endFilm, 500)
                }}
                onError={endFilm}
              />
            </div>
            <button className="lb-skip" type="button" onClick={endFilm}>
              Skip
            </button>
          </div>
        )}

        {(canvasOn || tap) && (
          <button className="lb-skip" type="button" onClick={() => finish()}>
            Skip
          </button>
        )}

        <div className="lb-hint">{hint}</div>
      </div>
    </div>
  )
})

export default Lightbox
