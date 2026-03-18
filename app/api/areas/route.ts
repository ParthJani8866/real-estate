// app/api/areas/route.ts
import { NextResponse } from "next/server";
import { connectDB } from "../../lib/mongodb";
import Area from "../../models/Area";

export async function GET() {
  try {
    console.log('Connecting to database...');
    await connectDB();
    
    console.log('Fetching areas...');
    const areas = await Area.find().lean();
    
    
    // Transform each area to ensure cityId is a string
    const transformedAreas = areas.map(area => {
    
      
      return {
        _id: area._id.toString(),
        name: area.name,
        cityId: area.cityId ? area.cityId.toString() : null, // Ensure cityId is string
        pincode: area.pincode || null
      };
    });
    
    
    return NextResponse.json(transformedAreas);
    
  } catch (error) {
    console.error('Error in /api/areas:', error);
    return NextResponse.json(
      { error: 'Failed to fetch areas' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    
    
    const area = await Area.create(body);
    
    return NextResponse.json({
      _id: area._id.toString(),
      name: area.name,
      cityId: area.cityId?.toString(),
      pincode: area.pincode
    }, { status: 201 });
    
  } catch (error) {
    console.error('Error creating area:', error);
    return NextResponse.json(
      { error: 'Failed to create area' },
      { status: 500 }
    );
  }
}