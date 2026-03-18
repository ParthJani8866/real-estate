// app/api/admin/properties/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '../../../lib/mongodb'
import Property from '../../../models/Property'
import City from '../../../models/City'
import Area from '../../../models/Area'
import jwt from 'jsonwebtoken'
import { Types } from 'mongoose'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

// Helper: slugify a string
function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')           // spaces to -
    .replace(/[^\w\-]+/g, '')       // remove non-word chars
    .replace(/\-\-+/g, '-')         // collapse multiple -
    .replace(/^-+/, '')              // trim - from start
    .replace(/-+$/, '');             // trim - from end
}

// Helper: generate a unique slug (append number if duplicate)
async function generateUniqueSlug(
  baseSlug: string,
  model: any,
  currentId?: string
): Promise<string> {
  let slug = baseSlug;
  let count = 1;
  const query: any = { slug };
  if (currentId) query._id = { $ne: new Types.ObjectId(currentId) };
  while (await model.findOne(query)) {
    slug = `${baseSlug}-${count}`;
    query.slug = slug;
    count++;
  }
  return slug;
}

// Helper: get city and area names from IDs (for slug)
async function getLocationNames(cityId?: string, areaId?: string) {
  let cityName = 'unknown';
  let areaName = 'unknown';
  if (cityId && Types.ObjectId.isValid(cityId)) {
    const city = await City.findById(cityId).lean();
    if (city) cityName = city.name;
  }
  if (areaId && Types.ObjectId.isValid(areaId)) {
    const area = await Area.findById(areaId).lean();
    if (area) areaName = area.name;
  }
  return { cityName, areaName };
}

// Helper to convert MongoDB document to frontend-friendly object
function serializeProperty(doc: any) {
  if (!doc) return null
  
  const obj = doc.toObject ? doc.toObject() : doc
  
  return {
    ...obj,
    _id: obj._id.toString(),
    cityId: obj.cityId?.toString() || null,
    areaId: obj.areaId?.toString() || null,
    postedBy: obj.postedBy ? {
      ...obj.postedBy,
      id: obj.postedBy.id?.toString() || null
    } : null,
    createdAt: obj.createdAt?.toISOString(),
    updatedAt: obj.updatedAt?.toISOString()
  }
}

// ---------- GET ----------
export async function GET(req: NextRequest) {
  try {
    await connectDB()
    
    const token = req.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
      jwt.verify(token, JWT_SECRET)
    } catch (error) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    const properties = await Property.find({})
      .populate('cityId', 'name')
      .populate('areaId', 'name')
      .sort({ createdAt: -1 })
      .lean()

    const serializedProperties = properties.map((prop: any) => ({
      ...prop,
      _id: prop._id.toString(),
      cityId: prop.cityId ? {
        ...prop.cityId,
        _id: prop.cityId._id.toString()
      } : null,
      areaId: prop.areaId ? {
        ...prop.areaId,
        _id: prop.areaId._id.toString()
      } : null
    }))

    return NextResponse.json({ properties: serializedProperties })
  } catch (error) {
    console.error('Error fetching properties:', error)
    return NextResponse.json(
      { error: 'Failed to fetch properties' },
      { status: 500 }
    )
  }
}

// ---------- POST ----------
export async function POST(req: NextRequest) {
  try {
    await connectDB()

    const token = req.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
      jwt.verify(token, JWT_SECRET)
    } catch (error) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    const body = await req.json()

    // --- Generate unique slug from city, area, title ---
    const { cityName, areaName } = await getLocationNames(body.cityId, body.areaId);
    const titleSlug = body.title ? slugify(body.title) : 'property';
    const baseSlug = `${slugify(cityName)}-${slugify(areaName)}-${titleSlug}`;
    const uniqueSlug = await generateUniqueSlug(baseSlug, Property);

    // Convert string IDs to ObjectIds
    const propertyData = {
      ...body,
      slug: uniqueSlug,                     // add generated slug
      cityId: body.cityId ? new Types.ObjectId(body.cityId) : undefined,
      areaId: body.areaId ? new Types.ObjectId(body.areaId) : undefined,
      postedBy: body.postedBy ? {
        ...body.postedBy,
        id: body.postedBy.id ? new Types.ObjectId(body.postedBy.id) : undefined
      } : undefined
    }

    const property = await Property.create(propertyData)

    return NextResponse.json({ 
      success: true, 
      property: serializeProperty(property)
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating property:', error)
    return NextResponse.json(
      { error: 'Failed to create property' },
      { status: 500 }
    )
  }
}

// ---------- PUT ----------
export async function PUT(req: NextRequest) {
  try {
    await connectDB()

    const token = req.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
      jwt.verify(token, JWT_SECRET)
    } catch (error) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')
    if (!id) {
      return NextResponse.json({ error: 'Property ID required' }, { status: 400 })
    }

    const body = await req.json()
    const existingProperty = await Property.findById(id)
    if (!existingProperty) {
      return NextResponse.json({ error: 'Property not found' }, { status: 404 })
    }

    // Determine if slug needs to be regenerated
    const cityChanged = body.cityId && body.cityId !== existingProperty.cityId?.toString();
    const areaChanged = body.areaId && body.areaId !== existingProperty.areaId?.toString();
    const titleChanged = body.title && body.title !== existingProperty.title;

    let newSlug = existingProperty.slug; // keep existing by default
    if (cityChanged || areaChanged || titleChanged) {
      const { cityName, areaName } = await getLocationNames(body.cityId, body.areaId);
      const titleSlug = body.title ? slugify(body.title) : 'property';
      const baseSlug = `${slugify(cityName)}-${slugify(areaName)}-${titleSlug}`;
      newSlug = await generateUniqueSlug(baseSlug, Property, id);
    }

    // Convert string IDs to ObjectIds
    const propertyData = {
      ...body,
      slug: newSlug,
      cityId: body.cityId ? new Types.ObjectId(body.cityId) : undefined,
      areaId: body.areaId ? new Types.ObjectId(body.areaId) : undefined,
      postedBy: body.postedBy ? {
        ...body.postedBy,
        id: body.postedBy.id ? new Types.ObjectId(body.postedBy.id) : undefined
      } : undefined
    }

    const property = await Property.findByIdAndUpdate(
      new Types.ObjectId(id),
      propertyData,
      { new: true, runValidators: true }
    )

    return NextResponse.json({ 
      success: true, 
      property: serializeProperty(property)
    })
  } catch (error) {
    console.error('Error updating property:', error)
    return NextResponse.json(
      { error: 'Failed to update property' },
      { status: 500 }
    )
  }
}

// ---------- DELETE ----------
export async function DELETE(req: NextRequest) {
  try {
    await connectDB()

    const token = req.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
      jwt.verify(token, JWT_SECRET)
    } catch (error) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')
    if (!id) {
      return NextResponse.json({ error: 'Property ID required' }, { status: 400 })
    }

    const property = await Property.findByIdAndDelete(new Types.ObjectId(id))

    if (!property) {
      return NextResponse.json({ error: 'Property not found' }, { status: 404 })
    }

    return NextResponse.json({ 
      success: true,
      message: 'Property deleted successfully' 
    })
  } catch (error) {
    console.error('Error deleting property:', error)
    return NextResponse.json(
      { error: 'Failed to delete property' },
      { status: 500 }
    )
  }
}