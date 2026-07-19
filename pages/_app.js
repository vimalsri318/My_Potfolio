import { Gloock, Space_Mono } from 'next/font/google'
import '../styles/globals.css'

const gloock = Gloock({
  subsets: ['latin'],
  weight: '400',
  display: 'swap',
})

const spaceMono = Space_Mono({
  subsets: ['latin'],
  weight: ['400', '700'],
  display: 'swap',
})

export default function App({ Component, pageProps }) {
  return (
    <>
      <style jsx global>{`
        html {
          --font-gloock: ${gloock.style.fontFamily};
          --font-space-mono: ${spaceMono.style.fontFamily};
        }
      `}</style>
      <Component {...pageProps} />
    </>
  )
}
