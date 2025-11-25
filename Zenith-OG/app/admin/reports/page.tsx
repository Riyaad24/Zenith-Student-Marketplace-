'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import AdminHeader from '@/components/admin/AdminHeader'
import { 
  Users, Package, ShoppingCart, TrendingUp, 
  AlertCircle, MessageSquare, Star, Calendar,
  ArrowUp, ArrowDown
} from 'lucide-react'

interface ReportsData {
  overview: {
    users: {
      total: number
      last30Days: number
      last7Days: number
      today: number
      growth: Array<{ date: Date; count: number }>
    }
    products: {
      total: number
      last30Days: number
      active: number
      categoryBreakdown: Array<{ category: string; count: number }>
    }
    orders: {
      total: number
      last30Days: number
      totalRevenue: number
    }
    engagement: {
      totalMessages: number
      messagesLast7Days: number
      totalReviews: number
      averageRating: number
    }
    pending: {
      verifications: number
      supportMessages: number
    }
    topSellers: Array<{
      sellerId: string
      userName: string
      email: string
      _count: { sellerId: number }
    }>
    recentActivities: Array<{
      id: string
      action: string
      targetType: string
      adminName: string
      createdAt: string
    }>
  }
}

export default function AdminReportsPage() {
  const router = useRouter()
  const [reports, setReports] = useState<ReportsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchReports()
  }, [])

  const fetchReports = async () => {
    try {
      const token = localStorage.getItem('auth-token')
      if (!token) {
        router.push('/login')
        return
      }

      const response = await fetch('/api/admin/reports/overview', {
        headers: { Authorization: `Bearer ${token}` }
      })

      if (!response.ok) {
        if (response.status === 403 || response.status === 401) {
          setError('Session expired. Please log in again.')
          setTimeout(() => router.push('/login'), 2000)
          return
        }
        throw new Error('Failed to fetch reports')
      }

      const data = await response.json()
      setReports(data)
      setError(null)
    } catch (error) {
      console.error('Reports error:', error)
      setError('Unable to load reports data. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading reports...</p>
        </div>
      </div>
    )
  }

  if (error || !reports) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-700 mb-2">
            {error || 'No Reports Available'}
          </h2>
          <p className="text-gray-500 mb-6">
            {error 
              ? 'We encountered an issue loading the reports. Please check your connection and try again.' 
              : 'Report data is currently unavailable.'}
          </p>
          <button
            onClick={fetchReports}
            className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  const { overview } = reports

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <AdminHeader 
        title="Website Reports & Analytics" 
        subtitle="Comprehensive overview of platform performance"
        showBackToDashboard={true}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Alert Section */}
        {(overview.pending.verifications > 0 || overview.pending.supportMessages > 0) && (
          <div className="mb-6 bg-yellow-50 border-l-4 border-yellow-400 p-4">
            <div className="flex">
              <AlertCircle className="h-5 w-5 text-yellow-400" />
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800">Action Required</h3>
                <div className="mt-2 text-sm text-yellow-700">
                  <ul className="list-disc list-inside space-y-1">
                    {overview.pending.verifications > 0 && (
                      <li>{overview.pending.verifications} user(s) awaiting verification</li>
                    )}
                    {overview.pending.supportMessages > 0 && (
                      <li>{overview.pending.supportMessages} unread support message(s)</li>
                    )}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Users */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Users</p>
                <p className="text-3xl font-bold text-gray-900">{overview.users.total}</p>
                <div className="flex items-center mt-2 text-sm">
                  <ArrowUp className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-green-600">+{overview.users.last7Days} this week</span>
                </div>
              </div>
              <Users className="h-12 w-12 text-blue-500" />
            </div>
          </div>

          {/* Total Products */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Products</p>
                <p className="text-3xl font-bold text-gray-900">{overview.products.total}</p>
                <p className="text-sm text-gray-500 mt-2">{overview.products.active} active</p>
              </div>
              <Package className="h-12 w-12 text-purple-500" />
            </div>
          </div>

          {/* Total Orders */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Orders</p>
                <p className="text-3xl font-bold text-gray-900">{overview.orders.total}</p>
                <p className="text-sm text-gray-500 mt-2">+{overview.orders.last30Days} this month</p>
              </div>
              <ShoppingCart className="h-12 w-12 text-green-500" />
            </div>
          </div>

          {/* Total Revenue */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Revenue</p>
                <p className="text-3xl font-bold text-gray-900">
                  R{overview.orders.totalRevenue.toLocaleString()}
                </p>
                <p className="text-sm text-gray-500 mt-2">All time</p>
              </div>
              <TrendingUp className="h-12 w-12 text-orange-500" />
            </div>
          </div>
        </div>

        {/* User Growth & Engagement */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* User Growth */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Calendar className="h-5 w-5 mr-2 text-blue-500" />
              User Growth (30 Days)
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">New users today:</span>
                <span className="font-semibold text-blue-600">{overview.users.today}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Last 7 days:</span>
                <span className="font-semibold text-blue-600">{overview.users.last7Days}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Last 30 days:</span>
                <span className="font-semibold text-blue-600">{overview.users.last30Days}</span>
              </div>
            </div>
          </div>

          {/* Engagement Metrics */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <MessageSquare className="h-5 w-5 mr-2 text-purple-500" />
              User Engagement
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Total Messages:</span>
                <span className="font-semibold text-purple-600">{overview.engagement.totalMessages}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Messages (7 days):</span>
                <span className="font-semibold text-purple-600">{overview.engagement.messagesLast7Days}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Total Reviews:</span>
                <span className="font-semibold text-purple-600">{overview.engagement.totalReviews}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Avg Rating:</span>
                <span className="font-semibold text-yellow-600 flex items-center">
                  <Star className="h-4 w-4 fill-current mr-1" />
                  {overview.engagement.averageRating.toFixed(1)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Category Breakdown & Top Sellers */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Product Categories */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Product Categories</h3>
            <div className="space-y-3">
              {overview.products.categoryBreakdown.slice(0, 6).map((cat, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="text-sm text-gray-700">{cat.category}</span>
                  <div className="flex items-center">
                    <div className="w-32 h-2 bg-gray-200 rounded-full mr-3">
                      <div
                        className="h-2 bg-purple-500 rounded-full"
                        style={{
                          width: `${(cat.count / overview.products.total) * 100}%`
                        }}
                      />
                    </div>
                    <span className="font-semibold text-gray-900 w-12 text-right">{cat.count}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Sellers */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Sellers</h3>
            <div className="space-y-3">
              {overview.topSellers.map((seller, index) => (
                <div key={seller.sellerId} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="font-bold text-gray-400 mr-3">#{index + 1}</span>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{seller.userName}</p>
                      <p className="text-xs text-gray-500">{seller.email}</p>
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-semibold rounded-full">
                    {seller._count.sellerId} products
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Admin Activities */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Recent Admin Activities</h3>
          </div>
          <div className="divide-y divide-gray-200">
            {overview.recentActivities.map((activity) => (
              <div key={activity.id} className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-2 h-2 rounded-full mr-3 bg-purple-400"></div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{activity.adminName}</p>
                      <p className="text-sm text-gray-600">
                        {activity.action} - {activity.targetType}
                      </p>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">
                    {new Date(activity.createdAt).toLocaleDateString()} {' '}
                    {new Date(activity.createdAt).toLocaleTimeString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
