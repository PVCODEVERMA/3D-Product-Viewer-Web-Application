const fs = require('fs');
const path = require('path');

// Ensure logs directory exists
const logsDir = path.join(__dirname, '../../logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Log file paths
const logFile = path.join(logsDir, 'app.log');
const errorFile = path.join(logsDir, 'error.log');

/**
 * Get current timestamp for logs
 * @returns {string} Formatted timestamp
 */
const getTimestamp = () => {
  return new Date().toISOString().replace('T', ' ').substring(0, 19);
};

/**
 * Write log to file
 * @param {string} message - Log message
 * @param {string} level - Log level (info, warn, error)
 * @param {string} file - Log file path
 */
const writeLog = (message, level, file) => {
  const timestamp = getTimestamp();
  const logMessage = `[${timestamp}] [${level.toUpperCase()}] ${message}\n`;
  
  fs.appendFile(file, logMessage, (err) => {
    if (err) {
      console.error('Failed to write log:', err);
    }
  });
};

/**
 * Log info message
 * @param {string} message - Log message
 * @param {any} data - Additional data
 */
const info = (message, data = null) => {
  const logMessage = data ? `${message} ${JSON.stringify(data)}` : message;
  console.log(` ${getTimestamp()} - INFO: ${message}`);
  writeLog(logMessage, 'info', logFile);
};

/**
 * Log warning message
 * @param {string} message - Log message
 * @param {any} data - Additional data
 */
const warn = (message, data = null) => {
  const logMessage = data ? `${message} ${JSON.stringify(data)}` : message;
  console.warn(` ${getTimestamp()} - WARN: ${message}`);
  writeLog(logMessage, 'warn', logFile);
};

/**
 * Log error message
 * @param {string} message - Log message
 * @param {Error} error - Error object
 */
const error = (message, error = null) => {
  const errorDetails = error ? `${error.message}\n${error.stack}` : '';
  const logMessage = `${message}\n${errorDetails}`;
  
  console.error(` ${getTimestamp()} - ERROR: ${message}`);
  if (error) {
    console.error(error.stack);
  }
  
  writeLog(logMessage, 'error', errorFile);
};

/**
 * Log HTTP request
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {number} responseTime - Response time in ms
 */
const http = (req, res, responseTime) => {
  const timestamp = getTimestamp();
  const method = req.method;
  const url = req.originalUrl || req.url;
  const status = res.statusCode;
  const ip = req.ip || req.connection.remoteAddress;
  const userAgent = req.get('user-agent') || 'Unknown';
  const contentLength = res.get('content-length') || 0;
  
  const logMessage = `${timestamp} - ${method} ${url} ${status} ${responseTime}ms ${contentLength}bytes - ${ip} - ${userAgent}`;
  
  console.log(` ${logMessage}`);
  writeLog(logMessage, 'http', logFile);
};

/**
 * Log database query
 * @param {string} collection - Collection name
 * @param {string} operation - Operation type
 * @param {number} duration - Query duration in ms
 * @param {Object} query - Query object
 */
const database = (collection, operation, duration, query = null) => {
  const timestamp = getTimestamp();
  const queryStr = query ? JSON.stringify(query) : '';
  const logMessage = `${timestamp} - DB ${collection}.${operation} ${duration}ms ${queryStr}`;
  
  console.log(` ${logMessage}`);
  writeLog(logMessage, 'database', logFile);
};

module.exports = {
  info,
  warn,
  error,
  http,
  database,
  getTimestamp
};