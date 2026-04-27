const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  menuItem: { type: mongoose.Schema.Types.ObjectId, ref: 'MenuItem', required: true },
  name: String,
  price: Number,
  quantity: { type: Number, required: true, min: 1 },
  emoji: String
});

const orderSchema = new mongoose.Schema({
   user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
   guestName: { type: String, default: 'Guest' },
   guestEmail: { type: String, default: '' },
   items: [orderItemSchema],
   totalAmount: { type: Number, required: true },
   deliveryAddress: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    zip: { type: String, required: true }
  },
  status: {
    type: String,
    enum: ['Pending', 'Confirmed', 'Preparing', 'Out for Delivery', 'Delivered', 'Cancelled'],
    default: 'Pending'
  },
  paymentStatus: { type: String, enum: ['Pending', 'Paid', 'Failed'], default: 'Pending' },
  paymentIntentId: { type: String, default: '' },
  estimatedDelivery: { type: String, default: '30-45 min' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', orderSchema);
