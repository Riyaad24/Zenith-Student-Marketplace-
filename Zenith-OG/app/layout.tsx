import { Inter } from "next/font/google"
import "./globals.css"
import Header from "@/components/header"
import Footer from "@/components/footer"
import ClientLayout from "@/components/client-layout"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Zenith Student Marketplace - Buy, Sell & Trade Study Materials in South Africa",
  description: "A safe, affordable, and accessible marketplace for university and college students in South Africa to buy, sell, rent or trade study materials, electronics, and tutoring services.",
  keywords: "student marketplace, South Africa, university, college, textbooks, study materials, electronics, tutoring, buy, sell, trade",
  author: "Zenith Student Marketplace",
  robots: "index, follow",
  openGraph: {
    title: "Zenith Student Marketplace - Student Trading Platform",
    description: "Join thousands of South African students buying, selling, and trading study materials safely and affordably.",
    type: "website",
    locale: "en_ZA",
  },
  generator: 'v0.app'
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="light">
      <body className={inter.className}>
        <ClientLayout>
          <a href="#main-content" className="skip-link">Skip to main content</a>
          <Header />
          <main id="main-content">{children}</main>
          <Footer />
        </ClientLayout>
      </body>
    </html>
  )
}
