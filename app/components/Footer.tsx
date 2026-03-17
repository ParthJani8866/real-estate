import Link from 'next/link'
import React from 'react'

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-10">
      <div className="max-w-7xl mx-auto px-6 py-10 grid md:grid-cols-4 gap-8">

        {/* Brand */}
        <div>
          <h2 className="text-xl font-bold text-white mb-3">
            DreamHouse4Sale
          </h2>
          <p className="text-sm">
            Find your dream property in Ahmedabad with verified listings,
            latest deals, and video reels.
          </p>
        </div>

        {/* Links */}
        <div>
          <h3 className="text-white font-semibold mb-3">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li><Link href="/">Home</Link></li>
            <li><Link href="/properties">Properties</Link></li>
            <li><Link href="/reels">Reels</Link></li>
            <li><Link href="/contact">Contact</Link></li>
          </ul>
        </div>

        {/* Locations */}
        <div>
          <h3 className="text-white font-semibold mb-3">Top Areas</h3>
          <ul className="space-y-2 text-sm">
            <li><Link href="/bopal-properties">Bopal</Link></li>
            <li><Link href="/satellite-properties">Satellite</Link></li>
            <li><Link href="/navrangpura-properties">Navrangpura</Link></li>
            <li><Link href="/sg-highway-properties">SG Highway</Link></li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-white font-semibold mb-3">Contact</h3>
          <p className="text-sm">Email: info@dreamhouse4sale.com</p>
          <p className="text-sm mt-2">Phone: +91 9876543210</p>
        </div>

      </div>

      {/* Bottom */}
      <div className="border-t border-gray-700 text-center py-4 text-sm">
        © {new Date().getFullYear()} DreamHouse4Sale. All rights reserved.
      </div>
    </footer>
  )
}

export default Footer