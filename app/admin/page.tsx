'use client'

import { useEffect, useState } from 'react'
import {
  Building2, Home, MapPin, Camera, Bed, Bath,
  Maximize, ChevronRight, ChevronLeft, Check,
  Wifi, Shield, Car, TreePine, Droplets, Sparkles,
  Sun, Moon, Droplet, Zap, Key, FileText, Image,
  Video, Phone, Mail, AlertCircle, Plus, Trash2,
  Edit, Eye, Star
} from 'lucide-react'
import { Property } from '../../app/types/property'

interface City {
  _id: string
  name: string
  state?: string
  country?: string
}

interface Area {
  _id: string
  name: string
  cityId: string
  pincode?: string
}

interface PropertyForm {
  // Basic Details
  purpose: 'sell' | 'rent' | 'pg'
  propertyType: 'residential' | 'commercial'
  category: string

  // Pricing
  price: number

  // Property Profile
  bhk: number
  bathrooms: number
  balconies: number
  areaSqft: number
  builtUpArea: number
  carpetArea: number
  totalFloors: number
  floorNumber: number
  furnishing: 'furnished' | 'semi-furnished' | 'unfurnished'
  availabilityStatus: 'ready_to_move' | 'under_construction'

  // Location
  cityId: string
  areaId: string
  address: string
  location: {
    lat: number
    lng: number
  }

  // Property Info
  title: string
  description: string
  slug: string

  // Media
  images: string[]
  videos: string[]

  // Amenities & Features
  amenities: string[]
  features: string[]
  societyFeatures: string[]

  // Additional
  parking: {
    covered: number
    open: number
  }
  powerBackup: 'none' | 'partial' | 'full'
  facing: string
  flooring: string
  roadWidth: number
}

export default function AdminDashboard() {
  const [properties, setProperties] = useState<Property[]>([])
  const [step, setStep] = useState(1)
  const [propertyScore, setPropertyScore] = useState(27)
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([])
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([])
  const [selectedSocietyFeatures, setSelectedSocietyFeatures] = useState<string[]>([])
  const [uploadedImages, setUploadedImages] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [cities, setCities] = useState<City[]>([])
  const [areas, setAreas] = useState<Area[]>([])

  const categories = [
    'Flat/Apartment',
    'Independent House/Villa',
    'Builder Floor',
    'Plot/Land',
    '1 RK/Studio Apartment',
    'Serviced Apartment',
    'Farmhouse',
    'Other'
  ]

  const amenitiesList = [
    'Swimming Pool',
    'Clubhouse',
    'Gym',
    'Park',
    'Children\'s Play Area',
    'Jogging Track',
    'Indoor Games',
    'Rain Water Harvesting',
    'Power Backup',
    'Lift',
    'Security',
    'Intercom',
    'Visitor Parking',
    'Water Storage',
    'Maintenance Staff',
    'Fire Alarm',
    'CCTV',
    'Vastu Compliant'
  ]

  const featuresList = [
    'High Ceiling Height',
    'False Ceiling Lighting',
    'Piped Gas',
    'Internet/Wi-Fi connectivity',
    'Modular Kitchen',
    'Air Conditioning',
    'Geyser',
    'Wardrobes',
    'Chimney',
    'Water Purifier',
    'Vaastu Compliant',
    'Wheelchair Friendly'
  ]

  const societyFeaturesList = [
    '24x7 Security',
    'CCTV Surveillance',
    'Elevator',
    'Fire Safety',
    'Waste Disposal',
    'Landscaped Gardens',
    'Community Hall',
    'Temple',
    'Shopping Center',
    'Bank/ATM',
    'Medical Facility',
    'School Nearby'
  ]

  const [form, setForm] = useState<PropertyForm>({
    purpose: 'sell',
    propertyType: 'residential',
    category: '',
    price: 0,
    bhk: 0,
    bathrooms: 0,
    balconies: 0,
    areaSqft: 0,
    builtUpArea: 0,
    carpetArea: 0,
    totalFloors: 0,
    floorNumber: 0,
    furnishing: 'unfurnished',
    availabilityStatus: 'ready_to_move',
    cityId: '',
    areaId: '',
    address: '',
    location: { lat: 0, lng: 0 },
    title: '',
    description: '',
    slug: '',
    images: [],
    videos: [],
    amenities: [],
    features: [],
    societyFeatures: [],
    parking: { covered: 0, open: 0 },
    powerBackup: 'none',
    facing: '',
    flooring: '',
    roadWidth: 0
  })

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : ''

  // Fetch all data on component mount
  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true)
      setError(null)
      try {
        await Promise.all([
          fetchCities(),
          fetchAreas(),
          fetchProperties()
        ])
      } catch (error) {
        console.error('Error fetching data:', error)
        setError('Failed to load data. Please refresh the page.')
      } finally {
        setLoading(false)
      }
    }

    fetchAllData()
  }, [])

  const fetchCities = async () => {
    try {
      const res = await fetch('/api/cities', {
        headers: { Authorization: `Bearer ${token}` }
      })

      if (!res.ok) throw new Error('Failed to fetch cities')

      const data = await res.json()

      // Check the structure of the response
      if (data.cities && Array.isArray(data.cities)) {
        setCities(data.cities)
      } else if (Array.isArray(data)) {
        setCities(data)
      } else {
      }
    } catch (error) {
      console.error('Error fetching cities:', error)
    }
  }

  const fetchAreas = async () => {
    try {
      const res = await fetch('/api/areas', {
        headers: { Authorization: `Bearer ${token}` }
      })

      if (!res.ok) throw new Error('Failed to fetch areas')

      const data = await res.json()

      // Check the structure of the response
      if (data.areas && Array.isArray(data.areas)) {
        setAreas(data.areas)
      } else if (Array.isArray(data)) {
        setAreas(data)
      } else {
      }
    } catch (error) {
      console.error('Error fetching areas:', error)
    }
  }
  useEffect(() => {
    
    if (cities.length > 0) {
      console.log('First city:', cities[0])
    }
  }, [cities])

  useEffect(() => {
   
    if (areas.length > 0) {
      console.log('First area:', areas[0])
    }
  }, [areas])

  useEffect(() => {
    if (form.cityId) {
      const filtered = areas.filter(a => a.cityId === form.cityId)
    }
  }, [form.cityId, areas])
  const fetchProperties = async () => {
    try {
      const res = await fetch('/api/admin/properties', {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (!res.ok) throw new Error('Failed to fetch properties')
      const data = await res.json()
      setProperties(data.properties || [])
    } catch (error) {
      console.error('Error fetching properties:', error)
      throw error
    }
  }

  useEffect(() => {
    // Calculate property score based on form completion
    let score = 0
    const totalFields = 25

    if (form.title) score += 2
    if (form.price > 0) score += 2
    if (form.bhk > 0) score += 1
    if (form.bathrooms > 0) score += 1
    if (form.areaSqft > 0) score += 2
    if (form.cityId) score += 1
    if (form.areaId) score += 1
    if (form.address) score += 1
    if (form.description) score += 3
    if (form.amenities.length > 0) score += 3
    if (form.features.length > 0) score += 2
    if (form.images.length > 0) score += 4
    if (form.facing) score += 1
    if (form.flooring) score += 1

    setPropertyScore(Math.min(Math.round((score / totalFields) * 100), 100))
  }, [form])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    setForm({
      ...form,
      [name]: type === 'number' ? Number(value) : value
    })
  }

  const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const cityId = e.target.value
    setForm({
      ...form,
      cityId,
      areaId: '' // Reset area when city changes
    })
  }

  const handleNestedChange = (parent: string, field: string, value: any) => {
    setForm({
      ...form,
      [parent]: {
        ...(form[parent as keyof PropertyForm] as Record<string, any>),
        [field]: value
      }
    })
  }

  const toggleAmenity = (amenity: string) => {
    setSelectedAmenities(prev => {
      const newAmenities = prev.includes(amenity)
        ? prev.filter(a => a !== amenity)
        : [...prev, amenity]
      setForm({ ...form, amenities: newAmenities })
      return newAmenities
    })
  }

  const toggleFeature = (feature: string) => {
    setSelectedFeatures(prev => {
      const newFeatures = prev.includes(feature)
        ? prev.filter(f => f !== feature)
        : [...prev, feature]
      setForm({ ...form, features: newFeatures })
      return newFeatures
    })
  }

  const toggleSocietyFeature = (feature: string) => {
    setSelectedSocietyFeatures(prev => {
      const newFeatures = prev.includes(feature)
        ? prev.filter(f => f !== feature)
        : [...prev, feature]
      setForm({ ...form, societyFeatures: newFeatures })
      return newFeatures
    })
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    setIsSubmitting(true); // disable buttons while uploading
    setError(null);
    try {
      const formData = new FormData();
      Array.from(e.target.files).forEach(file => {
        formData.append("files", file);
      });

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Upload failed");

      const data = await res.json();
      // data.urls is array of uploaded image URLs (e.g., "/uploads/abc123.jpg")
      setUploadedImages(prev => [...prev, ...data.urls]);
      setForm(prev => ({ ...prev, images: [...prev.images, ...data.urls] }));
    } catch (error) {
      console.error("Error uploading images:", error);
      setError("Failed to upload images. Please try again.");
    } finally {
      setIsSubmitting(false);
      // Reset the input so same file can be uploaded again if needed
      e.target.value = '';
    }
  }

  const removeImage = (index: number) => {
    const newImages = form.images.filter((_, i) => i !== index)
    setForm({ ...form, images: newImages })
    setUploadedImages(prev => prev.filter((_, i) => i !== index))
  }

  const createProperty = async () => {
    setIsSubmitting(true)
    setError(null)
    try {
      const slug = form.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')

      const payload = {
        ...form,
        slug,
        postedBy: {
          type: 'agent' as const,
          id: '65a1a1a1a1a1a1a1a1a1a101'
        }
      }

      const url = editingId
        ? `/api/admin/properties?id=${editingId}`
        : '/api/admin/properties'

      const method = editingId ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Failed to save property')
      }

      setStep(1)
      setEditingId(null)
      resetForm()
      await fetchProperties()

    } catch (error) {
      console.error('Error saving property:', error)
      setError(error instanceof Error ? error.message : 'Failed to save property')
    } finally {
      setIsSubmitting(false)
    }
  }

  const deleteProperty = async (id: string) => {
    if (!confirm('Are you sure you want to delete this property?')) return

    try {
      const res = await fetch(`/api/admin/properties?id=${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to delete property')
      }

      await fetchProperties()

    } catch (error) {
      console.error('Error deleting property:', error)
      setError(error instanceof Error ? error.message : 'Failed to delete property')
    }
  }

  const editProperty = (property: Property) => {
    setForm({
      purpose: property.purpose || 'sell',
      propertyType: property.propertyType || 'residential',
      category: property.category || '',
      price: property.price || 0,
      bhk: property.bhk || 0,
      bathrooms: property.bathrooms || 0,
      balconies: property.balconies || 0,
      areaSqft: property.areaSqft || 0,
      builtUpArea: property.builtUpArea || 0,
      carpetArea: property.carpetArea || 0,
      totalFloors: property.totalFloors || 0,
      floorNumber: property.floorNumber || 0,
      furnishing: property.furnishing || 'unfurnished',
      availabilityStatus: property.availabilityStatus || 'ready_to_move',
      cityId: property.cityId?.toString() || '',
      areaId: property.areaId?.toString() || '',
      address: property.address || '',
      location: property.location || { lat: 0, lng: 0 },
      title: property.title || '',
      description: property.description || '',
      slug: property.slug || '',
      images: property.images || [],
      videos: property.videos || [],
      amenities: property.amenities || [],
      features: property.features || [],
      societyFeatures: property.societyFeatures || [],
      parking: property.parking || { covered: 0, open: 0 },
      powerBackup: property.powerBackup || 'none',
      facing: property.facing || '',
      flooring: property.flooring || '',
      roadWidth: property.roadWidth || 0
    })
    setSelectedAmenities(property.amenities || [])
    setSelectedFeatures(property.features || [])
    setSelectedSocietyFeatures(property.societyFeatures || [])
    setUploadedImages(property.images || [])
    setEditingId(property._id)
    setStep(1)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const resetForm = () => {
    setForm({
      purpose: 'sell',
      propertyType: 'residential',
      category: '',
      price: 0,
      bhk: 0,
      bathrooms: 0,
      balconies: 0,
      areaSqft: 0,
      builtUpArea: 0,
      carpetArea: 0,
      totalFloors: 0,
      floorNumber: 0,
      furnishing: 'unfurnished',
      availabilityStatus: 'ready_to_move',
      cityId: '',
      areaId: '',
      address: '',
      location: { lat: 0, lng: 0 },
      title: '',
      description: '',
      slug: '',
      images: [],
      videos: [],
      amenities: [],
      features: [],
      societyFeatures: [],
      parking: { covered: 0, open: 0 },
      powerBackup: 'none',
      facing: '',
      flooring: '',
      roadWidth: 0
    })
    setSelectedAmenities([])
    setSelectedFeatures([])
    setSelectedSocietyFeatures([])
    setUploadedImages([])
    setEditingId(null)
    setError(null)
  }

  const getCityName = (cityId: string) => {
    if (!cityId) return 'N/A'
    const city = cities.find(c => c._id === cityId)
    return city?.name || 'N/A'
  }

  const getAreaName = (areaId: string) => {
    if (!areaId) return ''
    const area = areas.find(a => a._id === areaId)
    return area?.name || ''
  }

  const filteredAreas = areas.filter(area => area.cityId === form.cityId)

  // Loading state
  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <div className="w-72 bg-white shadow-lg fixed h-full overflow-y-auto">
          <div className="p-6 border-b">
            <h1 className="text-2xl font-bold text-blue-600">DreamHouse4Sale</h1>
            <p className="text-sm text-gray-500 mt-1">Admin Dashboard</p>
          </div>
        </div>
        <div className="flex-1 ml-72 p-8 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading dashboard...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-72 bg-white shadow-lg fixed h-full overflow-y-auto">
        <div className="p-6 border-b">
          <h1 className="text-2xl font-bold text-blue-600">DreamHouse4Sale</h1>
          <p className="text-sm text-gray-500 mt-1">Admin Dashboard</p>
        </div>

        <nav className="p-4">
          <div className="space-y-1">
            <a href="#" className="flex items-center gap-3 px-4 py-3 bg-blue-50 text-blue-600 rounded-lg font-medium">
              <Building2 size={20} />
              <span>Properties</span>
            </a>
            <a href="#" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg">
              <Home size={20} />
              <span>Dashboard</span>
            </a>
            <a href="#" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg">
              <MapPin size={20} />
              <span>Locations</span>
            </a>
            <a href="#" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg">
              <Image size={20} />
              <span>Media</span>
            </a>
            <a href="#" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg">
              <FileText size={20} />
              <span>Reports</span>
            </a>
          </div>
        </nav>

        <div className="absolute bottom-0 w-full p-4 border-t">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-blue-600 font-semibold">PJ</span>
            </div>
            <div>
              <p className="font-medium">Parth Jani</p>
              <p className="text-sm text-gray-500">Administrator</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 ml-72 p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Welcome back Parth Jani,</h1>
          <p className="text-gray-600">Fill out basic details to list your property</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700">
            <AlertCircle size={20} />
            <span>{error}</span>
            <button
              onClick={() => setError(null)}
              className="ml-auto text-red-500 hover:text-red-700"
            >
              ×
            </button>
          </div>
        )}

        {/* Property Score Card */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-2xl shadow-lg mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold mb-2">Property Score</h2>
              <p className="text-blue-100">Better your property score, greater your visibility</p>
            </div>
            <div className="text-5xl font-bold">{propertyScore}%</div>
          </div>
        </div>

        {/* Multi-step Form */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
          {/* Stepper */}
          <div className="bg-gray-50 px-8 py-4 border-b">
            <div className="flex items-center justify-between max-w-4xl mx-auto">
              {[
                { step: 1, label: 'Basic Details' },
                { step: 2, label: 'Location' },
                { step: 3, label: 'Property Profile' },
                { step: 4, label: 'Photos' },
                { step: 5, label: 'Amenities' }
              ].map((s) => (
                <div key={s.step} className="flex items-center">
                  <div className={`flex items-center justify-center w-8 h-8 rounded-full ${step > s.step ? 'bg-green-500 text-white' :
                    step === s.step ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-600'
                    }`}>
                    {step > s.step ? <Check size={16} /> : s.step}
                  </div>
                  <span className={`ml-2 text-sm ${step === s.step ? 'font-semibold text-blue-600' : 'text-gray-500'
                    }`}>
                    {s.label}
                  </span>
                  {s.step < 5 && <ChevronRight size={16} className="mx-4 text-gray-400" />}
                </div>
              ))}
            </div>
          </div>

          {/* Form Content */}
          <div className="p-8">
            {/* Step 1: Basic Details */}
            {step === 1 && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">I'm looking to</label>
                  <div className="flex gap-3">
                    {[
                      { value: 'sell', label: 'Sell' },
                      { value: 'rent', label: 'Rent / Lease' },
                      { value: 'pg', label: 'PG' }
                    ].map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => setForm({ ...form, purpose: option.value as any })}
                        className={`px-6 py-2 rounded-lg capitalize ${form.purpose === option.value
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Property Type</label>
                  <div className="flex gap-3">
                    {[
                      { value: 'residential', label: 'Residential' },
                      { value: 'commercial', label: 'Commercial' }
                    ].map((type) => (
                      <button
                        key={type.value}
                        type="button"
                        onClick={() => setForm({ ...form, propertyType: type.value as any })}
                        className={`px-6 py-2 rounded-lg ${form.propertyType === type.value
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                      >
                        {type.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Property Category</label>
                  <div className="grid grid-cols-2 gap-3">
                    {categories.map((category) => (
                      <button
                        key={category}
                        type="button"
                        onClick={() => setForm({ ...form, category })}
                        className={`px-4 py-3 rounded-lg text-left ${form.category === category
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Property Title</label>
                  <input
                    type="text"
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    placeholder="e.g., 3 BHK Luxury Apartment in Satellite"
                    className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            )}

            {/* Step 2: Location Details */}
            {step === 2 && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                    <select
                      name="cityId"
                      value={form.cityId}
                      onChange={handleCityChange}
                      className="w-full border p-3 rounded-lg"
                    >
                      <option value="">Select City</option>
                      {cities.map(c => (
                        <option key={c._id} value={c._id}>{c.name}</option>
                      ))}
                    </select>
                    {cities.length === 0 && (
                      <p className="text-sm text-yellow-600 mt-1">No cities available</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Area</label>
                    <select
                      name="areaId"
                      value={form.areaId}
                      onChange={handleChange}
                      className="w-full border p-3 rounded-lg"
                      disabled={!form.cityId}
                    >
                      <option value="">Select Area</option>
                      {filteredAreas.map(a => (
                        <option key={a._id} value={a._id}>{a.name}</option>
                      ))}
                    </select>
                    {form.cityId && filteredAreas.length === 0 && (
                      <p className="text-sm text-yellow-600 mt-1">No areas found for this city</p>
                    )}
                  </div>

                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                    <input
                      type="text"
                      name="address"
                      value={form.address}
                      onChange={handleChange}
                      placeholder="Full address"
                      className="w-full border p-3 rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Latitude</label>
                    <input
                      type="number"
                      value={form.location.lat}
                      onChange={(e) => handleNestedChange('location', 'lat', Number(e.target.value))}
                      placeholder="23.0225"
                      step="0.0001"
                      className="w-full border p-3 rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Longitude</label>
                    <input
                      type="number"
                      value={form.location.lng}
                      onChange={(e) => handleNestedChange('location', 'lng', Number(e.target.value))}
                      placeholder="72.5714"
                      step="0.0001"
                      className="w-full border p-3 rounded-lg"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Property Profile */}
            {step === 3 && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Price (₹)</label>
                    <input
                      type="number"
                      name="price"
                      value={form.price}
                      onChange={handleChange}
                      placeholder="e.g., 7500000"
                      className="w-full border p-3 rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">BHK</label>
                    <select
                      name="bhk"
                      value={form.bhk}
                      onChange={handleChange}
                      className="w-full border p-3 rounded-lg"
                    >
                      <option value={0}>Select BHK</option>
                      {[1, 2, 3, 4, 5].map(num => (
                        <option key={num} value={num}>{num} BHK</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Bathrooms</label>
                    <select
                      name="bathrooms"
                      value={form.bathrooms}
                      onChange={handleChange}
                      className="w-full border p-3 rounded-lg"
                    >
                      <option value={0}>Select</option>
                      {[1, 2, 3, 4, 5].map(num => (
                        <option key={num} value={num}>{num}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Balconies</label>
                    <select
                      name="balconies"
                      value={form.balconies}
                      onChange={handleChange}
                      className="w-full border p-3 rounded-lg"
                    >
                      <option value={0}>Select</option>
                      {[0, 1, 2, 3, 4].map(num => (
                        <option key={num} value={num}>{num}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Carpet Area (sq.ft.)</label>
                    <input
                      type="number"
                      name="carpetArea"
                      value={form.carpetArea}
                      onChange={handleChange}
                      placeholder="e.g., 1200"
                      className="w-full border p-3 rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Built-up Area (sq.ft.)</label>
                    <input
                      type="number"
                      name="builtUpArea"
                      value={form.builtUpArea}
                      onChange={handleChange}
                      placeholder="e.g., 1500"
                      className="w-full border p-3 rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Total Floors</label>
                    <input
                      type="number"
                      name="totalFloors"
                      value={form.totalFloors}
                      onChange={handleChange}
                      placeholder="e.g., 5"
                      className="w-full border p-3 rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Floor Number</label>
                    <input
                      type="number"
                      name="floorNumber"
                      value={form.floorNumber}
                      onChange={handleChange}
                      placeholder="e.g., 3"
                      className="w-full border p-3 rounded-lg"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Availability Status</label>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setForm({ ...form, availabilityStatus: 'ready_to_move' })}
                      className={`px-6 py-2 rounded-lg ${form.availabilityStatus === 'ready_to_move'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700'
                        }`}
                    >
                      Ready to move
                    </button>
                    <button
                      type="button"
                      onClick={() => setForm({ ...form, availabilityStatus: 'under_construction' })}
                      className={`px-6 py-2 rounded-lg ${form.availabilityStatus === 'under_construction'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700'
                        }`}
                    >
                      Under construction
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Furnishing</label>
                  <div className="flex gap-3">
                    {[
                      { value: 'furnished', label: 'Furnished' },
                      { value: 'semi-furnished', label: 'Semi-furnished' },
                      { value: 'unfurnished', label: 'Unfurnished' }
                    ].map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => setForm({ ...form, furnishing: option.value as any })}
                        className={`px-6 py-2 rounded-lg ${form.furnishing === option.value
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-700'
                          }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Photos */}
            {step === 4 && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-4">Upload Property Photos</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition-colors">
                    <Camera size={48} className="mx-auto text-gray-400 mb-4" />
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="photo-upload"
                    />
                    <label
                      htmlFor="photo-upload"
                      className="bg-blue-600 text-white px-6 py-3 rounded-lg cursor-pointer hover:bg-blue-700 inline-block"
                    >
                      Choose Photos
                    </label>
                    <p className="text-gray-500 mt-2">You can select multiple photos</p>
                  </div>

                  {form.images.length > 0 && (
                    <div className="mt-4">
                      <h4 className="font-medium mb-3">Uploaded Photos ({form.images.length})</h4>
                      <div className="grid grid-cols-4 gap-4">
                        {form.images.map((img, index) => (
                          <div key={index} className="relative group">
                            <img
                              src={img}
                              alt={`Property ${index + 1}`}
                              className="w-full h-32 object-cover rounded-lg"
                            />
                            <button
                              onClick={() => removeImage(index)}
                              className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Video Tour URL</label>
                  <input
                    type="text"
                    value={form.videos[0] || ''}
                    onChange={(e) => setForm({ ...form, videos: [e.target.value] })}
                    placeholder="YouTube or Vimeo URL"
                    className="w-full border p-3 rounded-lg"
                  />
                </div>
              </div>
            )}

            {/* Step 5: Amenities & Features */}
            {step === 5 && (
              <div className="space-y-8">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-4">Amenities</label>
                  <div className="grid grid-cols-3 gap-3">
                    {amenitiesList.map((amenity) => (
                      <button
                        key={amenity}
                        type="button"
                        onClick={() => toggleAmenity(amenity)}
                        className={`p-3 rounded-lg text-left flex items-center gap-2 ${selectedAmenities.includes(amenity)
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                      >
                        {amenity.includes('Pool') && <Droplets size={18} />}
                        {amenity.includes('Park') && <TreePine size={18} />}
                        {amenity.includes('Security') && <Shield size={18} />}
                        {amenity.includes('Power') && <Zap size={18} />}
                        {amenity.includes('Parking') && <Car size={18} />}
                        {amenity.includes('Intercom') && <Wifi size={18} />}
                        <span className="text-sm">{amenity}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-4">Property Features</label>
                  <div className="grid grid-cols-3 gap-3">
                    {featuresList.map((feature) => (
                      <button
                        key={feature}
                        type="button"
                        onClick={() => toggleFeature(feature)}
                        className={`p-3 rounded-lg text-left ${selectedFeatures.includes(feature)
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                      >
                        {feature}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-4">Society/Building Features</label>
                  <div className="grid grid-cols-3 gap-3">
                    {societyFeaturesList.map((feature) => (
                      <button
                        key={feature}
                        type="button"
                        onClick={() => toggleSocietyFeature(feature)}
                        className={`p-3 rounded-lg text-left ${selectedSocietyFeatures.includes(feature)
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                      >
                        {feature}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Parking (Covered)</label>
                    <input
                      type="number"
                      value={form.parking.covered}
                      onChange={(e) => handleNestedChange('parking', 'covered', Number(e.target.value))}
                      placeholder="Number of covered parking"
                      className="w-full border p-3 rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Parking (Open)</label>
                    <input
                      type="number"
                      value={form.parking.open}
                      onChange={(e) => handleNestedChange('parking', 'open', Number(e.target.value))}
                      placeholder="Number of open parking"
                      className="w-full border p-3 rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Power Backup</label>
                    <select
                      value={form.powerBackup}
                      onChange={(e) => setForm({ ...form, powerBackup: e.target.value as any })}
                      className="w-full border p-3 rounded-lg"
                    >
                      <option value="none">None</option>
                      <option value="partial">Partial</option>
                      <option value="full">Full</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Facing</label>
                    <input
                      type="text"
                      name="facing"
                      value={form.facing}
                      onChange={handleChange}
                      placeholder="e.g., North, South"
                      className="w-full border p-3 rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Flooring Type</label>
                    <input
                      type="text"
                      name="flooring"
                      value={form.flooring}
                      onChange={handleChange}
                      placeholder="e.g., Marble, Wooden"
                      className="w-full border p-3 rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Road Width (feet)</label>
                    <input
                      type="number"
                      name="roadWidth"
                      value={form.roadWidth}
                      onChange={handleChange}
                      placeholder="e.g., 40"
                      className="w-full border p-3 rounded-lg"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    rows={6}
                    placeholder="Describe your property in detail..."
                    className="w-full border p-3 rounded-lg"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Navigation */}
          <div className="px-8 py-4 bg-gray-50 border-t flex justify-between">
            {step > 1 && (
              <button
                onClick={() => setStep(step - 1)}
                className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 flex items-center gap-2"
              >
                <ChevronLeft size={18} /> Back
              </button>
            )}

            <div className="flex gap-3 ml-auto">
              {step < 5 ? (
                <button
                  onClick={() => setStep(step + 1)}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                >
                  Next <ChevronRight size={18} />
                </button>
              ) : (
                <button
                  onClick={createProperty}
                  disabled={isSubmitting}
                  className="px-8 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2 disabled:opacity-50"
                >
                  {isSubmitting ? 'Saving...' : editingId ? 'Update Property' : 'Save and Submit'}
                </button>
              )}

              {editingId && (
                <button
                  onClick={resetForm}
                  className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                >
                  Cancel Edit
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Properties List */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="px-6 py-4 border-b flex justify-between items-center">
            <h2 className="text-xl font-semibold">Your Properties</h2>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Star size={16} className="text-yellow-400" />
              <span>Total: {properties.length}</span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Property</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">BHK</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Area</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {properties.map((property) => (
                  <tr key={property._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        {property.images && property.images[0] ? (
                          <img
                            src={property.images[0]}
                            alt={property.title}
                            className="w-10 h-10 rounded-lg object-cover mr-3"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = '/placeholder-property.jpg'
                            }}
                          />
                        ) : (
                          <div className="w-10 h-10 bg-gray-200 rounded-lg mr-3 flex items-center justify-center">
                            <Home size={20} className="text-gray-400" />
                          </div>
                        )}
                        <div>
                          <p className="font-medium">{property.title}</p>
                          <p className="text-sm text-gray-500">{property.category}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm">{getCityName(property.cityId?.toString())}</p>
                      <p className="text-xs text-gray-500">{getAreaName(property.areaId?.toString())}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-medium">₹{property.price?.toLocaleString()}</p>
                      <p className="text-xs text-gray-500">For {property.purpose}</p>
                    </td>
                    <td className="px-6 py-4">{property.bhk} BHK</td>
                    <td className="px-6 py-4">{property.areaSqft} sq.ft.</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${property.availabilityStatus === 'ready_to_move'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                        }`}>
                        {property.availabilityStatus === 'ready_to_move' ? 'Ready to move' : 'Under construction'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => editProperty(property)}
                          className="text-blue-600 hover:text-blue-800 transition-colors"
                          title="Edit property"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => deleteProperty(property._id)}
                          className="text-red-600 hover:text-red-800 transition-colors"
                          title="Delete property"
                        >
                          <Trash2 size={18} />
                        </button>
                        <button
                          className="text-gray-600 hover:text-gray-800 transition-colors"
                          title="View property"
                        >
                          <Eye size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {properties.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                      No properties found. Create your first property above.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-sm text-gray-600 border-t pt-4">
          <p className="flex items-center gap-2">
            <Mail size={16} /> Need help? Email us at{' '}
            <a href="mailto:services@99acres.com" className="text-blue-600 hover:underline">
              services@99acres.com
            </a>
          </p>
          <p className="flex items-center gap-2 mt-1">
            <Phone size={16} /> Call us at <span className="font-medium">1800 41 99099</span> (IND Toll-Free)
          </p>
          <p className="text-xs text-gray-500 mt-4">
            Privacy notice for listing. For maximum results, listing details should be filled with relevant information.
            We reserve the right to edit listings without prior notice.
          </p>
        </div>
      </div>
    </div>
  )
}