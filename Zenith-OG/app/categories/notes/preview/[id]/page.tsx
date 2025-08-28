"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Download, X } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default function NotePreviewPage({ params }: { params: { id: string } }) {
  const [currentPage, setCurrentPage] = useState(0)

  // Sample preview data (in real app, fetch based on params.id)
  const preview = {
    id: params.id,
    title: "Financial Accounting Fundamentals - Complete Study Guide",
    price: 85,
    totalPages: 45,
    previewPages: [
      "/placeholder.svg?height=1000&width=800&text=Preview+Page+1",
      "/placeholder.svg?height=1000&width=800&text=Preview+Page+2",
      "/placeholder.svg?height=1000&width=800&text=Preview+Page+3",
      "/placeholder.svg?height=1000&width=800&text=Preview+Page+4",
      "/placeholder.svg?height=1000&width=800&text=Preview+Page+5",
    ],
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
