export type ListingPurpose = 'sell' | 'rent' | 'pg'

export type PriceFilter = {
  min?: number
  max?: number
}

export type ParsedListingSlug = {
  slug: string
  bhk?: number
  purpose?: ListingPurpose
  propertyType?: 'flat' | 'house' | 'villa' | 'plot' | 'office' | 'shop' | 'property'
  areaName?: string
  cityName?: string
  price?: PriceFilter
  keywords: string[]
}

const STOPWORDS = new Set(['property', 'properties', 'in', 'at', 'near', 'for', 'sale', 'rent', 'pg'])

function toTitleCase(value: string) {
  return value
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

function kebabToWords(value: string) {
  return value.replace(/-/g, ' ').replace(/\s+/g, ' ').trim()
}

function parseNumberToken(value: string) {
  const num = Number(value)
  return Number.isFinite(num) ? num : null
}

function parseIndianAmount(value: number, unit: string) {
  const u = unit.toLowerCase()
  if (u === 'lakh' || u === 'lac' || u === 'lacs') return Math.round(value * 100_000)
  if (u === 'crore' || u === 'cr') return Math.round(value * 10_000_000)
  return null
}

function tryParsePrice(tokens: string[]): { price?: PriceFilter; consumed: number } {
  // Patterns supported:
  // - under-50-lakh
  // - under-1-crore
  // - between-50-and-75-lakh
  // - above-75-lakh
  const head = tokens[0]?.toLowerCase()
  if (!head) return { consumed: 0 }

  if (head === 'under' || head === 'below') {
    const amount = parseNumberToken(tokens[1])
    const unit = tokens[2]
    if (amount == null || !unit) return { consumed: 0 }
    const max = parseIndianAmount(amount, unit)
    if (!max) return { consumed: 0 }
    return { price: { max }, consumed: 3 }
  }

  if (head === 'above' || head === 'over') {
    const amount = parseNumberToken(tokens[1])
    const unit = tokens[2]
    if (amount == null || !unit) return { consumed: 0 }
    const min = parseIndianAmount(amount, unit)
    if (!min) return { consumed: 0 }
    return { price: { min }, consumed: 3 }
  }

  if (head === 'between') {
    const minAmount = parseNumberToken(tokens[1])
    const andToken = tokens[2]?.toLowerCase()
    const maxAmount = parseNumberToken(tokens[3])
    const unit = tokens[4]
    if (minAmount == null || maxAmount == null || andToken !== 'and' || !unit) return { consumed: 0 }
    const min = parseIndianAmount(minAmount, unit)
    const max = parseIndianAmount(maxAmount, unit)
    if (!min || !max) return { consumed: 0 }
    return { price: { min, max }, consumed: 5 }
  }

  return { consumed: 0 }
}

function extractPurpose(tokens: string[]): ListingPurpose | undefined {
  const joined = tokens.join('-').toLowerCase()
  if (joined.includes('for-rent') || tokens.includes('rent')) return 'rent'
  if (tokens.includes('pg')) return 'pg'
  return undefined
}

function extractPropertyType(tokens: string[]): ParsedListingSlug['propertyType'] {
  const joined = tokens.join('-').toLowerCase()
  if (joined.includes('flat') || joined.includes('flats') || joined.includes('apartment') || joined.includes('apartments')) return 'flat'
  if (joined.includes('house') || joined.includes('homes')) return 'house'
  if (joined.includes('villa') || joined.includes('villas')) return 'villa'
  if (joined.includes('plot') || joined.includes('plots') || joined.includes('land')) return 'plot'
  if (joined.includes('office') || joined.includes('offices')) return 'office'
  if (joined.includes('shop') || joined.includes('shops') || joined.includes('showroom')) return 'shop'
  // Common SEO intent: "<n>-bhk-..." usually implies residential flats unless explicitly stated otherwise.
  if (tokens.includes('bhk')) return 'flat'
  return 'property'
}

export function parseListingSlug(slug: string): ParsedListingSlug {
  const clean = decodeURIComponent(slug).toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '')
  const tokens = clean.split('-').filter(Boolean)

  const parsed: ParsedListingSlug = {
    slug: clean,
    keywords: [],
    purpose: extractPurpose(tokens),
    propertyType: extractPropertyType(tokens),
  }

  // BHK: <n>-bhk
  for (let i = 0; i < tokens.length - 1; i++) {
    if (tokens[i + 1] === 'bhk') {
      const num = parseNumberToken(tokens[i])
      if (num != null && num > 0) {
        parsed.bhk = num
        break
      }
    }
  }

  // Price: scan for patterns and remove first match from keywords later
  let price: PriceFilter | undefined
  for (let i = 0; i < tokens.length; i++) {
    const { price: found, consumed } = tryParsePrice(tokens.slice(i))
    if (found && consumed > 0) {
      price = found
      break
    }
  }
  if (price) parsed.price = price

  // Location: everything after "in" is interpreted as [area?] [city?]
  const inIndex = tokens.indexOf('in')
  if (inIndex !== -1 && inIndex < tokens.length - 1) {
    const locTokens = tokens.slice(inIndex + 1)
    if (locTokens.length === 1) {
      parsed.areaName = toTitleCase(kebabToWords(locTokens[0]))
    } else if (locTokens.length >= 2) {
      parsed.cityName = toTitleCase(kebabToWords(locTokens[locTokens.length - 1]))
      parsed.areaName = toTitleCase(kebabToWords(locTokens.slice(0, -1).join('-')))
    }
  } else {
    // Patterns like "flats-in-bopal" are handled above; but for "properties-in-ahmedabad"
    const propertiesInIndex = tokens.indexOf('properties')
    if (propertiesInIndex !== -1) {
      const maybeIn = tokens.indexOf('in', propertiesInIndex)
      if (maybeIn !== -1 && maybeIn < tokens.length - 1) {
        const locTokens = tokens.slice(maybeIn + 1)
        if (locTokens.length === 1) parsed.areaName = toTitleCase(kebabToWords(locTokens[0]))
        if (locTokens.length >= 2) {
          parsed.cityName = toTitleCase(kebabToWords(locTokens[locTokens.length - 1]))
          parsed.areaName = toTitleCase(kebabToWords(locTokens.slice(0, -1).join('-')))
        }
      }
    }
  }

  // Keywords: keep all non-stopword tokens for later search boosting
  parsed.keywords = tokens.filter((t) => !STOPWORDS.has(t) && t !== 'bhk')
  return parsed
}

export function toKebabCase(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}
