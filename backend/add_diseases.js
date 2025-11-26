// add_diseases.js — upsert extra diseases so total >= 10
require('dotenv').config();
const mongoose = require('mongoose');
const Disease = require('./models/Disease');

const EXTRA_DISEASES = [
  {
    name: 'Diabetes',
    description: 'A chronic condition where blood glucose levels are high. Management includes diet, exercise and medication as advised by doctor.',
    symptoms: ['increased thirst','frequent urination','fatigue'],
    precautions: ['Monitor blood sugar regularly','Take medicines/insulin as prescribed','Regular eye and foot checkups'],
    diets: ['Low sugar, balanced diet, portion control'],
    workouts: ['Regular walking, light cardio, strength training'],
    recommended: true
  },
  {
    name: 'Hypertension',
    description: 'High blood pressure; manage with lifestyle changes and antihypertensive medicines as per doctor.',
    symptoms: ['headache','dizziness','blurred vision'],
    precautions: ['Avoid high salt diet','Monitor BP regularly','Take meds on time'],
    diets: ['Low-sodium diet, fruits & vegetables, reduce processed food'],
    workouts: ['Regular moderate exercise, brisk walking'],
    recommended: true
  },
  {
    name: 'Asthma',
    description: 'A respiratory condition causing wheeze and breathlessness; inhalers and trigger avoidance help control symptoms.',
    symptoms: ['wheezing','shortness of breath','cough'],
    precautions: ['Avoid triggers (smoke, dust, allergens)','Carry rescue inhaler if prescribed'],
    diets: ['No special diet; maintain healthy weight'],
    workouts: ['Breathing exercises, light cardio as tolerated'],
    recommended: true
  },
  {
    name: 'Gastritis',
    description: 'Inflammation of the stomach lining causing pain, nausea. Treatment depends on cause (H. pylori, NSAIDs, alcohol).',
    symptoms: ['stomach pain','nausea','indigestion'],
    precautions: ['Avoid NSAIDs without doctor advice','Limit alcohol and spicy food','Take medicines with food when advised'],
    diets: ['Light, bland diet; avoid spicy and oily foods'],
    workouts: ['Light walking after meals (avoid heavy exercise right away)'],
    recommended: true
  },
  {
    name: 'Arthritis',
    description: 'Inflammation of joints causing pain and stiffness. Management includes physiotherapy, exercises and medicines.',
    symptoms: ['joint pain','stiffness','swelling'],
    precautions: ['Avoid heavy strain on affected joints','Follow exercise/physio plan','Take analgesics/anti-inflammatory as advised'],
    diets: ['Anti-inflammatory foods, maintain healthy weight'],
    workouts: ['Low-impact exercises: swimming, cycling, physiotherapy routines'],
    recommended: true
  },
  {
    name: 'Urinary Tract Infection',
    description: 'Infection of urinary tract causing pain and burning. Often requires antibiotics after proper diagnosis.',
    symptoms: ['burning urination','frequent urination','lower abdominal pain'],
    precautions: ['Drink plenty of water','Seek medical advice before taking antibiotics','Maintain hygiene'],
    diets: ['Increase fluids, cranberry juice may help in some cases'],
    workouts: ['Rest during acute infection; resume light activity once improved'],
    recommended: true
  }
];

async function upsertDiseases(){
  const MONGO = process.env.MONGO_URL || 'mongodb://localhost:27017/online_pharmacy';
  console.log('Connecting to', MONGO);
  await mongoose.connect(MONGO, { useNewUrlParser:true, useUnifiedTopology:true, serverSelectionTimeoutMS:30000 });
  console.log('Connected.');

  let added = 0;
  for (const d of EXTRA_DISEASES){
    // upsert by case-insensitive name
    const existing = await Disease.findOne({ name: { $regex: new RegExp('^' + d.name + '$','i') } });
    if (existing) {
      console.log('Exists:', d.name, '- skipping');
      // optional: update fields if you want; leaving as-is to avoid overwriting
    } else {
      await Disease.create(d);
      console.log('Inserted:', d.name);
      added++;
    }
  }

  console.log(`Done. ${added} new disease(s) added.`);
  await mongoose.disconnect();
  process.exit(0);
}

upsertDiseases().catch(err=>{
  console.error('Error:', err);
  process.exit(1);
});
