// app/api/admin/properties/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '../../../lib/mongodb'
import Property from '../../../models/Property'
import jwt from 'jsonwebtoken'
import { Types } from 'mongoose'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

// Helper function to convert MongoDB document to frontend-friendly object
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

export async function GET(req: NextRequest) {
  try {
    await connectDB()
    
    // Get token from header
    const token = req.headers.get('authorization')?.replace('Bearer ', '')
    
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Verify token
    try {
      jwt.verify(token, JWT_SECRET)
    } catch (error) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    // Fetch properties with populated references
    const properties = await Property.find({})
      .populate('cityId', 'name')
      .populate('areaId', 'name')
      .sort({ createdAt: -1 })
      .lean()

    // Serialize each property to convert ObjectIds to strings
    const serializedProperties = properties.map((prop:any) => ({
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

export async function POST(req: NextRequest) {
  try {
    await connectDB()

    // Get token from header
    const token = req.headers.get('authorization')?.replace('Bearer ', '')
    
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Verify token
    try {
      jwt.verify(token, JWT_SECRET)
    } catch (error) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    const body = await req.json()
    
    // Convert string IDs to ObjectIds
    const propertyData = {
      ...body,
      cityId: body.cityId ? new Types.ObjectId(body.cityId) : undefined,
      areaId: body.areaId ? new Types.ObjectId(body.areaId) : undefined,
      postedBy: body.postedBy ? {
        ...body.postedBy,
        id: body.postedBy.id ? new Types.ObjectId(body.postedBy.id) : undefined
      } : undefined
    }

    // Create property
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

export async function PUT(req: NextRequest) {
  try {
    await connectDB()

    // Get token from header
    const token = req.headers.get('authorization')?.replace('Bearer ', '')
    
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Verify token
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
    
    // Convert string IDs to ObjectIds
    const propertyData = {
      ...body,
      cityId: body.cityId ? new Types.ObjectId(body.cityId) : undefined,
      areaId: body.areaId ? new Types.ObjectId(body.areaId) : undefined,
      postedBy: body.postedBy ? {
        ...body.postedBy,
        id: body.postedBy.id ? new Types.ObjectId(body.postedBy.id) : undefined
      } : undefined
    }

    // Update property
    const property = await Property.findByIdAndUpdate(
      new Types.ObjectId(id),
      propertyData,
      { new: true, runValidators: true }
    )

    if (!property) {
      return NextResponse.json({ error: 'Property not found' }, { status: 404 })
    }

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

export async function DELETE(req: NextRequest) {
  try {
    await connectDB()

    // Get token from header
    const token = req.headers.get('authorization')?.replace('Bearer ', '')
    
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Verify token
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

    // Delete property
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