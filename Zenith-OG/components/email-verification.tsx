'use client'

import { useState, useEffect } from 'react'
import { Mail, Check, AlertCircle, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export function EmailVerificationSection() {
  const [emailVerified, setEmailVerified] = useState(false)
  const [verificationCode, setVerificationCode] = useState('')
  const [verifying, setVerifying] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error' | 'info', text: string } | null>(null)
  const [codeExpiry, setCodeExpiry] = useState<Date | null>(null)

  useEffect(() => {
    fetchEmailStatus()
  }, [])

  const fetchEmailStatus = async () => {
    try {
      const token = localStorage.getItem('auth-token')
      const response = await fetch('/api/profile', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        setEmailVerified(data.security?.emailVerified || false)
      }
    } catch (error) {
      console.error('Error fetching email status:', error)
    }
  }

  const handleVerifyCode = async () => {
    if (!verificationCode || verificationCode.length !== 5) {
      setMessage({ type: 'error', text: 'Please enter a valid 5-digit code' })
      return
    }

    try {
      setVerifying(true)
      setMessage(null)
      
      const token = localStorage.getItem('auth-token')
      const response = await fetch('/api/user/verify-email', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ code: verificationCode })
      })

      const data = await response.json()

      if (response.ok) {
        setMessage({ type: 'success', text: 'Email verified successfully!' })
        setEmailVerified(true)
        setVerificationCode('')
        setTimeout(() => setMessage(null), 5000)
      } else {
        setMessage({ type: 'error', text: data.error || 'Verification failed' })
      }
    } catch (error) {
      console.error('Verify email error:', error)
      setMessage({ type: 'error', text: 'Failed to verify email' })
    } finally {
      setVerifying(false)
    }
  }

  if (emailVerified) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <Check className="h-8 w-8 text-green-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Email Verified</h3>
          <p className="text-gray-600">Your email address has been successfully verified.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Verification Code Input */}
      <div>
        <div className="flex items-start gap-4 mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <Mail className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <h4 className="font-medium text-blue-900 mb-1">Verification Code Required</h4>
            <p className="text-sm text-blue-800">
              Check your notifications for a 5-digit verification code sent by our admin team.
              Enter the code below to verify your email address.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Enter 5-Digit Verification Code
            </label>
            <Input
              type="text"
              placeholder="Enter code (e.g., 12345)"
              value={verificationCode}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, '').slice(0, 5)
                setVerificationCode(value)
              }}
              maxLength={5}
              className="text-center text-2xl tracking-widest font-mono"
              disabled={verifying}
            />
          </div>

          <Button
            onClick={handleVerifyCode}
            disabled={verifying || verificationCode.length !== 5}
            className="w-full bg-purple-700 hover:bg-purple-800"
          >
            {verifying ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Verifying...
              </>
            ) : (
              <>
                <Check className="h-4 w-4 mr-2" />
                Verify Email
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Messages */}
      {message && (
        <div
          className={`flex items-start gap-3 p-4 rounded-lg ${
            message.type === 'success'
              ? 'bg-green-50 border border-green-200'
              : message.type === 'error'
              ? 'bg-red-50 border border-red-200'
              : 'bg-blue-50 border border-blue-200'
          }`}
        >
          {message.type === 'success' && <Check className="h-5 w-5 text-green-600 mt-0.5" />}
          {message.type === 'error' && <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />}
          {message.type === 'info' && <Clock className="h-5 w-5 text-blue-600 mt-0.5" />}
          <p
            className={`text-sm flex-1 ${
              message.type === 'success'
                ? 'text-green-800'
                : message.type === 'error'
                ? 'text-red-800'
                : 'text-blue-800'
            }`}
          >
            {message.text}
          </p>
        </div>
      )}

      {/* Help Text */}
      <div className="p-4 bg-gray-50 rounded-lg">
        <h4 className="font-medium text-gray-900 mb-2">How to get your verification code:</h4>
        <ol className="text-sm text-gray-600 space-y-1 list-decimal list-inside">
          <li>An admin will send you a 5-digit verification code</li>
          <li>Check your notifications (bell icon) for the code</li>
          <li>Enter the code above to verify your email</li>
          <li>Code is valid for 15 minutes after being sent</li>
        </ol>
      </div>
    </div>
  )
}
