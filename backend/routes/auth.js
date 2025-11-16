const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "supersecretjwt";

// register
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return res.status(400).send({ error: "Missing fields" });

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).send({ error: "User already exists" });

    // check if first user => admin
    const totalUsers = await User.countDocuments();
    const role = totalUsers === 0 ? "admin" : "user";

    const user = new User({ name, email, password, role });
    await user.save();

    const token = jwt.sign({ id: user._id, role: user.role, name: user.name }, JWT_SECRET, { expiresIn: "7d" });

    res.send({ token, name: user.name, role: user.role });
  } catch (err) {
    console.error("register err", err);
    res.status(500).send({ error: "Server error" });
  }
});

// login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const u = await User.findOne({ email });
    if (!u) return res.status(400).send({ error: "Invalid credentials" });

    const ok = await u.comparePassword(password);
    if (!ok) return res.status(400).send({ error: "Invalid credentials" });

    const token = jwt.sign({ id: u._id, role: u.role, name: u.name }, JWT_SECRET, { expiresIn: "7d" });
    res.send({ token, name: u.name, role: u.role });
  } catch (err) {
    console.error("login err", err);
    res.status(500).send({ error: "Server error" });
  }
});

module.exports = router;
