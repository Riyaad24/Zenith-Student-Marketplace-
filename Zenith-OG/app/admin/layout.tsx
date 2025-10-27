import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Admin Portal - Zenith Student Marketplace',
  description: 'Admin dashboard for managing the Zenith Student Marketplace',
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}