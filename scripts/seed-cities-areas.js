// scripts/seed-cities-areas.js
require('dotenv').config({ path: '.env.local' })
const mongoose = require('mongoose')
const City = require('../models/City')
const Area = require('../models/Area')

async function seedDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI)
    console.log('✅ Connected to MongoDB')

    // Clear existing data (optional - remove if you want to keep existing data)
    await City.deleteMany({})
    await Area.deleteMany({})
    console.log('🗑️ Cleared existing cities and areas')

    // Cities data with valid ObjectIds
    const cities = [
      { _id: new mongoose.Types.ObjectId("65a1a1a1a1a1a1a1a1a1a101"), name: "Ahmedabad", state: "Gujarat", country: "India" },
      { _id: new mongoose.Types.ObjectId("65a1a1a1a1a1a1a1a1a1a102"), name: "Gandhinagar", state: "Gujarat", country: "India" },
      { _id: new mongoose.Types.ObjectId("65a1a1a1a1a1a1a1a1a1a103"), name: "Delhi", state: "Delhi", country: "India" },
      { _id: new mongoose.Types.ObjectId("65a1a1a1a1a1a1a1a1a1a104"), name: "Melbourne", state: "Victoria", country: "Australia" }
    ]

    // Insert cities
    const insertedCities = await City.insertMany(cities)
    console.log(`✅ Inserted ${insertedCities.length} cities`)

    // Areas data with valid ObjectIds (generating new ObjectIds for each area)
    const areas = [
      { _id: new mongoose.Types.ObjectId(), name: "Satellite", cityId: cities[0]._id, pincode: "380015" },
      { _id: new mongoose.Types.ObjectId(), name: "Bopal", cityId: cities[0]._id, pincode: "380058" },
      { _id: new mongoose.Types.ObjectId(), name: "Thaltej", cityId: cities[0]._id, pincode: "380059" },
      { _id: new mongoose.Types.ObjectId(), name: "Sector 1", cityId: cities[1]._id, pincode: "382009" },
      { _id: new mongoose.Types.ObjectId(), name: "Sector 2", cityId: cities[1]._id, pincode: "382010" },
      { _id: new mongoose.Types.ObjectId(), name: "Connaught Place", cityId: cities[2]._id, pincode: "110001" },
      { _id: new mongoose.Types.ObjectId(), name: "Tullamarine", cityId: cities[3]._id, pincode: "3043" }
    ]

    // Insert areas
    const insertedAreas = await Area.insertMany(areas)
    console.log(`✅ Inserted ${insertedAreas.length} areas`)

    // Verify the data
    const cityCount = await City.countDocuments()
    const areaCount = await Area.countDocuments()
    
    console.log('\n📊 Database Summary:')
    console.log(`Total Cities: ${cityCount}`)
    console.log(`Total Areas: ${areaCount}`)

    // Show sample data
    const sampleCity = await City.findOne()
    const sampleArea = await Area.findOne().populate('cityId')
    
    console.log('\n📝 Sample City:', {
      id: sampleCity._id.toString(),
      name: sampleCity.name,
      state: sampleCity.state
    })
    
    console.log('📝 Sample Area:', {
      id: sampleArea._id.toString(),
      name: sampleArea.name,
      city: sampleArea.cityId?.name,
      pincode: sampleArea.pincode
    })

  } catch (error) {
    console.error('❌ Error seeding database:', error)
  } finally {
    await mongoose.disconnect()
    console.log('👋 Disconnected from MongoDB')
  }
}

seedDatabase()