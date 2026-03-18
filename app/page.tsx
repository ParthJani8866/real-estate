'use client'

import { useEffect, useState } from 'react'
import Header from "./components/Header";
import Footer from "./components/Footer";
import Link from 'next/link'

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

  // Filter states
  const [selectedPurpose, setSelectedPurpose] = useState('')
  const [selectedCity, setSelectedCity] = useState('')
  const [selectedArea, setSelectedArea] = useState('')
  const [selectedBhk, setSelectedBhk] = useState('')
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [searchQuery, setSearchQuery] = useState('')

  // Fetch cities and areas
  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const [citiesRes, areasRes] = await Promise.all([
          fetch('/api/cities'),
          fetch('/api/areas')
        ])
        if (!citiesRes.ok || !areasRes.ok) throw new Error('Failed to load filter data')
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

  // Fetch properties based on filters
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

        const url = `/api/properties?${params.toString()}`
        console.log('Fetching properties from:', url) // Debug log

        const res = await fetch(url)
        if (!res.ok) throw new Error(`HTTP error ${res.status}`)
        const data = await res.json()
        console.log('Properties received:', data.properties?.length || 0) // Debug log

        setProperties(data.properties || [])
      } catch (error) {
        console.error('Error fetching properties:', error)
        setError('Failed to load properties. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    fetchProperties()
  }, [selectedPurpose, selectedCity, selectedArea, selectedBhk, minPrice, maxPrice])

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
      // If cityId is string, find city name from cities array
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
        <section className="relative py-20 px-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
          {/* ... (same as before) ... */}
          <div className="max-w-6xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold leading-tight">
              Find Your Dream Home in Ahmedabad
            </h1>
            <p className="mt-4 text-lg opacity-90">
              Buy • Sell • Rent properties with video reels & best deals
            </p>

            <div className="mt-8 bg-white rounded-xl p-3 flex flex-col md:flex-row gap-3 shadow-lg">
              <input
                type="text"
                placeholder="Search by area, city, project..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 px-4 py-3 rounded-lg text-black outline-none"
              />
              <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700">
                Search
              </button>
            </div>

            <div className="mt-6 flex justify-center gap-4">
              <Link
                href="/properties"
                className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold"
              >
                Browse Properties
              </Link>
              <Link
                href="/post-property"
                className="border border-white px-6 py-3 rounded-lg"
              >
                Post Property
              </Link>
            </div>
          </div>
        </section>

        {/* FILTER SECTION */}
        <section className="max-w-7xl mx-auto px-6 py-8">
          <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Filter Properties</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <select
                value={selectedPurpose}
                onChange={(e) => setSelectedPurpose(e.target.value)}
                className="border rounded-lg px-3 py-2"
              >
                <option value="">Purpose</option>
                <option value="sell">Sell</option>
                <option value="rent">Rent</option>
                <option value="pg">PG</option>
              </select>

              <select
                value={selectedCity}
                onChange={(e) => {
                  setSelectedCity(e.target.value)
                  setSelectedArea('')
                }}
                className="border rounded-lg px-3 py-2"
              >
                <option value="">City</option>
                {cities.map(city => (
                  <option key={city._id} value={city._id}>{city.name}</option>
                ))}
              </select>

              <select
                value={selectedArea}
                onChange={(e) => setSelectedArea(e.target.value)}
                disabled={!selectedCity}
                className="border rounded-lg px-3 py-2 disabled:opacity-50"
              >
                <option value="">Area</option>
                {filteredAreas.map(area => (
                  <option key={area._id} value={area._id}>{area.name}</option>
                ))}
              </select>

              <select
                value={selectedBhk}
                onChange={(e) => setSelectedBhk(e.target.value)}
                className="border rounded-lg px-3 py-2"
              >
                <option value="">BHK</option>
                {[1,2,3,4,5].map(num => (
                  <option key={num} value={num}>{num} BHK</option>
                ))}
              </select>

              <input
                type="number"
                placeholder="Min Price (₹)"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="border rounded-lg px-3 py-2"
              />

              <input
                type="number"
                placeholder="Max Price (₹)"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="border rounded-lg px-3 py-2"
              />
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