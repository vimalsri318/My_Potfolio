// One screenshot in a device frame. Web projects sit in a laptop, with a phone
// overlapping it when the project has phone screens; anything that is not a
// website (CLI, Mac app, npm package) sits in a plain app window.
const keyOf = (p) => (typeof p === 'string' ? p : p?.key)

export default function DeviceMock({ mock, platforms, title }) {
  if (!mock?.desktop) return null
  const hasWeb = (platforms || []).map(keyOf).includes('web') || !(platforms || []).length
  const alt = `${title} screen`

  return (
    <div className={`mock${mock.phone ? ' mock--duo' : ''}`}>
      {hasWeb ? (
        <div className="mock__laptop">
          <div className="mock__screen">
            <img src={mock.desktop} alt={alt} loading="lazy" decoding="async" width="1000" height="625" />
          </div>
        </div>
      ) : (
        <div className="mock__window">
          <div className="mock__bar" aria-hidden="true"><i /><i /><i /></div>
          <div className="mock__screen">
            <img src={mock.desktop} alt={alt} loading="lazy" decoding="async" width="1000" height="625" />
          </div>
        </div>
      )}
      {mock.phone && (
        <div className="mock__phone">
          <img src={mock.phone} alt={`${title} on a phone`} loading="lazy" decoding="async" width="360" height="780" />
        </div>
      )}
    </div>
  )
}
