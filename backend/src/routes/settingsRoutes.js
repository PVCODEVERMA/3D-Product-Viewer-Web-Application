const express = require('express');
const router = express.Router();
const {
  saveSettings,
  getLatestSettings,
  getSettingsById,
  updateSettings,
  deleteSettings,
  getSessionSettings,
  exportSettings,
  importSettings,
  getTemplates,
  createFromTemplate
} = require('../controllers/settingsController');
const {
  validateSettings
} = require('../middleware/validation');

// @route   POST /api/settings
// @desc    Save viewer settings
// @access  Public
router.post('/', validateSettings, saveSettings);

// @route   GET /api/settings/latest
// @desc    Get latest viewer settings
// @access  Public
router.get('/latest', getLatestSettings);

// @route   GET /api/settings/session/all
// @desc    Get all settings for current session
// @access  Public
router.get('/session/all', getSessionSettings);

// @route   GET /api/settings/templates
// @desc    Get available templates
// @access  Public
router.get('/templates', getTemplates);

// @route   POST /api/settings/templates/:templateName
// @desc    Create settings from template
// @access  Public
router.post('/templates/:templateName', createFromTemplate);

// @route   GET /api/settings/export
// @desc    Export settings as JSON
// @access  Public
router.get('/export', exportSettings);

// @route   POST /api/settings/import
// @desc    Import settings from JSON
// @access  Public
router.post('/import', importSettings);

// @route   GET /api/settings/:id
// @desc    Get settings by ID
// @access  Public
router.get('/:id', getSettingsById);

// @route   PUT /api/settings/:id
// @desc    Update settings
// @access  Public
router.put('/:id', validateSettings, updateSettings);

// @route   DELETE /api/settings/:id
// @desc    Delete settings
// @access  Public
router.delete('/:id', deleteSettings);

module.exports = router;