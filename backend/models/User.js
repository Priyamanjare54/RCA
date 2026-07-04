import { Schema, model } from 'mongoose';

/**
 * User schema for coaches and admins.
 * @typedef {Object} User
 * @property {string} username - Unique login username
 * @property {string} password - Bcrypt-hashed password
 * @property {string} name - Display name
 * @property {'Coach'|'Admin'} role - Authorization role
 */
const UserSchema = new Schema({
  username: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  role: { type: String, enum: ['Coach', 'Admin', 'Student'], default: 'Coach' },
  studentProfileId: { type: Schema.Types.ObjectId, ref: 'Student' } // Only populated if role === 'Student'
});

export default model('User', UserSchema);
