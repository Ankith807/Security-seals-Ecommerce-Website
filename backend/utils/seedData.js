const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const Category = require('../models/Category');
const Product = require('../models/Product');
const Order = require('../models/Order');
const Feedback = require('../models/Feedback');

dotenv.config();

const seedData = async () => {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/raibex');
    console.log('Connected to MongoDB for seeding...');

    // Clean existing database tables
    await User.deleteMany();
    await Category.deleteMany();
    await Product.deleteMany();
    await Order.deleteMany();
    await Feedback.deleteMany();
    console.log('Existing database collections cleared.');

    // 1. Create Default Users (User & Admin)
    const adminUser = await User.create({
      username: 'RaibexAdmin',
      email: 'admin@raibex.com',
      password: 'admin123', // Hashed automatically by Pre-save hook
      role: 'admin',
      contactNumber: '+1 (555) 901-4321',
      address: 'Raibex HQ, Industrial Plaza Sector 4, New Delhi, India'
    });

    const standardUser = await User.create({
      username: 'JohnDoe',
      email: 'user@raibex.com',
      password: 'user123', // Hashed automatically
      role: 'user',
      contactNumber: '+1 (555) 123-4567',
      address: '100 Security Boulevard, Logistics District, Houston, TX 77001'
    });

    console.log('Demo users registered successfully.');

    // 2. Create Categories
    const categoriesData = [
      {
        name: 'Bolt Seals',
        description: 'ISO 17712 certified C-TPAT compliant heavy duty high-security seals, engineered for shipping containers, cargo trucks, and intermodal freight.',
        image: 'bolt_seals'
      },
      {
        name: 'Cable Seals',
        description: 'Heavy duty adjustable non-preformed steel wire locking mechanism. Used for chemical tankers, valves, railway boxcars, and container doors.',
        image: 'cable_seals'
      },
      {
        name: 'Plastic Seals',
        description: 'Pull-tight indicative tamper-evident plastic seals, adjustable length, with inner metal security lock. Ideal for medical carts, clinical waste, airline bags, and security sacks.',
        image: 'plastic_seals'
      },
      {
        name: 'Padlock Seals',
        description: 'Sleek padlock-shaped security seals with steel or plastic wire hasps, commonly used for airline catering trolleys, utility meters, scale calibration, and cash bags.',
        image: 'padlock_seals'
      },
      {
        name: 'Metal Strip Seals',
        description: 'Fixed-length tin-plated flat steel seals with double locking actions. Perfect for transport trucks, trailers, customs containers, and warehouses.',
        image: 'metal_seals'
      }
    ];

    const insertedCategories = await Category.insertMany(categoriesData);
    console.log('Categories created successfully.');

    // Map Category name to Mongoose ObjectId
    const categoryMap = {};
    insertedCategories.forEach(cat => {
      categoryMap[cat.name] = cat._id;
    });

    // 3. Create Products with specifications
    const productsData = [
      // 3.1 Bolt Seals
      {
        name: 'Raibex RX-Bolt 177',
        description: 'C-TPAT and ISO 17712:2013 high-security certified container bolt seal. Heavy-duty carbon steel locking pin wrapped in high-impact ABS plastic. Anti-spin lock body design prevents high-speed rotation tampering.',
        category: categoryMap['Bolt Seals'],
        price: 2.49,
        stock: 1200,
        images: ['https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=600&auto=format&fit=crop'],
        specifications: {
          material: 'Carbon Steel Q235, high-grade shock-proof ABS casing',
          tensileStrength: 'Over 20 kN (High Security)',
          lockingMechanism: 'Solid locking pin with anti-spin hexagonal socket',
          stripLength: 'Pin: 87mm, Bushing: 34mm',
          barcodeSupport: true,
          customPrinting: 'Laser marking of company logo, consecutive 8-digit numbering and Barcode 128'
        },
        reviews: [
          {
            user: standardUser._id,
            name: 'John Doe',
            rating: 5,
            comment: 'Absolutely robust! Passed all customs audits at the port. Hard to cut without heavy-duty bolt cutters.'
          }
        ],
        rating: 5.0,
        numReviews: 1
      },
      {
        name: 'Raibex RX-Hexa Lock',
        description: 'High-security hexagon bolt seal designed for shipping containers. High visibility bright orange coating allows quick inspection by logistics managers. Tamper-evident scrap indicators leave obvious marks if structural tension is forced.',
        category: categoryMap['Bolt Seals'],
        price: 2.85,
        stock: 850,
        images: ['https://images.unsplash.com/photo-1616401784845-180882ba9ba8?q=80&w=600&auto=format&fit=crop'],
        specifications: {
          material: 'Electro-galvanized high tensile steel with polycarbonate outer shroud',
          tensileStrength: 'Over 18.5 kN',
          lockingMechanism: 'Self-locking push mechanism with internal spring lock washer',
          stripLength: 'Pin length 80mm, diameter 8mm',
          barcodeSupport: true,
          customPrinting: 'Laser heat printing with brand identification and sequence codes'
        },
        reviews: [],
        rating: 0,
        numReviews: 0
      },

      // 3.2 Cable Seals
      {
        name: 'Raibex Flexi-Cable 2.5',
        description: 'Heavy duty adjustable non-preformed steel wire cable seal. The steel wire unravels immediately if cut, making it impossible to re-join and hide tampering. Features an anodized aluminum alloy body.',
        category: categoryMap['Cable Seals'],
        price: 1.75,
        stock: 1500,
        images: ['https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?q=80&w=600&auto=format&fit=crop'],
        specifications: {
          material: 'Anodized Aluminum Lock Body, Galvanized Aircraft Cable wire',
          tensileStrength: 'Over 3.5 kN (Group II Security)',
          lockingMechanism: 'One-way locking roller bearing clutch system',
          stripLength: 'Standard wire length 300mm, wire diameter 2.5mm',
          barcodeSupport: true,
          customPrinting: 'White laser text of company initials, sequential counting and optional QR codes'
        },
        reviews: [],
        rating: 0,
        numReviews: 0
      },
      {
        name: 'Raibex ArmorCable 4.0',
        description: 'Extreme heavy-duty cable seal with a 4.0mm aircraft grade wire. Designed to withstand harsh environment logistics and chemical tanker transports. Requires a heavy cable cutter to remove.',
        category: categoryMap['Cable Seals'],
        price: 3.20,
        stock: 600,
        images: ['https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=600&auto=format&fit=crop'],
        specifications: {
          material: 'High-grade die-cast aluminum lock housing with extra-tensile carbon steel wire',
          tensileStrength: 'Over 12 kN (High Security)',
          lockingMechanism: 'Precision gear rotation locking plate',
          stripLength: 'Length 350mm, diameter 4.0mm',
          barcodeSupport: false,
          customPrinting: 'Hot foil stamped company name and unique 7-digit ID numbers'
        },
        reviews: [],
        rating: 0,
        numReviews: 0
      },

      // 3.3 Plastic Seals
      {
        name: 'Raibex Poly-Pull 300',
        description: 'Adjustable pull-tight plastic seal made of high-quality polypropylene. Renders high durability against harsh weather, featuring a built-in spring metal insert inside the locking chamber for extra grip.',
        category: categoryMap['Plastic Seals'],
        price: 0.28,
        stock: 5000,
        images: ['https://images.unsplash.com/photo-1599806112354-67f8b5425a06?q=80&w=600&auto=format&fit=crop'],
        specifications: {
          material: 'Polypropylene (PP) body with premium stainless steel lock sheet insert',
          tensileStrength: '350 N (Indicative Security)',
          lockingMechanism: 'Multi-point teeth strip with metal spring inserts',
          stripLength: 'Total length 300mm, active tail length 240mm',
          barcodeSupport: true,
          customPrinting: 'Laser printed serial numbering, logo marks, and short text phrases'
        },
        reviews: [
          {
            user: standardUser._id,
            name: 'John Doe',
            rating: 4,
            comment: 'Very easy to deploy. High-contrast colors help us identify departments instantly. The metal insert gives a nice click lock.'
          }
        ],
        rating: 4.0,
        numReviews: 1
      },
      {
        name: 'Raibex RX-TearOff Indicative',
        description: 'Lightweight plastic seal featuring a convenient tear-off side handle. Can be removed manually by operations staff without requiring cutters, while providing complete proof of prior entry.',
        category: categoryMap['Plastic Seals'],
        price: 0.18,
        stock: 10000,
        images: ['https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=600&auto=format&fit=crop'],
        specifications: {
          material: 'Recyclable high density Polypropylene (HDPE)',
          tensileStrength: '150 N',
          lockingMechanism: 'Single piece friction chamber lock',
          stripLength: 'Total length 200mm, thickness 2mm',
          barcodeSupport: false,
          customPrinting: 'Hot embossed stamp printing with consecutive serial code increments'
        },
        reviews: [],
        rating: 0,
        numReviews: 0
      },

      // 3.4 Padlock Seals
      {
        name: 'Raibex MeterLock P1',
        description: 'Padlock style utility meter seal with clear transparent acrylic body to reveal any tampering attempts with the internal lock mechanisms. Fitted with pre-bent stainless steel wire hasp.',
        category: categoryMap['Padlock Seals'],
        price: 0.45,
        stock: 3500,
        images: ['https://images.unsplash.com/photo-1582139329536-e7284fece509?q=80&w=600&auto=format&fit=crop'],
        specifications: {
          material: 'Transparent SAN acrylic resin body, stainless steel wire hasp',
          tensileStrength: '280 N',
          lockingMechanism: 'Internal dual locking teeth anchor',
          stripLength: 'Hasp thickness 1.2mm, length 24mm',
          barcodeSupport: false,
          customPrinting: 'Laser engraved numeric identification and corporate abbreviation'
        },
        reviews: [],
        rating: 0,
        numReviews: 0
      },

      // 3.5 Metal Strip Seals
      {
        name: 'Raibex CargoGuard Tin-Seal',
        description: 'Traditional flat-strip metal seal. Tin-plated steel band with dual locking mechanism protected inside an spherical dome cover. Extreme weather resistance, suitable for interstate trailers.',
        category: categoryMap['Metal Strip Seals'],
        price: 0.35,
        stock: 4000,
        images: ['https://images.unsplash.com/photo-1578575437130-527eed3abbec?q=80&w=600&auto=format&fit=crop'],
        specifications: {
          material: 'Tin-plated high grade structural steel strip',
          tensileStrength: '600 N',
          lockingMechanism: 'Spherical lock head enclosing two steel flat locking rings',
          stripLength: 'Width 9.5mm, length 215mm',
          barcodeSupport: false,
          customPrinting: 'Embossed characters representing company name and numeric series'
        },
        reviews: [],
        rating: 0,
        numReviews: 0
      }
    ];

    await Product.insertMany(productsData);
    console.log('Seals products catalog seeded successfully.');

    // 4. Create one mock feedback
    await Feedback.create({
      name: 'Global Logistics Corp',
      email: 'logistics@globalcorp.com',
      subject: 'Bulk Quote for RX-Bolt 177',
      message: 'Hello, we are interested in ordering 50,000 units of the RX-Bolt 177 per month for our shipping containers. Please contact us with your wholesale pricing sheet and shipping terms to the Port of Rotterdam.',
      rating: 5
    });
    console.log('Sample client feedback inquiry added.');

    console.log('Database Seeding Complete!');
    process.exit(0);
  } catch (error) {
    console.error(`Error seeding database: ${error.message}`);
    process.exit(1);
  }
};

// If run directly
if (require.main === module) {
  seedData();
}
