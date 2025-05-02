const morgan = require('morgan');
const path = require('path');

// Custom format for Morgan
const logFormat = ':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent" :response-time ms';

// Custom logger middleware that doesn't require file system access
const requestLogger = (req, res, next) => {
  const startTime = Date.now();
  
  // Store the original end function
  const originalEnd = res.end;
  
  // Override the end function to log after response is sent
  res.end = function(chunk, encoding) {
    const responseTime = Date.now() - startTime;
    const logEntry = {
      timestamp: new Date().toISOString(),
      method: req.method,
      url: req.originalUrl || req.url,
      status: res.statusCode,
      responseTime: `${responseTime}ms`,
      contentLength: res.getHeader('content-length'),
      userAgent: req.headers['user-agent'],
      ip: req.ip || req.connection.remoteAddress
    };

    // Log to console
    console.log(`${logEntry.timestamp} - ${logEntry.method} ${logEntry.url} ${logEntry.status} ${logEntry.responseTime}`);
    
    // Log errors to console with more detail
    if (res.statusCode >= 400) {
      console.error(`ERROR ${logEntry.timestamp} - ${logEntry.method} ${logEntry.url} ${logEntry.status} ${logEntry.responseTime}`);
    }
    
    // Call the original end function
    return originalEnd.call(this, chunk, encoding);
  };
  
  next();
};

// Error handling middleware
const errorLogger = (err, req, res, next) => {
  const errorLog = {
    timestamp: new Date().toISOString(),
    method: req.method,
    url: req.originalUrl || req.url,
    error: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack
  };
  
  // Log to console
  console.error(`ERROR ${errorLog.timestamp} - ${errorLog.method} ${errorLog.url} - ${errorLog.error}`);
  if (errorLog.stack && process.env.NODE_ENV !== 'production') {
    console.error(errorLog.stack);
  }
  
  // Pass to next error handler
  next(err);
};

module.exports = {
  // Morgan middleware for standard HTTP request logging
  morganLogger: morgan(logFormat),
  
  // Custom request logger
  requestLogger,
  
  // Error logger middleware
  errorLogger
};