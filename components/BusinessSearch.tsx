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
  isManual?: boolean
}

interface Props {
  onSelect: (business: BusinessResult) => void
  isLoading?: boolean
  placeholder?: string
}

const SECTORS = [
  'Food & Beverage', 'Retail', 'Healthcare', 'Education', 'Finance',
  'Technology', 'Hospitality', 'Real Estate', 'Agriculture', 'Manufacturing',
  'Beauty & Personal Care', 'Automotive', 'Logistics', 'Telecommunications',
  'Energy', 'Media & Entertainment', 'General Business',
]

export default function BusinessSearch({ onSelect, isLoading, placeholder = 'Search products...' }: Props) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<BusinessResult[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)
  const [noResults, setNoResults] = useState(false)
  const [showAddForm, setShowAddForm] = useState(false)
  const [manualBiz, setManualBiz] = useState({ name: '', sector: '', location: '', description: '' })
  const [manualError, setManualError] = useState('')

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setShowDropdown(false)
        setShowAddForm(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const doSearch = useCallback(async (q: string) => {
    setIsSearching(true)
    setNoResults(false)
    setShowAddForm(false)
    try {
      const res = await fetch(`/api/business/search?query=${encodeURIComponent(q)}`)
      const data = await res.json() as { businesses?: BusinessResult[]; places?: BusinessResult[] }
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

  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([]); setShowDropdown(false); setNoResults(false); setShowAddForm(false)
      if (debounceRef.current) clearTimeout(debounceRef.current)
      return
    }
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => doSearch(query.trim()), 300)
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current) }
  }, [query, doSearch])

  function handleSelect(biz: BusinessResult) {
    if (isLoading) return
    setShowDropdown(false); setShowAddForm(false); setQuery('')
    onSelect(biz)
  }

  function openAddForm() {
    setManualBiz({ name: query.trim(), sector: '', location: '', description: '' })
    setManualError('')
    setShowDropdown(false)
    setShowAddForm(true)
  }

  function handleManualSubmit() {
    if (!manualBiz.name.trim()) { setManualError('Business name is required'); return }
    if (!manualBiz.sector) { setManualError('Please select a sector'); return }
    if (!manualBiz.location.trim()) { setManualError('Location is required'); return }
    setShowAddForm(false)
    setQuery('')
    onSelect({ ...manualBiz, isManual: true })
  }

  const dropdownVisible = showDropdown && query.trim().length >= 2

  return (
    <div ref={wrapperRef} className="relative w-full max-w-2xl mx-auto px-4 sm:px-0" role="search">

      {/* Input */}
      <div className="relative flex items-center">
        <input
          ref={inputRef}
          type="text"
          role="combobox"
          aria-autocomplete="list"
          aria-expanded={dropdownVisible}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => results.length > 0 && setShowDropdown(true)}
          onKeyDown={(e) => {
            if (e.key === 'Escape') { setShowDropdown(false); setShowAddForm(false) }
            if (e.key === 'Enter' && query.trim().length >= 2) doSearch(query.trim())
          }}
          placeholder={placeholder}
          autoComplete="off"
          spellCheck={false}
          className="w-full bg-gray-100 focus:bg-white text-gray-900 placeholder-gray-500 text-base font-sans py-4 pl-6 pr-14 rounded-full border border-transparent focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-200"
        />
        <span className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none" aria-hidden="true">
          {isSearching ? (
            <svg className="w-5 h-5 animate-spin text-primary" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z"/>
            </svg>
          ) : (
            <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"/>
            </svg>
          )}
        </span>
      </div>

      {/* Search results dropdown */}
      {dropdownVisible && (
        <div className="absolute left-0 right-0 top-full mt-2 z-50 bg-white border border-gray-200 rounded-lg shadow-lg max-h-96 overflow-y-auto animate-slide-up">
          {results.length > 0 ? (
            <>
              {results.map((biz, i) => (
                <button key={biz.id ?? biz.googlePlaceId ?? i} onClick={() => handleSelect(biz)}
                  disabled={!!isLoading}
                  className="w-full text-left px-6 py-4 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-0 disabled:opacity-50 group">
                  <div className="font-semibold text-gray-900 group-hover:text-primary text-sm truncate">{biz.name}</div>
                  <div className="text-xs text-gray-400 mt-0.5 truncate">{biz.sector}{biz.location ? ` · ${biz.location}` : ''}</div>
                </button>
              ))}
              {/* Always show "add unlisted" option below results */}
              <button onClick={openAddForm}
                className="w-full text-left px-6 py-4 hover:bg-gray-50 transition-colors text-sm text-gray-500 border-t border-gray-100 flex items-center gap-2">
                <span className="text-primary font-bold text-base leading-none">+</span>
                My business is not listed — add it
              </button>
            </>
          ) : noResults ? (
            <div className="px-6 py-5">
              <p className="text-sm text-gray-500 mb-3">No businesses found for <strong>&ldquo;{query}&rdquo;</strong></p>
              <button onClick={openAddForm}
                className="w-full py-2.5 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-primary-dark transition-colors">
                Add &ldquo;{query}&rdquo; and assess anyway
              </button>
            </div>
          ) : null}
        </div>
      )}

      {/* Add business form — appears below the search bar */}
      {showAddForm && (
        <div className="absolute left-0 right-0 top-full mt-2 z-50 bg-white border border-gray-200 rounded-lg shadow-lg p-5 animate-slide-up">
          <p className="text-sm font-semibold text-gray-900 mb-4">Add your business details</p>
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Business name *</label>
              <input type="text" value={manualBiz.name}
                onChange={(e) => setManualBiz({ ...manualBiz, name: e.target.value })}
                placeholder="e.g. Kigali Coffee House"
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20"/>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Industry / Sector *</label>
              <select value={manualBiz.sector}
                onChange={(e) => setManualBiz({ ...manualBiz, sector: e.target.value })}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 bg-white">
                <option value="">Select sector…</option>
                {SECTORS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Location *</label>
              <input type="text" value={manualBiz.location}
                onChange={(e) => setManualBiz({ ...manualBiz, location: e.target.value })}
                placeholder="e.g. Kigali, Rwanda"
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20"/>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Brief description <span className="text-gray-300">(optional)</span></label>
              <input type="text" value={manualBiz.description}
                onChange={(e) => setManualBiz({ ...manualBiz, description: e.target.value })}
                placeholder="What does your business do?"
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20"/>
            </div>
            {manualError && <p className="text-xs text-red-500 font-medium">{manualError}</p>}
            <div className="flex gap-2 pt-1">
              <button onClick={() => setShowAddForm(false)}
                className="flex-1 py-2.5 border border-gray-200 text-gray-500 text-sm rounded-lg hover:border-gray-300 transition-colors">
                Cancel
              </button>
              <button onClick={handleManualSubmit} disabled={!!isLoading}
                className="flex-1 py-2.5 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50">
                {isLoading ? 'Adding…' : 'Continue to Assessment'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
