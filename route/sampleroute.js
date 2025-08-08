const express = require('express');
const router = express.Router();
const Sample = require('../models/sample');

// Create a new record
router.post('/', async (req, res) => {
    try {
        const newSample = new Sample(req.body);
        const savedSample = await newSample.save();
        res.status(201).json(savedSample);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get all records
router.get('/', async (req, res) => {
    try {
        const samples = await Sample.find();
        res.json(samples);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
