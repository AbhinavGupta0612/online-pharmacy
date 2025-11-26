// testdb.js — quick connection tester
require('dotenv').config();
const mongoose = require('mongoose');

console.log('Using MONGO_URL =', process.env.MONGO_URL);

mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 30000 // 30s timeout for debugging
})
.then(() => {
  console.log('✅ Connected to MongoDB successfully');
  return mongoose.connection.db.admin().ping();
})
.then(r => {
  console.log('Ping result:', r);
  mongoose.disconnect();
})
.catch(err => {
  console.error('❌ Mongo connection failed — full error below:');
  console.error(err);
  process.exit(1);
});
