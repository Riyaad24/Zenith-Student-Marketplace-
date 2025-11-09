import Image from "next/image"

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-2xl mx-auto text-center">
        {/* 404 Illustration */}
        <div className="mb-8 flex justify-center">
          <div className="relative w-full max-w-md aspect-square">
            <Image
              src="/404-error.png"
              alt="404 Page Not Found"
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>
        
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Oops! Page Not Found</h2>
          <p className="text-lg text-gray-600 mb-8">
            Sorry, we couldn't find the page you're looking for. It might have been moved or deleted.
          </p>
        </div>
        
        <div className="space-y-4">
          <a
            href="/"
            className="inline-flex items-center px-8 py-4 border border-transparent text-base font-medium rounded-lg text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors"
          >
            Go back home
          </a>
          
          <div className="text-sm text-gray-500">
            <a href="/browse" className="text-purple-600 hover:text-purple-500 font-medium">
              Browse products
            </a>
            {" | "}
            <a href="/categories" className="text-purple-600 hover:text-purple-500 font-medium">
              View categories
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}