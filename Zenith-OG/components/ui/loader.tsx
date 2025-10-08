import React from 'react'

interface LoaderProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export const Loader: React.FC<LoaderProps> = ({ size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-10 h-10',
    lg: 'w-16 h-16'
  }

  return (
    <div 
      className={`loader ${sizeClasses[size]} ${className}`}
      role="status"
      aria-label="Loading"
    />
  )
}

// Full page loader component
export const PageLoader: React.FC = () => {
  return (
    <div className="fixed inset-0 bg-white bg-opacity-75 flex items-center justify-center z-50">
      <div className="text-center">
        <Loader size="lg" />
        <p className="mt-4 text-gray-600">Loading...</p>
      </div>
    </div>
  )
}

// Inline loader for buttons and small components
export const InlineLoader: React.FC<{ text?: string }> = ({ text = "Loading..." }) => {
  return (
    <div className="flex items-center justify-center space-x-2">
      <Loader size="sm" />
      <span className="text-sm text-gray-600">{text}</span>
    </div>
  )
}

export default Loader