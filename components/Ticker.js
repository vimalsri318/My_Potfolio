// Black scrolling ticker band
export default function Ticker({ items }) {
  const line = items.join('  ')
  return (
    <div className="ticker" aria-hidden="true">
      <div className="ticker__track">
        <span>{line}</span>
        <span>{line}</span>
      </div>
    </div>
  )
}
