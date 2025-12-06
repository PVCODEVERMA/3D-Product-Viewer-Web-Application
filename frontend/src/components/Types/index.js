// src/types/index.js

/**
 * @typedef {Object} Model
 * @property {string} id
 * @property {string} name
 * @property {string} url
 * @property {string} thumbnail
 * @property {string} createdAt
 * @property {number} [size]
 * @property {string} [format]
 */

/**
 * @typedef {Object} ViewerSettings
 * @property {string} backgroundColor
 * @property {boolean} wireframeMode
 * @property {string} materialColor
 * @property {boolean} showGrid
 * @property {string} [environment]
 * @property {string} [modelId]
 */

/**
 * @typedef {Object} ApiResponse
 * @property {boolean} success
 * @property {*} [data]
 * @property {string} [error]
 */

/**
 * @typedef {Object} UploadResponse
 * @property {string} id
 * @property {string} url
 * @property {string} name
 * @property {string} thumbnail
 */

/**
 * @typedef {Object} SettingsResponse
 * @property {string} id
 * @property {string} createdAt
 * @property {string} updatedAt
 * @property {string} backgroundColor
 * @property {boolean} wireframeMode
 * @property {string} materialColor
 * @property {boolean} showGrid
 * @property {string} [environment]
 * @property {string} [modelId]
 */
