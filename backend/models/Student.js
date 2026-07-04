import { Schema, model } from 'mongoose';

/**
 * Student schema for cricket academy trainees.
 * @typedef {Object} Student
 * @property {string} name - Student full name
 * @property {number} age - Student age
 * @property {string} category - Playing category
 * @property {string} joinDate - Date the student joined
 * @property {ObjectId} batchId - Reference to assigned Batch
 */
const StudentSchema = new Schema({
  name: { type: String, required: true },
  age: Number,
  contact: String,
  category: String,
  joinDate: String,
  batchId: { type: Schema.Types.ObjectId, ref: 'Batch' }
});

export default model('Student', StudentSchema);
