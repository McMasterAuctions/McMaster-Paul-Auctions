'use client'

import { useEffect, useState } from 'react'
import { notFound } from 'next/navigation'
import { apiCall } from '@/lib/api'
import { Lot } from '@/types'
import { ImageGallery } from '@/components/lot/ImageGallery'
import { BiddingPanel } from '@/components/lot/BiddingPanel'
import { BidHistory } from '@/components/lot/BidHistory'
import { formatCurrency, formatDateTime } from '@/lib/utils'
import { AlertCircle } from 'lucide-react'

interface LotDetailPageProps {
  params: {
    slug: string
    lotSlug: string
  }
}

export default function LotDetailPage({ params }: LotDetailPageProps) {
  const [lot, setLot] = useState<Lot | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchLot = async () => {
      try {
        const data = await apiCall(
          `/api/auctions/${params.slug}/lots/${params.lotSlug}`
        )
        setLot(data)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchLot()
  }, [params.slug, params.lotSlug])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (error || !lot) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 flex items-center gap-4">
        <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0" />
        <div>
          <h3 className="font-bold text-red-900">Error</h3>
          <p className="text-red-800">{error || 'Lot not found'}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm">
        <a href="/" className="text-blue-600 hover:text-blue-700">
          Home
        </a>
        <span className="text-gray-400">/</span>
        <a href="/auctions" className="text-blue-600 hover:text-blue-700">
          Auctions
        </a>
        <span className="text-gray-400">/</span>
        <a
          href={`/auctions/${params.slug}`}
          className="text-blue-600 hover:text-blue-700"
        >
          {lot.auction?.title}
        </a>
        <span className="text-gray-400">/</span>
        <span className="text-gray-600">Lot {lot.lotNumber}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Images */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg p-6">
            <ImageGallery images={lot.images} title={lot.title} />
          </div>
        </div>

        {/* Right Column - Bidding */}
        <div>
          <BiddingPanel lot={lot} />
        </div>
      </div>

      {/* Lot Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Description */}
          <div className="bg-white rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4">{lot.title}</h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-600">Category</label>
                <p className="font-semibold text-gray-900">{lot.category}</p>
              </div>
              {lot.condition && (
                <div>
                  <label className="text-sm text-gray-600">Condition</label>
                  <p className="font-semibold text-gray-900">{lot.condition}</p>
                </div>
              )}
              <div>
                <label className="text-sm text-gray-600 mb-2 block">Description</label>
                <p className="text-gray-700 whitespace-pre-wrap">{lot.description}</p>
              </div>
            </div>
          </div>

          {/* Bid History */}
          {lot.bids && lot.bids.length > 0 && <BidHistory lot={lot} />}
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Lot Info Summary */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="font-bold text-lg mb-4">Lot Information</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Lot Number</span>
                <span className="font-semibold">{lot.lotNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Starting Bid</span>
                <span className="font-semibold">{formatCurrency(lot.startingBid)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Current Bid</span>
                <span className="font-semibold text-blue-600">
                  {formatCurrency(lot.currentBid)}
                </span>
              </div>
              {lot.reservePrice && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Reserve</span>
                  <span className="font-semibold">{formatCurrency(lot.reservePrice)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-600">Total Bids</span>
                <span className="font-semibold">{lot.bidCount}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
