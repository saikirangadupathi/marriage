import { useLayoutEffect } from 'react'

/**
 * Shrinks text inside a fixed-size box until it fits, by lowering the CSS variable --fit
 * (font sizes and gaps in the box are multiplied by it). Re-fits on resize and once web fonts load.
 */
export function useFitText(ref, deps = [], { min = 0.5, step = 0.03 } = {}) {
  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return

    function contentHeight() {
      const kids = el.children
      if (!kids.length) return 0
      const cs = getComputedStyle(el)
      const top = kids[0].getBoundingClientRect().top
      const bottom = kids[kids.length - 1].getBoundingClientRect().bottom
      return bottom - top + parseFloat(cs.paddingTop) + parseFloat(cs.paddingBottom)
    }

    function fit() {
      let f = 1
      el.style.setProperty('--fit', f)
      const box = el.getBoundingClientRect().height
      while (contentHeight() > box && f > min) {
        f = Math.max(min, f - step)
        el.style.setProperty('--fit', f)
      }
    }

    fit()
    const ro = new ResizeObserver(fit)
    ro.observe(el)
    document.fonts?.ready.then(fit)
    return () => ro.disconnect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
}
