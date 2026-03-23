import Link from 'next/link'
import { Bed, MapPin, Square } from 'lucide-react'

export type PropertyCardModel = {
  _id: string
  title: string
  description?: string
  price: number
  bhk?: number
  areaSqft?: number
  images?: string[]
  cityName?: string | null
  areaName?: string | null
  address?: string | null
}

function formatPrice(price: number) {
  if (price >= 10_000_000) return `₹${(price / 10_000_000).toFixed(2)} Cr`
  if (price >= 100_000) return `₹${(price / 100_000).toFixed(2)} Lac`
  return `₹${price.toLocaleString()}`
}

export default function PropertyCard({ property }: { property: PropertyCardModel }) {
  const imageUrl = property.images?.[0]
  const location = [property.areaName, property.cityName].filter(Boolean).join(', ')

  return (
    <Link
      href={`/property/id/${property._id}`}
      className="group block overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900"
    >
      <div className="relative h-44 w-full bg-gray-100 dark:bg-zinc-800">
        {imageUrl ? (
          // Using <img> to support any remote image URL without extra Next.js image domain config.
          <img src={imageUrl} alt={property.title} className="h-full w-full object-cover transition group-hover:scale-[1.02]" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-sm text-gray-500 dark:text-gray-400">No Image</div>
        )}
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <h3 className="line-clamp-2 text-base font-semibold text-gray-900 dark:text-white">{property.title}</h3>
          <div className="shrink-0 text-sm font-bold text-blue-700 dark:text-blue-400">{formatPrice(property.price)}</div>
        </div>

        <div className="mt-3 flex flex-wrap gap-3 text-xs text-gray-600 dark:text-gray-300">
          {property.bhk ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1 dark:bg-zinc-800">
              <Bed size={14} /> {property.bhk} BHK
            </span>
          ) : null}
          {property.areaSqft ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1 dark:bg-zinc-800">
              <Square size={14} /> {property.areaSqft} sq.ft
            </span>
          ) : null}
        </div>

        {location ? (
          <div className="mt-3 inline-flex items-center gap-1 text-sm text-gray-600 dark:text-gray-300">
            <MapPin size={16} />
            <span className="line-clamp-1">{location}</span>
          </div>
        ) : null}
      </div>
    </Link>
  )
}
