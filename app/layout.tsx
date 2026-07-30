import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'PryroDigital — Business Digitalization Assessment',
  description:
    'Assess your business digital maturity, get AI-powered recommendations, and earn your Digital Transformation Certificate.',
  icons: {
    icon: '/images/pryro.png',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Playfair+Display:wght@700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-white text-gray-900 antialiased">
        {children}
      </body>
    </html>
  )
}
