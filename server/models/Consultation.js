const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  role: {
    type: String,
    enum: ['system', 'user', 'assistant'],
    required: true
  },
  content: {
    type: String,
    required: true
  },
  citations: [{
    text: String,
    source: String,
    url: String
  }],
  timestamp: {
    type: Date,
    default: Date.now
  },
  stepNumber: {
    type: Number
  }
});

const consultationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  patientInfoId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PatientInfo'
  },
  status: {
    type: String,
    enum: ['in_progress', 'completed', 'abandoned'],
    default: 'in_progress'
  },
  currentStep: {
    type: Number,
    default: 1
  },
  messages: [messageSchema],
  documents: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Document'
  }],
  summary: {
    diagnosis: {
      type: String,
      default: ''
    },
    recommendedTreatments: {
      type: String,
      default: ''
    },
    differentialDiagnoses: {
      type: String,
      default: ''
    },
    additionalTests: {
      type: String,
      default: ''
    }
  },
  startedAt: {
    type: Date,
    default: Date.now
  },
  completedAt: {
    type: Date
  }
});

module.exports = mongoose.model('Consultation', consultationSchema); 