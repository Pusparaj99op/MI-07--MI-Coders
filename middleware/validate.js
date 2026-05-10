const { validationResult } = require('express-validator');

/**
 * Middleware: Check validation results from express-validator chains.
 * Returns 400 with structured error messages if validation fails.
 */
function handleValidationErrors(req, res, next) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().map((err) => ({
      field: err.path,
      message: err.msg,
      value: err.value,
    }));

    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      details: formattedErrors,
    });
  }

  next();
}

module.exports = { handleValidationErrors };
