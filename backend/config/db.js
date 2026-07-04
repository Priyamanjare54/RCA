import mongoose from 'mongoose';
import { hash } from 'bcryptjs';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/rca_academy';

if (!process.env.MONGODB_URI) {
  console.warn('⚠️  WARNING: MONGODB_URI not set in .env — using local fallback');
}

/**
 * Seeds a default Admin user if one doesn't already exist.
 * Creates user "Aryan" with Admin role on first run.
 * @returns {Promise<void>}
 */
const seedDefaultUser = async () => {
  try {
    // Lazy-import to avoid circular dependency
    const User = mongoose.model('User');
    
    // Clean up old Aditya admin user if exists
    await User.deleteOne({ username: 'Aditya' });

    // Check if the Admin Aryan exists
    const adminExists = await User.findOne({ username: 'Aryan', role: 'Admin' });
    if (!adminExists) {
      // Delete any conflicting non-admin user with username 'Aryan'
      await User.deleteOne({ username: 'Aryan' });
      
      const hashedPassword = await hash('Aryan', 10);
      const admin = new User({
        username: 'Aryan',
        password: hashedPassword,
        name: 'Aryan (Admin)',
        role: 'Admin'
      });
      await admin.save();
      console.log('SEED: Created default Admin user (Aryan/Aryan)');
    }
  } catch (err) {
    console.error('SEED ERROR:', err.message);
  }
};

/**
 * Connects to MongoDB Atlas (or local) and seeds the default user.
 * Exits the process with code 1 on failure.
 * @returns {Promise<void>}
 */
const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      heartbeatFrequencyMS: 10000,
      retryWrites: true,
    });

    console.log('SUCCESS: MongoDB Atlas connected');
    seedDefaultUser();
  } catch (err) {
    console.error('MONGODB CONNECTION FAILED:', err.message);
    process.exit(1);
  }
};

// Connection event listeners
mongoose.connection.on('connected', () => {
  console.log('MongoDB connected');
});

mongoose.connection.on('disconnected', () => {
  console.warn('MongoDB disconnected');
});

mongoose.connection.on('error', err => {
  console.error('MongoDB error:', err);
});

export default connectDB;
