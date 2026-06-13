import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { apiCall } from '@/lib/api'
import { LotGrid } from '@/components/lot/LotGrid'
import { LotFilters } from '@/components/lot/LotFilters'

interface LotsPageProps {
  params: {
    slug: string
  }
  searchParams: {
    page?: string
    sortBy?: string
    category?: string
    minPrice?: string
    maxPrice?: string
    hasBids?: string
    reserveMet?: string
    featured?: string
    search?: string
  }
}

export async function generateMetadata(
  { params }: LotsPageProps
): Promise<Metadata> {
  try {
    const auction = await apiCall(`/api/auctions/${params.slug}`)
    return {
      title: `${auction.title} - Lots - McMaster & Paul Auctions`,
      description: `Browse lots in the ${auction.title} auction`,
    }
  } catch {
    return {
      title: 'Auction Not Found',
    }
  }
}

export default async function LotsPage({ params, searchParams }: LotsPageProps) {
  let auction, lotsData

  try {
    const [auctionRes, lotsRes] = await Promise.all([
      apiCall(`/api/auctions/${params.slug}`),
      apiCall(`/api/auctions/${params.slug}/lots`, {
        params: {
          page: searchParams.page || '1',
          limit: 12,
          sortBy: searchParams.sortBy || 'LOT_NUMBER_ASC',
          category: searchParams.category || '',
          minPrice: searchParams.minPrice || '',
          maxPrice: searchParams.maxPrice || '',
          hasBids: searchParams.hasBids || '',
          reserveMet: searchParams.reserveMet || '',
          featured: searchParams.featured || '',
          search: searchParams.search || '',
        },
      }),
    ])
    auction = auctionRes
    lotsData = lotsRes
  } catch {
    notFound()
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold mb-2">{auction.title}</h1>
        <p className="text-gray-600">Browsing {lotsData.total} lots</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar Filters */}
        <div className="lg:col-span-1">
          <LotFilters
            onFiltersChange={(filters) => {
              // This would be handled by form submission in a real app
            }}
          />
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          {lotsData.lots.length > 0 ? (
            <>
              <LotGrid lots={lotsData.lots} auctionSlug={params.slug} />

              {/* Pagination */}
              {lotsData.pages > 1 && (
                <div className="flex justify-center gap-2 mt-8">
                  {lotsData.page > 1 && (
                    <a
                      href={`?page=${lotsData.page - 1}`}
                      className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      Previous
                    </a>
                  )}
                  {Array.from({ length: lotsData.pages }, (_, i) => i + 1)
                    .filter((p) => Math.abs(p - lotsData.page) <= 2)
                    .map((p) => (
                      <a
                        key={p}
                        href={`?page=${p}`}
                        className={`px-4 py-2 rounded-lg ${
                          p === lotsData.page
                            ? 'bg-blue-600 text-white'
                            : 'border border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {p}
                      </a>
                    ))}
                  {lotsData.page < lotsData.pages && (
                    <a
                      href={`?page=${lotsData.page + 1}`}
                      className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      Next
                    </a>
                  )}
                </div>
              )}
            </>
          ) : (
            <div className="bg-white rounded-lg p-12 text-center">
              <p className="text-gray-600 text-lg">No lots found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
