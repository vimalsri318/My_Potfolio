"use client"

import { useRef } from "react"

// A big word that is solid by default, but wherever the cursor hovers it turns
// into an outline — a soft circle of "hollow" letters follows the pointer, and
// everything outside that circle stays filled. Move the mouse off the word and
// it's fully solid again. Two stacked copies of the text (fill + stroke), each
// masked by a radial gradient centred on the cursor. No library.
export default function SpotlightText({ text, className = "", radius = 130 }) {
  const ref = useRef(null)

  const handleMove = (e) => {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    el.style.setProperty("--sx", `${e.clientX - rect.left}px`)
    el.style.setProperty("--sy", `${e.clientY - rect.top}px`)
  }

  return (
    <span
      ref={ref}
      className={`spot-text ${className}`.trim()}
      onMouseMove={handleMove}
      style={{ "--sr": `${radius}px` }}
    >
      <span className="spot-text__fill">{text}</span>
      <span className="spot-text__stroke" aria-hidden="true">{text}</span>
    </span>
  )
}
