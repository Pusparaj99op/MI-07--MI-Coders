/**
 * Global error handler middleware.
 * Catches all unhandled errors and returns a clean JSON response.
 */
function errorHandler(err, _req, res, _next) {
  console.error('❌ Unhandled error:', err.message);

  if (process.env.NODE_ENV === 'development') {
    console.error(err.stack);
  }

  // If headers are already sent, delegate to Express's default handler
  if (res.headersSent) {
    return;
  }

  // SQLite constraint errors
  if (err.message && err.message.includes('UNIQUE constraint failed')) {
    const field = err.message.split('.').pop() || 'field';
    return res.status(409).json({
      success: false,
      error: `A record with this ${field} already exists.`,
    });
  }

  if (err.message && err.message.includes('FOREIGN KEY constraint failed')) {
    return res.status(400).json({
      success: false,
      error: 'Referenced record does not exist.',
    });
  }

  // SQLite CHECK constraint errors
  if (err.message && err.message.includes('CHECK constraint failed')) {
    return res.status(400).json({
      success: false,
      error: 'Invalid value for one or more fields.',
    });
  }

  // Express body-parser errors
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({
      success: false,
      error: 'Invalid JSON in request body.',
    });
  }

  // Default server error
  const statusCode = err.statusCode || 500;
  const message = statusCode === 500
    ? 'Internal server error. Please try again later.'
    : err.message;

  res.status(statusCode).json({
    success: false,
    error: message,
  });
}

/**
 * Wrap async route handlers so thrown errors are caught by errorHandler.
 * Usage: router.get('/path', asyncHandler(async (req, res) => { ... }))
 */
function asyncHandler(fn) {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

module.exports = { errorHandler, asyncHandler };
