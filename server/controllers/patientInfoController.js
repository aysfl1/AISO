const PatientInfo = require('../models/PatientInfo');
const User = require('../models/User');

// Create patient information
const createPatientInfo = async (req, res) => {
  try {
    const {
      userId,
      age,
      gender,
      chiefComplaint,
      medicalHistory,
      currentMedications,
      allergies,
      familyHistory,
      previousDiagnosis,
      previousTreatments
    } = req.body;

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    // Create patient info
    const patientInfo = await PatientInfo.create({
      userId,
      age,
      gender,
      chiefComplaint,
      medicalHistory,
      currentMedications,
      allergies,
      familyHistory,
      previousDiagnosis,
      previousTreatments
    });

    res.status(201).json({
      success: true,
      data: patientInfo
    });
  } catch (error) {
    console.error('Error creating patient info:', error);
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// Get patient info by ID
const getPatientInfoById = async (req, res) => {
  try {
    const patientInfo = await PatientInfo.findById(req.params.id);
    
    if (!patientInfo) {
      return res.status(404).json({
        success: false,
        error: 'Patient information not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: patientInfo
    });
  } catch (error) {
    console.error('Error getting patient info:', error);
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// Get patient info by user ID
const getPatientInfoByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const patientInfo = await PatientInfo.findOne({ userId });
    
    if (!patientInfo) {
      return res.status(404).json({
        success: false,
        error: 'Patient information not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: patientInfo
    });
  } catch (error) {
    console.error('Error getting patient info by user ID:', error);
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

module.exports = {
  createPatientInfo,
  getPatientInfoById,
  getPatientInfoByUserId
}; 