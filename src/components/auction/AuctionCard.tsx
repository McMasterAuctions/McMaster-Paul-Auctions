'use client'

import { useEffect, useState } from 'react'
import { formatDate, formatDateTime, getTimeRemaining } from '@/lib/utils'
import { Auction } from '@/types'
import Link from 'next/link'
import Image from 'next/image'
import { Clock, MapPin, Package } from 'lucide-react'

interface AuctionCountdownProps {
  auction: Auction
}

export function AuctionCountdown({ auction }: AuctionCountdownProps) {
  const [timeRemaining, setTimeRemaining] = useState<any>(null)

  useEffect(() => {
    const updateCountdown = () => {
      setTimeRemaining(getTimeRemaining(auction.endDate))
    }

    updateCountdown()
    const interval = setInterval(updateCountdown, 1000)

    return () => clearInterval(interval)
  }, [auction.endDate])

  if (!timeRemaining) return null

  return (
    <div className="flex items-center gap-2 text-sm font-semibold">
      <Clock className="w-4 h-4" />
      <span className={timeRemaining.isEnded ? 'text-red-600' : 'text-green-600'}>
        {timeRemaining.display}
      </span>
    </div>
  )
}

interface AuctionCardProps {
  auction: Auction & { _count: { lots: number } }
}

export function AuctionCard({ auction }: AuctionCardProps) {
  return (
    <Link href={`/auctions/${auction.slug}`}>
      <div className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow overflow-hidden">
        {auction.image && (
          <div className="relative w-full h-48 bg-gray-200">
            <Image
              src={auction.image}
              alt={auction.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            {auction.featured && (
              <div className="absolute top-2 right-2 bg-yellow-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                Featured
              </div>
            )}
          </div>
        )}
        <div className="p-4">
          <div className="flex justify-between items-start gap-2 mb-2">
            <h3 className="font-bold text-lg text-gray-900 line-clamp-2">
              {auction.title}
            </h3>
            <span className="text-xs font-semibold px-2 py-1 bg-blue-100 text-blue-800 rounded-full whitespace-nowrap">
              {auction.status}
            </span>
          </div>
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {auction.description}
          </p>
          <div className="space-y-2 text-sm text-gray-700">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              <span>{auction.location}</span>
            </div>
            <div className="flex items-center gap-2">
              <Package className="w-4 h-4" />
              <span>{auction._count.lots} lots</span>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t">
            <AuctionCountdown auction={auction} />
          </div>
        </div>
      </div>
    </Link>
  )
}

interface AuctionGridProps {
  auctions: (Auction & { _count: { lots: number } })[]
}

export function AuctionGrid({ auctions }: AuctionGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {auctions.map((auction) => (
        <AuctionCard key={auction.id} auction={auction} />
      ))}
    </div>
  )
}
