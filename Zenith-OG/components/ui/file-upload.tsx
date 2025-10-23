"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { validateVerificationFile } from "@/lib/validation"
import { Upload, Check, X, FileText, User, CreditCard } from "lucide-react"
import Image from "next/image"

interface FileUploadProps {
  type: 'profile' | 'studentCard' | 'idDocument'
  currentFile?: string | null
  onUploadSuccess: (url: string) => void
  title: string
  description: string
  acceptedFormats: string
  maxSize: string
}

const typeIcons = {
  profile: User,
  studentCard: CreditCard,
  idDocument: FileText
}

export function FileUpload({ 
  type, 
  currentFile, 
  onUploadSuccess, 
  title, 
  description,
  acceptedFormats,
  maxSize
}: FileUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const Icon = typeIcons[type]

  const handleFileSelect = async (file: File) => {
    setError(null)
    
    // Validate file
    const validation = validateVerificationFile(file, type)
    if (!validation.isValid) {
      setError(validation.error || 'Invalid file')
      return
    }

    setUploading(true)

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('type', type)

      const response = await fetch('/api/upload', {
        method: 'POST',
        credentials: 'include',
        body: formData
      })

      const result = await response.json()

      if (response.ok) {
        onUploadSuccess(result.url)
      } else {
        setError(result.error || 'Upload failed')
      }
    } catch (error) {
      setError('Upload failed. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    
    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0) {
      handleFileSelect(files[0])
    }
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length > 0) {
      handleFileSelect(files[0])
    }
  }

  const isImage = currentFile && (currentFile.endsWith('.jpg') || currentFile.endsWith('.jpeg') || currentFile.endsWith('.png') || currentFile.endsWith('.webp'))

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Icon className="h-5 w-5" />
          {title}
          {currentFile && (
            <div className="ml-auto">
              <Check className="h-5 w-5 text-green-600" />
            </div>
          )}
        </CardTitle>
        <p className="text-sm text-gray-600">{description}</p>
      </CardHeader>
      <CardContent>
        {currentFile ? (
          <div className="space-y-4">
            <div className="border rounded-lg p-4 bg-green-50">
              {isImage ? (
                <div className="flex items-center gap-4">
                  <div className="relative w-16 h-16 rounded-lg overflow-hidden">
                    <Image
                      src={currentFile}
                      alt={title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-green-700">✓ File uploaded successfully</p>
                    <p className="text-sm text-green-600">Your {title.toLowerCase()} has been uploaded and is ready for verification.</p>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-lg bg-green-100 flex items-center justify-center">
                    <FileText className="h-8 w-8 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-green-700">✓ File uploaded successfully</p>
                    <p className="text-sm text-green-600">Your {title.toLowerCase()} has been uploaded and is ready for verification.</p>
                  </div>
                </div>
              )}
            </div>
            
            <Button
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="w-full"
            >
              Replace File
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                dragOver 
                  ? 'border-purple-400 bg-purple-50' 
                  : 'border-gray-300 hover:border-purple-400'
              }`}
              onDrop={handleDrop}
              onDragOver={(e) => {
                e.preventDefault()
                setDragOver(true)
              }}
              onDragLeave={() => setDragOver(false)}
            >
              <Upload className={`h-12 w-12 mx-auto mb-4 ${dragOver ? 'text-purple-500' : 'text-gray-400'}`} />
              <div className="space-y-2">
                <p className="text-lg font-medium">Drop your file here</p>
                <p className="text-sm text-gray-600">or</p>
                <Button
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="mt-2"
                >
                  {uploading ? 'Uploading...' : 'Choose File'}
                </Button>
              </div>
              <div className="mt-4 text-xs text-gray-500">
                <p>Accepted formats: {acceptedFormats}</p>
                <p>Maximum size: {maxSize}</p>
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                <div className="flex items-center gap-2">
                  <X className="h-4 w-4 text-red-500" />
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            )}
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept={type === 'profile' ? 'image/*' : 'image/*,.pdf'}
          onChange={handleFileInputChange}
        />
      </CardContent>
    </Card>
  )
}