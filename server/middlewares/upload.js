const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Create user-specific directory
    const userId = req.body.userId;
    const userDir = path.join(uploadsDir, userId);
    
    if (!fs.existsSync(userDir)) {
      fs.mkdirSync(userDir, { recursive: true });
    }
    
    cb(null, userDir);
  },
  filename: function (req, file, cb) {
    // Generate unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

// File filter
const fileFilter = (req, file, cb) => {
  // Allow only specific file types
  const allowedFileTypes = [
    // Images
    '.jpg', '.jpeg', '.png', '.gif', '.tiff', '.bmp',
    // Documents
    '.pdf', '.doc', '.docx', '.txt', '.rtf',
    // Medical formats
    '.dcm', '.dicom'
  ];
  
  const ext = path.extname(file.originalname).toLowerCase();
  
  if (allowedFileTypes.includes(ext)) {
    // Accept file
    cb(null, true);
  } else {
    // Reject file
    cb(new Error('Invalid file type. Only images, documents, and medical formats are allowed.'), false);
  }
};

// Set up multer upload
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB max file size
  }
});

module.exports = upload; 