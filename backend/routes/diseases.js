const express = require('express');
const router = express.Router();
const Disease = require('../models/Disease');
const Medicine = require('../models/Medicine');

// POST /api/diseases/predict  -> body: { name: "fever" }
router.post('/predict', async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ msg: 'Missing disease name' });

    // 1) Exact (case-insensitive) match
    let disease = await Disease.findOne({ name: { $regex: new RegExp('^' + name + '$', 'i') } });

    // 2) Fallback to partial match
    if (!disease) {
      disease = await Disease.findOne({ name: { $regex: new RegExp(name, 'i') } });
    }

    if (!disease) {
      return res.status(404).json({ msg: 'Disease not found' });
    }

    // Find medicines that match any of the disease symptoms
    const meds = await Medicine.find({ symptoms: { $in: disease.symptoms } }).limit(50);

    return res.json({ disease, medicines: meds });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// GET /api/diseases -> list all
router.get('/', async (req, res) => {
  try {
    const list = await Disease.find();
    res.json(list);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

module.exports = router;
