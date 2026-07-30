import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#2563eb',
          dark:    '#1d4ed8',
          light:   '#eff6ff',
        },
        mtn: {
          yellow: '#FFCC00',
          dark:   '#003366',
        },
      },
      fontFamily: {
        sans:    ['Inter', 'system-ui', 'sans-serif'],
        display: ['"Playfair Display"', 'Georgia', 'serif'],
      },
      borderRadius: {
        md:  '0.375rem',
        lg:  '0.5rem',
        xl:  '0.75rem',
        '2xl': '1rem',
      },
    },
  },
  plugins: [],
}

export default config
