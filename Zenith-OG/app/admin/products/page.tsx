'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import AdminHeader from '@/components/admin/AdminHeader'

interface Product {
  id: string
  title: string
  description: string
  price: number
  image: string | null
  images: string | null  // JSON array of image URLs
  condition: string
  status: string
  adminApproved: boolean
  rejectionReason: string | null
  verificationNotes: string | null
  createdAt: string
  seller: {
    id: string
    firstName: string | null
    lastName: string | null
    email: string
    university: string | null
  }
  category: {
    id: string
    name: string
  }
}

export default function AdminProducts() {
  const router = useRouter()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'pending' | 'approved' | 'rejected' | 'all'>('pending')
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [showVerifyModal, setShowVerifyModal] = useState(false)
  const [rejectionReason, setRejectionReason] = useState('')
  const [verificationNotes, setVerificationNotes] = useState('')
  const [processing, setProcessing] = useState(false)

  // Helper function to get product images
  const getProductImages = (product: Product): string[] => {
    if (product.images) {
      try {
        const parsed = JSON.parse(product.images)
        return Array.isArray(parsed) ? parsed : []
      } catch {
        return []
      }
    }
    return product.image ? [product.image] : []
  }

  // Helper function to get first image
  const getFirstImage = (product: Product): string | null => {
    const images = getProductImages(product)
    return images.length > 0 ? images[0] : null
  }

  useEffect(() => {
    fetchProducts()
  }, [filter])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem('auth-token')
      const response = await fetch(`/api/admin/products?status=${filter}`, {
        headers: { Authorization: `Bearer ${token}` }
      })

      if (!response.ok) throw new Error('Failed to fetch products')

      const data = await response.json()
      setProducts(data.products || [])
    } catch (error) {
      console.error('Fetch products error:', error)
      alert('Failed to load products')
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyProduct = async (productId: string, approved: boolean) => {
    if (!approved && !rejectionReason.trim()) {
      alert('Please provide a rejection reason')
      return
    }

    setProcessing(true)
    try {
      const token = localStorage.getItem('auth-token')
      const response = await fetch(`/api/admin/products/${productId}/verify`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          approved,
          rejectionReason: approved ? null : rejectionReason,
          verificationNotes: verificationNotes || null
        })
      })

      if (!response.ok) throw new Error('Failed to verify product')

      const data = await response.json()
      
      // Refresh products list
      await fetchProducts()
      
      // Close modal
      setShowVerifyModal(false)
      setSelectedProduct(null)
      setRejectionReason('')
      setVerificationNotes('')
      
      alert(data.message || (approved ? 'Product approved successfully' : 'Product rejected'))
    } catch (error) {
      console.error('Verify product error:', error)
      alert('Failed to verify product')
    } finally {
      setProcessing(false)
    }
  }

  const openVerifyModal = (product: Product) => {
    setSelectedProduct(product)
    setVerificationNotes(product.verificationNotes || '')
    setRejectionReason(product.rejectionReason || '')
    setShowVerifyModal(true)
  }

  const pendingCount = products.filter(p => p.status === 'pending').length

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader 
        title="Product Verifications" 
        subtitle="Review and approve product listings"
        showBackToDashboard={true}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filter Tabs */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6" aria-label="Tabs">
              {[
                { key: 'pending', label: 'Pending Verification', count: products.filter(p => p.status === 'pending').length },
                { key: 'approved', label: 'Approved', count: products.filter(p => p.status === 'approved' || p.adminApproved).length },
                { key: 'rejected', label: 'Rejected', count: products.filter(p => p.status === 'rejected').length },
                { key: 'all', label: 'All Products', count: products.length }
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setFilter(tab.key as any)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    filter === tab.key
                      ? 'border-purple-600 text-purple-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.label}
                  <span className={`ml-2 py-0.5 px-2.5 rounded-full text-xs ${
                    filter === tab.key
                      ? 'bg-purple-100 text-purple-600'
                      : 'bg-gray-100 text-gray-900'
                  }`}>
                    {tab.count}
                  </span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
            <p className="mt-2 text-gray-600">Loading products...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No products found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {filter === 'pending' ? 'All caught up! No pending verifications.' : `No ${filter} products to display.`}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <div key={product.id} className="bg-white rounded-lg shadow hover:shadow-md transition-shadow">
                {/* Product Image */}
                <div className="aspect-w-16 aspect-h-9 bg-gray-200 rounded-t-lg overflow-hidden">
                  {getFirstImage(product) ? (
                    <img src={getFirstImage(product)!} alt={product.title} className="w-full h-48 object-cover" />
                  ) : (
                    <div className="w-full h-48 flex items-center justify-center bg-gray-100">
                      <svg className="h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}
                </div>

                {/* Product Info */}
                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-gray-900 line-clamp-1">{product.title}</h3>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      product.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      product.status === 'approved' ? 'bg-green-100 text-green-800' :
                      product.status === 'rejected' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {product.status}
                    </span>
                  </div>

                  <p className="text-sm text-gray-600 line-clamp-2 mb-3">{product.description}</p>

                  <div className="flex items-center justify-between mb-3">
                    <span className="text-lg font-bold text-purple-600">R{product.price.toFixed(2)}</span>
                    <span className="text-xs text-gray-500 capitalize">{product.condition}</span>
                  </div>

                  {/* Seller Info */}
                  <div className="border-t pt-3 mb-3">
                    <p className="text-xs text-gray-500">Seller</p>
                    <p className="text-sm font-medium text-gray-900">
                      {product.seller.firstName} {product.seller.lastName}
                    </p>
                    <p className="text-xs text-gray-600">{product.seller.email}</p>
                    {product.seller.university && (
                      <p className="text-xs text-gray-500">{product.seller.university}</p>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <button
                    onClick={() => openVerifyModal(product)}
                    className="w-full px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 font-medium text-sm"
                  >
                    Review Product
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Verify Modal */}
      {showVerifyModal && selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-900">Review Product</h2>
                <button
                  onClick={() => {
                    setShowVerifyModal(false)
                    setSelectedProduct(null)
                    setRejectionReason('')
                    setVerificationNotes('')
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Product Details */}
              <div className="mb-6">
                {/* Product Images Gallery */}
                {getProductImages(selectedProduct).length > 0 && (
                  <div className="mb-4">
                    <div className="grid grid-cols-2 gap-2">
                      {getProductImages(selectedProduct).map((imageUrl, index) => (
                        <img 
                          key={index}
                          src={imageUrl} 
                          alt={`${selectedProduct.title} - Image ${index + 1}`} 
                          className="w-full h-48 object-cover rounded-lg border border-gray-200 hover:border-purple-400 transition-colors cursor-pointer"
                          onClick={() => window.open(imageUrl, '_blank')}
                        />
                      ))}
                    </div>
                    <p className="text-xs text-gray-500 mt-2 text-center">
                      {getProductImages(selectedProduct).length} image(s) - Click to view full size
                    </p>
                  </div>
                )}
                
                <h3 className="text-xl font-semibold mb-2">{selectedProduct.title}</h3>
                <p className="text-2xl font-bold text-purple-600 mb-2">R{selectedProduct.price.toFixed(2)}</p>
                <p className="text-gray-700 mb-4 whitespace-pre-wrap">{selectedProduct.description}</p>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Condition:</span> {selectedProduct.condition}
                  </div>
                  <div>
                    <span className="font-medium">Category:</span> {selectedProduct.category.name}
                  </div>
                  <div>
                    <span className="font-medium">Seller:</span> {selectedProduct.seller.firstName} {selectedProduct.seller.lastName}
                  </div>
                  <div>
                    <span className="font-medium">University:</span> {selectedProduct.seller.university || 'N/A'}
                  </div>
                </div>
              </div>

              {/* Verification Notes */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Verification Notes (Optional)
                </label>
                <textarea
                  value={verificationNotes}
                  onChange={(e) => setVerificationNotes(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                  placeholder="Add internal notes about this verification..."
                />
              </div>

              {/* Rejection Reason */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rejection Reason (Required if rejecting)
                </label>
                <textarea
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                  placeholder="Explain why this product cannot be listed..."
                />
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => handleVerifyProduct(selectedProduct.id, false)}
                  disabled={processing}
                  className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 font-medium disabled:opacity-50"
                >
                  {processing ? 'Processing...' : 'Reject'}
                </button>
                <button
                  onClick={() => handleVerifyProduct(selectedProduct.id, true)}
                  disabled={processing}
                  className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 font-medium disabled:opacity-50"
                >
                  {processing ? 'Processing...' : 'Approve'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
