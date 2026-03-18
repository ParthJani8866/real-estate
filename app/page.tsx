'use client'

import { useEffect, useState } from 'react'
import Header from "./components/Header";
import Footer from "./components/Footer";
import Link from 'next/link'
import { Building2, Filter, HomeIcon, MapPin, Star, Video } from 'lucide-react';

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

        const url = `/api/properties?${params.toString()}`

        const res = await fetch(url)
        if (!res.ok) throw new Error(`HTTP error ${res.status}`)
        const data = await res.json()

        setProperties(data.properties || [])
      } catch (error) {
        console.error('Error fetching properties:', error)
        setError('Failed to load properties. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    fetchProperties()
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

            {/* Quick stats */}
            <div className="mt-12 flex flex-wrap items-center justify-center gap-8 text-sm text-blue-100/80">
              <div className="flex items-center gap-2">
                <div className="rounded-full bg-white/10 p-2">
                  <HomeIcon size={16} className="text-blue-300" />
                </div>
                <span>500+ verified properties</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="rounded-full bg-white/10 p-2">
                  <Video size={16} className="text-blue-300" />
                </div>
                <span>Video walkthroughs available</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="rounded-full bg-white/10 p-2">
                  <Star size={16} className="text-blue-300" />
                </div>
                <span>4.8 ★ customer rating</span>
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
          <h2 className="text-2xl font-bold mb-8 text-gray-800 dark:text-white">
            {loading ? 'Loading...' : properties.length ? 'Properties' : 'No properties found'}
          </h2>

          {error && (
            <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-6">
              {error}
            </div>
          )}

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-8">
              {properties.map((property) => {
                const displayArea = getDisplayArea(property)
                const locationText = getLocationText(property)
                return (
                  <div
                    key={property._id}
                    className="bg-white dark:bg-zinc-900 rounded-2xl overflow-hidden shadow hover:shadow-xl transition"
                  >
                    <div className="h-48 bg-gray-300 relative">
                      {property.images && property.images.length > 0 ? (
                        <img
                          src={property.images[0]}
                          alt={property.title}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/placeholder-house.jpg'
                          }}
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-400 flex items-center justify-center text-white">
                          No Image
                        </div>
                      )}
                    </div>

                    <div className="p-4">
                      <h3 className="text-lg font-semibold line-clamp-1">
                        {property.title || `${property.bhk} BHK Property`}
                      </h3>

                      <p className="text-gray-500 text-sm mt-1">
                        {formatPrice(property.price)} • {displayArea} sqft
                      </p>

                      <p className="text-gray-600 text-sm mt-1">
                        {locationText}
                      </p>

                      <div className="flex justify-between items-center mt-4">
                        <span className="text-sm text-gray-400">
                          {property.availabilityStatus === 'ready_to_move' ? 'Ready to Move' : 'Under Construction'}
                        </span>
                        <Link
                          href={`/property/${property._id}`}
                          className="text-blue-600 text-sm font-medium"
                        >
                          View Details →
                        </Link>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </section>

        {/* REELS and WHY US sections remain unchanged */}

      </main>

      <Footer />
    </>
  )
}