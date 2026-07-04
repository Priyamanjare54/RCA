import Batch from '../models/Batch.js';

/**
 * Get all batches with populated coach names.
 * @param {import('express').Request} req - Express request
 * @param {import('express').Response} res - Express response
 * @param {import('express').NextFunction} next - Express next function
 */
export const getAll = async (req, res, next) => {
  try {
    const batches = await Batch.find().populate('coachId', 'name');
    res.json(batches.map(b => ({
      id: b._id, name: b.name, coachId: b.coachId?._id, coachName: b.coachId?.name, schedule: b.schedule, level: b.level
    })));
  } catch (err) {
    console.error('Get batches error:', err.stack || err.message);
    next(err);
  }
};

/**
 * Create a new batch. Requires Admin role.
 * @param {import('express').Request} req - Express request with batch data in body
 * @param {import('express').Response} res - Express response
 * @param {import('express').NextFunction} next - Express next function
 */
export const create = async (req, res, next) => {
  try {
    const data = { ...req.body };
    if (!data.coachId) delete data.coachId; // strip empty string to avoid ObjectId cast error
    const batch = new Batch(data);
    await batch.save();
    res.status(201).json(batch);
  } catch (err) {
    console.error('Create batch error:', err.stack || err.message);
    next(err);
  }
};

/**
 * Update an existing batch by ID. Requires Admin role.
 * @param {import('express').Request} req - Express request with batch ID in params and update data in body
 * @param {import('express').Response} res - Express response
 * @param {import('express').NextFunction} next - Express next function
 */
export const update = async (req, res, next) => {
  try {
    const data = { ...req.body };
    if (!data.coachId) data.coachId = null; // clear coach assignment if empty
    const batch = await Batch.findByIdAndUpdate(req.params.id, data, { new: true });
    if (!batch) return res.status(404).json({ success: false, error: 'Batch not found' });
    res.json(batch);
  } catch (err) {
    console.error('Update batch error:', err.stack || err.message);
    next(err);
  }
};

/**
 * Delete a batch by ID. Requires Admin role.
 * @param {import('express').Request} req - Express request with batch ID in params
 * @param {import('express').Response} res - Express response
 * @param {import('express').NextFunction} next - Express next function
 */
export const remove = async (req, res, next) => {
  try {
    const batch = await Batch.findByIdAndDelete(req.params.id);
    if (!batch) return res.status(404).json({ success: false, error: 'Batch not found' });
    res.json({ success: true });
  } catch (err) {
    console.error('Delete batch error:', err.stack || err.message);
    next(err);
  }
};
