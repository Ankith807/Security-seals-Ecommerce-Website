const Order = require('../models/Order');
const Product = require('../models/Product');


exports.addOrderItems = async (req, res) => {
  try {
    const {
      orderItems,
      shippingAddress,
      contactNumber,
      totalAmount,
      paymentMethod,
      paymentStatus, // E.g., 'completed' if mock card/upi succeeded, 'pending' for COD
      paymentDetails
    } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ success: false, message: 'No order items provided' });
    }

    for (const item of orderItems) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(404).json({ success: false, message: `Product ${item.name} not found` });
      }
      if (product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${product.name}. Available: ${product.stock}, Requested: ${item.quantity}`
        });
      }
    }

    for (const item of orderItems) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: -item.quantity }
      });
    }

    const order = new Order({
      user: req.user._id,
      items: orderItems,
      shippingAddress,
      contactNumber,
      totalAmount,
      paymentMethod,
      paymentStatus: paymentStatus || (paymentMethod === 'cod' ? 'pending' : 'completed'),
      paymentDetails: paymentDetails || {},
      orderStatus: 'placed'
    });

    const createdOrder = await order.save();

    res.status(201).json({ success: true, data: createdOrder });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'username email')
      .populate('items.product');

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    // Allow only the user who placed it or an admin to access it
    if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to view this order' });
    }

    res.json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, count: orders.length, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate('user', 'username email')
      .sort({ createdAt: -1 });
    res.json({ success: true, count: orders.length, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


exports.updateOrderStatus = async (req, res) => {
  try {
    const { orderStatus, trackingNumber, paymentStatus } = req.body;

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    if (orderStatus) {
      order.orderStatus = orderStatus;
    }
    
    if (trackingNumber !== undefined) {
      order.trackingNumber = trackingNumber;
    }

    if (paymentStatus) {
      order.paymentStatus = paymentStatus;
    }

    if (orderStatus === 'shipped') {
      order.shippedAt = Date.now();
    } else if (orderStatus === 'delivered') {
      order.deliveredAt = Date.now();
      // Auto complete payment for COD orders upon delivery
      if (order.paymentMethod === 'cod') {
        order.paymentStatus = 'completed';
      }
    }

    const updatedOrder = await order.save();

    res.json({ success: true, data: updatedOrder });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


exports.updateOrderToPaid = async (req, res) => {
  try {
    const { transactionId, cardBrand } = req.body;

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    order.paymentStatus = 'completed';
    order.paymentDetails = {
      transactionId: transactionId || `TXN-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      cardBrand: cardBrand || 'Visa',
      paymentDate: Date.now()
    };

    const updatedOrder = await order.save();

    res.json({ success: true, data: updatedOrder });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
