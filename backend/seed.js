// seed.js - Database seeder script to populate initial demo data
const path = require('path');
// WHY: Explicitly resolve .env path using __dirname so it works whether run from root or backend directory
require('dotenv').config({ path: path.join(__dirname, '.env') });
const mongoose = require('mongoose');
const Customer = require('./models/Customer');
const Vehicle = require('./models/Vehicle');
const Booking = require('./models/Booking');

const seedDatabase = async () => {
  try {
    // WHY: Connect to MongoDB using connection URI from environment
    console.log('[Seed] Connecting to MongoDB at:', process.env.MONGO_URI);
    await mongoose.connect(process.env.MONGO_URI);

    // WHY: Wipe existing records to ensure clean, repeatable, idempotent seed state
    console.log('[Seed] Clearing existing collections (Customers, Vehicles, Bookings)...');
    await Customer.deleteMany({});
    await Vehicle.deleteMany({});
    await Booking.deleteMany({});

    // 1. Seed Customers (2 realistic Indian customer records)
    const customersData = [
      {
        name: 'Rahul Sharma',
        email: 'rahul@example.com',
        phone: '+91 9876543210',
        licenseNumber: 'DL-0420110012345'
      },
      {
        name: 'Priya Patel',
        email: 'priya@example.com',
        phone: '+91 9812345678',
        licenseNumber: 'MH-0220190098765'
      }
    ];

    const createdCustomers = await Customer.insertMany(customersData);
    console.log(`[Seed] Inserted ${createdCustomers.length} demo customers.`);

    // 2. Seed 10 Vehicles (Indian models across Hatchback, Sedan, SUV segments)
    // Exactly 2 vehicles are marked available: false so examiners can test the "Not Available" badge immediately
    const vehiclesData = [
      // Hatchbacks
      {
        model: 'Maruti Suzuki Swift',
        type: 'Hatchback',
        pricePerDay: 1800,
        available: true
      },
      {
        model: 'Hyundai i20 Asta',
        type: 'Hatchback',
        pricePerDay: 2000,
        available: true
      },
      {
        model: 'Tata Altroz XZ',
        type: 'Hatchback',
        pricePerDay: 1900,
        available: false // UNAVAILABLE BADGE TEST 1
      },

      // Sedans
      {
        model: 'Honda City ZX',
        type: 'Sedan',
        pricePerDay: 3200,
        available: true
      },
      {
        model: 'Hyundai Verna Turbo',
        type: 'Sedan',
        pricePerDay: 3400,
        available: true
      },
      {
        model: 'Skoda Slavia Style',
        type: 'Sedan',
        pricePerDay: 3500,
        available: false // UNAVAILABLE BADGE TEST 2
      },

      // SUVs
      {
        model: 'Hyundai Creta SX',
        type: 'SUV',
        pricePerDay: 3800,
        available: true
      },
      {
        model: 'Mahindra XUV700 AX7',
        type: 'SUV',
        pricePerDay: 4500,
        available: true
      },
      {
        model: 'Tata Harrier Fearless',
        type: 'SUV',
        pricePerDay: 4200,
        available: true
      },
      {
        model: 'Toyota Innova Crysta',
        type: 'SUV',
        pricePerDay: 5000,
        available: true
      }
    ];

    const createdVehicles = await Vehicle.insertMany(vehiclesData);
    console.log(`[Seed] Inserted ${createdVehicles.length} vehicles (8 Available, 2 Not Available).`);

    // Output formatted credentials for the viva examination demo
    console.log('\n======================================================');
    console.log('🚗 DRIVE-EASY DEMO LOGIN CREDENTIALS (NO PASSWORD):');
    console.log('======================================================');
    createdCustomers.forEach((c, idx) => {
      console.log(`User ${idx + 1}:`);
      console.log(`  Name          : ${c.name}`);
      console.log(`  Email         : ${c.email}`);
      console.log(`  License Number: ${c.licenseNumber}`);
      console.log('------------------------------------------------------');
    });
    console.log('Seed completed successfully!\n');

    process.exit(0);
  } catch (error) {
    console.error('[Seed Error] Failed to seed database:', error);
    process.exit(1);
  }
};

seedDatabase();
