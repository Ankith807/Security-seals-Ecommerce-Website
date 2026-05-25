const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a product name'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Please add a product description']
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: [true, 'Please associate a category']
  },
  price: {
    type: Number,
    required: [true, 'Please add a product price'],
    default: 0.0
  },
  stock: {
    type: Number,
    required: [true, 'Please add a product stock'],
    default: 0
  },
  images: {
    type: [String],
    default: []
  },
  // Technical specifications specific to high-security seals (e.g. Raibex)
  specifications: {
    material: { type: String, default: '' },
    tensileStrength: { type: String, default: '' }, // e.g. "Over 15 kN"
    lockingMechanism: { type: String, default: '' }, // e.g. "Split-ring metal locking"
    stripLength: { type: String, default: '' }, // e.g. "300 mm"
    barcodeSupport: { type: Boolean, default: false },
    customPrinting: { type: String, default: 'Laser marked logo & serial numbering' }
  },
  reviews: [ReviewSchema],
  rating: {
    type: Number,
    default: 0
  },
  numReviews: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['active', 'draft'],
    default: 'active'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Product', ProductSchema);
