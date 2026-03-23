import Header from '@/app/components/Header'
import Footer from '@/app/components/Footer'
import PropertyCard, { type PropertyCardModel } from '@/app/components/PropertyCard'
import { connectDB } from '@/app/lib/mongodb'
import { parseListingSlug, toKebabCase, type ParsedListingSlug } from '@/app/lib/slugParser'
import { buildListingMetadata, getSiteUrl } from '@/app/lib/seo'
import Area from '@/app/models/Area'
import City from '@/app/models/City'
import Property from '@/app/models/Property'
import { unstable_cache } from 'next/cache'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Types } from 'mongoose'

export const revalidate = 300

type ListingData = {
  parsed: ParsedListingSlug
  breadcrumb: Array<{ name: string; href: string }>
  title: string
  properties: PropertyCardModel[]
  canonicalUrl: string
  cityName?: string | null
  areaName?: string | null
}

function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

async function resolveLocation(parsed: ParsedListingSlug) {
  await connectDB()

  const cityName = parsed.cityName?.trim()
  const areaName = parsed.areaName?.trim()

  type CityLean = { _id: Types.ObjectId; name: string }
  type AreaLean = { _id: Types.ObjectId; name: string; cityId: Types.ObjectId }

  let cityDoc: CityLean | null = null
  let areaDoc: AreaLean | null = null

  if (cityName) {
    cityDoc = await City.findOne({ name: { $regex: new RegExp(`^${escapeRegex(cityName)}$`, 'i') } })
      .select({ _id: 1, name: 1 })
      .lean()
  }

  if (areaName) {
    const baseFilter: { name: { $regex: RegExp }; cityId?: Types.ObjectId } = {
      name: { $regex: new RegExp(`^${escapeRegex(areaName)}$`, 'i') },
    }
    if (cityDoc?._id) baseFilter.cityId = cityDoc._id
    areaDoc = await Area.findOne(baseFilter).select({ _id: 1, name: 1, cityId: 1 }).lean()

    // If user provided only area (e.g. flats-in-bopal), derive city from area.cityId for SEO + breadcrumbs.
    if (!cityDoc && areaDoc?.cityId) {
      cityDoc = await City.findById(areaDoc.cityId).select({ _id: 1, name: 1 }).lean()
    }
  }

  // If only one location token was parsed into areaName, try resolving it as a city too.
  if (!cityDoc && !areaDoc && parsed.areaName && !parsed.cityName) {
    cityDoc = await City.findOne({ name: { $regex: new RegExp(`^${escapeRegex(parsed.areaName)}$`, 'i') } })
      .select({ _id: 1, name: 1 })
      .lean()
    if (cityDoc?._id) {
      return { cityDoc, areaDoc: null }
    }
  }

  return { cityDoc, areaDoc }
}

function categoryFilter(propertyType: ParsedListingSlug['propertyType']) {
  if (!propertyType || propertyType === 'property') return null

  const map: Record<string, string[]> = {
    flat: ['flat', 'flats', 'apartment', 'apartments'],
    house: ['house', 'houses', 'home', 'homes'],
    villa: ['villa', 'villas'],
    plot: ['plot', 'plots', 'land'],
    office: ['office', 'offices'],
    shop: ['shop', 'shops', 'showroom'],
  }
  const values = map[propertyType] || []
  return values.length ? { $in: values } : null
}

type NamedRef = { name: string }
function isNamedRef(value: unknown): value is NamedRef {
  return typeof value === 'object' && value !== null && 'name' in value
}

type PropertyLean = {
  _id: Types.ObjectId
  title: string
  description?: string
  price: number
  bhk?: number
  areaSqft?: number
  builtUpArea?: number
  carpetArea?: number
  images?: string[]
  cityId?: unknown
  areaId?: unknown
  address?: string
}

type PropertyFilter = {
  bhk?: number
  purpose?: ParsedListingSlug['purpose']
  category?: unknown
  price?: { $gte?: number; $lte?: number }
  cityId?: Types.ObjectId
  areaId?: Types.ObjectId
  $or?: Array<Record<string, unknown>>
}

async function queryProperties(parsed: ParsedListingSlug, cityId?: Types.ObjectId, areaId?: Types.ObjectId) {
  await connectDB()

  const filter: PropertyFilter = {}
  if (parsed.bhk) filter.bhk = parsed.bhk
  if (parsed.purpose) filter.purpose = parsed.purpose

  const cat = categoryFilter(parsed.propertyType)
  if (cat) filter.category = cat

  if (parsed.price?.min != null || parsed.price?.max != null) {
    const price: PropertyFilter['price'] = {}
    if (parsed.price.min != null) price.$gte = parsed.price.min
    if (parsed.price.max != null) price.$lte = parsed.price.max
    filter.price = price
  }

  if (cityId) filter.cityId = cityId
  if (areaId) filter.areaId = areaId

  const tokens = parsed.keywords
    .map((t) => t.trim())
    .filter((t) => t.length >= 3)
    .slice(0, 4)
  if (!cityId && !areaId && tokens.length > 0) {
    const rx = new RegExp(tokens.map(escapeRegex).join('|'), 'i')
    filter.$or = [{ title: { $regex: rx } }, { address: { $regex: rx } }]
  }

  const properties = await Property.find(filter)
    .populate('cityId', 'name')
    .populate('areaId', 'name')
    .sort({ createdAt: -1 })
    .limit(30)
    .select({
      _id: 1,
      title: 1,
      description: 1,
      address: 1,
      price: 1,
      bhk: 1,
      areaSqft: 1,
      builtUpArea: 1,
      carpetArea: 1,
      images: 1,
      cityId: 1,
      areaId: 1,
    })
    .lean<PropertyLean[]>()

  return properties.map((p) => ({
    _id: p._id.toString(),
    title: p.title,
    description: p.description,
    address: p.address,
    price: p.price,
    bhk: p.bhk,
    areaSqft: p.areaSqft || p.builtUpArea || p.carpetArea,
    images: p.images || [],
    cityName: isNamedRef(p.cityId) ? p.cityId.name : null,
    areaName: isNamedRef(p.areaId) ? p.areaId.name : null,
  })) as PropertyCardModel[]
}

const getListingData = unstable_cache(
  async (slug: string): Promise<ListingData> => {
    const parsed = parseListingSlug(slug)
    if (!parsed.slug) throw new Error('Invalid slug')

    const { cityDoc, areaDoc } = await resolveLocation(parsed)
    const properties = await queryProperties(parsed, cityDoc?._id, areaDoc?._id)

    const cityName = cityDoc?.name ?? parsed.cityName ?? null
    const areaName = areaDoc?.name ?? (parsed.areaName && !cityDoc ? parsed.areaName : parsed.areaName) ?? null

    const canonicalPath = `/property/${toKebabCase(parsed.slug)}`
    const canonicalUrl = new URL(canonicalPath, getSiteUrl()).toString()

    const breadcrumb: Array<{ name: string; href: string }> = [{ name: 'Home', href: '/' }]
    if (cityName) breadcrumb.push({ name: cityName, href: `/property/properties-in-${toKebabCase(cityName)}` })
    if (areaName && cityName) breadcrumb.push({ name: areaName, href: `/property/properties-in-${toKebabCase(areaName)}-${toKebabCase(cityName)}` })

    const title = (() => {
      // Use the SEO title for the on-page H1.
      const titleParts: string[] = []
      if (parsed.bhk) titleParts.push(`${parsed.bhk} BHK`)
      titleParts.push(parsed.propertyType && parsed.propertyType !== 'property' ? `${parsed.propertyType[0].toUpperCase()}${parsed.propertyType.slice(1)}s` : 'Properties')
      const loc = [areaName, cityName].filter(Boolean).join(' ')
      if (loc) titleParts.push(`in ${loc}`)
      const purpose = parsed.purpose === 'rent' ? 'for Rent' : parsed.purpose === 'pg' ? 'PG' : 'for Sale'
      titleParts.push(purpose)
      return titleParts.join(' ')
    })()

    return { parsed, breadcrumb, title, properties, canonicalUrl, cityName, areaName }
  },
  ['property-listing'],
  { revalidate: 300 }
)

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const { slug } = params
  const parsed = parseListingSlug(slug)
  const base = buildListingMetadata(parsed)

  try {
    const data = await getListingData(slug)
    const firstImage = data.properties[0]?.images?.[0]
    if (firstImage) {
      return {
        ...base,
        openGraph: { ...base.openGraph, images: [firstImage] },
        twitter: { ...base.twitter, images: [firstImage] },
      }
    }
  } catch {
    // fall back to slug-only metadata
  }

  return base
}

export default async function PropertyListingPage({ params }: { params: { slug: string } }) {
  const { slug } = params

  let data: ListingData
  try {
    data = await getListingData(slug)
  } catch {
    notFound()
  }

  // If slug is completely unrecognizable, 404.
  if (!data.parsed.keywords.length && !data.parsed.areaName && !data.parsed.cityName && !data.parsed.bhk && !data.parsed.price) {
    notFound()
  }

  const siteUrl = getSiteUrl()

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: data.breadcrumb.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: new URL(item.href, siteUrl).toString(),
    })),
  }

  const itemListJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: data.title,
    itemListElement: data.properties.map((p, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'RealEstateListing',
        name: p.title,
        description: p.description || undefined,
        url: new URL(`/property/id/${p._id}`, siteUrl).toString(),
        image: p.images?.[0] || undefined,
        offers: {
          '@type': 'Offer',
          price: p.price,
          priceCurrency: 'INR',
        },
        address: {
          '@type': 'PostalAddress',
          streetAddress: p.address || undefined,
          addressLocality: p.areaName || undefined,
          addressRegion: p.cityName || undefined,
        },
      },
    })),
  }

  return (
    <>
      <Header />
      <main className="bg-zinc-50 dark:bg-black">
        <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <nav aria-label="Breadcrumb" className="mb-4 text-sm text-gray-600 dark:text-gray-300">
            <ol className="flex flex-wrap items-center gap-2">
              {data.breadcrumb.map((b, idx) => (
                <li key={`${b.href}-${idx}`} className="flex items-center gap-2">
                  {idx === data.breadcrumb.length - 1 ? (
                    <span className="font-medium text-gray-900 dark:text-white">{b.name}</span>
                  ) : (
                    <Link href={b.href} className="hover:text-blue-700 dark:hover:text-blue-300">
                      {b.name}
                    </Link>
                  )}
                  {idx !== data.breadcrumb.length - 1 ? <span className="text-gray-400">/</span> : null}
                </li>
              ))}
            </ol>
          </nav>

          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-3xl">{data.title}</h1>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">{data.properties.length} listings found</p>
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-300">
              <span className="rounded-full bg-white px-3 py-1 shadow-sm dark:bg-zinc-900 dark:shadow-none">
                Canonical: <span className="font-medium">{new URL(data.canonicalUrl).pathname}</span>
              </span>
            </div>
          </div>

          {data.properties.length === 0 ? (
            <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-6 text-gray-700 dark:border-zinc-800 dark:bg-zinc-900 dark:text-gray-200">
              <div className="text-lg font-semibold">No properties found</div>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                Try removing filters or searching a different location.
              </p>
            </div>
          ) : (
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {data.properties.map((property) => (
                <PropertyCard key={property._id} property={property} />
              ))}
            </div>
          )}
        </section>

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
        />
      </main>
      <Footer />
    </>
  )
}

export async function generateStaticParams() {
  // Popular SEO landing pages (safe defaults; no DB required at build-time).
  return [
    { slug: '3-bhk-in-satellite-ahmedabad' },
    { slug: 'flats-in-bopal' },
    { slug: '2-bhk-under-50-lakh-ahmedabad' },
    { slug: 'properties-in-ahmedabad' },
  ]
}
