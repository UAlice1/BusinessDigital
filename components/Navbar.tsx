'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [visible, setVisible] = useState(true)
  const lastScrollY = useRef(0)

  useEffect(() => {
    function handleScroll() {
      const currentY = window.scrollY
      // Show when scrolling up or at the top, hide when scrolling down
      if (currentY < lastScrollY.current || currentY < 10) {
        setVisible(true)
      } else {
        setVisible(false)
        setOpen(false) // close mobile menu when hiding
      }
      lastScrollY.current = currentY
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 bg-white shadow-sm
        transition-transform duration-300 ease-in-out
        ${visible ? 'translate-y-0' : '-translate-y-full'}
      `}
    >
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 shrink-0">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="font-sans font-bold text-white text-sm">P</span>
          </div>
          <span className="font-sans font-bold text-gray-900 text-lg">PryroDigital</span>
        </Link>

        {/* Right */}
        <div className="hidden md:flex items-center gap-3">
          <a href="#" className="text-sm text-gray-600 hover:text-gray-900 transition-colors px-4 py-2 font-medium">
            Login
          </a>
          <a
            href="#"
            onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
            className="btn-primary text-sm"
          >
            Get Started
          </a>
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden text-gray-600 hover:text-gray-900 p-1"
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

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-gray-100 bg-white px-6 py-4 space-y-2">
          <a href="#" className="block text-sm text-gray-600 hover:text-gray-900 py-1.5 font-medium">Login</a>
          <a href="#" onClick={() => setOpen(false)} className="btn-primary block text-center text-sm">
            Get Started
          </a>
        </div>
      )}
    </nav>
  )
}
