const express = require('express');
const router = express.Router();
const { 
  uploadDocuments, 
  getDocumentById,
  getDocumentsByUserId,
  getDocumentsByConsultationId,
  downloadDocument
} = require('../controllers/documentController');
const upload = require('../middlewares/upload');

// Upload documents
router.post('/', upload.array('documents', 5), uploadDocuments);

// Get document by ID
router.get('/:id', getDocumentById);

// Get documents by user ID
router.get('/user/:userId', getDocumentsByUserId);

// Get documents by consultation ID
router.get('/consultation/:consultationId', getDocumentsByConsultationId);

// Download document
router.get('/:id/download', downloadDocument);

module.exports = router; 