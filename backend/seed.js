// seed.js — safe seeding with proper connection handling
require('dotenv').config();
const mongoose = require('mongoose');

const Medicine = require('./models/Medicine');
const Disease = require('./models/Disease');

const medicines = [
  { name: 'Dolo 650', brand: 'Dolo', category: 'Analgesic', symptoms: ['fever','headache'], price: 20, stock: 100, description: 'Paracetamol 650mg tablet' },
  { name: 'Paracetamol 500', brand: 'Generic', category: 'Analgesic', symptoms: ['fever','headache'], price: 15, stock: 200, description: 'Paracetamol 500mg' },
  { name: 'Crocin', brand: 'Crocin', category: 'Analgesic', symptoms: ['fever','pain'], price: 18, stock: 150, description: 'Pain reliever' },
  { name: 'Cetirizine 10mg', brand: 'Cetrix', category: 'Antihistamine', symptoms: ['cold','allergy'], price: 50, stock: 120, description: 'Antihistamine for allergy' },
  { name: 'Azithromycin 500', brand: 'Azithro', category: 'Antibiotic', symptoms: ['infection'], price: 75, stock: 60, description: 'Antibiotic - prescription only' }
];

const diseases = [
  {
    name: 'Fever',
    description: 'Fever is a temporary increase in body temperature, often due to an infection.',
    symptoms: ['fever','headache'],
    precautions: ['Stay hydrated','Monitor temperature','Consult doctor if > 39°C'],
    diets: ['Fluids, soups, light food'],
    workouts: ['Rest, avoid intense exercise'],
    recommended: true
  },
  {
    name: 'Cold',
    description: 'Common cold causes sneezing, sore throat and congestion.',
    symptoms: ['cold','allergy'],
    precautions: ['Rest','Use humidifier','Avoid cold exposure'],
    diets: ['Warm soups, fluids'],
    workouts: ['Light walking as you recover'],
    recommended: true
  },
  {
    name: 'Infection',
    description: 'Infection may be bacterial or viral and sometimes requires antibiotics.',
    symptoms: ['infection'],
    precautions: ['Do not self-prescribe antibiotics','Consult a physician'],
    diets: ['Nutritious food to support immunity'],
    workouts: ['Rest until cleared by doctor'],
    recommended: true
  },
  {
    name: 'Headache',
    description: 'Headache can be due to tension, dehydration, or other causes.',
    symptoms: ['headache'],
    precautions: ['Hydrate','Avoid bright lights','Rest'],
    diets: ['Light meals','Avoid caffeine if triggers present'],
    workouts: ['Relaxation exercises, light stretching'],
    recommended: true
  }
];

async function runSeed() {
  const MONGO = process.env.MONGO_URL || 'mongodb://localhost:27017/online_pharmacy';
  console.log('Seed: connecting to', MONGO);

  try {
    await mongoose.connect(MONGO, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 30000
    });
    console.log('Seed: MongoDB connected');

    // Medicines
    console.log('Seed: clearing medicines collection...');
    await Medicine.deleteMany({});
    console.log('Seed: inserting medicines...');
    await Medicine.insertMany(medicines);
    console.log('Seed: medicines inserted:', medicines.length);

    // Diseases
    console.log('Seed: clearing diseases collection...');
    await Disease.deleteMany({});
    console.log('Seed: inserting diseases...');
    await Disease.insertMany(diseases);
    console.log('Seed: diseases inserted:', diseases.length);

    console.log('Seed: All done. Disconnecting...');
    await mongoose.disconnect();
    console.log('Seed: disconnected. Seed completed successfully.');
    process.exit(0);
  } catch (err) {
    console.error('Seed: ERROR during seeding:', err);
    try { await mongoose.disconnect(); } catch(e) {}
    process.exit(1);
  }
}

runSeed();
