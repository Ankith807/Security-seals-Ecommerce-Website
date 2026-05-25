const express = require('express');
const router = express.Router();
const {
  addOrderItems,
  getOrderById,
  getMyOrders,
  getOrders,
  updateOrderStatus,
  updateOrderToPaid
} = require('../controllers/orderController');
const { protect, authorize } = require('../middleware/auth');

router
  .route('/')
  .post(protect, addOrderItems)
  .get(protect, authorize('admin'), getOrders);

router.route('/myorders').get(protect, getMyOrders);

router.route('/:id').get(protect, getOrderById);

router.route('/:id/status').put(protect, authorize('admin'), updateOrderStatus);

router.route('/:id/pay').put(protect, updateOrderToPaid);

module.exports = router;
