export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md mx-auto text-center">
        <div className="mb-8">
          <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
          <h2 className="text-2xl font-semibold text-gray-700 mb-2">Page Not Found</h2>
          <p className="text-gray-600 mb-8">
            Sorry, we couldn't find the page you're looking for.
          </p>
        </div>
        
        <div className="space-y-4">
          <a
            href="/"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
          >
            Go back home
          </a>
          
          <div className="text-sm text-gray-500">
            <a href="/browse" className="text-purple-600 hover:text-purple-500">
              Browse products
            </a>
            {" | "}
            <a href="/categories" className="text-purple-600 hover:text-purple-500">
              View categories
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}