import { Inter } from 'next/font/google'
import '../styles/globals.css'
import { useTrackClicks } from '../hooks/useTrackClicks'

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
})

export default function App({ Component, pageProps }) {
  // One delegated listener for the whole site — every link and CTA is tracked
  // without each component having to opt in.
  useTrackClicks()

  return (
    <>
      <style jsx global>{`
        html {
          --font-inter: ${inter.style.fontFamily};
          --font-batangas: 'Batangas', sans-serif;
        }
        @font-face {
          font-family: 'Batangas';
          src: url('/assets/fonts/Batangas.otf') format('opentype');
          font-weight: 700;
          font-style: normal;
          font-display: block;
        }
      `}</style>
      <Component {...pageProps} />
    </>
  )
}
