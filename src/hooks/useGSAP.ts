import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

type GSAPCallback = (g: typeof gsap) => void

export function useGSAP(callback: GSAPCallback, deps: unknown[] = []) {
  const ctxRef = useRef<gsap.Context | null>(null)

  useEffect(() => {
    ctxRef.current = gsap.context(() => callback(gsap))
    return () => {
      // Kill without reverting: reverting tries to write CSS properties back to
      // DOM nodes that React may have already detached, which can throw removeChild errors.
      ctxRef.current?.kill()
      ctxRef.current = null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
}
