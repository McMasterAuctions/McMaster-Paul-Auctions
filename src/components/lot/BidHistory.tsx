'use client'

import { useState, useMemo } from 'react'
import { Lot } from '@/types'
import { formatCurrency, formatDateTime } from '@/lib/utils'
import { ChevronDown } from 'lucide-react'

interface BidHistoryProps {
  lot: Lot
}

export function BidHistory({ lot }: BidHistoryProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const sortedBids = useMemo(
    () => [...lot.bids].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
    [lot.bids]
  )

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between font-bold text-gray-900 hover:text-blue-600 transition-colors"
      >
        <span>Bid History ({lot.bidCount})</span>
        <ChevronDown
          className={`w-5 h-5 transition-transform ${
            isExpanded ? 'rotate-180' : ''
          }`}
        />
      </button>

      {isExpanded && (
        <div className="mt-4 space-y-2 max-h-64 overflow-y-auto">
          {sortedBids.map((bid, index) => (
            <div
              key={bid.id}
              className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded"
            >
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">
                  {index + 1}. {bid.user?.name || 'Anonymous'}
                </p>
                <p className="text-xs text-gray-500">
                  {formatDateTime(bid.createdAt)}
                </p>
              </div>
              <p className="text-sm font-bold text-blue-600">
                {formatCurrency(bid.amount)}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
