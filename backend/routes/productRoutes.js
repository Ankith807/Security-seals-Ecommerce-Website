const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  createProductReview
} = require('../controllers/productController');
const { protect, authorize } = require('../middleware/auth');

router
  .route('/')
  .get(getProducts)
  .post(protect, authorize('admin'), createProduct);

router
  .route('/:id')
  .get(getProductById)
  .put(protect, authorize('admin'), updateProduct)
  .delete(protect, authorize('admin'), deleteProduct);

router.route('/:id/reviews').post(protect, createProductReview);

module.exports = router;
