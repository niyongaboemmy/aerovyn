import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#00F5C4',
          glow: 'rgba(0, 245, 196, 0.15)',
          border: 'rgba(0, 245, 196, 0.25)',
        },
        bg: {
          base: '#0A0B0D',
          surface: '#111318',
          elevated: '#1A1D24',
        },
        text: {
          primary: '#FFFFFF',
          secondary: '#C4CDD8',
          muted: '#6B7A8D',
        },
      },
      fontFamily: {
        display: ['var(--font-orbitron)', 'sans-serif'],
        body: ['var(--font-dm-sans)', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-brand': 'linear-gradient(135deg, #00F5C4 0%, #00B8A9 100%)',
        'gradient-dark': 'linear-gradient(180deg, #0A0B0D 0%, #111318 100%)',
      },
      animation: {
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(0, 245, 196, 0.15)' },
          '50%': { boxShadow: '0 0 40px rgba(0, 245, 196, 0.35)' },
        },
      },
    },
  },
  plugins: [],
}

export default config
