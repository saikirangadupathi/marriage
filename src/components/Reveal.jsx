import { useEffect, useRef, useState } from 'react'

/** Fades/slides its children in the first time they scroll into view (CSS: .reveal → .reveal.in). */
export default function Reveal({ as: Tag = 'div', className = '', children, ...rest }) {
  const ref = useRef(null)
  const [shown, setShown] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setShown(true)
            io.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.18 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <Tag ref={ref} className={'reveal' + (shown ? ' in' : '') + (className ? ' ' + className : '')} {...rest}>
      {children}
    </Tag>
  )
}
