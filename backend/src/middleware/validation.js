const { body, param, query, validationResult } = require('express-validator');

// Validation middleware
const validate = (validations) => {
  return async (req, res, next) => {
    await Promise.all(validations.map(validation => validation.run(req)));

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    // Format errors
    const formattedErrors = errors.array().map(err => ({
      field: err.path,
      message: err.msg,
      value: err.value
    }));

    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: formattedErrors
    });
  };
};

// Model validation rules
const validateModelUpload = validate([
  body('name')
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Name must be between 1 and 100 characters'),
  
  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array'),
  
  body('isPublic')
    .optional()
    .isBoolean()
    .withMessage('isPublic must be a boolean')
]);

const validateModelUpdate = validate([
  param('id')
    .isMongoId()
    .withMessage('Invalid model ID'),
  
  body('name')
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Name must be between 1 and 100 characters'),
  
  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array'),
  
  body('isPublic')
    .optional()
    .isBoolean()
    .withMessage('isPublic must be a boolean')
]);

// Settings validation rules
const validateSettings = validate([
  body('backgroundColor')
    .optional()
    .matches(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/)
    .withMessage('Invalid hex color code for background'),
  
  body('materialColor')
    .optional()
    .matches(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/)
    .withMessage('Invalid hex color code for material'),
  
  body('wireframeMode')
    .optional()
    .isBoolean()
    .withMessage('wireframeMode must be a boolean'),
  
  body('showGrid')
    .optional()
    .isBoolean()
    .withMessage('showGrid must be a boolean'),
  
  body('cameraFOV')
    .optional()
    .isFloat({ min: 10, max: 120 })
    .withMessage('cameraFOV must be between 10 and 120'),
  
  body('lights.ambientIntensity')
    .optional()
    .isFloat({ min: 0, max: 1 })
    .withMessage('ambientIntensity must be between 0 and 1'),
  
  body('lights.directionalIntensity')
    .optional()
    .isFloat({ min: 0, max: 2 })
    .withMessage('directionalIntensity must be between 0 and 2'),
  
  body('autoRotateSpeed')
    .optional()
    .isFloat({ min: 0.1, max: 10 })
    .withMessage('autoRotateSpeed must be between 0.1 and 10'),
  
  body('annotations')
    .optional()
    .isArray()
    .withMessage('annotations must be an array'),
  
  body('annotations.*.position.x')
    .optional()
    .isFloat()
    .withMessage('annotation position x must be a number'),
  
  body('annotations.*.position.y')
    .optional()
    .isFloat()
    .withMessage('annotation position y must be a number'),
  
  body('annotations.*.position.z')
    .optional()
    .isFloat()
    .withMessage('annotation position z must be a number'),
  
  body('annotations.*.title')
    .optional()
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('annotation title must be between 1 and 50 characters'),
  
  body('annotations.*.color')
    .optional()
    .matches(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/)
    .withMessage('Invalid hex color code for annotation')
]);

// Query validation rules
const validateQueryParams = validate([
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  
  query('sort')
    .optional()
    .isIn(['createdAt', '-createdAt', 'name', '-name', 'views', '-views', 'size', '-size'])
    .withMessage('Invalid sort parameter'),
  
  query('format')
    .optional()
    .isIn(['GLB', 'GLTF'])
    .withMessage('Invalid format parameter'),
  
  query('search')
    .optional()
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('Search query must be between 1 and 50 characters')
]);

module.exports = {
  validate,
  validateModelUpload,
  validateModelUpdate,
  validateSettings,
  validateQueryParams
};