import Link from 'next/link'
import React from 'react'

const Header: React.FC = () => {
  return (
    <header className="w-full bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <div className="bg-blue-600 text-white px-3 py-1 rounded-lg font-bold text-lg">
            DH
          </div>
          <span className="text-xl font-semibold text-gray-800">
            DreamHouse4Sale
          </span>
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex items-center space-x-6 text-gray-700 font-medium">
          <Link href="/">Home</Link>
          <Link href="/properties">Properties</Link>
          <Link href="/reels">Reels</Link>
          <Link href="/contact">Contact</Link>
        </nav>

        {/* CTA */}
        <div className="hidden md:block">
          <Link href="/post-property">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition">
              Post Property
            </button>
          </Link>
        </div>

      </div>
    </header>
  )
}

export default Header