const mongoose = require("mongoose");

const TicketSchema = new mongoose.Schema(
  {
    ticketId: { type: String, unique: true }, // Auto Ticket Number
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: String,
    priority: String,
    department: String,
    aiResult: Object,
    status: { type: String, default: "open" }
  },
  { timestamps: true }
);

// Auto-generate Ticket Number
TicketSchema.pre("save", function (next) {
  if (!this.ticketId) {
    const date = new Date();
    const stamp =
      date.getFullYear().toString() +
      (date.getMonth() + 1).toString().padStart(2, "0") +
      date.getDate().toString().padStart(2, "0");

    this.ticketId = `TKT-${stamp}-${Math.floor(1000 + Math.random() * 9000)}`;
  }
  next();
});

module.exports = mongoose.model("Ticket", TicketSchema);
