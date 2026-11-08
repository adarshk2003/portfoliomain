/** Project cover: your screenshot if `image` is set, otherwise a gradient placeholder */
export default function Cover({ image, title, hue }) {
  if (image) return <img className="cover" src={image} alt={`${title} screenshot`} loading="lazy" />
  return (
    <div
      className="cover cover-placeholder"
      style={{ '--h1': hue[0], '--h2': hue[1] }}
      role="img"
      aria-label={`${title} preview placeholder`}
    >
      <div className="win">
        <div className="win-dots"><i /><i /><i /></div>
        <div className="win-bar w60" />
        <div className="win-bar w85" />
        <div className="win-bar w40" />
      </div>
    </div>
  )
}
