import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

type GSAPCallback = (g: typeof gsap) => void

export function useGSAP(callback: GSAPCallback, deps: unknown[] = []) {
  const ctxRef = useRef<gsap.Context | null>(null)

  useEffect(() => {
    ctxRef.current = gsap.context(() => callback(gsap))
    return () => {
      ctxRef.current?.revert()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
}
