import { hash, compare } from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Student from '../models/Student.js';
import Batch from '../models/Batch.js';
import { JWT_SECRET, JWT_EXPIRY } from '../config/jwt.js';

const { sign } = jwt;

/**
 * Register a new user (Coach or Admin).
 * @param {import('express').Request} req - Express request with { username, password, name, role } in body
 * @param {import('express').Response} res - Express response
 * @param {import('express').NextFunction} next - Express next function
 */
export const signup = async (req, res, next) => {
  try {
    const { username, password, name, role } = req.body;

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ error: 'Username already exists' });
    }

    const hashedPassword = await hash(password, 10);
    const user = new User({ username, password: hashedPassword, name, role: role || 'Coach' });

    if (role === 'Student') {
      const { age, contact } = req.body;
      
      // Auto-batch assignment logic
      let batchName = 'Senior';
      if (age >= 8 && age <= 12) batchName = 'Junior';
      else if (age >= 13 && age <= 17) batchName = 'Youth';
      
      let batch = await Batch.findOne({ name: batchName });
      if (!batch) {
        batch = new Batch({ name: batchName, timing: '00:00', coachId: null });
        await batch.save();
      }

      const studentProfile = new Student({
        name,
        age,
        contact,
        joinDate: new Date().toISOString().split('T')[0],
        batchId: batch._id
      });
      await studentProfile.save();
      user.studentProfileId = studentProfile._id;
    }

    await user.save();
    res.status(201).json({ message: 'User created' });
  } catch (err) {
    console.error('Signup error:', err.stack || err.message);
    next(err);
  }
};

/**
 * Authenticate a user and return a JWT token.
 * @param {import('express').Request} req - Express request with { username, password } in body
 * @param {import('express').Response} res - Express response
 * @param {import('express').NextFunction} next - Express next function
 */
export const login = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ error: 'User not found' });

    const validPassword = await compare(password, user.password);
    if (!validPassword) return res.status(400).json({ error: 'Invalid credentials' });

    const token = sign({
      id: user._id,
      username: user.username,
      name: user.name,
      role: user.role
    }, JWT_SECRET, { expiresIn: JWT_EXPIRY });

    res.json({ token, user: { id: user._id, username: user.username, name: user.name, role: user.role, studentProfileId: user.studentProfileId } });
  } catch (err) {
    console.error('Login error:', err.stack || err.message);
    next(err);
  }
};
