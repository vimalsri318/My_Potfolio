import { Html, Head, Main, NextScript } from 'next/document'

// Site-wide <head> bits that never change per page. The icon is the same
// VS monogram the nav bar carries (Batangas, white on ink): an SVG for
// browsers that take one, a PNG fallback, and the 180px Apple touch icon
// for a phone home screen.
export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="icon" href="/favicon.png" type="image/png" sizes="512x512" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" sizes="180x180" />
        {/* matches --paper, so a phone's browser chrome blends with the page */}
        <meta name="theme-color" content="#f1f1ee" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
