'use client'

import { useState, useEffect, useRef, useCallback } from 'react'

interface BusinessResult {
  id?: string
  googlePlaceId?: string
  name: string
  sector: string
  location: string
  address?: string
  rating?: number
  reviewCount?: number
  website?: string
  description?: string
}

interface Props {
  onSelect: (business: BusinessResult) => void
  isLoading?: boolean
  placeholder?: string
}

export default function BusinessSearch({ onSelect, isLoading, placeholder = 'Search products...' }: Props) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<BusinessResult[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)
  const [noResults, setNoResults] = useState(false)

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setShowDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const doSearch = useCallback(async (q: string) => {
    setIsSearching(true)
    setNoResults(false)
    try {
      const res = await fetch(`/api/business/search?query=${encodeURIComponent(q)}`)
      const data = await res.json() as { businesses?: BusinessResult[]; places?: BusinessResult[] }
      // Support both API shapes: { businesses } or { places }
      const items = data.businesses ?? data.places ?? []
      setResults(items)
      setShowDropdown(true)
      setNoResults(items.length === 0)
    } catch {
      setResults([])
      setNoResults(true)
    } finally {
      setIsSearching(false)
    }
  }, [])

  // 300ms debounce
  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([])
      setShowDropdown(false)
      setNoResults(false)
      if (debounceRef.current) clearTimeout(debounceRef.current)
      return
    }
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => doSearch(query.trim()), 300)
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [query, doSearch])

  function handleSelect(biz: BusinessResult) {
    if (isLoading) return
    setShowDropdown(false)
    setQuery('')
    onSelect(biz)
  }

  const dropdownVisible = showDropdown && query.trim().length >= 2

  return (
    <div
      ref={wrapperRef}
      className="relative w-full max-w-2xl mx-auto px-4 sm:px-0"
      role="search"
      aria-label="Search businesses"
    >
      {/* Input pill */}
      <div className="relative flex items-center">
        <input
          ref={inputRef}
          type="text"
          role="combobox"
          aria-autocomplete="list"
          aria-expanded={dropdownVisible}
          aria-controls="business-search-results"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => results.length > 0 && setShowDropdown(true)}
          onKeyDown={(e) => {
            if (e.key === 'Escape') setShowDropdown(false)
            if (e.key === 'Enter' && query.trim().length >= 2) doSearch(query.trim())
          }}
          placeholder={placeholder}
          autoComplete="off"
          spellCheck={false}
          className="
            w-full
            bg-gray-100 focus:bg-white
            text-gray-900 placeholder-gray-500
            text-base font-sans
            py-4 pl-6 pr-14
            rounded-full
            border border-transparent
            focus:outline-none focus:ring-2 focus:ring-primary
            transition-all duration-200
          "
        />

        {/* Search icon — right side, non-interactive while searching */}
        <span
          className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none"
          aria-hidden="true"
        >
          {isSearching ? (
            /* Animated spinner */
            <svg
              className="w-5 h-5 animate-spin"
              style={{ color: '#2563eb' }}
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12" cy="12" r="10"
                stroke="currentColor" strokeWidth="2"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z"
              />
            </svg>
          ) : (
            /* Magnifying glass — always blue */
            <svg
              className="w-5 h-5"
              style={{ color: '#2563eb' }}
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"
              />
            </svg>
          )}
        </span>
      </div>

      {/* Dropdown */}
      {dropdownVisible && (
        <div
          id="business-search-results"
          role="listbox"
          aria-label="Search results"
          className="
            absolute left-0 right-0
            top-full mt-2 z-50
            bg-white
            border border-gray-200
            rounded-lg
            shadow-lg
            max-h-96 overflow-y-auto
            animate-slide-up
          "
        >
          {results.length > 0 ? (
            results.map((biz, i) => (
              <button
                key={biz.id ?? biz.googlePlaceId ?? i}
                role="option"
                aria-selected={false}
                onClick={() => handleSelect(biz)}
                disabled={!!isLoading}
                className="
                  w-full text-left
                  px-6 py-4
                  hover:bg-gray-100
                  transition-colors duration-150
                  border-b border-gray-100 last:border-0
                  disabled:opacity-50 disabled:cursor-not-allowed
                  group
                "
              >
                <div className="font-semibold text-gray-900 group-hover:text-primary text-sm truncate">
                  {biz.name}
                </div>
                <div className="text-xs text-gray-400 mt-0.5 truncate">
                  {biz.sector}
                  {biz.location ? ` · ${biz.location}` : ''}
                </div>
              </button>
            ))
          ) : noResults ? (
            <div className="px-6 py-6 text-center text-gray-400 text-sm">
              No businesses found
            </div>
          ) : null}
        </div>
      )}
    </div>
  )
}

