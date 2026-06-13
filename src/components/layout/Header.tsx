'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { Menu, X, LogOut, User, Home } from 'lucide-react'

export function Header() {
  const { data: session } = useSession()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">M&P</span>
            </div>
            <span className="font-bold text-lg text-gray-900 hidden sm:inline">
              McMaster & Paul Auctions
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/auctions" className="text-gray-700 hover:text-blue-600 font-medium">
              Auctions
            </Link>
            <Link href="/categories" className="text-gray-700 hover:text-blue-600 font-medium">
              Categories
            </Link>
            {session?.user?.role === 'ADMIN' && (
              <Link href="/admin" className="text-gray-700 hover:text-blue-600 font-medium">
                Admin
              </Link>
            )}
          </nav>

          {/* User Menu */}
          <div className="flex items-center gap-4">
            {session?.user ? (
              <div className="hidden sm:flex items-center gap-4">
                <span className="text-sm text-gray-700">{session.user.email}</span>
                <Link
                  href="/account"
                  className="text-gray-700 hover:text-blue-600 font-medium flex items-center gap-2"
                >
                  <User className="w-5 h-5" />
                  Account
                </Link>
                <button
                  onClick={() => signOut()}
                  className="text-gray-700 hover:text-blue-600 font-medium flex items-center gap-2"
                >
                  <LogOut className="w-5 h-5" />
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-4">
                <Link
                  href="/login"
                  className="text-gray-700 hover:text-blue-600 font-medium"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium"
                >
                  Register
                </Link>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden border-t border-gray-200 py-4 space-y-3">
            <Link
              href="/auctions"
              className="block text-gray-700 hover:text-blue-600 font-medium px-4"
            >
              Auctions
            </Link>
            <Link
              href="/categories"
              className="block text-gray-700 hover:text-blue-600 font-medium px-4"
            >
              Categories
            </Link>
            {session?.user?.role === 'ADMIN' && (
              <Link
                href="/admin"
                className="block text-gray-700 hover:text-blue-600 font-medium px-4"
              >
                Admin
              </Link>
            )}
            {session?.user ? (
              <>
                <Link
                  href="/account"
                  className="block text-gray-700 hover:text-blue-600 font-medium px-4"
                >
                  Account
                </Link>
                <button
                  onClick={() => signOut()}
                  className="block w-full text-left text-gray-700 hover:text-blue-600 font-medium px-4 py-2"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="block text-gray-700 hover:text-blue-600 font-medium px-4"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="block bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium mx-4"
                >
                  Register
                </Link>
              </>
            )}
          </nav>
        )}
      </div>
    </header>
  )
}
