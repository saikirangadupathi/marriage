// Synthesised sounds (Web Audio) for the tap-to-reveal instruments. No audio files needed.
let ctx

function audio() {
  if (ctx === undefined) {
    try {
      ctx = new (window.AudioContext || window.webkitAudioContext)()
    } catch {
      ctx = null
    }
  }
  return ctx
}

export function playDhol() {
  const a = audio()
  if (!a) return
  if (a.state === 'suspended') a.resume()
  const t = a.currentTime

  // Low pitched thump
  const osc = a.createOscillator()
  const g = a.createGain()
  osc.type = 'sine'
  osc.frequency.setValueAtTime(190, t)
  osc.frequency.exponentialRampToValueAtTime(72, t + 0.18)
  g.gain.setValueAtTime(1e-4, t)
  g.gain.exponentialRampToValueAtTime(0.5, t + 0.005)
  g.gain.exponentialRampToValueAtTime(1e-4, t + 0.26)
  osc.connect(g).connect(a.destination)
  osc.start(t)
  osc.stop(t + 0.3)

  // Slap noise burst
  const len = a.sampleRate * 0.08
  const buf = a.createBuffer(1, len, a.sampleRate)
  const data = buf.getChannelData(0)
  for (let i = 0; i < len; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / len) ** 2.2
  const src = a.createBufferSource()
  src.buffer = buf
  const bp = a.createBiquadFilter()
  bp.type = 'bandpass'
  bp.frequency.value = 1700
  const ng = a.createGain()
  ng.gain.value = 0.28
  src.connect(bp).connect(ng).connect(a.destination)
  src.start(t)
}

export function playBell() {
  const a = audio()
  if (!a) return
  if (a.state === 'suspended') a.resume()
  const t = a.currentTime
  ;[660, 990, 1320, 1980].forEach((freq, i) => {
    const osc = a.createOscillator()
    const g = a.createGain()
    osc.type = 'sine'
    osc.frequency.value = freq
    const peak = 0.34 / (i + 1)
    g.gain.setValueAtTime(1e-4, t)
    g.gain.exponentialRampToValueAtTime(peak, t + 0.012)
    g.gain.exponentialRampToValueAtTime(1e-4, t + 1.4)
    osc.connect(g).connect(a.destination)
    osc.start(t)
    osc.stop(t + 1.5)
  })
}
