import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react'

// Petal colour pairs (gradient top → bottom): cream, gold, rose.
const PALETTES = [
  ['#FFF6E4', '#EAD7AE'],
  ['#E9CF94', '#B98E3E'],
  ['#E7B9B0', '#B86A62'],
]

/**
 * Full-screen canvas of slowly falling petals.
 * Exposes ref.burst(count = 46, [c1, c2]?) to drop a shower of extra petals.
 */
const Petals = forwardRef(function Petals(_props, ref) {
  const canvasRef = useRef(null)
  const burstRef = useRef(() => {})

  useImperativeHandle(ref, () => ({ burst: (n, colors) => burstRef.current(n, colors) }))

  useEffect(() => {
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion:reduce)').matches) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    let W, H

    function resize() {
      W = canvas.width = Math.floor(innerWidth * dpr)
      H = canvas.height = Math.floor(innerHeight * dpr)
      canvas.style.width = innerWidth + 'px'
      canvas.style.height = innerHeight + 'px'
    }
    resize()
    addEventListener('resize', resize)

    function makePetal(isBurst, colors) {
      const pal = colors || PALETTES[(Math.random() * PALETTES.length) | 0]
      return {
        x: isBurst ? W * (0.28 + Math.random() * 0.44) : Math.random() * W,
        y: isBurst ? -20 * dpr : Math.random() * H,
        s: (6 + Math.random() * 7) * dpr,
        vy: (0.22 + Math.random() * 0.3) * dpr * (isBurst ? 1.6 : 1),
        sway: (14 + Math.random() * 24) * dpr,
        ph: Math.random() * 6.28,
        vph: 0.008 + Math.random() * 0.014,
        rot: Math.random() * 6.28,
        vrot: (Math.random() - 0.5) * 0.02,
        c1: pal[0],
        c2: pal[1],
        op: 0.35 + Math.random() * 0.3,
        burst: !!isBurst,
      }
    }

    function draw(p) {
      ctx.save()
      ctx.translate(p.x + Math.sin(p.ph) * p.sway, p.y)
      ctx.rotate(p.rot)
      ctx.globalAlpha = p.op
      const g = ctx.createLinearGradient(0, -p.s, 0, p.s)
      g.addColorStop(0, p.c1)
      g.addColorStop(1, p.c2)
      ctx.fillStyle = g
      ctx.beginPath()
      ctx.moveTo(0, -p.s)
      ctx.quadraticCurveTo(p.s * 0.82, -p.s * 0.2, 0, p.s)
      ctx.quadraticCurveTo(-p.s * 0.82, -p.s * 0.2, 0, -p.s)
      ctx.fill()
      ctx.restore()
    }

    const petals = []
    const ambient = innerWidth < 520 ? 5 : 8
    for (let i = 0; i < ambient; i++) petals.push(makePetal(false))

    let raf
    function tick() {
      ctx.clearRect(0, 0, W, H)
      for (let i = petals.length - 1; i >= 0; i--) {
        const p = petals[i]
        p.y += p.vy
        p.ph += p.vph
        p.rot += p.vrot
        draw(p)
        if (p.y > H + 30 * dpr) {
          if (p.burst) petals.splice(i, 1) // burst petals fall once
          else {
            p.y = -p.s * 2 // ambient petals recycle to the top
            p.x = Math.random() * W
            p.ph = Math.random() * 6.28
          }
        }
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)

    function onVisibility() {
      if (document.hidden) cancelAnimationFrame(raf)
      else raf = requestAnimationFrame(tick)
    }
    document.addEventListener('visibilitychange', onVisibility)

    burstRef.current = (n = 46, colors) => {
      for (let i = 0; i < n; i++) petals.push(makePetal(true, colors))
    }

    return () => {
      cancelAnimationFrame(raf)
      removeEventListener('resize', resize)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [])

  return <canvas id="petals" ref={canvasRef} aria-hidden="true" />
})

export default Petals
