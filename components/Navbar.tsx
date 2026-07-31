'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [visible, setVisible] = useState(true)
  const lastScrollY = useRef(0)

  useEffect(() => {
    function handleScroll() {
      const currentY = window.scrollY
      if (currentY < lastScrollY.current || currentY < 10) {
        setVisible(true)
      } else {
        setVisible(false)
        setOpen(false)
      }
      lastScrollY.current = currentY
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const links = [
    { label: 'How It Works', href: '/how-it-works' },
    { label: 'Pricing',      href: '/pricing'      },
    { label: 'About',        href: '/about'        },
    { label: 'Learn More',   href: '/learn-more'   },
  ]

  return (
    <>
      {/* Desktop */}
      <div
        className={`hidden md:block fixed top-4 left-0 right-0 z-50
          transition-all duration-300 ease-in-out
          ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'}
        `}
      >
        {/* Pill — absolutely centered */}
        <nav className="mx-auto w-fit flex items-center gap-1 bg-white border border-gray-200 rounded-full px-3 py-1.5 shadow-md">
          <Link href="/" className="flex items-center gap-1 pr-3 mr-1">
            <Image
              src="/images/pryro.png"
              alt="Pryro logo"
              width={40}
              height={40}
              className="object-contain w-10 h-10"
            />
            <span className="font-bold text-gray-900 text-sm">Digital</span>
          </Link>
          {links.map(({ label, href }) => (
            <Link
              key={label}
              href={href}
              className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-all duration-150"
            >
              {label}
            </Link>
          ))}
        </nav>
      </div>

      {/* Mobile */}
      <nav
        className={`md:hidden fixed top-0 left-0 right-0 z-50 bg-white shadow-sm
          transition-transform duration-300 ease-in-out
          ${visible ? 'translate-y-0' : '-translate-y-full'}
        `}
      >
        <div className="px-5 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/images/pryro.png"
              alt="Pryro logo"
              width={36}
              height={36}
              className="object-contain w-9 h-9"
            />
            <span className="font-bold text-gray-900 text-lg">Digital</span>
          </Link>
          <button
            onClick={() => setOpen(!open)}
            className="text-gray-600 hover:text-gray-900 p-1"
            aria-label="Toggle menu"
          >
            {open ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16"/>
              </svg>
            )}
          </button>
        </div>

        {open && (
          <div className="border-t border-gray-100 bg-white px-5 py-3 space-y-1">
            {links.map(({ label, href }) => (
              <Link
                key={label}
                href={href}
                onClick={() => setOpen(false)}
                className="block text-sm text-gray-600 hover:text-gray-900 py-2 font-medium"
              >
                {label}
              </Link>
            ))}
          </div>
        )}
      </nav>
    </>
  )
}
