'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { BidSchema } from '@/lib/validators'
import { bidApi } from '@/lib/api'
import { formatCurrency, calculateBidIncrement } from '@/lib/utils'
import { Lot } from '@/types'
import { Heart } from 'lucide-react'

interface BiddingPanelProps {
  lot: Lot
  onBidPlaced?: () => void
}

export function BiddingPanel({ lot, onBidPlaced }: BiddingPanelProps) {
  const { data: session } = useSession()
  const [bidAmount, setBidAmount] = useState(lot.currentBid + calculateBidIncrement(lot.currentBid))
  const [maxBid, setMaxBid] = useState('')
  const [useMaxBid, setUseMaxBid] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [isWatched, setIsWatched] = useState(false)

  const minimumBid = lot.currentBid + calculateBidIncrement(lot.currentBid)

  const handlePlaceBid = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!session?.user?.id) {
      setError('Please sign in to place a bid')
      return
    }

    if (bidAmount < minimumBid) {
      setError(`Minimum bid is ${formatCurrency(minimumBid)}`)
      return
    }

    setLoading(true)

    try {
      const bidData = {
        amount: bidAmount,
        maxBid: useMaxBid ? parseFloat(maxBid) : undefined,
      }

      const validation = BidSchema.safeParse(bidData)
      if (!validation.success) {
        setError('Invalid bid amount')
        return
      }

      await bidApi.place(lot.id, validation.data)
      setSuccess('Bid placed successfully!')
      setBidAmount(bidAmount + calculateBidIncrement(bidAmount))
      setMaxBid('')
      onBidPlaced?.()
    } catch (err: any) {
      setError(err.message || 'Failed to place bid')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-6">
      {/* Lot Status */}
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Current Bid</span>
          <span className="text-3xl font-bold text-blue-600">
            {formatCurrency(lot.currentBid)}
          </span>
        </div>
        <div className="flex justify-between text-sm text-gray-600">
          <span>Starting Bid: {formatCurrency(lot.startingBid)}</span>
          <span>Bids: {lot.bidCount}</span>
        </div>
        {lot.reservePrice && (
          <div
            className={`text-sm px-3 py-2 rounded ${
              lot.reserveMet
                ? 'bg-green-100 text-green-800'
                : 'bg-yellow-100 text-yellow-800'
            }`}
          >
            {lot.reserveMet ? '✓ Reserve Met' : 'Reserve Not Met'}
          </div>
        )}
      </div>

      {/* Bidding Form */}
      {!session ? (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
          <p className="text-blue-900 text-sm">
            Sign in to place a bid
          </p>
        </div>
      ) : (
        <form onSubmit={handlePlaceBid} className="space-y-4">
          {/* Standard Bid */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Bid Amount (CAD)
            </label>
            <input
              type="number"
              step="0.01"
              min={minimumBid}
              value={bidAmount}
              onChange={(e) => setBidAmount(parseFloat(e.target.value) || 0)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={loading}
            />
            <p className="text-xs text-gray-500 mt-1">
              Minimum: {formatCurrency(minimumBid)}
            </p>
          </div>

          {/* Max Bid Option */}
          <div className="border-t pt-4">
            <label className="flex items-center gap-2 cursor-pointer mb-3">
              <input
                type="checkbox"
                checked={useMaxBid}
                onChange={(e) => setUseMaxBid(e.target.checked)}
                className="rounded"
              />
              <span className="text-sm font-medium text-gray-700">
                Use automatic bidding
              </span>
            </label>
            {useMaxBid && (
              <input
                type="number"
                step="0.01"
                min={bidAmount}
                value={maxBid}
                onChange={(e) => setMaxBid(e.target.value)}
                placeholder="Enter maximum bid"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={loading}
              />
            )}
            <p className="text-xs text-gray-500 mt-1">
              Automatic bidding will bid on your behalf up to your maximum amount
            </p>
          </div>

          {/* Messages */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}
          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
              {success}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-3 rounded-lg transition-colors"
          >
            {loading ? 'Placing Bid...' : 'Place Bid'}
          </button>
        </form>
      )}

      {/* Watchlist Button */}
      <button
        className="w-full flex items-center justify-center gap-2 border-2 border-gray-300 hover:border-red-500 text-gray-700 hover:text-red-600 font-semibold py-2 rounded-lg transition-colors"
      >
        <Heart className={`w-5 h-5 ${isWatched ? 'fill-red-500' : ''}`} />
        {isWatched ? 'Remove from Watchlist' : 'Add to Watchlist'}
      </button>
    </div>
  )
}
