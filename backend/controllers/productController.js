const Product = require('../models/Product');
const Category = require('../models/Category');

// @desc    Get all products (with search, category filter, price filter, sorting)
// @route   GET /api/products
// @access  Public
exports.getProducts = async (req, res) => {
  try {
    const { category, search, minPrice, maxPrice, sort } = req.query;

    let query = { status: 'active' };

    // Filter by Category
    if (category) {
      query.category = category;
    }

    // Filter by Search Query (Name or Description)
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Filter by Price Range
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // Sorting
    let sortBy = { createdAt: -1 }; // Default: Newest first
    if (sort) {
      if (sort === 'priceAsc') sortBy = { price: 1 };
      else if (sort === 'priceDesc') sortBy = { price: -1 };
      else if (sort === 'rating') sortBy = { rating: -1 };
    }

    const products = await Product.find(query).populate('category').sort(sortBy);

    res.json({ success: true, count: products.length, data: products });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single product details
// @route   GET /api/products/:id
// @access  Public
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('category');

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    res.json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create a product (Admin only)
// @route   POST /api/products
// @access  Private/Admin
exports.createProduct = async (req, res) => {
  try {
    const { name, description, category, price, stock, images, specifications } = req.body;

    // Check if category exists
    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
      return res.status(400).json({ success: false, message: 'Invalid category' });
    }

    const product = await Product.create({
      name,
      description,
      category,
      price,
      stock,
      images: images || [],
      specifications: specifications || {}
    });

    res.status(201).json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update a product (Admin only)
// @route   PUT /api/products/:id
// @access  Private/Admin
exports.updateProduct = async (req, res) => {
  try {
    const { name, description, category, price, stock, images, specifications, status } = req.body;

    let product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    // Verify category if changed
    if (category) {
      const categoryExists = await Category.findById(category);
      if (!categoryExists) {
        return res.status(400).json({ success: false, message: 'Invalid category' });
      }
      product.category = category;
    }

    product.name = name || product.name;
    product.description = description || product.description;
    product.price = price !== undefined ? price : product.price;
    product.stock = stock !== undefined ? stock : product.stock;
    product.images = images || product.images;
    product.specifications = specifications || product.specifications;
    product.status = status || product.status;

    const updatedProduct = await product.save();

    res.json({ success: true, data: updatedProduct });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete a product (Admin only)
// @route   DELETE /api/products/:id
// @access  Private/Admin
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    await Product.deleteOne({ _id: req.params.id });

    res.json({ success: true, message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create new product review
// @route   POST /api/products/:id/reviews
// @access  Private
exports.createProductReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    // Check if user already reviewed this product
    const alreadyReviewed = product.reviews.find(
      (r) => r.user.toString() === req.user._id.toString()
    );

    if (alreadyReviewed) {
      return res.status(400).json({ success: false, message: 'Product already reviewed' });
    }

    const review = {
      name: req.user.username,
      rating: Number(rating),
      comment,
      user: req.user._id
    };

    product.reviews.push(review);

    product.numReviews = product.reviews.length;

    // Calculate average rating
    product.rating =
      product.reviews.reduce((acc, item) => item.rating + acc, 0) /
      product.reviews.length;

    await product.save();

    res.status(201).json({ success: true, message: 'Review added successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
