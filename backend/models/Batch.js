import { Schema, model } from 'mongoose';

/**
 * Batch schema for training groups.
 * @typedef {Object} Batch
 * @property {string} name - Batch name
 * @property {ObjectId} coachId - Reference to the assigned coach (User)
 * @property {string} schedule - Training schedule description
 * @property {'Beginner'|'Intermediate'|'Elite'} level - Skill level of the batch
 */
const BatchSchema = new Schema({
  name: { type: String, required: true },
  coachId: { type: Schema.Types.ObjectId, ref: 'User' },
  schedule: String,
  level: { type: String, enum: ['Beginner', 'Intermediate', 'Elite'], default: 'Intermediate' }
});

export default model('Batch', BatchSchema);
