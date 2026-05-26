import { useRef, useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export function useCountUp(target: number, suffix = '') {
  const ref = useRef<HTMLSpanElement>(null)
  const obj = useRef({ val: 0 })

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const tween = gsap.to(obj.current, {
      val: target,
      duration: 2,
      ease: 'power1.inOut',
      snap: { val: 1 },
      onUpdate: () => {
        el.textContent = Math.round(obj.current.val) + suffix
      },
      scrollTrigger: {
        trigger: el,
        start: 'top 85%',
        once: true,
      },
    })

    return () => {
      tween.kill()
    }
  }, [target, suffix])

  return ref
}
