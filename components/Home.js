// Hero — giant display-serif name marquee scrolling behind the portrait cutout.
// Swap /assets/img/home-perfil.png for a generated image any time.
const NAME = 'VIMAL SRINIVASAN'

export default function Home() {
  return (
    <section className="hero" id="home">
      <div className="hero__marquee" aria-hidden="true">
        <div className="hero__marquee-track">
          {/* duplicated once so the -50% translate loops seamlessly */}
          <span className="display">{NAME}</span>
          <span className="display">{NAME}</span>
        </div>
      </div>

      <img
        src="/assets/img/home-perfil-web.png"
        alt="Vimal Srinivasan"
        className="hero__portrait"
      />

      <p className="hero__caption">
        Web &amp; AR/VR developer based in Coimbatore, India.
      </p>

      <span className="hero__badge">AR / VR</span>
    </section>
  )
}
