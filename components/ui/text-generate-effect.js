"use client"

import { motion, stagger, useAnimate } from "motion/react"
import * as React from "react"

function cn(...inputs) {
  return inputs.filter(Boolean).join(" ")
}

function TextGenerateEffect({
  ref,
  words,
  className,
  filter = true,
  duration = 0.5,
  staggerDelay = 0.04,
  ...props
}) {
  const localRef = React.useRef(null)
  React.useImperativeHandle(ref, () => localRef.current)

  const [scope, animate] = useAnimate()
  const [isInView, setIsInView] = React.useState(false)

  // Parse words, supporting **bold text** markdown style
  const wordsArray = React.useMemo(() => {
    if (!words) return []
    const parts = []
    const splitByBold = words.split("**")
    splitByBold.forEach((chunk, i) => {
      const isBold = i % 2 === 1
      const wordsInChunk = chunk.split(" ")
      wordsInChunk.forEach((w, j) => {
        if (w === "" && (j > 0 && j < wordsInChunk.length - 1)) return
        if (w !== "") {
          parts.push({
            text: w,
            isBold
          })
        }
      });
    });
    return parts
  }, [words])

  // Scroll trigger: only animate when element enters the viewport
  React.useEffect(() => {
    const el = localRef.current
    if (!el) return
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsInView(true)
        observer.disconnect()
      }
    }, { threshold: 0.15 })
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  React.useEffect(() => {
    if (isInView && scope.current) {
      animate(
        "span",
        {
          opacity: 1,
          filter: filter ? "blur(0px)" : "none",
        },
        {
          duration,
          delay: stagger(staggerDelay),
        },
      )
    }
  }, [isInView, animate, duration, filter, scope, staggerDelay])

  return (
    <div
      className={cn(className)}
      data-slot="text-generate-effect"
      ref={localRef}
      {...props}
    >
      <motion.div ref={scope} style={{ display: "inline" }}>
        {wordsArray.map((word, idx) => (
          <motion.span
            key={`${word.text}-${idx}`}
            className={word.isBold ? "tge-emph" : undefined}
            style={{
              opacity: 0,
              display: "inline-block",
              marginRight: "0.26em",
              fontWeight: word.isBold ? "600" : "inherit",
              filter: filter ? "blur(10px)" : "none",
              willChange: "transform, opacity, filter"
            }}
          >
            {word.text}
          </motion.span>
        ))}
      </motion.div>
    </div>
  )
}

export { TextGenerateEffect }
export default TextGenerateEffect
