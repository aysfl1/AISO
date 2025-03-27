const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  consultationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Consultation'
  },
  fileName: {
    type: String,
    required: true
  },
  fileType: {
    type: String,
    required: true
  },
  filePath: {
    type: String,
    required: true
  },
  fileSize: {
    type: Number,
    required: true
  },
  uploadDate: {
    type: Date,
    default: Date.now
  },
  textContent: {
    type: String,
    default: ''
  },
  documentType: {
    type: String,
    enum: ['imaging', 'lab_result', 'doctor_note', 'prescription', 'other'],
    default: 'other'
  },
  metaData: {
    type: Object,
    default: {}
  }
});

module.exports = mongoose.model('Document', documentSchema); 