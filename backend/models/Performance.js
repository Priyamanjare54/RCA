import { Schema, model } from 'mongoose';

/**
 * Performance schema for tracking student skill and fitness metrics.
 * @typedef {Object} Performance
 * @property {ObjectId} studentId - Reference to the Student
 * @property {string} date - Record date (YYYY-MM-DD)
 * @property {Object} skill - Skill performance breakdown
 * @property {Object} skill.batting - Batting stats (runs, balls)
 * @property {Object} skill.bowling - Bowling stats (wickets, runsConceded, overs)
 * @property {Object} skill.fielding - Fielding stats (catches, runOuts, stumpings)
 * @property {string} skill.notes - Skill session notes
 * @property {Object} metrics - Fitness test metrics
 * @property {ObjectId} recordedBy - Reference to the User who recorded
 * @property {Date} createdAt - Auto-generated timestamp
 */
const PerformanceSchema = new Schema({
  studentId: { type: Schema.Types.ObjectId, ref: 'Student', required: true },
  date: { type: String, required: true }, // YYYY-MM-DD

  skill: {
    batting: {
      runs: { type: Number, default: 0 },
      balls: { type: Number, default: 0 }
    },
    bowling: {
      wickets: { type: Number, default: 0 },
      runsConceded: { type: Number, default: 0 },
      overs: { type: Number, default: 0 }
    },
    fielding: {
      catches: { type: Number, default: 0 },
      runOuts: { type: Number, default: 0 },
      stumpings: { type: Number, default: 0 }
    },
    notes: { type: String }
  },

  metrics: {
    pushups: String,
    squats: String,
    burpees: String,
    plankHold: String,
    chairHold: String,
    sprint20m: String,
    sprint40m: String,
    sprint60m: String,
    yoyoTest: String,
    notes: String
  },

  recordedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now }
});

export default model('Performance', PerformanceSchema);
