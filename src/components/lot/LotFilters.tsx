'use client'

import { useState } from 'react'
import { LotCategory } from '@/types'
import { LOT_CATEGORIES, SORT_OPTIONS } from '@/lib/constants'
import { ChevronDown } from 'lucide-react'

interface LotFiltersProps {
  onFiltersChange: (filters: any) => void
}

export function LotFilters({ onFiltersChange }: LotFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [filters, setFilters] = useState({
    category: '',
    minPrice: '',
    maxPrice: '',
    sortBy: 'LOT_NUMBER_ASC',
    hasBids: '',
    reserveMet: '',
    featured: false,
  })

  const handleFilterChange = (key: string, value: any) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    onFiltersChange(newFilters)
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between font-bold text-gray-900 lg:hidden"
      >
        <span>Filters</span>
        <ChevronDown
          className={`w-5 h-5 transition-transform ${
            isExpanded ? 'rotate-180' : ''
          }`}
        />
      </button>

      <div className={`space-y-6 ${!isExpanded && 'hidden lg:block'} mt-4 lg:mt-0`}>
        {/* Sort */}
        <div>
          <label className="block text-sm font-bold text-gray-900 mb-3">
            Sort By
          </label>
          <select
            value={filters.sortBy}
            onChange={(e) => handleFilterChange('sortBy', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-bold text-gray-900 mb-3">
            Category
          </label>
          <select
            value={filters.category}
            onChange={(e) => handleFilterChange('category', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Categories</option>
            {LOT_CATEGORIES.map((cat) => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>
        </div>

        {/* Price Range */}
        <div>
          <label className="block text-sm font-bold text-gray-900 mb-3">
            Price Range (CAD)
          </label>
          <div className="flex gap-2">
            <input
              type="number"
              placeholder="Min"
              value={filters.minPrice}
              onChange={(e) => handleFilterChange('minPrice', e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <input
              type="number"
              placeholder="Max"
              value={filters.maxPrice}
              onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Bid Status */}
        <div>
          <label className="block text-sm font-bold text-gray-900 mb-3">
            Bid Status
          </label>
          <div className="space-y-2">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="bids"
                value=""
                checked={filters.hasBids === ''}
                onChange={(e) => handleFilterChange('hasBids', e.target.value)}
                className="rounded"
              />
              <span className="text-sm">All Lots</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="bids"
                value="true"
                checked={filters.hasBids === 'true'}
                onChange={(e) => handleFilterChange('hasBids', e.target.value)}
                className="rounded"
              />
              <span className="text-sm">Has Bids</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="bids"
                value="false"
                checked={filters.hasBids === 'false'}
                onChange={(e) => handleFilterChange('hasBids', e.target.value)}
                className="rounded"
              />
              <span className="text-sm">No Bids</span>
            </label>
          </div>
        </div>

        {/* Reserve Status */}
        <div>
          <label className="block text-sm font-bold text-gray-900 mb-3">
            Reserve Status
          </label>
          <div className="space-y-2">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="reserve"
                value=""
                checked={filters.reserveMet === ''}
                onChange={(e) => handleFilterChange('reserveMet', e.target.value)}
                className="rounded"
              />
              <span className="text-sm">All Lots</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="reserve"
                value="true"
                checked={filters.reserveMet === 'true'}
                onChange={(e) => handleFilterChange('reserveMet', e.target.value)}
                className="rounded"
              />
              <span className="text-sm">Reserve Met</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="reserve"
                value="false"
                checked={filters.reserveMet === 'false'}
                onChange={(e) => handleFilterChange('reserveMet', e.target.value)}
                className="rounded"
              />
              <span className="text-sm">Reserve Not Met</span>
            </label>
          </div>
        </div>

        {/* Featured */}
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={filters.featured}
            onChange={(e) => handleFilterChange('featured', e.target.checked)}
            className="rounded"
          />
          <span className="text-sm font-medium">Featured Only</span>
        </label>
      </div>
    </div>
  )
}
