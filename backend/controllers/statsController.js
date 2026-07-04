import Student from '../models/Student.js';
import Match from '../models/Match.js';
import Batch from '../models/Batch.js';
import Attendance from '../models/Attendance.js';

/**
 * Get dashboard statistics: student count, upcoming matches, batch count, attendance rate.
 * @param {import('express').Request} req - Express request
 * @param {import('express').Response} res - Express response
 * @param {import('express').NextFunction} next - Express next function
 */
export const getStats = async (req, res, next) => {
  try {
    const [studentCount, matchCount, batchCount, attendanceRecords] = await Promise.all([
      Student.countDocuments(),
      Match.countDocuments({ status: 'Scheduled' }),
      Batch.countDocuments(),
      Attendance.find().sort({ date: -1 }).limit(5)
    ]);

    let attendanceRate = '92%';
    if (attendanceRecords.length > 0 && studentCount > 0) {
      const avgPresent = attendanceRecords.reduce((acc, curr) => acc + curr.presentIds.length, 0) / attendanceRecords.length;
      attendanceRate = Math.round((avgPresent / studentCount) * 100) + '%';
    }

    res.json({ studentCount, matchCount, batchCount, attendanceRate });
  } catch (err) {
    console.error('Stats error:', err.stack || err.message);
    next(err);
  }
};
