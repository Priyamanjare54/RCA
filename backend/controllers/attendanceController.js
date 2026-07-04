import Attendance from '../models/Attendance.js';

/**
 * Save or update daily attendance record.
 */
export const save = async (req, res, next) => {
  try {
    const { date, presentIds } = req.body;
    const attendance = await Attendance.findOneAndUpdate(
      { date }, 
      { presentIds }, 
      { upsert: true, new: true }
    );
    res.json(attendance);
  } catch (err) {
    next(err);
  }
};

/**
 * Get all attendance records.
 */
export const getAll = async (req, res, next) => {
  try {
    const records = await Attendance.find().sort({ date: -1 });
    res.json(records);
  } catch (err) {
    next(err);
  }
};
