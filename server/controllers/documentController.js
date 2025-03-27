const Document = require('../models/Document');
const Consultation = require('../models/Consultation');
const User = require('../models/User');
const path = require('path');
const fs = require('fs');

// Upload documents
const uploadDocuments = async (req, res) => {
  try {
    const { userId, consultationId, documentType } = req.body;
    
    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }
    
    // Check if consultation exists (if consultationId is provided)
    let consultation = null;
    if (consultationId) {
      consultation = await Consultation.findById(consultationId);
      if (!consultation) {
        return res.status(404).json({
          success: false,
          error: 'Consultation not found'
        });
      }
    }
    
    // Check if files are provided
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'No files uploaded'
      });
    }
    
    const uploadedDocuments = [];
    
    // Process each uploaded file
    for (const file of req.files) {
      // Create document record
      const document = await Document.create({
        userId,
        consultationId: consultationId || null,
        fileName: file.originalname,
        fileType: file.mimetype,
        filePath: file.path,
        fileSize: file.size,
        documentType: documentType || 'other'
      });
      
      // If consultation exists, add document to consultation
      if (consultation) {
        consultation.documents.push(document._id);
        await consultation.save();
      }
      
      uploadedDocuments.push(document);
    }
    
    res.status(201).json({
      success: true,
      count: uploadedDocuments.length,
      data: uploadedDocuments
    });
  } catch (error) {
    console.error('Error uploading documents:', error);
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// Get document by ID
const getDocumentById = async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);
    
    if (!document) {
      return res.status(404).json({
        success: false,
        error: 'Document not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: document
    });
  } catch (error) {
    console.error('Error getting document:', error);
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// Get documents by user ID
const getDocumentsByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const documents = await Document.find({ userId })
      .sort({ uploadDate: -1 });
    
    res.status(200).json({
      success: true,
      count: documents.length,
      data: documents
    });
  } catch (error) {
    console.error('Error getting documents by user ID:', error);
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// Get documents by consultation ID
const getDocumentsByConsultationId = async (req, res) => {
  try {
    const { consultationId } = req.params;
    
    const documents = await Document.find({ consultationId })
      .sort({ uploadDate: -1 });
    
    res.status(200).json({
      success: true,
      count: documents.length,
      data: documents
    });
  } catch (error) {
    console.error('Error getting documents by consultation ID:', error);
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// Download document
const downloadDocument = async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);
    
    if (!document) {
      return res.status(404).json({
        success: false,
        error: 'Document not found'
      });
    }
    
    const filePath = document.filePath;
    
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        error: 'File not found on server'
      });
    }
    
    res.download(filePath, document.fileName);
  } catch (error) {
    console.error('Error downloading document:', error);
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

module.exports = {
  uploadDocuments,
  getDocumentById,
  getDocumentsByUserId,
  getDocumentsByConsultationId,
  downloadDocument
}; 