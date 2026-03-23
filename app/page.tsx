'use client'

import { useEffect, useState } from 'react'
import Header from "./components/Header";
import Footer from "./components/Footer";
import Link from 'next/link'
import { AlertCircle, ArrowRight, Bath, Bed, Building2, Check, Filter, HomeIcon, MapPin, Package, Square, Star, Video } from 'lucide-react';

interface Property {
  _id: string
  title: string
  price: number
  bhk: number
  areaSqft: number
  builtUpArea?: number
  carpetArea?: number
  purpose: string
  images: string[]
  cityId: { _id: string; name: string } | string | null
  areaId: { _id: string; name: string; cityId?: string } | string | null
  availabilityStatus: string
}

interface City {
  _id: string
  name: string
}

interface Area {
  _id: string
  name: string
  cityId: string
}

export default function Home() {
  const [properties, setProperties] = useState<Property[]>([])
  const [cities, setCities] = useState<City[]>([])
  const [areas, setAreas] = useState<Area[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showFilters, setShowFilters] = useState(false);

  // Filter states
  const [selectedPurpose, setSelectedPurpose] = useState('')
  const [selectedCity, setSelectedCity] = useState('')
  const [selectedArea, setSelectedArea] = useState('')
  const [selectedBhk, setSelectedBhk] = useState('')
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [submittedSearch, setSubmittedSearch] = useState('')

  // Autocomplete suggestions
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)

  // Fetch cities and areas
  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const [citiesRes, areasRes] = await Promise.all([
          fetch('/api/cities'),
          fetch('/api/areas')
        ])
        //if (!citiesRes.ok || !areasRes.ok) throw new Error('Failed to load filter data')
        const citiesData = await citiesRes.json()
        const areasData = await areasRes.json()
        setCities(citiesData)
        setAreas(areasData)
      } catch (error) {
        console.error('Error fetching filter data:', error)
      }
    }
    fetchFilters()
  }, [])

  // Fetch properties based on filters and search
  useEffect(() => {
    const controller = new AbortController()
    let ignore = false

    const delay = (ms: number) =>
      new Promise<void>((resolve, reject) => {
        const timeoutId = setTimeout(resolve, ms)
        controller.signal.addEventListener(
          'abort',
          () => {
            clearTimeout(timeoutId)
            reject(new DOMException('Aborted', 'AbortError'))
          },
          { once: true }
        )
      })

    const fetchProperties = async () => {
      setLoading(true)
      setError(null)

      try {
        const params = new URLSearchParams()
        if (selectedPurpose) params.append('purpose', selectedPurpose)
        if (selectedCity) params.append('city', selectedCity)
        if (selectedArea) params.append('area', selectedArea)
        if (selectedBhk) params.append('bhk', selectedBhk)
        if (minPrice) params.append('minPrice', minPrice)
        if (maxPrice) params.append('maxPrice', maxPrice)
        if (submittedSearch) params.append('search', submittedSearch)

        const query = params.toString()
        const url = query ? `/api/properties?${query}` : '/api/properties'

        const maxAttempts = 3
        let lastError: unknown = null

        for (let attempt = 1; attempt <= maxAttempts; attempt++) {
          try {
            const res = await fetch(url, { signal: controller.signal })

            if (!res.ok) {
              let body: unknown = null
              try {
                body = await res.json()
              } catch {
                // ignore parse errors; we'll still throw below
              }

              // Retry transient server errors.
              if (res.status >= 500 && res.status <= 599 && attempt < maxAttempts) {
                await delay(300 * attempt)
                continue
              }

              throw new Error(
                `Failed to fetch properties (HTTP ${res.status})${body ? `: ${JSON.stringify(body)}` : ''}`
              )
            }

            const data = await res.json()
            if (!ignore) setProperties(data.properties || [])
            return
          } catch (error) {
            if (controller.signal.aborted || (error instanceof DOMException && error.name === 'AbortError')) {
              return
            }

            lastError = error
            if (attempt < maxAttempts) {
              await delay(300 * attempt)
              continue
            }
          }
        }

        console.error('Error fetching properties:', lastError)
        if (!ignore) {
          const message = (() => {
            const fallback = 'Failed to load properties. Please try again.'
            if (!(lastError instanceof Error)) return fallback

            const match = lastError.message.match(/HTTP\s+(\d{3})/)
            const status = match ? Number(match[1]) : null

            if (status && status >= 500) return 'Server is temporarily unavailable. Please try again.'
            if (status && status >= 400) return 'Request failed. Please adjust filters and try again.'
            if (lastError.message.includes('Failed to fetch')) {
              return 'Network error. Please check your connection and try again.'
            }

            return fallback
          })()

          setError(message)
        }
      } finally {
        if (!ignore) setLoading(false)
      }
    }

    fetchProperties()

    return () => {
      ignore = true
      controller.abort()
    }
  }, [selectedPurpose, selectedCity, selectedArea, selectedBhk, minPrice, maxPrice, submittedSearch])

  // Build unique location names for autocomplete
  const allLocationNames = [
    ...cities.map(c => c.name),
    ...areas.map(a => a.name)
  ].filter((value, index, self) => self.indexOf(value) === index) // unique

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchQuery(value)
    if (value.length > 0) {
      const matches = allLocationNames
        .filter(name => name.toLowerCase().includes(value.toLowerCase()))
        .slice(0, 5) // show max 5 suggestions
      setSuggestions(matches)
      setShowSuggestions(true)
    } else {
      setSuggestions([])
      setShowSuggestions(false)
    }
  }

  const handleSuggestionClick = (suggestion: string) => {
    setSearchQuery(suggestion)
    setSuggestions([])
    setShowSuggestions(false)
    setSubmittedSearch(suggestion) // trigger search with selected suggestion
  }

  const handleSearch = () => {
    setSubmittedSearch(searchQuery)
    setShowSuggestions(false)
  }

  const filteredAreas = areas.filter(area => area.cityId === selectedCity)

  const formatPrice = (price: number) => {
    if (price >= 10000000) return `₹${(price / 10000000).toFixed(2)} Cr`
    if (price >= 100000) return `₹${(price / 100000).toFixed(2)} Lac`
    return `₹${price.toLocaleString()}`
  }

  const getDisplayArea = (property: Property) => {
    return property.areaSqft || property.builtUpArea || property.carpetArea || 0
  }

  const getLocationText = (property: Property) => {
    let location = ''
    if (property.areaId && typeof property.areaId === 'object' && property.areaId.name) {
      location = property.areaId.name
    }
    if (property.cityId && typeof property.cityId === 'object' && property.cityId.name) {
      location = location ? `${property.cityId.name}, ${location}` : property.cityId.name
    } else if (typeof property.cityId === 'string') {
      const city = cities.find(c => c._id === property.cityId)
      if (city) location = city.name
    }
    return location || 'Location not specified'
  }

  return (
    <>
      <Header />
      <main className="bg-zinc-50 dark:bg-black">

        {/* HERO SECTION */}
        <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 py-20 px-4 sm:px-6 lg:py-28">
          {/* Background abstract shapes */}
          <div className="absolute inset-0 opacity-30">
            <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-blue-400/30 blur-3xl" />
            <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-indigo-400/30 blur-3xl" />
          </div>

          <div className="relative mx-auto max-w-7xl text-center">
            {/* Badge */}
            <div className="mb-6 inline-flex items-center rounded-full bg-white/10 px-4 py-1.5 text-sm font-medium text-white/90 backdrop-blur-sm">
              🏡 Trusted by 10,000+ families
            </div>

            {/* Headline */}
            <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl">
              Find Your Dream Home in
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-indigo-200">
                Ahmedabad
              </span>
            </h1>

            {/* Subheadline */}
            <p className="mx-auto mt-6 max-w-2xl text-lg text-blue-100/80">
              Buy • Sell • Rent properties with immersive video reels & exclusive deals.
            </p>

            {/* Search bar with glass effect */}
            <div className="mx-auto mt-10 max-w-3xl transform transition-all duration-300 hover:scale-[1.02]">
              <div className="rounded-2xl bg-white/10 p-2 backdrop-blur-xl backdrop-filter sm:p-3">
                <div className="flex flex-col gap-3 sm:flex-row">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      placeholder="Search by area, project, or landmark..."
                      value={searchQuery}
                      onChange={handleSearchChange}
                      onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                      onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                      className="w-full rounded-xl border-0 bg-white/90 px-5 py-4 text-gray-900 placeholder-gray-500 outline-none ring-1 ring-inset ring-gray-300/50 transition-all focus:ring-2 focus:ring-blue-400 sm:py-3.5"
                    />
                    {showSuggestions && suggestions.length > 0 && (
                      <ul className="absolute left-0 right-0 z-10 mt-2 max-h-60 overflow-auto rounded-xl border border-gray-200 bg-white/90 p-1 shadow-2xl backdrop-blur-sm">
                        {suggestions.map((item, idx) => (
                          <li
                            key={idx}
                            onMouseDown={() => handleSuggestionClick(item)}
                            className="flex cursor-pointer items-center gap-3 rounded-lg px-4 py-2.5 text-gray-700 transition-colors hover:bg-blue-50"
                          >
                            <Building2 size={18} className="text-blue-500" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                  <button
                    onClick={handleSearch}
                    className="group relative inline-flex items-center justify-center overflow-hidden rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 px-8 py-4 font-semibold text-white shadow-lg transition-all duration-300 hover:shadow-blue-500/25 sm:px-10 sm:py-3.5"
                  >
                    <span className="absolute inset-0 bg-white/20 opacity-0 transition-opacity group-hover:opacity-100" />
                    Search
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FILTER SECTION – hidden on mobile */}
        <section className="hidden md:block max-w-7xl mx-auto px-6 py-8">
          <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-lg p-8">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Filter Properties</h2>
              <button
                onClick={() => {
                  setSelectedPurpose('');
                  setSelectedCity('');
                  setSelectedArea('');
                  setSelectedBhk('');
                  setMinPrice('');
                  setMaxPrice('');
                  setSearchQuery('');
                  setSubmittedSearch('');
                }}
                className="text-sm text-blue-600 hover:text-blue-800 font-medium"
              >
                Clear all filters
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
              {/* Purpose */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Purpose
                </label>
                <select
                  value={selectedPurpose}
                  onChange={(e) => setSelectedPurpose(e.target.value)}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2.5 bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">All</option>
                  <option value="sell">For Sale</option>
                  <option value="rent">For Rent</option>
                  <option value="pg">PG</option>
                </select>
              </div>

              {/* City */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  City
                </label>
                <select
                  value={selectedCity}
                  onChange={(e) => {
                    setSelectedCity(e.target.value);
                    setSelectedArea('');
                  }}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2.5 bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">All Cities</option>
                  {cities.map(city => (
                    <option key={city._id} value={city._id}>{city.name}</option>
                  ))}
                </select>
              </div>

              {/* Area */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Area
                </label>
                <select
                  value={selectedArea}
                  onChange={(e) => setSelectedArea(e.target.value)}
                  disabled={!selectedCity}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2.5 bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <option value="">All Areas</option>
                  {filteredAreas.map(area => (
                    <option key={area._id} value={area._id}>{area.name}</option>
                  ))}
                </select>
              </div>

              {/* BHK */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  BHK
                </label>
                <select
                  value={selectedBhk}
                  onChange={(e) => setSelectedBhk(e.target.value)}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2.5 bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Any</option>
                  {[1, 2, 3, 4, 5].map(num => (
                    <option key={num} value={num}>{num} BHK</option>
                  ))}
                </select>
              </div>

              {/* Price Range */}
              <div className="lg:col-span-2 xl:col-span-1">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Min Price (₹)
                </label>
                <input
                  type="number"
                  placeholder="Min"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2.5 bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="lg:col-span-2 xl:col-span-1">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Max Price (₹)
                </label>
                <input
                  type="number"
                  placeholder="Max"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2.5 bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>
        </section>

        {/* PROPERTIES LIST */}
        <section className="max-w-7xl mx-auto px-6 py-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
              {loading ? 'Loading...' : properties.length ? 'Properties' : 'No properties found'}
            </h2>
            {/* Optional: "View All" link */}
            {properties.length > 0 && (
              <Link href="/properties" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                View All →
              </Link>
            )}
          </div>

          {error && (
            <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-6 flex items-center gap-2">
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : properties.length === 0 ? (
            <div className="text-center py-16 bg-gray-50 dark:bg-zinc-800/50 rounded-2xl">
              <HomeIcon size={48} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-xl font-medium text-gray-600 dark:text-gray-300">No properties match your criteria</h3>
              <p className="text-gray-500 dark:text-gray-400 mt-2">Try adjusting your filters or check back later.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {properties.map((property) => {
                const displayArea = getDisplayArea(property);
                const locationText = getLocationText(property);
                const perSqftPrice = displayArea ? Math.round(property.price / displayArea) : null;

                // Determine badge colors based on purpose
                const purposeColors = {
                  sell: 'bg-green-500',
                  rent: 'bg-blue-500',
                  pg: 'bg-purple-500',
                }[property.purpose] || 'bg-gray-500';

                const statusText = property.availabilityStatus === 'ready_to_move' ? 'Ready to Move' : 'Under Construction';
                const statusColor = property.availabilityStatus === 'ready_to_move' ? 'bg-emerald-500' : 'bg-amber-500';

                return (
                  <div
                    key={property._id}
                    className="group bg-white dark:bg-zinc-900 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 dark:border-zinc-800"
                  >
                    {/* Image Container */}
                    <div className="relative h-52 overflow-hidden">
                      {property.images && property.images.length > 0 ? (
                        <img
                          src={property.images[0]}
                          alt={property.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/placeholder-house.jpg';
                          }}
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 dark:from-zinc-700 dark:to-zinc-800 flex items-center justify-center text-gray-500 dark:text-gray-400">
                          <HomeIcon size={40} />
                        </div>
                      )}

                      {/* Badges */}
                      <div className="absolute top-3 left-3 flex flex-col gap-2">
                        {property.availabilityStatus && (
                          <span className={`px-3 py-1 text-xs font-semibold text-white rounded-full shadow-lg ${statusColor}`}>
                            {statusText}
                          </span>
                        )}
                      </div>

                      {/* Optional Verified Badge */}

                      <div className="absolute top-3 right-3 bg-blue-600 text-white p-1.5 rounded-full shadow-lg">
                        <Check size={14} />
                      </div>

                    </div>

                    {/* Content */}
                    <div className="p-5">
                      {/* Title & Price */}
                      <div className="flex justify-between items-start gap-2">
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-white line-clamp-1 flex-1">
                          {property.title || `${property.bhk} BHK`}
                        </h3>
                        <div className="text-right">
                          <p className="text-xl font-bold text-blue-600 dark:text-blue-400">
                            ₹{formatPrice(property.price)}
                          </p>
                          {perSqftPrice && (
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              ₹{perSqftPrice}/sq.ft
                            </p>
                          )}
                        </div>
                      </div>
                      {/* Features Chips */}
                      <div className="flex flex-wrap gap-3 mt-4">
                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 dark:bg-zinc-800 rounded-full text-xs font-medium text-gray-700 dark:text-gray-300">
                          <MapPin size={16} />
                          {locationText}
                        </span>
                        {property.bhk && (
                          <span className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 dark:bg-zinc-800 rounded-full text-xs font-medium text-gray-700 dark:text-gray-300">
                            <Bed size={16} />
                            {property.bhk} BHK
                          </span>
                        )}

                        {displayArea && (
                          <span className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 dark:bg-zinc-800 rounded-full text-xs font-medium text-gray-700 dark:text-gray-300">
                            <Square size={16} />
                            {displayArea} sq.ft
                          </span>
                        )}
                      </div>

                      {/* Footer */}
                      <div className="flex justify-between items-center mt-5 pt-3 border-t border-gray-100 dark:border-zinc-800">

                        <Link
                          href={`/property/id/${property._id}`}
                          className="inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                        >
                          View Details
                          <ArrowRight size={16} />
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </main>
      <Footer />
    </>
  )
}
