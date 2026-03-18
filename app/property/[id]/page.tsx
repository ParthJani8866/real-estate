import { notFound } from "next/navigation";
import PropertyDetailClient from "./PropertyDetailClient";

async function getProperty(id: string) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const res = await fetch(`${baseUrl}/api/properties/${id}`, {
    cache: "no-store",
  });
  if (!res.ok) return null;
  const data = await res.json();
  return data.property;
}

export default async function PropertyPage({ params }: { params: Promise<{ id: string }> }) {
  // ✅ Await the params Promise
  const { id } = await params;

  const property = await getProperty(id);
  console.log(id,property);
  
  if (!property) notFound();

  return <PropertyDetailClient property={property} />;
}