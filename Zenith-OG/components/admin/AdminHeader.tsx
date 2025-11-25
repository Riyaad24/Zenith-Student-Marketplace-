'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface AdminInfo {
  firstName: string | null
  lastName: string | null
  email: string
  studentNumber: string | null
}

interface AdminHeaderProps {
  title: string
  subtitle?: string
  showBackToDashboard?: boolean
}

export default function AdminHeader({ title, subtitle, showBackToDashboard = false }: AdminHeaderProps) {
  const router = useRouter()
  const [adminInfo, setAdminInfo] = useState<AdminInfo | null>(null)

  useEffect(() => {
    fetchAdminInfo()
  }, [])

  const fetchAdminInfo = async () => {
    try {
      const token = localStorage.getItem('auth-token')
      if (!token) {
        router.push('/login')
        return
      }

      const response = await fetch('/api/admin/me', {
        headers: { Authorization: `Bearer ${token}` }
      })

      if (response.ok) {
        const data = await response.json()
        setAdminInfo(data.admin)
      }
    } catch (error) {
      console.error('Failed to fetch admin info:', error)
    }
  }

  return (
    <header className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-6">
          <div className="flex items-center space-x-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
              {subtitle && <p className="text-gray-600">{subtitle}</p>}
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
          {showBackToDashboard && (
            <Link
              href="/admin/dashboard"
              className="px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-md border border-gray-300"
            >
              ← Back to Dashboard
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}
