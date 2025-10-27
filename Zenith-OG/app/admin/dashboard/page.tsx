'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface DashboardStats {
  totalUsers: number
  totalAdmins: number
  totalProducts: number
  totalOrders: number
  recentSignins: number
  activeUsers: number
}

interface RecentActivity {
  id: string
  type: 'signin' | 'audit'
  adminEmail: string
  adminName: string
  action: string
  createdAt: string
  ipAddress?: string
  userAgent?: string
}

interface SigninLog {
  id: string
  adminId: string
  adminEmail: string
  adminName: string
  ipAddress: string
  userAgent: string | null
  location: string | null
  signInAt: string
}

export default function AdminDashboard() {
  const router = useRouter()
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([])
  const [signinLogs, setSigninLogs] = useState<SigninLog[]>([])
  const [showSigninLogbook, setShowSigninLogbook] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('auth-token')
      if (!token) {
        router.push('/login')
        return
      }

      // Fetch dashboard stats and recent activity
      const [statsRes, actionsRes, signinRes] = await Promise.all([
        fetch('/api/admin/dashboard/stats', {
          headers: { Authorization: `Bearer ${token}` }
        }),
        fetch('/api/admin/audit/actions?limit=10', {
          headers: { Authorization: `Bearer ${token}` }
        }),
        fetch('/api/admin/audit/signins?limit=10', {
          headers: { Authorization: `Bearer ${token}` }
        })
      ])

      if (!statsRes.ok || !actionsRes.ok || !signinRes.ok) {
        throw new Error('Failed to fetch dashboard data')
      }

      const statsData = await statsRes.json()
      const actionsData = await actionsRes.json()
      const signinData = await signinRes.json()

      setStats(statsData.stats)
      
      setRecentActivity(actionsData.logs.map((log: any) => ({
        id: log.id,
        type: 'audit' as const,
        adminEmail: log.adminEmail,
        adminName: log.adminName,
        action: log.action,
        createdAt: log.createdAt,
        ipAddress: log.ipAddress,
        userAgent: log.userAgent
      })))
      
      setSigninLogs(signinData.logs)
    } catch (error) {
      console.error('Dashboard error:', error)
      setError('Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">{error}</p>
          <button
            onClick={fetchDashboardData}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600">Zenith Student Marketplace</p>
            </div>
            <nav className="flex space-x-4">
              <Link
                href="/admin/users"
                className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-md"
              >
                Manage Users
              </Link>
              <Link
                href="/admin/logs"
                className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-md"
              >
                Activity Logs
              </Link>
              <Link
                href="/"
                className="px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-md"
              >
                Back to Site
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-bold">U</span>
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600">Total Users</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-bold">A</span>
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600">Total Admins</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalAdmins}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-bold">P</span>
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600">Total Products</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalProducts}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-bold">O</span>
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600">Total Orders</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalOrders}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">Recent Admin Activity</h3>
            <button
              onClick={() => setShowSigninLogbook(!showSigninLogbook)}
              className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200"
            >
              {showSigninLogbook ? 'Show Actions' : 'Show Sign-in Logbook'}
            </button>
          </div>
          <div className="divide-y divide-gray-200">
            {showSigninLogbook ? (
              // Sign-in Logbook
              signinLogs.length > 0 ? (
                signinLogs.map((signin) => (
                  <div key={signin.id} className="px-6 py-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-2 h-2 rounded-full mr-3 bg-green-400"></div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {signin.adminName} ({signin.adminEmail})
                          </p>
                          <p className="text-sm text-gray-600">
                            Signed in from {signin.ipAddress}
                            {signin.userAgent && (
                              <span className="ml-2 text-xs text-gray-400">
                                {signin.userAgent.split(' ')[0]}
                              </span>
                            )}
                          </p>
                        </div>
                      </div>
                      <div className="text-sm text-gray-500">
                        {new Date(signin.signInAt).toLocaleDateString()} {' '}
                        {new Date(signin.signInAt).toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="px-6 py-8 text-center text-gray-500">
                  No sign-in logs found
                </div>
              )
            ) : (
              // Recent Actions
              recentActivity.length > 0 ? (
                recentActivity.map((activity) => (
                  <div key={activity.id} className="px-6 py-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-2 h-2 rounded-full mr-3 bg-blue-400"></div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {activity.adminName} ({activity.adminEmail})
                          </p>
                          <p className="text-sm text-gray-600">{activity.action}</p>
                          {activity.ipAddress && (
                            <p className="text-xs text-gray-400">From {activity.ipAddress}</p>
                          )}
                        </div>
                      </div>
                      <div className="text-sm text-gray-500">
                        {new Date(activity.createdAt).toLocaleDateString()} {' '}
                        {new Date(activity.createdAt).toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="px-6 py-8 text-center text-gray-500">
                  No recent activity found
                </div>
              )
            )}
          </div>
          <div className="px-6 py-4 border-t border-gray-200 flex justify-between">
            <Link
              href={showSigninLogbook ? "/admin/logs?type=signin" : "/admin/logs?type=audit"}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              View all {showSigninLogbook ? 'sign-in logs' : 'activity logs'} →
            </Link>
            <Link
              href="/admin/logs"
              className="text-gray-600 hover:text-gray-800 text-sm font-medium"
            >
              View all logs →
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}