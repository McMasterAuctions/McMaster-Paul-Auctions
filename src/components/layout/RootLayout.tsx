'use client'

import { useEffect, useState } from 'react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { SessionProvider } from 'next-auth/react'
import type { ReactNode } from 'react'

export function RootLayout({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, []
  )

  if (!mounted) return null

  return (
    <SessionProvider>
      <html lang="en">
        <head>
          <meta charSet="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <title>McMaster & Paul Auctions - Online Auction Platform Canada</title>
          <meta
            name="description"
            content="Canada's leading online auction platform. Buy and sell items through live auctions. Browse auctions by category."
          />
        </head>
        <body className="bg-gray-50">
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
              {children}
            </main>
            <Footer />
          </div>
        </body>
      </html>
    </SessionProvider>
  )
}
