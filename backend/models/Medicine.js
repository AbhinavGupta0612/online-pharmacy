const mongoose = require('mongoose');

const MedicineSchema = new mongoose.Schema({
  name: { type: String, required: true },
  brand: { type: String },
  category: { type: String },
  symptoms: [String], // e.g. ['fever','headache']
  price: { type: Number, default: 0 },
  stock: { type: Number, default: 0 },
  description: { type: String }
});

module.exports = mongoose.model('Medicine', MedicineSchema);
