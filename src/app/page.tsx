import { Metadata } from 'next'
import { apiCall } from '@/lib/api'
import { AuctionGrid } from '@/components/auction/AuctionCard'
import { SearchBar } from '@/components/common/SearchBar'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export const metadata: Metadata = {
  title: 'McMaster & Paul Auctions - Online Auction Platform Canada',
  description:
    'Canada\'s leading online auction platform. Buy and sell items through live auctions. Browse auctions by category.',
  keywords: [
    'auctions',
    'online auction',
    'live auction',
    'buy',
    'sell',
    'Canada',
    'auction platform',
  ],
}

async function getAuctions() {
  try {
    const data = await apiCall('/api/auctions', {
      params: { limit: 6, featured: true },
    })
    return data.data
  } catch (error) {
    console.error('Failed to fetch auctions:', error)
    return []
  }
}

export default async function HomePage() {
  const auctions = await getAuctions()

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg p-8 md:p-16 text-white">
        <div className="max-w-3xl">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Welcome to McMaster & Paul Auctions
          </h1>
          <p className="text-lg md:text-xl mb-8 text-blue-100">
            Canada's most trusted online auction platform for buying and selling quality items.
            Browse thousands of lots across multiple categories.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/auctions?status=active"
              className="inline-flex items-center justify-center bg-white text-blue-600 font-bold px-8 py-3 rounded-lg hover:bg-blue-50 transition-colors"
            >
              Browse Active Auctions
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
            <Link
              href="/about"
              className="inline-flex items-center justify-center border-2 border-white text-white font-bold px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section className="bg-white rounded-lg p-8">
        <h2 className="text-2xl font-bold mb-6">Find Your Next Item</h2>
        <SearchBar />
      </section>

      {/* Featured Auctions */}
      {auctions.length > 0 && (
        <section>
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">Featured Auctions</h2>
            <Link
              href="/auctions"
              className="text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-2"
            >
              View All Auctions
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
          <AuctionGrid auctions={auctions} />
        </section>
      )}

      {/* Features Section */}
      <section className="bg-white rounded-lg p-8 md:p-12">
        <h2 className="text-3xl font-bold mb-12 text-center">Why Choose Us</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-blue-600">🏆</span>
            </div>
            <h3 className="font-bold text-lg mb-2">Trusted Platform</h3>
            <p className="text-gray-600">
              Over 10+ years of auction experience. Thousands of satisfied buyers and sellers.
            </p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-blue-600">⚡</span>
            </div>
            <h3 className="font-bold text-lg mb-2">Real-Time Bidding</h3>
            <p className="text-gray-600">
              Live auction updates, instant bid notifications, and automatic bidding.
            </p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-blue-600">🔒</span>
            </div>
            <h3 className="font-bold text-lg mb-2">Secure Transactions</h3>
            <p className="text-gray-600">
              Encrypted payments, secure checkout, and buyer protection guarantee.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 text-white rounded-lg p-8 md:p-12 text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
        <p className="text-lg mb-8 text-blue-100">
          Join thousands of buyers and sellers on Canada's largest online auction platform.
        </p>
        <Link
          href="/register"
          className="inline-block bg-white text-blue-600 font-bold px-8 py-3 rounded-lg hover:bg-blue-50 transition-colors"
        >
          Create Your Account Today
        </Link>
      </section>
    </div>
  )
}
