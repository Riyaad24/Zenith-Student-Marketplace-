"use client"

import { Check, Clock, AlertCircle, Shield } from "lucide-react"

interface VerificationBadgeProps {
  documentsUploaded: boolean
  adminVerified: boolean
  verifiedAt?: string | null
  size?: 'sm' | 'md' | 'lg'
  showText?: boolean
}

export function VerificationBadge({ 
  documentsUploaded, 
  adminVerified, 
  verifiedAt,
  size = 'md',
  showText = true 
}: VerificationBadgeProps) {
  const getVerificationStatus = () => {
    if (adminVerified) {
      return {
        status: 'verified',
        icon: Check,
        color: 'text-green-600',
        bgColor: 'bg-green-100',
        text: 'Verified Student',
        description: 'Your account has been verified by Zenith support'
      }
    }
    
    if (documentsUploaded) {
      return {
        status: 'pending',
        icon: Clock,
        color: 'text-yellow-600',
        bgColor: 'bg-yellow-100',
        text: 'Verification Pending',
        description: 'Your documents are being reviewed by Zenith support'
      }
    }
    
    return {
      status: 'incomplete',
      icon: AlertCircle,
      color: 'text-gray-600',
      bgColor: 'bg-gray-100',
      text: 'Verification Incomplete',
      description: 'Upload your profile picture, student card, and ID to get verified'
    }
  }

  const verification = getVerificationStatus()
  const Icon = verification.icon

  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6'
  }

  const badgeSizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-8 w-8',
    lg: 'h-10 w-10'
  }

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  }

  if (!showText) {
    return (
      <div 
        className={`rounded-full ${verification.bgColor} p-1 flex items-center justify-center ${badgeSizeClasses[size]}`}
        title={verification.description}
      >
        <Icon className={`${sizeClasses[size]} ${verification.color}`} />
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2">
      <div 
        className={`rounded-full ${verification.bgColor} p-1 flex items-center justify-center ${badgeSizeClasses[size]}`}
      >
        <Icon className={`${sizeClasses[size]} ${verification.color}`} />
      </div>
      <div>
        <span className={`font-medium ${verification.color} ${textSizeClasses[size]}`}>
          {verification.text}
        </span>
        {size !== 'sm' && (
          <p className="text-xs text-gray-500 max-w-xs">
            {verification.description}
          </p>
        )}
        {adminVerified && verifiedAt && (
          <p className="text-xs text-green-600">
            Verified on {new Date(verifiedAt).toLocaleDateString()}
          </p>
        )}
      </div>
    </div>
  )
}

export function VerificationShield({ 
  adminVerified, 
  documentsUploaded, 
  size = 'md' 
}: { 
  adminVerified: boolean
  documentsUploaded: boolean
  size?: 'sm' | 'md' | 'lg' 
}) {
  if (!adminVerified && !documentsUploaded) return null

  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5', 
    lg: 'h-6 w-6'
  }

  return (
    <div className="relative">
      <Shield className={`${sizeClasses[size]} ${adminVerified ? 'text-green-600' : 'text-yellow-600'} fill-current`} />
      {adminVerified && (
        <Check className="h-3 w-3 text-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
      )}
    </div>
  )
}