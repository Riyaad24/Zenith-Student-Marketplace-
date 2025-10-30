"use client"

import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react'

type ToastType = 'success' | 'error' | 'info'

interface ToastMessage {
  id: number
  type: ToastType
  text: string
}

interface ToastContextValue {
  showToast: (type: ToastType, text: string, duration?: number) => void
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined)

export function ToastProvider({ children }: { children: ReactNode }) {
  const [messages, setMessages] = useState<ToastMessage[]>([])

  const showToast = useCallback((type: ToastType, text: string, duration = 4000) => {
    const id = Date.now() + Math.floor(Math.random() * 1000)
    const msg: ToastMessage = { id, type, text }
    setMessages((m) => [...m, msg])

    setTimeout(() => {
      setMessages((m) => m.filter((x) => x.id !== id))
    }, duration)
  }, [])

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div aria-live="polite" className="fixed top-4 right-4 z-50 flex flex-col gap-3">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`max-w-sm w-full px-4 py-2 rounded shadow-lg text-sm font-medium text-white ${
              m.type === 'success' ? 'bg-green-600' : m.type === 'error' ? 'bg-red-600' : 'bg-blue-600'
            }`}
          >
            {m.text}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within a ToastProvider')
  return ctx
}

export default ToastProvider
