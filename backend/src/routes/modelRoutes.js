const express = require('express');
const router = express.Router();
const {
  uploadModel,
  getModels,
  getModel,
  downloadModel,
  updateModel,
  deleteModel,
  getModelStats
} = require('../controllers/modelController');
const {
  uploadSingle,
  validateFileExtension
} = require('../middleware/uploadMiddleware');
const {
  validateModelUpload,
  validateModelUpdate,
  validateQueryParams
} = require('../middleware/validation');

// @route   POST /api/models/upload
// @desc    Upload a 3D model
// @access  Public
router.post(
  '/upload',
  uploadSingle(),
  validateFileExtension,
  validateModelUpload,
  uploadModel
);

// @route   GET /api/models
// @desc    Get all models
// @access  Public
router.get(
  '/',
  validateQueryParams,
  getModels
);

// @route   GET /api/models/stats
// @desc    Get model statistics
// @access  Public
router.get('/stats', getModelStats);

// @route   GET /api/models/:id
// @desc    Get single model
// @access  Public
router.get('/:id', getModel);

// @route   GET /api/models/:id/download
// @desc    Download model file
// @access  Public
router.get('/:id/download', downloadModel);

// @route   PUT /api/models/:id
// @desc    Update model
// @access  Public
router.put(
  '/:id',
  validateModelUpdate,
  updateModel
);

// @route   DELETE /api/models/:id
// @desc    Delete model
// @access  Public
router.delete('/:id', deleteModel);

module.exports = router;