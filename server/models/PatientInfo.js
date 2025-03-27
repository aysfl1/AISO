const mongoose = require('mongoose');

const patientInfoSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  age: {
    type: Number,
    required: true
  },
  gender: {
    type: String,
    required: true,
    enum: ['male', 'female', 'other', 'prefer not to say']
  },
  chiefComplaint: {
    type: String,
    required: true
  },
  medicalHistory: {
    type: String,
    required: true
  },
  currentMedications: {
    type: String,
    default: ''
  },
  allergies: {
    type: String,
    default: ''
  },
  familyHistory: {
    type: String,
    default: ''
  },
  previousDiagnosis: {
    type: String,
    required: true
  },
  previousTreatments: {
    type: String,
    default: ''
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('PatientInfo', patientInfoSchema); 