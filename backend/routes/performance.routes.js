import express from "express";
import Performance from "../models/Performance.js";
import auth from "../middleware/auth.middleware.js";

const router = express.Router();

// SAVE PERFORMANCE (SKILL OR FITNESS)
router.post("/", auth, async (req, res) => {
  try {
    const record = new Performance({
      ...req.body,
      recordedBy: req.user.id,
    });

    await record.save();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to save performance" });
  }
});

// GET PERFORMANCE HISTORY
router.get("/history/:studentId", auth, async (req, res) => {
  try {
    const data = await Performance.find({
      studentId: req.params.studentId,
    }).sort({ date: 1 });

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch history" });
  }
});

export default router;
