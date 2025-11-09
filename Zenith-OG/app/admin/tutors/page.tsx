'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Search,
  CheckCircle,
  XCircle,
  Clock,
  User,
  FileText,
  Download,
  Eye,
  Mail,
  Phone,
  GraduationCap,
  Award,
  AlertCircle,
} from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

interface TutorApplication {
  id: string
  userId: string
  fullName: string
  email: string
  phone?: string
  institution: string
  modules: string[]
  qualification: string
  hourlyRate: number
  bio: string
  profilePicture?: string
  proofOfRegistration?: string
  transcript?: string
  status: 'pending' | 'approved' | 'rejected'
  submittedAt: string
  reviewedAt?: string
  reviewedBy?: string
  rejectionReason?: string
  verificationNotes?: string
}

export default function TutorVerificationPage() {
  const router = useRouter()
  const [applications, setApplications] = useState<TutorApplication[]>([])
  const [filteredApplications, setFilteredApplications] = useState<TutorApplication[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending')
  const [loading, setLoading] = useState(true)
  const [selectedApplication, setSelectedApplication] = useState<TutorApplication | null>(null)
  const [showReviewModal, setShowReviewModal] = useState(false)
  const [reviewAction, setReviewAction] = useState<'approve' | 'reject'>('approve')
  const [rejectionReason, setRejectionReason] = useState('')
  const [verificationNotes, setVerificationNotes] = useState('')
  const [processing, setProcessing] = useState(false)

  useEffect(() => {
    fetchApplications()
  }, [])

  useEffect(() => {
    filterApplications()
  }, [applications, searchTerm, statusFilter])

  const fetchApplications = async () => {
    try {
      const token = localStorage.getItem('auth-token')
      if (!token) {
        router.push('/login')
        return
      }

      const response = await fetch('/api/admin/tutors', {
        headers: { Authorization: `Bearer ${token}` }
      })

      if (!response.ok) {
        if (response.status === 403 || response.status === 401) {
          router.push('/login')
          return
        }
        throw new Error('Failed to fetch applications')
      }

      const data = await response.json()
      setApplications(data.applications || [])
    } catch (error) {
      console.error('Error fetching applications:', error)
    } finally {
      setLoading(false)
    }
  }

  const filterApplications = () => {
    let filtered = applications

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(app => app.status === statusFilter)
    }

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(app =>
        app.fullName.toLowerCase().includes(term) ||
        app.email.toLowerCase().includes(term) ||
        app.institution.toLowerCase().includes(term) ||
        app.modules.some(m => m.toLowerCase().includes(term))
      )
    }

    setFilteredApplications(filtered)
  }

  const handleReview = (application: TutorApplication, action: 'approve' | 'reject') => {
    setSelectedApplication(application)
    setReviewAction(action)
    setRejectionReason('')
    setVerificationNotes('')
    setShowReviewModal(true)
  }

  const submitReview = async () => {
    if (!selectedApplication) return
    
    if (reviewAction === 'reject' && !rejectionReason.trim()) {
      alert('Please provide a reason for rejection')
      return
    }

    setProcessing(true)
    try {
      const token = localStorage.getItem('auth-token')
      const response = await fetch(`/api/admin/tutors/${selectedApplication.id}/review`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          action: reviewAction,
          rejectionReason: reviewAction === 'reject' ? rejectionReason : undefined,
          verificationNotes: verificationNotes || undefined
        })
      })

      if (!response.ok) {
        throw new Error('Failed to submit review')
      }

      // Refresh applications
      await fetchApplications()
      setShowReviewModal(false)
      setSelectedApplication(null)
    } catch (error) {
      console.error('Error submitting review:', error)
      alert('Failed to submit review. Please try again.')
    } finally {
      setProcessing(false)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300"><Clock className="h-3 w-3 mr-1" />Pending</Badge>
      case 'approved':
        return <Badge className="bg-green-100 text-green-800 border-green-300"><CheckCircle className="h-3 w-3 mr-1" />Approved</Badge>
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800 border-red-300"><XCircle className="h-3 w-3 mr-1" />Rejected</Badge>
      default:
        return null
    }
  }

  const stats = {
    pending: applications.filter(a => a.status === 'pending').length,
    approved: applications.filter(a => a.status === 'approved').length,
    rejected: applications.filter(a => a.status === 'rejected').length,
    total: applications.length
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading tutor applications...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Tutor Verification</h1>
          <p className="text-gray-600 mt-2">Review and approve tutor applications</p>
        </div>
        <Link href="/admin/dashboard">
          <Button variant="outline">← Back to Dashboard</Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Approved</p>
                <p className="text-2xl font-bold text-green-600">{stats.approved}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Rejected</p>
                <p className="text-2xl font-bold text-red-600">{stats.rejected}</p>
              </div>
              <XCircle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total</p>
                <p className="text-2xl font-bold text-purple-600">{stats.total}</p>
              </div>
              <GraduationCap className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by name, email, institution, or modules..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant={statusFilter === 'all' ? 'default' : 'outline'}
                onClick={() => setStatusFilter('all')}
                size="sm"
              >
                All ({applications.length})
              </Button>
              <Button
                variant={statusFilter === 'pending' ? 'default' : 'outline'}
                onClick={() => setStatusFilter('pending')}
                size="sm"
                className={statusFilter === 'pending' ? 'bg-yellow-600 hover:bg-yellow-700' : ''}
              >
                Pending ({stats.pending})
              </Button>
              <Button
                variant={statusFilter === 'approved' ? 'default' : 'outline'}
                onClick={() => setStatusFilter('approved')}
                size="sm"
                className={statusFilter === 'approved' ? 'bg-green-600 hover:bg-green-700' : ''}
              >
                Approved ({stats.approved})
              </Button>
              <Button
                variant={statusFilter === 'rejected' ? 'default' : 'outline'}
                onClick={() => setStatusFilter('rejected')}
                size="sm"
                className={statusFilter === 'rejected' ? 'bg-red-600 hover:bg-red-700' : ''}
              >
                Rejected ({stats.rejected})
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Applications List */}
      {filteredApplications.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <GraduationCap className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Applications Found</h3>
            <p className="text-gray-600">
              {searchTerm
                ? 'No applications match your search criteria.'
                : statusFilter === 'pending'
                ? 'No pending applications at the moment.'
                : `No ${statusFilter} applications.`}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredApplications.map((application) => (
            <Card key={application.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    {/* Profile Picture */}
                    <div className="h-16 w-16 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0 overflow-hidden">
                      {application.profilePicture ? (
                        <Image
                          src={application.profilePicture}
                          alt={application.fullName}
                          width={64}
                          height={64}
                          className="object-cover w-full h-full"
                        />
                      ) : (
                        <User className="h-8 w-8 text-purple-600" />
                      )}
                    </div>

                    {/* Application Details */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{application.fullName}</h3>
                        {getStatusBadge(application.status)}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600 mb-3">
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4" />
                          {application.email}
                        </div>
                        {application.phone && (
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4" />
                            {application.phone}
                          </div>
                        )}
                        <div className="flex items-center gap-2">
                          <GraduationCap className="h-4 w-4" />
                          {application.institution}
                        </div>
                        <div className="flex items-center gap-2">
                          <Award className="h-4 w-4" />
                          {application.qualification}
                        </div>
                      </div>

                      <div className="mb-3">
                        <p className="text-sm font-medium text-gray-700 mb-1">Modules:</p>
                        <div className="flex flex-wrap gap-2">
                          {application.modules.map((module, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {module}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="mb-3">
                        <p className="text-sm font-medium text-gray-700 mb-1">Bio:</p>
                        <p className="text-sm text-gray-600 line-clamp-2">{application.bio}</p>
                      </div>

                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span className="font-medium">Hourly Rate: R{application.hourlyRate}</span>
                        <span>Applied: {new Date(application.submittedAt).toLocaleDateString()}</span>
                      </div>

                      {application.rejectionReason && (
                        <div className="mt-3 bg-red-50 border border-red-200 rounded-lg p-3">
                          <p className="text-sm font-medium text-red-800 mb-1">Rejection Reason:</p>
                          <p className="text-sm text-red-700">{application.rejectionReason}</p>
                        </div>
                      )}

                      {application.verificationNotes && (
                        <div className="mt-3 bg-blue-50 border border-blue-200 rounded-lg p-3">
                          <p className="text-sm font-medium text-blue-800 mb-1">Verification Notes:</p>
                          <p className="text-sm text-blue-700">{application.verificationNotes}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-2 ml-4">
                    {application.proofOfRegistration && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(application.proofOfRegistration, '_blank')}
                      >
                        <FileText className="h-4 w-4 mr-2" />
                        Proof
                      </Button>
                    )}
                    {application.transcript && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(application.transcript, '_blank')}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Transcript
                      </Button>
                    )}
                    {application.status === 'pending' && (
                      <>
                        <Button
                          size="sm"
                          className="bg-green-600 hover:bg-green-700"
                          onClick={() => handleReview(application, 'approve')}
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleReview(application, 'reject')}
                        >
                          <XCircle className="h-4 w-4 mr-2" />
                          Reject
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Review Modal */}
      <Dialog open={showReviewModal} onOpenChange={setShowReviewModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {reviewAction === 'approve' ? 'Approve Tutor Application' : 'Reject Tutor Application'}
            </DialogTitle>
            <DialogDescription>
              {reviewAction === 'approve'
                ? 'This tutor will be verified and can start accepting students.'
                : 'Please provide a reason for rejection. The applicant will be notified.'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {selectedApplication && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="font-medium text-gray-900">{selectedApplication.fullName}</p>
                <p className="text-sm text-gray-600">{selectedApplication.email}</p>
                <p className="text-sm text-gray-600">{selectedApplication.institution}</p>
              </div>
            )}

            {reviewAction === 'reject' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rejection Reason *
                </label>
                <Textarea
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="Explain why this application is being rejected..."
                  rows={4}
                  required
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Verification Notes (Optional)
              </label>
              <Textarea
                value={verificationNotes}
                onChange={(e) => setVerificationNotes(e.target.value)}
                placeholder="Add any internal notes about this verification..."
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowReviewModal(false)} disabled={processing}>
              Cancel
            </Button>
            <Button
              onClick={submitReview}
              disabled={processing || (reviewAction === 'reject' && !rejectionReason.trim())}
              className={reviewAction === 'approve' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}
            >
              {processing ? 'Processing...' : reviewAction === 'approve' ? 'Approve Tutor' : 'Reject Application'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
