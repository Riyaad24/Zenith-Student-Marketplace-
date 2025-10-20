'use client'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md mx-auto text-center">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-red-600 mb-4">Oops!</h1>
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Something went wrong</h2>
          <p className="text-gray-600 mb-8">
            We're sorry, but something unexpected happened.
          </p>
        </div>
        
        <div className="space-y-4">
          <button
            onClick={reset}
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Try again
          </button>
          
          <div className="text-sm text-gray-500">
            <a href="/" className="text-purple-600 hover:text-purple-500">
              Go back home
            </a>
            {" | "}
            <a href="/browse" className="text-purple-600 hover:text-purple-500">
              Browse products
            </a>
          </div>
        </div>
        
        {process.env.NODE_ENV === 'development' && (
          <details className="mt-8 text-left bg-gray-100 p-4 rounded">
            <summary className="cursor-pointer font-medium">Error Details (Development)</summary>
            <pre className="mt-2 text-xs text-gray-700 overflow-auto">
              {error.message}
            </pre>
          </details>
        )}
      </div>
    </div>
  )
}