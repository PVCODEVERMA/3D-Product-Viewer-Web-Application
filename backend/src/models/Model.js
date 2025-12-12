const mongoose = require('mongoose');

const modelSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Model name is required'],
    trim: true,
    maxlength: [100, 'Model name cannot exceed 100 characters']
  },
  filename: {
    type: String,
    required: [true, 'Filename is required']
  },
  filepath: {
    type: String,
    required: [true, 'File path is required']
  },
  url: {
    type: String,
    required: [true, 'File URL is required']
  },
  thumbnail: {
    type: String,
    default: 'https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?w=400&h=300&fit=crop'
  },
  format: {
    type: String,
    enum: ['GLB', 'GLTF'],
    required: [true, 'File format is required']
  },
  size: {
    type: Number,
    required: [true, 'File size is required'],
    min: [1, 'File size must be at least 1 byte']
  },
  uploader: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  uploaderIP: {
    type: String,
    default: '127.0.0.1'
  },
  metadata: {
    type: Map,
    of: mongoose.Schema.Types.Mixed,
    default: {}
  },
  isPublic: {
    type: Boolean,
    default: true
  },
  views: {
    type: Number,
    default: 0
  },
  downloads: {
    type: Number,
    default: 0
  },
  tags: [{
    type: String,
    trim: true
  }]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for formatted file size
modelSchema.virtual('formattedSize').get(function() {
  const bytes = this.size;
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
});

// Virtual for created at in readable format
modelSchema.virtual('createdAtFormatted').get(function() {
  return this.createdAt.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
});

// Indexes for better query performance
modelSchema.index({ name: 'text' });
modelSchema.index({ format: 1 });
modelSchema.index({ createdAt: -1 });
modelSchema.index({ views: -1 });
modelSchema.index({ tags: 1 });

// Pre-save middleware to extract metadata from filename
modelSchema.pre('save', function(next) {
  if (this.isNew) {
    // Extract tags from filename (simple implementation)
    const words = this.name.toLowerCase().split(/[\s\-_]+/);
    this.tags = [...new Set(words.filter(word => word.length > 2))];
  }
  next();
});

// Static method to get model statistics
modelSchema.statics.getStats = async function() {
  const stats = await this.aggregate([
    {
      $group: {
        _id: null,
        totalModels: { $sum: 1 },
        totalSize: { $sum: '$size' },
        averageSize: { $avg: '$size' },
        totalViews: { $sum: '$views' },
        totalDownloads: { $sum: '$downloads' }
      }
    },
    {
      $project: {
        _id: 0,
        totalModels: 1,
        totalSize: 1,
        averageSize: { $round: ['$averageSize', 2] },
        totalViews: 1,
        totalDownloads: 1
      }
    }
  ]);

  return stats[0] || {
    totalModels: 0,
    totalSize: 0,
    averageSize: 0,
    totalViews: 0,
    totalDownloads: 0
  };
};

const Model = mongoose.model('Model', modelSchema);

module.exports = Model;