import Performance from '../models/Performance.js';

/**
 * Save a performance record (skill or fitness) for a student.
 * Automatically sets `recordedBy` to the authenticated user's ID.
 * @param {import('express').Request} req - Express request with performance data in body
 * @param {import('express').Response} res - Express response
 * @param {import('express').NextFunction} next - Express next function
 */
export const save = async (req, res, next) => {
  console.log('PERFORMANCE PAYLOAD:', JSON.stringify(req.body, null, 2));
  try {
    const perf = new Performance({
      ...req.body,
      recordedBy: req.user.id
    });
    await perf.save();
    res.status(201).json({ success: true });
  } catch (err) {
    console.error('Save performance error:', err.stack || err.message);
    next(err);
  }
};

/**
 * Get performance history for a specific student, sorted chronologically.
 * @param {import('express').Request} req - Express request with studentId in params
 * @param {import('express').Response} res - Express response
 * @param {import('express').NextFunction} next - Express next function
 */
export const getHistory = async (req, res, next) => {
  try {
    if (req.user.role === 'Student' && String(req.user.studentProfileId) !== req.params.studentId) {
      return res.status(403).json({ success: false, error: 'Access denied to other student records' });
    }

    const history = await Performance
      .find({ studentId: req.params.studentId })
      .sort({ date: 1 }); // chronological

    res.json(history);
  } catch (err) {
    console.error('Get performance history error:', err.stack || err.message);
    next(err);
  }
};
