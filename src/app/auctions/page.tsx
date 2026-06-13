import { Metadata } from 'next'
import { Suspense } from 'react'
import { apiCall } from '@/lib/api'
import { AuctionGrid } from '@/components/auction/AuctionCard'
import { SearchBar } from '@/components/common/SearchBar'

export const metadata: Metadata = {
  title: 'Browse Auctions - McMaster & Paul Auctions',
  description: 'Browse all active, upcoming, and past auctions on our platform.',
}

interface AuctionsPageProps {
  searchParams: {
    page?: string
    status?: string
    featured?: string
    search?: string
  }
}

async function AuctionsList({ searchParams }: AuctionsPageProps) {
  const page = parseInt(searchParams.page || '1')
  const limit = 12

  const params: any = { page, limit }
  if (searchParams.status) params.status = searchParams.status
  if (searchParams.featured) params.featured = searchParams.featured
  if (searchParams.search) params.search = searchParams.search

  try {
    const data = await apiCall('/api/auctions', { params })
    return {
      auctions: data.data,
      total: data.total,
      page: data.page,
      pages: data.pages,
    }
  } catch (error) {
    console.error('Failed to fetch auctions:', error)
    return { auctions: [], total: 0, page: 1, pages: 0 }
  }
}

export default async function AuctionsPage({ searchParams }: AuctionsPageProps) {
  const { auctions, total, page, pages } = await AuctionsList({ searchParams })

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold mb-2">Auctions</h1>
        <p className="text-gray-600">Browse all auctions</p>
      </div>

      {/* Search */}
      <div className="bg-white rounded-lg p-6">
        <SearchBar />
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <select
            defaultValue={searchParams.status || ''}
            onChange={(e) => {
              const url = new URL(window.location.href)
              if (e.target.value) {
                url.searchParams.set('status', e.target.value)
              } else {
                url.searchParams.delete('status')
              }
              window.location.href = url.toString()
            }}
            className="px-4 py-2 border border-gray-300 rounded-lg"
          >
            <option value="">All Statuses</option>
            <option value="UPCOMING">Upcoming</option>
            <option value="ACTIVE">Active</option>
            <option value="CLOSED">Closed</option>
          </select>
        </div>
      </div>

      {/* Auctions Grid */}
      {auctions.length > 0 ? (
        <div>
          <AuctionGrid auctions={auctions} />

          {/* Pagination */}
          {pages > 1 && (
            <div className="flex justify-center gap-2 mt-8">
              {page > 1 && (
                <a
                  href={`?page=${page - 1}${searchParams.status ? `&status=${searchParams.status}` : ''}`}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Previous
                </a>
              )}
              {Array.from({ length: Math.min(5, pages) }, (_, i) => {
                const pageNum = Math.max(1, page - 2) + i
                if (pageNum > pages) return null
                return (
                  <a
                    key={pageNum}
                    href={`?page=${pageNum}${searchParams.status ? `&status=${searchParams.status}` : ''}`}
                    className={`px-4 py-2 rounded-lg ${
                      pageNum === page
                        ? 'bg-blue-600 text-white'
                        : 'border border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {pageNum}
                  </a>
                )
              })}
              {page < pages && (
                <a
                  href={`?page=${page + 1}${searchParams.status ? `&status=${searchParams.status}` : ''}`}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Next
                </a>
              )}
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-lg p-12 text-center">
          <p className="text-gray-600 text-lg">No auctions found</p>
        </div>
      )}
    </div>
  )
}
