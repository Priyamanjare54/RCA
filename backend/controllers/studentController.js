import Student from '../models/Student.js';
import Batch from '../models/Batch.js';
import User from '../models/User.js';
import { hash } from 'bcryptjs';

/**
 * Get all students.
 * @param {import('express').Request} req - Express request
 * @param {import('express').Response} res - Express response
 * @param {import('express').NextFunction} next - Express next function
 */
export const getAll = async (req, res, next) => {
  try {
    let query = {};
    if (req.user.role === 'Student') {
      if (!req.user.studentProfileId) return res.json([]);
      query = { _id: req.user.studentProfileId };
    } else if (req.user.role === 'Coach') {
      const coachBatches = await Batch.find({ coachId: req.user.id });
      const batchIds = coachBatches.map(b => b._id);
      query = { batchId: { $in: batchIds } };
    }

    const students = await Student.find(query);
    res.json(students.map(s => ({ id: s._id, name: s.name, age: s.age, contact: s.contact, category: s.category, joinDate: s.joinDate, batchId: s.batchId })));
  } catch (err) {
    console.error('Get students error:', err.stack || err.message);
    next(err);
  }
};

/**
 * Create a new student. Requires Admin role.
 * @param {import('express').Request} req - Express request with student data in body
 * @param {import('express').Response} res - Express response
 * @param {import('express').NextFunction} next - Express next function
 */
export const create = async (req, res, next) => {
  try {
    const data = { ...req.body };
    
    // Auto-batch assignment based on age if not manually overridden
    if (!data.batchId) {
      let batchName = 'Senior';
      if (data.age >= 8 && data.age <= 12) batchName = 'Junior';
      else if (data.age >= 13 && data.age <= 17) batchName = 'Youth';
      
      let batch = await Batch.findOne({ name: batchName });
      if (!batch) {
        batch = new Batch({ name: batchName, timing: '00:00', coachId: null });
        await batch.save();
      }
      data.batchId = batch._id;
    }

    const student = new Student(data);
    await student.save();
    
    // Auto-generate User account for Student
    const baseUsername = student.name.replace(/\s+/g, '').toLowerCase() + Math.floor(100 + Math.random() * 900);
    const defaultPassword = 'rcastudent';
    const hashedPassword = await hash(defaultPassword, 10);
    
    const user = new User({
      username: baseUsername,
      password: hashedPassword,
      name: student.name,
      role: 'Student',
      studentProfileId: student._id
    });
    await user.save();

    res.status(201).json({ 
      ...student.toObject(), 
      id: student._id,
      credentials: { username: baseUsername, password: defaultPassword } 
    });
  } catch (err) {
    console.error('Create student error:', err.stack || err.message);
    next(err);
  }
};

/**
 * Update an existing student by ID. Requires Admin role.
 * @param {import('express').Request} req - Express request with student ID in params and update data in body
 * @param {import('express').Response} res - Express response
 * @param {import('express').NextFunction} next - Express next function
 */
export const update = async (req, res, next) => {
  try {
    const data = { ...req.body };
    if (!data.batchId) data.batchId = null; // clear batch assignment if empty
    const student = await Student.findByIdAndUpdate(req.params.id, data, { new: true });
    if (!student) return res.status(404).json({ success: false, error: 'Student not found' });
    res.json(student);
  } catch (err) {
    console.error('Update student error:', err.stack || err.message);
    next(err);
  }
};

/**
 * Delete a student by ID. Requires Admin role.
 * @param {import('express').Request} req - Express request with student ID in params
 * @param {import('express').Response} res - Express response
 * @param {import('express').NextFunction} next - Express next function
 */
export const remove = async (req, res, next) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);
    if (!student) return res.status(404).json({ success: false, error: 'Student not found' });
    res.json({ success: true });
  } catch (err) {
    console.error('Delete student error:', err.stack || err.message);
    next(err);
  }
};
