'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import AdminHeader from '@/components/admin/AdminHeader'

interface User {
  id: string
  email: string
  firstName: string | null
  lastName: string | null
  university: string | null
  phone: string | null
  verified: boolean
  isAdmin: boolean
  roles: string[]
  lastLogin: string | null
  emailVerified: boolean
  accountLocked: boolean
  productsCount: number
  ordersCount: number
  createdAt: string
  profilePicture?: string | null
  studentCardImage?: string | null
  idDocumentImage?: string | null
  documentsUploaded?: boolean
  adminVerified?: boolean
  verificationNotes?: string | null
}

interface PaginationInfo {
  page: number
  limit: number
  total: number
  pages: number
}

export default function AdminUsers() {
  const router = useRouter()
  const [users, setUsers] = useState<User[]>([])
  const [pagination, setPagination] = useState<PaginationInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // Filters
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [roleFilter, setRoleFilter] = useState('all')
  const [page, setPage] = useState(1)

  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false)
  // Create user form fields
  const [newEmail, setNewEmail] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [newFirstName, setNewFirstName] = useState('')
  const [newLastName, setNewLastName] = useState('')
  const [newUniversity, setNewUniversity] = useState('')
  const [newPhone, setNewPhone] = useState('')
  const [newRole, setNewRole] = useState('student')
  const [newStudentNumber, setNewStudentNumber] = useState('')
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showUserDetailsModal, setShowUserDetailsModal] = useState(false)

  useEffect(() => {
    fetchUsers()
  }, [page, search, statusFilter, roleFilter])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      // Verify authentication using server-side cookie
      const authResp = await fetch('/api/auth/me', { credentials: 'include' })
      if (!authResp.ok) {
        router.push('/login')
        return
      }

      const params = new URLSearchParams({
        page: page.toString(),
        limit: '20',
        search,
        status: statusFilter,
        role: roleFilter
      })

      const response = await fetch(`/api/admin/users?${params}`, {
        credentials: 'include'
      })

      if (!response.ok) {
        const err = await response.json().catch(() => null)
        console.error('Fetch users server error:', err)
        if (response.status === 403) {
          setError('Unauthorized — please sign in as an admin')
          return
        }
        throw new Error(err?.error || 'Failed to fetch users')
      }

      const data = await response.json()
      setUsers(data.users)
      setPagination(data.pagination)
    } catch (error) {
      console.error('Fetch users error:', error)
  setError(String((error as any)?.message || 'Failed to load users'))
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteUser = async (userId: string) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE',
        credentials: 'include'
      })

      if (!response.ok) {
        const err = await response.json().catch(() => null)
        console.error('Delete user server error:', err)
        alert(err?.error || 'Failed to delete user')
        return
      }

      const data = await response.json().catch(() => null)
      setUsers(users.filter(u => u.id !== userId))
      setShowDeleteModal(false)
      setSelectedUser(null)
      if (data?.message) {
        alert(data.message)
      }
    } catch (error) {
      console.error('Delete user error:', error)
  alert(String((error as any)?.message || 'Failed to delete user'))
    }
  }

  // Create user handler (from Create User modal)
  const handleCreateUser = async (formData: {
    email: string
    password: string
    firstName: string
    lastName: string
    university?: string
    phone?: string
    role?: string
    studentNumber?: string
  }) => {
    try {
      // Ensure admin is authenticated via cookie
      const authResp = await fetch('/api/auth/me', { credentials: 'include' })
      if (!authResp.ok) {
        router.push('/login')
        return
      }

      const response = await fetch('/api/admin/users', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      if (!response.ok) {
        const err = await response.json().catch(() => null)
        console.error('Create user server error:', err)
        alert(err?.error || 'Failed to create user')
        return
      }

      const data = await response.json()
      // Prepend new user to list and refresh
      setUsers(prev => [
        ...(prev || []),
        {
          id: data.user.id,
          email: data.user.email,
          firstName: data.user.firstName,
          lastName: data.user.lastName,
          university: data.user.university,
          phone: data.user.phone ?? null,
          verified: data.user.verified ?? false,
          isAdmin: false,
          roles: data.user.roles ?? [],
          lastLogin: null,
          emailVerified: data.user.emailVerified ?? false,
          accountLocked: data.user.accountLocked ?? false,
          productsCount: 0,
          ordersCount: 0,
          createdAt: new Date().toISOString(),
          profilePicture: data.user.profilePicture ?? null,
          studentCardImage: data.user.studentCardImage ?? null,
          idDocumentImage: data.user.idDocumentImage ?? null,
          documentsUploaded: data.user.documentsUploaded ?? false,
          adminVerified: data.user.adminVerified ?? false,
          verificationNotes: data.user.verificationNotes ?? null
        }
      ])
      setShowCreateModal(false)
      alert(data.message || 'User created')
    } catch (error) {
      console.error('Create user error:', error)
  alert(String((error as any)?.message || 'Failed to create user'))
    }
  }

  const handleToggleUserStatus = async (user: User) => {
    try {
      const response = await fetch(`/api/admin/users/${user.id}`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          verified: !user.verified
        })
      })

      if (!response.ok) {
        throw new Error('Failed to update user')
      }

      setUsers(users.map(u => 
        u.id === user.id ? { ...u, verified: !u.verified } : u
      ))
    } catch (error) {
      console.error('Update user error:', error)
      alert('Failed to update user')
    }
  }

  const handleVerifyUser = async (user: User) => {
    try {
      const response = await fetch(`/api/admin/users/${user.id}`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          adminVerified: !user.adminVerified
        })
      })

      if (!response.ok) {
        throw new Error('Failed to verify user')
      }

      // Update local state
      setUsers(users.map(u => 
        u.id === user.id ? { ...u, adminVerified: !u.adminVerified } : u
      ))
      
      // Update selected user if modal is open
      if (selectedUser?.id === user.id) {
        setSelectedUser({ ...selectedUser, adminVerified: !selectedUser.adminVerified })
      }

      alert(user.adminVerified ? 'User verification removed' : 'User verified successfully')
    } catch (error) {
      console.error('Verify user error:', error)
      alert('Failed to verify user')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <AdminHeader 
        title="User Management" 
        subtitle="Manage all users in the system"
        showBackToDashboard={true}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Create User Button */}
        <div className="mb-6 flex justify-end">
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 shadow-sm"
          >
            + Create User
          </button>
        </div>
        {/* Filters */}
        <div className="bg-white rounded-lg shadow mb-6 p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Search
              </label>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Email, name, university..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Role
              </label>
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Roles</option>
                <option value="admin">Admin</option>
                <option value="student">Student</option>
              </select>
            </div>
            
            <div className="flex items-end">
              <button
                onClick={() => {
                  setSearch('')
                  setStatusFilter('all')
                  setRoleFilter('all')
                  setPage(1)
                }}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">
              Users {pagination && `(${pagination.total})`}
            </h3>
          </div>
          
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">Loading users...</p>
            </div>
          ) : error ? (
            <div className="p-8 text-center text-red-600">{error}</div>
          ) : users.length === 0 ? (
            <div className="p-8 text-center text-gray-500">No users found</div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        User
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Role
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Activity
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {users.map((user) => (
                      <tr 
                        key={user.id} 
                        className="hover:bg-gray-50 cursor-pointer transition-colors"
                        onClick={() => {
                          setSelectedUser(user)
                          setShowUserDetailsModal(true)
                        }}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {user.firstName} {user.lastName}
                            </div>
                            <div className="text-sm text-gray-500">{user.email}</div>
                            {user.university && (
                              <div className="text-xs text-gray-400">{user.university}</div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex flex-wrap gap-1">
                            {user.roles.map((role) => (
                              <span
                                key={role}
                                className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                  role === 'admin'
                                    ? 'bg-red-100 text-red-800'
                                    : 'bg-blue-100 text-blue-800'
                                }`}
                              >
                                {role}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="space-y-1">
                            <span
                              className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                user.verified
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-yellow-100 text-yellow-800'
                              }`}
                            >
                              {user.verified ? 'Active' : 'Inactive'}
                            </span>
                            {user.accountLocked && (
                              <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                                Locked
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div>
                            <div>Products: {user.productsCount}</div>
                            <div>Orders: {user.ordersCount}</div>
                            <div>
                              Last login: {user.lastLogin 
                                ? new Date(user.lastLogin).toLocaleDateString()
                                : 'Never'
                              }
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              handleToggleUserStatus(user)
                            }}
                            className={`text-sm px-3 py-1 rounded ${
                              user.verified
                                ? 'text-red-600 hover:text-red-800'
                                : 'text-green-600 hover:text-green-800'
                            }`}
                          >
                            {user.verified ? 'Deactivate' : 'Activate'}
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              setSelectedUser(user)
                              setShowDeleteModal(true)
                            }}
                            className="text-red-600 hover:text-red-800"
                            disabled={user.isAdmin}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {pagination && pagination.pages > 1 && (
                <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                  <div className="text-sm text-gray-500">
                    Showing {((pagination.page - 1) * pagination.limit) + 1} to{' '}
                    {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
                    {pagination.total} results
                  </div>
                  <div className="flex space-x-1">
                    <button
                      onClick={() => setPage(page - 1)}
                      disabled={page === 1}
                      className="px-3 py-1 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                      Previous
                    </button>
                    {Array.from({ length: Math.min(5, pagination.pages) }, (_, i) => {
                      const pageNum = i + 1
                      return (
                        <button
                          key={pageNum}
                          onClick={() => setPage(pageNum)}
                          className={`px-3 py-1 border rounded-md ${
                            page === pageNum
                              ? 'bg-blue-600 text-white border-blue-600'
                              : 'border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          {pageNum}
                        </button>
                      )
                    })}
                    <button
                      onClick={() => setPage(page + 1)}
                      disabled={page === pagination.pages}
                      className="px-3 py-1 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </main>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Delete User
            </h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete {selectedUser.firstName} {selectedUser.lastName}? 
              This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => {
                  setShowDeleteModal(false)
                  setSelectedUser(null)
                }}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteUser(selectedUser.id)}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Create User Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Create User</h3>
            <div className="space-y-3">
              <input className="w-full px-3 py-2 border rounded" placeholder="Email" value={newEmail} onChange={e => setNewEmail(e.target.value)} />
              <input className="w-full px-3 py-2 border rounded" placeholder="Password" type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} />
              <div className="grid grid-cols-2 gap-2">
                <input className="w-full px-3 py-2 border rounded" placeholder="First name" value={newFirstName} onChange={e => setNewFirstName(e.target.value)} />
                <input className="w-full px-3 py-2 border rounded" placeholder="Last name" value={newLastName} onChange={e => setNewLastName(e.target.value)} />
              </div>
              <input className="w-full px-3 py-2 border rounded" placeholder="University" value={newUniversity} onChange={e => setNewUniversity(e.target.value)} />
              <input className="w-full px-3 py-2 border rounded" placeholder="Phone" value={newPhone} onChange={e => setNewPhone(e.target.value)} />
              <div>
                <label className="block text-sm text-gray-600 mb-1">Role</label>
                <select value={newRole} onChange={e => setNewRole(e.target.value)} className="w-full px-3 py-2 border rounded">
                  <option value="student">Student</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              {newRole === 'admin' && (
                <div className="bg-blue-50 border border-blue-200 rounded p-3">
                  <label className="block text-sm font-medium text-blue-900 mb-1">
                    Student Number <span className="text-red-500">*</span>
                  </label>
                  <input 
                    className="w-full px-3 py-2 border rounded" 
                    placeholder="9-digit student number" 
                    value={newStudentNumber} 
                    onChange={e => setNewStudentNumber(e.target.value)}
                    maxLength={9}
                  />
                  <p className="text-xs text-blue-600 mt-1">Required for admin users</p>
                </div>
              )}
            </div>
            <div className="flex justify-end space-x-4 mt-4">
              <button onClick={() => {
                setShowCreateModal(false)
                setNewEmail('')
                setNewPassword('')
                setNewFirstName('')
                setNewLastName('')
                setNewUniversity('')
                setNewPhone('')
                setNewRole('student')
                setNewStudentNumber('')
              }} className="px-4 py-2 text-gray-600 border rounded">Cancel</button>
              <button
                onClick={() => handleCreateUser({
                  email: newEmail,
                  password: newPassword,
                  firstName: newFirstName,
                  lastName: newLastName,
                  university: newUniversity,
                  phone: newPhone,
                  role: newRole,
                  studentNumber: newStudentNumber
                })}
                className="px-4 py-2 bg-blue-600 text-white rounded"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}

      {/* User Details Modal */}
      {showUserDetailsModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-2xl font-bold text-gray-900">
                  {selectedUser.firstName} {selectedUser.lastName}
                </h3>
                <p className="text-gray-500">{selectedUser.email}</p>
              </div>
              <button
                onClick={() => {
                  setShowUserDetailsModal(false)
                  setSelectedUser(null)
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-6">
              {/* Status Badges */}
              <div className="flex flex-wrap gap-2">
                {selectedUser.roles.map((role) => (
                  <span
                    key={role}
                    className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${
                      role === 'admin'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}
                  >
                    {role.toUpperCase()}
                  </span>
                ))}
                <span
                  className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${
                    selectedUser.verified
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}
                >
                  {selectedUser.verified ? 'ACTIVE' : 'INACTIVE'}
                </span>
                {selectedUser.emailVerified && (
                  <span className="inline-flex px-3 py-1 text-sm font-semibold rounded-full bg-green-100 text-green-800">
                    EMAIL VERIFIED
                  </span>
                )}
                {selectedUser.accountLocked && (
                  <span className="inline-flex px-3 py-1 text-sm font-semibold rounded-full bg-red-100 text-red-800">
                    ACCOUNT LOCKED
                  </span>
                )}
              </div>

              {/* User Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-sm font-semibold text-gray-600 mb-2">Contact Information</h4>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="font-medium">Email:</span>
                      <p className="text-gray-700">{selectedUser.email}</p>
                    </div>
                    {selectedUser.phone && (
                      <div>
                        <span className="font-medium">Phone:</span>
                        <p className="text-gray-700">{selectedUser.phone}</p>
                      </div>
                    )}
                    {selectedUser.university && (
                      <div>
                        <span className="font-medium">University:</span>
                        <p className="text-gray-700">{selectedUser.university}</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-sm font-semibold text-gray-600 mb-2">Activity</h4>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="font-medium">Products Listed:</span>
                      <p className="text-gray-700">{selectedUser.productsCount}</p>
                    </div>
                    <div>
                      <span className="font-medium">Orders Placed:</span>
                      <p className="text-gray-700">{selectedUser.ordersCount}</p>
                    </div>
                    <div>
                      <span className="font-medium">Last Login:</span>
                      <p className="text-gray-700">
                        {selectedUser.lastLogin 
                          ? new Date(selectedUser.lastLogin).toLocaleString()
                          : 'Never'
                        }
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-sm font-semibold text-gray-600 mb-2">Account Details</h4>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="font-medium">User ID:</span>
                      <p className="text-gray-700 font-mono text-xs">{selectedUser.id}</p>
                    </div>
                    <div>
                      <span className="font-medium">Created:</span>
                      <p className="text-gray-700">
                        {new Date(selectedUser.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <span className="font-medium">Admin Account:</span>
                      <p className="text-gray-700">{selectedUser.isAdmin ? 'Yes' : 'No'}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-sm font-semibold text-gray-600 mb-2">Security</h4>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="font-medium">Email Verified:</span>
                      <p className="text-gray-700">{selectedUser.emailVerified ? 'Yes' : 'No'}</p>
                    </div>
                    <div>
                      <span className="font-medium">Account Locked:</span>
                      <p className="text-gray-700">{selectedUser.accountLocked ? 'Yes' : 'No'}</p>
                    </div>
                    <div>
                      <span className="font-medium">Verified Status:</span>
                      <p className="text-gray-700">{selectedUser.verified ? 'Verified' : 'Unverified'}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Verification Documents */}
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Verification Documents
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  {/* Profile Picture */}
                  <div className="border rounded-lg p-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">Profile Picture</p>
                    {selectedUser.profilePicture ? (
                      <img
                        src={selectedUser.profilePicture}
                        alt="Profile"
                        className="w-full h-48 object-cover rounded-md cursor-pointer hover:opacity-90"
                        onClick={() => window.open(selectedUser.profilePicture!, '_blank')}
                      />
                    ) : (
                      <div className="w-full h-48 bg-gray-100 rounded-md flex items-center justify-center">
                        <p className="text-gray-400 text-sm">Not uploaded</p>
                      </div>
                    )}
                  </div>

                  {/* Proof of Registration */}
                  <div className="border rounded-lg p-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">Proof of Registration</p>
                    <p className="text-xs text-gray-500 mb-2">Current tertiary institution</p>
                    {selectedUser.studentCardImage ? (
                      <img
                        src={selectedUser.studentCardImage}
                        alt="Proof of Registration"
                        className="w-full h-48 object-cover rounded-md cursor-pointer hover:opacity-90"
                        onClick={() => window.open(selectedUser.studentCardImage!, '_blank')}
                      />
                    ) : (
                      <div className="w-full h-48 bg-gray-100 rounded-md flex items-center justify-center">
                        <p className="text-gray-400 text-sm">Not uploaded</p>
                      </div>
                    )}
                  </div>

                  {/* Certified ID Copy */}
                  <div className="border rounded-lg p-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">Certified ID Copy</p>
                    <p className="text-xs text-gray-500 mb-2">Certified copy of ID document</p>
                    {selectedUser.idDocumentImage ? (
                      <img
                        src={selectedUser.idDocumentImage}
                        alt="Certified ID"
                        className="w-full h-48 object-cover rounded-md cursor-pointer hover:opacity-90"
                        onClick={() => window.open(selectedUser.idDocumentImage!, '_blank')}
                      />
                    ) : (
                      <div className="w-full h-48 bg-gray-100 rounded-md flex items-center justify-center">
                        <p className="text-gray-400 text-sm">Not uploaded</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Verification Status and Notes */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <span className="text-sm font-medium text-gray-700">Documents Uploaded:</span>
                      <p className="text-gray-900">{selectedUser.documentsUploaded ? 'Yes' : 'No'}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-700">Admin Verified:</span>
                      <p className="text-gray-900">{selectedUser.adminVerified ? 'Yes' : 'No'}</p>
                    </div>
                  </div>
                  {selectedUser.verificationNotes && (
                    <div className="mt-3">
                      <span className="text-sm font-medium text-gray-700">Verification Notes:</span>
                      <p className="text-gray-900 mt-1">{selectedUser.verificationNotes}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Admin Actions */}
              <div className="flex justify-end space-x-3 pt-4 border-t">
                {!selectedUser.isAdmin && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleVerifyUser(selectedUser)
                    }}
                    className={`px-4 py-2 rounded-md font-medium ${
                      selectedUser.adminVerified
                        ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                  >
                    {selectedUser.adminVerified ? 'Remove Verification' : 'Verify User'}
                  </button>
                )}
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    setShowUserDetailsModal(false)
                    handleToggleUserStatus(selectedUser)
                  }}
                  className={`px-4 py-2 rounded-md font-medium ${
                    selectedUser.verified
                      ? 'bg-red-100 text-red-700 hover:bg-red-200'
                      : 'bg-green-100 text-green-700 hover:bg-green-200'
                  }`}
                >
                  {selectedUser.verified ? 'Deactivate Account' : 'Activate Account'}
                </button>
                {!selectedUser.isAdmin && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      setShowUserDetailsModal(false)
                      setShowDeleteModal(true)
                    }}
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 font-medium"
                  >
                    Delete User
                  </button>
                )}
                <button
                  onClick={() => {
                    setShowUserDetailsModal(false)
                    setSelectedUser(null)
                  }}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 font-medium"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}