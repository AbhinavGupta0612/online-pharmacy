// add_medicines_for_new_diseases.js
// Safe upsert: adds medicines for the recently added diseases if they don't already exist.

require('dotenv').config();
const mongoose = require('mongoose');
const Medicine = require('./models/Medicine');

const MEDS = [
  // Diabetes
  { name: 'Metformin 500', brand: 'GlucoCare', category: 'Antidiabetic', symptoms: ['increased thirst','frequent urination','fatigue'], price: 120, stock: 200, description: 'Metformin 500mg — oral antidiabetic agent.' },
  { name: 'Glimipride 2', brand: 'DiaPro', category: 'Antidiabetic', symptoms: ['increased thirst','frequent urination'], price: 95, stock: 150, description: 'Glimipride 2mg — stimulates insulin release.' },

  // Hypertension
  { name: 'Amlodipine 5', brand: 'CardioPlus', category: 'Antihypertensive', symptoms: ['headache','dizziness','blurred vision'], price: 45, stock: 220, description: 'Amlodipine 5mg — calcium channel blocker for BP control.' },
  { name: 'Losartan 50', brand: 'LosaCare', category: 'Antihypertensive', symptoms: ['headache','dizziness'], price: 80, stock: 180, description: 'Losartan 50mg — angiotensin receptor blocker.' },

  // Asthma
  { name: 'Salbutamol Inhaler', brand: 'BreathEasy', category: 'Bronchodilator', symptoms: ['wheezing','shortness of breath','cough'], price: 260, stock: 120, description: 'Salbutamol (albuterol) inhaler — quick relief bronchodilator.' },
  { name: 'Budesonide Inhaler', brand: 'AirCare', category: 'Corticosteroid Inhaler', symptoms: ['wheezing','cough'], price: 450, stock: 90, description: 'Budesonide inhaler — controller inhaled steroid.' },

  // Gastritis
  { name: 'Pantoprazole 40', brand: 'GastroSafe', category: 'PPI', symptoms: ['stomach pain','nausea','indigestion'], price: 70, stock: 160, description: 'Pantoprazole 40mg — proton pump inhibitor for acid suppression.' },
  { name: 'Domperidone', brand: 'StomaCare', category: 'Antiemetic', symptoms: ['nausea','indigestion'], price: 60, stock: 140, description: 'Domperidone — antiemetic to relieve nausea.' },

  // Arthritis
  { name: 'Celecoxib 200', brand: 'JointRelief', category: 'NSAID', symptoms: ['joint pain','stiffness','swelling'], price: 130, stock: 130, description: 'Celecoxib 200mg — NSAID for inflammatory pain.' },
  { name: 'Glucosamine Sulphate', brand: 'OrthoFlex', category: 'Supplement', symptoms: ['joint pain','stiffness'], price: 300, stock: 120, description: 'Glucosamine supplement for joint health.' },

  // Urinary Tract Infection (UTI)
  { name: 'Nitrofurantoin 100', brand: 'UroSafe', category: 'Antibiotic', symptoms: ['burning urination','frequent urination','lower abdominal pain'], price: 90, stock: 100, description: 'Nitrofurantoin 100mg — used for uncomplicated UTIs.' },
  { name: 'Ciprofloxacin 500', brand: 'CiproMax', category: 'Antibiotic', symptoms: ['burning urination','infection'], price: 120, stock: 80, description: 'Ciprofloxacin 500mg — broad-spectrum antibiotic (prescription required).' }
];

async function upsertMeds(){
  const MONGO = process.env.MONGO_URL || 'mongodb://localhost:27017/online_pharmacy';
  console.log('Connecting to', MONGO);
  await mongoose.connect(MONGO, { useNewUrlParser:true, useUnifiedTopology:true, serverSelectionTimeoutMS:30000 });
  console.log('Connected.');

  let inserted = 0;
  for(const m of MEDS){
    const existing = await Medicine.findOne({ name: { $regex: new RegExp('^' + m.name + '$', 'i') } });
    if(existing){
      console.log('Exists:', m.name, '- skipping');
    } else {
      await Medicine.create(m);
      console.log('Inserted:', m.name);
      inserted++;
    }
  }

  console.log(`Done. ${inserted} new medicine(s) added.`);
  await mongoose.disconnect();
  process.exit(0);
}

upsertMeds().catch(err=>{
  console.error('Error:', err);
  process.exit(1);
});
