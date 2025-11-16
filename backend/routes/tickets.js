const express = require("express");
const jwt = require("jsonwebtoken");
const Ticket = require("../models/Ticket");
const { analyzeTicket } = require("../utils/ai");

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;

// Auth middleware
function auth(req, res, next) {
  const header = req.headers.authorization;
  if (!header) return res.status(401).send({ error: "No token" });

  const token = header.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    return res.status(401).send({ error: "Invalid token" });
  }
}

// CREATE Ticket
router.post("/", auth, async (req, res) => {
  const { title, description, department } = req.body;

  console.log("🔍 Incoming Ticket Request:", req.body);

  const ai = await analyzeTicket(description);

  console.log("🤖 AI Classified Ticket:", ai);

  const ticket = await Ticket.create({
    user: req.user.id,
    title,
    description,
    category: ai.category,
    priority: ai.priority,
    department: department || ai.department,
    aiResult: ai,
  });

  res.send(ticket);
});


// GET Tickets
router.get("/", auth, async (req, res) => {
  if (req.user.role === "admin") {
    const all = await Ticket.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 });
    return res.send(all);
  }

  const my = await Ticket.find({ user: req.user.id }).sort({ createdAt: -1 });
  res.send(my);
});

// UPDATE Status
router.post("/:id/status", auth, async (req, res) => {
  if (req.user.role !== "admin")
    return res.status(403).send({ error: "Not authorized" });

  await Ticket.findByIdAndUpdate(req.params.id, { status: req.body.status });
  res.send({ success: true });
});

module.exports = router;
