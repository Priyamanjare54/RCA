/**
 * Middleware factory that validates required fields exist in `req.body`.
 * Returns 400 with a list of missing fields if validation fails.
 * @param {...string} fields - Names of required body fields
 * @returns {import('express').RequestHandler} Middleware function
 * @example
 * router.post('/', requireFields('username', 'password', 'name'), controller.signup);
 */
export const requireFields = (...fields) => {
  return (req, res, next) => {
    const missing = fields.filter(f => req.body[f] === undefined || req.body[f] === null || req.body[f] === '');
    if (missing.length > 0) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields',
        details: missing
      });
    }
    next();
  };
};
