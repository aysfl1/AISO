const Consultation = require('../models/Consultation');
const User = require('../models/User');
const PatientInfo = require('../models/PatientInfo');
const { generateDoctorResponse } = require('../utils/openaiService');
const { researchMedicalInfo } = require('../utils/perplexityService');

// Create a new consultation
const createConsultation = async (req, res) => {
  try {
    const { userId, patientInfoId } = req.body;

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    // Check if patient info exists
    const patientInfo = await PatientInfo.findById(patientInfoId);
    if (!patientInfo) {
      return res.status(404).json({
        success: false,
        error: 'Patient information not found'
      });
    }

    // Create initial message from AI
    const initialMessage = {
      role: 'assistant',
      content: `Hello, I'm Dr. AISO. I'll be providing you with a second medical opinion based on the information you've shared. I'll be following a structured 26-step consultation process to ensure thoroughness. Let's begin by discussing why you're seeking a second opinion and what you hope to gain from our consultation today.`,
      stepNumber: 1
    };

    // Create new consultation
    const consultation = await Consultation.create({
      userId,
      patientInfoId,
      messages: [initialMessage],
      currentStep: 1
    });

    // Add consultation to user's consultations
    user.consultations.push(consultation._id);
    await user.save();

    res.status(201).json({
      success: true,
      data: consultation
    });
  } catch (error) {
    console.error('Error creating consultation:', error);
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// Get consultation by ID
const getConsultationById = async (req, res) => {
  try {
    const consultation = await Consultation.findById(req.params.id)
      .populate('patientInfoId')
      .populate('documents');
    
    if (!consultation) {
      return res.status(404).json({
        success: false,
        error: 'Consultation not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: consultation
    });
  } catch (error) {
    console.error('Error getting consultation:', error);
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// Get consultations by user ID
const getConsultationsByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const consultations = await Consultation.find({ userId })
      .sort({ startedAt: -1 });
    
    res.status(200).json({
      success: true,
      count: consultations.length,
      data: consultations
    });
  } catch (error) {
    console.error('Error getting consultations by user ID:', error);
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// Send message in consultation
const sendMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;

    // Find consultation
    const consultation = await Consultation.findById(id);
    if (!consultation) {
      return res.status(404).json({
        success: false,
        error: 'Consultation not found'
      });
    }

    // Add user message
    const userMessage = {
      role: 'user',
      content,
      stepNumber: consultation.currentStep
    };
    consultation.messages.push(userMessage);

    // Determine if research is needed
    let researchResult = null;
    if (consultation.currentStep >= 11 && consultation.currentStep <= 14) {
      try {
        // Extract key medical terms from the message for research
        const query = `Based on the following patient message, research the most likely conditions, diagnostic criteria, and latest treatment approaches: "${content}"`;
        researchResult = await researchMedicalInfo(query);
      } catch (error) {
        console.error('Research error:', error);
        // Continue even if research fails
      }
    }

    // Get AI response
    const aiResponseData = await generateDoctorResponse(
      consultation.messages,
      consultation.currentStep
    );

    // Add AI message
    const aiMessage = {
      role: 'assistant',
      content: aiResponseData.content,
      stepNumber: consultation.currentStep
    };

    // Add citations from research if available
    if (researchResult && researchResult.citations.length > 0) {
      aiMessage.citations = researchResult.citations;
    }

    consultation.messages.push(aiMessage);

    // Determine if step should be incremented
    // This is a simplified logic; in a real app, this would be more sophisticated
    if (
      (consultation.currentStep === 3 && content.toLowerCase().includes('ready')) ||
      (consultation.currentStep === 7 && content.toLowerCase().includes('complete')) ||
      (consultation.currentStep === 10 && content.toLowerCase().includes('understand')) ||
      (consultation.currentStep === 14 && content.toLowerCase().includes('next')) ||
      (consultation.currentStep === 17 && content.toLowerCase().includes('clear')) ||
      (consultation.currentStep === 21 && content.toLowerCase().includes('agree'))
    ) {
      consultation.currentStep += 1;
    }

    // Check if consultation is complete
    if (consultation.currentStep >= 26) {
      consultation.status = 'completed';
      consultation.completedAt = Date.now();
    }

    await consultation.save();

    res.status(200).json({
      success: true,
      data: {
        message: aiMessage,
        currentStep: consultation.currentStep,
        status: consultation.status
      }
    });
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

module.exports = {
  createConsultation,
  getConsultationById,
  getConsultationsByUserId,
  sendMessage
}; 