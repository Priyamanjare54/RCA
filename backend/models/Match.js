import { Schema, model } from 'mongoose';

/**
 * Match schema for scheduled cricket matches.
 * @typedef {Object} Match
 * @property {string} opponent - Opposing team name
 * @property {string} date - Match date
 * @property {string} time - Match time
 * @property {string} venue - Match venue
 * @property {string} format - Match format (T20, ODI, etc.)
 * @property {'Scheduled'|'Completed'|'Cancelled'} status - Current match status
 */
const MatchSchema = new Schema({
  opponent: String,
  date: String,
  time: String,
  venue: String,
  format: String,
  status: { type: String, enum: ['Scheduled', 'Completed', 'Cancelled'], default: 'Scheduled' }
});

export default model('Match', MatchSchema);
