const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// ✅ Routes Import
const authRoutes = require('./routes/authRoutes');
const medicineRoutes = require('./routes/medicines');
const diseaseRoutes = require('./routes/diseases');
const orderRoutes = require('./routes/orderRoutes'); // ✅ NEW

const app = express();

// ✅ Middlewares
app.use(cors());
app.use(express.json());

// ✅ Port
const PORT = process.env.PORT || 5000;

// ✅ MongoDB Connection
mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// ✅ Routes Use
app.use('/api/auth', authRoutes);
app.use('/api/medicines', medicineRoutes);
app.use('/api/diseases', diseaseRoutes);
app.use('/api/orders', orderRoutes); // ✅ NEW

// ✅ Test Route
app.get('/', (req, res) => {
  res.send('Online Pharmacy API is running 🚀');
});

// ✅ Global Error Handler (Optional but Professional)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// ✅ Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});