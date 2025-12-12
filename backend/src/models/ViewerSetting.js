const mongoose = require('mongoose');

const viewerSettingsSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  sessionId: {
    type: String,
    default: null
  },
  model: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Model',
    default: null
  },
  backgroundColor: {
    type: String,
    default: '#f8fafc',
    validate: {
      validator: function(v) {
        return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(v);
      },
      message: 'Invalid hex color code'
    }
  },
  wireframeMode: {
    type: Boolean,
    default: false
  },
  materialColor: {
    type: String,
    default: '#3b82f6',
    validate: {
      validator: function(v) {
        return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(v);
      },
      message: 'Invalid hex color code'
    }
  },
  showGrid: {
    type: Boolean,
    default: true
  },
  environment: {
    type: String,
    enum: ['city', 'sunset', 'night', 'warehouse', 'studio', 'park', null],
    default: null
  },
  cameraPosition: {
    x: { type: Number, default: 5 },
    y: { type: Number, default: 5 },
    z: { type: Number, default: 5 }
  },
  cameraFOV: {
    type: Number,
    default: 50,
    min: 10,
    max: 120
  },
  lights: {
    ambientIntensity: { type: Number, default: 0.5, min: 0, max: 1 },
    directionalIntensity: { type: Number, default: 1, min: 0, max: 2 },
    directionalPosition: {
      x: { type: Number, default: 10 },
      y: { type: Number, default: 10 },
      z: { type: Number, default: 5 }
    }
  },
  showAxes: {
    type: Boolean,
    default: false
  },
  showStats: {
    type: Boolean,
    default: false
  },
  autoRotate: {
    type: Boolean,
    default: false
  },
  autoRotateSpeed: {
    type: Number,
    default: 2,
    min: 0.1,
    max: 10
  },
  annotations: [{
    position: {
      x: Number,
      y: Number,
      z: Number
    },
    title: String,
    description: String,
    color: {
      type: String,
      default: '#ff4757'
    },
    visible: {
      type: Boolean,
      default: true
    }
  }],
  customSettings: {
    type: Map,
    of: mongoose.Schema.Types.Mixed,
    default: {}
  },
  isDefault: {
    type: Boolean,
    default: false
  },
  isTemplate: {
    type: Boolean,
    default: false
  },
  templateName: {
    type: String,
    default: null
  },
  shareableLink: {
    type: String,
    default: null
  },
  lastAccessed: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for formatted last accessed
viewerSettingsSchema.virtual('lastAccessedFormatted').get(function() {
  const now = new Date();
  const diffMs = now - this.lastAccessed;
  const diffMins = Math.floor(diffMs / 60000);
  
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
  
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  
  return this.lastAccessed.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
});

// Indexes
viewerSettingsSchema.index({ user: 1 });
viewerSettingsSchema.index({ sessionId: 1 });
viewerSettingsSchema.index({ model: 1 });
viewerSettingsSchema.index({ isDefault: 1 });
viewerSettingsSchema.index({ lastAccessed: -1 });
viewerSettingsSchema.index({ createdAt: -1 });

// Pre-save middleware
viewerSettingsSchema.pre('save', function(next) {
  this.lastAccessed = new Date();
  
  // Generate shareable link if not exists
  if (!this.shareableLink && this.isTemplate) {
    const randomId = Math.random().toString(36).substring(7);
    this.shareableLink = `/view/${randomId}`;
  }
  
  next();
});

// Static method to get default settings
viewerSettingsSchema.statics.getDefaultSettings = async function() {
  const defaultSettings = await this.findOne({ isDefault: true });
  
  if (defaultSettings) {
    return defaultSettings;
  }
  
  // Create default settings if none exist
  return await this.create({
    backgroundColor: '#f8fafc',
    materialColor: '#3b82f6',
    showGrid: true,
    wireframeMode: false,
    cameraPosition: { x: 5, y: 5, z: 5 },
    cameraFOV: 50,
    lights: {
      ambientIntensity: 0.5,
      directionalIntensity: 1,
      directionalPosition: { x: 10, y: 10, z: 5 }
    },
    isDefault: true,
    templateName: 'Default'
  });
};

// Static method to create from template
viewerSettingsSchema.statics.createFromTemplate = async function(templateName, modelId = null, userId = null) {
  const template = await this.findOne({ 
    isTemplate: true, 
    templateName: new RegExp(`^${templateName}$`, 'i') 
  });
  
  if (!template) {
    throw new Error(`Template '${templateName}' not found`);
  }
  
  // Create new settings from template
  const settings = template.toObject();
  delete settings._id;
  delete settings.__v;
  delete settings.createdAt;
  delete settings.updatedAt;
  delete settings.shareableLink;
  
  settings.user = userId;
  settings.model = modelId;
  settings.isTemplate = false;
  settings.isDefault = false;
  settings.templateName = null;
  
  return await this.create(settings);
};

const ViewerSettings = mongoose.model('ViewerSettings', viewerSettingsSchema);

module.exports = ViewerSettings;