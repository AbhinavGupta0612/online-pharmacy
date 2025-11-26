const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const medicineRoutes = require('./routes/medicines');
const diseaseRoutes = require('./routes/diseases');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

app.use('/api/auth', authRoutes);
app.use('/api/medicines', medicineRoutes);
app.use('/api/diseases', diseaseRoutes);


app.get('/', (req, res) => res.send('Online Pharmacy API is running'));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
