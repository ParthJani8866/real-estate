// app/api/properties/route.ts
import { NextResponse } from "next/server";
import { connectDB } from "../../lib/mongodb";
import Property from "../../models/Property";

export async function GET(request: Request) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const purpose = searchParams.get('purpose');
    const city = searchParams.get('city');
    const area = searchParams.get('area');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const bhk = searchParams.get('bhk');

    const filter: any = {};
    if (purpose) filter.purpose = purpose;
    if (city) filter.cityId = city;
    if (area) filter.areaId = area;
    if (bhk) filter.bhk = parseInt(bhk);
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = parseInt(minPrice);
      if (maxPrice) filter.price.$lte = parseInt(maxPrice);
    }

    const properties = await Property.find(filter)
      .populate('cityId', 'name')
      .populate('areaId', 'name')
      .sort({ createdAt: -1 })
      .limit(20)
      .lean();

    const serialized = properties.map(p => ({
      ...p,
      _id: p._id.toString(),
      cityId: p.cityId ? (typeof p.cityId === 'object' ? { _id: p.cityId._id.toString(), name: p.cityId.name } : p.cityId) : null,
      areaId: p.areaId ? (typeof p.areaId === 'object' ? { _id: p.areaId._id.toString(), name: p.areaId.name } : p.areaId) : null,
      price: p.price,
      areaSqft: p.areaSqft || 0,
      builtUpArea: p.builtUpArea || 0,
      carpetArea: p.carpetArea || 0,
      images: p.images || [],
    }));

    return NextResponse.json({ properties: serialized });
  } catch (error) {
    console.error('Error fetching properties:', error);
    return NextResponse.json({ error: 'Failed to fetch properties' }, { status: 500 });
  }
}