"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function Header() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) setUser(true); // later decode JWT for real user
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    window.location.reload();
  };

  return (
    <header className="bg-white dark:bg-black shadow">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/logo.png"
            alt="DreamHouse4Sale"
            width={160}
            height={40}
            priority
          />
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex gap-6 text-gray-700 dark:text-gray-300">
          <Link href="/">Home</Link>
          <Link href="/properties">Properties</Link>
          <Link href="/reels">Reels</Link>
          <Link href="/contact">Contact</Link>
        </nav>

        {/* Auth Buttons */}
        <div className="flex gap-3">
          {user ? (
            <>
              <Link
                href="/admin"
                className="bg-gray-200 px-4 py-2 rounded-lg"
              >
                Dashboard
              </Link>
              <button
                onClick={logout}
                className="bg-red-500 text-white px-4 py-2 rounded-lg"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="border px-4 py-2 rounded-lg"
              >
                Login
              </Link>
              <Link
                href="/signup"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg"
              >
                Signup
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}