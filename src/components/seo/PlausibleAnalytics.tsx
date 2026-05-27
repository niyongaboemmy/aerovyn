'use client'

import Script from 'next/script'
import { useEffect, useState } from 'react'

export function PlausibleAnalytics() {
  const [isLocalhost, setIsLocalhost] = useState(true)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsLocalhost(
        window.location.hostname === 'localhost' ||
        window.location.hostname === '127.0.0.1'
      )
    }
  }, [])

  if (isLocalhost) return null

  return (
    <Script
      defer
      data-domain="aerovyn.com"
      src="https://plausible.io/js/script.js"
      strategy="afterInteractive"
    />
  )
}
