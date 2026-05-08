import mongoose from "mongoose";

const PerformanceSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
    required: true,
  },

  date: {
    type: String, // YYYY-MM-DD
    required: true,
  },

  // Skill performance
  runs: { type: String },
  wickets: { type: String },
  notes: { type: String },

  // Fitness performance
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
    notes: String,
  },

  recordedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Performance", PerformanceSchema);
