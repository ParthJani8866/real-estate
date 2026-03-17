"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { Menu, X, User } from "lucide-react";

export default function Header() {
  const [user, setUser] = useState<any>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) setUser(true);
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    window.location.reload();
  };

  return (
    <header className="sticky top-0 z-50 backdrop-blur bg-white/80 dark:bg-black/80 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-3 flex justify-between items-center">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Image src="/logo.png" alt="logo" width={40} height={40} />
          <span className="text-lg font-bold text-blue-600">
            DreamHouse4Sale
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex gap-8 text-gray-700 dark:text-gray-300 font-medium">
          <Link href="/" className="hover:text-blue-600 transition">Home</Link>
          <Link href="/properties" className="hover:text-blue-600 transition">Properties</Link>
          <Link href="/reels" className="hover:text-blue-600 transition">Reels</Link>
          <Link href="/contact" className="hover:text-blue-600 transition">Contact</Link>
        </nav>

        {/* Right Section */}
        <div className="flex items-center gap-3">

          {/* Desktop Auth */}
          <div className="hidden md:flex gap-3 items-center">
            {user ? (
              <div className="relative group">
                <div className="flex items-center gap-2 cursor-pointer bg-gray-100 px-3 py-2 rounded-lg">
                  <User size={18} />
                  <span>Account</span>
                </div>

                {/* Dropdown */}
                <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-zinc-900 shadow-lg rounded-xl opacity-0 group-hover:opacity-100 transition p-2">
                  <Link href="/admin" className="block px-3 py-2 hover:bg-gray-100 rounded">
                    Dashboard
                  </Link>
                  <button
                    onClick={logout}
                    className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded text-red-500"
                  >
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <>
                <Link href="/login" className="px-4 py-2 border rounded-lg">
                  Login
                </Link>
                <Link href="/signup" className="px-4 py-2 bg-blue-600 text-white rounded-lg">
                  Signup
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white dark:bg-black px-6 py-4 space-y-4 shadow">
          <Link href="/" className="block">Home</Link>
          <Link href="/properties" className="block">Properties</Link>
          <Link href="/reels" className="block">Reels</Link>
          <Link href="/contact" className="block">Contact</Link>

          <hr />

          {user ? (
            <>
              <Link href="/admin" className="block">Dashboard</Link>
              <button onClick={logout} className="text-red-500">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="block">Login</Link>
              <Link href="/signup" className="block">Signup</Link>
            </>
          )}
        </div>
      )}
    </header>
  );
}