import type { Metadata } from 'next'
import type { ParsedListingSlug } from './slugParser'
import { toKebabCase } from './slugParser'

export function getSiteUrl() {
  return process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
}

export function buildListingTitle(parsed: ParsedListingSlug) {
  const parts: string[] = []

  if (parsed.bhk) parts.push(`${parsed.bhk} BHK`)

  if (parsed.propertyType && parsed.propertyType !== 'property') {
    const typeText =
      parsed.propertyType === 'flat'
        ? 'Flats'
        : parsed.propertyType === 'house'
          ? 'Houses'
          : parsed.propertyType === 'villa'
            ? 'Villas'
            : parsed.propertyType === 'plot'
              ? 'Plots'
              : parsed.propertyType === 'office'
                ? 'Offices'
                : parsed.propertyType === 'shop'
                  ? 'Shops'
                  : 'Properties'
    parts.push(typeText)
  } else {
    parts.push('Properties')
  }

  const locationParts: string[] = []
  if (parsed.areaName) locationParts.push(parsed.areaName)
  if (parsed.cityName) locationParts.push(parsed.cityName)
  if (locationParts.length > 0) parts.push(`in ${locationParts.join(' ')}`)

  const purpose = parsed.purpose === 'rent' ? 'for Rent' : parsed.purpose === 'pg' ? 'PG' : 'for Sale'
  parts.push(purpose)

  return parts.join(' ')
}

export function buildListingDescription(parsed: ParsedListingSlug) {
  const locationParts: string[] = []
  if (parsed.areaName) locationParts.push(parsed.areaName)
  if (parsed.cityName) locationParts.push(parsed.cityName)
  const location = locationParts.length ? ` in ${locationParts.join(', ')}` : ''

  const type =
    parsed.propertyType && parsed.propertyType !== 'property'
      ? parsed.propertyType === 'flat'
        ? 'flats'
        : parsed.propertyType === 'house'
          ? 'houses'
          : parsed.propertyType === 'villa'
            ? 'villas'
            : parsed.propertyType === 'plot'
              ? 'plots'
              : parsed.propertyType === 'office'
                ? 'offices'
                : parsed.propertyType === 'shop'
                  ? 'shops'
                  : 'properties'
      : 'properties'

  const bhkText = parsed.bhk ? `${parsed.bhk} BHK ` : ''
  const purpose = parsed.purpose === 'rent' ? 'rent' : parsed.purpose === 'pg' ? 'PG' : 'sale'

  const priceHint =
    parsed.price?.max != null
      ? ` under ₹${Math.round(parsed.price.max / 100_000)} lakh`
      : parsed.price?.min != null
        ? ` above ₹${Math.round(parsed.price.min / 100_000)} lakh`
        : ''

  return `Explore ${bhkText}${type}${location}${priceHint}. Compare prices, photos, amenities and shortlist verified listings for ${purpose}.`
}

export function buildListingCanonicalPath(slug: string) {
  return `/property/${toKebabCase(slug)}`
}

export function buildListingMetadata(parsed: ParsedListingSlug): Metadata {
  const title = buildListingTitle(parsed)
  const description = buildListingDescription(parsed)
  const canonicalPath = buildListingCanonicalPath(parsed.slug)
  const canonicalUrl = new URL(canonicalPath, getSiteUrl()).toString()

  return {
    title,
    description,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  }
}

