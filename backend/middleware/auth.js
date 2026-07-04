import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/jwt.js';

const { verify } = jwt;

/**
 * Express middleware that validates a JWT Bearer token from the Authorization header.
 * Attaches the decoded user payload to `req.user` on success.
 * @param {import('express').Request} req - Express request
 * @param {import('express').Response} res - Express response
 * @param {import('express').NextFunction} next - Express next function
 */
export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ success: false, error: 'Authentication required', details: 'No token provided' });
  }

  verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ success: false, error: 'Invalid or expired token', details: err.message });
    }
    req.user = user;
    next();
  });
};

/**
 * Express middleware factory that restricts access to specific user roles.
 * Must be used after `authenticateToken`.
 * @param {string|string[]} roles - The required role(s) (e.g. 'Admin', or ['Admin', 'Coach'])
 * @returns {import('express').RequestHandler} Middleware function
 */
export const authorizeRole = (roles) => {
  return (req, res, next) => {
    const allowedRoles = Array.isArray(roles) ? roles : [roles];
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ success: false, error: 'Access denied: Requires ' + allowedRoles.join(' or ') + ' privilege' });
    }
    next();
  };
};
