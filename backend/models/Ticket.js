const mongoose = require("mongoose");

const TicketSchema = new mongoose.Schema({
  ticketNumber: { type: String, required: true, unique: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true },
  description: { type: String },
  category: { type: String, default: "General" },
  priority: { type: String, default: "medium" },
  department: { type: String, default: "Admin" },
  status: { type: String, enum: ["open","in_progress","resolved","closed"], default: "open" },
  aiResult: { type: Object, default: {} }
}, { timestamps: true });

module.exports = mongoose.model("Ticket", TicketSchema);
