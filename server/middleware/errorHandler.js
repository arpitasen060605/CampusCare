const multer = require('multer');

const errorHandler = (err, req, res, next) => {
  console.error('[Central Error Handler Log]:', err);

  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message || 'Internal Server Error';

  // Handle Multer errors gracefully
  if (err instanceof multer.MulterError) {
    statusCode = 400;
    if (err.code === 'LIMIT_FILE_SIZE') {
      message = 'File size exceeds maximum allowed limit of 5MB!';
    } else {
      message = `Upload Error: ${err.message}`;
    }
  } else if (err.status === 400 || err.name === 'Error') {
    if (message.includes('Invalid file type')) {
      statusCode = 400;
    }
  }

  // Handle Mongoose Validation Error
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = Object.values(err.errors).map((val) => val.message).join(', ');
  }

  // Handle Mongoose Duplicate Key Error
  if (err.code === 11000) {
    statusCode = 400;
    const field = Object.keys(err.keyValue || {})[0];
    message = `Duplicate field value entered for ${field}. Please use another value!`;
  }

  res.status(statusCode).json({
    error: statusCode === 400 ? 'Bad Request' : statusCode === 401 ? 'Unauthorized' : 'Server Error',
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

module.exports = errorHandler;
