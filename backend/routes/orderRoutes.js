const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const { protect, adminOnly } = require('../middleware/authMiddleware');

/*
---------------------------------------
CREATE ORDER (User)
---------------------------------------
*/
router.post('/', protect, async (req, res) => {
  try {
    const { items, total } = req.body;

    const newOrder = new Order({
      user: req.user.id,
      items,
      total
    });

    const savedOrder = await newOrder.save();
    res.status(201).json(savedOrder);

  } catch (error) {
    res.status(500).json({ message: 'Order creation failed' });
  }
});

/*
---------------------------------------
GET USER ORDERS
---------------------------------------
*/
router.get('/my-orders', protect, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch orders' });
  }
});

/*
---------------------------------------
GET ALL ORDERS (ADMIN)
---------------------------------------
*/
router.get('/', protect, adminOnly, async (req, res) => {
  try {
    const orders = await Order.find().populate('user', 'name email');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch orders' });
  }
});

/*
---------------------------------------
UPDATE ORDER STATUS (ADMIN)
---------------------------------------
*/
router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );

    res.json(updatedOrder);

  } catch (error) {
    res.status(500).json({ message: 'Status update failed' });
  }
});

module.exports = router;