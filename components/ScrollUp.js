import { useState, useEffect } from 'react'

export default function ScrollUp() {
  const [showScroll, setShowScroll] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setShowScroll(window.scrollY >= 350)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <a href="#" className={`scrollup ${showScroll ? 'show-scroll' : ''}`} id="scroll-up">
      <i className="ri-arrow-up-line"></i>
    </a>
  )
}