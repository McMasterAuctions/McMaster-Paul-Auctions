'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { apiCall } from '@/lib/api'
import { Auction } from '@/types'
import Link from 'next/link'
import { Plus, Edit, Trash2 } from 'lucide-react'

export default function AdminAuctionsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [auctions, setAuctions] = useState<Auction[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
      return
    }

    if (session?.user?.role !== 'ADMIN') {
      router.push('/')
      return
    }

    fetchAuctions()
  }, [status, session, router])

  const fetchAuctions = async () => {
    try {
      const data = await apiCall('/api/auctions', { params: { limit: 100 } })
      setAuctions(data.data)
    } catch (error) {
      console.error('Failed to fetch auctions:', error)
    } finally {
      setLoading(false)
    }
  }

  if (status === 'loading' || loading) {
    return <div>Loading...</div>
  }

  if (session?.user?.role !== 'ADMIN') {
    return null
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold">Manage Auctions</h1>
          <p className="text-gray-600">View and manage all auctions</p>
        </div>
        <Link
          href="/admin/auctions/new"
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium"
        >
          <Plus className="w-5 h-5" />
          New Auction
        </Link>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                Title
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                Status
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                Location
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                Start Date
              </th>
              <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {auctions.map((auction) => (
              <tr key={auction.id} className="border-b border-gray-200 hover:bg-gray-50">
                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                  {auction.title}
                </td>
                <td className="px-6 py-4 text-sm">
                  <span className="px-2 py-1 rounded text-xs font-semibold bg-blue-100 text-blue-800">
                    {auction.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">{auction.location}</td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {new Date(auction.startDate).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 text-right text-sm space-x-2">
                  <Link
                    href={`/admin/auctions/${auction.id}/edit`}
                    className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700"
                  >
                    <Edit className="w-4 h-4" />
                    Edit
                  </Link>
                  <button className="inline-flex items-center gap-1 text-red-600 hover:text-red-700">
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
