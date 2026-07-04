import User from '../models/User.js';

/**
 * Get all users (excluding passwords). Requires Admin role.
 * @param {import('express').Request} req - Express request
 * @param {import('express').Response} res - Express response
 * @param {import('express').NextFunction} next - Express next function
 */
export const getAll = async (req, res, next) => {
  try {
    const users = await User.find({}, '-password');
    res.json(users.map(u => ({ id: u._id, username: u.username, name: u.name, role: u.role })));
  } catch (err) {
    console.error('Get users error:', err.stack || err.message);
    next(err);
  }
};
