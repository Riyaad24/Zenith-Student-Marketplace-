'use client'

import React from 'react'

export default function EmptyCartIllustration({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <svg
        width="200"
        height="160"
        viewBox="0 0 200 160"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto max-w-xs"
      >
        {/* Background elements */}
        <ellipse cx="40" cy="140" rx="15" ry="8" fill="#E5E7EB" opacity="0.5" />
        <ellipse cx="160" cy="145" rx="20" ry="10" fill="#E5E7EB" opacity="0.3" />
        
        {/* Building/boxes in background */}
        <rect x="140" y="60" width="40" height="60" fill="#F3F4F6" rx="4" />
        <rect x="145" y="65" width="8" height="8" fill="#D1D5DB" rx="1" />
        <rect x="155" y="65" width="8" height="8" fill="#D1D5DB" rx="1" />
        <rect x="167" y="65" width="8" height="8" fill="#D1D5DB" rx="1" />
        <rect x="145" y="75" width="8" height="8" fill="#D1D5DB" rx="1" />
        <rect x="167" y="75" width="8" height="8" fill="#D1D5DB" rx="1" />
        
        <rect x="155" y="40" width="35" height="50" fill="#E5E7EB" rx="4" />
        <rect x="160" y="45" width="6" height="6" fill="#D1D5DB" rx="1" />
        <rect x="170" y="45" width="6" height="6" fill="#D1D5DB" rx="1" />
        <rect x="160" y="55" width="6" height="6" fill="#D1D5DB" rx="1" />
        <rect x="170" y="55" width="6" height="6" fill="#D1D5DB" rx="1" />
        
        {/* Plant */}
        <rect x="165" y="120" width="12" height="25" fill="#6B7280" rx="6" />
        <path d="M171 115 Q175 110 179 115 Q177 118 175 120 Q173 118 171 115Z" fill="#059669" />
        <path d="M171 112 Q167 107 163 112 Q165 115 167 117 Q169 115 171 112Z" fill="#10B981" />
        <path d="M171 118 Q175 113 179 118 Q177 121 175 123 Q173 121 171 118Z" fill="#34D399" />
        
        {/* Person */}
        {/* Head */}
        <circle cx="60" cy="45" r="12" fill="#FBBF24" />
        {/* Hair */}
        <path d="M48 42 Q50 35 55 33 Q65 31 72 38 Q74 45 70 50 Q65 48 60 48 Q55 48 50 46 Q48 44 48 42Z" fill="#1F2937" />
        {/* Face details */}
        <circle cx="57" cy="43" r="1" fill="#1F2937" />
        <circle cx="63" cy="43" r="1" fill="#1F2937" />
        <path d="M58 47 Q60 49 62 47" stroke="#1F2937" strokeWidth="1" fill="none" />
        
        {/* Body */}
        <rect x="50" y="57" width="20" height="25" fill="#8B5CF6" rx="10" />
        
        {/* Arms */}
        <rect x="42" y="62" width="8" height="18" fill="#FBBF24" rx="4" />
        <rect x="70" y="62" width="8" height="18" fill="#FBBF24" rx="4" />
        
        {/* Legs */}
        <rect x="52" y="82" width="6" height="25" fill="#1F2937" rx="3" />
        <rect x="62" y="82" width="6" height="25" fill="#1F2937" rx="3" />
        
        {/* Feet */}
        <ellipse cx="55" cy="110" rx="4" ry="3" fill="#8B5CF6" />
        <ellipse cx="65" cy="110" rx="4" ry="3" fill="#8B5CF6" />
        
        {/* Shopping boxes/packages */}
        <rect x="80" y="95" width="25" height="20" fill="#8B5CF6" rx="3" />
        <rect x="85" y="90" width="15" height="15" fill="#A855F7" rx="2" />
        <rect x="105" y="100" width="20" height="15" fill="#7C3AED" rx="2" />
        
        {/* Box details */}
        <rect x="82" y="97" width="21" height="2" fill="#7C3AED" />
        <rect x="89" y="97" width="2" height="16" fill="#7C3AED" />
        
        {/* Thought bubble */}
        <circle cx="35" cy="30" r="8" fill="white" stroke="#E5E7EB" strokeWidth="2" />
        <circle cx="30" cy="35" r="4" fill="white" stroke="#E5E7EB" strokeWidth="1" />
        <circle cx="27" cy="40" r="2" fill="white" stroke="#E5E7EB" strokeWidth="1" />
        
        {/* Exclamation mark in thought bubble */}
        <rect x="33" y="25" width="2" height="6" fill="#8B5CF6" rx="1" />
        <circle cx="34" cy="33" r="1" fill="#8B5CF6" />
      </svg>
    </div>
  )
}