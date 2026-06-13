'use client'

import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { userApi } from '@/lib/api'
import { User } from '@/types'
import Link from 'next/link'
import { LogOut, Settings, Heart, Gavel } from 'lucide-react'

export default function AccountPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'profile' | 'bids' | 'purchases' | 'watchlist'>('profile')

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
      return
    }

    if (status === 'authenticated') {
      fetchUserProfile()
    }
  }, [status, router])

  const fetchUserProfile = async () => {
    try {
      const data = await userApi.profile()
      setUser(data)
    } catch (error) {
      console.error('Failed to fetch profile:', error)
    } finally {
      setLoading(false)
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!session?.user) {
    return null
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-4xl font-bold mb-2">My Account</h1>
          <p className="text-gray-600">{session.user.email}</p>
        </div>
        <button
          onClick={() => signOut({ redirect: true, callbackUrl: '/' })}
          className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium"
        >
          <LogOut className="w-5 h-5" />
          Sign Out
        </button>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex-1 px-6 py-4 font-medium border-b-2 transition-colors ${
              activeTab === 'profile'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            <Settings className="w-5 h-5 inline mr-2" />
            Profile
          </button>
          <button
            onClick={() => setActiveTab('bids')}
            className={`flex-1 px-6 py-4 font-medium border-b-2 transition-colors ${
              activeTab === 'bids'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            <Gavel className="w-5 h-5 inline mr-2" />
            Bidding History
          </button>
          <button
            onClick={() => setActiveTab('purchases')}
            className={`flex-1 px-6 py-4 font-medium border-b-2 transition-colors ${
              activeTab === 'purchases'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            <Gavel className="w-5 h-5 inline mr-2" />
            Purchases
          </button>
          <button
            onClick={() => setActiveTab('watchlist')}
            className={`flex-1 px-6 py-4 font-medium border-b-2 transition-colors ${
              activeTab === 'watchlist'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            <Heart className="w-5 h-5 inline mr-2" />
            Watchlist
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'profile' && user && (
            <ProfileTab user={user} onUpdate={fetchUserProfile} />
          )}
          {activeTab === 'bids' && <BidsTab />}
          {activeTab === 'purchases' && <PurchasesTab />}
          {activeTab === 'watchlist' && <WatchlistTab />}
        </div>
      </div>
    </div>
  )
}

function ProfileTab({ user, onUpdate }: { user: User; onUpdate: () => void }) {
  const [formData, setFormData] = useState(user)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await userApi.update(formData)
      setMessage('Profile updated successfully!')
      onUpdate()
      setTimeout(() => setMessage(''), 3000)
    } catch (error) {
      setMessage('Failed to update profile')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl">
      <form onSubmit={handleSubmit} className="space-y-4">
        {message && (
          <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded">
            {message}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name || ''}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email (Read-only)
            </label>
            <input
              type="email"
              value={formData.email}
              disabled
              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone || ''}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Address
            </label>
            <input
              type="text"
              name="address"
              value={formData.address || ''}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              City
            </label>
            <input
              type="text"
              name="city"
              value={formData.city || ''}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Province
            </label>
            <input
              type="text"
              name="province"
              value={formData.province || ''}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Postal Code
            </label>
            <input
              type="text"
              name="postalCode"
              value={formData.postalCode || ''}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 py-2 rounded-lg font-medium"
        >
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </div>
  )
}

function BidsTab() {
  const [bids, setBids] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchBids()
  }, [])

  const fetchBids = async () => {
    try {
      const data = await userApi.bidHistory()
      setBids(data.data || [])
    } catch (error) {
      console.error('Failed to fetch bids:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div>Loading...</div>
  if (bids.length === 0) return <p className="text-gray-600">No bids yet</p>

  return (
    <div className="space-y-4">
      {bids.map((bid: any) => (
        <div key={bid.id} className="border border-gray-200 rounded-lg p-4">
          <Link href={`/auctions/${bid.lot.auction.slug}/lots/${bid.lot.slug}`}>
            <h3 className="font-semibold text-blue-600 hover:text-blue-700">
              {bid.lot.title}
            </h3>
          </Link>
          <p className="text-sm text-gray-600 mt-1">Bid: ${bid.amount}</p>
        </div>
      ))}
    </div>
  )
}

function PurchasesTab() {
  const [purchases, setPurchases] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPurchases()
  }, [])

  const fetchPurchases = async () => {
    try {
      const data = await userApi.purchases()
      setPurchases(data.data || [])
    } catch (error) {
      console.error('Failed to fetch purchases:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div>Loading...</div>
  if (purchases.length === 0) return <p className="text-gray-600">No purchases yet</p>

  return (
    <div className="space-y-4">
      {purchases.map((purchase: any) => (
        <div key={purchase.id} className="border border-gray-200 rounded-lg p-4">
          <h3 className="font-semibold">{purchase.lot.title}</h3>
          <p className="text-sm text-gray-600 mt-1">Amount: ${purchase.amount}</p>
          <p className="text-sm text-gray-600">Status: {purchase.status}</p>
        </div>
      ))}
    </div>
  )
}

function WatchlistTab() {
  return (
    <div>
      <p className="text-gray-600">Watchlist feature coming soon</p>
    </div>
  )
}

function useEffect(effect: React.EffectCallback, deps?: React.DependencyList) {
  const React = require('react')
  return React.useEffect(effect, deps)
}
