const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const User = require('../models/User');
const MenuItem = require('../models/MenuItem');
const { protect, adminOnly } = require('../middleware/auth');

// Dashboard stats
router.get('/stats', protect, adminOnly, async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    const totalUsers = await User.countDocuments({ role: 'user' });
    const totalMenuItems = await MenuItem.countDocuments();
    const revenueResult = await Order.aggregate([
      { $match: { paymentStatus: 'Paid' } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);
    const totalRevenue = revenueResult[0]?.total || 0;
    const recentOrders = await Order.find().populate('user', 'name email').sort({ createdAt: -1 }).limit(10);
    res.json({ totalOrders, totalUsers, totalMenuItems, totalRevenue, recentOrders });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// Get all orders
router.get('/orders', protect, adminOnly, async (req, res) => {
  try {
    const orders = await Order.find().populate('user', 'name email').sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// Update order status
router.put('/orders/:id/status', protect, adminOnly, async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id, { status: req.body.status }, { new: true }
    );
    res.json(order);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// Get all users
router.get('/users', protect, adminOnly, async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// Seed menu items
router.post('/seed', protect, adminOnly, async (req, res) => {
  try {
    await MenuItem.deleteMany({});
    const items = [
      { name: 'Margherita Pizza', description: 'Classic tomato base with fresh mozzarella and basil', price: 14.99, category: 'Pizza', emoji: '🍕', isFeatured: true, rating: 4.8, reviews: 234 },
      { name: 'Pepperoni Pizza', description: 'Loaded with premium pepperoni and melted cheese', price: 17.99, category: 'Pizza', emoji: '🍕', isFeatured: true, rating: 4.9, reviews: 312 },
      { name: 'Spaghetti Carbonara', description: 'Creamy egg sauce with crispy pancetta and parmesan', price: 16.99, category: 'Pasta', emoji: '🍝', isFeatured: true, rating: 4.7, reviews: 189 },
      { name: 'Penne Arrabbiata', description: 'Spicy tomato sauce with garlic and fresh herbs', price: 13.99, category: 'Pasta', emoji: '🍝', rating: 4.5, reviews: 98 },
      { name: 'Classic Beef Burger', description: 'Juicy 6oz beef patty with lettuce, tomato and special sauce', price: 12.99, category: 'Burgers', emoji: '🍔', isFeatured: true, rating: 4.6, reviews: 276 },
      { name: 'BBQ Bacon Burger', description: 'Smoky BBQ glazed beef with crispy bacon and cheddar', price: 15.99, category: 'Burgers', emoji: '🍔', rating: 4.8, reviews: 201 },
      { name: 'Bruschetta', description: 'Toasted bread with tomatoes, garlic and fresh basil', price: 8.99, category: 'Starters', emoji: '🥗', rating: 4.4, reviews: 87 },
      { name: 'Calamari Fritti', description: 'Crispy fried squid rings with marinara dipping sauce', price: 11.99, category: 'Starters', emoji: '🦑', isFeatured: true, rating: 4.6, reviews: 143 },
      { name: 'Tiramisu', description: 'Classic Italian dessert with espresso-soaked ladyfingers', price: 7.99, category: 'Desserts', emoji: '🍰', rating: 4.9, reviews: 421 },
      { name: 'Panna Cotta', description: 'Silky vanilla custard with berry coulis', price: 6.99, category: 'Desserts', emoji: '🍮', rating: 4.7, reviews: 156 },
      { name: 'San Pellegrino', description: 'Italian sparkling mineral water 750ml', price: 3.99, category: 'Drinks', emoji: '🥤', rating: 4.5, reviews: 67 },
      { name: 'Fresh Lemonade', description: 'Hand-squeezed lemonade with mint and ice', price: 4.99, category: 'Drinks', emoji: '🍋', rating: 4.6, reviews: 89 },
    ];
    await MenuItem.insertMany(items);
    res.json({ message: `✅ Seeded ${items.length} menu items` });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
