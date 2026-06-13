'use client'

import { useState, useEffect } from 'react'
import { apiCall } from '@/lib/api'
import { ChevronLeft, ChevronRight, Search } from 'lucide-react'

interface SearchResult {
  auctions: Array<{ slug: string; title: string; image?: string }>
  lots: Array<{ slug: string; title: string; auction: { slug: string }; images: Array<{ url: string }> }>
}

export function SearchBar() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult | null>(null)
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (query.trim().length < 2) {
        setResults(null)
        return
      }

      setLoading(true)
      try {
        const data = await apiCall('/api/search', { params: { q: query } })
        setResults(data)
        setIsOpen(true)
      } catch (error) {
        console.error('Search error:', error)
      } finally {
        setLoading(false)
      }
    }, 300)

    return () => clearTimeout(timer)
  }, [query])

  return (
    <div className="relative flex-1 max-w-2xl">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.trim().length >= 2 && setIsOpen(true)}
          placeholder="Search auctions and lots..."
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Dropdown Results */}
      {isOpen && results && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-300 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
          {/* Auctions */}
          {results.auctions.length > 0 && (
            <div>
              <div className="px-4 py-2 bg-gray-50 border-b font-semibold text-sm text-gray-700">
                Auctions
              </div>
              {results.auctions.map((auction) => (
                <a
                  key={auction.slug}
                  href={`/auctions/${auction.slug}`}
                  className="block px-4 py-3 hover:bg-blue-50 border-b last:border-b-0"
                >
                  <p className="font-semibold text-gray-900">{auction.title}</p>
                </a>
              ))}
            </div>
          )}

          {/* Lots */}
          {results.lots.length > 0 && (
            <div>
              <div className="px-4 py-2 bg-gray-50 border-b font-semibold text-sm text-gray-700">
                Lots
              </div>
              {results.lots.map((lot) => (
                <a
                  key={lot.slug}
                  href={`/auctions/${lot.auction.slug}/lots/${lot.slug}`}
                  className="block px-4 py-3 hover:bg-blue-50 border-b last:border-b-0"
                >
                  <p className="font-semibold text-gray-900 line-clamp-1">{lot.title}</p>
                  <p className="text-sm text-gray-600">{lot.auction.slug}</p>
                </a>
              ))}
            </div>
          )}

          {/* No Results */}
          {results.auctions.length === 0 && results.lots.length === 0 && (
            <div className="px-4 py-6 text-center text-gray-600">
              No results found
            </div>
          )}
        </div>
      )}

      {isOpen && <div className="fixed inset-0" onClick={() => setIsOpen(false)} />
      }
    </div>
  )
}
