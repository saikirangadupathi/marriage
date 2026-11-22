/** Gold line ornament with a leaf and marigold dots. */
export default function Divider() {
  return (
    <div className="divider" aria-hidden="true">
      <svg viewBox="0 0 200 40" xmlns="http://www.w3.org/2000/svg" fill="none">
        <path d="M10 20 H80" stroke="#B07D1A" strokeWidth="1" />
        <path d="M120 20 H190" stroke="#B07D1A" strokeWidth="1" />
        <path d="M100 8 C92 16 92 24 100 32 C108 24 108 16 100 8 Z" fill="#5A7D3C" />
        <circle cx="100" cy="20" r="4.5" fill="#E0982A" />
        <circle cx="86" cy="20" r="2" fill="#9E2B25" />
        <circle cx="114" cy="20" r="2" fill="#9E2B25" />
      </svg>
    </div>
  )
}
