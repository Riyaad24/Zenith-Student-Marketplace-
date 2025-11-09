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

interface AdminInfo {
  firstName: string | null
  lastName: string | null
  email: string
  studentNumber: string | null
}

export default function AdminDashboard() {
  const router = useRouter()
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([])
  const [signinLogs, setSigninLogs] = useState<SigninLog[]>([])
  const [showSigninLogbook, setShowSigninLogbook] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [adminInfo, setAdminInfo] = useState<AdminInfo | null>(null)

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

      // Fetch dashboard stats, recent activity, and admin info
      const [statsRes, actionsRes, signinRes, adminRes] = await Promise.all([
        fetch('/api/admin/dashboard/stats', {
          headers: { Authorization: `Bearer ${token}` }
        }),
        fetch('/api/admin/audit/actions?limit=10', {
          headers: { Authorization: `Bearer ${token}` }
        }),
        fetch('/api/admin/audit/signins?limit=10', {
          headers: { Authorization: `Bearer ${token}` }
        }),
        fetch('/api/admin/me', {
          headers: { Authorization: `Bearer ${token}` }
        })
      ])

      if (!statsRes.ok || !actionsRes.ok || !signinRes.ok) {
        if (statsRes.status === 403 || statsRes.status === 401) {
          setError('Session expired. Please log in again.')
          setTimeout(() => router.push('/login'), 2000)
          return
        }
        throw new Error('Failed to fetch dashboard data')
      }

      const statsData = await statsRes.json()
      const actionsData = await actionsRes.json()
      const signinData = await signinRes.json()
      const adminData = adminRes.ok ? await adminRes.json() : null

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
      
      if (adminData) {
        setAdminInfo(adminData.admin)
      }
      
      setError(null)
    } catch (error) {
      console.error('Dashboard error:', error)
      setError('Unable to load dashboard data. Please try again.')
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
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-red-600 text-2xl">⚠</span>
          </div>
          <h2 className="text-xl font-semibold text-gray-700 mb-2">{error}</h2>
          <p className="text-gray-500 mb-6">
            We encountered an issue loading the dashboard. Please check your connection and try again.
          </p>
          <button
            onClick={fetchDashboardData}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
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
            <div className="flex items-center space-x-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
                <p className="text-gray-600">Zenith Student Marketplace</p>
              </div>
              {adminInfo && (
                <div className="flex items-center bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-lg shadow-lg">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                  <div className="flex flex-col">
                    <span className="text-xs font-semibold uppercase tracking-wide opacity-90">Administrator</span>
                    <span className="font-bold text-sm">
                      {adminInfo.firstName} {adminInfo.lastName}
                    </span>
                  </div>
                  <span className="ml-3 bg-white/20 px-2 py-1 rounded text-xs font-mono">
                    #{adminInfo.studentNumber}
                  </span>
                </div>
              )}
            </div>
            <nav className="flex space-x-4">
              <Link
                href="/admin/users"
                className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-md"
              >
                Manage Users
              </Link>
              <Link
                href="/admin/tutors"
                className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-md"
              >
                Tutor Verification
              </Link>
              <Link
                href="/admin/reports"
                className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-md"
              >
                Reports
              </Link>
              <Link
                href="/admin/notifications"
                className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-md relative"
              >
                Notifications
                {stats && (stats.totalUsers > 0) && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    !
                  </span>
                )}
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