import multer from 'multer';

// Use memory storage to avoid saving files on disk
const storage = multer.memoryStorage();

// File upload configuration with custom filters
export const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // Limit to 10MB
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain',
      'image/png',
      'image/jpeg',
      'image/jpg',
      'image/webp'
    ];
    if (allowedTypes.includes(file.mimetype) || file.originalname.match(/\.(pdf|docx|txt|png|jpeg|jpg|webp)$/i)) {
      cb(null, true);
    } else {
      cb(new Error('Unsupported file type. Please upload a valid PDF, DOCX, TXT, or Image file.'));
    }
  }
});
