"use client"

import { useEffect, useRef, useState } from "react"

export function useScrollReveal() {
  const ref = useRef<HTMLDivElement>(null)
  const [isRevealed, setIsRevealed] = useState(false)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !isRevealed) {
            setIsRevealed(true)
          }
        })
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -100px 0px"
      }
    )

    observer.observe(element)

    return () => {
      observer.disconnect()
    }
  }, [isRevealed])

  return { ref, isRevealed }
}
