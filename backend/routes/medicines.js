const express = require('express');
const router = express.Router();
const Medicine = require('../models/Medicine');
const auth = require('../middleware/auth');

// Add medicine (admin ideally) - for simplicity no role check
router.post('/', auth, async (req, res) => {
  try{
    const med = new Medicine(req.body);
    await med.save();
    res.json(med);
  }catch(err){
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Get all medicines
router.get('/', async (req, res) => {
  try{
    const meds = await Medicine.find();
    res.json(meds);
  }catch(err){
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Get by id
router.get('/:id', async (req, res) => {
  try{
    const med = await Medicine.findById(req.params.id);
    if(!med) return res.status(404).json({ msg: 'Medicine not found' });
    res.json(med);
  }catch(err){
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Recommendation endpoint: by symptom or similar name
router.post('/recommend', async (req, res) => {
  try{
    const { symptom, name } = req.body;

    if(symptom){
      // symptom-based: return medicines whose symptoms array contains the symptom (case-insensitive)
      const meds = await Medicine.find({ symptoms: { $regex: new RegExp(symptom, 'i') } });
      return res.json(meds);
    }

    if(name){
      // name-based similar: find other medicines with same category or overlapping symptoms
      const m = await Medicine.findOne({ name: { $regex: new RegExp(name, 'i') } });
      if(!m) return res.json([]);

      const similar = await Medicine.find({
        _id: { $ne: m._id },
        $or: [ { category: m.category }, { symptoms: { $in: m.symptoms } } ]
      }).limit(10);

      return res.json(similar);
    }

    res.json([]);
  }catch(err){
    console.error(err);
    res.status(500).send('Server error');
  }
});

module.exports = router;
