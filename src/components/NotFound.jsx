import { useEffect } from 'react'

export default function NotFound() {
  useEffect(() => {
    document.title = 'Page not found'
  }, [])
  return (
    <main className="notfound">
      <p className="nf-code">404</p>
      <div className="nf-rule" aria-hidden="true" />
      <h1 className="nf-title">Page not found</h1>
      <p className="nf-text">Please check the invitation link you were sent.</p>
    </main>
  )
}
