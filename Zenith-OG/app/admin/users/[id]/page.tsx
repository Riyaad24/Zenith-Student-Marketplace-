'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { 
  ArrowLeft, User as UserIcon, Mail, Phone, MapPin, Calendar, 
  CheckCircle, XCircle, Shield, Package, ShoppingCart, 
  AlertTriangle, Trash2, Eye, EyeOff 
} from 'lucide-react'

interface UserDetail {
  id: string
  email: string
  firstName: string | null
  lastName: string | null
  university: string | null
  phone: string | null
  location: string | null
  bio: string | null
  verified: boolean
  profilePicture: string | null
  studentCardImage: string | null
  idDocumentImage: string | null
  documentsUploaded: boolean
  adminVerified: boolean
  verificationNotes: string | null
  verifiedAt: string | null
  isAdmin: boolean
  roles: string[]
  security: {
    lastLogin: string | null
    emailVerified: boolean
    accountLocked: boolean
    failedLoginAttempts: number
    lastPasswordChange: string | null
  } | null
  recentProducts: Array<{
    id: string
    title: string
    price: number
    status: string
    images: string[]
    createdAt: string
  }>
  recentOrders: Array<{
    id: string
    total: number
    status: string
    createdAt: string
  }>
  counts: {
    products: number
    orders: number
    reviews: number
    sentMessages: number
  }
  createdAt: string
  updatedAt: string
}

export default function UserDetailPage() {
  const router = useRouter()
  const params = useParams()
  const userId = params?.id as string

  const [user, setUser] = useState<UserDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showDeleteProductModal, setShowDeleteProductModal] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null)
  const [deletingProduct, setDeletingProduct] = useState(false)
  const [documentModal, setDocumentModal] = useState<{
    isOpen: boolean
    url: string | null
    title: string
    type: 'image' | 'pdf' | null
  }>({
    isOpen: false,
    url: null,
    title: '',
    type: null
  })
  const [verifying, setVerifying] = useState(false)
  const [sendingEmailVerification, setSendingEmailVerification] = useState(false)

  useEffect(() => {
    if (userId) {
      fetchUserDetail()
    }
  }, [userId])

  const fetchUserDetail = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem('auth-token')
      if (!token) {
        router.push('/login')
        return
      }

      const response = await fetch(`/api/admin/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      })

      if (!response.ok) {
        const err = await response.json().catch(() => null)
        if (response.status === 403) {
          setError('Unauthorized — please sign in as an admin')
          return
        }
        throw new Error(err?.error || 'Failed to fetch user details')
      }

      const data = await response.json()
      setUser(data.user)
    } catch (error) {
      console.error('Fetch user detail error:', error)
      setError(String((error as any)?.message || 'Failed to load user details'))
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteProduct = async (productId: string) => {
    try {
      setDeletingProduct(true)
      const token = localStorage.getItem('auth-token')
      
      const response = await fetch(`/api/admin/products/${productId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      })

      if (!response.ok) {
        const err = await response.json().catch(() => null)
        alert(err?.error || 'Failed to delete product')
        return
      }

      // Remove product from list
      setUser(prev => {
        if (!prev) return prev
        return {
          ...prev,
          recentProducts: prev.recentProducts.filter(p => p.id !== productId),
          counts: {
            ...prev.counts,
            products: prev.counts.products - 1
          }
        }
      })

      setShowDeleteProductModal(false)
      setSelectedProduct(null)
      alert('Product deleted successfully')
    } catch (error) {
      console.error('Delete product error:', error)
      alert('Failed to delete product')
    } finally {
      setDeletingProduct(false)
    }
  }

  const openDocumentModal = (url: string, title: string) => {
    const isPdf = url.toLowerCase().endsWith('.pdf')
    setDocumentModal({
      isOpen: true,
      url,
      title,
      type: isPdf ? 'pdf' : 'image'
    })
  }

  const closeDocumentModal = () => {
    setDocumentModal({
      isOpen: false,
      url: null,
      title: '',
      type: null
    })
  }

  const handleVerifyUser = async () => {
    if (!confirm('Are you sure you want to verify this user? This will mark their account as fully verified.')) {
      return
    }

    try {
      setVerifying(true)
      const token = localStorage.getItem('auth-token')
      
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...user,
          adminVerified: true,
          verificationNotes: user?.verificationNotes || 'Documents verified by admin'
        })
      })

      if (!response.ok) {
        const err = await response.json().catch(() => null)
        alert(err?.error || 'Failed to verify user')
        return
      }

      // Refresh user data
      await fetchUserDetail()
      alert('User verified successfully! Notification sent to user.')
    } catch (error) {
      console.error('Verify user error:', error)
      alert('Failed to verify user')
    } finally {
      setVerifying(false)
    }
  }

  const handleSendEmailVerification = async () => {
    if (!confirm('Send email verification link to user?')) {
      return
    }

    try {
      setSendingEmailVerification(true)
      const token = localStorage.getItem('auth-token')
      
      const response = await fetch(`/api/admin/users/${userId}/send-verification-email`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (!response.ok) {
        const err = await response.json().catch(() => null)
        alert(err?.error || 'Failed to send verification email')
        return
      }

      alert('Verification email sent successfully!')
    } catch (error) {
      console.error('Send verification email error:', error)
      alert('Failed to send verification email')
    } finally {
      setSendingEmailVerification(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading user details...</p>
        </div>
      </div>
    )
  }

  if (error || !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 text-lg">{error || 'User not found'}</p>
          <Link
            href="/admin/users"
            className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Back to Users
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div className="flex items-center">
              <Link
                href="/admin/users"
                className="mr-4 text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="h-6 w-6" />
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">User Details</h1>
                <p className="text-gray-600">{user.email}</p>
              </div>
            </div>
            <div className="flex space-x-3">
              {user.isAdmin && (
                <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-semibold flex items-center">
                  <Shield className="h-4 w-4 mr-1" />
                  Admin
                </span>
              )}
              <span
                className={`px-3 py-1 rounded-full text-sm font-semibold ${
                  user.verified
                    ? 'bg-green-100 text-green-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}
              >
                {user.verified ? 'Active' : 'Inactive'}
              </span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Profile Info */}
          <div className="lg:col-span-1 space-y-6">
            {/* Profile Picture & Basic Info */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-center">
                <div className="relative w-32 h-32 mx-auto mb-4">
                  {user.profilePicture ? (
                    <Image
                      src={user.profilePicture}
                      alt={`${user.firstName} ${user.lastName}`}
                      fill
                      className="rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center">
                      <UserIcon className="h-16 w-16 text-gray-400" />
                    </div>
                  )}
                </div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {user.firstName} {user.lastName}
                </h2>
                {user.university && (
                  <p className="text-gray-600 mt-1">{user.university}</p>
                )}
              </div>

              <div className="mt-6 space-y-3">
                <div className="flex items-center text-sm">
                  <Mail className="h-4 w-4 text-gray-400 mr-2" />
                  <span className="text-gray-600">{user.email}</span>
                </div>
                {user.phone && (
                  <div className="flex items-center text-sm">
                    <Phone className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-gray-600">{user.phone}</span>
                  </div>
                )}
                {user.location && (
                  <div className="flex items-center text-sm">
                    <MapPin className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-gray-600">{user.location}</span>
                  </div>
                )}
                <div className="flex items-center text-sm">
                  <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                  <span className="text-gray-600">
                    Joined {new Date(user.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              {user.bio && (
                <div className="mt-4 pt-4 border-t">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Bio</h3>
                  <p className="text-sm text-gray-600">{user.bio}</p>
                </div>
              )}
            </div>

            {/* Account Security */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Account Security</h3>
              {user.security ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Email Verified</span>
                    {user.security.emailVerified ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-500" />
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Account Locked</span>
                    {user.security.accountLocked ? (
                      <XCircle className="h-5 w-5 text-red-500" />
                    ) : (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Failed Login Attempts</span>
                    <span className="text-sm font-medium">{user.security.failedLoginAttempts || 0}</span>
                  </div>
                  {user.security.lastLogin && (
                    <div className="pt-2 border-t">
                      <span className="text-xs text-gray-500">Last Login</span>
                      <p className="text-sm text-gray-700">
                        {new Date(user.security.lastLogin).toLocaleString()}
                      </p>
                    </div>
                  )}
                  {!user.security.emailVerified && (
                    <div className="pt-3 border-t">
                      <button
                        onClick={handleSendEmailVerification}
                        disabled={sendingEmailVerification}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        {sendingEmailVerification ? (
                          <>
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Sending...
                          </>
                        ) : (
                          <>
                            <Mail className="h-4 w-4 mr-2" />
                            Send Verification Email
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-4 text-gray-500">
                  <p className="text-sm">No security information available</p>
                </div>
              )}
            </div>

            {/* Activity Stats */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Activity</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Package className="h-5 w-5 text-blue-500 mr-2" />
                    <span className="text-sm text-gray-600">Products Listed</span>
                  </div>
                  <span className="text-lg font-semibold">{user.counts.products}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <ShoppingCart className="h-5 w-5 text-green-500 mr-2" />
                    <span className="text-sm text-gray-600">Orders</span>
                  </div>
                  <span className="text-lg font-semibold">{user.counts.orders}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Documents & Products */}
          <div className="lg:col-span-2 space-y-6">
            {/* Verification Documents */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Verification Documents</h3>
                {user.adminVerified ? (
                  <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-semibold flex items-center">
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Verified
                  </span>
                ) : (
                  <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-semibold">
                    Pending Review
                  </span>
                )}
              </div>

              {user.verificationNotes && (
                <div className="mb-4 p-3 bg-blue-50 rounded-md">
                  <p className="text-sm text-blue-800">
                    <strong>Notes:</strong> {user.verificationNotes}
                  </p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Student Card */}
                <div className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-medium text-gray-700">Student Card</h4>
                  </div>
                  {user.studentCardImage ? (
                    <div 
                      onClick={() => openDocumentModal(user.studentCardImage!, 'Student Card')}
                      className="relative w-full h-48 cursor-pointer hover:opacity-90 transition-opacity group"
                    >
                      <Image
                        src={user.studentCardImage}
                        alt="Student Card"
                        fill
                        className="object-contain rounded"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all rounded flex items-center justify-center">
                        <Eye className="h-8 w-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </div>
                  ) : (
                    <div className="bg-gray-50 h-48 rounded flex items-center justify-center">
                      <p className="text-sm text-gray-400">Not uploaded</p>
                    </div>
                  )}
                  {user.studentCardImage && (
                    <p className="text-xs text-gray-500 text-center mt-2">Click to view full size</p>
                  )}
                </div>

                {/* ID Document */}
                <div className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-medium text-gray-700">ID Document</h4>
                  </div>
                  {user.idDocumentImage ? (
                    <div 
                      onClick={() => openDocumentModal(user.idDocumentImage!, 'ID Document')}
                      className="relative w-full h-48 cursor-pointer hover:opacity-90 transition-opacity group"
                    >
                      <Image
                        src={user.idDocumentImage}
                        alt="ID Document"
                        fill
                        className="object-contain rounded"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all rounded flex items-center justify-center">
                        <Eye className="h-8 w-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </div>
                  ) : (
                    <div className="bg-gray-50 h-48 rounded flex items-center justify-center">
                      <p className="text-sm text-gray-400">Not uploaded</p>
                    </div>
                  )}
                  {user.idDocumentImage && (
                    <p className="text-xs text-gray-500 text-center mt-2">Click to view full size</p>
                  )}
                </div>
              </div>

              {/* Verification Actions */}
              <div className="mt-6 pt-6 border-t space-y-3">
                {!user.adminVerified && user.documentsUploaded && (
                  <button
                    onClick={handleVerifyUser}
                    disabled={verifying}
                    className="w-full bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {verifying ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Verifying...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="h-5 w-5 mr-2" />
                        Verify User Documents
                      </>
                    )}
                  </button>
                )}
                {user.adminVerified && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                      <div>
                        <p className="text-sm font-medium text-green-800">User Verified</p>
                        {user.verifiedAt && (
                          <p className="text-xs text-green-600 mt-1">
                            Verified on {new Date(user.verifiedAt).toLocaleString()}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* User's Products */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Listed Products ({user.counts.products})
                </h3>
                <Link
                  href={`/admin/products?seller=${userId}`}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  View All
                </Link>
              </div>

              {user.recentProducts.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Package className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                  <p>No products listed</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {user.recentProducts.map((product) => (
                    <div
                      key={product.id}
                      className="border rounded-lg p-4 flex items-center justify-between hover:bg-gray-50"
                    >
                      <div className="flex items-center space-x-4">
                        {product.images && product.images[0] ? (
                          <div className="relative w-16 h-16">
                            <Image
                              src={product.images[0]}
                              alt={product.title}
                              fill
                              className="object-cover rounded"
                            />
                          </div>
                        ) : (
                          <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center">
                            <Package className="h-8 w-8 text-gray-400" />
                          </div>
                        )}
                        <div>
                          <h4 className="font-medium text-gray-900">{product.title}</h4>
                          <p className="text-sm text-gray-600">R {product.price.toFixed(2)}</p>
                          <div className="flex items-center space-x-2 mt-1">
                            <span
                              className={`text-xs px-2 py-0.5 rounded-full ${
                                product.status === 'active'
                                  ? 'bg-green-100 text-green-800'
                                  : product.status === 'sold'
                                  ? 'bg-blue-100 text-blue-800'
                                  : 'bg-gray-100 text-gray-800'
                              }`}
                            >
                              {product.status}
                            </span>
                            <span className="text-xs text-gray-500">
                              {new Date(product.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Link
                          href={`/product/${product.id}`}
                          className="px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded"
                        >
                          View
                        </Link>
                        <button
                          onClick={() => {
                            setSelectedProduct(product.id)
                            setShowDeleteProductModal(true)
                          }}
                          className="px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded flex items-center"
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Recent Orders */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Recent Orders ({user.counts.orders})
              </h3>

              {user.recentOrders.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <ShoppingCart className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                  <p>No orders yet</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {user.recentOrders.map((order) => (
                    <div
                      key={order.id}
                      className="border rounded-lg p-4 flex items-center justify-between"
                    >
                      <div>
                        <p className="font-medium text-gray-900">Order #{order.id.slice(0, 8)}</p>
                        <p className="text-sm text-gray-600">R {order.total.toFixed(2)}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <span
                        className={`px-3 py-1 text-sm rounded-full ${
                          order.status === 'completed'
                            ? 'bg-green-100 text-green-800'
                            : order.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {order.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Delete Product Confirmation Modal */}
      {showDeleteProductModal && selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Delete Product
            </h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this product? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => {
                  setShowDeleteProductModal(false)
                  setSelectedProduct(null)
                }}
                disabled={deletingProduct}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={() => selectedProduct && handleDeleteProduct(selectedProduct)}
                disabled={deletingProduct}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 flex items-center"
              >
                {deletingProduct ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Document Viewer Modal */}
      {documentModal.isOpen && documentModal.url && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4"
          onClick={closeDocumentModal}
        >
          <div 
            className="relative max-w-7xl w-full max-h-[90vh] bg-white rounded-lg overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-gray-900 text-white px-6 py-4 flex items-center justify-between">
              <h3 className="text-lg font-medium">{documentModal.title}</h3>
              <button
                onClick={closeDocumentModal}
                className="text-gray-300 hover:text-white transition-colors"
              >
                <XCircle className="h-6 w-6" />
              </button>
            </div>

            {/* Content */}
            <div className="bg-gray-50 p-4 overflow-auto" style={{ maxHeight: 'calc(90vh - 64px)' }}>
              {documentModal.type === 'pdf' ? (
                <iframe
                  src={documentModal.url}
                  className="w-full h-[80vh] border-0"
                  title={documentModal.title}
                />
              ) : (
                <div className="flex items-center justify-center">
                  <img
                    src={documentModal.url}
                    alt={documentModal.title}
                    className="max-w-full max-h-[80vh] object-contain"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
