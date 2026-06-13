'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Lot } from '@/types'
import { formatCurrency } from '@/lib/utils'
import { Gavel } from 'lucide-react'

interface LotGridProps {
  lots: Lot[]
  auctionSlug: string
}

export function LotGrid({ lots, auctionSlug }: LotGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {lots.map((lot) => (
        <Link
          key={lot.id}
          href={`/auctions/${auctionSlug}/lot-${lot.lotNumber}-${lot.slug}`}
        >
          <div className="bg-white rounded-lg border border-gray-200 hover:shadow-lg transition-shadow overflow-hidden h-full flex flex-col">
            {/* Image */}
            {lot.images.length > 0 && (
              <div className="relative w-full h-48 bg-gray-100">
                <Image
                  src={lot.images[0].url}
                  alt={lot.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                {lot.featured && (
                  <div className="absolute top-2 right-2 bg-yellow-500 text-white px-2 py-1 rounded text-xs font-semibold">
                    Featured
                  </div>
                )}
              </div>
            )}

            {/* Content */}
            <div className="p-4 flex-1 flex flex-col">
              {/* Lot Number */}
              <p className="text-xs text-gray-500 font-semibold mb-1">
                LOT {lot.lotNumber}
              </p>

              {/* Title */}
              <h3 className="font-bold text-gray-900 line-clamp-2 mb-3 flex-1">
                {lot.title}
              </h3>

              {/* Category */}
              <p className="text-xs text-gray-600 mb-3">{lot.category}</p>

              {/* Bid Info */}
              <div className="space-y-2 pt-3 border-t">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Current Bid</span>
                  <span className="text-lg font-bold text-blue-600">
                    {formatCurrency(lot.currentBid)}
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm text-gray-600">
                  <span>{lot.bidCount} bids</span>
                  <span className="flex items-center gap-1">
                    <Gavel className="w-4 h-4" />
                    Active
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}
