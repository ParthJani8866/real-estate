import { notFound } from 'next/navigation'
import PropertyDetailClient from './PropertyDetailClient'

async function getProperty(id: string) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
  const res = await fetch(`${baseUrl}/api/properties/${id}`, { cache: 'no-store' })
  if (!res.ok) return null
  const data = await res.json()
  return data.property
}

export default async function PropertyPage({ params }: { params: { id: string } }) {
  const property = await getProperty(params.id)
  if (!property) notFound()
  return <PropertyDetailClient property={property} />
}

