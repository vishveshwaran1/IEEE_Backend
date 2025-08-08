const mongoose = require('mongoose');

const SampleSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Sample', SampleSchema);
