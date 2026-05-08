
import express, { json } from 'express';
import { Schema, model, mongoose } from 'mongoose';
import cors from 'cors';
import { hash, compare } from 'bcryptjs';
import jwt from 'jsonwebtoken';
const { verify, sign } = jwt;

import dotenv from 'dotenv';
dotenv.config();

const app = express();
app.use(cors());
app.use(json());

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/rca_academy';
const JWT_SECRET = process.env.JWT_SECRET || 'rca_super_secret_key_2024';

console.log('\n--- RAJENDRA CRICKET ACADEMY PRO BACKEND ---');

// --- SCHEMAS ---

const UserSchema = new Schema({
  username: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  role: { type: String, enum: ['Coach', 'Admin'], default: 'Coach' }
});

const StudentSchema = new Schema({
  name: { type: String, required: true },
  age: Number,
  category: String,
  joinDate: String,
  batchId: { type: Schema.Types.ObjectId, ref: 'Batch' }
});

const BatchSchema = new Schema({
  name: { type: String, required: true },
  coachId: { type: Schema.Types.ObjectId, ref: 'User' },
  schedule: String,
  level: { type: String, enum: ['Beginner', 'Intermediate', 'Elite'], default: 'Intermediate' }
});

const MatchSchema = new Schema({
  opponent: String,
  date: String,
  time: String,
  venue: String,
  format: String,
  status: { type: String, enum: ['Scheduled', 'Completed', 'Cancelled'], default: 'Scheduled' }
});

const AttendanceSchema = new Schema({
  date: { type: String, unique: true },
  presentIds: [String]
});

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


const User = model('User', UserSchema);
const Student = model('Student', StudentSchema);
const Batch = model('Batch', BatchSchema);
const Match = model('Match', MatchSchema);
const Attendance = model('Attendance', AttendanceSchema);
const Performance = model('Performance', PerformanceSchema);

mongoose.connection.on('connected', () => {
  console.log('MongoDB connected');
});

mongoose.connection.on('disconnected', () => {
  console.warn('MongoDB disconnected');
});

mongoose.connection.on('error', err => {
  console.error('MongoDB error:', err);
});

// --- SEEDING ---

const seedDefaultUser = async () => {
  try {
    const adminExists = await User.findOne({ username: 'Aditya' });
    if (!adminExists) {
      const hashedPassword = await hash('Aditya', 10);
      const admin = new User({
        username: 'Aditya',
        password: hashedPassword,
        name: 'Aditya (Admin)',
        role: 'Admin'
      });
      await admin.save();
      console.log('SEED: Created default Admin user (Aditya/Aditya)');
    }
  } catch (err) {
    console.error('SEED ERROR:', err.message);
  }
};

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

connectDB();

// --- MIDDLEWARE ---

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.sendStatus(401);

  verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

const authorizeRole = (role) => {
  return (req, res, next) => {
    if (!req.user || req.user.role !== role) {
      return res.status(403).json({ error: 'Access denied: Requires ' + role + ' privilege' });
    }
    next();
  };
};

// --- AUTH ROUTES ---

app.post('/api/auth/signup', async (req, res) => {
  try {
    const { username, password, name, role } = req.body;
    const hashedBtn = await hash(password, 10);
    const user = new User({ username, password: hashedBtn, name, role: role || 'Coach' });
    await user.save();
    res.status(201).json({ message: 'User created' });
  } catch (err) {
    res.status(400).json({ error: 'Username already exists' });
  }
});

app.post('/api/auth/login', async (req, res) => {
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
  }, JWT_SECRET, { expiresIn: '24h' });
  
  res.json({ token, user: { id: user._id, username: user.username, name: user.name, role: user.role } });
});

// --- DASHBOARD STATS ---

app.get('/api/stats', authenticateToken, async (req, res) => {
  try {
    const [studentCount, matchCount, batchCount, attendanceRecords] = await Promise.all([
      Student.countDocuments(),
      Match.countDocuments({ status: 'Scheduled' }),
      Batch.countDocuments(),
      Attendance.find().sort({ date: -1 }).limit(5)
    ]);

    let attendanceRate = '92%';
    if (attendanceRecords.length > 0 && studentCount > 0) {
      const avgPresent = attendanceRecords.reduce((acc, curr) => acc + curr.presentIds.length, 0) / attendanceRecords.length;
      attendanceRate = Math.round((avgPresent / studentCount) * 100) + '%';
    }

    res.json({ studentCount, matchCount, batchCount, attendanceRate });
  } catch (err) {
    res.status(500).json({ error: 'Stats unavailable' });
  }
});

// --- BATCHES ---

app.get('/api/batches', authenticateToken, async (req, res) => {
  const batches = await Batch.find().populate('coachId', 'name');
  res.json(batches.map(b => ({
    id: b._id, name: b.name, coachId: b.coachId?._id, coachName: b.coachId?.name, schedule: b.schedule, level: b.level
  })));
});

app.post('/api/batches', authenticateToken, authorizeRole('Admin'), async (req, res) => {
  const batch = new Batch(req.body);
  await batch.save();
  res.status(201).json(batch);
});

app.put('/api/batches/:id', authenticateToken, authorizeRole('Admin'), async (req, res) => {
  const batch = await Batch.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(batch);
});

app.delete('/api/batches/:id', authenticateToken, authorizeRole('Admin'), async (req, res) => {
  await Batch.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

// --- STUDENTS ---

app.get('/api/students', authenticateToken, async (req, res) => {
  const students = await Student.find();
  res.json(students.map(s => ({ id: s._id, name: s.name, age: s.age, category: s.category, joinDate: s.joinDate, batchId: s.batchId })));
});

app.post('/api/students', authenticateToken, authorizeRole('Admin'), async (req, res) => {
  const student = new Student(req.body);
  await student.save();
  res.status(201).json(student);
});

app.put('/api/students/:id', authenticateToken, authorizeRole('Admin'), async (req, res) => {
  const student = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(student);
});

app.delete('/api/students/:id', authenticateToken, authorizeRole('Admin'), async (req, res) => {
  await Student.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

// --- MATCHES ---

app.get('/api/matches', authenticateToken, async (req, res) => {
  const matches = await Match.find();
  res.json(matches.map(m => ({ id: m._id, opponent: m.opponent, date: m.date, time: m.time, venue: m.venue, format: m.format, status: m.status })));
});

app.post('/api/matches', authenticateToken, authorizeRole('Admin'), async (req, res) => {
  const match = new Match(req.body);
  await match.save();
  res.status(201).json(match);
});

app.put('/api/matches/:id', authenticateToken, authorizeRole('Admin'), async (req, res) => {
  const match = await Match.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(match);
});

app.delete('/api/matches/:id', authenticateToken, authorizeRole('Admin'), async (req, res) => {
  await Match.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

// --- OTHER ---

app.post('/api/attendance', authenticateToken, async (req, res) => {
  const { date, presentIds } = req.body;
  const attendance = await Attendance.findOneAndUpdate({ date }, { presentIds }, { upsert: true, new: true });
  res.json(attendance);
});

app.post('/api/performance', authenticateToken, async (req, res) => {
  console.log('PERFORMANCE PAYLOAD:', JSON.stringify(req.body, null, 2));
  try {
    const perf = new Performance({
      ...req.body,
      recordedBy: req.user.id
    });
    await perf.save();
    res.status(201).json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to save performance' });
  }
});


app.get('/api/performance/history/:studentId', authenticateToken, async (req, res) => {
  try {
    const history = await Performance
      .find({ studentId: req.params.studentId })
      .sort({ date: 1 }); // chronological

    res.json(history);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch history' });
  }
});

app.get('/api/users', authenticateToken, authorizeRole('Admin'), async (req, res) => {
  const users = await User.find({}, '-password');
  res.json(users.map(u => ({ id: u._id, username: u.username, name: u.name, role: u.role })));
});

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`\nSUCCESS: RCA RBAC Backend active at port ${PORT}`));
