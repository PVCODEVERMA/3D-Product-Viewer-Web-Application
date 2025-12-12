const ViewerSettings = require('../models/ViewerSetting');
const Model = require('../models/Model');

// Helper function to generate session ID
const generateSessionId = (req) => {
  return req.headers['x-session-id'] || 
         req.cookies?.sessionId || 
         `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// @desc    Save viewer settings
// @route   POST /api/settings
// @access  Public
const saveSettings = async (req, res) => {
  try {
    const {
      modelId,
      backgroundColor,
      wireframeMode,
      materialColor,
      showGrid,
      environment,
      cameraPosition,
      cameraFOV,
      lights,
      showAxes,
      showStats,
      autoRotate,
      autoRotateSpeed,
      annotations,
      customSettings,
      isTemplate,
      templateName
    } = req.body;

    // Generate session ID if not provided
    const sessionId = generateSessionId(req);

    // Validate model ID if provided
    let model = null;
    if (modelId) {
      model = await Model.findById(modelId);
      if (!model) {
        return res.status(404).json({
          success: false,
          message: 'Model not found'
        });
      }
    }

    // Create settings object
    const settingsData = {
      sessionId,
      model: modelId,
      backgroundColor,
      wireframeMode,
      materialColor,
      showGrid,
      environment,
      cameraPosition,
      cameraFOV,
      lights,
      showAxes,
      showStats,
      autoRotate,
      autoRotateSpeed,
      annotations,
      customSettings,
      isTemplate: isTemplate || false,
      templateName: templateName || null
    };

    // Remove undefined values
    Object.keys(settingsData).forEach(key => {
      if (settingsData[key] === undefined) {
        delete settingsData[key];
      }
    });

    // Save settings
    const settings = await ViewerSettings.create(settingsData);

    res.status(201).json({
      success: true,
      message: 'Settings saved successfully',
      data: {
        id: settings._id,
        sessionId: settings.sessionId,
        modelId: settings.model,
        backgroundColor: settings.backgroundColor,
        wireframeMode: settings.wireframeMode,
        materialColor: settings.materialColor,
        showGrid: settings.showGrid,
        environment: settings.environment,
        lastAccessed: settings.lastAccessedFormatted,
        shareableLink: settings.shareableLink
      }
    });

  } catch (error) {
    console.error('Save settings error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to save settings',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Get latest viewer settings
// @route   GET /api/settings/latest
// @access  Public
const getLatestSettings = async (req, res) => {
  try {
    const sessionId = generateSessionId(req);

    // Get latest settings for this session
    const settings = await ViewerSettings.findOne({ sessionId })
      .sort('-createdAt')
      .populate('model', 'name url thumbnail format')
      .select('-__v -updatedAt');

    if (!settings) {
      // Return default settings if no settings found
      const defaultSettings = await ViewerSettings.getDefaultSettings();
      return res.status(200).json({
        success: true,
        message: 'Using default settings',
        isDefault: true,
        data: defaultSettings
      });
    }

    res.status(200).json({
      success: true,
      isDefault: false,
      data: settings
    });

  } catch (error) {
    console.error('Get settings error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch settings'
    });
  }
};

// @desc    Get settings by ID
// @route   GET /api/settings/:id
// @access  Public
const getSettingsById = async (req, res) => {
  try {
    const { id } = req.params;

    const settings = await ViewerSettings.findById(id)
      .populate('model', 'name url thumbnail format')
      .select('-__v');

    if (!settings) {
      return res.status(404).json({
        success: false,
        message: 'Settings not found'
      });
    }

    // Update last accessed time
    settings.lastAccessed = new Date();
    await settings.save();

    res.status(200).json({
      success: true,
      data: settings
    });

  } catch (error) {
    console.error('Get settings by ID error:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid settings ID'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Failed to fetch settings'
    });
  }
};

// @desc    Update settings
// @route   PUT /api/settings/:id
// @access  Public
const updateSettings = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Find settings
    const settings = await ViewerSettings.findById(id);
    if (!settings) {
      return res.status(404).json({
        success: false,
        message: 'Settings not found'
      });
    }

    // Update settings
    Object.keys(updateData).forEach(key => {
      if (updateData[key] !== undefined) {
        settings[key] = updateData[key];
      }
    });

    await settings.save();

    res.status(200).json({
      success: true,
      message: 'Settings updated successfully',
      data: settings
    });

  } catch (error) {
    console.error('Update settings error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update settings'
    });
  }
};

// @desc    Delete settings
// @route   DELETE /api/settings/:id
// @access  Public
const deleteSettings = async (req, res) => {
  try {
    const { id } = req.params;

    const settings = await ViewerSettings.findByIdAndDelete(id);
    if (!settings) {
      return res.status(404).json({
        success: false,
        message: 'Settings not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Settings deleted successfully',
      data: {
        id: settings._id,
        sessionId: settings.sessionId
      }
    });

  } catch (error) {
    console.error('Delete settings error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete settings'
    });
  }
};

// @desc    Get all settings for session
// @route   GET /api/settings/session/all
// @access  Public
const getSessionSettings = async (req, res) => {
  try {
    const sessionId = generateSessionId(req);

    const settings = await ViewerSettings.find({ sessionId })
      .sort('-createdAt')
      .populate('model', 'name url thumbnail')
      .select('-__v');

    res.status(200).json({
      success: true,
      count: settings.length,
      data: settings
    });

  } catch (error) {
    console.error('Get session settings error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch session settings'
    });
  }
};

// @desc    Export settings as JSON
// @route   GET /api/settings/export
// @access  Public
const exportSettings = async (req, res) => {
  try {
    const sessionId = generateSessionId(req);

    const settings = await ViewerSettings.findOne({ sessionId })
      .sort('-createdAt')
      .populate('model', 'name url thumbnail format')
      .select('-__v -_id -sessionId');

    if (!settings) {
      return res.status(404).json({
        success: false,
        message: 'No settings found to export'
      });
    }

    const exportData = settings.toObject();
    exportData.exportDate = new Date().toISOString();
    exportData.version = '1.0.0';

    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', 'attachment; filename="3d-viewer-settings.json"');
    
    res.status(200).send(JSON.stringify(exportData, null, 2));

  } catch (error) {
    console.error('Export settings error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to export settings'
    });
  }
};

// @desc    Import settings from JSON
// @route   POST /api/settings/import
// @access  Public
const importSettings = async (req, res) => {
  try {
    const { settings } = req.body;
    const sessionId = generateSessionId(req);

    if (!settings) {
      return res.status(400).json({
        success: false,
        message: 'No settings data provided'
      });
    }

    // Create new settings from import data
    const importedSettings = {
      ...settings,
      sessionId,
      isTemplate: false,
      templateName: null,
      shareableLink: null
    };

    // Remove export metadata
    delete importedSettings.exportDate;
    delete importedSettings.version;
    delete importedSettings._id;

    const savedSettings = await ViewerSettings.create(importedSettings);

    res.status(201).json({
      success: true,
      message: 'Settings imported successfully',
      data: {
        id: savedSettings._id,
        sessionId: savedSettings.sessionId,
        backgroundColor: savedSettings.backgroundColor,
        materialColor: savedSettings.materialColor
      }
    });

  } catch (error) {
    console.error('Import settings error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to import settings'
    });
  }
};

// @desc    Get available templates
// @route   GET /api/settings/templates
// @access  Public
const getTemplates = async (req, res) => {
  try {
    const templates = await ViewerSettings.find({ isTemplate: true })
      .select('templateName backgroundColor materialColor environment createdAt')
      .sort('-createdAt');

    // Add default template
    const defaultTemplate = {
      templateName: 'Default',
      backgroundColor: '#f8fafc',
      materialColor: '#3b82f6',
      environment: null,
      isDefault: true
    };

    res.status(200).json({
      success: true,
      data: [defaultTemplate, ...templates.map(t => t.toObject())]
    });

  } catch (error) {
    console.error('Get templates error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch templates'
    });
  }
};

// @desc    Create settings from template
// @route   POST /api/settings/templates/:templateName
// @access  Public
const createFromTemplate = async (req, res) => {
  try {
    const { templateName } = req.params;
    const { modelId } = req.body;
    const sessionId = generateSessionId(req);

    const settings = await ViewerSettings.createFromTemplate(templateName, modelId, null);
    settings.sessionId = sessionId;
    await settings.save();

    res.status(201).json({
      success: true,
      message: `Settings created from template '${templateName}'`,
      data: settings
    });

  } catch (error) {
    console.error('Create from template error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to create settings from template'
    });
  }
};

module.exports = {
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
};