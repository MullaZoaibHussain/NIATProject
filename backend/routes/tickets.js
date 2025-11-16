const express = require("express");
const jwt = require("jsonwebtoken");
const Ticket = require("../models/Ticket");
const { analyzeTicket } = require("../utils/ai");
const User = require("../models/User");

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "supersecretjwt";

// auth middleware
function auth(req, res, next) {
  const header = req.headers.authorization;
  if (!header) return res.status(401).send({ error: "No token" });
  const token = header.split(" ")[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    res.status(401).send({ error: "Invalid token" });
  }
}

// create ticket
router.post("/", auth, async (req, res) => {
  try {
    const { title, description, department } = req.body;
    const ai = await analyzeTicket(description || title || "");

    // unique ticket number: TKT-YYYYMMDD-XXXX
    const date = new Date();
    const ymd = date.toISOString().slice(0,10).replace(/-/g,"");
    const rand = Math.floor(1000 + Math.random()*9000);
    const ticketNumber = `TKT-${ymd}-${rand}`;

    const ticket = await Ticket.create({
      ticketNumber,
      user: req.user.id,
      title,
      description,
      category: ai.category,
      priority: ai.priority,
      department: department || ai.department,
      aiResult: ai
    });

    res.send(ticket);
  } catch (err) {
    console.error("create ticket err:", err);
    res.status(500).send({ error: "Server error" });
  }
});

// get tickets (admin sees all)
router.get("/", auth, async (req, res) => {
  try {
    if (req.user.role === "admin") {
      const all = await Ticket.find().populate("user","name email").sort({ createdAt: -1 });
      return res.send(all);
    }
    const mine = await Ticket.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.send(mine);
  } catch (err) {
    console.error("get tickets err:", err);
    res.status(500).send({ error: "Server error" });
  }
});

// update status (admin only)
router.post("/:id/status", auth, async (req, res) => {
  try {
    if (req.user.role !== "admin") return res.status(403).send({ error: "Not authorized" });
    await Ticket.findByIdAndUpdate(req.params.id, { status: req.body.status });
    res.send({ success: true });
  } catch (err) {
    console.error("status update err:", err);
    res.status(500).send({ error: "Server error" });
  }
});

// analytics (admin)
router.get("/analytics/summary", auth, async (req, res) => {
  try {
    if (req.user.role !== "admin") return res.status(403).send({ error: "Not authorized" });

    const total = await Ticket.countDocuments();
    const byStatus = await Ticket.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } }
    ]);
    const byDepartment = await Ticket.aggregate([
      { $group: { _id: "$department", count: { $sum: 1 } } }
    ]);

    res.send({ total, byStatus, byDepartment });
  } catch (err) {
    console.error("analytics err:", err);
    res.status(500).send({ error: "Server error" });
  }
});

module.exports = router;
