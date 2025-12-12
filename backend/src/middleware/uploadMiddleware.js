const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = uuidv4();
    const extension = path.extname(file.originalname);
    const filename = `${path.basename(file.originalname, extension)}_${uniqueSuffix}${extension}`;
    cb(null, filename);
  }
});

// File filter for 3D models
const fileFilter = (req, file, cb) => {
  const allowedTypes = process.env.ALLOWED_FILE_TYPES.split(',');
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only GLB and GLTF files are allowed.'), false);
  }
};

// Configure multer upload
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 50 * 1024 * 1024, // 50MB default
    files: 1
  }
});

// Middleware to handle single file upload
const uploadSingle = (fieldName = 'model') => {
  return (req, res, next) => {
    const uploadMiddleware = upload.single(fieldName);
    
    uploadMiddleware(req, res, (err) => {
      if (err) {
        if (err instanceof multer.MulterError) {
          if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({
              success: false,
              message: 'File too large. Maximum size is 50MB.'
            });
          }
          if (err.code === 'LIMIT_FILE_COUNT') {
            return res.status(400).json({
              success: false,
              message: 'Too many files. Only one file is allowed.'
            });
          }
        }
        
        return res.status(400).json({
          success: false,
          message: err.message || 'File upload failed'
        });
      }
      
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'No file uploaded'
        });
      }
      
      next();
    });
  };
};

// Middleware to validate file extension
const validateFileExtension = (req, res, next) => {
  if (req.file) {
    const extension = path.extname(req.file.originalname).toLowerCase();
    const allowedExtensions = ['.glb', '.gltf'];
    
    if (!allowedExtensions.includes(extension)) {
      // Delete uploaded file
      fs.unlinkSync(req.file.path);
      
      return res.status(400).json({
        success: false,
        message: 'Invalid file extension. Only .glb and .gltf files are allowed.'
      });
    }
  }
  
  next();
};

// Generate thumbnail for 3D model (placeholder function)
const generateThumbnail = async (modelPath) => {
  
  const thumbnails = [
    'https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead',
    'https://images.unsplash.com/photo-1563089145-599997674d42',
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64',
    'https://images.unsplash.com/photo-1633332755192-727a05c4013d'
  ];
  
  const randomIndex = Math.floor(Math.random() * thumbnails.length);
  return `${thumbnails[randomIndex]}?w=400&h=300&fit=crop`;
};

module.exports = {
  uploadSingle,
  validateFileExtension,
  generateThumbnail
};