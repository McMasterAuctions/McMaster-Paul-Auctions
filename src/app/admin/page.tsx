'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { BarChart3, Users, Package, Settings } from 'lucide-react'

export default function AdminDashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [stats, setStats] = useState({
    totalAuctions: 0,
    totalLots: 0,
    totalUsers: 0,
    totalBids: 0,
  })

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
      return
    }

    if (session?.user?.role !== 'ADMIN') {
      router.push('/')
      return
    }
  }, [status, session, router])

  if (status === 'loading') {
    return <div>Loading...</div>
  }

  if (session?.user?.role !== 'ADMIN') {
    return null
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-gray-600">Manage auctions, lots, and users</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard
          icon={<BarChart3 className="w-8 h-8" />}
          label="Auctions"
          value={stats.totalAuctions}
        />
        <StatCard
          icon={<Package className="w-8 h-8" />}
          label="Lots"
          value={stats.totalLots}
        />
        <StatCard
          icon={<Users className="w-8 h-8" />}
          label="Users"
          value={stats.totalUsers}
        />
        <StatCard
          icon={<BarChart3 className="w-8 h-8" />}
          label="Total Bids"
          value={stats.totalBids}
        />
      </div>

      {/* Actions */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-2xl font-bold mb-6">Management</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href="/admin/auctions"
            className="p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <h3 className="font-bold mb-2">Manage Auctions</h3>
            <p className="text-sm text-gray-600">Create, edit, and delete auctions</p>
          </Link>
          <Link
            href="/admin/lots"
            className="p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <h3 className="font-bold mb-2">Manage Lots</h3>
            <p className="text-sm text-gray-600">Upload and manage auction lots</p>
          </Link>
          <Link
            href="/admin/users"
            className="p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <h3 className="font-bold mb-2">Manage Users</h3>
            <p className="text-sm text-gray-600">View and manage user accounts</p>
          </Link>
        </div>
      </div>
    </div>
  )
}

function StatCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode
  label: string
  value: number
}) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm font-medium">{label}</p>
          <p className="text-3xl font-bold mt-2">{value}</p>
        </div>
        <div className="text-blue-600 opacity-20">{icon}</div>
      </div>
    </div>
  )
}
