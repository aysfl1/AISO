const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  patientId: {
    type: String,
    required: true,
    unique: true
  },
  consultations: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Consultation'
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastActive: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('User', userSchema); 