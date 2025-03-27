const express = require('express');
const router = express.Router();
const { 
  createUser, 
  getUserById,
  getUserByPatientId
} = require('../controllers/userController');

// Create a new user
router.post('/', createUser);

// Get user by ID
router.get('/:id', getUserById);

// Get user by patient ID
router.get('/patient/:patientId', getUserByPatientId);

module.exports = router; 