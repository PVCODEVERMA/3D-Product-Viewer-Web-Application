const Model = require('../models/Model');
const path = require('path');
const fs = require('fs');
const { generateThumbnail } = require('../middleware/uploadMiddleware');

// Helper function to get client IP
const getClientIP = (req) => {
  return req.ip || 
         req.connection.remoteAddress || 
         req.socket.remoteAddress ||
         req.connection.socket?.remoteAddress ||
         '127.0.0.1';
};

// @desc    Upload a 3D model
// @route   POST /api/models/upload
// @access  Public
const uploadModel = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    const { name, tags, isPublic } = req.body;
    const file = req.file;

    // Determine format from file extension
    const extension = path.extname(file.originalname).toLowerCase();
    const format = extension === '.glb' ? 'GLB' : 'GLTF';

    // Generate thumbnail URL (placeholder)
    const thumbnail = await generateThumbnail(file.path);

    // Get client IP
    const clientIP = getClientIP(req);

    // Create model in database
    const model = await Model.create({
      name: name || path.basename(file.originalname, extension),
      filename: file.filename,
      filepath: file.path,
      url: `/uploads/${file.filename}`,
      thumbnail: thumbnail,
      format: format,
      size: file.size,
      uploaderIP: clientIP,
      tags: tags ? JSON.parse(tags) : [],
      isPublic: isPublic !== undefined ? JSON.parse(isPublic) : true,
      metadata: {
        originalName: file.originalname,
        mimetype: file.mimetype,
        encoding: file.encoding
      }
    });

    // Increment upload count for statistics
    await Model.updateOne(
      { _id: model._id },
      { $inc: { uploads: 1 } }
    );

    res.status(201).json({
      success: true,
      message: 'Model uploaded successfully',
      data: {
        id: model._id,
        name: model.name,
        url: model.url,
        thumbnail: model.thumbnail,
        format: model.format,
        size: model.formattedSize,
        createdAt: model.createdAt
      }
    });

  } catch (error) {
    console.error('Upload error:', error);
    
    // Clean up uploaded file if error occurred
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    
    res.status(500).json({
      success: false,
      message: 'Failed to upload model',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Get all models
// @route   GET /api/models
// @access  Public
const getModels = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      sort = '-createdAt',
      format,
      search,
      tag
    } = req.query;

    // Build query
    let query = { isPublic: true };

    // Filter by format
    if (format) {
      query.format = format.toUpperCase();
    }

    // Search by name or tags
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { tags: { $regex: search, $options: 'i' } }
      ];
    }

    // Filter by tag
    if (tag) {
      query.tags = { $in: [tag] };
    }

    // Pagination
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // Execute query
    const models = await Model.find(query)
      .sort(sort)
      .skip(skip)
      .limit(limitNum)
      .select('-filepath -metadata -uploaderIP -__v');

    // Get total count
    const total = await Model.countDocuments(query);

    // Get statistics
    const stats = await Model.getStats();

    res.status(200).json({
      success: true,
      count: models.length,
      total,
      totalPages: Math.ceil(total / limitNum),
      currentPage: pageNum,
      stats,
      data: models.map(model => ({
        id: model._id,
        name: model.name,
        url: model.url,
        thumbnail: model.thumbnail,
        format: model.format,
        size: model.formattedSize,
        tags: model.tags,
        views: model.views,
        downloads: model.downloads,
        createdAt: model.createdAtFormatted,
        isPublic: model.isPublic
      }))
    });

  } catch (error) {
    console.error('Get models error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch models'
    });
  }
};

// @desc    Get single model
// @route   GET /api/models/:id
// @access  Public
const getModel = async (req, res) => {
  try {
    const { id } = req.params;

    // Find model and increment view count
    const model = await Model.findByIdAndUpdate(
      id,
      { $inc: { views: 1 } },
      { new: true }
    ).select('-filepath -uploaderIP -__v');

    if (!model) {
      return res.status(404).json({
        success: false,
        message: 'Model not found'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        id: model._id,
        name: model.name,
        url: model.url,
        thumbnail: model.thumbnail,
        format: model.format,
        size: model.formattedSize,
        tags: model.tags,
        views: model.views,
        downloads: model.downloads,
        createdAt: model.createdAtFormatted,
        metadata: model.metadata,
        isPublic: model.isPublic
      }
    });

  } catch (error) {
    console.error('Get model error:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid model ID'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Failed to fetch model'
    });
  }
};

// @desc    Download model
// @route   GET /api/models/:id/download
// @access  Public
const downloadModel = async (req, res) => {
  try {
    const { id } = req.params;

    const model = await Model.findByIdAndUpdate(
      id,
      { $inc: { downloads: 1 } },
      { new: true }
    );

    if (!model) {
      return res.status(404).json({
        success: false,
        message: 'Model not found'
      });
    }

    if (!fs.existsSync(model.filepath)) {
      return res.status(404).json({
        success: false,
        message: 'Model file not found'
      });
    }

    res.download(model.filepath, `${model.name}${model.format.toLowerCase()}`, (err) => {
      if (err) {
        console.error('Download error:', err);
      }
    });

  } catch (error) {
    console.error('Download model error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to download model'
    });
  }
};

// @desc    Update model
// @route   PUT /api/models/:id
// @access  Public (in real app, should be protected)
const updateModel = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, tags, isPublic } = req.body;

    // Find model
    const model = await Model.findById(id);
    if (!model) {
      return res.status(404).json({
        success: false,
        message: 'Model not found'
      });
    }

    // Update model
    const updateData = {};
    if (name) updateData.name = name;
    if (tags) updateData.tags = JSON.parse(tags);
    if (isPublic !== undefined) updateData.isPublic = JSON.parse(isPublic);

    const updatedModel = await Model.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).select('-filepath -uploaderIP -__v');

    res.status(200).json({
      success: true,
      message: 'Model updated successfully',
      data: updatedModel
    });

  } catch (error) {
    console.error('Update model error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update model'
    });
  }
};

// @desc    Delete model
// @route   DELETE /api/models/:id
// @access  Public (in real app, should be protected)
const deleteModel = async (req, res) => {
  try {
    const { id } = req.params;

    // Find model
    const model = await Model.findById(id);
    if (!model) {
      return res.status(404).json({
        success: false,
        message: 'Model not found'
      });
    }

    // Delete file from filesystem
    if (fs.existsSync(model.filepath)) {
      fs.unlinkSync(model.filepath);
    }

    // Delete from database
    await Model.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'Model deleted successfully',
      data: {
        id: model._id,
        name: model.name
      }
    });

  } catch (error) {
    console.error('Delete model error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete model'
    });
  }
};

// @desc    Get model statistics
// @route   GET /api/models/stats
// @access  Public
const getModelStats = async (req, res) => {
  try {
    const stats = await Model.getStats();
    
    // Additional statistics
    const formatStats = await Model.aggregate([
      {
        $group: {
          _id: '$format',
          count: { $sum: 1 },
          totalSize: { $sum: '$size' },
          avgViews: { $avg: '$views' }
        }
      }
    ]);

    const recentModels = await Model.find({ isPublic: true })
      .sort('-createdAt')
      .limit(5)
      .select('name format views createdAt');

    const popularModels = await Model.find({ isPublic: true })
      .sort('-views')
      .limit(5)
      .select('name format views downloads');

    res.status(200).json({
      success: true,
      data: {
        overall: stats,
        byFormat: formatStats,
        recentModels,
        popularModels
      }
    });

  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch statistics'
    });
  }
};

module.exports = {
  uploadModel,
  getModels,
  getModel,
  downloadModel,
  updateModel,
  deleteModel,
  getModelStats
};