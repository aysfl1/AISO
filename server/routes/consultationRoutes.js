const express = require('express');
const router = express.Router();
const { 
  createConsultation, 
  getConsultationById,
  getConsultationsByUserId,
  sendMessage
} = require('../controllers/consultationController');

// Create a new consultation
router.post('/', createConsultation);

// Get consultation by ID
router.get('/:id', getConsultationById);

// Get consultations by user ID
router.get('/user/:userId', getConsultationsByUserId);

// Send message in consultation
router.post('/:id/messages', sendMessage);

module.exports = router; 