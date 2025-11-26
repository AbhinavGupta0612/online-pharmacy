const mongoose = require('mongoose');

const DiseaseSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String },
  symptoms: [String],
  precautions: [String],
  diets: [String],
  workouts: [String],
  recommended: { type: Boolean, default: true }
});

module.exports = mongoose.model('Disease', DiseaseSchema);
