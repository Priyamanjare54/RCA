import Match from '../models/Match.js';

/**
 * Get all matches.
 * @param {import('express').Request} req - Express request
 * @param {import('express').Response} res - Express response
 * @param {import('express').NextFunction} next - Express next function
 */
export const getAll = async (req, res, next) => {
  try {
    const matches = await Match.find();
    res.json(matches.map(m => ({ id: m._id, opponent: m.opponent, date: m.date, time: m.time, venue: m.venue, format: m.format, status: m.status })));
  } catch (err) {
    console.error('Get matches error:', err.stack || err.message);
    next(err);
  }
};

/**
 * Create a new match. Requires Admin role.
 * @param {import('express').Request} req - Express request with match data in body
 * @param {import('express').Response} res - Express response
 * @param {import('express').NextFunction} next - Express next function
 */
export const create = async (req, res, next) => {
  try {
    const match = new Match(req.body);
    await match.save();
    res.status(201).json(match);
  } catch (err) {
    console.error('Create match error:', err.stack || err.message);
    next(err);
  }
};

/**
 * Update an existing match by ID. Requires Admin role.
 * @param {import('express').Request} req - Express request with match ID in params and update data in body
 * @param {import('express').Response} res - Express response
 * @param {import('express').NextFunction} next - Express next function
 */
export const update = async (req, res, next) => {
  try {
    const match = await Match.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!match) return res.status(404).json({ success: false, error: 'Match not found' });
    res.json(match);
  } catch (err) {
    console.error('Update match error:', err.stack || err.message);
    next(err);
  }
};

/**
 * Delete a match by ID. Requires Admin role.
 * @param {import('express').Request} req - Express request with match ID in params
 * @param {import('express').Response} res - Express response
 * @param {import('express').NextFunction} next - Express next function
 */
export const remove = async (req, res, next) => {
  try {
    const match = await Match.findByIdAndDelete(req.params.id);
    if (!match) return res.status(404).json({ success: false, error: 'Match not found' });
    res.json({ success: true });
  } catch (err) {
    console.error('Delete match error:', err.stack || err.message);
    next(err);
  }
};
