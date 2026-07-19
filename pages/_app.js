import { Shrikhand, Space_Mono, Inter } from 'next/font/google'
import '../styles/globals.css'

const shrikhand = Shrikhand({
  subsets: ['latin'],
  weight: '400',
  display: 'swap',
})

const spaceMono = Space_Mono({
  subsets: ['latin'],
  weight: ['400', '700'],
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  display: 'swap',
})

export default function App({ Component, pageProps }) {
  return (
    <>
      <style jsx global>{`
        html {
          --font-shrikhand: ${shrikhand.style.fontFamily};
          --font-space-mono: ${spaceMono.style.fontFamily};
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
        .display {
          font-family: 'Batangas', sans-serif !important;
          font-weight: 700;
        }
      `}</style>
      <Component {...pageProps} />
    </>
  )
}
