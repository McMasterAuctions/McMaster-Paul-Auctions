import type { Metadata } from 'next'
import './globals.css'
import { RootLayout } from '@/components/layout/RootLayout'

export const metadata: Metadata = {
  title: 'McMaster & Paul Auctions',
  description: 'Canada\'s leading online auction platform',
}

export default function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  return <RootLayout>{children}</RootLayout>
}
