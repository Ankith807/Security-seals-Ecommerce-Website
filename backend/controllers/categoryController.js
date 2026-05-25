const Category = require('../models/Category');
const Product = require('../models/Product');

exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find({});
    res.json({ success: true, count: categories.length, data: categories });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create a category
// @route   POST /api/categories
// @access  Private/Admin
exports.createCategory = async (req, res) => {
  try {
    const { name, description, image } = req.body;

    const categoryExists = await Category.findOne({ name });
    if (categoryExists) {
      return res.status(400).json({ success: false, message: 'Category already exists' });
    }

    const category = await Category.create({
      name,
      description,
      image: image || ''
    });

    res.status(201).json({ success: true, data: category });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update a category
// @route   PUT /api/categories/:id
// @access  Private/Admin
exports.updateCategory = async (req, res) => {
  try {
    const { name, description, image } = req.body;

    let category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    category.name = name || category.name;
    category.description = description || category.description;
    category.image = image || category.image;

    const updatedCategory = await category.save();

    res.json({ success: true, data: updatedCategory });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete a category
// @route   DELETE /api/categories/:id
// @access  Private/Admin
exports.deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    // Check if products are associated with this category
    const productsAssociated = await Product.countDocuments({ category: req.params.id });
    if (productsAssociated > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete category. There are ${productsAssociated} products associated with it.`
      });
    }

    await Category.deleteOne({ _id: req.params.id });

    res.json({ success: true, message: 'Category removed successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
