import { Schema, model } from 'mongoose';

/**
 * Attendance schema for daily roll-call records.
 */
const AttendanceSchema = new Schema({
  date: { type: String, required: true, unique: true },
  presentIds: [String]
}, { timestamps: true });

export default model('Attendance', AttendanceSchema);
