const User = require('../models/User');
const { v4: uuidv4 } = require('uuid');

// Create a new user with a unique patient ID
const createUser = async (req, res) => {
  try {
    // Generate a unique patient ID
    const patientId = uuidv4();
    
    // Create new user
    const user = await User.create({
      patientId
    });
    
    res.status(201).json({
      success: true,
      data: {
        userId: user._id,
        patientId: user.patientId
      }
    });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// Get user by ID
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .populate('consultations');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Error getting user:', error);
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// Get user by patient ID
const getUserByPatientId = async (req, res) => {
  try {
    const { patientId } = req.params;
    
    const user = await User.findOne({ patientId })
      .populate('consultations');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }
    
    // Update last active timestamp
    user.lastActive = Date.now();
    await user.save();
    
    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Error getting user by patient ID:', error);
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

module.exports = {
  createUser,
  getUserById,
  getUserByPatientId
}; 