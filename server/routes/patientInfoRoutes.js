const express = require('express');
const router = express.Router();
const { 
  createPatientInfo, 
  getPatientInfoById,
  getPatientInfoByUserId
} = require('../controllers/patientInfoController');

// Create patient information
router.post('/', createPatientInfo);

// Get patient info by ID
router.get('/:id', getPatientInfoById);

// Get patient info by user ID
router.get('/user/:userId', getPatientInfoByUserId);

module.exports = router; 