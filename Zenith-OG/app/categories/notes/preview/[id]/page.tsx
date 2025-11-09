"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Download, X } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default function NotePreviewPage({ params }: { params: { id: string } }) {
  const [currentPage, setCurrentPage] = useState(0)
  const [preview, setPreview] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  // Fetch real preview data from API
  useEffect(() => {
    const fetchPreview = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/products/${params.id}`)
        if (response.ok) {
          const data = await response.json()
          setPreview({
            id: data.id,
            title: data.title,
            price: data.price,
            totalPages: data.pages || 0,
            previewPages: data.images || []
          })
        } else {
          console.error('Failed to fetch preview')
        }
      } catch (error) {
        console.error('Error fetching preview:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchPreview()
  }, [params.id])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white">Loading preview...</div>
      </div>
    )
  }

  if (!preview || !preview.previewPages || preview.previewPages.length === 0) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center text-white">
          <p className="mb-4">No preview available for this item</p>
          <Link href={`/categories/notes/${params.id}`}>
            <Button>Back to Details</Button>
          </Link>
        </div>
      </div>
    )
  }

  const nextPage = () => {
    if (currentPage < preview.previewPages.length - 1) {
      setCurrentPage(currentPage + 1)
    }
  }

  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1)
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      {/* Header */}
      <div className="bg-gray-800 text-white p-4">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href={`/categories/notes/${params.id}`}>
              <Button variant="ghost" size="icon" className="text-white">
                <X className="h-5 w-5" />
              </Button>
            </Link>
            <h1 className="text-lg font-medium truncate">{preview.title}</h1>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm">
              Preview Page {currentPage + 1} of {preview.previewPages.length}
            </span>
            <Button className="bg-purple-600 hover:bg-purple-700">
              <Download className="h-4 w-4 mr-2" />
              Buy for R{preview.price}
            </Button>
          </div>
        </div>
      </div>

      {/* Preview Content */}
      <div className="flex-1 flex items-center justify-center p-4 relative">
        <div className="relative h-[80vh] w-full max-w-3xl mx-auto">
          <Image
            src={preview.previewPages[currentPage] || "/placeholder.svg"}
            alt={`Preview page ${currentPage + 1}`}
            fill
            className="object-contain"
          />
        </div>

        {/* Navigation Controls */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute left-4 top-1/2 -translate-y-1/2 text-white bg-black/30 hover:bg-black/50"
          onClick={prevPage}
          disabled={currentPage === 0}
        >
          <ChevronLeft className="h-8 w-8" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-4 top-1/2 -translate-y-1/2 text-white bg-black/30 hover:bg-black/50"
          onClick={nextPage}
          disabled={currentPage === preview.previewPages.length - 1}
        >
          <ChevronRight className="h-8 w-8" />
        </Button>
      </div>

      {/* Footer */}
      <div className="bg-gray-800 text-white p-4">
        <div className="container mx-auto flex items-center justify-center">
          <div className="flex items-center gap-2">
            {preview.previewPages.map((_, index) => (
              <Button
                key={index}
                variant={currentPage === index ? "default" : "outline"}
                size="sm"
                className={currentPage === index ? "bg-purple-600" : "text-white border-gray-600"}
                onClick={() => setCurrentPage(index)}
              >
                {index + 1}
              </Button>
            ))}
          </div>
        </div>
        <div className="text-center mt-4 text-sm text-gray-400">
          This is a preview. Purchase to access all {preview.totalPages} pages.
        </div>
      </div>
    </div>
  )
}
