'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import AdminHeader from '@/components/admin/AdminHeader'
import { 
  Bell, CheckCircle, XCircle, Clock, AlertTriangle,
  User, MessageSquare, Mail, Calendar, Building2
} from 'lucide-react'

interface NotificationsData {
  notifications: {
    pendingVerifications: Array<{
      type: string
      id: string
      userName: string
      email: string
      university: string
      submittedAt: string
      hasDocuments: {
        profilePicture: boolean
        studentCard: boolean
        idDocument: boolean
      }
    }>
    pendingProducts: Array<{
      type: string
      id: string
      title: string
      price: number
      sellerName: string
      sellerEmail: string
      category: string
      condition: string
      submittedAt: string
      image: string | null
    }>
    supportMessages: {
      urgent: Array<SupportMessage>
      high: Array<SupportMessage>
      normal: Array<SupportMessage>
      low: Array<SupportMessage>
    }
    summary: {
      totalPendingVerifications: number
      totalPendingProducts: number
      totalSupportMessages: number
      urgentCount: number
      highCount: number
      normalCount: number
      lowCount: number
    }
  }
}

interface SupportMessage {
  type: string
  id: string
  subject: string
  name: string
  email: string
  category: string
  priority: string
  message: string
  createdAt: string
  read: boolean
}

export default function AdminNotificationsPage() {
  const router = useRouter()
  const [notifications, setNotifications] = useState<NotificationsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'verifications' | 'listings' | 'support'>('verifications')

  useEffect(() => {
    fetchNotifications()
  }, [])

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem('auth-token')
      if (!token) {
        router.push('/login')
        return
      }

      const response = await fetch('/api/admin/notifications', {
        headers: { Authorization: `Bearer ${token}` }
      })

      if (!response.ok) {
        if (response.status === 403 || response.status === 401) {
          setError('Session expired. Please log in again.')
          setTimeout(() => router.push('/login'), 2000)
          return
        }
        throw new Error('Failed to fetch notifications')
      }

      const data = await response.json()
      setNotifications(data)
      setError(null)
    } catch (error) {
      console.error('Notifications error:', error)
      setError('Unable to load notifications. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyUser = (userId: string) => {
    router.push(`/admin/users/${userId}`)
  }

  const handleViewSupport = (messageId: string) => {
    router.push(`/admin/support/${messageId}`)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading notifications...</p>
        </div>
      </div>
    )
  }

  if (error || !notifications) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-700 mb-2">
            {error || 'No Notifications Available'}
          </h2>
          <p className="text-gray-500 mb-6">
            {error 
              ? 'We encountered an issue loading notifications. Please check your connection and try again.' 
              : 'There are no notifications at this time.'}
          </p>
          <button
            onClick={fetchNotifications}
            className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  const { summary, pendingVerifications, pendingProducts, supportMessages } = notifications.notifications

  const allSupportMessages = [
    ...supportMessages.urgent,
    ...supportMessages.high,
    ...supportMessages.normal,
    ...supportMessages.low
  ]

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800 border-red-300'
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-300'
      case 'normal': return 'bg-blue-100 text-blue-800 border-blue-300'
      case 'low': return 'bg-gray-100 text-gray-800 border-gray-300'
      default: return 'bg-gray-100 text-gray-800 border-gray-300'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <AdminHeader 
        title="Admin Notifications" 
        subtitle="Manage pending verifications and support requests"
        showBackToDashboard={true}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending Verifications</p>
                <p className="text-3xl font-bold text-purple-600">{summary.totalPendingVerifications}</p>
              </div>
              <User className="h-10 w-10 text-purple-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Listing Approvals</p>
                <p className="text-3xl font-bold text-blue-600">{summary.totalPendingProducts || 0}</p>
              </div>
              <MessageSquare className="h-10 w-10 text-blue-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Urgent Support</p>
                <p className="text-3xl font-bold text-red-600">{summary.urgentCount}</p>
              </div>
              <AlertTriangle className="h-10 w-10 text-red-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">High Priority</p>
                <p className="text-3xl font-bold text-orange-600">{summary.highCount}</p>
              </div>
              <Clock className="h-10 w-10 text-orange-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Support</p>
                <p className="text-3xl font-bold text-blue-600">{summary.totalSupportMessages}</p>
              </div>
              <MessageSquare className="h-10 w-10 text-blue-500" />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6 border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('verifications')}
              className={`
                py-4 px-1 border-b-2 font-medium text-sm
                ${activeTab === 'verifications'
                  ? 'border-purple-500 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }
              `}
            >
              User Verifications
              {summary.totalPendingVerifications > 0 && (
                <span className="ml-2 bg-purple-100 text-purple-600 py-0.5 px-2.5 rounded-full text-xs font-medium">
                  {summary.totalPendingVerifications}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('listings')}
              className={`
                py-4 px-1 border-b-2 font-medium text-sm
                ${activeTab === 'listings'
                  ? 'border-purple-500 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }
              `}
            >
              Listing Approvals
              {summary.totalPendingProducts > 0 && (
                <span className="ml-2 bg-blue-100 text-blue-600 py-0.5 px-2.5 rounded-full text-xs font-medium">
                  {summary.totalPendingProducts}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('support')}
              className={`
                py-4 px-1 border-b-2 font-medium text-sm
                ${activeTab === 'support'
                  ? 'border-purple-500 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }
              `}
            >
              Support Messages
              {summary.totalSupportMessages > 0 && (
                <span className="ml-2 bg-red-100 text-red-600 py-0.5 px-2.5 rounded-full text-xs font-medium">
                  {summary.totalSupportMessages}
                </span>
              )}
            </button>
          </nav>
        </div>

        {/* Content */}
        {activeTab === 'verifications' ? (
          <div className="space-y-4">
            {pendingVerifications.length === 0 ? (
              <div className="bg-white rounded-lg shadow p-12 text-center">
                <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">All Caught Up!</h3>
                <p className="text-gray-600">No pending user verifications at the moment.</p>
              </div>
            ) : (
              pendingVerifications.map((verification) => (
                <div key={verification.id} className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <User className="h-5 w-5 text-purple-600 mr-2" />
                        <h3 className="text-lg font-semibold text-gray-900">{verification.userName}</h3>
                        <span className="ml-3 px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                          Pending Verification
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        <div className="flex items-center text-sm text-gray-600">
                          <Mail className="h-4 w-4 mr-2" />
                          {verification.email}
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <Building2 className="h-4 w-4 mr-2" />
                          {verification.university || 'Not specified'}
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <Calendar className="h-4 w-4 mr-2" />
                          Submitted: {new Date(verification.submittedAt).toLocaleDateString()}
                        </div>
                      </div>

                      <div className="mt-4">
                        <p className="text-sm font-medium text-gray-700 mb-2">Uploaded Documents:</p>
                        <div className="flex flex-wrap gap-2">
                          <span className={`px-3 py-1 text-xs rounded-full ${
                            verification.hasDocuments.profilePicture 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-gray-100 text-gray-600'
                          }`}>
                            {verification.hasDocuments.profilePicture ? '✓' : '✗'} Profile Picture
                          </span>
                          <span className={`px-3 py-1 text-xs rounded-full ${
                            verification.hasDocuments.studentCard 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-gray-100 text-gray-600'
                          }`}>
                            {verification.hasDocuments.studentCard ? '✓' : '✗'} Student Card
                          </span>
                          <span className={`px-3 py-1 text-xs rounded-full ${
                            verification.hasDocuments.idDocument 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-gray-100 text-gray-600'
                          }`}>
                            {verification.hasDocuments.idDocument ? '✓' : '✗'} ID Document
                          </span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => handleVerifyUser(verification.id)}
                      className="ml-4 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
                    >
                      Review & Verify
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        ) : activeTab === 'listings' ? (
          <div className="space-y-4">
            {pendingProducts.length === 0 ? (
              <div className="bg-white rounded-lg shadow p-12 text-center">
                <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">All Caught Up!</h3>
                <p className="text-gray-600">No pending product listings at the moment.</p>
              </div>
            ) : (
              <>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Pending Product Listings ({pendingProducts.length})
                  </h3>
                  <a
                    href="/admin/products"
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    View All Products →
                  </a>
                </div>
                {pendingProducts.map((product) => (
                  <div key={product.id} className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-start gap-4">
                      {/* Product Image */}
                      <div className="w-24 h-24 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
                        {product.image ? (
                          <img 
                            src={product.image} 
                            alt={product.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">
                            <MessageSquare className="h-8 w-8" />
                          </div>
                        )}
                      </div>

                      {/* Product Details */}
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">{product.title}</h3>
                            <p className="text-2xl font-bold text-blue-600 mt-1">R{product.price.toFixed(2)}</p>
                          </div>
                          <span className="px-3 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800 border border-yellow-300">
                            PENDING APPROVAL
                          </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
                          <div className="flex items-center text-sm text-gray-600">
                            <User className="h-4 w-4 mr-2" />
                            <span className="font-medium">Seller:</span>
                            <span className="ml-1">{product.sellerName}</span>
                          </div>
                          <div className="flex items-center text-sm text-gray-600">
                            <Mail className="h-4 w-4 mr-2" />
                            {product.sellerEmail}
                          </div>
                          <div className="flex items-center text-sm text-gray-600">
                            <span className="font-medium">Category:</span>
                            <span className="ml-1">{product.category}</span>
                          </div>
                          <div className="flex items-center text-sm text-gray-600">
                            <span className="font-medium">Condition:</span>
                            <span className="ml-1 capitalize">{product.condition}</span>
                          </div>
                        </div>

                        <div className="flex items-center text-sm text-gray-500 mt-3">
                          <Calendar className="h-4 w-4 mr-2" />
                          Submitted: {new Date(product.submittedAt).toLocaleDateString('en-ZA', { 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          })}
                        </div>
                      </div>

                      {/* Action Button */}
                      <a
                        href={`/admin/products?highlight=${product.id}`}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors whitespace-nowrap"
                      >
                        Review Product
                      </a>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {allSupportMessages.length === 0 ? (
              <div className="bg-white rounded-lg shadow p-12 text-center">
                <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">All Caught Up!</h3>
                <p className="text-gray-600">No pending support messages at the moment.</p>
              </div>
            ) : (
              allSupportMessages.map((message) => (
                <div key={message.id} className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <MessageSquare className="h-5 w-5 text-blue-600 mr-2" />
                        <h3 className="text-lg font-semibold text-gray-900">{message.subject}</h3>
                        <span className={`ml-3 px-2 py-1 text-xs rounded-full border ${getPriorityColor(message.priority)}`}>
                          {message.priority.toUpperCase()}
                        </span>
                        {!message.read && (
                          <span className="ml-2 w-2 h-2 bg-red-500 rounded-full"></span>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                        <div className="flex items-center text-sm text-gray-600">
                          <User className="h-4 w-4 mr-2" />
                          {message.name}
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <Mail className="h-4 w-4 mr-2" />
                          {message.email}
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <Calendar className="h-4 w-4 mr-2" />
                          {new Date(message.createdAt).toLocaleDateString()}
                        </div>
                      </div>

                      <div className="mt-4">
                        <p className="text-sm text-gray-700 line-clamp-2">{message.message}</p>
                      </div>

                      <div className="mt-3">
                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                          Category: {message.category}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleViewSupport(message.id)}
                      className="ml-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                    >
                      View & Respond
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </main>
    </div>
  )
}
