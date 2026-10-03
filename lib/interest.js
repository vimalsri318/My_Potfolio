// "Build me one like this" / "Request this" buttons anywhere on the home page
// pre-select what the visitor wants in the contact form. Same-page clicks use
// an event; links from other pages use ?interest=<value>#contact.

export const INTEREST_EVENT = 'hire:interest'

export function requestInterest(value) {
  if (typeof window === 'undefined') return
  window.dispatchEvent(new CustomEvent(INTEREST_EVENT, { detail: value }))
  document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })
}

// Href for links that leave the current page (e.g. from a case study).
export const interestHref = (value) => `/?interest=${encodeURIComponent(value)}#contact`
