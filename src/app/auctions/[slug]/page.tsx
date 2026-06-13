import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { apiCall } from '@/lib/api'
import { Auction } from '@/types'
import { formatDate, formatDateTime, getTimeRemaining } from '@/lib/utils'
import { MapPin, Calendar, Package } from 'lucide-react'
import Link from 'next/link'

interface AuctionDetailPageProps {
  params: {
    slug: string
  }
}

export async function generateMetadata(
  { params }: AuctionDetailPageProps
): Promise<Metadata> {
  try {
    const auction: Auction = await apiCall(`/api/auctions/${params.slug}`)
    return {
      title: `${auction.title} - McMaster & Paul Auctions`,
      description: auction.description,
    }
  } catch {
    return {
      title: 'Auction Not Found',
    }
  }
}

export default async function AuctionDetailPage(
  { params }: AuctionDetailPageProps
) {
  let auction: Auction & { auctioneer?: any, _count?: { lots: number } }

  try {
    auction = await apiCall(`/api/auctions/${params.slug}`)
  } catch {
    notFound()
  }

  const timeRemaining = getTimeRemaining(auction.endDate)

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white rounded-lg p-6 md:p-8">
        <div className="flex justify-between items-start gap-4 mb-4">
          <div className="flex-1">
            <h1 className="text-4xl font-bold mb-2">{auction.title}</h1>
            <p className="text-gray-600">{auction.description}</p>
          </div>
          <span className={`px-4 py-2 rounded-full font-semibold text-white whitespace-nowrap ${
            auction.status === 'ACTIVE' ? 'bg-green-600' :
            auction.status === 'UPCOMING' ? 'bg-blue-600' :
            'bg-gray-600'
          }`}>
            {auction.status}
          </span>
        </div>

        {/* Key Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <div>
            <p className="text-sm text-gray-600 mb-1">Location</p>
            <div className="flex items-center gap-2 font-semibold">
              <MapPin className="w-5 h-5 text-blue-600" />
              {auction.location}
            </div>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Starts</p>
            <div className="flex items-center gap-2 font-semibold">
              <Calendar className="w-5 h-5 text-blue-600" />
              {formatDateTime(auction.startDate)}
            </div>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Ends</p>
            <div className="flex items-center gap-2 font-semibold">
              <Calendar className="w-5 h-5 text-blue-600" />
              {formatDateTime(auction.endDate)}
            </div>
          </div>
        </div>
      </div>

      {/* Important Dates */}
      {(auction.previewStartDate || auction.pickupStartDate) && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h2 className="font-bold text-lg mb-4 text-gray-900">Important Dates</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            {auction.previewStartDate && (
              <div>
                <p className="text-gray-600">Preview Period</p>
                <p className="font-semibold">
                  {formatDateTime(auction.previewStartDate)} to{' '}
                  {formatDateTime(auction.previewEndDate!)}
                </p>
              </div>
            )}
            {auction.pickupStartDate && (
              <div>
                <p className="text-gray-600">Pickup Period</p>
                <p className="font-semibold">
                  {formatDateTime(auction.pickupStartDate)} to{' '}
                  {formatDateTime(auction.pickupEndDate!)}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Terms */}
      {auction.terms && (
        <div className="bg-white rounded-lg p-6">
          <h2 className="font-bold text-lg mb-4">Terms & Conditions</h2>
          <div className="prose prose-sm max-w-none">
            {auction.terms}
          </div>
        </div>
      )}

      {/* Browse Lots */}
      <div className="bg-white rounded-lg p-6">
        <div className="flex justify-between items-center">
          <h2 className="font-bold text-2xl">Browse Lots</h2>
          <Link
            href={`/auctions/${params.slug}/lots`}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-2 rounded-lg"
          >
            View All Lots
          </Link>
        </div>
      </div>
    </div>
  )
}
